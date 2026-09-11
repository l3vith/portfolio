import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Lenis from 'lenis';
import './styles.css';

const projects = [
  { name: 'NWIS', kind: 'Local document intelligence', className: 'nw', detail: 'TypeScript / MLX / OCR', stack: ['TYPESCRIPT', 'MLX', 'OCR'], description: 'A local-first document intelligence workspace that turns technical PDFs, scans and handwriting into searchable evidence, structured events and useful answers.', url: 'https://github.com/l3vith/sih' },
  { name: 'Sonora', kind: 'Private P2P listening rooms', className: 'sonora', detail: 'Rust / Tauri / React', stack: ['RUST', 'TAURI', 'REACT'], description: 'A cross-platform desktop application for sharing audio inside private peer-to-peer listening rooms, with native system capture and synchronized room state.', url: 'https://github.com/l3vith/sonara' },
  { name: 'Warp', kind: 'WebRTC signaling infrastructure', className: 'warp', detail: 'Rust / WebSockets', stack: ['RUST', 'WEBRTC', 'WEBSOCKETS'], description: 'An asynchronous, performance-focused signaling server written in Rust for coordinating direct WebRTC connections through WebSockets.', url: 'https://github.com/l3vith/warp' },
  { name: 'Paper Atlas', kind: 'Research paper recommendations', className: 'morph', detail: 'Python / SciBERT / FAISS', stack: ['PYTHON', 'SCIBERT', 'FAISS'], description: 'An end-to-end research discovery system that aggregates papers, fine-tunes SciBERT embeddings and serves fast semantic recommendations from a FAISS index.', url: 'https://github.com/l3vith/paper-reccomendation' },
  { name: 'Wave', kind: 'QUIC broadcasting service', className: 'nw', detail: 'Rust / QUIC / Streaming', stack: ['RUST', 'QUIC', 'STREAMING'], description: 'A robust broadcasting and streaming tool built in Rust on top of QUIC, exploring efficient real-time transport beyond conventional web protocols.', url: 'https://github.com/l3vith/wave' },
  { name: 'CHIP-8', kind: 'Classic systems emulator', className: 'sonora', detail: 'Rust / Emulation / SDL', stack: ['RUST', 'EMULATION', '64 × 32'], description: 'A fast CHIP-8 emulator implementing the complete instruction set, classic monochrome display, keypad input, timers, memory and sprite collision behavior.', url: 'https://github.com/l3vith/chip8' },
  { name: 'Torr', kind: 'BitTorrent client', className: 'warp', detail: 'Rust / Networking / P2P', stack: ['RUST', 'BITTORRENT', 'P2P'], description: 'A BitTorrent client written in Rust—a focused systems project exploring peer discovery, distributed file transfer and network protocol implementation.', url: 'https://github.com/l3vith/torr' },
];

const services = [
  ['01', 'AI SYSTEMS', 'Local-first model pipelines built for privacy, speed and useful outcomes.', 'I design practical AI systems that move beyond a model demo—combining document ingestion, OCR, retrieval and structured outputs into dependable product workflows.', ['LOCAL INFERENCE', 'OCR + RAG', 'MODEL PIPELINES']],
  ['02', 'DIGITAL\nEXPERIENCES', 'Interfaces shaped through clarity, rhythm and thoughtful interaction.', 'I turn technically dense workflows into focused interfaces. Information hierarchy, responsive behavior and purposeful motion work together so the product feels clear from the first interaction.', ['REACT', 'INTERACTION', 'MOTION']],
  ['03', 'PRODUCT\nENGINEERING', 'From rough idea to a resilient product people can actually use.', 'I connect frontends, native applications and backend services into coherent products—working across TypeScript, Rust, APIs and real-time systems from prototype through validation.', ['TYPESCRIPT', 'RUST', 'REAL-TIME']],
  ['04', 'CREATIVE\nDEVELOPMENT', 'Expressive prototypes where technology becomes part of the story.', 'I build exploratory digital work where code carries the visual idea: unusual navigation, generative presentation systems and interaction-led prototypes with a strong sense of character.', ['PROTOTYPING', 'WEB MOTION', 'VISUAL SYSTEMS']],
];

function SideRail({ open, onToggle }) {
  return <aside className="rail" aria-label="Portfolio navigation">
    <button className={`rail-menu ${open ? 'open' : ''}`} type="button" onClick={onToggle} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="site-menu"><span/><span/><span/></button>
    <span className="rail-name">FOLIO — EDITION</span>
    <span className="rail-signature">SMIT BARVE</span>
    <span className="rail-year">© 2026</span>
  </aside>;
}

function ProjectVisual({ type, mini = false }) {
  return <div className={`visual ${type} ${mini ? 'mini' : ''}`} aria-hidden="true">
    <div className="visual-noise" />
    <div className="device">
      <div className="device-bar" />
      <div className="device-copy"><i/><i/><i/></div>
      <div className="device-orb" />
    </div>
    <span className="visual-label">{type === 'nw' ? 'NWIS / INTELLIGENCE' : type.toUpperCase()}</span>
  </div>;
}

function relativePlayTime(playedAt) {
  if (!playedAt) return 'RECENTLY PLAYED';
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(playedAt).getTime()) / 60000));
  if (minutes < 1) return 'PLAYED JUST NOW';
  if (minutes < 60) return `PLAYED ${minutes}M AGO`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `PLAYED ${hours}H AGO` : `PLAYED ${Math.floor(hours / 24)}D AGO`;
}

function SpotifyWidget() {
  const [track, setTrack] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch('/api/spotify');
        const data = await response.json();
        if (!response.ok || !data.track) throw new Error(data.error ?? 'NO_RECENT_TRACK');
        if (active) { setTrack(data.track); setStatus('ready'); }
      } catch (error) {
        if (active) setStatus(error.message === 'SPOTIFY_NOT_CONFIGURED' ? 'setup' : 'unavailable');
      }
    };
    load();
    const interval = window.setInterval(load, 60000);
    return () => { active = false; window.clearInterval(interval); };
  }, []);

  return <aside className={`spotify-widget ${status}`} aria-label="Smit's recently played Spotify track">
    {track?.image && <div className="spotify-backdrop" style={{ backgroundImage: `url(${track.image})` }} />}
    <div className="spotify-shade" />
    <div className="spotify-content">
      <div className="spotify-profile"><div><strong>Smit Barve</strong><span>{status === 'ready' ? relativePlayTime(track.playedAt) : 'SPOTIFY LISTENING'}</span></div><img src="/profile.jpg" alt="" /></div>
      <div className="spotify-divider" />
      {status === 'ready' ? <a className="spotify-track" href={track.url} target="_blank" rel="noreferrer">
        <img src={track.image} alt={`${track.album} album cover`} />
        <div><span>LAST PLAYED</span><strong>{track.title}</strong><p>{track.artists} · {track.album}</p></div>
      </a> : <div className="spotify-empty">
        <span>{status === 'loading' ? 'CHECKING SPOTIFY' : 'SPOTIFY CONNECTION NEEDED'}</span>
        <strong>{status === 'loading' ? 'Finding the latest track…' : 'Connect your listening history.'}</strong>
        {status !== 'loading' && <a href="/api/spotify/login">Connect Spotify →</a>}
      </div>}
    </div>
  </aside>;
}

function App() {
  const [loaded, setLoaded] = useState(false);
  const [year, setYear] = useState(2013);
  const [activeProject, setActiveProject] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const pointer = useRef(null);
  const story = useRef(null);
  const menuClose = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setYear(2026); setLoaded(true); return; }
    let current = 2013;
    const timer = window.setInterval(() => {
      current += 1;
      setYear(current);
      if (current >= 2026) {
        window.clearInterval(timer);
        window.setTimeout(() => setLoaded(true), 420);
      }
    }, 88);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1.08,
      touchMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      gestureOrientation: 'both',
      overscroll: true,
      anchors: true,
    });
    window.__portfolioLenis = lenis;
    let snapTimer = 0;
    let isSnapping = false;
    const scheduleSnap = () => {
      window.clearTimeout(snapTimer);
      if (isSnapping || !window.matchMedia('(min-width: 761px)').matches) return;
      snapTimer = window.setTimeout(() => {
        const chapterStops = [...document.querySelectorAll('.intro, .about, .work-reveal, .projects, .services, .clients')]
          .map((section) => section.offsetLeft);
        const current = lenis.targetScroll;
        const nearest = chapterStops.reduce((best, stop) =>
          Math.abs(stop - current) < Math.abs(best - current) ? stop : best, chapterStops[0] ?? 0);
        const distance = Math.abs(nearest - current);
        if (distance < 8) return;
        isSnapping = true;
        lenis.scrollTo(nearest, {
          duration: 0.72,
          easing: (progress) => 1 - Math.pow(1 - progress, 3),
          onComplete: () => { isSnapping = false; },
        });
      }, 220);
    };
    window.addEventListener('wheel', scheduleSnap, { passive: true });
    window.addEventListener('touchend', scheduleSnap, { passive: true });
    window.addEventListener('scrollend', scheduleSnap, { passive: true });
    let frame = 0;
    const tick = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      window.clearTimeout(snapTimer);
      window.removeEventListener('wheel', scheduleSnap);
      window.removeEventListener('touchend', scheduleSnap);
      window.removeEventListener('scrollend', scheduleSnap);
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete window.__portfolioLenis;
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    window.__portfolioLenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    menuClose.current?.focus();
    const closeOnEscape = (event) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.documentElement.style.removeProperty('overflow');
      window.__portfolioLenis?.start();
    };
  }, [menuOpen]);

  const navigateFromMenu = (event, selector) => {
    event.preventDefault();
    const target = selector === '#home' ? 0 : document.querySelector(selector)?.offsetLeft;
    setMenuOpen(false);
    window.setTimeout(() => window.__portfolioLenis?.scrollTo(target ?? 0, { duration: 1.1 }), 80);
  };

  useEffect(() => {
    const root = story.current;
    if (!root) return;
    const desktop = window.matchMedia('(min-width: 761px)');
    let frame = 0;
    const measure = () => {
      if (!desktop.matches) {
        document.body.style.removeProperty('height');
        root.style.removeProperty('transform');
        return;
      }
      const travel = Math.max(0, root.scrollWidth - window.innerWidth);
      document.body.style.height = `${travel + window.innerHeight}px`;
      update();
    };
    const update = () => {
      if (!desktop.matches) return;
      const travel = Math.max(0, root.scrollWidth - window.innerWidth);
      const x = Math.min(window.scrollY, travel);
      root.style.transform = `translate3d(${-x}px,0,0)`;
      const about = root.querySelector('.about');
      const work = root.querySelector('.work-reveal');
      if (about) root.style.setProperty('--about-progress', Math.max(0, Math.min(1, (x - about.offsetLeft + window.innerWidth) / (window.innerWidth * .72))));
      if (work) {
        const localTravel = Math.max(0, Math.min(window.innerWidth, x - work.offsetLeft));
        const progress = localTravel / window.innerWidth;
        const collage = work.querySelector('.mosaic');
        const collageWidth = collage?.offsetWidth || window.innerWidth * .173;
        const collageHeight = collage?.offsetHeight || window.innerHeight * .155;
        const coverScale = Math.max((window.innerWidth + 12) / collageWidth, (window.innerHeight + 12) / collageHeight);
        root.style.setProperty('--work-progress', progress);
        root.style.setProperty('--work-pin', `${localTravel}px`);
        root.style.setProperty('--work-scale', 0.01 + progress * (coverScale - 0.01));
        root.style.setProperty('--work-word-shift', `${progress * ((collageWidth * coverScale) / 2 + 10)}px`);
      }
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    desktop.addEventListener('change', measure);
    document.fonts.ready.then(measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      desktop.removeEventListener('change', measure);
      document.body.style.removeProperty('height');
    };
  }, []);

  useEffect(() => {
    const move = (event) => {
      if (!pointer.current) return;
      pointer.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return <>
    <div ref={pointer} className="cursor"><span>VIEW</span></div>
    <SideRail open={menuOpen} onToggle={() => setMenuOpen((value) => !value)} />
    <div id="site-menu" className={`menu-overlay ${menuOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Site navigation" aria-hidden={!menuOpen}>
      <button ref={menuClose} className="menu-close" type="button" onClick={() => setMenuOpen(false)}>CLOSE</button>
      <nav>
        {[
          ['01.', 'HOME', '#home'],
          ['02.', 'ABOUT', '#about'],
          ['03.', 'WORKS', '#works'],
          ['04.', 'CONTACT', '#contact'],
        ].map(([number, label, target]) => <a key={label} href={target} onClick={(event) => navigateFromMenu(event, target)}>
          <span>{number}</span><span>{label}</span>
        </a>)}
      </nav>
      <div className="menu-social"><a href="https://github.com/l3vith" target="_blank" rel="noreferrer">Github</a><span>Mumbai, India</span></div>
    </div>
    <main ref={story} id="top" className={`story ${loaded ? 'is-loaded' : 'is-loading'}`}>
    <section id="home" className="intro" aria-label="Introduction">
      <div className="year-mask"><div className="year">{year}</div></div>
      <p className="intro-kicker">A journey through years of building</p>
      <div className="hero-copy">
        <h1><span>SMIT</span><span>BARVE</span></h1>
        <p>Independent AI and product engineer based in India — focused on thoughtful, useful digital work.</p>
      </div>
      <div className="hero-meta">
        <span>INDIA<br/>GMT+5:30</span><span>Open for<br/>collaborations</span><a href="#about">SCROLL</a>
      </div>
    </section>

    <section id="about" className="about chapter">
      <header><span>CHAPTER I</span><span>ABOUT / 01</span></header>
      <SpotifyWidget />
      <h2>Hi, I’m Smit — an engineer building AI products, expressive interfaces, and local-first systems that turn complex technology into clear experiences.</h2>
      <p className="aside-copy">I care about the part where models, systems and interactions become one coherent product.</p>
      <div className="portrait"><img src="/profile.jpg" alt="Smit's profile artwork" /></div>
      <a className="text-link" href="#services">More about me <span>→</span></a>
    </section>

    <section className="work-reveal chapter" aria-label="Selected work">
      <div className="work-stage"><div className="work-title"><span>THE</span><div className="mosaic">
        {projects.slice(0, 6).map((project) => <ProjectVisual key={project.name} type={project.className} mini />)}
      </div><span>WORK</span></div></div>
    </section>

    <section id="works" className="projects chapter">
      <header><span>CHAPTER II</span><span>SELECTED WORK</span></header>
      <div className="project-stage">
        <article className="project-dossier">
          <div className="dossier-top"><span>PROJECT / {String(activeProject + 1).padStart(2, '0')}</span><span>SELECTED REPOSITORY</span></div>
          <p className="dossier-kind">{projects[activeProject].kind}</p>
          <h3>{projects[activeProject].name}</h3>
          <p className="dossier-description">{projects[activeProject].description}</p>
          <div className="dossier-footer">
            <div>{projects[activeProject].stack.map((item) => <span key={item}>{item}</span>)}</div>
            <a href={projects[activeProject].url} target="_blank" rel="noreferrer">VIEW ON GITHUB ↗</a>
          </div>
        </article>
      </div>
      <div className="project-list">
        {projects.map((project, index) => <a href={project.url} target="_blank" rel="noreferrer" key={project.name}
          className={activeProject === index ? 'active' : ''}
          onPointerEnter={() => setActiveProject(index)} onFocus={() => setActiveProject(index)}>
          <span>{project.name}</span><span>↗</span>
        </a>)}
      </div>
      <p className="projects-note">A selection of systems and experiences made across AI, product and creative technology.</p>
      <a className="text-link" href="https://github.com/l3vith?tab=repositories" target="_blank" rel="noreferrer">View all work <span>→</span></a>
    </section>

    <section id="services" className="services chapter">
      <header><span>CHAPTER III</span><span>WHAT I DO</span></header>
      <div className="service-strip">
        {services.map(([no, name, copy, description, tags], index) => <article key={no}
          className={activeService === index ? 'active' : ''}
          onPointerEnter={() => setActiveService(index)} onFocus={() => setActiveService(index)} tabIndex="0">
          <span className="service-no">{no}</span>
          <div className="service-feature">
            <span className="service-feature-label">CAPABILITY / {no}</span>
            <p>{description}</p>
            <div>{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
          <h3>{name.split('\n').map((line) => <React.Fragment key={line}>{line}<br/></React.Fragment>)}</h3>
          <p className="service-summary">{copy}</p>
        </article>)}
      </div>
    </section>

    <section id="contact" className="clients chapter">
      <header><span>CHAPTER IV</span><span>TOOLS & COLLABORATIONS</span></header>
      <div className="client-list"><span>React & Rust</span><span>Local AI</span><span>MLX & Vision</span><span>Creative Systems</span><span>Open Source</span><span>And more</span></div>
      <p>Have an ambitious product or an interesting technical problem?</p>
      <a href="mailto:smitbarve666@gmail.com">LET’S WORK TOGETHER ↗</a>
    </section>
    </main>
  </>;
}

createRoot(document.getElementById('root')).render(<App />);
