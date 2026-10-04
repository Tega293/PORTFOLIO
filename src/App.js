import { useEffect, useRef, useState } from 'react';
import './App.css';

const projects = [
  {
    number: '01',
    name: 'Recipe Central',
    category: 'Food & lifestyle',
    address: 'clone-pi-amber.vercel.app',
    theme: 'recipe-central',
    brand: 'Recipe Central',
    nav: ['Recipes', 'Drinks', 'Contact'],
    action: 'Find a recipe',
    eyebrow: 'GOOD FOOD, MADE MEMORABLE',
    headline: 'Find your next favourite.',
    previewCopy: 'Thoughtful recipes and a little inspiration for whatever is on the menu.',
    previewLink: 'Explore the home page',
    liveUrl: 'https://clone-pi-amber.vercel.app/',
    description:
      'Recipe Central welcomes home cooks with a food-photo carousel, quick recipe search and nine featured dishes, then invites them to explore a collection of 45 recipes from around the world.',
    tags: ['Homepage experience', 'Featured recipes', 'Responsive React app'],
    challenge:
      'Make a growing recipe collection feel welcoming from the first visit, while giving people a quick way to find inspiration and start browsing.',
    response:
      'Lead with vibrant food photography, a clear search entry point and a curated nine-recipe preview that connects straight to the full collection.',
  },
  {
    number: '02',
    name: 'Vela',
    category: 'Digital experience',
    address: 'vela.life',
    theme: 'vela',
    brand: 'vela',
    nav: ['Our approach', 'Journal', 'Membership'],
    action: 'Begin gently',
    eyebrow: 'Room to reset',
    headline: 'Make space for what matters.',
    previewCopy: 'Simple rituals for a more intentional everyday.',
    previewLink: 'Find your rhythm',
    description:
      'Wellbeing should feel like room to breathe, not another goal to chase. Vela makes space for small, restorative rituals with a gentle rhythm and an interface that invites people back without pressure.',
    tags: ['Experience design', 'Art direction', 'Prototyping'],
    challenge:
      'Make daily reflection feel welcoming for people whose schedules and energy change from day to day.',
    response:
      'Pair flexible routines with warm editorial guidance, soft visual cues and progress that never feels like a scorecard.',
  },
  {
    number: '03',
    name: 'Form & Field',
    category: 'Brand & web',
    address: 'formandfield.studio',
    theme: 'field',
    brand: 'FORM & FIELD',
    nav: ['Studio', 'Projects', 'Notes'],
    action: 'Let’s talk',
    eyebrow: 'Independent by nature',
    headline: 'Made for the curious.',
    previewCopy: 'Thoughtful identities for places with a point of view.',
    previewLink: 'Meet the studio',
    description:
      'A small independent studio needed a digital home that felt grounded yet unmistakably its own. Form & Field brings tactile materials, confident typography and generous editorial space into one flexible identity.',
    tags: ['Brand identity', 'Web design', 'Creative direction'],
    challenge:
      'Capture a hands-on studio practice without leaning on the familiar language of a generic agency site.',
    response:
      'Create a modular visual system that pairs a confident wordmark with natural color, spacious layouts and vivid project stories.',
  },
];

const processSteps = [
  {
    number: '01',
    title: 'Listen & frame',
    copy: 'Understand the people, constraints and opportunity before deciding what to make.',
  },
  {
    number: '02',
    title: 'Explore the idea',
    copy: 'Map the experience, test directions and find a visual language with a point of view.',
  },
  {
    number: '03',
    title: 'Refine the details',
    copy: 'Shape the system, tune the interactions and make important moments feel effortless.',
  },
  {
    number: '04',
    title: 'Build & learn',
    copy: 'Bring the work to life, check it across screens and leave a solid foundation to grow.',
  },
];

const capabilities = [
  {
    number: '01 / Intelligence',
    title: 'AI & machine learning',
    copy: 'Explore how machine learning can turn data and complex workflows into useful, responsible product experiences.',
  },
  {
    number: '02 / Front end',
    title: 'Web development',
    copy: 'Build responsive, accessible interfaces with clear structure, purposeful interaction and careful visual detail.',
  },
  {
    number: '03 / Back end',
    title: 'Application development',
    copy: 'Shape the application logic, data flows and integrations that make digital products work reliably.',
  },
  {
    number: '04 / Product',
    title: 'Product design',
    copy: 'Connect user needs, product direction and interface design into experiences that feel coherent from start to finish.',
  },
  {
    number: '05 / Security',
    title: 'Penetration testing',
    copy: 'Apply a security-minded perspective informed by professional penetration-testing certification.',
  },
];

const navItems = [
  ['work', 'Work'],
  ['approach', 'Approach'],
  ['about', 'About'],
  ['experience', 'Résumé'],
  ['certifications', 'Certificates'],
  ['socials', 'Socials'],
  ['contact', 'Contact'],
];

const portfolioStats = [
  { key: 'projects', label: 'Projects delivered', target: 128, suffix: '+' },
  { key: 'clients', label: 'Satisfied customers', target: 128, suffix: '+' },
  { key: 'goal', label: 'Project goal', target: 1000, suffix: '+' },
];

const socialLinks = [
  { name: 'LinkedIn', detail: 'Professional network', href: 'https://www.linkedin.com/', icon: 'linkedin' },
  { name: 'WhatsApp', detail: 'Message me directly', href: 'https://wa.me/2347047175423', icon: 'whatsapp' },
  { name: 'Twitter', detail: 'Ideas & updates', href: 'https://twitter.com/', icon: 'twitter' },
  { name: 'Instagram', detail: 'Visual notes', href: 'https://www.instagram.com/', icon: 'instagram' },
];

// Add certificates here after placing their files in public/certifications.
const certificationDocuments = [
  {
    title: 'AI/ML Engineering',
    issuer: 'Certification details to add',
    year: '',
    file: '',
  },
  {
    title: 'Front-end Web Development',
    issuer: 'Certification details to add',
    year: '',
    file: '',
  },
  {
    title: 'Back-end Web Development',
    issuer: 'Certification details to add',
    year: '',
    file: '',
  },
  {
    title: 'Product Design',
    issuer: 'Certification details to add',
    year: '',
    file: '',
  },
  {
    title: 'Penetration Testing',
    issuer: 'Certificate earned · issuer and date to add',
    year: '',
    file: '',
    url: 'https://drive.google.com/file/d/1zJqRAiVit9XPgfAaeMHx1gDND5T03mcj/view?usp=drive_link',
  },
];

function getSavedTheme() {
  try {
    return window.localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

function AlgorithmMark() {
  return (
    <div className="algorithm-art" aria-hidden="true">
      <div className="algorithm-ring algorithm-ring-one" />
      <div className="algorithm-ring algorithm-ring-two" />
      <div className="algorithm-network">
        {Array.from({ length: 8 }, (_, index) => (
          <i className="algorithm-spoke" key={`spoke-${index}`} />
        ))}
        {Array.from({ length: 8 }, (_, index) => (
          <i className="algorithm-node" key={`node-${index}`} />
        ))}
      </div>
      <div className="algorithm-runner" />
      <div className="algorithm-core">
        <span className="algorithm-monogram">TB</span>
        <span className="algorithm-caption">creative system</span>
      </div>
    </div>
  );
}

function ProjectArtwork({ project }) {
  if (project.liveUrl) {
    return (
      <a className="project-artwork recipe-central-live" href={project.liveUrl} target="_blank" rel="noreferrer" aria-label="Open the Recipe Central home page">
        <div className="browser-frame">
          <div className="browser-bar">
            <i /><i /><i />
            <span>{project.address}</span>
          </div>
          <div className="recipe-central-viewport">
            <iframe
              title="Recipe Central home page preview"
              src={project.liveUrl}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
        </div>
        <span className="recipe-central-open">Open Recipe Central <span aria-hidden="true">↗</span></span>
      </a>
    );
  }

  return (
    <div className={`project-artwork ${project.theme}`} aria-hidden="true">
      <div className="browser-frame">
        <div className="browser-bar">
          <i />
          <i />
          <i />
          <span>{project.address}</span>
        </div>
        <div className="website-preview">
          <div className="website-nav">
            <strong>{project.brand}</strong>
            <div className="website-links">
              {project.nav.map((item) => <span key={item}>{item}</span>)}
              <b>{project.action}</b>
            </div>
          </div>
          <div className="website-hero">
            <div className="website-copy">
              <small>{project.eyebrow}</small>
              <h4>{project.headline}</h4>
              <p>{project.previewCopy}</p>
              <span className="website-cta">{project.previewLink} <b>→</b></span>
            </div>
            <div className="website-visual">
              {project.theme === 'northstar' && (
                <div className="mini-dashboard">
                  <span>Weekly overview</span>
                  <div className="mini-stats"><i /><i /><i /></div>
                  <div className="mini-chart">
                    {[35, 68, 48, 86, 61, 95, 72].map((height, index) => (
                      <i key={index} style={{ '--bar-height': `${height}%` }} />
                    ))}
                  </div>
                </div>
              )}
              {project.theme === 'vela' && <div className="vela-orb"><i /></div>}
              {project.theme === 'field' && (
                <div className="field-art"><span>F <i>+</i> F</span><small>STUDIO Nº 01</small></div>
              )}
            </div>
          </div>
          <div className="website-bottom-line"><i /><i /><i /></div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <article className={`project-row ${project.theme}`} data-reveal>
      <ProjectArtwork project={project} />
      <div className="project-copy">
        <div className="project-meta"><span>{project.number} / {project.category}</span><span>Concept case study</span></div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <div className="project-tags">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        {project.liveUrl && <a className="project-live-link" href={project.liveUrl} target="_blank" rel="noreferrer">Visit Recipe Central <span aria-hidden="true">↗</span></a>}
        <details className="case-study">
          <summary>Explore the case study</summary>
          <div className="case-study-body">
            <div><span>The challenge</span><p>{project.challenge}</p></div>
            <div><span>The response</span><p>{project.response}</p></div>
          </div>
        </details>
      </div>
    </article>
  );
}

function SocialGlyph({ type }) {
  if (type === 'linkedin') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 3.5a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2ZM3.4 9h3.7v11.5H3.4V9Zm6 0h3.5v1.6h.1c.5-.9 1.7-1.9 3.5-1.9 3.8 0 4.5 2.5 4.5 5.7v6.1h-3.7v-5.4c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9v5.5H9.4V9Z" /></svg>;
  }

  if (type === 'whatsapp') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.1 11.7a8.1 8.1 0 0 1-12 7.1L4 20l1.2-4A8.1 8.1 0 1 1 20.1 11.7Z" /><path d="M9 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4 0 .6.5.8 1.2 1.5 2 1.9.2.1.4.1.6-.1l.8-.9c.2-.2.4-.2.7-.1l1.7.8c.3.1.4.3.4.5 0 .4-.2 1.1-.7 1.5-.5.4-1.1.6-1.8.5-1-.1-2.4-.7-3.9-2-1.2-1.1-2-2.5-2.2-3.5-.2-1 .2-1.8.6-2.3Z" /></svg>;
  }

  if (type === 'twitter') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8 8 12.2h-6.3L12 14.6 5.5 22H2.4l7.3-8.4L2 2h6.5l4.4 6.8L18.9 2Zm-1.1 17.9h1.7L7.7 4H5.9l11.9 15.9Z" /></svg>;
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle className="social-icon-dot" cx="17.7" cy="6.5" r="1" /></svg>;
}

function App() {
  const portfolioRef = useRef(null);
  const themeTimer = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('work');
  const [theme, setTheme] = useState(getSavedTheme);
  const [themeTransition, setThemeTransition] = useState(false);
  const [statCounts, setStatCounts] = useState({ projects: 0, clients: 0, goal: 0 });

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
    document.documentElement.dataset.theme = theme;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) themeColorMeta.content = theme === 'light' ? '#f6f2e9' : '#030916';
    try {
      window.localStorage.setItem('portfolio-theme', theme);
    } catch {
      // The theme still works for this session when storage is unavailable.
    }
  }, [theme]);

  useEffect(() => () => window.clearTimeout(themeTimer.current), []);

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.setAttribute('data-revealed', 'true'));
      return undefined;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-revealed', 'true');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
    revealElements.forEach((element) => revealObserver.observe(element));

    const statsSection = document.getElementById('portfolio-stats');
    let animationFrame = null;
    let hasStarted = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const statsObserver = statsSection ? new IntersectionObserver((entries, observer) => {
      if (hasStarted || !entries.some((entry) => entry.isIntersecting)) return;
      hasStarted = true;
      observer.disconnect();
      if (reducedMotion) {
        setStatCounts(Object.fromEntries(portfolioStats.map(({ key, target }) => [key, target])));
        return;
      }
      const startTime = performance.now();
      const duration = 2200;
      const animateCounts = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        setStatCounts(Object.fromEntries(portfolioStats.map(({ key, target }) => [key, Math.round(target * eased)])));
        if (progress < 1) animationFrame = window.requestAnimationFrame(animateCounts);
      };
      animationFrame = window.requestAnimationFrame(animateCounts);
    }, { rootMargin: '0px 0px 12% 0px', threshold: 0.12 }) : null;
    if (statsSection && statsObserver) statsObserver.observe(statsSection);

    return () => {
      revealObserver.disconnect();
      statsObserver?.disconnect();
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const sections = navItems
      .map(([id]) => document.getElementById(id))
      .filter(Boolean);
    if (!('IntersectionObserver' in window) || sections.length === 0) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.2, 0.5] });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function handlePointerMove(event) {
    if (event.pointerType === 'touch' || !portfolioRef.current) return;
    const bounds = portfolioRef.current.getBoundingClientRect();
    portfolioRef.current.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    portfolioRef.current.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    portfolioRef.current.style.setProperty('--pointer-active', '1');
  }

  function handlePointerLeave() {
    portfolioRef.current?.style.setProperty('--pointer-active', '0');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function switchTheme() {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
    setThemeTransition(true);
    window.clearTimeout(themeTimer.current);
    themeTimer.current = window.setTimeout(() => setThemeTransition(false), 850);
  }

  return (
    <div
      className="portfolio"
      data-theme={theme}
      ref={portfolioRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {themeTransition && <div className={`theme-transition theme-${theme}`} aria-hidden="true" />}
      <div className="portfolio-shell">
        <header className="site-header">
          <a className="brand" href="#top" aria-label="Tegabyte, portfolio home" onClick={closeMenu}>
            <span className="brand-mark">TB</span>
            <span className="brand-name">TEGABYTE <i>/ PORTFOLIO</i></span>
          </a>
          <button
            className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            <span /><span />
          </button>
          {menuOpen && <button className="nav-scrim" type="button" aria-label="Close navigation" onClick={closeMenu} />}
          <nav id="primary-navigation" className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Portfolio navigation">
            {navItems.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className={id === 'contact' ? 'nav-contact' : ''}
                aria-current={activeSection === id ? 'location' : undefined}
                onClick={closeMenu}
              >
                {label}{id === 'contact' && <span aria-hidden="true">↗</span>}
              </a>
            ))}
            <button
              className="theme-toggle"
              type="button"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-pressed={theme === 'light'}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              onClick={switchTheme}
            >
              <span className={`theme-icon theme-icon-${theme}`} aria-hidden="true">{theme === 'dark' ? '☼' : '☾'}</span>
              <span className="theme-label">Switch to {theme === 'dark' ? 'light' : 'dark'} mode</span>
            </button>
          </nav>
        </header>

        <main id="top">
          <section className="hero" aria-labelledby="hero-title" data-reveal>
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" />AI/ML Engineer · Web Developer · Product Designer</div>
              <h1 id="hero-title">Useful ideas, made <span>beautiful.</span></h1>
              <p className="hero-intro">I’m Oghenetega Oyibocha Emmanuel, an AI/ML engineer, web developer and product designer. I build thoughtful digital products and intelligent tools, and I’m open to roles, freelance work and collaborations.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#work">Explore selected work <span aria-hidden="true">↘</span></a>
                <a className="button button-quiet" href="#about">A little about me <span aria-hidden="true">→</span></a>
              </div>
              <div className="availability"><span />Open to roles, freelance work & collaborations</div>
            </div>
            <div className="hero-visual">
              <div className="visual-grid" aria-hidden="true" />
              <span className="visual-side-note" aria-hidden="true">Clarity · Craft · Curiosity</span>
              <AlgorithmMark />
              <div className="visual-caption"><strong>Design meets technology</strong><span>Interfaces with a human point of view</span></div>
            </div>
          </section>

          <section className="work section" id="work" aria-labelledby="work-title">
            <div className="section-heading">
              <div><span className="section-kicker">A few things I’ve made</span><h2 id="work-title">Selected work</h2></div>
              <a className="text-link" href="#contact">Have a project in mind? <span aria-hidden="true">↗</span></a>
            </div>
            <div className="projects-list">{projects.map((project) => <ProjectCard key={project.number} project={project} />)}</div>
          </section>

          <section className="portfolio-stats section" id="portfolio-stats" aria-labelledby="stats-title" data-reveal>
            <div className="stats-heading">
              <div><span className="section-kicker">A snapshot of the journey</span><h2 id="stats-title">Building with purpose.</h2></div>
              <p>Small, considered steps add up to ambitious work. Here’s the momentum I’m working toward.</p>
            </div>
            <div className="stats-grid">
              {portfolioStats.map(({ key, label, suffix }) => (
                <article className="stat-card" key={key}>
                  <span className="stat-number">{statCounts[key].toLocaleString()}{suffix}</span>
                  <span className="stat-label">{label}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="approach section" id="approach" aria-labelledby="approach-title" data-reveal>
            <div className="section-heading">
              <div><span className="section-kicker">A thoughtful way to make things</span><h2 id="approach-title">From first question to final detail.</h2></div>
              <a className="text-link" href="#contact">Let’s work together <span aria-hidden="true">↗</span></a>
            </div>
            <p className="approach-intro">The best work comes from a clear idea, shared early and improved with care. Each project moves at a steady pace, with room for exploration and a clear next step.</p>
            <div className="process-grid">
              {processSteps.map((step) => (
                <article className="process-card" key={step.number}>
                  <span className="process-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="capabilities section" aria-labelledby="capabilities-title" data-reveal>
            <div className="capabilities-heading">
              <div><span className="section-kicker">A connected skill set</span><h2 id="capabilities-title">One idea, carried all the way through.</h2></div>
              <p>Bring me in for a focused design challenge or for the full journey from early direction to a polished, build-ready experience.</p>
            </div>
            <div className="capability-grid">
              {capabilities.map((capability) => (
                <article className="capability-card" key={capability.number}>
                  <span>{capability.number}</span>
                  <h3>{capability.title}</h3>
                  <p>{capability.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="about section" id="about" aria-labelledby="about-title" data-reveal>
            <div><span className="section-kicker">A little about me</span><h2 id="about-title">Oghenetega Oyibocha Emmanuel</h2></div>
            <div>
              <p>I’m an AI/ML engineer, web developer and product designer working at the intersection of intelligent technology and human-centered experiences. I enjoy turning complex ideas into useful products, from the underlying logic and code to the interface people see and use. I’m also a certified penetration tester, bringing a security-aware perspective to the way I build.</p>
              <p>As a freelancer, I partner with people and teams to take ideas from early thinking through design and development. I’m working toward building a startup of my own, and I’m open to full-time opportunities, freelance projects and collaborations where I can contribute, keep learning and make meaningful work.</p>
              <div className="skills" aria-label="Areas of focus">
                {['AI/ML engineering', 'Front-end development', 'Back-end development', 'Product design', 'Penetration testing', 'Freelance', 'Startup building'].map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </div>
          </section>

          <section className="experience section" id="experience" aria-labelledby="experience-title" data-reveal>
            <span className="section-kicker">The path so far</span>
            <h2 id="experience-title">Current focus</h2>
            <div className="timeline-entry"><span>INDEPENDENT</span><div><strong>Freelance · AI/ML, web development & product design</strong><p>Open to freelance projects, full-time roles and collaborations. I bring engineering and design together to help turn ideas into useful digital products.</p></div></div>
            <div className="timeline-entry"><span>IN DEVELOPMENT</span><div><strong>Startup venture · Founder in progress</strong><p>Developing an idea of my own into a considered product, from early problem framing through design and technical exploration.</p></div></div>
          </section>

          <section className="certifications section" id="certifications" aria-labelledby="certifications-title" data-reveal>
            <div className="section-heading">
              <div><span className="section-kicker">Learning, recognized</span><h2 id="certifications-title">Certifications</h2></div>
              <span className="certificate-folder">/public/certifications</span>
            </div>
            {certificationDocuments.length > 0 ? (
              <div className="certificate-grid">
                {certificationDocuments.map((certificate) => (
                  <article className="certificate-card" key={certificate.file || certificate.title}>
                    <span className="certificate-icon" aria-hidden="true">↗</span>
                    <div><h3>{certificate.title}</h3><p>{certificate.issuer}{certificate.year ? ` · ${certificate.year}` : ''}</p></div>
                    {certificate.url || certificate.file ? (
                      <a href={certificate.url || `/certifications/${certificate.file}`} target="_blank" rel="noreferrer">View certificate <span aria-hidden="true">↗</span></a>
                    ) : (
                      <span className="certificate-pending">Add document in <code>/public/certifications</code></span>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="certificate-empty">
                <span className="certificate-icon" aria-hidden="true">＋</span>
                <div><h3>Your credentials go here</h3><p>Add PDF or image files to <code>public/certifications</code>, then list each file in <code>certificationDocuments</code> in <code>src/App.js</code>.</p></div>
              </div>
            )}
          </section>

          <section className="socials section" id="socials" aria-labelledby="socials-title" data-reveal>
            <div className="section-heading">
              <div><span className="section-kicker">Let’s stay connected</span><h2 id="socials-title">Find me around the web.</h2></div>
              <p className="socials-intro">For professional conversations, quick messages or a glimpse of what I’m exploring.</p>
            </div>
            <div className="social-grid">
              {socialLinks.map((social) => (
                <a className={`social-card social-${social.icon}`} href={social.href} key={social.name} target="_blank" rel="noreferrer" aria-label={`${social.name}: ${social.detail}`}>
                  <span className="social-icon"><SocialGlyph type={social.icon} /></span>
                  <span className="social-copy"><strong>{social.name}</strong><small>{social.detail}</small></span>
                  <span className="social-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </section>

          <section className="contact-card" id="contact" aria-labelledby="contact-title" data-reveal>
            <div><span className="section-kicker">Have a good one in mind?</span><h2 id="contact-title">Let’s make something meaningful.</h2><p>Share the challenge, the big idea or the early sketch. I’m always happy to start with a thoughtful conversation.</p></div>
            <a className="button button-primary" href="mailto:oyibochaoghenetega5@gmail.com?subject=Let%E2%80%99s%20make%20something%20meaningful">Start a conversation <span aria-hidden="true">↗</span></a>
          </section>

          <footer className="site-footer">
            <span><strong>Let’s make something meaningful.</strong><a href="mailto:oyibochaoghenetega5@gmail.com">oyibochaoghenetega5@gmail.com</a></span>
            <span>© {new Date().getFullYear()} Tegabyte <i>·</i> Built with intention</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
