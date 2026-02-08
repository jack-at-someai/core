// Spatial Computing Reference Hub — app.js
// Maps to Charlotte Paper 6: Spatial Perception

const SECTIONS = [
  {
    id: "overview",
    icon: "\u25C7",
    label: "Overview",
    intro: `
      <p><strong>Spatial computing</strong> is the discipline of representing, indexing, querying, and reasoning over
      geographic and geometric data. It underpins every system that needs to answer <em>"where?"</em> &mdash; from
      navigation and logistics to climate modeling and augmented reality.</p>

      <h3>Why This Matters for Charlotte's Spatial Substrate</h3>
      <p>Charlotte Paper 6 (<em>Spatial Perception</em>) requires a pre-built spatial substrate: every country, state,
      city, latitude/longitude tuple, and administrative boundary must be encoded in a way that supports fast lookups,
      hierarchical containment queries, and distance computations. That substrate draws directly on the foundations
      collected here:</p>
      <ul>
        <li><strong>Coordinate Reference Systems</strong> &mdash; WGS84, UTM zones, EPSG codes for unambiguous positioning</li>
        <li><strong>Spatial Indexing</strong> &mdash; H3, S2, Geohash, R-trees for O(log n) spatial queries</li>
        <li><strong>Spatial Databases</strong> &mdash; PostGIS / SpatiaLite for persistent, queryable geometry storage</li>
        <li><strong>Boundary Datasets</strong> &mdash; Natural Earth, GADM, OpenStreetMap for real-world geometries</li>
        <li><strong>Geospatial Algorithms</strong> &mdash; point-in-polygon, nearest neighbor, spatial joins</li>
      </ul>
      <p>This reference hub collects the best books, courses, tools, papers, and datasets so you can build or extend
      that spatial substrate with confidence.</p>
    `,
    subsections: [
      {
        title: "Foundational Texts",
        items: [
          { title: "Geographic Information Systems and Science", author: "Longley, Goodchild, Maguire & Rhind", type: "book", level: "beginner", url: "https://www.wiley.com/en-us/Geographic+Information+Systems+and+Science-p-9781119031307", desc: "The canonical GIS textbook covering spatial data models, analysis, and applications across four editions." },
          { title: "GIS Fundamentals (6th ed.)", author: "Paul Bolstad", type: "book", level: "beginner", url: "https://www.paulbolstad.net/gisbook.html", desc: "Practical introduction to GIS concepts, projections, GPS, remote sensing, and spatial analysis with exercises." },
          { title: "Spatial Databases: With Application to GIS", author: "Philippe Rigaux, Michel Scholl & Agnes Voisard", type: "book", level: "intermediate", url: "https://www.elsevier.com/books/spatial-databases/rigaux/978-1-55860-588-6", desc: "Theoretical foundations of spatial data management: spatial data types, query languages, indexing, and optimization." },
          { title: "Computational Geometry: Algorithms and Applications", author: "Mark de Berg, Otfried Cheong, Marc van Kreveld & Mark Overmars", type: "book", level: "intermediate", url: "https://link.springer.com/book/10.1007/978-3-540-77974-2", desc: "Definitive textbook on geometric algorithms: convex hulls, Voronoi diagrams, Delaunay triangulation, range searching." }
        ]
      },
      {
        title: "Introductory Courses & Overviews",
        items: [
          { title: "Introduction to GIS (Penn State GEOG 485)", author: "Penn State University", type: "course", level: "beginner", url: "https://www.e-education.psu.edu/geog485/", desc: "Free online course covering GIS fundamentals, spatial data, coordinate systems, and basic analysis with ArcGIS/QGIS." },
          { title: "Spatial Data Science (Luc Anselin)", author: "University of Chicago / GeoDa Center", type: "course", level: "intermediate", url: "https://spatial.uchicago.edu/content/spatial-data-science", desc: "Open course on spatial data science concepts: spatial autocorrelation, clustering, spatial regression." },
          { title: "Geocomputation with R", author: "Robin Lovelace, Jakub Nowosad & Jannes Muenchow", type: "book", level: "beginner", url: "https://r.geocompx.org/", desc: "Free online book covering geographic data in R using sf, terra, and tmap. Practical approach to spatial analysis." },
          { title: "Automating GIS Processes (University of Helsinki)", author: "Henrikki Tenkanen & Vuokko Heikinheimo", type: "course", level: "beginner", url: "https://autogis-site.readthedocs.io/", desc: "Python-based open course on automating GIS workflows with GeoPandas, Shapely, and Fiona." },
          { title: "The Nature of Geographic Information", author: "David DiBiase (Penn State)", type: "course", level: "beginner", url: "https://www.e-education.psu.edu/natureofgeoinfo/", desc: "Comprehensive free online textbook on geographic information concepts, coordinate systems, and map design." }
        ]
      }
    ]
  },
  {
    id: "gis",
    icon: "\u2295",
    label: "GIS Fundamentals",
    intro: `
      <p><strong>Geographic Information Systems (GIS)</strong> form the operational backbone of spatial computing.
      A GIS integrates hardware, software, and data for capturing, managing, analyzing, and displaying all forms
      of geographically referenced information.</p>

      <h3>Core Concepts</h3>
      <ul>
        <li><strong>Vector vs. Raster</strong> &mdash; Points/lines/polygons vs. grids of cells; each model suits different analysis types</li>
        <li><strong>Coordinate Reference Systems</strong> &mdash; Geographic (lat/lon) vs. projected (meters); EPSG registry standardizes them</li>
        <li><strong>Map Projections</strong> &mdash; Every flat map distorts the globe; choosing the right projection depends on what you preserve (area, shape, distance)</li>
        <li><strong>Spatial Analysis</strong> &mdash; Overlay, buffer, intersection, union, dissolve &mdash; the verbs of spatial reasoning</li>
        <li><strong>Geostatistics</strong> &mdash; Kriging, IDW, spatial autocorrelation (Moran's I, LISA)</li>
      </ul>
      <p>These resources span from introductory textbooks to advanced analytical methods.</p>
    `,
    subsections: [
      {
        title: "Textbooks & References",
        items: [
          { title: "Geographic Information Systems and Science (4th ed.)", author: "Longley, Goodchild, Maguire & Rhind", type: "book", level: "beginner", url: "https://www.wiley.com/en-us/Geographic+Information+Systems+and+Science-p-9781119031307", desc: "Comprehensive GIS textbook covering data models, spatial analysis, uncertainty, and GIS design. The standard reference." },
          { title: "GIS Fundamentals: A First Text on GIS (6th ed.)", author: "Paul Bolstad", type: "book", level: "beginner", url: "https://www.paulbolstad.net/gisbook.html", desc: "Hands-on introduction with clear explanations of projections, GPS, data quality, spatial analysis, and raster operations." },
          { title: "Geographic Information Analysis (2nd ed.)", author: "David O'Sullivan & David Unwin", type: "book", level: "intermediate", url: "https://www.wiley.com/en-us/Geographic+Information+Analysis-p-9780470288573", desc: "Focuses on spatial analysis methods: point pattern analysis, area objects, fields, and spatial autocorrelation." },
          { title: "Principles of Geographical Information Systems", author: "Peter Burrough, Rachael McDonnell & Christopher Lloyd", type: "book", level: "intermediate", url: "https://global.oup.com/academic/product/principles-of-geographical-information-systems-9780198742845", desc: "Covers the principles behind GIS technology: data models, spatial referencing, error propagation, and terrain analysis." }
        ]
      },
      {
        title: "Software & Tutorials",
        items: [
          { title: "QGIS Documentation & Tutorials", author: "QGIS Project", type: "notes", level: "beginner", url: "https://docs.qgis.org/", desc: "Official documentation for the leading open-source GIS. Includes training manual, user guide, and PyQGIS cookbook." },
          { title: "QGIS Sketsketches (YouTube)", author: "Sketsketches", type: "video", level: "beginner", url: "https://www.youtube.com/c/sketsketches", desc: "Practical QGIS video tutorials covering data loading, styling, analysis, plugins, and Python scripting." },
          { title: "Geocomputation with R", author: "Robin Lovelace, Jakub Nowosad & Jannes Muenchow", type: "book", level: "beginner", url: "https://r.geocompx.org/", desc: "Free online book on geographic data manipulation, visualization, and modeling in R using sf and terra packages." },
          { title: "Geocomputation with Python", author: "Michael Dorman, Jakub Nowosad & Robin Lovelace", type: "book", level: "beginner", url: "https://py.geocompx.org/", desc: "Companion to the R book, covering spatial analysis in Python with GeoPandas, Rasterio, and Shapely." },
          { title: "Introduction to GIS Programming (GEOG 489)", author: "Penn State University", type: "course", level: "intermediate", url: "https://www.e-education.psu.edu/geog489/", desc: "Advanced GIS programming with Python: arcpy, spatial databases, web mapping, and geoprocessing automation." }
        ]
      },
      {
        title: "Spatial Analysis Methods",
        items: [
          { title: "Applied Spatial Data Analysis with R (2nd ed.)", author: "Roger Bivand, Edzer Pebesma & Virgilio Gomez-Rubio", type: "book", level: "advanced", url: "https://link.springer.com/book/10.1007/978-1-4614-7618-4", desc: "Spatial data handling, visualization, geostatistics, and spatial regression in R. The reference for spatial statistics." },
          { title: "An Introduction to R for Spatial Analysis and Mapping", author: "Chris Brunsdon & Lex Comber", type: "book", level: "intermediate", url: "https://uk.sagepub.com/en-gb/eur/an-introduction-to-r-for-spatial-analysis-and-mapping/book258267", desc: "Practical guide to spatial analysis in R covering mapping, point patterns, geostatistics, and spatial regression." },
          { title: "Spatial Statistics & Geostatistics (SAGE)", author: "Yongwan Chun & Daniel Griffith", type: "book", level: "advanced", url: "https://us.sagepub.com/en-us/nam/spatial-statistics-and-geostatistics/book257013", desc: "Theory and applications of spatial statistics: variograms, kriging, spatial filtering, and eigenvector methods." }
        ]
      }
    ]
  },
  {
    id: "databases",
    icon: "\u2B21",
    label: "Spatial Databases",
    intro: `
      <p><strong>Spatial databases</strong> extend relational (or NoSQL) databases with geometry types, spatial indexes,
      and spatial query operators. They are the persistence layer for any spatial substrate.</p>

      <h3>Key Technologies</h3>
      <ul>
        <li><strong>PostGIS</strong> &mdash; PostgreSQL extension; the gold standard for spatial SQL with ST_* functions, R-tree/GiST indexes</li>
        <li><strong>SpatiaLite</strong> &mdash; SQLite extension for lightweight embedded spatial queries</li>
        <li><strong>MongoDB Geospatial</strong> &mdash; 2dsphere indexes, $geoWithin, $near operators on GeoJSON</li>
        <li><strong>Spatial Indexing</strong> &mdash; R-tree, R*-tree, quad-tree structures for efficient bounding-box and nearest-neighbor queries</li>
        <li><strong>OGC Standards</strong> &mdash; Simple Features (ISO 19125), WKT/WKB geometry encoding, spatial reference IDs (SRIDs)</li>
      </ul>
    `,
    subsections: [
      {
        title: "PostGIS",
        items: [
          { title: "PostGIS in Action (3rd ed.)", author: "Regina Obe & Leo Hsu", type: "book", level: "intermediate", url: "https://www.manning.com/books/postgis-in-action-third-edition", desc: "The definitive PostGIS book: geometry/geography types, spatial indexing, raster, topology, routing, and 3D." },
          { title: "PostGIS Official Documentation", author: "PostGIS Project", type: "notes", level: "beginner", url: "https://postgis.net/documentation/", desc: "Comprehensive reference for all ST_* functions, spatial indexing, raster support, and configuration." },
          { title: "Introduction to PostGIS (Workshop)", author: "Boundless / Crunchy Data", type: "course", level: "beginner", url: "https://postgis.net/workshops/postgis-intro/", desc: "Free hands-on workshop: loading spatial data, spatial queries, joins, indexing, and projections in PostGIS." },
          { title: "PostGIS Cookbook (2nd ed.)", author: "Paolo Corti, Thomas Kraft, Stephen Mather & Bborie Park", type: "book", level: "intermediate", url: "https://www.packtpub.com/product/postgis-cookbook/9781788299442", desc: "Recipe-style guide covering importing data, spatial queries, raster analysis, routing, and web integration." }
        ]
      },
      {
        title: "Other Spatial Databases",
        items: [
          { title: "SpatiaLite Cookbook", author: "SpatiaLite Project", type: "notes", level: "beginner", url: "https://www.gaia-gis.it/fossil/libspatialite/wiki?name=SpatiaLite+Cookbook", desc: "Tutorial-style guide to SpatiaLite: loading shapefiles, spatial queries, and analysis in an embedded database." },
          { title: "MongoDB Geospatial Queries", author: "MongoDB Documentation", type: "notes", level: "beginner", url: "https://www.mongodb.com/docs/manual/geospatial-queries/", desc: "Official guide to MongoDB's 2dsphere and 2d indexes, GeoJSON support, and $geoWithin/$near operators." },
          { title: "DuckDB Spatial Extension", author: "DuckDB Foundation", type: "code", level: "intermediate", url: "https://duckdb.org/docs/extensions/spatial.html", desc: "Analytical spatial queries in DuckDB: read Shapefiles/GeoJSON/GeoParquet, perform spatial joins at columnar speed." },
          { title: "Apache Sedona (GeoSpark)", author: "Apache Software Foundation", type: "code", level: "advanced", url: "https://sedona.apache.org/", desc: "Cluster-computing system for processing large-scale spatial data on Spark and Flink with spatial SQL support." }
        ]
      },
      {
        title: "Spatial Indexing Theory",
        items: [
          { title: "The R-tree: An Efficient and Robust Access Method", author: "Antonin Guttman (1984)", type: "notes", level: "intermediate", url: "https://dl.acm.org/doi/10.1145/602259.602266", desc: "The foundational R-tree paper describing the balanced tree structure for spatial data with minimum bounding rectangles." },
          { title: "The R*-tree: An Efficient and Robust Access Method for Points and Rectangles", author: "Beckmann, Kriegel, Schneider & Seeger (1990)", type: "notes", level: "advanced", url: "https://dl.acm.org/doi/10.1145/93597.98741", desc: "Improved R-tree variant with better split and reinsertion heuristics, reducing overlap and improving query performance." },
          { title: "Spatial Indexing with Quadtrees and Hilbert Curves", author: "Various / GeeksforGeeks", type: "notes", level: "intermediate", url: "https://www.geeksforgeeks.org/quad-tree/", desc: "Introduction to quadtree decomposition and space-filling curves for spatial indexing and range queries." }
        ]
      }
    ]
  },
  {
    id: "algorithms",
    icon: "\u27C1",
    label: "Algorithms",
    intro: `
      <p><strong>Geospatial algorithms</strong> are the computational primitives that power spatial queries and analysis.
      From determining whether a point lies inside a polygon to computing Voronoi tessellations, these algorithms
      form the engine beneath every spatial operation.</p>

      <h3>Essential Algorithms</h3>
      <ul>
        <li><strong>Point-in-Polygon</strong> &mdash; Ray casting, winding number; O(n) per query, O(log n) with preprocessing</li>
        <li><strong>Nearest Neighbor</strong> &mdash; k-d trees, ball trees, R-trees for spatial proximity search</li>
        <li><strong>Voronoi Diagrams</strong> &mdash; Partition space by nearest site; dual of Delaunay triangulation</li>
        <li><strong>Delaunay Triangulation</strong> &mdash; Maximizes minimum angle; foundation for terrain models (TINs)</li>
        <li><strong>Convex Hull</strong> &mdash; Graham scan, gift wrapping, QuickHull; the tightest enclosing polygon</li>
        <li><strong>Spatial Joins</strong> &mdash; Intersects, contains, within; often R-tree accelerated</li>
        <li><strong>Line Simplification</strong> &mdash; Douglas-Peucker, Visvalingam-Whyatt for cartographic generalization</li>
      </ul>
    `,
    subsections: [
      {
        title: "Core Textbooks",
        items: [
          { title: "Computational Geometry: Algorithms and Applications (3rd ed.)", author: "de Berg, Cheong, van Kreveld & Overmars", type: "book", level: "intermediate", url: "https://link.springer.com/book/10.1007/978-3-540-77974-2", desc: "The standard textbook: convex hulls, line segment intersection, polygon triangulation, Voronoi, Delaunay, range trees." },
          { title: "Computational Geometry in C (2nd ed.)", author: "Joseph O'Rourke", type: "book", level: "intermediate", url: "https://cs.smith.edu/~jorourke/books/compgeom.html", desc: "Practical approach with C implementations: polygon operations, convex hulls, Voronoi, motion planning." },
          { title: "Geometric Tools for Computer Graphics", author: "Philip Schneider & David Eberly", type: "book", level: "advanced", url: "https://www.geometrictools.com/", desc: "Exhaustive reference: intersection tests, distance queries, containment, curves, surfaces. Companion code library." },
          { title: "Algorithms in a Nutshell (Ch. Computational Geometry)", author: "George Heineman, Gary Pollice & Stanley Selkow", type: "book", level: "beginner", url: "https://www.oreilly.com/library/view/algorithms-in-a/9780596516246/", desc: "Accessible introduction to convex hull, line sweep, nearest neighbor, and Voronoi algorithms with code." }
        ]
      },
      {
        title: "Specific Algorithms & Implementations",
        items: [
          { title: "Point-in-Polygon (Ray Casting Algorithm)", author: "W. Randolph Franklin", type: "notes", level: "beginner", url: "https://wrfranklin.org/Research/Short_Notes/pnpoly.html", desc: "Classic short C implementation of the ray casting point-in-polygon test. Simple, robust, widely cited." },
          { title: "Fortune's Algorithm for Voronoi Diagrams", author: "Steven Fortune (1987)", type: "notes", level: "advanced", url: "https://dl.acm.org/doi/10.1007/BF01840357", desc: "O(n log n) sweep-line algorithm for computing Voronoi diagrams. The standard efficient approach." },
          { title: "Robust Predicates for Computational Geometry", author: "Jonathan Shewchuk", type: "notes", level: "advanced", url: "https://www.cs.cmu.edu/~quake/robust.html", desc: "Exact arithmetic predicates (orient2d, incircle) that prevent floating-point errors in geometric computation." },
          { title: "CGAL: Computational Geometry Algorithms Library", author: "CGAL Project", type: "code", level: "intermediate", url: "https://www.cgal.org/", desc: "C++ library implementing robust, efficient geometric algorithms: triangulations, Voronoi, hulls, mesh generation." },
          { title: "Shapely (Python)", author: "Sean Gillies / Toblerity", type: "code", level: "beginner", url: "https://shapely.readthedocs.io/", desc: "Python library for manipulation and analysis of planar geometric objects. Wraps GEOS for point-in-polygon, buffers, intersections." },
          { title: "Turf.js: Advanced Geospatial Analysis", author: "Mapbox", type: "code", level: "beginner", url: "https://turfjs.org/", desc: "JavaScript library for spatial operations in the browser: buffer, union, Voronoi, tin, nearest, boolean operations." },
          { title: "JTS Topology Suite", author: "Martin Davis / LocationTech", type: "code", level: "intermediate", url: "https://locationtech.github.io/jts/", desc: "Java library for 2D geometry operations. The upstream of GEOS (C++) which powers PostGIS and Shapely." },
          { title: "S2 Geometry Library", author: "Google", type: "code", level: "advanced", url: "https://s2geometry.io/", desc: "Spherical geometry library using Hilbert curve cell decomposition. Exact predicates on the sphere; used by BigQuery GIS." }
        ]
      }
    ]
  },
  {
    id: "coordinates",
    icon: "\u229E",
    label: "Coordinates",
    intro: `
      <p><strong>Coordinate systems</strong> are the mathematical frameworks that assign numeric addresses to locations
      on Earth. Getting coordinates wrong can shift features by hundreds of meters or more &mdash; a critical concern
      for any spatial substrate.</p>

      <h3>Key Concepts</h3>
      <ul>
        <li><strong>Datum</strong> &mdash; A reference model for Earth's shape (WGS84, NAD83, ETRS89)</li>
        <li><strong>Geographic CRS</strong> &mdash; Latitude/longitude on an ellipsoid (EPSG:4326 = WGS84)</li>
        <li><strong>Projected CRS</strong> &mdash; Flat Cartesian coordinates in meters/feet (UTM zones, State Plane)</li>
        <li><strong>EPSG Registry</strong> &mdash; Standardized numeric codes for every CRS (maintained by IOGP)</li>
        <li><strong>Datum Transformations</strong> &mdash; Converting between reference frames (Helmert, grid shift NTv2)</li>
        <li><strong>Map Projections</strong> &mdash; Mercator (conformal), Albers (equal-area), Lambert, UTM, Web Mercator (EPSG:3857)</li>
      </ul>
    `,
    subsections: [
      {
        title: "Textbooks & References",
        items: [
          { title: "Map Projections: A Working Manual (USGS PP 1395)", author: "John P. Snyder", type: "book", level: "intermediate", url: "https://pubs.usgs.gov/pp/1395/report.pdf", desc: "The definitive reference on map projections: derivations, formulas, and properties for every standard projection." },
          { title: "Map Projections: A Reference Manual", author: "Lev Bugayevskiy & John Snyder", type: "book", level: "advanced", url: "https://link.springer.com/book/10.1007/978-3-642-56628-0", desc: "Comprehensive mathematical treatment of map projections, distortion analysis, and optimal projection selection." },
          { title: "Datums and Map Projections (2nd ed.)", author: "Jonathan Iliffe & Roger Lott", type: "book", level: "intermediate", url: "https://www.whittlespublishing.com/Datums-and-Map-Projections", desc: "Practical guide to geodetic datums, transformations, and projections for GIS and surveying professionals." },
          { title: "Flattening the Earth: Two Thousand Years of Map Projections", author: "John P. Snyder", type: "book", level: "beginner", url: "https://press.uchicago.edu/ucp/books/book/chicago/F/bo3632853.html", desc: "Historical survey of map projections from antiquity to modern computing. Accessible and fascinating." }
        ]
      },
      {
        title: "Standards & Online Tools",
        items: [
          { title: "EPSG.io: Coordinate Systems Worldwide", author: "MapTiler", type: "data", level: "beginner", url: "https://epsg.io/", desc: "Search engine for EPSG codes with WKT definitions, proj4 strings, transformation parameters, and interactive map." },
          { title: "PROJ Documentation", author: "PROJ Contributors / OSGeo", type: "code", level: "intermediate", url: "https://proj.org/", desc: "The foundational coordinate transformation library used by GDAL, PostGIS, QGIS, and virtually all open-source GIS." },
          { title: "Spatial Reference Systems (OGC/ISO 19111)", author: "OGC / ISO", type: "notes", level: "advanced", url: "https://www.ogc.org/standard/wkt-crs/", desc: "The standard for Well-Known Text representation of coordinate reference systems (WKT2). Adopted by ISO 19162." },
          { title: "Understanding UTM Zones", author: "ArcGIS Blog / Esri", type: "notes", level: "beginner", url: "https://www.esri.com/arcgis-blog/products/arcgis-pro/mapping/gcs_vs_pcs/", desc: "Clear explanation of UTM zones, when to use geographic vs. projected coordinate systems, and common pitfalls." }
        ]
      },
      {
        title: "Practical Guides",
        items: [
          { title: "pyproj: Python Interface to PROJ", author: "Jeff Whitaker & pyproj contributors", type: "code", level: "beginner", url: "https://pyproj4.github.io/pyproj/", desc: "Python bindings for PROJ. Transform coordinates between CRS, query EPSG database, handle datum shifts." },
          { title: "Coordinate Transformations & Conversions (GeoPandas Guide)", author: "GeoPandas Project", type: "notes", level: "beginner", url: "https://geopandas.org/en/stable/docs/user_guide/projections.html", desc: "Practical guide to reprojecting GeoDataFrames between coordinate systems using .to_crs() method." },
          { title: "Mercator vs. Equal-Area: Choosing the Right Projection", author: "Axis Maps / Cartography Guide", type: "notes", level: "beginner", url: "https://www.axismaps.com/guide/map-projections", desc: "Visual guide to projection properties, distortion patterns, and choosing projections for different purposes." },
          { title: "Geodesy for the Layman (Defense Mapping Agency)", author: "DMA Technical Report", type: "notes", level: "beginner", url: "https://www.ngs.noaa.gov/PUBS_LIB/Geodesy4Layman/toc.htm", desc: "Classic accessible introduction to geodesy: Earth's shape, datums, coordinate systems, and satellite geodesy." }
        ]
      }
    ]
  },
  {
    id: "indexing",
    icon: "\u25C8",
    label: "Spatial Indexing",
    intro: `
      <p><strong>Spatial indexing</strong> systems partition geographic space into addressable cells, enabling O(log n)
      lookups, efficient range queries, and proximity searches. Charlotte's spatial substrate relies on these
      structures to rapidly resolve "what is at this location?" and "what is near this location?"</p>

      <h3>Major Systems</h3>
      <ul>
        <li><strong>H3</strong> (Uber) &mdash; Hexagonal hierarchical grid; 16 resolutions; good for aggregation and neighbor traversal</li>
        <li><strong>S2</strong> (Google) &mdash; Hilbert curve on a cube projected to the sphere; 31 levels; used in BigQuery and Spanner</li>
        <li><strong>Geohash</strong> &mdash; Base-32 string encoding of lat/lon; prefix-based containment; easy to use but has edge artifacts</li>
        <li><strong>R-tree</strong> &mdash; Balanced tree of minimum bounding rectangles; the standard for spatial databases (PostGIS GiST)</li>
        <li><strong>k-d tree</strong> &mdash; Binary space partitioning; excellent for nearest-neighbor in moderate dimensions</li>
      </ul>
    `,
    subsections: [
      {
        title: "Hexagonal & Spherical Grids",
        items: [
          { title: "H3: Uber's Hexagonal Hierarchical Spatial Index", author: "Uber Engineering", type: "code", level: "intermediate", url: "https://h3geo.org/", desc: "Documentation for Uber's H3 system: hexagonal cells at 16 resolutions, edge/vertex functions, and hierarchical operations." },
          { title: "H3: A Hexagonal Hierarchical Geospatial Indexing System (Paper)", author: "Isaac Brodsky (Uber, 2018)", type: "notes", level: "intermediate", url: "https://eng.uber.com/h3/", desc: "Engineering blog post explaining H3's design: icosahedron projection, aperture-7 hierarchy, and use cases at Uber." },
          { title: "S2 Geometry Library", author: "Google", type: "code", level: "advanced", url: "https://s2geometry.io/", desc: "Documentation for Google's S2: cell IDs, coverings, boolean operations on the sphere. Powers BigQuery GIS." },
          { title: "S2 Cells Explorer", author: "sidewalklabs", type: "data", level: "beginner", url: "https://s2.sidewalklabs.com/regioncoverer/", desc: "Interactive visualization of S2 cell decomposition. Explore cell hierarchies, coverings, and containment visually." },
          { title: "Geohash Explorer", author: "Movable Type Scripts", type: "data", level: "beginner", url: "https://www.movable-type.co.uk/scripts/geohash.html", desc: "Interactive geohash calculator and map. Encode/decode coordinates, visualize cell boundaries, understand precision levels." }
        ]
      },
      {
        title: "Tree-Based Indexes",
        items: [
          { title: "R-Trees: A Dynamic Index Structure for Spatial Searching", author: "Antonin Guttman (1984, SIGMOD)", type: "notes", level: "intermediate", url: "https://dl.acm.org/doi/10.1145/602259.602266", desc: "The original R-tree paper. Describes insertion, deletion, splitting, and search in balanced spatial trees." },
          { title: "The R*-tree: An Efficient Access Method (1990)", author: "Beckmann, Kriegel, Schneider & Seeger", type: "notes", level: "advanced", url: "https://dl.acm.org/doi/10.1145/93597.98741", desc: "Improved R-tree with forced reinsertion and better split strategy. Significantly better query performance." },
          { title: "k-d Trees (Stanford CS Library)", author: "Stanford University", type: "notes", level: "beginner", url: "https://web.stanford.edu/class/cs106l/", desc: "Introduction to k-d tree construction, nearest-neighbor search, and range queries in low-dimensional space." },
          { title: "Multidimensional Binary Search Trees (k-d trees)", author: "Jon Louis Bentley (1975)", type: "notes", level: "intermediate", url: "https://dl.acm.org/doi/10.1145/361002.361007", desc: "The foundational paper on k-d trees: binary partitioning of k-dimensional space for efficient search." }
        ]
      },
      {
        title: "Comparisons & Practical Guides",
        items: [
          { title: "Spatial Indexes: Geohash vs. H3 vs. S2", author: "Carto Engineering Blog", type: "notes", level: "intermediate", url: "https://carto.com/blog/spatial-indexes-geohash-h3-s2", desc: "Side-by-side comparison of the three major discrete global grid systems: cell shapes, hierarchies, and trade-offs." },
          { title: "h3-py: H3 Python Bindings", author: "Uber Technologies", type: "code", level: "beginner", url: "https://uber.github.io/h3-py/", desc: "Python API for H3: lat/lon to cell, k-ring neighbors, polyfill polygons, compact/uncompact hierarchies." },
          { title: "python-geohash", author: "Hideo Hattori", type: "code", level: "beginner", url: "https://github.com/hkwi/python-geohash", desc: "Python library for geohash encoding/decoding, neighbor finding, and bounding box computation." }
        ]
      }
    ]
  },
  {
    id: "remote",
    icon: "\u25C9",
    label: "Remote Sensing",
    intro: `
      <p><strong>Remote sensing</strong> acquires information about the Earth's surface from a distance, typically
      using satellite or airborne sensors. It provides the raw observational data &mdash; imagery, elevation models,
      vegetation indices &mdash; that feeds into spatial analysis pipelines.</p>

      <h3>Key Topics</h3>
      <ul>
        <li><strong>Satellite Imagery</strong> &mdash; Landsat (30m, since 1972), Sentinel-2 (10m, ESA), MODIS, commercial (Planet, Maxar)</li>
        <li><strong>LiDAR</strong> &mdash; Light Detection and Ranging; produces dense 3D point clouds for terrain and canopy modeling</li>
        <li><strong>Spectral Indices</strong> &mdash; NDVI (vegetation), NDWI (water), NDBI (built-up); band math on multispectral data</li>
        <li><strong>Google Earth Engine</strong> &mdash; Cloud platform with petabytes of satellite imagery and a JavaScript/Python API</li>
        <li><strong>Classification</strong> &mdash; Supervised/unsupervised pixel classification, object-based image analysis (OBIA)</li>
      </ul>
    `,
    subsections: [
      {
        title: "Textbooks",
        items: [
          { title: "Introductory Digital Image Processing: A Remote Sensing Perspective (4th ed.)", author: "John R. Jensen", type: "book", level: "beginner", url: "https://www.pearson.com/en-us/subject-catalog/p/introductory-digital-image-processing/P200000006760", desc: "The standard remote sensing textbook: electromagnetic radiation, sensors, image enhancement, classification, change detection." },
          { title: "Remote Sensing and Image Interpretation (7th ed.)", author: "Thomas Lillesand, Ralph Kiefer & Jonathan Chipman", type: "book", level: "beginner", url: "https://www.wiley.com/en-us/Remote+Sensing+and+Image+Interpretation-p-9781118343289", desc: "Comprehensive introduction covering photographic, thermal, radar, and LiDAR remote sensing with interpretation techniques." },
          { title: "Remote Sensing: Principles, Interpretation, and Applications (4th ed.)", author: "Floyd Sabins & James Ellis", type: "book", level: "intermediate", url: "https://www.waveland.com/browse.php?t=728", desc: "Covers remote sensing physics, sensors, and applications in geology, land use, oceanography, and environmental monitoring." },
          { title: "Digital Image Processing (4th ed.)", author: "Rafael Gonzalez & Richard Woods", type: "book", level: "intermediate", url: "https://www.pearson.com/en-us/subject-catalog/p/digital-image-processing/P200000003224", desc: "Foundation text on image processing techniques widely applied in remote sensing: filtering, transforms, segmentation." }
        ]
      },
      {
        title: "Google Earth Engine & Cloud Platforms",
        items: [
          { title: "Google Earth Engine Official Documentation", author: "Google", type: "notes", level: "beginner", url: "https://developers.google.com/earth-engine", desc: "Complete guide to GEE: JavaScript/Python API, image collections, reducers, classifiers, and export workflows." },
          { title: "Cloud-Based Remote Sensing with Google Earth Engine", author: "Qiusheng Wu et al.", type: "book", level: "beginner", url: "https://book.geemap.org/", desc: "Free online book on GEE using the geemap Python package: visualization, analysis, time series, and land cover mapping." },
          { title: "Awesome Earth Engine (GitHub)", author: "Samapriya Roy & contributors", type: "code", level: "beginner", url: "https://github.com/giswqs/Awesome-GEE", desc: "Curated list of GEE resources: tutorials, datasets, community scripts, tools, and research papers." },
          { title: "Earth Engine Data Catalog", author: "Google", type: "data", level: "beginner", url: "https://developers.google.com/earth-engine/datasets", desc: "Browse all datasets available in GEE: Landsat, Sentinel, MODIS, climate, terrain, land cover, and more." }
        ]
      },
      {
        title: "Tools & Processing",
        items: [
          { title: "Rasterio: Geospatial Raster I/O for Python", author: "Mapbox / Sean Gillies", type: "code", level: "beginner", url: "https://rasterio.readthedocs.io/", desc: "Pythonic interface to GDAL for reading/writing geospatial raster data. Clean API for band math, windowed reads, reprojection." },
          { title: "GDAL/OGR Documentation", author: "OSGeo / GDAL Contributors", type: "code", level: "intermediate", url: "https://gdal.org/", desc: "The foundational geospatial data abstraction library: raster and vector I/O, format conversion, reprojection, warping." },
          { title: "Sentinel Hub EO Browser", author: "Sinergise", type: "data", level: "beginner", url: "https://apps.sentinel-hub.com/eo-browser/", desc: "Free web app to browse and visualize Sentinel, Landsat, and MODIS imagery with custom band combinations and time series." },
          { title: "USGS EarthExplorer", author: "U.S. Geological Survey", type: "data", level: "beginner", url: "https://earthexplorer.usgs.gov/", desc: "Portal for downloading Landsat, aerial photography, elevation data, and other USGS-hosted remote sensing datasets." }
        ]
      }
    ]
  },
  {
    id: "datasets",
    icon: "\u262C",
    label: "Datasets & Software",
    intro: `
      <p>This section collects the <strong>key datasets</strong> for building a spatial substrate (country/state/city
      boundaries, place names, coordinates) and the <strong>software libraries</strong> for working with spatial data
      in Python, JavaScript, and other languages.</p>

      <h3>For Charlotte's Spatial Substrate</h3>
      <p>Building the pre-computed spatial layer described in Paper 6 requires:</p>
      <ul>
        <li><strong>Administrative boundaries</strong> &mdash; Natural Earth, GADM, OpenStreetMap for countries, states, cities</li>
        <li><strong>Place name gazetteers</strong> &mdash; GeoNames for lat/lon of millions of named places</li>
        <li><strong>Geocoding services</strong> &mdash; Nominatim (OSM), Pelias, Google for address-to-coordinate resolution</li>
        <li><strong>Spatial data formats</strong> &mdash; GeoJSON, GeoPackage, Shapefile, GeoParquet for interchange</li>
        <li><strong>Visualization</strong> &mdash; Leaflet, Mapbox GL, deck.gl, Kepler.gl for debugging and presentation</li>
      </ul>
    `,
    subsections: [
      {
        title: "Boundary & Reference Datasets",
        items: [
          { title: "Natural Earth", author: "Natural Earth Contributors", type: "data", level: "beginner", url: "https://www.naturalearthdata.com/", desc: "Free vector and raster map data at 1:10m, 1:50m, and 1:110m scales. Countries, states, cities, rivers, lakes, coastlines." },
          { title: "GADM: Global Administrative Areas", author: "GADM Project", type: "data", level: "beginner", url: "https://gadm.org/", desc: "High-resolution administrative boundaries for all countries: national, state/province, district, and sub-district levels." },
          { title: "OpenStreetMap (OSM)", author: "OpenStreetMap Contributors", type: "data", level: "beginner", url: "https://www.openstreetmap.org/", desc: "Collaborative global map with roads, buildings, boundaries, POIs, land use. Planet file downloadable via Geofabrik." },
          { title: "GeoNames", author: "GeoNames.org", type: "data", level: "beginner", url: "https://www.geonames.org/", desc: "Gazetteer with over 11 million place names, coordinates, population, elevation, and administrative hierarchy. Free download." },
          { title: "Who's On First (Gazetteer)", author: "Geocode Earth / Mapzen", type: "data", level: "intermediate", url: "https://whosonfirst.org/", desc: "Open gazetteer of places with stable IDs, hierarchical containment, and concordances to other datasets." }
        ]
      },
      {
        title: "Python Ecosystem",
        items: [
          { title: "GeoPandas", author: "GeoPandas Developers", type: "code", level: "beginner", url: "https://geopandas.org/", desc: "Extends Pandas with spatial data types. Read/write spatial formats, spatial joins, overlay, dissolve, plotting." },
          { title: "Shapely", author: "Sean Gillies / Toblerity", type: "code", level: "beginner", url: "https://shapely.readthedocs.io/", desc: "Python library for geometric operations: constructive geometry, predicates, prepared geometry, STR-tree spatial index." },
          { title: "Fiona: Streaming Vector I/O", author: "Sean Gillies / Toblerity", type: "code", level: "beginner", url: "https://fiona.readthedocs.io/", desc: "Pythonic wrapper around GDAL/OGR for reading and writing vector spatial data formats (Shapefile, GeoJSON, GPKG)." },
          { title: "Folium: Python Leaflet Maps", author: "Rob Story & contributors", type: "code", level: "beginner", url: "https://python-visualization.github.io/folium/", desc: "Generate interactive Leaflet maps from Python. Choropleth maps, markers, GeoJSON overlays, heatmaps." }
        ]
      },
      {
        title: "JavaScript & Web Mapping",
        items: [
          { title: "Leaflet", author: "Volodymyr Agafonkin", type: "code", level: "beginner", url: "https://leafletjs.com/", desc: "Lightweight JavaScript library for interactive maps. Tiles, markers, popups, GeoJSON, mobile-friendly. The web mapping standard." },
          { title: "Mapbox GL JS", author: "Mapbox", type: "code", level: "intermediate", url: "https://docs.mapbox.com/mapbox-gl-js/", desc: "WebGL-powered map rendering: vector tiles, 3D terrain, custom styles, data-driven styling, smooth camera transitions." },
          { title: "deck.gl", author: "Uber / vis.gl / OpenJS Foundation", type: "code", level: "intermediate", url: "https://deck.gl/", desc: "WebGL2-powered framework for large-scale data visualization: point clouds, arcs, heatmaps, H3 hexagons, trips." },
          { title: "Turf.js", author: "Mapbox", type: "code", level: "beginner", url: "https://turfjs.org/", desc: "Modular JavaScript library for geospatial analysis: measurement, transformation, classification, joins, boolean operations." },
          { title: "Kepler.gl", author: "Uber / vis.gl", type: "code", level: "beginner", url: "https://kepler.gl/", desc: "Powerful open-source geospatial analysis tool for large-scale data sets. GPU-accelerated rendering, time playback." }
        ]
      }
    ]
  }
];

// ── Rendering Engine ──────────────────────────────────────────────────────────

let activeTab = SECTIONS[0].id;
let activeFilters = {};
let searchQuery = "";

function getAllItems() {
  const items = [];
  SECTIONS.forEach(sec => {
    sec.subsections.forEach(sub => {
      sub.items.forEach(item => {
        items.push({ ...item, sectionId: sec.id, subsection: sub.title });
      });
    });
  });
  return items;
}

function updateStatCount() {
  const count = getAllItems().length;
  document.getElementById("stat-count").textContent = count;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightText(text, query) {
  if (!query) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const re = new RegExp("(" + query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
  return escaped.replace(re, "<mark>$1</mark>");
}

function matchesSearch(item, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    item.title.toLowerCase().includes(q) ||
    item.author.toLowerCase().includes(q) ||
    item.desc.toLowerCase().includes(q) ||
    item.type.toLowerCase().includes(q)
  );
}

function renderTabs() {
  const bar = document.getElementById("tab-bar");
  bar.innerHTML = SECTIONS.map(sec => `
    <button class="tab-btn ${sec.id === activeTab ? "active" : ""}" data-tab="${sec.id}">
      <span class="tab-icon">${sec.icon}</span>
      <span class="tab-label">${sec.label}</span>
    </button>
  `).join("");
  bar.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab;
      activeFilters = {};
      renderTabs();
      renderContent();
    });
  });
}

function getTypes(section) {
  const types = new Set();
  section.subsections.forEach(sub => {
    sub.items.forEach(item => types.add(item.type));
  });
  return Array.from(types).sort();
}

function renderCard(item, query) {
  return `
    <a class="card" href="${item.url}" target="_blank" rel="noopener noreferrer">
      <div class="card-top">
        <span class="type-badge badge-${item.type}">${item.type}</span>
        <span class="level-badge level-${item.level}">${item.level}</span>
      </div>
      <div class="card-title">${highlightText(item.title, query)}</div>
      <div class="card-author">${highlightText(item.author, query)}</div>
      <div class="card-desc">${highlightText(item.desc, query)}</div>
    </a>
  `;
}

function renderContent() {
  const container = document.getElementById("main-content");
  const section = SECTIONS.find(s => s.id === activeTab);
  if (!section) return;

  const types = getTypes(section);
  const currentFilter = activeFilters[section.id] || "all";
  const q = searchQuery.trim();

  let html = `
    <div class="section-header">
      <h2><span class="section-icon">${section.icon}</span>${section.label}</h2>
    </div>
    <div class="section-intro">${section.intro}</div>
  `;

  if (types.length > 1) {
    html += `<div class="filter-bar">`;
    html += `<button class="filter-btn ${currentFilter === "all" ? "active" : ""}" data-filter="all">All</button>`;
    types.forEach(t => {
      html += `<button class="filter-btn ${currentFilter === t ? "active" : ""}" data-filter="${t}">${t}</button>`;
    });
    html += `</div>`;
  }

  section.subsections.forEach(sub => {
    let items = sub.items;
    if (currentFilter !== "all") {
      items = items.filter(i => i.type === currentFilter);
    }
    if (q) {
      items = items.filter(i => matchesSearch(i, q));
    }
    if (items.length === 0) return;

    html += `
      <div class="subsection">
        <h3>${sub.title}</h3>
        <div class="card-grid">
          ${items.map(i => renderCard(i, q)).join("")}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeFilters[section.id] = btn.dataset.filter;
      renderContent();
    });
  });
}

// ── Search ────────────────────────────────────────────────────────────────────

const searchInput = document.getElementById("search-input");
const searchClear = document.getElementById("search-clear");

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  renderContent();
});

searchClear.addEventListener("click", () => {
  searchInput.value = "";
  searchQuery = "";
  renderContent();
  searchInput.focus();
});

// ── Init ──────────────────────────────────────────────────────────────────────

updateStatCount();
renderTabs();
renderContent();
