import { Fragment, useEffect, useRef, useState } from 'react';
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
    name: 'AssureX',
    category: 'Warranty claim assessment',
    address: 'assurrex-odyw.vercel.app',
    theme: 'assurrex',
    brand: 'ASSUREX',
    nav: ['How it works', 'Coverage', 'About'],
    action: 'Start a claim',
    eyebrow: 'SMART WARRANTY CLAIM ASSESSMENT',
    headline: 'Warranty claims, made clearer.',
    previewCopy: 'Upload your receipt, check coverage, and understand our recommendation before you proceed.',
    previewLink: 'Explore AssureX',
    liveUrl: 'https://assurrex-odyw.vercel.app/',
    description:
      'AssureX is a competition prototype for warranty-claim intake, receipt OCR, Python-based structured-data scoring, Google Teachable Machine (GTM) claim-card scoring and human review. Its policies and model-training records are synthetic examples, not manufacturer warranties or evidence of real-world accuracy.',
    tags: ['Warranty claim intake', 'Receipt OCR & Python scoring', 'GTM scoring & human review'],
    challenge:
      'Make a complex claim assessment easier to follow while giving people clear explanations and a human-review path for uncertain cases.',
    response:
      'Combine receipt OCR, structured-data scoring in Python and GTM claim-card scoring with human review. The demo policies and training records are synthetic; its outcomes do not establish manufacturer coverage or real-world model accuracy.',
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
  ['ai-lab', 'AI Lab'],
  ['approach', 'Approach'],
  ['about', 'About'],
  ['experience', 'Résumé'],
  ['certifications', 'Certificates'],
  ['socials', 'Socials'],
  ['contact', 'Contact'],
];

const primaryNavItems = [
  ['work', 'Selected Work'],
  ['approach', 'Philosophy'],
  ['ai-lab', 'Engineering Lab'],
  ['contact', 'Inquire'],
];

const moreNavItems = [
  ['about', 'About'],
  ['experience', 'Résumé'],
  ['certifications', 'Certificates'],
  ['socials', 'Socials'],
];

const portfolioStats = [
  { key: 'projects', label: 'Projects delivered', target: 128, suffix: '+' },
  { key: 'clients', label: 'Satisfied customers', target: 128, suffix: '+' },
  { key: 'goal', label: 'Project goal', target: 1000, suffix: '+' },
];

const socialLinks = [
  { name: 'LinkedIn', detail: 'Professional network', href: 'https://www.linkedin.com/', icon: 'linkedin' },
  { name: 'GitHub', detail: 'Code & projects', href: 'https://github.com/Tega293', icon: 'github' },
  { name: 'WhatsApp', detail: 'Message me directly', href: 'https://wa.me/2347047175423', icon: 'whatsapp' },
  { name: 'Twitter', detail: 'Ideas & updates', href: 'https://twitter.com/', icon: 'twitter' },
  { name: 'Instagram', detail: 'Visual notes', href: 'https://www.instagram.com/', icon: 'instagram' },
];

const aiLabTools = [
  { key: 'neural', name: 'Neural Network Playground', type: 'Forward-pass sandbox', note: 'A tiny teaching model with fixed illustrative weights. Toggle input signals to watch activations change; this is a visualization, not a trained or predictive model.' },
  { key: 'attention', name: 'Attention Map Explorer', type: 'Transformer internals', note: 'Explore a small illustrative self-attention matrix. Select a query token, inspect how attention is distributed, and toggle causal masking.' },
  { key: 'embedding', name: 'Embedding Space Mapper', type: 'Vector geometry', note: 'Drag the demo points to change their positions and see nearest neighbours update using two-dimensional Euclidean distance.' },
  { key: 'threshold', name: 'Decision Threshold Lab', type: 'Model evaluation', note: 'Move the classification threshold across a synthetic set of scored examples and watch precision, recall and the confusion matrix update.' },
  { key: 'retrieval', name: 'Retrieval Playground', type: 'Search & ranking', note: 'Change the query and top-k setting to see a transparent keyword-based retrieval demo rerank a tiny document set.' },
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
      <a className="project-artwork live-project-artwork" href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Open the ${project.name} home page`}>
        <div className="browser-frame">
          <div className="browser-bar">
            <i /><i /><i />
            <span>{project.address}</span>
          </div>
          <div className="project-live-viewport">
            <iframe
              title={`${project.name} home page preview`}
              src={project.liveUrl}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
        </div>
        <span className="project-live-open">Open {project.name} <span aria-hidden="true">↗</span></span>
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
        <div className="project-meta"><span>{project.number} / {project.category}</span><span>{project.liveUrl ? 'Live project' : 'Concept study'}</span></div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <div className="project-tags">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        {project.liveUrl && <a className="project-live-link" href={project.liveUrl} target="_blank" rel="noreferrer">Visit {project.name} <span aria-hidden="true">↗</span></a>}
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
  if (type === 'github') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.11.79-.25.79-.56v-2.03c-3.22.7-3.9-1.37-3.9-1.37-.52-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.57-.29-5.27-1.29-5.27-5.73 0-1.27.45-2.3 1.19-3.11-.12-.29-.52-1.47.11-3.07 0 0 .97-.31 3.16 1.19a10.97 10.97 0 0 1 5.76 0c2.19-1.5 3.15-1.19 3.15-1.19.63 1.6.24 2.78.12 3.07.74.81 1.18 1.84 1.18 3.11 0 4.45-2.7 5.43-5.28 5.72.42.36.78 1.06.78 2.14v3.08c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>;
  }

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

function NeuralNetworkPlayground({ onTone }) {
  const [signals, setSignals] = useState([1, 0, 1]);
  const hidden = [
    1 / (1 + Math.exp(-(signals[0] * 1.2 - signals[1] * .8 + signals[2] * .5 - .3))),
    1 / (1 + Math.exp(-(-signals[0] * .5 + signals[1] * 1.1 + signals[2] * .8 - .2))),
  ];
  const output = 1 / (1 + Math.exp(-(hidden[0] * 1.1 + hidden[1] * .9 - .7)));
  const inputY = [69, 130, 191];
  const hiddenY = [98, 162];
  function toggleSignal(index) {
    setSignals((current) => current.map((value, i) => (i === index ? 1 - value : value)));
    onTone(440 + index * 90);
  }
  return (
    <div className="lab-tool-display neural-display">
      <div className="lab-display-heading"><span>LIVE FORWARD PASS</span><span>3 INPUTS · 2 HIDDEN · 1 OUTPUT</span></div>
      <svg className="neural-diagram" viewBox="0 0 460 250" role="group" aria-label="Interactive neural network diagram">
        <text x="48" y="24">INPUT</text><text x="193" y="24">HIDDEN</text><text x="355" y="24">OUTPUT</text>
        {inputY.map((y, i) => hiddenY.map((hy, j) => <line key={`a-${i}-${j}`} x1="93" y1={y} x2="198" y2={hy} className={signals[i] ? 'edge-on' : 'edge-off'} />))}
        {hiddenY.map((y, i) => <line key={`b-${i}`} x1="236" y1={y} x2="351" y2="130" className={hidden[i] > .5 ? 'edge-on' : 'edge-off'} />)}
        {inputY.map((y, i) => (
          <g key={`input-${i}`} className="diagram-node is-clickable" role="button" tabIndex="0" aria-label={`Toggle input ${['signal', 'context', 'novelty'][i]}, currently ${signals[i] ? 'active' : 'inactive'}`} onClick={() => toggleSignal(i)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSignal(i); } }}>
            <circle cx="70" cy={y} r="23" className={signals[i] ? 'node-on' : 'node-off'} /><text x="70" y={y + 5} textAnchor="middle">{signals[i] ? '1' : '0'}</text><text x="17" y={y + 4} textAnchor="end" className="node-label">{['signal', 'context', 'novelty'][i]}</text>
          </g>
        ))}
        {hiddenY.map((y, i) => <g key={`hidden-${i}`}><circle cx="216" cy={y} r="19" className="node-hidden" style={{ opacity: .35 + hidden[i] * .65 }} /><text x="216" y={y + 4} textAnchor="middle">{hidden[i].toFixed(2)}</text></g>)}
        <g><circle cx="374" cy="130" r="28" className="node-output" style={{ strokeWidth: 1.5 + output * 4 }} /><text x="374" y="135" textAnchor="middle">{output.toFixed(2)}</text></g>
      </svg>
      <div className="lab-diagram-foot"><span>Click an input node to toggle its activation.</span><strong>Demo score <b>{Math.round(output * 100)}%</b></strong></div>
    </div>
  );
}

const attentionTokens = ['the', 'model', 'uses', 'context'];
const attentionVectors = [[.9, .2, .1], [.7, .8, .2], [.1, .8, .7], [.2, .3, .95]];

function AttentionExplorer({ onTone }) {
  const [query, setQuery] = useState(1);
  const [maskFuture, setMaskFuture] = useState(true);
  const [focusCell, setFocusCell] = useState([1, 2]);
  const matrix = attentionVectors.map((q, row) => {
    const scores = attentionVectors.map((key, column) => {
      if (maskFuture && column > row) return 0;
      return Math.exp(q.reduce((sum, value, i) => sum + value * key[i], 0) / Math.sqrt(q.length));
    });
    const total = scores.reduce((sum, value) => sum + value, 0);
    return scores.map((score) => total ? score / total : 0);
  });
  function selectCell(row, column) {
    setQuery(row);
    setFocusCell([row, column]);
    onTone(420 + column * 70);
  }
  return (
    <div className="lab-tool-display attention-display">
      <div className="lab-display-heading"><span>SELF-ATTENTION MAP</span><button className="mask-toggle" type="button" aria-pressed={maskFuture} onClick={() => { setMaskFuture((value) => !value); onTone(580); }}>{maskFuture ? '◧ Causal mask on' : '□ Causal mask off'}</button></div>
      <div className="attention-grid" role="grid" aria-label="Attention weight matrix. Rows are query tokens, columns are key tokens.">
        <span className="attention-corner">Q ↓ / K →</span>{attentionTokens.map((token, i) => <span className="attention-axis" key={`col-${token}`}>{token}</span>)}
        {matrix.map((row, rowIndex) => <Fragment key={`row-${rowIndex}`}>
          <button type="button" className={`attention-axis attention-row${query === rowIndex ? ' is-query' : ''}`} onClick={() => { setQuery(rowIndex); onTone(400 + rowIndex * 60); }}>{attentionTokens[rowIndex]}</button>
          {row.map((weight, colIndex) => <button type="button" role="gridcell" key={`${rowIndex}-${colIndex}`} className={`attention-cell${focusCell[0] === rowIndex && focusCell[1] === colIndex ? ' is-focused' : ''}${maskFuture && colIndex > rowIndex ? ' is-masked' : ''}`} style={{ '--weight': weight }} aria-label={`${attentionTokens[rowIndex]} attends to ${attentionTokens[colIndex]}: ${Math.round(weight * 100)} percent${maskFuture && colIndex > rowIndex ? ', masked' : ''}`} onClick={() => selectCell(rowIndex, colIndex)}><span>{Math.round(weight * 100)}%</span></button>)}
        </Fragment>)}
      </div>
      <div className="lab-diagram-foot"><span>Query: <b>{attentionTokens[query]}</b> · selected key: <b>{attentionTokens[focusCell[1]]}</b></span><strong>Weight <b>{Math.round(matrix[focusCell[0]][focusCell[1]] * 100)}%</b></strong></div>
    </div>
  );
}

const initialEmbeddings = [
  { id: 'cat', label: 'cat', x: 92, y: 78 }, { id: 'kitten', label: 'kitten', x: 144, y: 113 },
  { id: 'puppy', label: 'puppy', x: 286, y: 178 }, { id: 'dog', label: 'dog', x: 345, y: 135 },
  { id: 'pasta', label: 'pasta', x: 86, y: 194 }, { id: 'noodles', label: 'noodles', x: 141, y: 177 },
];

function EmbeddingMapper({ onTone }) {
  const [points, setPoints] = useState(initialEmbeddings);
  const [selected, setSelected] = useState('cat');
  const [dragging, setDragging] = useState(null);
  const svgRef = useRef(null);
  const anchor = points.find(({ id }) => id === selected) || points[0];
  const neighbors = points.filter(({ id }) => id !== anchor.id).map((point) => ({ ...point, distance: Math.hypot(point.x - anchor.x, point.y - anchor.y) })).sort((a, b) => a.distance - b.distance).slice(0, 2);
  function pointerPosition(event) {
    const rect = svgRef.current.getBoundingClientRect();
    return { x: Math.max(32, Math.min(428, (event.clientX - rect.left) * 460 / rect.width)), y: Math.max(34, Math.min(226, (event.clientY - rect.top) * 260 / rect.height)) };
  }
  function updatePointer(event) {
    if (!dragging) return;
    const position = pointerPosition(event);
    setPoints((current) => current.map((point) => point.id === dragging ? { ...point, ...position } : point));
  }
  function movePoint(id, dx, dy) {
    setPoints((current) => current.map((point) => point.id === id ? { ...point, x: Math.max(32, Math.min(428, point.x + dx)), y: Math.max(34, Math.min(226, point.y + dy)) } : point));
  }
  function reset() { setPoints(initialEmbeddings); setSelected('cat'); setDragging(null); onTone(520); }
  return (
    <div className="lab-tool-display embedding-display">
      <div className="lab-display-heading"><span>2D SEMANTIC SPACE</span><button className="mask-toggle" type="button" onClick={reset}>↺ Reset points</button></div>
      <svg ref={svgRef} className="embedding-diagram" viewBox="0 0 460 260" role="img" aria-label="Draggable two-dimensional embedding map" onPointerMove={updatePointer} onPointerUp={() => setDragging(null)} onPointerCancel={() => setDragging(null)}>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => <g key={i}><line x1={i * 57.5} y1="30" x2={i * 57.5} y2="230" className="embedding-gridline" /><line x1="30" y1={i * 28.75} x2="430" y2={i * 28.75} className="embedding-gridline" /></g>)}
        {neighbors.map((point) => <line key={`link-${point.id}`} x1={anchor.x} y1={anchor.y} x2={point.x} y2={point.y} className="embedding-neighbor-line" />)}
        {points.map((point) => <g key={point.id} role="button" tabIndex="0" aria-label={`${point.label} embedding point; drag to move`} className={`embedding-point${selected === point.id ? ' is-selected' : ''}${neighbors.some((item) => item.id === point.id) ? ' is-neighbor' : ''}`} transform={`translate(${point.x} ${point.y})`} onPointerDown={(event) => { setSelected(point.id); setDragging(point.id); event.currentTarget.ownerSVGElement.setPointerCapture(event.pointerId); onTone(450); }} onClick={() => setSelected(point.id)} onKeyDown={(event) => { if (event.key.startsWith('Arrow')) { event.preventDefault(); setSelected(point.id); movePoint(point.id, event.key === 'ArrowLeft' ? -8 : event.key === 'ArrowRight' ? 8 : 0, event.key === 'ArrowUp' ? -8 : event.key === 'ArrowDown' ? 8 : 0); } }}>
          <circle r={selected === point.id ? 10 : 7} /><text x="13" y="4">{point.label}</text>
        </g>)}
      </svg>
      <div className="lab-diagram-foot"><span>Drag a point or use arrow keys after selecting it.</span><strong>Nearest to <b>{anchor.label}</b>: {neighbors.map(({ label }) => label).join(' · ')}</strong></div>
    </div>
  );
}

const scoredExamples = [
  { id: 'p1', label: 1, score: .94 }, { id: 'p2', label: 1, score: .83 }, { id: 'p3', label: 1, score: .75 },
  { id: 'p4', label: 1, score: .66 }, { id: 'p5', label: 1, score: .54 }, { id: 'p6', label: 1, score: .37 },
  { id: 'n1', label: 0, score: .78 }, { id: 'n2', label: 0, score: .61 }, { id: 'n3', label: 0, score: .46 },
  { id: 'n4', label: 0, score: .32 }, { id: 'n5', label: 0, score: .21 }, { id: 'n6', label: 0, score: .09 },
];

function ThresholdExplorer({ onTone }) {
  const [threshold, setThreshold] = useState(.58);
  const counts = scoredExamples.reduce((result, item) => {
    const predicted = item.score >= threshold ? 1 : 0;
    if (predicted && item.label) result.tp += 1;
    else if (predicted && !item.label) result.fp += 1;
    else if (!predicted && item.label) result.fn += 1;
    else result.tn += 1;
    return result;
  }, { tp: 0, fp: 0, fn: 0, tn: 0 });
  const precision = counts.tp / Math.max(1, counts.tp + counts.fp);
  const recall = counts.tp / Math.max(1, counts.tp + counts.fn);
  return (
    <div className="lab-tool-display threshold-display">
      <div className="lab-display-heading"><span>SCORE THRESHOLD · SYNTHETIC DATA</span><strong>{threshold.toFixed(2)}</strong></div>
      <svg className="threshold-chart" viewBox="0 0 460 145" role="img" aria-label={`Classification scores with threshold at ${threshold.toFixed(2)}`}>
        <text x="3" y="43">ACTUAL +</text><text x="3" y="104">ACTUAL −</text><line x1="76" y1="48" x2="438" y2="48" className="score-axis"/><line x1="76" y1="109" x2="438" y2="109" className="score-axis"/>
        <line x1={76 + threshold * 362} y1="18" x2={76 + threshold * 362} y2="126" className="threshold-marker"/><text x={Math.min(400, 76 + threshold * 362 + 4)} y="14" className="threshold-label">THRESHOLD</text>
        {scoredExamples.map((item, index) => { const predicted = item.score >= threshold ? 1 : 0; const correct = predicted === item.label; const y = item.label ? 48 : 109; return <g key={item.id}><circle cx={76 + item.score * 362} cy={y + (index % 3 - 1) * 8} r="6" className={correct ? (item.label ? 'score-correct-positive' : 'score-correct-negative') : 'score-error'} /><title>{`Actual ${item.label ? 'positive' : 'negative'}, score ${item.score.toFixed(2)}, ${correct ? 'correct' : 'incorrect'} at this threshold`}</title></g>; })}
      </svg>
      <label className="threshold-slider-label" htmlFor="threshold-slider"><span>Decision threshold</span><input id="threshold-slider" type="range" min="0.1" max="0.9" step="0.01" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} onPointerUp={() => onTone(520)} /><span>{threshold.toFixed(2)}</span></label>
      <div className="confusion-matrix" aria-live="polite"><div><span>TRUE POSITIVE</span><strong>{counts.tp}</strong></div><div><span>FALSE POSITIVE</span><strong>{counts.fp}</strong></div><div><span>FALSE NEGATIVE</span><strong>{counts.fn}</strong></div><div><span>TRUE NEGATIVE</span><strong>{counts.tn}</strong></div></div>
      <div className="lab-diagram-foot"><span>Precision <b>{Math.round(precision * 100)}%</b> · Recall <b>{Math.round(recall * 100)}%</b></span><span>12 synthetic examples</span></div>
    </div>
  );
}

const retrievalDocuments = [
  { title: 'Neural networks in practice', text: 'A practical introduction to layers, activations, training data and neural network evaluation.' },
  { title: 'Attention and transformer models', text: 'How query, key and value vectors help a transformer focus on relevant context.' },
  { title: 'Vector search fundamentals', text: 'Represent text as embeddings and retrieve semantically similar items with nearest-neighbour search.' },
  { title: 'Evaluating retrieval systems', text: 'Measure relevance with precision at k, recall, ranking quality and representative test queries.' },
  { title: 'Responsible model deployment', text: 'Monitor drift, document limitations, protect user data and create routes for human review.' },
];

function RetrievalPlayground({ onTone }) {
  const [query, setQuery] = useState('transformer attention context');
  const [topK, setTopK] = useState(3);
  const [selectedDocument, setSelectedDocument] = useState(1);
  const terms = query.toLowerCase().match(/[a-z0-9]+/g) || [];
  const ranked = retrievalDocuments.map((document, index) => {
    const words = new Set(`${document.title} ${document.text}`.toLowerCase().match(/[a-z0-9]+/g) || []);
    const matches = [...new Set(terms)].filter((term) => words.has(term));
    return { ...document, index, matches, score: terms.length ? matches.length / new Set(terms).size : 0 };
  }).sort((first, second) => second.score - first.score || first.index - second.index);
  const visible = ranked.slice(0, topK);
  const active = retrievalDocuments[selectedDocument];
  return (
    <div className="lab-tool-display retrieval-display">
      <div className="lab-display-heading"><span>TRANSPARENT KEYWORD RETRIEVAL</span><span>LOCAL DEMO · NO API</span></div>
      <label className="retrieval-query-label" htmlFor="retrieval-query">QUERY</label>
      <input id="retrieval-query" className="retrieval-query" value={query} onChange={(event) => setQuery(event.target.value)} onFocus={() => onTone(400)} aria-describedby="retrieval-hint" />
      <div className="retrieval-results" aria-live="polite">{visible.map((document, rank) => <button type="button" key={document.title} className={`retrieval-result${selectedDocument === document.index ? ' is-selected' : ''}`} onClick={() => { setSelectedDocument(document.index); onTone(480 + rank * 55); }}><span className="retrieval-rank">0{rank + 1}</span><span className="retrieval-result-copy"><strong>{document.title}</strong><i><b style={{ width: `${document.score * 100}%` }} /></i><small>{document.matches.length} matching query terms</small></span><span className="retrieval-score">{Math.round(document.score * 100)}%</span></button>)}</div>
      <div className="retrieval-bottom"><div className="top-k-control"><label htmlFor="top-k-slider">Results to retrieve <b>{topK}</b></label><input id="top-k-slider" type="range" min="1" max="5" step="1" value={topK} onChange={(event) => setTopK(Number(event.target.value))} /></div><div className="retrieval-inspect"><span>SELECTED DOCUMENT</span><strong>{active.title}</strong><p>{active.text}</p></div></div>
      <span id="retrieval-hint" className="sr-only">Results are ranked by the proportion of query terms found in each demo document.</span>
    </div>
  );
}

function ArchitectureLab() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const audioContext = useRef(null);
  const ambientSound = useRef(null);
  const touchStartX = useRef(null);
  const tool = aiLabTools[selectedIndex];

  function getAudioContext() {
    if (!audioContext.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioContext.current = new AudioContextClass();
    }
    if (audioContext.current?.state === 'suspended') audioContext.current.resume();
    return audioContext.current;
  }
  function playTone(frequency = 520, duration = .09) {
    if (!soundEnabled) return;
    const context = getAudioContext();
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gain.gain.setValueAtTime(.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + duration);
  }
  useEffect(() => {
    if (!soundEnabled) return undefined;
    const context = getAudioContext();
    if (!context) return undefined;
    const oscillator = context.createOscillator(); const gain = context.createGain(); const lfo = context.createOscillator(); const lfoGain = context.createGain();
    oscillator.type = 'sine'; oscillator.frequency.value = 82; gain.gain.value = .006; lfo.frequency.value = .1; lfoGain.gain.value = .002;
    lfo.connect(lfoGain); lfoGain.connect(gain.gain); oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); lfo.start();
    ambientSound.current = { oscillator, gain, lfo };
    return () => { [oscillator, lfo].forEach((node) => { try { node.stop(); } catch { /* already stopped */ } node.disconnect(); }); gain.disconnect(); ambientSound.current = null; };
  }, [soundEnabled]);
  useEffect(() => () => { audioContext.current?.close(); }, []);

  function chooseTool(index) {
    setSelectedIndex((index + aiLabTools.length) % aiLabTools.length);
    setResetKey((key) => key + 1);
    playTone(420 + index * 90);
  }
  function moveTool(direction) { chooseTool(selectedIndex + direction); }
  function handlePointerMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    const card = event.target.closest('.architecture-project-card.is-current');
    if (card) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--tilt-x', `${((event.clientY - rect.top) / rect.height - .5) * -3}deg`);
      card.style.setProperty('--tilt-y', `${((event.clientX - rect.left) / rect.width - .5) * 3}deg`);
    }
  }
  function toggleSound() {
    const next = !soundEnabled;
    if (next) { const context = getAudioContext(); if (context) { const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = 660; gain.gain.setValueAtTime(.03, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .12); oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .12); } }
    setSoundEnabled(next);
  }
  function handleKey(event) {
    if (event.target.closest?.('button, [role="button"]')) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveTool(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); moveTool(1); }
  }
  function renderTool() {
    if (tool.key === 'neural') return <NeuralNetworkPlayground onTone={playTone} />;
    if (tool.key === 'attention') return <AttentionExplorer onTone={playTone} />;
    if (tool.key === 'embedding') return <EmbeddingMapper onTone={playTone} />;
    if (tool.key === 'threshold') return <ThresholdExplorer onTone={playTone} />;
    return <RetrievalPlayground onTone={playTone} />;
  }
  function handleTouchStart(event) { touchStartX.current = event.touches[0]?.clientX ?? null; }
  function handleTouchEnd(event) { if (touchStartX.current === null) return; const delta = event.changedTouches[0].clientX - touchStartX.current; if (Math.abs(delta) > 55) moveTool(delta < 0 ? 1 : -1); touchStartX.current = null; }

  return (
    <div className="architecture-lab" onPointerMove={handlePointerMove} onPointerLeave={(event) => { const card = event.currentTarget.querySelector('.is-current'); card?.style.setProperty('--tilt-x', '0deg'); card?.style.setProperty('--tilt-y', '0deg'); }} onKeyDown={handleKey} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="architecture-toolbar">
        <div className="architecture-mode-copy"><span className="architecture-live-dot" />AI Lab playground <small>{String(selectedIndex + 1).padStart(2, '0')} / {String(aiLabTools.length).padStart(2, '0')}</small></div>
        <button className="flow-toggle sound-toggle" type="button" aria-pressed={soundEnabled} onClick={toggleSound} title={soundEnabled ? 'Turn sound off' : 'Enable ambient sound and interaction tones'}><span aria-hidden="true">{soundEnabled ? '♫' : '♪'}</span>{soundEnabled ? 'Sound on' : 'Enable sound'}</button>
      </div>
      <div className="architecture-carousel-head">
        <span>CHOOSE A TOOL <b>·</b> <strong>{String(selectedIndex + 1).padStart(2, '0')} / {String(aiLabTools.length).padStart(2, '0')}</strong></span>
        <div className="architecture-arrows"><button type="button" aria-label="Previous AI tool" onClick={() => moveTool(-1)}>‹</button><button type="button" aria-label="Next AI tool" onClick={() => moveTool(1)}>›</button></div>
      </div>
      <div className="architecture-carousel" role="region" aria-label="Interactive AI Lab tools" tabIndex="0">
        {[-1, 0, 1].map((offset) => {
          const index = (selectedIndex + offset + aiLabTools.length) % aiLabTools.length;
          const item = aiLabTools[index];
          const isCurrent = offset === 0;
          const cardClass = `architecture-project-card${isCurrent ? ' is-current' : ''} ${offset < 0 ? 'is-left' : ''} ${offset > 0 ? 'is-right' : ''}`;
          const meta = <span className="architecture-card-meta"><span>TOOL {String(index + 1).padStart(2, '0')}</span><span>{item.type}</span></span>;
          if (isCurrent) return <article key={item.key} className={cardClass} aria-current="true">{meta}<strong>{item.name}</strong><div key={`${item.key}-${resetKey}`}>{renderTool()}</div><span className="architecture-card-foot"><span>Interactive diagram · runs in your browser</span><span>Play with it ↗</span></span></article>;
          return <button key={item.key} type="button" className={cardClass} tabIndex="-1" aria-label={`Open ${item.name}`} onPointerEnter={() => playTone(690, .055)} onClick={() => chooseTool(index)}>{meta}<strong>{item.name}</strong><span className={`architecture-art architecture-art-${item.key}`} aria-hidden="true"><span className="art-network"><i /><i /><i /><i /><i /><i /><b>{item.key === 'neural' ? 'NEURAL' : item.key === 'attention' ? 'ATTENTION' : 'VECTORS'}</b></span><span className="architecture-art-tag">INTERACTIVE DEMO</span></span><span className="architecture-card-foot"><span>AI Lab tool</span><span>Open ↗</span></span></button>;
        })}
      </div>
      <div className="architecture-carousel-dots" role="group" aria-label="Select an AI Lab tool">{aiLabTools.map((item, index) => <button key={item.key} type="button" aria-label={`Show ${item.name}`} aria-pressed={index === selectedIndex} onClick={() => chooseTool(index)} />)}</div>
      <div className="lab-tool-caption"><div><span>{tool.type}</span><p>{tool.note}</p></div><div className="lab-tool-instructions"><span>HOW TO PLAY</span><strong>{tool.key === 'neural' ? 'Click input nodes' : tool.key === 'attention' ? 'Click any attention cell' : tool.key === 'embedding' ? 'Drag points or use arrow keys' : tool.key === 'threshold' ? 'Move the decision slider' : 'Edit the query and choose top-k'}</strong></div></div>
    </div>
  );
}

function App() {
  const portfolioRef = useRef(null);
  const themeTimer = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('work');
  const [theme, setTheme] = useState(getSavedTheme);
  const [themeTransition, setThemeTransition] = useState(false);
  const [statCounts, setStatCounts] = useState({ projects: 0, clients: 0, goal: 0 });
  const [clockNow, setClockNow] = useState(() => new Date());

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

  useEffect(() => {
    const clock = window.setInterval(() => setClockNow(new Date()), 1000);
    return () => window.clearInterval(clock);
  }, []);

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
          <div className="nav-identity">
            <a className="brand" href="#top" aria-label="Tegabyte, portfolio home" onClick={closeMenu}>
              <span className="brand-mark">TB</span>
              <span className="brand-name">TEGABYTE <i>/ PORTFOLIO</i></span>
            </a>
            <div className="nav-clock" aria-label="Local time in Lagos">
              <span className="nav-globe" aria-hidden="true">◎</span><strong>LOS / WAT</strong><span aria-hidden="true">·</span>
              <time>{new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(clockNow)}</time>
            </div>
          </div>
          <div className="nav-availability"><span className="nav-ai-mark">AI</span><span>Available for work</span><i aria-hidden="true" /></div>
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
          <nav id="primary-navigation" className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Portfolio navigation" onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty('--nav-x', `${event.clientX - bounds.left}px`); event.currentTarget.style.setProperty('--nav-y', `${event.clientY - bounds.top}px`); }}>
            <div className="main-nav-links">
            {primaryNavItems.map(([id, label]) => (
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
            <details className="nav-more">
              <summary>More <span aria-hidden="true">⌄</span></summary>
              <div className="nav-more-panel">
                {moreNavItems.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined} onClick={(event) => { closeMenu(); event.currentTarget.closest('details').open = false; }}>{label}<span aria-hidden="true">↗</span></a>)}
              </div>
            </details>
            </div>
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

          <section className="ai-lab section" id="ai-lab" aria-labelledby="ai-lab-title" data-reveal>
            <div className="section-heading">
              <div><span className="section-kicker">AI systems · interactive tools</span><h2 id="ai-lab-title">Explore the moving parts of AI.</h2></div>
              <p className="ai-lab-intro">Play with a neural network, inspect transformer attention, and move vectors through a semantic space. Each diagram responds as you explore.</p>
            </div>
            <ArchitectureLab />
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
