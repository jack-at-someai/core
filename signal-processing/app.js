// Signal Processing Reference — data + rendering

const SECTIONS = [
  {
    id: 'overview',
    title: 'Overview',
    icon: '\u25C7',
    intro: `<p><strong>Signal Processing</strong> is the mathematical framework for analyzing, transforming, and synthesizing signals — any quantity that varies over time, space, or another independent variable. From audio waveforms and neural spike trains to stock prices and sensor telemetry, signals are the raw currency of information.</p>
<p>In the context of Charlotte, signal processing is foundational. <strong>Paper 1 (FINN Signals)</strong> introduces how nodes in the Charlotte architecture emit and interpret signals — continuous streams of information that carry meaning through their temporal patterns, frequency content, and phase relationships. <strong>Paper 7 (Temporal Perception)</strong> explores how agents perceive and reason about time through signal analysis — detecting rhythms, anticipating events, and building internal models of temporal structure. <strong>Paper 11 (Harmonic Resonance)</strong> investigates how multi-agent systems achieve coordination through resonant coupling, where agents synchronize their signals like coupled oscillators finding shared harmonics.</p>
<p>Signal processing provides the mathematical vocabulary for all of this: <em>Fourier transforms</em> decompose complex signals into frequency components. <em>Wavelets</em> capture transient, localized features. <em>Filtering</em> separates signal from noise. <em>Correlation</em> detects shared structure between signals. <em>Spectral analysis</em> reveals hidden periodicities.</p>
<h3>How to use this reference</h3>
<p>This guide is organized into seven domains plus this overview. Each section opens with a conceptual introduction explaining <em>what</em> the field studies, <em>why</em> it matters for signal processing and Charlotte, and <em>how</em> it connects to the other domains. Resources are tagged by type — books, videos, code, notes — so you can filter for the format you prefer.</p>
<h3>Suggested learning path</h3>
<ol>
<li><strong>Start with Fundamentals</strong> — understand continuous and discrete signals, sampling, convolution</li>
<li><strong>Move to Frequency Domain</strong> — learn Fourier transforms, spectral analysis, filter design</li>
<li><strong>Explore Time Series</strong> — statistical methods for sequential data, forecasting, changepoints</li>
<li><strong>Study Drift Detection</strong> — how to detect when signal distributions shift over time</li>
<li><strong>Dive into Harmonic Analysis</strong> — resonance, synchronization, coupled oscillators</li>
<li><strong>Apply to Waveform Processing</strong> — audio, biomedical, and sensor signal applications</li>
<li><strong>Use Datasets & Software</strong> — hands-on tools and benchmark data</li>
</ol>
<h3>Charlotte connections</h3>
<ul>
<li><strong>Paper 1 (FINN Signals)</strong> — Node signal emission, signal encoding/decoding, information flow</li>
<li><strong>Paper 7 (Temporal Perception)</strong> — Time-series reasoning, rhythm detection, temporal modeling</li>
<li><strong>Paper 11 (Harmonic Resonance)</strong> — Coupled oscillators, phase synchronization, resonant coordination</li>
</ul>`,
    subsections: []
  },
  {
    id: 'fundamentals',
    title: 'Signal Fundamentals',
    icon: '\u301C',
    intro: `<p><strong>Signal theory</strong> is the mathematical foundation upon which all of signal processing rests. A <em>signal</em> is a function that conveys information — it can be continuous (analog) or discrete (digital), deterministic or stochastic, one-dimensional (audio) or multi-dimensional (images, video).</p>
<p>The core operations are deceptively simple but profoundly powerful:</p>
<ul>
<li><strong>Sampling</strong> converts continuous signals to discrete ones. The <em>Nyquist-Shannon theorem</em> tells us exactly how fast we must sample to preserve all information — sample at least twice the highest frequency present. This is not just theory: violating Nyquist causes <em>aliasing</em>, where high frequencies masquerade as low ones, corrupting the signal irreversibly.</li>
<li><strong>Convolution</strong> is the fundamental operation of linear time-invariant (LTI) systems. Every LTI system — every filter, every communication channel — is completely described by its <em>impulse response</em>, and its output is the convolution of the input with that impulse response.</li>
<li><strong>Correlation</strong> measures similarity between signals as a function of time lag. Cross-correlation detects shared patterns; autocorrelation reveals a signal's internal structure and periodicities.</li>
</ul>
<p>For Charlotte's FINN architecture, these fundamentals define how node signals are sampled, how information propagates through convolution-like operations, and how correlation detects meaningful patterns in inter-node communication.</p>`,
    subsections: [
      {
        title: 'Textbooks',
        resources: [
          { title: 'Signals and Systems', author: 'Alan V. Oppenheim & Alan S. Willsky', year: 1996, url: 'https://www.amazon.com/Signals-Systems-2nd-Alan-Oppenheim/dp/0138147574', type: 'book', level: 'intermediate', desc: 'THE classic textbook. Covers continuous and discrete signals, LTI systems, Fourier analysis, Laplace and Z-transforms. The gold standard for two decades.' },
          { title: 'Signals and Systems: Theory and Applications', author: 'Fawwaz T. Ulaby & Andrew E. Yagle', year: 2018, url: 'https://ss2.eecs.umich.edu/', type: 'book', level: 'beginner', desc: 'Modern, freely available textbook with clear explanations and practical examples. Excellent for self-study.' },
          { title: 'Adaptive Filter Theory', author: 'Simon Haykin', year: 2013, url: 'https://www.amazon.com/Adaptive-Filter-Theory-Simon-Haykin/dp/013267145X', type: 'book', level: 'advanced', desc: 'Comprehensive treatment of adaptive filtering — Wiener filters, LMS, RLS, Kalman filters. Essential for real-time signal processing.' },
          { title: 'Digital Signal Processing: Principles, Algorithms and Applications', author: 'John G. Proakis & Dimitris G. Manolakis', year: 2006, url: 'https://www.amazon.com/Digital-Signal-Processing-Principles-Applications/dp/0131873741', type: 'book', level: 'intermediate', desc: 'Widely used DSP textbook covering sampling, quantization, DFT, FFT, filter design, and spectral estimation.' },
          { title: 'Understanding Digital Signal Processing', author: 'Richard G. Lyons', year: 2010, url: 'https://www.amazon.com/Understanding-Digital-Signal-Processing-3rd/dp/0137027419', type: 'book', level: 'beginner', desc: 'Practical, intuition-focused guide to DSP. Less mathematical rigor, more engineering insight. Great first book.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Signals and Systems (MIT OCW 6.003)', author: 'Dennis Freeman (MIT)', year: 2011, url: 'https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/', type: 'course', level: 'intermediate', desc: 'Complete MIT course with lectures, problem sets, and exams. Covers LTI systems, Fourier, Laplace, Z-transforms.' },
          { title: 'Digital Signal Processing (Coursera)', author: 'Paolo Prandoni & Martin Vetterli (EPFL)', year: 2014, url: 'https://www.coursera.org/learn/dsp', type: 'course', level: 'intermediate', desc: 'Excellent MOOC from EPFL covering sampling, filtering, DFT, and spectral analysis with hands-on Python labs.' },
          { title: 'Discrete-Time Signal Processing (MIT OCW 6.341)', author: 'Alan V. Oppenheim (MIT)', year: 2005, url: 'https://ocw.mit.edu/courses/6-341-discrete-time-signal-processing-fall-2005/', type: 'course', level: 'advanced', desc: 'Advanced MIT course by Oppenheim himself. Multirate processing, parametric methods, advanced filter design.' },
          { title: 'Signals and Systems Explained', author: 'Neso Academy', year: null, url: 'https://www.youtube.com/playlist?list=PLBlnK6fEyqRhG6s3jYIU48CqsT5cyiDTO', type: 'video', level: 'beginner', desc: 'Comprehensive YouTube playlist walking through signals, systems, convolution, and transforms step by step.' },
          { title: 'The Fourier Transform — A Visual Introduction', author: '3Blue1Brown', year: 2018, url: 'https://www.youtube.com/watch?v=spUNpyF58BY', type: 'video', level: 'beginner', desc: 'Beautiful visual explanation of what the Fourier transform really does. Perfect starting point.' }
        ]
      },
      {
        title: 'Notes & Tutorials',
        resources: [
          { title: 'The Scientist and Engineer\'s Guide to Digital Signal Processing', author: 'Steven W. Smith', year: 1997, url: 'http://www.dspguide.com/', type: 'book', level: 'beginner', desc: 'Free online textbook. Uniquely practical approach aimed at scientists who need DSP without heavy math prerequisites.' },
          { title: 'DSP Illustrations', author: 'Bernd Girod (Stanford)', year: null, url: 'https://dspillustrations.com/pages/index.html', type: 'notes', level: 'beginner', desc: 'Interactive visualizations of core DSP concepts — sampling, aliasing, convolution, filtering. Learn by seeing.' }
        ]
      }
    ]
  },
  {
    id: 'timeseries',
    title: 'Time Series Analysis',
    icon: '\u23F1',
    intro: `<p><strong>Time series analysis</strong> focuses on data points collected sequentially over time. Unlike general signal processing which often emphasizes frequency-domain methods, time series analysis blends statistical modeling with temporal reasoning — forecasting future values, detecting structural changes, and decomposing signals into trend, seasonal, and residual components.</p>
<p>Key frameworks include:</p>
<ul>
<li><strong>ARIMA</strong> (AutoRegressive Integrated Moving Average) — the workhorse of classical time series. AR captures how past values predict future ones; MA captures how past prediction errors propagate; I handles non-stationarity through differencing.</li>
<li><strong>State Space Models</strong> — represent the system as a hidden state evolving over time, observed through noisy measurements. The Kalman filter is the optimal estimator for linear Gaussian systems. Hidden Markov Models handle discrete states.</li>
<li><strong>Changepoint Detection</strong> — identifies moments when the statistical properties of a signal abruptly change. Critical for detecting regime shifts, structural breaks, and anomalous transitions.</li>
<li><strong>Prophet & Modern Forecasting</strong> — Facebook's Prophet, Amazon's DeepAR, and neural forecasting models bring deep learning to time series, handling multiple seasonalities, holidays, and irregular patterns.</li>
</ul>
<p>For Charlotte's <strong>Temporal Perception</strong> (Paper 7), time series methods are how agents build internal models of temporal structure — detecting rhythms in signal streams, forecasting future states, and recognizing when the underlying process has changed.</p>`,
    subsections: [
      {
        title: 'Textbooks',
        resources: [
          { title: 'Forecasting: Principles and Practice (3rd ed.)', author: 'Rob J. Hyndman & George Athanasopoulos', year: 2021, url: 'https://otexts.com/fpp3/', type: 'book', level: 'beginner', desc: 'Free online textbook. The best introduction to time series forecasting — clear, practical, with R examples. Covers ETS, ARIMA, regression, and modern methods.' },
          { title: 'Time Series Analysis and Its Applications', author: 'Robert H. Shumway & David S. Stoffer', year: 2017, url: 'https://www.stat.pitt.edu/stoffer/tsa4/', type: 'book', level: 'intermediate', desc: 'Standard graduate textbook. ARIMA, spectral analysis, state space models, multivariate methods. R code throughout.' },
          { title: 'Time Series Analysis', author: 'James D. Hamilton', year: 1994, url: 'https://www.amazon.com/Time-Analysis-James-Douglas-Hamilton/dp/0691042896', type: 'book', level: 'advanced', desc: 'The definitive econometric treatment. VAR models, cointegration, regime switching, spectral methods. Dense but comprehensive.' },
          { title: 'Analysis of Financial Time Series', author: 'Ruey S. Tsay', year: 2010, url: 'https://www.amazon.com/Analysis-Financial-Time-Ruey-Tsay/dp/0470414359', type: 'book', level: 'intermediate', desc: 'GARCH, volatility modeling, multivariate time series, high-frequency data. Financial signal processing.' },
          { title: 'Bayesian Filtering and Smoothing', author: 'Simo Sarkka', year: 2013, url: 'https://users.aalto.fi/~ssarkka/pub/cup_book_online_20131111.pdf', type: 'book', level: 'intermediate', desc: 'Free PDF. Kalman filters, particle filters, and Bayesian state estimation. Clear, modern treatment of state space methods.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Time Series Analysis (MIT OCW 18.S096)', author: 'Peter Hartigan & Choongbum Lee (MIT)', year: 2015, url: 'https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/', type: 'course', level: 'intermediate', desc: 'MIT course covering time series models in the context of quantitative finance. Stationarity, ARIMA, GARCH.' },
          { title: 'Practical Time Series Analysis', author: 'SUNY (Coursera)', year: null, url: 'https://www.coursera.org/learn/practical-time-series-analysis', type: 'course', level: 'beginner', desc: 'Hands-on Coursera course walking through time series concepts with R. Good for applied practitioners.' },
          { title: 'Kalman Filter Tutorial', author: 'Michel van Biezen', year: null, url: 'https://www.youtube.com/playlist?list=PLX2gX-ftPVXU3oUFNATxGXY90AULiqnWT', type: 'video', level: 'intermediate', desc: 'Step-by-step video series building Kalman filter intuition from the ground up with worked examples.' }
        ]
      },
      {
        title: 'Tools & Libraries',
        resources: [
          { title: 'Prophet', author: 'Meta (Facebook)', year: 2017, url: 'https://facebook.github.io/prophet/', type: 'code', level: 'beginner', desc: 'Forecasting library handling multiple seasonalities, holidays, and trend changes. Python and R interfaces.' },
          { title: 'statsmodels — Time Series Analysis', author: 'statsmodels team', year: null, url: 'https://www.statsmodels.org/stable/tsa.html', type: 'code', level: 'intermediate', desc: 'Python library with ARIMA, VAR, state space models, seasonal decomposition, and statistical tests.' },
          { title: 'Darts', author: 'Unit8', year: null, url: 'https://github.com/unit8co/darts', type: 'code', level: 'intermediate', desc: 'Python library for easy manipulation and forecasting of time series. Supports classical and deep learning models.' },
          { title: 'tslearn', author: 'Romain Tavenard', year: null, url: 'https://tslearn.readthedocs.io/', type: 'code', level: 'intermediate', desc: 'Machine learning tools for time series — DTW, clustering, classification, shapelets, kernel methods.' }
        ]
      }
    ]
  },
  {
    id: 'frequency',
    title: 'Frequency Domain',
    icon: '\u223F',
    intro: `<p>The <strong>frequency domain</strong> is where signals reveal their hidden structure. The Fourier transform decomposes any signal into a sum of sinusoids — each with a specific frequency, amplitude, and phase. This is not just a mathematical trick; it reflects a deep physical truth: many natural systems are fundamentally oscillatory, and their behavior is most naturally described in terms of frequencies.</p>
<p>Key tools:</p>
<ul>
<li><strong>DFT/FFT</strong> — The Discrete Fourier Transform maps a finite sequence to its frequency components. The Fast Fourier Transform (FFT) computes it in O(N log N) instead of O(N^2), making spectral analysis practical for large datasets. One of the most important algorithms ever invented.</li>
<li><strong>STFT</strong> — The Short-Time Fourier Transform windows the signal and computes the DFT of each window, giving a time-frequency representation (spectrogram). Trades off time resolution against frequency resolution (the uncertainty principle).</li>
<li><strong>Wavelets</strong> — Address the STFT's fixed resolution by using variable-width analysis functions. Short wavelets capture high-frequency transients; long wavelets capture low-frequency trends. The Continuous and Discrete Wavelet Transforms provide multi-resolution analysis.</li>
<li><strong>Filter Design</strong> — Designing systems that selectively pass or reject frequency bands. Low-pass, high-pass, band-pass, notch filters. FIR vs IIR. Butterworth, Chebyshev, elliptic designs.</li>
</ul>
<p>For Charlotte, frequency analysis is essential: FINN signals (Paper 1) carry information in their spectral content. Harmonic Resonance (Paper 11) depends on frequency matching between agents. Temporal Perception (Paper 7) uses spectral features to detect periodicities and rhythms.</p>`,
    subsections: [
      {
        title: 'Textbooks',
        resources: [
          { title: 'The Fourier Transform and Its Applications', author: 'Ronald N. Bracewell', year: 1999, url: 'https://www.amazon.com/Fourier-Transform-Its-Applications/dp/0073039381', type: 'book', level: 'intermediate', desc: 'Classic treatment of the Fourier transform with exceptional intuition. Covers DFT, convolution theorem, sampling, and applications to optics and imaging.' },
          { title: 'A Wavelet Tour of Signal Processing', author: 'Stephane Mallat', year: 2008, url: 'https://www.amazon.com/Wavelet-Tour-Signal-Processing-Third/dp/0123743702', type: 'book', level: 'advanced', desc: 'The definitive wavelet textbook. Multi-resolution analysis, wavelet design, sparse representations, compressed sensing.' },
          { title: 'Fourier Analysis: An Introduction', author: 'Elias M. Stein & Rami Shakarchi', year: 2003, url: 'https://www.amazon.com/Fourier-Analysis-Introduction-Princeton-Lectures/dp/069111384X', type: 'book', level: 'intermediate', desc: 'Princeton Lectures in Analysis. Rigorous mathematical treatment of Fourier series and transforms with beautiful exposition.' },
          { title: 'Discrete-Time Signal Processing', author: 'Alan V. Oppenheim & Ronald W. Schafer', year: 2009, url: 'https://www.amazon.com/Discrete-Time-Signal-Processing-3rd-Prentice-Hall/dp/0131988425', type: 'book', level: 'intermediate', desc: 'The authoritative reference on discrete-time systems, DFT, FFT, and digital filter design. Companion to Signals and Systems.' },
          { title: 'An Introduction to Wavelets Through Linear Algebra', author: 'Michael W. Frazier', year: 1999, url: 'https://www.amazon.com/Introduction-Wavelets-Through-Linear-Algebra/dp/0387986391', type: 'book', level: 'beginner', desc: 'Gentle introduction to wavelets requiring only linear algebra. Builds from Haar wavelets to Daubechies wavelets step by step.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Wavelets and Multiresolution Analysis', author: 'Steve Brunton', year: null, url: 'https://www.youtube.com/playlist?list=PLMrJAkhIeNNRn1Oqo_PYJLiHoRa1j5Dm', type: 'video', level: 'intermediate', desc: 'Excellent video series on wavelets, multiresolution analysis, and their applications in data science.' },
          { title: 'Fourier Analysis (Stanford EE261)', author: 'Brad Osgood (Stanford)', year: null, url: 'https://see.stanford.edu/Course/EE261', type: 'course', level: 'intermediate', desc: 'Complete Stanford course on Fourier analysis — series, transforms, distributions, sampling, and applications.' },
          { title: 'FFT Algorithm — The Most Important Algorithm', author: 'Reducible', year: 2020, url: 'https://www.youtube.com/watch?v=h7apO7q16V0', type: 'video', level: 'beginner', desc: 'Beautifully animated explanation of the FFT algorithm — why it works and why it changed the world.' },
          { title: 'But What is the Fourier Transform?', author: '3Blue1Brown', year: 2018, url: 'https://www.youtube.com/watch?v=spUNpyF58BY', type: 'video', level: 'beginner', desc: 'Visual, intuitive explanation of the Fourier transform as "winding" a signal around a circle.' }
        ]
      },
      {
        title: 'Tutorials & Code',
        resources: [
          { title: 'NumPy FFT Documentation', author: 'NumPy', year: null, url: 'https://numpy.org/doc/stable/reference/routines.fft.html', type: 'code', level: 'beginner', desc: 'Official NumPy FFT reference. Practical entry point for computing Fourier transforms in Python.' },
          { title: 'SciPy Signal Processing Tutorial', author: 'SciPy', year: null, url: 'https://docs.scipy.org/doc/scipy/tutorial/signal.html', type: 'code', level: 'intermediate', desc: 'Official SciPy tutorial covering filtering, spectral analysis, wavelets, and window functions.' },
          { title: 'PyWavelets', author: 'PyWavelets Team', year: null, url: 'https://pywavelets.readthedocs.io/', type: 'code', level: 'intermediate', desc: 'Python wavelet transform library. CWT, DWT, wavelet packets, multi-level decomposition. Clean API.' },
          { title: 'Spectral Analysis with Python', author: 'Thomas Cokelaer', year: null, url: 'https://pyspectrum.readthedocs.io/', type: 'code', level: 'intermediate', desc: 'Python library for spectral analysis — periodogram, Welch, multitaper, parametric methods (AR, ARMA).' }
        ]
      }
    ]
  },
  {
    id: 'drift',
    title: 'Drift Detection',
    icon: '\u2298',
    intro: `<p><strong>Drift detection</strong> addresses a fundamental challenge in real-world signal processing: distributions change. A model trained on yesterday's data may fail on today's because the underlying data-generating process has shifted. This is <em>concept drift</em> — and detecting it is critical for any adaptive system.</p>
<p>Types of drift:</p>
<ul>
<li><strong>Sudden drift</strong> — the distribution changes abruptly at a single point (regime change)</li>
<li><strong>Gradual drift</strong> — the old and new distributions overlap during a transition period</li>
<li><strong>Incremental drift</strong> — the distribution slowly evolves over many time steps</li>
<li><strong>Recurring drift</strong> — the distribution cycles between known states (seasonal patterns)</li>
</ul>
<p>Classical algorithms include <strong>CUSUM</strong> (Cumulative Sum), which tracks cumulative deviations from expected values, and <strong>ADWIN</strong> (Adaptive Windowing), which maintains a variable-length window and detects changes by comparing sub-window statistics. Modern approaches use <em>maximum mean discrepancy</em> (MMD), <em>Kolmogorov-Smirnov tests</em>, and neural network-based detectors.</p>
<p>For Charlotte, drift detection is how agents recognize that their environment has changed — that the signal statistics they learned are no longer valid. Paper 7 (Temporal Perception) requires agents to distinguish stable rhythms from genuine shifts in temporal structure.</p>`,
    subsections: [
      {
        title: 'Papers & Surveys',
        resources: [
          { title: 'A Survey on Concept Drift Adaptation', author: 'Joao Gama, Indre Zliobaite, Albert Bifet, Mykola Pechenizkiy & Abdelhamid Bouchachia', year: 2014, url: 'https://dl.acm.org/doi/10.1145/2523813', type: 'notes', level: 'intermediate', desc: 'Comprehensive ACM Computing Survey covering drift detection methods, adaptation strategies, and evaluation. The standard reference.' },
          { title: 'Learning under Concept Drift: A Review', author: 'Jie Lu, Anjin Liu, Fan Dong, Feng Gu, Joao Gama & Guangquan Zhang', year: 2018, url: 'https://ieeexplore.ieee.org/document/8496795', type: 'notes', level: 'intermediate', desc: 'IEEE TKDE review with taxonomy of drift types, detection methods, and learning strategies. Modern and thorough.' },
          { title: 'Sequential Analysis and Optimal Design', author: 'E.S. Page (original CUSUM paper)', year: 1954, url: 'https://www.jstor.org/stable/2333009', type: 'notes', level: 'advanced', desc: 'The foundational paper introducing the CUSUM (Cumulative Sum) test for detecting changes in sequential data. Historic.' },
          { title: 'ADWIN: Adaptive Windowing for Drift Detection', author: 'Albert Bifet & Ricard Gavalda', year: 2007, url: 'https://epubs.siam.org/doi/10.1137/1.9781611972771.42', type: 'notes', level: 'intermediate', desc: 'Introduces the ADWIN algorithm — maintains adaptive-size windows and rigorously detects distribution changes.' },
          { title: 'Failing Loudly: An Empirical Study of Methods for Detecting Dataset Shift', author: 'Stephan Rabanser, Stephan Gunnemann & Zachary Lipton', year: 2019, url: 'https://arxiv.org/abs/1810.11953', type: 'notes', level: 'intermediate', desc: 'Practical comparison of dataset shift detection methods — MMD, KS test, classifier two-sample tests.' },
          { title: 'A Kernel Two-Sample Test', author: 'Arthur Gretton, Karsten M. Borgwardt, Malte Rasch, Bernhard Scholkopf, Alexander Smola', year: 2012, url: 'https://jmlr.org/papers/v13/gretton12a.html', type: 'notes', level: 'advanced', desc: 'The Maximum Mean Discrepancy (MMD) test — a kernel-based method for detecting distribution differences. Foundational for modern drift detection.' }
        ]
      },
      {
        title: 'Courses & Tutorials',
        resources: [
          { title: 'Concept Drift and Model Decay in Machine Learning', author: 'Shreya Shankar (Stanford)', year: 2022, url: 'https://www.shreya-shankar.com/rethinking-ml-monitoring-2/', type: 'notes', level: 'beginner', desc: 'Accessible blog post on ML monitoring and drift detection in production systems. Practical perspective.' },
          { title: 'Change Detection in Streaming Data', author: 'Albert Bifet', year: null, url: 'https://www.youtube.com/watch?v=gMVOd_LVjgQ', type: 'video', level: 'intermediate', desc: 'Talk by the creator of ADWIN and MOA on detecting changes in data streams.' }
        ]
      },
      {
        title: 'Tools & Libraries',
        resources: [
          { title: 'River', author: 'River Team', year: null, url: 'https://riverml.xyz/', type: 'code', level: 'intermediate', desc: 'Python library for online/streaming machine learning. Includes ADWIN, Page-Hinkley, DDM drift detectors.' },
          { title: 'MOA (Massive Online Analysis)', author: 'Albert Bifet et al.', year: null, url: 'https://moa.cms.waikato.ac.nz/', type: 'code', level: 'intermediate', desc: 'Java framework for data stream mining — drift detection, classification, clustering, regression on streams.' },
          { title: 'Alibi Detect', author: 'Seldon', year: null, url: 'https://github.com/SeldonIO/alibi-detect', type: 'code', level: 'intermediate', desc: 'Python library for outlier, adversarial, and drift detection. MMD, KS, Chi-squared, learned kernel detectors.' },
          { title: 'Evidently', author: 'Evidently AI', year: null, url: 'https://github.com/evidentlyai/evidently', type: 'code', level: 'beginner', desc: 'ML monitoring tool with visual reports on data drift, target drift, and model performance degradation.' }
        ]
      }
    ]
  },
  {
    id: 'harmonic',
    title: 'Harmonic Analysis',
    icon: '\u266B',
    intro: `<p><strong>Harmonic analysis</strong> studies the representation of functions and signals as superpositions of basic waves — harmonics. While Fourier analysis is its most famous branch, harmonic analysis extends far beyond: to groups, manifolds, and abstract spaces where the notion of "frequency" generalizes to representations of symmetry groups.</p>
<p>Key concepts for Charlotte:</p>
<ul>
<li><strong>Harmonic series</strong> — A fundamental frequency and its integer multiples. When a string vibrates, it doesn't produce a single frequency but a rich spectrum of harmonics. The <em>timbre</em> of a sound is determined by the relative amplitudes of its harmonics.</li>
<li><strong>Resonance</strong> — When a system is driven at its natural frequency, the response amplitude grows dramatically. Resonance is how energy transfers efficiently between coupled systems and why bridges can collapse from wind and wine glasses shatter from sound.</li>
<li><strong>Coupled oscillators</strong> — When two or more oscillating systems interact, they can <em>synchronize</em> — lock their frequencies and phases. This is the Kuramoto model, Huygens' clocks, fireflies flashing in unison. The mathematics of synchronization connects to topology (the circle), dynamical systems (limit cycles), and graph theory (coupling networks).</li>
<li><strong>Phase alignment</strong> — Synchronization is not just about frequency matching but about <em>phase coherence</em>. Two signals at the same frequency can be constructive (in phase) or destructive (out of phase). Phase relationships encode information.</li>
</ul>
<p>Charlotte's <strong>Paper 11 (Harmonic Resonance)</strong> directly builds on these ideas: agents achieve coordination by resonating at shared harmonics. The multi-agent system finds stable synchronized states through phase coupling, just as coupled oscillators find phase-locked solutions.</p>`,
    subsections: [
      {
        title: 'Textbooks',
        resources: [
          { title: 'Sync: How Order Emerges from Chaos in the Universe, Nature, and Daily Life', author: 'Steven Strogatz', year: 2003, url: 'https://www.amazon.com/Sync-Order-Emerges-Universe-Nature/dp/0786887214', type: 'book', level: 'beginner', desc: 'Popular science masterpiece on synchronization — fireflies, heart cells, coupled oscillators, and the mathematics of collective rhythm. Essential reading for Paper 11.' },
          { title: 'Synchronization: A Universal Concept in Nonlinear Sciences', author: 'Arkady Pikovsky, Michael Rosenblum & Jurgen Kurths', year: 2001, url: 'https://www.amazon.com/Synchronization-Universal-Concept-Nonlinear-Sciences/dp/0521533520', type: 'book', level: 'intermediate', desc: 'THE technical reference on synchronization. Phase locking, frequency entrainment, coupled oscillators, chaotic synchronization. Comprehensive and rigorous.' },
          { title: 'Nonlinear Dynamics and Chaos', author: 'Steven Strogatz', year: 2014, url: 'https://www.amazon.com/Nonlinear-Dynamics-Chaos-Applications-Nonlinearity/dp/0813349109', type: 'book', level: 'intermediate', desc: 'Classic textbook on dynamical systems. Bifurcations, limit cycles, chaos, coupled oscillators. Chapter 8 on coupled oscillators is directly relevant.' },
          { title: 'The Geometry of Musical Rhythm', author: 'Godfried Toussaint', year: 2013, url: 'https://www.amazon.com/Geometry-Musical-Rhythm-What-Makes/dp/1466512024', type: 'book', level: 'beginner', desc: 'Computational geometry meets music. Rhythmic patterns, necklaces, Euclidean rhythms. Surprising connections between geometry and temporal structure.' },
          { title: 'Chemical Oscillations, Waves, and Turbulence', author: 'Yoshiki Kuramoto', year: 1984, url: 'https://link.springer.com/book/10.1007/978-3-642-69689-3', type: 'book', level: 'advanced', desc: 'Introduces the Kuramoto model of coupled phase oscillators — the foundational mathematical model of synchronization.' }
        ]
      },
      {
        title: 'Papers & Notes',
        resources: [
          { title: 'From Kuramoto to Crawford: Exploring the Onset of Synchronization', author: 'Steven Strogatz', year: 2000, url: 'https://doi.org/10.1016/S0167-2789(00)00094-4', type: 'notes', level: 'advanced', desc: 'Review paper tracing the mathematical theory of synchronization transitions in coupled oscillator networks.' },
          { title: 'The Kuramoto Model: A Simple Paradigm for Synchronization Phenomena', author: 'Juan A. Acebron et al.', year: 2005, url: 'https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.77.137', type: 'notes', level: 'intermediate', desc: 'Reviews of Modern Physics survey of the Kuramoto model — exact solutions, order parameter, generalizations.' },
          { title: 'Coupled Oscillators and Biological Synchronization', author: 'Steven Strogatz & Ian Stewart', year: 1993, url: 'https://www.scientificamerican.com/article/coupled-oscillators-and-b/', type: 'notes', level: 'beginner', desc: 'Scientific American article making coupled oscillator theory accessible. Fireflies, crickets, cardiac pacemakers.' },
          { title: 'Spectral Audio Signal Processing', author: 'Julius O. Smith III', year: 2011, url: 'https://ccrma.stanford.edu/~jos/sasp/', type: 'book', level: 'intermediate', desc: 'Free Stanford online book on spectral analysis of audio signals — windowing, STFT, sinusoidal modeling, phase vocoder.' }
        ]
      },
      {
        title: 'Courses & Videos',
        resources: [
          { title: 'Nonlinear Dynamics and Chaos (Strogatz Lectures)', author: 'Steven Strogatz (Cornell)', year: 2014, url: 'https://www.youtube.com/playlist?list=PLbN57C5Zdl6j_qJA-pARJnKsmROzPnO9V', type: 'course', level: 'intermediate', desc: 'Complete lecture series from Strogatz himself. Lectures 19-24 cover coupled oscillators and synchronization.' },
          { title: 'The Science of Synchronization', author: 'Veritasium', year: 2021, url: 'https://www.youtube.com/watch?v=t-_VPRCtiUg', type: 'video', level: 'beginner', desc: 'Viral video demonstrating synchronization of metronomes and explaining the physics. 25M+ views.' },
          { title: 'Music and Mathematics', author: 'David Benson (Aberdeen)', year: null, url: 'https://homepages.abdn.ac.uk/d.j.benson/pages/html/music.pdf', type: 'book', level: 'beginner', desc: 'Free online book connecting harmonic series, Fourier analysis, and tuning theory to musical acoustics.' }
        ]
      }
    ]
  },
  {
    id: 'waveforms',
    title: 'Waveform Processing',
    icon: '\u222B',
    intro: `<p><strong>Waveform processing</strong> applies signal processing theory to real-world signals — audio, speech, biomedical recordings, and sensor data. This is where theory meets practice: designing systems that can hear, diagnose, monitor, and understand the physical world through its signals.</p>
<p>Key domains:</p>
<ul>
<li><strong>Audio processing</strong> — Music information retrieval, source separation, noise reduction, spatial audio. Signals are typically 1D waveforms sampled at 44.1 kHz (CD quality) or higher, with spectrograms as the primary analysis representation.</li>
<li><strong>Speech processing</strong> — Recognition, synthesis, speaker identification, emotion detection. Mel-frequency cepstral coefficients (MFCCs), formant analysis, and neural end-to-end models (Wav2Vec, Whisper).</li>
<li><strong>Biomedical signals</strong> — ECG (heart), EEG (brain), EMG (muscle), pulse oximetry. These signals are noisy, non-stationary, and clinically critical. Processing them requires domain-specific knowledge of physiology and artifact rejection.</li>
<li><strong>Sensor data</strong> — Accelerometers, gyroscopes, pressure sensors, strain gauges. IoT and industrial monitoring produce massive streams of sensor waveforms requiring real-time processing.</li>
</ul>
<p>For Charlotte, waveform processing connects to how FINN signals (Paper 1) are actually implemented — as time-varying quantities that must be sampled, filtered, and interpreted in real time by receiving nodes.</p>`,
    subsections: [
      {
        title: 'Audio & Speech',
        resources: [
          { title: 'Speech and Language Processing', author: 'Dan Jurafsky & James H. Martin', year: 2024, url: 'https://web.stanford.edu/~jurafsky/slp3/', type: 'book', level: 'intermediate', desc: 'Free online textbook. Definitive reference on NLP and speech processing. Chapters on phonetics, speech recognition, and speech synthesis.' },
          { title: 'DAFX: Digital Audio Effects', author: 'Udo Zolzer (editor)', year: 2011, url: 'https://www.amazon.com/DAFX-Digital-Audio-Effects-Zolzer/dp/0470665998', type: 'book', level: 'intermediate', desc: 'Comprehensive treatment of audio effects — filters, delays, modulation, spatial effects, spectral processing, time-stretching.' },
          { title: 'Fundamentals of Music Processing', author: 'Meinard Muller', year: 2015, url: 'https://www.amazon.com/Fundamentals-Music-Processing-Algorithms-Applications/dp/3319219448', type: 'book', level: 'intermediate', desc: 'Music signal analysis — beat tracking, chord recognition, melody extraction, audio alignment. Bridges theory and code.' },
          { title: 'LibROSA', author: 'Brian McFee et al.', year: null, url: 'https://librosa.org/', type: 'code', level: 'beginner', desc: 'Python library for audio and music analysis. Spectrograms, MFCCs, beat tracking, onset detection, harmonic-percussive separation.' },
          { title: 'Audio Signal Processing for Music Applications', author: 'Xavier Serra & Julius O. Smith (Coursera/UPF-Stanford)', year: null, url: 'https://www.coursera.org/learn/audio-signal-processing', type: 'course', level: 'intermediate', desc: 'Coursera course on audio analysis and synthesis. DFT, sinusoidal models, harmonic models, spectral processing.' }
        ]
      },
      {
        title: 'Biomedical Signals',
        resources: [
          { title: 'Biomedical Signal Processing and Signal Modeling', author: 'Eugene N. Bruce', year: 2000, url: 'https://www.amazon.com/Biomedical-Signal-Processing-Modeling/dp/0471345407', type: 'book', level: 'intermediate', desc: 'Signal processing techniques tailored for biomedical applications — ECG, EEG, EMG analysis with physiological context.' },
          { title: 'MNE-Python', author: 'MNE Team', year: null, url: 'https://mne.tools/', type: 'code', level: 'intermediate', desc: 'Python library for processing MEG and EEG data. Filtering, source localization, time-frequency analysis, connectivity.' },
          { title: 'NeuroKit2', author: 'Dominique Makowski et al.', year: null, url: 'https://neuropsychology.github.io/NeuroKit/', type: 'code', level: 'beginner', desc: 'Python toolbox for neurophysiological signal processing — ECG, EDA, EMG, EEG, PPG. Clean API for biosignal analysis.' },
          { title: 'BioSPPy', author: 'IT-BIST', year: null, url: 'https://biosppy.readthedocs.io/', type: 'code', level: 'beginner', desc: 'Biosignal processing in Python. ECG, EDA, EEG, EMG analysis with simple, well-documented functions.' },
          { title: 'PhysioNet', author: 'PhysioNet/MIT', year: null, url: 'https://physionet.org/', type: 'data', level: null, desc: 'Repository of physiological signal databases — ECG (MIT-BIH), EEG, gait, ICU monitoring. The standard source for biomedical signal data.' }
        ]
      },
      {
        title: 'General Tools',
        resources: [
          { title: 'scipy.signal', author: 'SciPy', year: null, url: 'https://docs.scipy.org/doc/scipy/reference/signal.html', type: 'code', level: 'intermediate', desc: 'Core Python signal processing module. Filtering, spectral analysis, wavelets, peak detection, resampling.' },
          { title: 'Essentia', author: 'Music Technology Group (UPF)', year: null, url: 'https://essentia.upf.edu/', type: 'code', level: 'intermediate', desc: 'C++/Python library for audio analysis and music information retrieval. Feature extraction, classification, similarity.' },
          { title: 'torchaudio', author: 'PyTorch', year: null, url: 'https://pytorch.org/audio/', type: 'code', level: 'intermediate', desc: 'PyTorch audio processing library. Waveform transformations, feature extraction, pretrained models (Wav2Vec, HuBERT).' }
        ]
      }
    ]
  },
  {
    id: 'datasets',
    title: 'Datasets & Software',
    icon: '\u262C',
    intro: `<p>The tools and data that make signal processing research and practice possible. Open datasets provide benchmark signals for testing algorithms. Software libraries implement the mathematical operations — from basic FFTs to advanced wavelet decompositions and adaptive filters.</p>
<p>This section collects the essential libraries, frameworks, and datasets across the signal processing landscape. Whether you need to compute a spectrogram, train a time series forecasting model, or benchmark a drift detector, the tools are here.</p>`,
    subsections: [
      {
        title: 'Core Libraries',
        resources: [
          { title: 'SciPy Signal Processing', author: 'SciPy Community', year: null, url: 'https://docs.scipy.org/doc/scipy/reference/signal.html', type: 'code', level: null, desc: 'Python signal processing module — convolution, filtering, spectral analysis, wavelets, window functions, peak detection.' },
          { title: 'NumPy FFT', author: 'NumPy Community', year: null, url: 'https://numpy.org/doc/stable/reference/routines.fft.html', type: 'code', level: null, desc: 'Fast Fourier Transform implementation in NumPy. The computational backbone of spectral analysis in Python.' },
          { title: 'MATLAB Signal Processing Toolbox', author: 'MathWorks', year: null, url: 'https://www.mathworks.com/products/signal.html', type: 'code', level: null, desc: 'Industry-standard toolbox for signal generation, filtering, spectral analysis, and measurement. The original DSP software.' },
          { title: 'GNU Octave Signal Package', author: 'GNU Octave', year: null, url: 'https://octave.sourceforge.io/signal/', type: 'code', level: null, desc: 'Free, open-source MATLAB-compatible signal processing package. Filter design, spectral analysis, window functions.' },
          { title: 'PyWavelets', author: 'PyWavelets Team', year: null, url: 'https://pywavelets.readthedocs.io/', type: 'code', level: null, desc: 'Python wavelet transform library. CWT, DWT, MODWT, wavelet packets. Haar, Daubechies, Symlet, Coiflet families.' },
          { title: 'LibROSA', author: 'Brian McFee et al.', year: null, url: 'https://librosa.org/', type: 'code', level: null, desc: 'Python audio analysis library. Spectrograms, MFCCs, chromagrams, beat tracking, onset detection.' }
        ]
      },
      {
        title: 'Streaming & Online Learning',
        resources: [
          { title: 'River', author: 'River Team', year: null, url: 'https://riverml.xyz/', type: 'code', level: null, desc: 'Python online/streaming ML library. Drift detection (ADWIN, DDM, EDDM), incremental learning, streaming statistics.' },
          { title: 'MOA (Massive Online Analysis)', author: 'University of Waikato', year: null, url: 'https://moa.cms.waikato.ac.nz/', type: 'code', level: null, desc: 'Java framework for mining data streams. Classification, regression, clustering, drift detection, evaluation.' },
          { title: 'Apache Kafka + ksqlDB', author: 'Confluent', year: null, url: 'https://ksqldb.io/', type: 'code', level: null, desc: 'Stream processing platform for real-time signal pipelines. SQL-like interface for filtering, aggregating, and transforming streaming data.' }
        ]
      },
      {
        title: 'Signal & Audio Datasets',
        resources: [
          { title: 'PhysioNet', author: 'MIT Laboratory for Computational Physiology', year: null, url: 'https://physionet.org/', type: 'data', level: null, desc: 'Repository of physiological signals — ECG (MIT-BIH Arrhythmia), EEG, blood pressure, gait. Gold standard for biomedical signals.' },
          { title: 'UCR Time Series Classification Archive', author: 'UC Riverside', year: null, url: 'https://www.cs.ucr.edu/~eamonn/time_series_data_2018/', type: 'data', level: null, desc: '128 time series datasets for classification benchmarking. The standard benchmark suite for time series algorithms.' },
          { title: 'Monash Time Series Forecasting Archive', author: 'Monash University', year: null, url: 'https://forecastingdata.org/', type: 'data', level: null, desc: 'Curated collection of time series forecasting datasets spanning multiple domains — weather, energy, finance, transport.' },
          { title: 'MUSAN: Music, Speech, and Noise Corpus', author: 'David Snyder et al.', year: 2015, url: 'https://www.openslr.org/17/', type: 'data', level: null, desc: 'Free corpus of music, speech, and noise recordings for training and evaluating audio processing systems.' },
          { title: 'ESC-50: Environmental Sound Classification', author: 'Karol Piczak', year: 2015, url: 'https://github.com/karolpiczak/ESC-50', type: 'data', level: null, desc: '2000 environmental audio recordings in 50 categories. Standard benchmark for environmental sound classification.' },
          { title: 'CHB-MIT EEG Database', author: 'MIT/Children\'s Hospital Boston', year: null, url: 'https://physionet.org/content/chbmit/1.0.0/', type: 'data', level: null, desc: 'Scalp EEG recordings from pediatric patients with seizures. Standard benchmark for seizure detection algorithms.' },
          { title: 'M4 Competition Dataset', author: 'Spyros Makridakis et al.', year: 2018, url: 'https://github.com/Mcompetitions/M4-methods', type: 'data', level: null, desc: '100,000 time series from the M4 forecasting competition. Diverse domains, multiple frequencies. The ultimate forecasting benchmark.' }
        ]
      }
    ]
  }
];

// ---- Rendering ----

const TYPE_BADGES = {
  book:   { label: 'Book',     cls: 'badge-book' },
  notes:  { label: 'Notes',    cls: 'badge-notes' },
  video:  { label: 'Video',    cls: 'badge-video' },
  course: { label: 'Course',   cls: 'badge-course' },
  code:   { label: 'Code',     cls: 'badge-code' },
  data:   { label: 'Dataset',  cls: 'badge-data' }
};

const LEVEL_BADGES = {
  beginner:     { label: 'Beginner',     cls: 'level-beginner' },
  intermediate: { label: 'Intermediate', cls: 'level-intermediate' },
  advanced:     { label: 'Advanced',     cls: 'level-advanced' }
};

let activeSection = 'overview';
let activeFilter = 'all';
let searchQuery = '';

function init() {
  renderTabs();
  renderContent();
  bindEvents();
  updateStats();
}

function renderTabs() {
  const bar = document.getElementById('tab-bar');
  bar.innerHTML = '';
  for (const s of SECTIONS) {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (s.id === activeSection ? ' active' : '');
    btn.dataset.id = s.id;
    btn.innerHTML = `<span class="tab-icon">${s.icon}</span><span class="tab-label">${s.title}</span>`;
    bar.appendChild(btn);
  }
}

function renderContent() {
  const main = document.getElementById('main-content');
  const section = SECTIONS.find(s => s.id === activeSection);
  if (!section) return;

  let html = `<div class="section-header"><h2><span class="section-icon">${section.icon}</span> ${section.title}</h2></div>`;
  html += `<div class="section-intro">${section.intro}</div>`;

  if (section.subsections.length) {
    html += `<div class="filter-bar">
      <button class="filter-btn${activeFilter === 'all' ? ' active' : ''}" data-filter="all">All</button>
      <button class="filter-btn${activeFilter === 'book' ? ' active' : ''}" data-filter="book">Books</button>
      <button class="filter-btn${activeFilter === 'video' ? ' active' : ''}" data-filter="video">Videos</button>
      <button class="filter-btn${activeFilter === 'course' ? ' active' : ''}" data-filter="course">Courses</button>
      <button class="filter-btn${activeFilter === 'notes' ? ' active' : ''}" data-filter="notes">Notes</button>
      <button class="filter-btn${activeFilter === 'code' ? ' active' : ''}" data-filter="code">Code</button>
      <button class="filter-btn${activeFilter === 'data' ? ' active' : ''}" data-filter="data">Data</button>
    </div>`;

    for (const sub of section.subsections) {
      const filtered = filterResources(sub.resources);
      if (!filtered.length) continue;
      html += `<div class="subsection"><h3>${sub.title}</h3><div class="card-grid">`;
      for (const r of filtered) {
        html += renderCard(r);
      }
      html += `</div></div>`;
    }
  }

  main.innerHTML = html;
  bindFilters();
}

function filterResources(resources) {
  return resources.filter(r => {
    if (activeFilter !== 'all' && r.type !== activeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = `${r.title} ${r.author || ''} ${r.desc || ''}`.toLowerCase();
      return hay.includes(q);
    }
    return true;
  });
}

function renderCard(r) {
  const badge = TYPE_BADGES[r.type] || { label: r.type, cls: '' };
  const levelBadge = r.level && LEVEL_BADGES[r.level]
    ? `<span class="level-badge ${LEVEL_BADGES[r.level].cls}">${LEVEL_BADGES[r.level].label}</span>`
    : '';
  const author = r.author ? `<div class="card-author">${r.author}${r.year ? ` (${r.year})` : ''}</div>` : (r.year ? `<div class="card-author">${r.year}</div>` : '');

  return `<a class="card" href="${r.url}" target="_blank" rel="noopener">
    <div class="card-top">
      <span class="type-badge ${badge.cls}">${badge.label}</span>
      ${levelBadge}
    </div>
    <div class="card-title">${highlightMatch(r.title)}</div>
    ${author}
    <div class="card-desc">${highlightMatch(r.desc || '')}</div>
  </a>`;
}

function highlightMatch(text) {
  if (!searchQuery) return text;
  const re = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

function updateStats() {
  let total = 0;
  for (const s of SECTIONS) {
    for (const sub of s.subsections) {
      total += sub.resources.length;
    }
  }
  const el = document.getElementById('stat-count');
  if (el) el.textContent = total;
}

function bindEvents() {
  // Tab clicks
  document.getElementById('tab-bar').addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    activeSection = btn.dataset.id;
    activeFilter = 'all';
    renderTabs();
    renderContent();
    document.getElementById('main-content').scrollTop = 0;
  });

  // Search
  const search = document.getElementById('search-input');
  search.addEventListener('input', () => {
    searchQuery = search.value.trim();
    renderContent();
  });

  // Clear search
  document.getElementById('search-clear').addEventListener('click', () => {
    search.value = '';
    searchQuery = '';
    renderContent();
    search.focus();
  });
}

function bindFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      renderContent();
    });
  });
}

document.addEventListener('DOMContentLoaded', init);
