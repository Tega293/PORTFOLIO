import { Fragment, useEffect, useRef, useState } from 'react';
import defaultProjects from './projects.json';
import defaultSkills from './skills.json';
import './App.css';

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
  { key: 'projects', label: 'Live prototypes', target: 50, suffix: '' },
  { key: 'tools', label: 'Interactive demos', target: 50, suffix: '' },
  { key: 'goal', label: 'Long-term project goal', target: 1000, suffix: '+' },
];

const portfolioSections = [
  ['top', 'Home'], ['work', 'Selected work'], ['ai-lab', 'AI Lab'], ['approach', 'Approach'],
  ['about', 'About'], ['experience', 'Résumé'], ['certifications', 'Certificates'], ['socials', 'Socials'], ['contact', 'Contact'], ['faq', 'FAQ'],
];

const portfolioFaqs = [
  { question: 'What kind of work are you open to?', answer: 'I’m open to AI/ML engineering, web development and product design roles, as well as freelance projects and collaborations.' },
  { question: 'Can I explore the AI Lab demos?', answer: 'Yes. The diagrams are small, browser-based teaching tools. Their labels explain what each control changes; the examples are illustrative and are not trained production models.' },
  { question: 'How do I discuss a project?', answer: 'Use the email or WhatsApp links on this page. They open your own mail or messaging app, and you choose what information to send.' },
  { question: 'Are the projects available to inspect?', answer: 'Where a live link is available, you can open the project directly. Some sites prevent embedded previews, so use the direct link if an in-page preview cannot load.' },
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

const originalTextValues = new WeakMap();
const originalAttributes = new WeakMap();
const translationCache = new Map();

function splitForTranslation(value, maxLength = 2500) {
  const chunks = [];
  let remaining = value;
  while (remaining.length > maxLength) {
    let boundary = remaining.lastIndexOf(' ', maxLength);
    if (boundary < maxLength * .55) boundary = maxLength;
    chunks.push(remaining.slice(0, boundary).trim());
    remaining = remaining.slice(boundary).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

function collectTranslatableEntries(root) {
  const entries = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || !node.nodeValue.trim() || parent.closest('script,style,noscript,code,kbd,[aria-hidden="true"],[data-translation-ignore]')) return NodeFilter.FILTER_REJECT;
      return /[\p{L}]/u.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  let node;
  while ((node = walker.nextNode())) {
    const value = originalTextValues.get(node) ?? node.nodeValue;
    originalTextValues.set(node, value);
    const start = value.match(/^\s*/)?.[0] || '';
    const end = value.match(/\s*$/)?.[0] || '';
    const text = value.slice(start.length, value.length - end.length || value.length);
    if (text) {
      const originalNode = node;
      const chunks = splitForTranslation(text);
      const translations = new Array(chunks.length);
      chunks.forEach((chunk, index) => entries.push({ text: chunk, apply: (translated) => {
        translations[index] = translated;
        if (originalNode.isConnected && translations.every((part) => part !== undefined)) originalNode.nodeValue = `${start}${translations.join(' ')}${end}`;
      } }));
    }
  }
  const attributes = ['aria-label', 'title', 'placeholder', 'alt'];
  root.querySelectorAll(attributes.map((attribute) => `[${attribute}]`).join(',')).forEach((element) => {
    if (element.closest('[data-translation-ignore]')) return;
    const original = originalAttributes.get(element) || {};
    attributes.forEach((attribute) => {
      const value = original[attribute] ?? element.getAttribute(attribute);
      if (value && /[\p{L}]/u.test(value)) {
        original[attribute] = value;
        entries.push({ text: value, apply: (translated) => { if (element.isConnected) element.setAttribute(attribute, translated); } });
      }
    });
    originalAttributes.set(element, original);
  });
  return entries;
}

function restorePortfolioEnglish(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const original = originalTextValues.get(node);
    if (original !== undefined) node.nodeValue = original;
  }
  root.querySelectorAll('[aria-label],[title],[placeholder],[alt]').forEach((element) => {
    const original = originalAttributes.get(element);
    if (original) Object.entries(original).forEach(([attribute, value]) => element.setAttribute(attribute, value));
  });
}

async function applyPortfolioLanguage(root, target, isCurrent) {
  restorePortfolioEnglish(root);
  if (target === 'en') return;
  const entries = collectTranslatableEntries(root);
  const unresolved = entries.filter((entry) => !translationCache.has(`${target}\u0000${entry.text}`));
  const batches = [];
  let batch = [];
  let characters = 0;
  unresolved.forEach((entry) => {
    if (batch.length >= 100 || characters + entry.text.length > 20_000) { batches.push(batch); batch = []; characters = 0; }
    batch.push(entry); characters += entry.text.length;
  });
  if (batch.length) batches.push(batch);
  for (const currentBatch of batches) {
    if (!isCurrent()) return;
    const response = await fetch('/api/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ target, texts: currentBatch.map((entry) => entry.text) }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Translation is unavailable.');
    result.translations.forEach((text, index) => translationCache.set(`${target}\u0000${currentBatch[index].text}`, text));
  }
  if (!isCurrent()) return;
  entries.forEach((entry) => entry.apply(translationCache.get(`${target}\u0000${entry.text}`) || entry.text));
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
  const [previewLoaded, setPreviewLoaded] = useState(false);
  if (project.liveUrl) {
    return (
      <div className="project-artwork live-project-artwork">
        <div className="browser-frame">
          <div className="browser-bar">
            <i /><i /><i />
            <span>{project.address}</span>
          </div>
          <div className="project-live-viewport">
            {previewLoaded ? (
              <iframe
                title={`${project.name} website preview. Content is provided by ${project.address}.`}
                src={project.liveUrl}
                loading="lazy"
                referrerPolicy="no-referrer"
                sandbox="allow-scripts"
              />
            ) : project.image ? (
              <div className="project-image-preview">
                <img src={project.image} alt={project.imageAlt || `${project.name} project preview`} loading="lazy" />
                <button type="button" onClick={() => setPreviewLoaded(true)} aria-label={`Load the live ${project.name} website preview`}>Load live preview</button>
              </div>
            ) : (
              <div className="external-preview-consent">
                <span aria-hidden="true">↗</span>
                <strong>External website preview</strong>
                <p>Load content from {project.address}. That site may receive your connection data and apply its own privacy settings.</p>
                <button type="button" onClick={() => setPreviewLoaded(true)} aria-label={`Load the ${project.name} preview from ${project.address}`}>Load preview</button>
              </div>
            )}
          </div>
        </div>
        <div className="project-live-open"><span>{previewLoaded ? `${project.name} preview loaded` : 'Preview waits for your permission'}</span>{previewLoaded && <button className="project-preview-unload" type="button" onClick={() => setPreviewLoaded(false)}>Unload preview</button>}<a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Open {project.name} <span aria-hidden="true">↗</span></a></div>
      </div>
    );
  }

  if (project.image) {
    return <figure className={`project-artwork ${project.theme} project-image-artwork`}><img src={project.image} alt={project.imageAlt || `${project.name} project preview`} loading="lazy" /></figure>;
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

function renderInlineMarkdown(text, keyPrefix) {
  const tokenPattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)\s]+\))/g;
  return text.split(tokenPattern).filter(Boolean).map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    if (token.startsWith('**')) return <strong key={key}>{token.slice(2, -2)}</strong>;
    if (token.startsWith('*')) return <em key={key}>{token.slice(1, -1)}</em>;
    if (token.startsWith('`')) return <code key={key}>{token.slice(1, -1)}</code>;
    if (token.startsWith('[')) {
      const match = token.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
      if (match) return <a key={key} href={match[2]} target="_blank" rel="noopener noreferrer">{match[1]}</a>;
    }
    return token;
  });
}

function MarkdownContent({ content }) {
  const lines = (content || '').split(/\r?\n/);
  const blocks = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index += 1; continue; }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const Tag = heading[1].length === 1 ? 'h3' : 'h4';
      blocks.push(<Tag key={`heading-${index}`}>{renderInlineMarkdown(heading[2], `heading-${index}`)}</Tag>);
      index += 1;
      continue;
    }
    if (line.startsWith('> ')) {
      blocks.push(<blockquote key={`quote-${index}`}>{renderInlineMarkdown(line.slice(2), `quote-${index}`)}</blockquote>);
      index += 1;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ''));
        index += 1;
      }
      const listEnd = index;
      blocks.push(<ul key={`list-${listEnd}`}>{items.map((item, itemIndex) => <li key={`item-${itemIndex}`}>{renderInlineMarkdown(item, `item-${listEnd}-${itemIndex}`)}</li>)}</ul>);
      continue;
    }
    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{1,3})\s+|^>\s+|^[-*]\s+/.test(lines[index].trim())) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    const paragraphEnd = index;
    blocks.push(<p key={`paragraph-${paragraphEnd}`}>{paragraph.map((part, partIndex) => <Fragment key={`line-${partIndex}`}>{partIndex > 0 && <br />}{renderInlineMarkdown(part, `paragraph-${paragraphEnd}-${partIndex}`)}</Fragment>)}</p>);
  }
  return <div className="markdown-content">{blocks}</div>;
}

function ProjectCard({ project, isSaved, onToggleSaved, onViewed }) {
  return (
    <article className={`project-row ${project.theme}`} data-reveal id={`project-${project.id}`}>
      <ProjectArtwork project={project} />
      <div className="project-copy">
        <div className="project-meta"><span>{project.number} / {project.category}</span><span>{project.liveUrl ? 'Live project' : 'Concept study'}</span></div>
        <h3>{project.name}</h3>
        <button className={`project-save-button${isSaved ? ' is-saved' : ''}`} type="button" aria-pressed={isSaved} onClick={() => onToggleSaved(project.id)}>{isSaved ? 'Saved for later ✓' : 'Save for later ♡'}</button>
        <p>{project.description}</p>
        <div className="project-tags">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        {project.liveUrl && <a className="project-live-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit {project.name} <span aria-hidden="true">↗</span></a>}
        <details className="case-study" onToggle={(event) => { if (event.currentTarget.open) onViewed(project.id); }}>
          <summary>Explore the case study</summary>
          <div className="case-study-body">
            <div><span>The challenge</span><p>{project.challenge}</p></div>
            <div><span>The response</span><p>{project.response}</p></div>
            {project.caseStudyContent && <div className="case-study-longform"><span>Case study</span><MarkdownContent content={project.caseStudyContent} /></div>}
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
      <svg ref={svgRef} className="embedding-diagram" viewBox="0 0 460 260" role="group" aria-label="Draggable two-dimensional embedding map" onPointerMove={updatePointer} onPointerUp={() => setDragging(null)} onPointerCancel={() => setDragging(null)}>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => <g key={i}><line x1={i * 57.5} y1="30" x2={i * 57.5} y2="230" className="embedding-gridline" /><line x1="30" y1={i * 28.75} x2="430" y2={i * 28.75} className="embedding-gridline" /></g>)}
        {neighbors.map((point) => <line key={`link-${point.id}`} x1={anchor.x} y1={anchor.y} x2={point.x} y2={point.y} className="embedding-neighbor-line" />)}
        {points.map((point) => <g key={point.id} role="button" tabIndex="0" aria-label={`${point.label} embedding point; drag to move`} className={`embedding-point${selected === point.id ? ' is-selected' : ''}${neighbors.some((item) => item.id === point.id) ? ' is-neighbor' : ''}`} transform={`translate(${point.x} ${point.y})`} onPointerDown={(event) => { setSelected(point.id); setDragging(point.id); event.currentTarget.ownerSVGElement.setPointerCapture(event.pointerId); onTone(450); }} onClick={() => setSelected(point.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelected(point.id); onTone(450); } else if (event.key.startsWith('Arrow')) { event.preventDefault(); setSelected(point.id); movePoint(point.id, event.key === 'ArrowLeft' ? -8 : event.key === 'ArrowRight' ? 8 : 0, event.key === 'ArrowUp' ? -8 : event.key === 'ArrowDown' ? 8 : 0); } }}>
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

function PortfolioApp() {
  const portfolioRef = useRef(null);
  const themeTimer = useRef(null);
  const toastTimer = useRef(null);
  const searchRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('work');
  const [theme, setTheme] = useState(getSavedTheme);
  const [themeTransition, setThemeTransition] = useState(false);
  const [statCounts, setStatCounts] = useState({ projects: 0, tools: 0, goal: 0 });
  const [clockNow, setClockNow] = useState(() => new Date());
  const [projects, setProjects] = useState(defaultProjects);
  const [capabilities, setCapabilities] = useState(defaultSkills);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [savedIds, setSavedIds] = useState(() => { try { const value = JSON.parse(window.localStorage.getItem('tegabyte-saved-projects') || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } });
  const [recentIds, setRecentIds] = useState(() => { try { const value = JSON.parse(window.localStorage.getItem('tegabyte-recent-projects') || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } });
  const [recentSectionIds, setRecentSectionIds] = useState(() => { try { const value = JSON.parse(window.localStorage.getItem('tegabyte-recent-sections') || '[]'); return Array.isArray(value) ? value : []; } catch { return []; } });
  const [readingProgress, setReadingProgress] = useState(0);
  const [fontScale, setFontScale] = useState(() => { try { return Number(window.localStorage.getItem('tegabyte-font-scale')) || 1; } catch { return 1; } });
  const [toast, setToast] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [compareIds, setCompareIds] = useState(() => [defaultProjects[0]?.id || '', defaultProjects[1]?.id || '']);
  const [estimatedMinutes, setEstimatedMinutes] = useState(1);
  const [faqQuery, setFaqQuery] = useState('');
  const [language, setLanguage] = useState(() => { try { return window.localStorage.getItem('portfolio-language') || 'en'; } catch { return 'en'; } });
  const [languages, setLanguages] = useState([{ code: 'en', name: 'English' }]);
  const [translationConfigured, setTranslationConfigured] = useState(false);
  const [translationStatus, setTranslationStatus] = useState('');

  function notify(message) {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2600);
  }

  function toggleSaved(projectId) {
    const next = savedIds.includes(projectId) ? savedIds.filter((id) => id !== projectId) : [...savedIds, projectId];
    setSavedIds(next);
    try { window.localStorage.setItem('tegabyte-saved-projects', JSON.stringify(next)); } catch { /* Save for this session still works. */ }
    notify(next.includes(projectId) ? 'Saved to your reading list.' : 'Removed from your reading list.');
  }

  function markViewed(projectId) {
    setRecentIds((current) => {
      const next = [projectId, ...current.filter((id) => id !== projectId)].slice(0, 5);
      try { window.localStorage.setItem('tegabyte-recent-projects', JSON.stringify(next)); } catch { /* Recent items remain available for this session. */ }
      return next;
    });
  }

  async function sharePage() {
    const shareData = { title: document.title, text: 'Explore my portfolio and interactive AI lab.', url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(shareData.url); notify('Portfolio link copied.'); }
    } catch (error) { if (error.name !== 'AbortError') notify('Could not share this page from this browser.'); }
  }

  async function copyText(value, label) {
    try { await navigator.clipboard.writeText(value); notify(`${label} copied to clipboard.`); }
    catch { notify('Clipboard access is unavailable in this browser.'); }
  }

  const visibleProjects = projects.filter((project) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = !query || [project.name, project.category, project.description, ...(project.tags || []), project.caseStudyContent].join(' ').toLowerCase().includes(query);
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    const matchesSaved = !showSavedOnly || savedIds.includes(project.id);
    return matchesQuery && matchesCategory && matchesSaved;
  }).sort((first, second) => sortBy === 'name' ? first.name.localeCompare(second.name) : sortBy === 'category' ? first.category.localeCompare(second.category) || first.name.localeCompare(second.name) : projects.indexOf(first) - projects.indexOf(second));
  const recentProjects = recentIds.map((id) => projects.find((project) => project.id === id)).filter(Boolean);
  const comparedProjects = compareIds.map((id) => projects.find((project) => project.id === id)).filter(Boolean);

  useEffect(() => {
    try { window.localStorage.setItem('tegabyte-font-scale', String(fontScale)); } catch { /* Font size remains active for this session. */ }
    document.documentElement.style.setProperty('--reading-scale', String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setReadingProgress(scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0);
      });
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener('scroll', updateProgress); window.removeEventListener('resize', updateProgress); };
  }, []);

  useEffect(() => {
    let isCurrent = true;
    fetch('/skills.json', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((items) => { if (isCurrent && Array.isArray(items) && items.every((item) => item?.id && item?.title)) setCapabilities(items); })
      .catch(() => {});
    return () => { isCurrent = false; };
  }, []);

  useEffect(() => {
    let isCurrent = true;
    fetch('/api/languages')
      .then(async (response) => ({ response, data: await response.json().catch(() => ({})) }))
      .then(({ response, data }) => {
        if (!isCurrent) return;
        if (response.ok && data.configured && Array.isArray(data.languages)) {
          setLanguages(data.languages); setTranslationConfigured(true);
        } else {
          setLanguages([{ code: 'en', name: 'English' }]); setTranslationConfigured(false);
          setLanguage('en'); setTranslationStatus('Add the Google translation key in Vercel to enable other languages.');
        }
      })
      .catch(() => { if (isCurrent) { setLanguage('en'); setTranslationStatus('Language options are temporarily unavailable.'); } });
    return () => { isCurrent = false; };
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    const rtlLanguages = new Set(['ar', 'fa', 'he', 'iw', 'ps', 'sd', 'ug', 'ur', 'yi']);
    document.documentElement.dir = rtlLanguages.has(language.split('-')[0]) ? 'rtl' : 'ltr';
    try { window.localStorage.setItem('portfolio-language', language); } catch { /* Language remains selected for this session. */ }
  }, [language]);

  useEffect(() => {
    const root = portfolioRef.current?.querySelector('.portfolio-shell');
    if (!root) return undefined;
    let isCurrent = true;
    if (language === 'en') {
      restorePortfolioEnglish(root);
      return () => { isCurrent = false; };
    }
    if (!translationConfigured) return () => { isCurrent = false; };
    setTranslationStatus(`Translating to ${languages.find((item) => item.code === language)?.name || language}…`);
    applyPortfolioLanguage(root, language, () => isCurrent)
      .then(() => { if (isCurrent) setTranslationStatus('Machine translated. Some phrasing may vary.'); })
      .catch((error) => {
        if (!isCurrent) return;
        restorePortfolioEnglish(root); setLanguage('en'); setTranslationStatus(error.message || 'Translation could not be completed.');
      });
    return () => { isCurrent = false; };
  }, [language, languages, translationConfigured, projects, capabilities, theme, searchQuery, categoryFilter, sortBy, faqQuery, showCompare, showShortcuts, savedIds, recentIds, recentSectionIds]);

  useEffect(() => {
    const words = document.querySelector('main#top')?.innerText.match(/\b[\w’'-]+\b/g)?.length || 0;
    setEstimatedMinutes(Math.max(1, Math.ceil(words / 220)));
  }, [projects]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      const typing = target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
      if (typing) { if (event.key === 'Escape') target.blur(); return; }
      if (event.key === '/') { event.preventDefault(); searchRef.current?.focus(); }
      if (event.key.toLowerCase() === 't') switchTheme();
      if (event.key === '?') setShowShortcuts((value) => !value);
      if (event.key === 'Escape') setShowShortcuts(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

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

  useEffect(() => {
    let isCurrent = true;
    fetch('/projects.json', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((items) => {
        if (isCurrent && Array.isArray(items) && items.every((item) => item && item.id && item.name)) setProjects(items);
      })
      .catch(() => {});
    return () => { isCurrent = false; };
  }, []);

  useEffect(() => () => { window.clearTimeout(themeTimer.current); window.clearTimeout(toastTimer.current); }, []);

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
      if (visible) {
        setActiveSection(visible.target.id);
        setRecentSectionIds((current) => {
          const next = [visible.target.id, ...current.filter((id) => id !== visible.target.id)].slice(0, 5);
          try { window.localStorage.setItem('tegabyte-recent-sections', JSON.stringify(next)); } catch { /* Recent sections remain available for this session. */ }
          return next;
        });
      }
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
          <div className="nav-availability"><span>Available for work</span><i aria-hidden="true" /></div>
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

        <div className="reader-tools" aria-label="Reading tools">
          <span className="reading-time"><i aria-hidden="true">◷</i> {estimatedMinutes} min read</span>
          <label className="language-picker" data-translation-ignore><span>Read in</span><select aria-label="Select language to read this portfolio" value={language} disabled={!translationConfigured} onChange={(event) => { setTranslationStatus(''); setLanguage(event.target.value); }}><option value="en">English</option>{languages.filter((item) => item.code !== 'en').map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
          {!translationConfigured && <span className="language-setup-note" title="Automatic translations are disabled until the server-side Google Cloud Translation key is configured.">Language service setup needed</span>}
          {translationStatus && translationConfigured && <span className="language-setup-note" role="status">{translationStatus}</span>}
          <label className="jump-control">Jump to <select aria-label="Jump to a section" defaultValue="top" onChange={(event) => document.getElementById(event.target.value)?.scrollIntoView({ behavior: 'smooth' })}>{portfolioSections.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></label>
          <div className="text-size-controls" role="group" aria-label="Text size"><span>Text</span><button type="button" onClick={() => setFontScale((value) => Math.max(.9, +(value - .1).toFixed(1)))} aria-label="Decrease text size">A−</button><button type="button" onClick={() => setFontScale((value) => Math.min(1.2, +(value + .1).toFixed(1)))} aria-label="Increase text size">A+</button></div>
          <button className="reader-tool-button" type="button" onClick={sharePage}>Share page ↗</button>
          <button className={`reader-tool-button${showSavedOnly ? ' is-active' : ''}`} type="button" aria-pressed={showSavedOnly} onClick={() => { setShowSavedOnly((value) => !value); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }); }}>Saved ({savedIds.length})</button>
          <button className="reader-tool-button" type="button" onClick={() => setShowShortcuts(true)} aria-label="Show keyboard shortcuts">Shortcuts ?</button>
        </div>
        {recentSectionIds.length > 1 && <div className="recent-pages"><span>Recently visited</span>{recentSectionIds.filter((id) => id !== 'top').map((id) => <a href={`#${id}`} key={id}>{portfolioSections.find(([sectionId]) => sectionId === id)?.[1] || id} ↗</a>)}</div>}

        <main id="top" inert={menuOpen ? true : undefined}>
          <section className="hero" aria-labelledby="hero-title" data-reveal>
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-dot" />AI/ML Engineer · Web Developer · Product Designer</div>
              <h1 id="hero-title">Useful ideas, made <span>beautiful.</span></h1>
              <p className="hero-intro">I’m Adesina Oghenetega Emmanuel, an AI/ML engineer, web developer and product designer. I build thoughtful digital products and intelligent tools, and I’m open to roles, freelance work and collaborations.</p>
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
            <div className="project-discovery" role="search">
              <label className="smart-search"><span aria-hidden="true">⌕</span><input ref={searchRef} type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search projects, skills, or ideas…" aria-label="Search portfolio projects" /><kbd>/</kbd></label>
              <label className="project-filter">Filter <select aria-label="Filter projects by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">All categories</option>{Array.from(new Set(projects.map((project) => project.category))).filter(Boolean).map((category) => <option value={category} key={category}>{category}</option>)}</select></label>
              <label className="project-filter">Sort <select aria-label="Sort projects" value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="featured">Featured</option><option value="name">Name A–Z</option><option value="category">Category</option></select></label>
              <button className={`reader-tool-button compare-toggle${showCompare ? ' is-active' : ''}`} type="button" aria-pressed={showCompare} onClick={() => setShowCompare((value) => !value)}>Compare projects</button>
            </div>
            {searchQuery && <div className="smart-search-results"><span>Jump to</span>{portfolioSections.filter(([id, label]) => label.toLowerCase().includes(searchQuery.toLowerCase()) || (id === 'ai-lab' && 'artificial intelligence'.includes(searchQuery.toLowerCase()))).slice(0, 4).map(([id, label]) => <a href={`#${id}`} key={id}>{label} ↗</a>)}</div>}
            {recentProjects.length > 0 && <div className="recent-projects"><span>Recently explored</span>{recentProjects.map((project) => <a href={`#project-${project.id}`} key={project.id}>{project.name} ↗</a>)}</div>}
            {visibleProjects.length ? <div className="projects-list">{visibleProjects.map((project) => <ProjectCard key={project.id} project={project} isSaved={savedIds.includes(project.id)} onToggleSaved={toggleSaved} onViewed={markViewed} />)}</div> : <div className="empty-project-state"><strong>No projects match that view.</strong><button type="button" onClick={() => { setSearchQuery(''); setCategoryFilter('all'); setShowSavedOnly(false); }}>Clear search and filters</button></div>}
            {showCompare && projects.length > 1 && <div className="project-comparison"><div className="comparison-heading"><div><span className="section-kicker">Side by side</span><h3>Compare selected work</h3></div><p>Choose two projects to compare their published details.</p></div><div className="comparison-selectors">{[0, 1].map((slot) => <label key={slot}>Project {slot + 1}<select value={compareIds[slot] || ''} onChange={(event) => setCompareIds((current) => current.map((id, index) => index === slot ? event.target.value : id))}>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>)}</div>{comparedProjects.length === 2 && <div className="comparison-table-wrap"><table className="comparison-table"><caption>Project details comparison</caption><thead><tr><th scope="col">Detail</th>{comparedProjects.map((project) => <th scope="col" key={project.id}>{project.name}</th>)}</tr></thead><tbody><tr><th scope="row">Category</th>{comparedProjects.map((project) => <td key={project.id}>{project.category}</td>)}</tr><tr><th scope="row">Overview</th>{comparedProjects.map((project) => <td key={project.id}>{project.description}</td>)}</tr><tr><th scope="row">Focus areas</th>{comparedProjects.map((project) => <td key={project.id}>{(project.tags || []).join(' · ') || 'Details to come'}</td>)}</tr><tr><th scope="row">Availability</th>{comparedProjects.map((project) => <td key={project.id}>{project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Open live project ↗</a> : 'Case study'}</td>)}</tr></tbody></table></div>}</div>}
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
              <p>A snapshot of current portfolio work, browser-based experiments, and a long-term project goal.</p>
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
              {capabilities.map((capability, index) => (
                <article className="capability-card" key={capability.id}>
                  <span>{String(index + 1).padStart(2, '0')} / {capability.area || 'Skill'}</span>
                  <h3>{capability.title}</h3>
                  <p>{capability.copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="about section" id="about" aria-labelledby="about-title" data-reveal>
            <div><span className="section-kicker">A little about me</span><h2 id="about-title">Adesina Oghenetega Emmanuel</h2></div>
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
                      <a href={certificate.url || `/certifications/${certificate.file}`} target="_blank" rel="noopener noreferrer">View certificate <span aria-hidden="true">↗</span></a>
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
                <a className={`social-card social-${social.icon}`} href={social.href} key={social.name} target="_blank" rel="noopener noreferrer" aria-label={`${social.name}: ${social.detail}`}>
                  <span className="social-icon"><SocialGlyph type={social.icon} /></span>
                  <span className="social-copy"><strong>{social.name}</strong><small>{social.detail}</small></span>
                  <span className="social-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </section>

          <section className="faq-section section" id="faq" aria-labelledby="faq-title" data-reveal>
            <div className="section-heading"><div><span className="section-kicker">A few useful details</span><h2 id="faq-title">Questions, answered.</h2></div><p>Search for the details you need, then open a question to read more.</p></div>
            <label className="faq-search"><span aria-hidden="true">⌕</span><input type="search" value={faqQuery} onChange={(event) => setFaqQuery(event.target.value)} placeholder="Search questions…" aria-label="Search frequently asked questions" /></label>
            <div className="faq-list">{portfolioFaqs.filter((item) => `${item.question} ${item.answer}`.toLowerCase().includes(faqQuery.toLowerCase())).map((item) => <details key={item.question}><summary>{item.question}<span aria-hidden="true">＋</span></summary><p>{item.answer}</p></details>)}{!portfolioFaqs.some((item) => `${item.question} ${item.answer}`.toLowerCase().includes(faqQuery.toLowerCase())) && <p className="faq-empty">No matching answer yet. Try another phrase or contact me directly.</p>}</div>
          </section>

          <section className="contact-card" id="contact" aria-labelledby="contact-title" data-reveal>
            <div><span className="section-kicker">Have a good one in mind?</span><h2 id="contact-title">Let’s make something meaningful.</h2><p>Share the challenge, the big idea or the early sketch. I’m always happy to start with a thoughtful conversation.</p></div>
            <div className="contact-actions"><a className="button button-primary" href="mailto:oyibochaoghenetega5@gmail.com?subject=Let%E2%80%99s%20make%20something%20meaningful">Start a conversation <span aria-hidden="true">↗</span></a><button type="button" className="copy-contact-button" onClick={() => copyText('oyibochaoghenetega5@gmail.com', 'Email address')}>Copy email</button><button type="button" className="copy-contact-button" onClick={() => copyText('+2347047175423', 'WhatsApp number')}>Copy WhatsApp</button></div>
          </section>

          <footer className="site-footer">
            <span><strong>Adesina Oghenetega Emmanuel · Tegabyte</strong><a href="mailto:oyibochaoghenetega5@gmail.com">oyibochaoghenetega5@gmail.com</a><a href="https://wa.me/2347047175423" target="_blank" rel="noopener noreferrer">WhatsApp: +234 704 717 5423</a></span>
            <span>© {new Date().getFullYear()} Tegabyte <i>·</i> Built with intention</span>
            <nav className="footer-legal" aria-label="Policies and accessibility"><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/cookies.html">Cookies</a><a href="/refund-policy.html">Refunds</a><a href="/accessibility.html">Accessibility</a></nav>
          </footer>
        </main>
      </div>
      <div className="reading-progress-track" aria-hidden="true"><span style={{ transform: `scaleX(${readingProgress / 100})` }} /></div>
      <button className={`back-to-top${readingProgress > 8 ? ' is-visible' : ''}`} type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑<span>Top</span></button>
      {toast && <div className="site-toast" role="status" aria-live="polite">{toast}</div>}
      {showShortcuts && <div className="shortcuts-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowShortcuts(false); }}><section className="shortcuts-dialog" role="dialog" aria-modal="true" aria-labelledby="shortcuts-title"><button className="shortcuts-close" type="button" onClick={() => setShowShortcuts(false)} aria-label="Close keyboard shortcuts">×</button><span className="section-kicker">Quick navigation</span><h2 id="shortcuts-title">Keyboard shortcuts</h2><p><kbd>/</kbd> Focus project search</p><p><kbd>T</kbd> Switch light or dark mode</p><p><kbd>?</kbd> Open or close this guide</p><p><kbd>Esc</kbd> Close this guide or leave a field</p></section></div>}
    </div>
  );
}

function projectToForm(project) {
  return {
    ...project,
    tagsText: (project.tags || []).join(', '),
    navText: (project.nav || []).join(', '),
    caseStudyContent: project.caseStudyContent || '',
  };
}

function blankProject() {
  return projectToForm({
    id: 'new-project', number: '00', name: '', category: '', address: '', theme: 'field', brand: '', nav: [], action: '',
    eyebrow: '', headline: '', previewCopy: '', previewLink: '', liveUrl: '', image: '', imageAlt: '', description: '', tags: [], challenge: '', response: '', caseStudyContent: '',
  });
}

function slugify(value) {
  return value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 64);
}

function blankSkill() {
  return { id: 'new-skill', area: '', title: '', copy: '' };
}

function SkillEditor({ skill, index, count, isCreating, isBusy, notice, error, onChange, onSubmit, onRemove, onMove }) {
  return (
    <div className="cms-skill-editor">
      <div className="cms-editor-heading"><div><span className="cms-kicker">{isCreating ? 'NEW SKILL CARD' : `SKILL ${String(index + 1).padStart(2, '0')} OF ${String(count).padStart(2, '0')}`}</span><h1 id="cms-skill-title">{isCreating ? 'Add a skill' : skill.title || 'Edit skill'}</h1><p>This content appears in the public capabilities section.</p></div><div className="cms-editor-actions">{!isCreating && <><button className="cms-quiet-button" type="button" onClick={() => onMove(-1)} disabled={isBusy || index <= 0}>Move up</button><button className="cms-quiet-button" type="button" onClick={() => onMove(1)} disabled={isBusy || index >= count - 1}>Move down</button><button className="cms-danger-button" type="button" onClick={onRemove} disabled={isBusy}>Remove skill</button></>}<button className="cms-primary-button" type="submit" form="skill-editor-form" disabled={isBusy}>{isBusy ? 'Publishing…' : 'Publish skill'}</button></div></div>
      {notice && <div className="cms-notice" role="status">{notice}</div>}{error && <div className="cms-error cms-error-banner" role="alert">{error}</div>}
      <article className="cms-skill-preview"><span>{String(index + 1).padStart(2, '0')} / {skill.area || 'Skill area'}</span><h2>{skill.title || 'Your skill title'}</h2><p>{skill.copy || 'A clear description of how this skill helps you build useful products.'}</p></article>
      <form id="skill-editor-form" className="cms-form" onSubmit={onSubmit}>
        <fieldset><legend>Skill card details</legend><div className="cms-form-grid">
          <label className="cms-field" htmlFor="skill-title"><span>Skill title <b aria-hidden="true">*</b></span><input id="skill-title" value={skill.title} onChange={(event) => onChange('title', event.target.value)} maxLength="120" required placeholder="e.g. Machine learning" /></label>
          <label className="cms-field" htmlFor="skill-area"><span>Skill area <b aria-hidden="true">*</b></span><input id="skill-area" value={skill.area} onChange={(event) => onChange('area', event.target.value)} maxLength="80" required placeholder="e.g. Intelligence" /></label>
          <label className="cms-field cms-field-wide" htmlFor="skill-id"><span>Skill slug</span><input id="skill-id" value={skill.id} onChange={(event) => onChange('id', event.target.value)} maxLength="64" pattern="[a-z0-9]+(-[a-z0-9]+)*" /><small>Lowercase words separated by hyphens. Used as a stable identifier.</small></label>
          <label className="cms-field cms-field-wide" htmlFor="skill-copy"><span>Description <b aria-hidden="true">*</b></span><textarea id="skill-copy" value={skill.copy} onChange={(event) => onChange('copy', event.target.value)} maxLength="1200" rows="5" required placeholder="Describe what you do and the value this skill brings." /><small>{skill.copy.length}/1200 characters. Keep it specific and accurate.</small></label>
        </div></fieldset>
      </form>
    </div>
  );
}

function AdminDashboard() {
  const [authState, setAuthState] = useState('checking');
  const [showPassword, setShowPassword] = useState(false);
  const [draftStatus, setDraftStatus] = useState('');
  const [theme, setTheme] = useState(() => {
    try { return window.localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark'; } catch { return 'dark'; }
  });
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillsSha, setSkillsSha] = useState(null);
  const [activeCollection, setActiveCollection] = useState('projects');
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [skillForm, setSkillForm] = useState(blankSkill);
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [form, setForm] = useState(blankProject);
  const [selectedId, setSelectedId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [baseSha, setBaseSha] = useState('');
  const [pendingAssets, setPendingAssets] = useState({});
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [markdownMode, setMarkdownMode] = useState('write');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try { window.localStorage.setItem('portfolio-theme', theme); } catch { /* Theme remains active for this view. */ }
  }, [theme]);

  async function requestJson(path, options = {}) {
    const response = await fetch(path, { credentials: 'same-origin', ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const requestError = new Error(payload.error || `Request failed (${response.status}).`);
      requestError.status = response.status;
      throw requestError;
    }
    return payload;
  }

  async function loadProjects() {
    const data = await requestJson('/api/cms/projects');
    setProjects(data.projects);
    setBaseSha(data.sha);
    setSkills(data.skills || defaultSkills);
    setSkillsSha(data.skillsSha || null);
    let draft = null;
    try { draft = JSON.parse(window.sessionStorage.getItem('tegabyte-cms-draft') || 'null'); } catch { /* Ignore an unreadable session draft. */ }
    if (draft && (draft.isCreating || data.projects.some((project) => project.id === draft.selectedId))) {
      setIsCreating(Boolean(draft.isCreating)); setSelectedId(draft.selectedId || ''); setForm(draft.form || blankProject());
      setDraftStatus('Restored an unsent draft from this browser tab.');
      return;
    }
    if (data.projects.length) {
      setSelectedId(data.projects[0].id);
      setForm(projectToForm(data.projects[0]));
      setIsCreating(false);
    } else {
      setSelectedId('');
      setForm(blankProject());
      setIsCreating(true);
    }
  }

  useEffect(() => {
    requestJson('/api/cms/session')
      .then((data) => {
        if (!data.configured) { setAuthState('unconfigured'); return; }
        if (!data.authenticated) { setAuthState('unauthenticated'); return; }
        return loadProjects().then(() => setAuthState('authenticated'));
      })
      .catch((requestError) => setAuthState(requestError.status === 503 ? 'unconfigured' : 'unauthenticated'));
  // Session state is checked once when the admin route opens.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authState !== 'authenticated') return undefined;
    const saveTimer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem('tegabyte-cms-draft', JSON.stringify({ selectedId, isCreating, form }));
        setDraftStatus('Draft auto-saved in this tab.');
      } catch { setDraftStatus('Draft could not be saved in this browser.'); }
    }, 450);
    return () => window.clearTimeout(saveTimer);
  }, [authState, selectedId, isCreating, form]);

  async function login(event) {
    event.preventDefault();
    setIsBusy(true); setError('');
    try {
      await requestJson('/api/cms/session', { method: 'POST', body: JSON.stringify({ password }) });
      setPassword('');
      await loadProjects();
      setAuthState('authenticated');
    } catch (requestError) { setError(requestError.message); }
    finally { setIsBusy(false); }
  }

  async function logout() {
    try { await requestJson('/api/cms/session', { method: 'DELETE' }); } catch { /* Return to login even if the session expired. */ }
    setProjects([]); setAuthState('unauthenticated'); setPassword('');
  }

  function chooseProject(project) {
    setSelectedId(project.id); setForm(projectToForm(project)); setIsCreating(false); setShowPreview(false); setPendingAssets({}); setError(''); setNotice('');
  }

  function startNewProject() {
    setSelectedId(''); setForm(blankProject()); setIsCreating(true); setShowPreview(false); setPendingAssets({}); setError(''); setNotice('');
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value, ...(name === 'name' && isCreating ? { id: slugify(value) || 'new-project' } : {}) }));
    setNotice('');
  }

  async function selectImage(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type)) { setError('Choose a JPG, PNG, WebP, or AVIF image.'); return; }
    if (file.size > 3 * 1024 * 1024) { setError('Images must be 3 MB or smaller.'); return; }
    const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' }[file.type];
    const path = `/uploads/${slugify(form.id || form.name || 'project')}-${Date.now()}.${extension}`;
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result || '');
      if (!data.startsWith(`data:${file.type};base64,`)) { setError('That image could not be read.'); return; }
      setPendingAssets((current) => ({ ...current, [path]: data }));
      setForm((current) => ({ ...current, image: path, imageAlt: current.imageAlt || `${current.name || 'Project'} preview` }));
      setError(''); setNotice('Image added. Publish the project to commit it to the site.');
    };
    reader.onerror = () => setError('That image could not be read.');
    reader.readAsDataURL(file);
  }

  function makeProject(source, index) {
    const { tagsText, navText, ...rest } = source;
    return {
      ...rest,
      id: slugify(rest.id || rest.name),
      number: String(index + 1).padStart(2, '0'),
      nav: navText.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 8),
      tags: tagsText.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 12),
      caseStudyContent: String(rest.caseStudyContent || '').slice(0, 40000),
    };
  }

  async function publish(nextProjects, preserveEditor = false) {
    setIsBusy(true); setError(''); setNotice('');
    try {
      const normalized = nextProjects.map((project, index) => makeProject(projectToForm(project), index));
      const uniqueIds = new Set(normalized.map((project) => project.id));
      if (uniqueIds.size !== normalized.length) throw new Error('Each project needs a unique title/slug.');
      if (normalized.some((project) => !project.name || !project.category || !project.description)) throw new Error('Each project needs a title, category, and short description.');
      if (normalized.some((project) => project.liveUrl && !/^https:\/\//i.test(project.liveUrl))) throw new Error('Project links must use HTTPS.');
      if (normalized.some((project) => project.image && !/^https:\/\//i.test(project.image) && !/^\/uploads\/[a-z0-9-]+\.(jpg|png|webp|avif)$/i.test(project.image))) throw new Error('Cover images must use HTTPS or an uploaded /uploads image.');
      const assets = Object.entries(pendingAssets).map(([path, data]) => ({ path, data }));
      const result = await requestJson('/api/cms/publish', { method: 'POST', body: JSON.stringify({ projects: normalized, skills, baseSha, skillsSha, assets }) });
      setProjects(normalized); setBaseSha(result.sha); setSkillsSha(result.skillsSha); setPendingAssets({});
      if (preserveEditor) {
        setSelectedId(selectedId); setForm(form);
      } else if (normalized.length) {
        const savedId = isCreating ? normalized[normalized.length - 1].id : slugify(form.id || form.name);
        const selected = normalized.find((project) => project.id === savedId) || normalized[0];
        setSelectedId(selected.id); setForm(projectToForm(selected)); setIsCreating(false);
      } else { setSelectedId(''); setForm(blankProject()); setIsCreating(true); }
      setNotice(`Published commit ${result.commitSha.slice(0, 7)} to ${result.branch}. The connected deployment will update after its build completes.`);
    } catch (requestError) {
      setError(requestError.status === 409 ? 'The catalog changed on GitHub since you opened it. Reload the latest version before publishing to avoid overwriting someone else’s changes.' : requestError.message);
    } finally { setIsBusy(false); }
  }

  async function saveProject(event) {
    event.preventDefault();
    const current = makeProject(form, isCreating ? projects.length : Math.max(0, projects.findIndex((project) => project.id === selectedId)));
    const next = isCreating ? [...projects, current] : projects.map((project) => project.id === selectedId ? current : project);
    await publish(next);
  }

  async function removeProject() {
    const selected = projects.find((project) => project.id === selectedId);
    if (!selected || !window.confirm(`Remove “${selected.name}” from the live portfolio? This publishes the removal immediately.`)) return;
    await publish(projects.filter((project) => project.id !== selectedId));
  }

  async function moveProject(projectId, offset) {
    const index = projects.findIndex((project) => project.id === projectId);
    const target = index + offset;
    if (index < 0 || target < 0 || target >= projects.length) return;
    const reordered = [...projects];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const numbered = reordered.map((project, itemIndex) => ({ ...project, number: String(itemIndex + 1).padStart(2, '0') }));
    await publish(numbered, true);
  }

  function chooseSkill(skill) {
    setSelectedSkillId(skill.id); setSkillForm({ ...skill }); setIsCreatingSkill(false); setError(''); setNotice('');
  }

  function startNewSkill() {
    setSelectedSkillId(''); setSkillForm(blankSkill()); setIsCreatingSkill(true); setError(''); setNotice('');
  }

  function updateSkillField(name, value) {
    setSkillForm((current) => ({ ...current, [name]: value, ...(name === 'title' && isCreatingSkill ? { id: slugify(value) || 'new-skill' } : {}) }));
    setNotice('');
  }

  async function publishSkills(nextSkills) {
    setIsBusy(true); setError(''); setNotice('');
    try {
      const normalized = nextSkills.map((skill) => ({ id: slugify(skill.id || skill.title), area: String(skill.area || '').trim(), title: String(skill.title || '').trim(), copy: String(skill.copy || '').trim() }));
      if (new Set(normalized.map((skill) => skill.id)).size !== normalized.length) throw new Error('Each skill needs a unique title or slug.');
      if (normalized.some((skill) => !skill.area || !skill.title || !skill.copy)) throw new Error('Every skill needs an area, title, and description.');
      if (normalized.length > 50) throw new Error('You can add up to 50 skills.');
      const assets = Object.entries(pendingAssets).map(([path, data]) => ({ path, data }));
      const result = await requestJson('/api/cms/publish', { method: 'POST', body: JSON.stringify({ projects, skills: normalized, baseSha, skillsSha, assets }) });
      setSkills(normalized); setSkillsSha(result.skillsSha); setBaseSha(result.sha); setPendingAssets({});
      if (normalized.length) {
        const targetId = isCreatingSkill ? normalized[normalized.length - 1].id : skillForm.id;
        const selected = normalized.find((skill) => skill.id === targetId) || normalized[0];
        setSelectedSkillId(selected.id); setSkillForm({ ...selected }); setIsCreatingSkill(false);
      } else { setSelectedSkillId(''); setSkillForm(blankSkill()); setIsCreatingSkill(true); }
      setNotice(`Skills published in commit ${result.commitSha.slice(0, 7)}. The live site will update after its build completes.`);
    } catch (requestError) {
      setError(requestError.status === 409 ? 'The project or skills catalog changed on GitHub. Reload the latest catalog before publishing.' : requestError.message);
    } finally { setIsBusy(false); }
  }

  async function saveSkill(event) {
    event.preventDefault();
    const next = isCreatingSkill ? [...skills, skillForm] : skills.map((skill) => skill.id === selectedSkillId ? skillForm : skill);
    await publishSkills(next);
  }

  async function removeSkill() {
    const selected = skills.find((skill) => skill.id === selectedSkillId);
    if (!selected || !window.confirm(`Remove “${selected.title}” from the public skills section? This publishes the change immediately.`)) return;
    await publishSkills(skills.filter((skill) => skill.id !== selectedSkillId));
  }

  async function moveSkill(skillId, offset) {
    const index = skills.findIndex((skill) => skill.id === skillId);
    const target = index + offset;
    if (index < 0 || target < 0 || target >= skills.length) return;
    const reordered = [...skills];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    await publishSkills(reordered);
  }

  if (authState === 'checking') return <div className="cms-gate" data-theme={theme}><p>Checking CMS access…</p></div>;
  if (authState === 'unconfigured') return (
    <div className="cms-gate" data-theme={theme}><section className="cms-login-card"><span className="cms-kicker">Tegabyte · Admin</span><h1>CMS setup needed</h1><p>The admin is protected, but its server-side GitHub credentials are not configured yet. Follow the secure deployment steps in <code>CMS_SETUP.md</code>. Do not place credentials in React code or browser storage.</p><a href="/">Return to portfolio</a></section></div>
  );
  if (authState === 'unauthenticated') return (
    <div className="cms-gate" data-theme={theme}><form className="cms-login-card" onSubmit={login}><span className="cms-kicker">Tegabyte · Private admin</span><h1>Sign in to manage projects.</h1><p>Publishing changes writes a commit to the portfolio repository and starts the connected deployment.</p><label htmlFor="cms-password">Admin password</label><div className="cms-password-field"><input id="cms-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-pressed={showPassword}>{showPassword ? 'Hide' : 'Show'}</button></div><button className="cms-primary-button" type="submit" disabled={isBusy}>{isBusy ? 'Signing in…' : 'Sign in securely'}</button>{error && <p className="cms-error" role="alert">{error}</p>}<a href="/">Return to portfolio</a></form></div>
  );

  const previewProject = makeProject(form, 0);
  const pendingImage = pendingAssets[form.image];
  const field = (name, label, options = {}) => (
    <label className={options.wide ? 'cms-field cms-field-wide' : 'cms-field'} htmlFor={`project-${name}`} key={name}>
      <span>{label}{options.required && <b aria-hidden="true"> *</b>}</span>
      {options.multiline ? <textarea id={`project-${name}`} rows={options.rows || 3} value={form[name] || ''} onChange={(event) => updateField(name, event.target.value)} required={options.required} /> : <input id={`project-${name}`} type={options.type || 'text'} value={form[name] || ''} onChange={(event) => updateField(name, event.target.value)} required={options.required} placeholder={options.placeholder || ''} />}
      {options.help && <small>{options.help}</small>}
    </label>
  );

  return (
    <div className="cms-app" data-theme={theme}>
      <header className="cms-header"><a className="cms-brand" href="/"><span>TB</span><div><strong>Tegabyte</strong><small>CONTENT STUDIO</small></div></a><div className="cms-header-actions"><span className="cms-live-indicator"><i /> GitHub publishing enabled</span><button type="button" className="cms-quiet-button" onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? '☼ Light mode' : '☾ Dark mode'}</button><button type="button" className="cms-quiet-button" onClick={logout}>Sign out</button></div></header>
      <main className="cms-layout">
        <aside className="cms-sidebar" aria-label="Content manager">
          <div className="cms-sidebar-title"><div><span className="cms-kicker">PORTFOLIO CMS</span><h2>{activeCollection === 'projects' ? 'Projects' : 'Skills'} <small>{activeCollection === 'projects' ? projects.length : skills.length}</small></h2></div><button type="button" className="cms-add-button" onClick={activeCollection === 'projects' ? startNewProject : startNewSkill} aria-label={`Add a new ${activeCollection === 'projects' ? 'project' : 'skill'}`}>＋</button></div>
          <div className="cms-collection-tabs" role="tablist" aria-label="Choose content type"><button type="button" role="tab" aria-selected={activeCollection === 'projects'} className={activeCollection === 'projects' ? 'is-active' : ''} onClick={() => setActiveCollection('projects')}>Projects</button><button type="button" role="tab" aria-selected={activeCollection === 'skills'} className={activeCollection === 'skills' ? 'is-active' : ''} onClick={() => { setActiveCollection('skills'); if (!selectedSkillId && !isCreatingSkill && skills.length) chooseSkill(skills[0]); }}>Skills</button></div>
          <p className="cms-sidebar-copy">{activeCollection === 'projects' ? 'Choose a project to edit, or create a new project card.' : 'Manage the skill cards displayed in the public capabilities section.'}</p>
          {activeCollection === 'projects' ? <><div className="cms-project-list">{projects.map((project, index) => <div className={`cms-project-choice${project.id === selectedId && !isCreating ? ' is-selected' : ''}`} key={project.id}><button type="button" className="cms-project-select" onClick={() => chooseProject(project)}><span className="cms-project-order">{String(index + 1).padStart(2, '0')}</span><span><strong>{project.name}</strong><small>{project.category || 'Uncategorized'}</small></span></button><div className="cms-order-controls"><button type="button" onClick={() => moveProject(project.id, -1)} disabled={index === 0 || isBusy} aria-label={`Move ${project.name} up`}>↑</button><button type="button" onClick={() => moveProject(project.id, 1)} disabled={index === projects.length - 1 || isBusy} aria-label={`Move ${project.name} down`}>↓</button></div></div>)}</div><button type="button" className="cms-create-project" onClick={startNewProject}>＋ Add project</button></> : <><div className="cms-project-list">{skills.map((skill, index) => <div className={`cms-project-choice${skill.id === selectedSkillId && !isCreatingSkill ? ' is-selected' : ''}`} key={skill.id}><button type="button" className="cms-project-select" onClick={() => chooseSkill(skill)}><span className="cms-project-order">{String(index + 1).padStart(2, '0')}</span><span><strong>{skill.title}</strong><small>{skill.area}</small></span></button><div className="cms-order-controls"><button type="button" onClick={() => moveSkill(skill.id, -1)} disabled={index === 0 || isBusy} aria-label={`Move ${skill.title} up`}>↑</button><button type="button" onClick={() => moveSkill(skill.id, 1)} disabled={index === skills.length - 1 || isBusy} aria-label={`Move ${skill.title} down`}>↓</button></div></div>)}</div><button type="button" className="cms-create-project" onClick={startNewSkill}>＋ Add skill</button></>}
          <p className="cms-sidebar-foot">Published changes are versioned in GitHub and trigger the connected site deployment.</p>
        </aside>
        <section className="cms-editor" aria-labelledby={activeCollection === 'skills' ? 'cms-skill-title' : 'cms-editor-title'}>
          {activeCollection === 'skills' ? <SkillEditor skill={skillForm} index={Math.max(0, skills.findIndex((skill) => skill.id === selectedSkillId))} count={skills.length} isCreating={isCreatingSkill} isBusy={isBusy} notice={notice} error={error} onChange={updateSkillField} onSubmit={saveSkill} onRemove={removeSkill} onMove={(offset) => moveSkill(selectedSkillId, offset)} /> : <>
          <div className="cms-editor-heading"><div><span className="cms-kicker">{isCreating ? 'NEW PORTFOLIO ENTRY' : `EDITING · ${String(form.number || '00').padStart(2, '0')}`}</span><h1 id="cms-editor-title">{isCreating ? 'Create a project' : form.name || 'Edit project'}</h1><p>Manage the card, preview, and full case study in one place.</p></div><div className="cms-editor-actions"><button className="cms-quiet-button" type="button" onClick={() => setShowPreview((value) => !value)}>{showPreview ? 'Hide preview' : 'Preview changes'}</button>{!isCreating && <button className="cms-danger-button" type="button" onClick={removeProject} disabled={isBusy}>Remove project</button>}<button className="cms-primary-button" form="project-editor-form" type="submit" disabled={isBusy}>{isBusy ? 'Publishing…' : 'Publish changes'}</button></div></div>
          {notice && <div className="cms-notice" role="status">{notice}</div>}{error && <div className="cms-error cms-error-banner" role="alert">{error}</div>}
          {draftStatus && activeCollection === 'projects' && <p className="cms-draft-status" role="status">{draftStatus}</p>}
          {showPreview && <article className="cms-preview-card"><div className="cms-preview-top"><span>LIVE CARD PREVIEW</span><span>{previewProject.category || 'Category'}</span></div>{pendingImage || form.image ? <img src={pendingImage || form.image} alt={form.imageAlt || `${form.name || 'Project'} cover preview`} /> : <div className={`cms-preview-placeholder theme-${form.theme}`}><span>{form.brand || 'PROJECT'}</span><strong>{form.headline || 'Your project headline'}</strong><p>{form.previewCopy || form.description || 'Add a short project introduction.'}</p></div>}<div className="cms-preview-copy"><h2>{form.name || 'Project title'}</h2><p>{form.description || 'Project card description appears here.'}</p><div>{(form.tagsText || '').split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => <span key={tag}>{tag}</span>)}</div><details open><summary>Case study preview</summary><MarkdownContent content={form.caseStudyContent} /></details></div></article>}
          <form id="project-editor-form" className="cms-form" onSubmit={saveProject}>
            <fieldset><legend>Project identity</legend><div className="cms-form-grid">
              {field('name', 'Project title', { required: true, placeholder: 'e.g. Recipe Central' })}
              {field('category', 'Category / label', { required: true, placeholder: 'e.g. Food & lifestyle' })}
              {field('id', 'Project slug', { help: 'Used for stable project identity and uploaded image paths.' })}
              <label className="cms-field" htmlFor="project-theme"><span>Card visual theme</span><select id="project-theme" value={form.theme || 'field'} onChange={(event) => updateField('theme', event.target.value)}><option value="recipe-central">Recipe Central</option><option value="assurrex">AssureX</option><option value="field">Editorial</option></select></label>
              {field('description', 'Card description', { required: true, multiline: true, rows: 4, wide: true, help: 'A concise description shown on the selected-work card.' })}
              {field('tagsText', 'Tags', { placeholder: 'Brand design, React, AI/ML', help: 'Separate tags with commas.' })}
            </div></fieldset>
            <fieldset><legend>Project link and cover</legend><div className="cms-form-grid">
              {field('liveUrl', 'Live project URL', { type: 'url', placeholder: 'https://example.com' })}
              {field('address', 'Browser-bar label', { placeholder: 'example.com' })}
              {field('image', 'Cover image URL or uploaded path', { wide: true, placeholder: 'https://… or upload an image below' })}
              {field('imageAlt', 'Image description (alt text)', { wide: true, placeholder: 'Describe the important content in the image' })}
              <label className="cms-field cms-field-wide" htmlFor="project-image-file"><span>Upload a cover image</span><input id="project-image-file" type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={selectImage} /><small>JPG, PNG, WebP or AVIF; max 3 MB. The file is committed with the project when published.</small></label>
            </div></fieldset>
            <fieldset><legend>Landing-page preview content</legend><div className="cms-form-grid">
              {field('brand', 'Preview wordmark', { placeholder: 'BRAND NAME' })}
              {field('action', 'Preview button label', { placeholder: 'Explore project' })}
              {field('eyebrow', 'Preview eyebrow', { wide: true })}
              {field('headline', 'Preview headline', { wide: true })}
              {field('previewCopy', 'Preview summary', { multiline: true, rows: 3, wide: true })}
              {field('previewLink', 'Preview link label')}
              {field('navText', 'Preview navigation items', { help: 'Separate labels with commas.' })}
            </div></fieldset>
            <fieldset><legend>Case study</legend><div className="cms-form-grid">
              {field('challenge', 'Challenge', { multiline: true, rows: 4, wide: true })}
              {field('response', 'Approach / response', { multiline: true, rows: 4, wide: true })}
              <div className="cms-field cms-field-wide cms-markdown-field"><div className="cms-markdown-head"><label htmlFor="project-case-study">Full case study content <small>Markdown supported · raw HTML is disabled</small></label><div role="tablist" aria-label="Case study editor mode"><button type="button" role="tab" aria-selected={markdownMode === 'write'} className={markdownMode === 'write' ? 'is-active' : ''} onClick={() => setMarkdownMode('write')}>Write</button><button type="button" role="tab" aria-selected={markdownMode === 'preview'} className={markdownMode === 'preview' ? 'is-active' : ''} onClick={() => setMarkdownMode('preview')}>Preview</button></div></div>{markdownMode === 'write' ? <><div className="cms-markdown-toolbar"><button type="button" onClick={() => updateField('caseStudyContent', `${form.caseStudyContent || ''}${form.caseStudyContent ? '\n\n' : ''}## New section\n`)}>H2 Section</button><button type="button" onClick={() => updateField('caseStudyContent', `${form.caseStudyContent || ''}${form.caseStudyContent ? '\n\n' : ''}**Bold text**`)}>Bold</button><button type="button" onClick={() => updateField('caseStudyContent', `${form.caseStudyContent || ''}${form.caseStudyContent ? '\n\n' : ''}- List item`)}>Bullet list</button></div><textarea id="project-case-study" rows="16" value={form.caseStudyContent || ''} onChange={(event) => updateField('caseStudyContent', event.target.value)} placeholder={'## Overview\nDescribe the project…\n\n## Approach\n- Add a key decision\n- Add an outcome'} /><small>Supports headings, paragraphs, bullet lists, block quotes, **bold**, *italic*, `inline code`, and HTTPS links.</small></> : <div className="cms-markdown-preview"><MarkdownContent content={form.caseStudyContent} /></div>}</div>
            </div></fieldset>
          </form>
          </>}
        </section>
      </main>
    </div>
  );
}

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/admin') return <AdminDashboard />;
  if (path === '/' || path === '/index.html') return <PortfolioApp />;
  return <NotFoundPage />;
}

function NotFoundPage() {
  const [theme, setTheme] = useState(getSavedTheme);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  return (
    <main className="not-found-shell" data-theme={theme}>
      <div className="not-found-topline"><a className="not-found-brand" href="/" aria-label="Tegabyte home"><span>TB</span> Tegabyte</a><button type="button" className="not-found-theme" onClick={() => setTheme((value) => value === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? '☼' : '☾'}</button></div>
      <section className="not-found-content" aria-labelledby="not-found-title">
        <div className="not-found-graphic" aria-hidden="true"><div className="not-found-orbit orbit-one"/><div className="not-found-orbit orbit-two"/><div className="not-found-crosshair">404</div><span className="not-found-pixel pixel-one"/><span className="not-found-pixel pixel-two"/><span className="not-found-pixel pixel-three"/></div>
        <span className="not-found-kicker">ROUTE NOT FOUND · 404</span>
        <h1 id="not-found-title">Looks like this path<br/><em>is still in the lab.</em></h1>
        <p>The page may have moved, or the address might be off. Let’s get you back to the workbench.</p>
        <a className="not-found-home-link" href="/">Return to portfolio <span aria-hidden="true">↗</span></a>
        <div className="not-found-footer"><span>TEGABYTE · DIGITAL PRODUCT ENGINEERING</span><a href="mailto:oyibochaoghenetega5@gmail.com">Need a hand? Get in touch</a></div>
      </section>
    </main>
  );
}

export default App;
