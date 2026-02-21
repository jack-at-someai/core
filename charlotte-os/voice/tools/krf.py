"""
Charlotte Voice Agent — KRF Parser & Query Tools
===================================================
Substrate reader: loads KRF files at startup, builds an in-memory
inverted index, and exposes three tools for Claude agents to query
the knowledge graph without reading raw files.

Components:
  1. Tokenizer + parser (escaped-quote-safe, line-tracking)
  2. Fact dataclass
  3. KRFIndex — six dict-based indices for O(1) primary lookup
  4. Tiered loader — auto-load core/knowledge, on-demand domains
  5. Three tool definitions: query_krf, list_microtheories, load_domain
"""

import asyncio
import logging
import re
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path

log = logging.getLogger("charlotte.tools.krf")

# ── Paths ────────────────────────────────────────────────────────────────

# charlotte-os/ is two levels up from voice/tools/
_CHARLOTTE_OS = Path(__file__).resolve().parent.parent.parent

# Type alias for parsed S-expressions
SExpr = str | list  # Atom or nested list


# ═══════════════════════════════════════════════════════════════════════════
# 1. TOKENIZER + PARSER
# ═══════════════════════════════════════════════════════════════════════════

def _strip_comment(line: str) -> str:
    """Remove ;; comments from a line, respecting quoted strings."""
    in_string = False
    i = 0
    while i < len(line):
        c = line[i]
        if c == '\\' and in_string:
            i += 2  # skip escaped char inside string
            continue
        if c == '"':
            in_string = not in_string
        elif not in_string and i + 1 < len(line) and line[i:i+2] == ";;":
            return line[:i]
        i += 1
    return line


def _count_parens(text: str, in_string: bool = False) -> tuple[int, bool]:
    """Count net parentheses (open - close) outside quoted strings.

    Handles escaped quotes inside strings. Returns (net, in_string).
    """
    net = 0
    i = 0
    while i < len(text):
        c = text[i]
        if c == '\\' and in_string:
            i += 2
            continue
        if c == '"':
            in_string = not in_string
        elif not in_string:
            if c == '(':
                net += 1
            elif c == ')':
                net -= 1
        i += 1
    return net, in_string


def read_sexps(text: str) -> list[tuple[str, int]]:
    """Parse text into complete S-expressions with line numbers.

    Returns list of (raw_sexp_string, start_line_number) tuples.
    Line numbers are 1-based.
    """
    results = []
    buf = ""
    depth = 0
    in_string = False
    start_line = 0

    for line_no, line in enumerate(text.splitlines(), 1):
        cleaned = _strip_comment(line.rstrip())
        stripped = cleaned.strip()
        if not stripped:
            continue

        if not buf:
            start_line = line_no
        buf += (" " if buf else "") + stripped

        net, in_string = _count_parens(cleaned, in_string)
        depth += net

        if depth <= 0 and not in_string and buf.strip():
            results.append((buf.strip(), start_line))
            buf = ""
            depth = 0
            in_string = False

    # Flush remainder (malformed — shouldn't happen in well-formed KRF)
    if buf.strip():
        results.append((buf.strip(), start_line))

    return results


def tokenize(sexp: str) -> SExpr:
    """Tokenize an S-expression string into a nested list structure.

    Handles escaped quotes inside strings (char-by-char scan).
    '(isa X "a \\"thing\\"")' -> ['isa', 'X', '"a \\"thing\\""']
    """
    tokens = []
    stack = [tokens]
    i = 0
    s = sexp.strip()
    n = len(s)

    while i < n:
        c = s[i]
        if c == '(':
            new = []
            stack[-1].append(new)
            stack.append(new)
            i += 1
        elif c == ')':
            if len(stack) > 1:
                stack.pop()
            i += 1
        elif c == '"':
            # Scan for closing quote, handling escapes
            j = i + 1
            while j < n:
                if s[j] == '\\':
                    j += 2  # skip escaped char
                    continue
                if s[j] == '"':
                    break
                j += 1
            stack[-1].append(s[i:j+1])
            i = j + 1
        elif c in (' ', '\t', '\n', '\r'):
            i += 1
        else:
            # Atom — read until whitespace or paren
            j = i
            while j < n and s[j] not in (' ', '\t', '\n', '\r', '(', ')'):
                j += 1
            stack[-1].append(s[i:j])
            i = j

    # Unwrap single top-level list
    if len(tokens) == 1 and isinstance(tokens[0], list):
        return tokens[0]
    return tokens


def _unquote(s: str) -> str:
    """Strip surrounding quotes and unescape interior."""
    if len(s) >= 2 and s[0] == '"' and s[-1] == '"':
        return s[1:-1].replace('\\"', '"').replace('\\\\', '\\')
    return s


# ═══════════════════════════════════════════════════════════════════════════
# 2. FACT DATACLASS
# ═══════════════════════════════════════════════════════════════════════════

@dataclass(slots=True)
class Fact:
    predicate: str          # "isa", "hasAttribute", "implies", etc.
    args: list              # Remaining arguments (SExpr items)
    microtheory: str        # Scoping context
    source_file: str        # Relative path from charlotte-os/
    line_hint: int          # Approximate line number
    raw: str                # Original S-expression text


def parse_krf(text: str, source_file: str) -> list[Fact]:
    """Parse KRF text into Fact objects.

    Tracks in-microtheory declarations to scope subsequent facts.
    Skips malformed S-expressions with a warning.
    """
    facts = []
    current_mt = "UnknownMt"

    for raw, line_no in read_sexps(text):
        try:
            parsed = tokenize(raw)
        except Exception as e:
            log.warning("Parse error in %s:%d — %s", source_file, line_no, e)
            continue

        if not parsed or not isinstance(parsed, list) or len(parsed) == 0:
            continue

        pred = parsed[0]
        if not isinstance(pred, str):
            continue

        # Track microtheory
        if pred == "in-microtheory" and len(parsed) >= 2:
            current_mt = parsed[1] if isinstance(parsed[1], str) else str(parsed[1])
            continue

        facts.append(Fact(
            predicate=pred,
            args=parsed[1:],
            microtheory=current_mt,
            source_file=source_file,
            line_hint=line_no,
            raw=raw,
        ))

    return facts


# ═══════════════════════════════════════════════════════════════════════════
# 3. KRF INDEX — IN-MEMORY INVERTED INDEX
# ═══════════════════════════════════════════════════════════════════════════

# Meta-predicates excluded from edge indexing
_META_PREDICATES = frozenset({
    "isa", "genls", "genlMt", "comment", "arity",
    "arg1Isa", "arg2Isa", "arg3Isa", "arg4Isa", "arg5Isa",
    "argNIsa", "disjointWith", "in-microtheory",
    "bootOrder", "bootLoads", "directivePriority",
    "mapsToKnowledgeType", "canTransition",
})


def _extract_entities(args: list) -> list[str]:
    """Extract entity names (strings that look like identifiers) from args."""
    entities = []
    for a in args:
        if isinstance(a, str) and not a.startswith("?") and not a.startswith('"'):
            entities.append(a)
        elif isinstance(a, list):
            entities.extend(_extract_entities(a))
    return entities


class KRFIndex:
    """In-memory inverted index over parsed KRF facts."""

    def __init__(self):
        # Primary indices
        self.by_entity: dict[str, list[Fact]] = defaultdict(list)
        self.by_predicate: dict[str, list[Fact]] = defaultdict(list)
        self.by_microtheory: dict[str, list[Fact]] = defaultdict(list)
        self.by_primitive: dict[str, set[str]] = defaultdict(set)  # NODE -> {entities}
        self.attributes: dict[str, dict[str, list[str]]] = defaultdict(lambda: defaultdict(list))
        self.edges_from: dict[str, list[tuple[str, list]]] = defaultdict(list)
        self.edges_to: dict[str, list[tuple[str, list]]] = defaultdict(list)

        # Derived caches (built after loading)
        self.isa_map: dict[str, set[str]] = defaultdict(set)     # entity -> {collections}
        self.genls_map: dict[str, set[str]] = defaultdict(set)   # sub -> {supers}
        self.entity_primitive: dict[str, str] = {}                # entity -> "NODE" etc.
        self.comments: dict[str, str] = {}                        # entity -> comment text

        # Load tracking
        self.loaded_tiers: set[str] = set()
        self.total_facts: int = 0
        self.total_files: int = 0

    def ingest(self, facts: list[Fact]):
        """Add facts to all indices."""
        for fact in facts:
            self.total_facts += 1
            pred = fact.predicate
            args = fact.args

            # by_predicate
            self.by_predicate[pred].append(fact)

            # by_microtheory
            self.by_microtheory[fact.microtheory].append(fact)

            # Extract all entity names for by_entity
            entities = _extract_entities(args)
            for e in entities:
                self.by_entity[e].append(fact)

            # Specific predicate handling
            if pred == "isa" and len(args) >= 2:
                subj = args[0] if isinstance(args[0], str) else None
                coll = args[1] if isinstance(args[1], str) else None
                if subj and coll:
                    self.isa_map[subj].add(coll)
                    self.by_entity[subj].append(fact)

            elif pred == "genls" and len(args) >= 2:
                sub = args[0] if isinstance(args[0], str) else None
                sup = args[1] if isinstance(args[1], str) else None
                if sub and sup:
                    self.genls_map[sub].add(sup)

            elif pred == "comment" and len(args) >= 2:
                subj = args[0] if isinstance(args[0], str) else None
                text = args[1] if isinstance(args[1], str) else None
                if subj and text:
                    self.comments[subj] = _unquote(text)

            elif pred == "hasAttribute" and len(args) >= 3:
                entity = args[0] if isinstance(args[0], str) else None
                attr = args[1] if isinstance(args[1], str) else None
                val = args[2] if isinstance(args[2], str) else str(args[2])
                if entity and attr:
                    self.attributes[entity][attr].append(_unquote(val))
                    self.by_entity[entity].append(fact)

            elif pred not in _META_PREDICATES and len(args) >= 2:
                # Non-meta predicate with 2+ args -> edge
                first = args[0] if isinstance(args[0], str) else None
                if first and not first.startswith("?"):
                    self.edges_from[first].append((pred, args))
                    # Index the target(s)
                    for a in args[1:]:
                        if isinstance(a, str) and not a.startswith("?") and not a.startswith('"'):
                            self.edges_to[a].append((pred, args))

    def build_derived_indices(self):
        """Build primitive type resolution after all facts loaded.

        Chases genls chains: if (genls X NODE) then all (isa Y X) -> Y is NODE.
        """
        primitives = {"NODE", "EDGE", "METRIC", "SIGNAL", "PROTOCOL"}

        # Build transitive genls closure
        # genls_closure[X] = all ancestors of X via genls
        genls_closure: dict[str, set[str]] = {}

        def _ancestors(coll: str) -> set[str]:
            if coll in genls_closure:
                return genls_closure[coll]
            result = set()
            genls_closure[coll] = result  # sentinel to break cycles
            for parent in self.genls_map.get(coll, set()):
                result.add(parent)
                result |= _ancestors(parent)
            genls_closure[coll] = result
            return result

        # Compute closure for all known collections
        for coll in list(self.genls_map.keys()):
            _ancestors(coll)

        # Which collections resolve to which primitive?
        coll_to_primitive: dict[str, str] = {}
        for coll in genls_closure:
            ancestors = genls_closure[coll] | {coll}
            for p in primitives:
                if p in ancestors:
                    coll_to_primitive[coll] = p
                    break

        # Also: direct primitives map to themselves
        for p in primitives:
            coll_to_primitive[p] = p

        # Now resolve entities: if (isa Entity SomeCollection) and
        # SomeCollection resolves to a primitive, then Entity -> primitive
        for entity, collections in self.isa_map.items():
            for coll in collections:
                if coll in coll_to_primitive:
                    prim = coll_to_primitive[coll]
                    self.entity_primitive[entity] = prim
                    self.by_primitive[prim].add(entity)
                    break

        log.info("Derived indices: %d entities with primitive types, %d genls closures",
                 len(self.entity_primitive), len(genls_closure))

    def search_entity(self, query: str) -> list[str]:
        """Find entities matching query. Exact first, then ranked fuzzy match."""
        # Exact match
        if query in self.by_entity:
            return [query]

        # Case-insensitive exact
        query_lower = query.lower()
        for e in self.by_entity:
            if e.lower() == query_lower:
                return [e]

        # Ranked fuzzy: collect all substring matches then sort by relevance
        query_norm = re.sub(r'[\s\-_]+', '', query_lower)
        if len(query_norm) < 3:
            return []  # Too short for fuzzy — avoid matching everything

        candidates = []  # (score, entity)
        for e in self.by_entity:
            if len(e) < 3:
                continue  # Skip tiny keys like "or", "an"
            e_norm = re.sub(r'[\s\-_]+', '', e.lower())
            if query_norm in e_norm:
                # Score: lower is better
                # - Exact norm match = 0
                # - Starts with query = 1
                # - Shorter names preferred (more likely the primary concept)
                if e_norm == query_norm:
                    score = 0
                elif e_norm.startswith(query_norm):
                    score = 1 + len(e_norm)
                else:
                    score = 100 + len(e_norm)
                candidates.append((score, e))

        candidates.sort(key=lambda x: x[0])
        return [e for _, e in candidates[:20]]


# ═══════════════════════════════════════════════════════════════════════════
# 4. TIERED LOADER
# ═══════════════════════════════════════════════════════════════════════════

# Global index + lock
_index: KRFIndex | None = None
_load_lock = asyncio.Lock()

# Tier definitions: tier_name -> (glob_patterns, auto_load)
_TIERS = {
    "core": {
        "patterns": ["kernel/*.krf", "agent/*.krf"],
        "auto": True,
    },
    "knowledge": {
        "patterns": ["knowledge/**/*.krf"],
        "auto": True,
    },
    "contacts": {
        "patterns": ["domains/*/contacts.krf", "domains/*/personnel/*.krf"],
        "auto": True,
    },
    "spine": {
        "patterns": ["spine/**/*.krf"],
        "auto": False,
    },
    "reference": {
        "patterns": ["reference/*.krf"],
        "auto": False,
    },
    "isg": {
        "patterns": ["domains/isg/**/*.krf"],
        "auto": False,
    },
    "someai": {
        "patterns": ["domains/someai/**/*.krf"],
        "auto": False,
    },
    "demos": {
        "patterns": ["demos/*.krf"],
        "auto": False,
    },
}


def _resolve_tier_files(tier_name: str) -> list[Path]:
    """Resolve glob patterns for a tier to actual file paths."""
    tier = _TIERS.get(tier_name)
    if not tier:
        return []
    files = []
    seen = set()
    for pattern in tier["patterns"]:
        for p in sorted(_CHARLOTTE_OS.glob(pattern)):
            if p.is_file() and p not in seen:
                seen.add(p)
                files.append(p)
    return files


def _load_tier_sync(tier_name: str) -> tuple[list[Fact], int]:
    """Load and parse all KRF files in a tier (sync, for asyncio.to_thread).

    Returns (facts, file_count).
    """
    files = _resolve_tier_files(tier_name)
    all_facts = []
    for path in files:
        rel = str(path.relative_to(_CHARLOTTE_OS)).replace("\\", "/")
        try:
            text = path.read_text(encoding="utf-8")
            facts = parse_krf(text, rel)
            all_facts.extend(facts)
        except Exception as e:
            log.warning("Error parsing %s: %s", rel, e)
    return all_facts, len(files)


async def init_krf_index():
    """Initialize the KRF index at server startup.

    Loads auto-load tiers (core, knowledge) in a background thread.
    """
    global _index
    _index = KRFIndex()

    auto_tiers = [name for name, cfg in _TIERS.items() if cfg["auto"]]
    log.info("KRF init: loading tiers %s from %s", auto_tiers, _CHARLOTTE_OS)

    for tier_name in auto_tiers:
        facts, file_count = await asyncio.to_thread(_load_tier_sync, tier_name)
        _index.ingest(facts)
        _index.total_files += file_count
        _index.loaded_tiers.add(tier_name)
        log.info("KRF tier '%s': %d files, %d facts", tier_name, file_count, len(facts))

    _index.build_derived_indices()

    log.info("KRF index ready: %d facts, %d files, %d entities, %d microtheories",
             _index.total_facts, _index.total_files,
             len(_index.by_entity), len(_index.by_microtheory))


async def load_domain(domain: str) -> str:
    """Load an on-demand tier into the index. Returns status message."""
    global _index
    if _index is None:
        return "Error: KRF index not initialized"

    if domain not in _TIERS:
        available = [n for n, c in _TIERS.items() if not c["auto"]]
        return f"Unknown domain '{domain}'. Available: {', '.join(available)}"

    if domain in _index.loaded_tiers:
        files = _resolve_tier_files(domain)
        return f"Domain '{domain}' already loaded ({len(files)} files)"

    async with _load_lock:
        # Double-check after acquiring lock
        if domain in _index.loaded_tiers:
            return f"Domain '{domain}' already loaded"

        facts, file_count = await asyncio.to_thread(_load_tier_sync, domain)
        _index.ingest(facts)
        _index.total_files += file_count
        _index.loaded_tiers.add(domain)
        _index.build_derived_indices()

    log.info("KRF domain '%s' loaded: %d files, %d facts", domain, file_count, len(facts))
    return f"Loaded '{domain}': {file_count} files, {len(facts)} facts. Total index: {_index.total_facts} facts."


# ═══════════════════════════════════════════════════════════════════════════
# 5. QUERY ENGINE
# ═══════════════════════════════════════════════════════════════════════════

def _format_entity_mini(entity: str, idx: KRFIndex) -> str:
    """Format a compact mini-profile for disambiguation results.

    Includes enough context (type, collections, key attributes, relationships)
    for Claude to answer without an additional round-trip.
    """
    lines = []
    primitive = idx.entity_primitive.get(entity, "?")
    collections = idx.isa_map.get(entity, set())
    comment = idx.comments.get(entity, "")

    header = f"  [{primitive}] {entity}"
    if collections:
        header += f" (isa: {', '.join(sorted(collections)[:3])})"
    lines.append(header)
    if comment:
        lines.append(f"    {comment[:120]}")

    # Key attributes (up to 8)
    attrs = idx.attributes.get(entity, {})
    shown = 0
    for k, vals in sorted(attrs.items()):
        for v in vals:
            lines.append(f"    {k}: {v}")
            shown += 1
            if shown >= 8:
                break
        if shown >= 8:
            remaining = sum(len(v) for v in attrs.values()) - shown
            if remaining > 0:
                lines.append(f"    ... ({remaining} more attributes)")
            break

    # Key relationships (up to 5)
    edges = idx.edges_from.get(entity, [])
    if edges:
        for pred, args in edges[:5]:
            targets = [a for a in args[1:] if isinstance(a, str) and not a.startswith("?")]
            if targets:
                lines.append(f"    {pred} -> {', '.join(targets)}")
        if len(edges) > 5:
            lines.append(f"    ... ({len(edges) - 5} more relationships)")

    return "\n".join(lines)


def _format_entity_profile(entity: str, idx: KRFIndex, attr_filter: str | None = None,
                           limit: int = 50) -> str:
    """Format a structured entity profile."""
    lines = []

    # Identity
    collections = idx.isa_map.get(entity, set())
    primitive = idx.entity_primitive.get(entity, "?")
    comment = idx.comments.get(entity, "")

    lines.append(f"=== {entity} ===")
    if comment:
        lines.append(f"  {comment}")
    lines.append(f"  Type: {primitive}")
    if collections:
        lines.append(f"  Collections: {', '.join(sorted(collections))}")

    # Attributes
    attrs = idx.attributes.get(entity, {})
    if attrs:
        if attr_filter:
            # Filter to specific attribute
            matching = {}
            attr_lower = attr_filter.lower()
            for k, v in attrs.items():
                if attr_lower in k.lower():
                    matching[k] = v
            if matching:
                lines.append("  Attributes:")
                for k, vals in sorted(matching.items()):
                    for v in vals:
                        lines.append(f"    {k}: {v}")
            else:
                lines.append(f"  No attribute matching '{attr_filter}'")
        else:
            lines.append("  Attributes:")
            count = 0
            for k, vals in sorted(attrs.items()):
                for v in vals:
                    lines.append(f"    {k}: {v}")
                    count += 1
                    if count >= limit:
                        lines.append(f"    ... (truncated at {limit})")
                        break
                if count >= limit:
                    break

    # Relationships (edges from)
    edges = idx.edges_from.get(entity, [])
    if edges:
        lines.append("  Relationships (outgoing):")
        shown = 0
        for pred, args in edges:
            targets = [a for a in args[1:] if isinstance(a, str) and not a.startswith("?")]
            if targets:
                lines.append(f"    {pred} -> {', '.join(targets)}")
            else:
                lines.append(f"    {pred} {' '.join(str(a) for a in args[1:])}")
            shown += 1
            if shown >= limit:
                lines.append(f"    ... (truncated at {limit})")
                break

    # Relationships (edges to)
    edges_in = idx.edges_to.get(entity, [])
    if edges_in:
        lines.append("  Relationships (incoming):")
        shown = 0
        for pred, args in edges_in:
            source = args[0] if len(args) > 0 and isinstance(args[0], str) else "?"
            lines.append(f"    {source} -> {pred}")
            shown += 1
            if shown >= limit:
                lines.append(f"    ... (truncated at {limit})")
                break

    # Source context
    facts = idx.by_entity.get(entity, [])
    if facts:
        sources = set(f.source_file for f in facts)
        lines.append(f"  Sources: {', '.join(sorted(sources))}")
        lines.append(f"  Total facts: {len(facts)}")

    return "\n".join(lines)


def _format_primitive_listing(primitive: str, idx: KRFIndex, limit: int = 50) -> str:
    """Format a compact listing of entities of a given primitive type."""
    entities = idx.by_primitive.get(primitive, set())
    if not entities:
        return f"No entities of type {primitive} found. Try loading a domain first (load_domain tool)."

    lines = [f"=== {primitive} entities ({len(entities)} total) ==="]
    sorted_entities = sorted(entities)

    for e in sorted_entities[:limit]:
        label = ""
        attrs = idx.attributes.get(e, {})
        for key in ("::LABEL", "::TITLE_SHORT", "::ROLE"):
            if key in attrs:
                label = attrs[key][0]
                break
        comment = idx.comments.get(e, "")
        desc = label or (comment[:60] + "..." if len(comment) > 60 else comment)
        if desc:
            lines.append(f"  {e} — {desc}")
        else:
            lines.append(f"  {e}")

    if len(entities) > limit:
        lines.append(f"  ... ({len(entities) - limit} more)")

    return "\n".join(lines)


def _format_fact_list(facts: list[Fact], label: str, limit: int = 50) -> str:
    """Format a generic list of facts."""
    lines = [f"=== {label} ({len(facts)} facts) ==="]
    for f in facts[:limit]:
        # Compact representation
        args_str = " ".join(
            _unquote(a) if isinstance(a, str) else str(a)
            for a in f.args[:4]
        )
        lines.append(f"  ({f.predicate} {args_str})")
        lines.append(f"    [{f.source_file}:{f.line_hint}]")

    if len(facts) > limit:
        lines.append(f"  ... ({len(facts) - limit} more)")

    return "\n".join(lines)


def _resolve_predicate(predicate: str, idx: KRFIndex) -> tuple[str, list[Fact]]:
    """Resolve a predicate name (case-insensitive) to its facts."""
    facts = idx.by_predicate.get(predicate, [])
    if facts:
        return predicate, facts
    for p, f_list in idx.by_predicate.items():
        if p.lower() == predicate.lower():
            return p, f_list
    return predicate, []


def _resolve_microtheory(microtheory: str, idx: KRFIndex) -> tuple[str, list[Fact]]:
    """Resolve a microtheory name (case-insensitive) to its facts."""
    facts = idx.by_microtheory.get(microtheory, [])
    if facts:
        return microtheory, facts
    for mt, f_list in idx.by_microtheory.items():
        if mt.lower() == microtheory.lower():
            return mt, f_list
    return microtheory, []


def _query(entity: str | None = None, predicate: str | None = None,
           microtheory: str | None = None, primitive: str | None = None,
           attribute: str | None = None, limit: int = 50) -> str:
    """Execute a query against the KRF index. Returns formatted text.

    Filters are intersected: if both predicate and microtheory are given,
    only facts matching BOTH are returned.
    """
    if _index is None:
        return "Error: KRF index not initialized. Server may still be starting."

    idx = _index

    # Entity query — structured profile (takes priority)
    if entity:
        matches = idx.search_entity(entity)
        if not matches:
            unloaded = [n for n in _TIERS if n not in idx.loaded_tiers and not _TIERS[n]["auto"]]
            hint = ""
            if unloaded:
                hint = f"\nTip: try loading a domain first: {', '.join(unloaded)}"
            return f"No entity matching '{entity}' found.{hint}"

        if len(matches) == 1:
            return _format_entity_profile(matches[0], idx, attr_filter=attribute, limit=limit)

        # Multiple matches — show mini-profiles for top 5, then list rest
        lines = [f"Multiple matches for '{entity}' ({len(matches)}). Top results:"]
        for i, m in enumerate(matches[:5]):
            lines.append("")
            lines.append(_format_entity_mini(m, idx))
        if len(matches) > 5:
            lines.append(f"\n--- {len(matches) - 5} more: " +
                         ", ".join(matches[5:15]) +
                         (" ..." if len(matches) > 15 else ""))
        return "\n".join(lines)

    # Primitive query — compact listing
    if primitive:
        prim_upper = primitive.upper()
        if prim_upper not in ("NODE", "EDGE", "METRIC", "SIGNAL", "PROTOCOL"):
            return f"Invalid primitive '{primitive}'. Must be one of: NODE, EDGE, METRIC, SIGNAL, PROTOCOL"
        return _format_primitive_listing(prim_upper, idx, limit=limit)

    # ── Combined filter queries (predicate, microtheory, attribute intersect) ──

    # Start with the broadest set, then narrow
    facts = None
    label_parts = []

    if microtheory:
        mt_name, mt_facts = _resolve_microtheory(microtheory, idx)
        if not mt_facts:
            return f"No facts in microtheory '{microtheory}'. Use list_microtheories to see available scopes."
        facts = mt_facts
        label_parts.append(f"mt:{mt_name}")

    if predicate:
        pred_name, pred_facts = _resolve_predicate(predicate, idx)
        if not pred_facts:
            return f"No facts with predicate '{predicate}' found."
        if facts is not None:
            # Intersect: keep only facts that match both
            pred_set = set(id(f) for f in pred_facts)
            facts = [f for f in facts if id(f) in pred_set]
        else:
            facts = pred_facts
        label_parts.append(f"pred:{pred_name}")

    if attribute:
        attr_lower = attribute.lower()
        if facts is not None:
            # Filter existing facts to those with matching attribute
            facts = [f for f in facts if f.predicate == "hasAttribute"
                     and len(f.args) >= 2 and isinstance(f.args[1], str)
                     and attr_lower in f.args[1].lower()]
        else:
            # Attribute-only query across all entities
            lines = [f"=== Entities with attribute matching '{attribute}' ==="]
            count = 0
            for ent, attrs in idx.attributes.items():
                for k, vals in attrs.items():
                    if attr_lower in k.lower():
                        for v in vals:
                            lines.append(f"  {ent} {k}: {v}")
                            count += 1
                            if count >= limit:
                                break
                    if count >= limit:
                        break
                if count >= limit:
                    lines.append(f"  ... (truncated at {limit})")
                    break
            if count == 0:
                return f"No attributes matching '{attribute}' found."
            return "\n".join(lines)
        label_parts.append(f"attr:{attribute}")

    if facts is not None:
        if not facts:
            return f"No facts matching {' + '.join(label_parts)}."
        label = " + ".join(label_parts)
        return _format_fact_list(facts, label, limit=limit)

    return "Please provide at least one query parameter: entity, predicate, microtheory, primitive, or attribute."


def _list_microtheories() -> str:
    """List all known microtheories with fact counts."""
    if _index is None:
        return "Error: KRF index not initialized."

    idx = _index
    lines = ["=== Microtheories ==="]

    mts = sorted(idx.by_microtheory.items(), key=lambda x: -len(x[1]))
    for mt, facts in mts:
        lines.append(f"  {mt}: {len(facts)} facts")

    lines.append("")
    lines.append(f"Loaded tiers: {', '.join(sorted(idx.loaded_tiers))}")
    available = [n for n in _TIERS if n not in idx.loaded_tiers and not _TIERS[n]["auto"]]
    if available:
        lines.append(f"Available (not loaded): {', '.join(available)}")
    lines.append(f"Total: {idx.total_facts} facts across {idx.total_files} files")

    return "\n".join(lines)


# ═══════════════════════════════════════════════════════════════════════════
# 6. TOOL DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════════

TOOLS = [
    {
        "name": "query_krf",
        "description": (
            "Query Charlotte's knowledge graph (KRF substrate). "
            "Returns structured entity profiles, primitive type listings, or fact lists. "
            "Use for looking up people, products, relationships, attributes, and domain facts "
            "without reading raw KRF files. Provide at least one parameter."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "entity": {
                    "type": "string",
                    "description": "Entity name to look up (fuzzy matching: 'Jim Richard' finds JimRichard)",
                },
                "predicate": {
                    "type": "string",
                    "description": "Filter by predicate name (e.g. 'isa', 'hasAttribute', 'reportsTo', 'soldByBrand')",
                },
                "microtheory": {
                    "type": "string",
                    "description": "Filter by microtheory scope (e.g. 'ISGPersonnelMt', 'CharlotteKernelMt')",
                },
                "primitive": {
                    "type": "string",
                    "description": "List entities of a primitive type",
                    "enum": ["NODE", "EDGE", "METRIC", "SIGNAL", "PROTOCOL"],
                },
                "attribute": {
                    "type": "string",
                    "description": "Filter by attribute name (e.g. '::EMAIL', '::PHONE', '::ROLE')",
                },
                "limit": {
                    "type": "integer",
                    "description": "Max results (default 50, max 200)",
                },
            },
        },
    },
    {
        "name": "list_microtheories",
        "description": "List all available microtheory scopes in the knowledge graph with fact counts and loaded/available domains.",
        "input_schema": {
            "type": "object",
            "properties": {},
        },
    },
    {
        "name": "load_domain",
        "description": (
            "Load additional KRF knowledge into the index on demand. "
            "Core and knowledge tiers load automatically at startup. "
            "Use this to load domain-specific data (ISG products, spine, reference, etc.) "
            "when a query needs it."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "domain": {
                    "type": "string",
                    "description": "Domain to load",
                    "enum": ["isg", "spine", "reference", "someai", "demos"],
                },
            },
            "required": ["domain"],
        },
    },
]


async def handle(name: str, args: dict) -> str:
    """Execute a KRF query tool."""
    if name == "query_krf":
        entity = args.get("entity")
        predicate = args.get("predicate")
        microtheory = args.get("microtheory")
        primitive = args.get("primitive")
        attribute = args.get("attribute")
        limit = min(args.get("limit", 50), 200)

        if not any([entity, predicate, microtheory, primitive, attribute]):
            return "Please provide at least one query parameter: entity, predicate, microtheory, primitive, or attribute."

        return _query(
            entity=entity, predicate=predicate, microtheory=microtheory,
            primitive=primitive, attribute=attribute, limit=limit,
        )

    elif name == "list_microtheories":
        return _list_microtheories()

    elif name == "load_domain":
        domain = args["domain"]
        return await load_domain(domain)

    return f"Unknown tool: {name}"
