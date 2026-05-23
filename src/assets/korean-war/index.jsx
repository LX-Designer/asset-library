import { useState, useEffect, useRef } from "react";

async function getAIFeedback(chapter, taskType, studentResponse, context) {
  try {
    const res = await fetch("/api/socratic-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapter, taskType, studentResponse, context }),
    });
    const data = await res.json();
    return data.feedback ?? "Could not get feedback. Please try again.";
  } catch {
    return "Feedback unavailable right now. Reflect on: what evidence supports your claim? Whose perspective might you be missing?";
  }
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Special+Elite&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:       #1a1208;
    --paper:     #f2ead8;
    --paper-mid: #e8dcc4;
    --paper-dark:#d4c4a0;
    --olive:     #4a5240;
    --olive-lt:  #6b7560;
    --red:       #8b1a1a;
    --red-lt:    #b02020;
    --gold:      #b8860b;
    --gold-lt:   #d4a017;
    --cream:     #faf6ec;
    --shadow:    rgba(26,18,8,0.18);
  }

  .kw-shell {
    font-family: 'Libre Baskerville', Georgia, serif;
    background: var(--ink);
    color: var(--ink);
    min-height: 100vh;
    overflow-x: hidden;
    transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .kw-shell.sidebar-open { margin-left: 260px; }
  @media (max-width: 700px) {
    .kw-shell.sidebar-open { margin-left: 0; }
  }

  .kw-shell::before {
    content: '';
    position: fixed; inset: 0; z-index: 9999;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.35;
  }

  .display { font-family: 'Playfair Display', Georgia, serif; }
  .typewriter { font-family: 'Special Elite', monospace; }

  /* ─── SIDEBAR ─── */
  .kw-burger {
    position: fixed;
    left: 12px;
    top: calc(var(--nav-height, 60px) + 12px);
    z-index: 102;
    width: 36px;
    height: 36px;
    background: var(--ink);
    border: 1px solid var(--gold);
    color: var(--gold);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    line-height: 1;
    padding: 0;
    transition: background 0.2s;
  }
  .kw-burger:hover { background: rgba(184,134,11,0.12); }

  .kw-sidebar {
    position: fixed;
    left: 0;
    top: var(--nav-height, 60px);
    bottom: 0;
    width: 260px;
    background: var(--ink);
    border-right: 2px solid var(--gold);
    z-index: 101;
    display: flex;
    flex-direction: column;
    transform: translateX(-260px);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    overflow-x: hidden;
  }
  .kw-sidebar.open { transform: translateX(0); }

  .kw-sidebar-header {
    padding: 0.85rem 1rem 0.85rem 3.5rem;
    border-bottom: 1px solid rgba(184,134,11,0.3);
    flex-shrink: 0;
  }
  .kw-sidebar-title {
    font-family: 'Playfair Display', serif;
    font-size: 0.8rem;
    color: var(--gold);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    line-height: 1.4;
  }

  .kw-sidebar-nav {
    flex: 1;
    padding: 0.5rem 0;
    overflow-y: auto;
  }
  .kw-sidebar-btn {
    display: block;
    width: 100%;
    background: none;
    border: none;
    border-left: 3px solid transparent;
    cursor: pointer;
    font-family: 'Special Elite', monospace;
    font-size: 0.68rem;
    color: var(--paper-dark);
    padding: 0.75rem 1rem 0.75rem 1.25rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: left;
    white-space: nowrap;
    transition: color 0.2s, background 0.2s, border-color 0.2s;
  }
  .kw-sidebar-btn:hover {
    color: var(--paper);
    background: rgba(184,134,11,0.06);
  }
  .kw-sidebar-btn.active {
    color: var(--gold);
    border-left-color: var(--gold);
    background: rgba(184,134,11,0.08);
  }
  .kw-sidebar-divider {
    height: 1px;
    background: rgba(184,134,11,0.25);
    margin: 0.4rem 1rem;
  }

  .kw-sidebar-footer {
    flex-shrink: 0;
    padding: 0.75rem 1rem 1.25rem;
    border-top: 1px solid rgba(184,134,11,0.25);
  }
  .kw-reset-btn {
    display: block;
    width: 100%;
    background: none;
    border: 1px solid rgba(139,26,26,0.5);
    cursor: pointer;
    font-family: 'Special Elite', monospace;
    font-size: 0.65rem;
    color: var(--red);
    padding: 0.6rem 1rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-align: left;
    transition: background 0.2s, border-color 0.2s;
  }
  .kw-reset-btn:hover {
    background: rgba(139,26,26,0.12);
    border-color: var(--red-lt);
  }

  .kw-confirm-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26,18,8,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }
  .kw-confirm-dialog {
    background: var(--paper);
    border: 1px solid var(--paper-dark);
    padding: 2rem;
    max-width: 360px;
    width: calc(100% - 3rem);
    box-shadow: 8px 8px 0 var(--paper-dark);
  }
  .kw-confirm-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    color: var(--ink);
    margin-bottom: 0.75rem;
  }
  .kw-confirm-text {
    font-family: 'Libre Baskerville', serif;
    font-size: 0.88rem;
    color: var(--olive);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-style: italic;
  }
  .kw-confirm-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  .hero {
    min-height: 100vh;
    background: var(--ink);
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 0 0 6rem;
    position: relative;
    overflow: hidden;
  }
  .hero-img {
    position: absolute; inset: 0;
    background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Korean_War_soldier_resting.jpg/1200px-Korean_War_soldier_resting.jpg') center/cover no-repeat;
    opacity: 0.22;
    filter: sepia(0.6) contrast(1.2);
  }
  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, var(--ink) 35%, transparent 75%);
  }
  .hero-content {
    position: relative; z-index: 2;
    padding: 0 4rem;
    max-width: 900px;
  }
  .hero-eyebrow {
    font-family: 'Special Elite', monospace;
    font-size: 0.8rem;
    color: var(--red);
    letter-spacing: 0.25em;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    display: flex; align-items: center; gap: 1rem;
  }
  .hero-eyebrow::before {
    content: '';
    display: inline-block; width: 40px; height: 1px;
    background: var(--red);
  }
  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3.5rem, 8vw, 7rem);
    font-weight: 900;
    color: var(--paper);
    line-height: 0.9;
    margin-bottom: 1rem;
  }
  .hero-title em {
    font-style: italic;
    color: var(--gold);
    display: block;
  }
  .hero-subtitle {
    font-family: 'Libre Baskerville', serif;
    font-size: 1.1rem;
    color: var(--paper-dark);
    font-style: italic;
    margin-bottom: 2.5rem;
    max-width: 500px;
    line-height: 1.6;
  }
  .hero-dates {
    font-family: 'Special Elite', monospace;
    font-size: 0.85rem;
    color: var(--olive-lt);
    letter-spacing: 0.1em;
    border-top: 1px solid var(--olive);
    padding-top: 1rem;
    display: flex; gap: 2rem;
  }
  .scroll-hint {
    position: absolute; bottom: 2rem; right: 4rem; z-index: 2;
    font-family: 'Special Elite', monospace;
    font-size: 0.7rem;
    color: var(--olive-lt);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    writing-mode: vertical-rl;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .scroll-hint::after {
    content: '';
    display: block; width: 1px; height: 60px;
    background: linear-gradient(to bottom, var(--olive-lt), transparent);
  }

  .outcomes-panel {
    background: var(--paper);
    padding: 5rem 4rem;
    position: relative;
  }
  .outcomes-panel::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 4px;
    background: repeating-linear-gradient(90deg, var(--red) 0, var(--red) 20px, transparent 20px, transparent 30px);
  }
  .section-label {
    font-family: 'Special Elite', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--red);
    margin-bottom: 1rem;
  }
  .outcomes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  .outcome-card {
    background: var(--cream);
    border: 1px solid var(--paper-dark);
    border-left: 4px solid var(--olive);
    padding: 1.5rem;
    position: relative;
  }
  .outcome-num {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    font-weight: 900;
    color: var(--paper-dark);
    line-height: 1;
    position: absolute; top: 1rem; right: 1.2rem;
    opacity: 0.4;
  }
  .outcome-text {
    font-size: 0.9rem;
    line-height: 1.6;
    color: var(--ink);
    padding-right: 2rem;
  }

  .chapter {
    background: var(--paper);
    padding: 0;
    border-top: 6px solid var(--ink);
    position: relative;
    scroll-margin-top: var(--nav-height, 60px);
  }
  .chapter-opener {
    min-height: 55vh;
    display: flex; flex-direction: column; justify-content: flex-end;
    position: relative;
    overflow: hidden;
    padding: 4rem;
  }
  .chapter-bg {
    position: absolute; inset: 0;
    background-size: cover;
    background-position: center;
    opacity: 0.18;
    filter: sepia(0.7) contrast(1.3);
  }
  .chapter-bg-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, var(--paper) 20%, transparent 80%);
  }
  .chapter-meta {
    position: relative; z-index: 2;
  }
  .chapter-num {
    font-family: 'Special Elite', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.25em;
    color: var(--red);
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }
  .chapter-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 4rem);
    font-weight: 900;
    color: var(--ink);
    line-height: 1;
    margin-bottom: 1rem;
  }
  .chapter-inquiry {
    font-family: 'Libre Baskerville', serif;
    font-style: italic;
    font-size: 1.1rem;
    color: var(--olive);
    max-width: 600px;
    border-left: 3px solid var(--gold);
    padding-left: 1rem;
  }

  .chapter-body {
    padding: 4rem;
    max-width: 860px;
  }
  .chapter-body p {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--ink);
    margin-bottom: 1.5rem;
  }
  .chapter-body p + p { text-indent: 1.5em; }

  .pull-quote {
    margin: 3rem 0;
    padding: 2rem 3rem;
    border-top: 3px double var(--ink);
    border-bottom: 3px double var(--ink);
    background: var(--cream);
    text-align: center;
  }
  .pull-quote blockquote {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-style: italic;
    color: var(--ink);
    line-height: 1.5;
    margin-bottom: 0.75rem;
  }
  .pull-quote cite {
    font-family: 'Special Elite', monospace;
    font-size: 0.72rem;
    color: var(--olive);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .visual-panel {
    background: var(--ink);
    padding: 4rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }
  .visual-panel.full { grid-template-columns: 1fr; }
  .visual-panel.reverse { direction: rtl; }
  .visual-panel.reverse > * { direction: ltr; }
  .archive-photo { position: relative; }
  .archive-photo img {
    width: 100%; display: block;
    filter: sepia(0.4) contrast(1.1);
    border: 1px solid var(--olive);
  }
  .photo-caption {
    font-family: 'Special Elite', monospace;
    font-size: 0.7rem;
    color: var(--paper-dark);
    margin-top: 0.75rem;
    line-height: 1.5;
    letter-spacing: 0.05em;
  }
  .photo-question {
    color: var(--gold);
    display: block;
    margin-top: 0.4rem;
    font-style: italic;
  }
  .visual-text { color: var(--paper-dark); }
  .visual-text p {
    font-size: 0.95rem;
    line-height: 1.8;
    margin-bottom: 1.2rem;
  }
  .visual-text h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--paper);
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .source-doc {
    margin: 3rem 4rem;
    background: var(--cream);
    border: 1px solid var(--paper-dark);
    box-shadow: 8px 8px 0 var(--paper-dark);
    position: relative;
  }
  .source-doc::before {
    content: 'PRIMARY SOURCE';
    position: absolute; top: -0.8rem; left: 1.5rem;
    font-family: 'Special Elite', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    background: var(--red);
    color: var(--paper);
    padding: 0.2rem 0.6rem;
  }
  .source-doc-header {
    padding: 1.5rem 2rem 0.75rem;
    border-bottom: 1px solid var(--paper-dark);
  }
  .source-doc-header h4 {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 700;
    color: var(--ink);
  }
  .source-doc-header p {
    font-family: 'Special Elite', monospace;
    font-size: 0.7rem;
    color: var(--olive);
    letter-spacing: 0.08em;
    margin-top: 0.3rem;
  }
  .source-doc-body {
    padding: 1.5rem 2rem;
    font-size: 0.92rem;
    line-height: 1.8;
    color: var(--ink);
    font-style: italic;
  }

  .timeline {
    background: var(--ink);
    padding: 4rem;
    overflow-x: auto;
  }
  .timeline-track {
    display: flex; align-items: flex-start;
    gap: 0;
    min-width: 900px;
    position: relative;
  }
  .timeline-track::before {
    content: '';
    position: absolute;
    top: 28px; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--olive), var(--gold), var(--red), var(--olive));
  }
  .timeline-event {
    flex: 1; min-width: 120px;
    padding-top: 56px;
    padding-right: 1rem;
    position: relative;
    cursor: default;
  }
  .timeline-dot {
    position: absolute; top: 20px; left: 0;
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--paper-dark);
    border: 3px solid var(--ink);
    transition: transform 0.2s, background 0.2s;
  }
  .timeline-event:hover .timeline-dot { transform: scale(1.4); background: var(--gold); }
  .timeline-event.red .timeline-dot { background: var(--red); }
  .timeline-event.gold .timeline-dot { background: var(--gold); }
  .timeline-event.olive .timeline-dot { background: var(--olive-lt); }
  .timeline-date {
    font-family: 'Special Elite', monospace;
    font-size: 0.65rem;
    color: var(--gold);
    letter-spacing: 0.1em;
    margin-bottom: 0.3rem;
  }
  .timeline-label {
    font-family: 'Libre Baskerville', serif;
    font-size: 0.78rem;
    color: var(--paper-dark);
    line-height: 1.4;
  }

  .chart-container { background: var(--ink); padding: 3rem 4rem; }
  .chart-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    color: var(--paper);
    margin-bottom: 0.5rem;
  }
  .chart-note {
    font-family: 'Special Elite', monospace;
    font-size: 0.68rem;
    color: var(--olive-lt);
    letter-spacing: 0.08em;
    margin-bottom: 2rem;
  }
  .chart-bars { display: flex; flex-direction: column; gap: 1.2rem; }
  .chart-row {
    display: grid;
    grid-template-columns: 160px 1fr 80px;
    align-items: center;
    gap: 1rem;
  }
  .chart-label {
    font-family: 'Special Elite', monospace;
    font-size: 0.72rem;
    color: var(--paper-dark);
    letter-spacing: 0.05em;
    text-align: right;
  }
  .chart-bar-wrap {
    background: rgba(255,255,255,0.05);
    height: 24px;
    position: relative;
    border-left: 1px solid var(--olive);
  }
  .chart-bar { height: 100%; transition: width 1s cubic-bezier(0.25,0.46,0.45,0.94); }
  .chart-value {
    font-family: 'Special Elite', monospace;
    font-size: 0.7rem;
    color: var(--gold);
    letter-spacing: 0.05em;
  }
  .chart-legend { display: flex; gap: 2rem; margin-top: 1.5rem; flex-wrap: wrap; }
  .legend-item {
    display: flex; align-items: center; gap: 0.5rem;
    font-family: 'Special Elite', monospace;
    font-size: 0.65rem;
    color: var(--paper-dark);
    letter-spacing: 0.05em;
  }
  .legend-dot { width: 10px; height: 10px; border-radius: 2px; }

  .map-container { background: var(--ink); padding: 3rem 4rem; }
  .korea-map { display: flex; gap: 3rem; align-items: flex-start; flex-wrap: wrap; }
  .map-svg-wrap { flex: 0 0 280px; }
  .map-info { flex: 1; min-width: 240px; }
  .map-phase-buttons { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .phase-btn {
    font-family: 'Special Elite', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0.4rem 0.8rem;
    border: 1px solid var(--olive);
    background: none;
    color: var(--paper-dark);
    cursor: pointer;
    transition: all 0.2s;
  }
  .phase-btn.active { background: var(--red); border-color: var(--red); color: var(--paper); }
  .phase-desc { font-size: 0.9rem; color: var(--paper-dark); line-height: 1.7; }
  .phase-desc strong {
    color: var(--gold);
    font-family: 'Special Elite', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    display: block;
    margin-bottom: 0.5rem;
  }

  .task-box {
    margin: 0 4rem 4rem;
    background: var(--ink);
    border: 1px solid var(--gold);
    position: relative;
  }
  .task-box::before {
    content: 'INQUIRY TASK';
    position: absolute; top: -0.8rem; left: 1.5rem;
    font-family: 'Special Elite', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    background: var(--gold);
    color: var(--ink);
    padding: 0.2rem 0.6rem;
    font-weight: bold;
  }
  .task-header {
    padding: 2rem 2rem 1rem;
    border-bottom: 1px solid rgba(184,134,11,0.3);
  }
  .task-header h3 {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    color: var(--paper);
    margin-bottom: 0.5rem;
  }
  .task-header p {
    font-family: 'Libre Baskerville', serif;
    font-size: 0.88rem;
    color: var(--paper-dark);
    line-height: 1.6;
    font-style: italic;
  }
  .task-body { padding: 2rem; }
  .task-label {
    font-family: 'Special Elite', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.15em;
    color: var(--olive-lt);
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
  textarea.task-input {
    width: 100%;
    background: rgba(242,234,216,0.06);
    border: 1px solid var(--olive);
    border-radius: 0;
    color: var(--paper);
    font-family: 'Libre Baskerville', serif;
    font-size: 0.9rem;
    line-height: 1.7;
    padding: 1rem;
    resize: vertical;
    min-height: 120px;
    transition: border-color 0.2s;
    outline: none;
  }
  textarea.task-input:focus { border-color: var(--gold); }
  textarea.task-input::placeholder { color: var(--olive-lt); font-style: italic; }

  .task-btn {
    font-family: 'Special Elite', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 0.65rem 1.5rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .task-btn.primary { background: var(--red); color: var(--paper); }
  .task-btn.primary:hover { background: var(--red-lt); }
  .task-btn.secondary {
    background: transparent;
    border: 1px solid var(--olive);
    color: var(--paper-dark);
  }
  .task-btn.secondary:hover { border-color: var(--paper-dark); color: var(--paper); }
  .task-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .feedback-box {
    margin-top: 1.5rem;
    padding: 1.2rem 1.5rem;
    background: rgba(75,82,64,0.25);
    border-left: 3px solid var(--olive-lt);
  }
  .feedback-label {
    font-family: 'Special Elite', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    color: var(--olive-lt);
    text-transform: uppercase;
    margin-bottom: 0.6rem;
  }
  .feedback-text {
    font-family: 'Libre Baskerville', serif;
    font-size: 0.88rem;
    color: var(--paper-dark);
    line-height: 1.7;
    font-style: italic;
  }
  .feedback-loading {
    display: flex; gap: 0.4rem; align-items: center;
    color: var(--olive-lt);
    font-family: 'Special Elite', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
  }
  .dot-pulse span {
    display: inline-block; width: 5px; height: 5px; border-radius: 50%;
    background: var(--olive-lt);
    animation: pulse 1.2s infinite;
  }
  .dot-pulse span:nth-child(2) { animation-delay: 0.2s; }
  .dot-pulse span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes pulse { 0%,80%,100%{opacity:0.2} 40%{opacity:1} }

  .saved-chip {
    font-family: 'Special Elite', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    color: var(--olive-lt);
    padding: 0.2rem 0.6rem;
    border: 1px solid var(--olive);
    display: inline-block;
  }

  .sort-container { display: flex; flex-direction: column; gap: 1.5rem; }
  .actor-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .actor-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--olive);
    padding: 1rem;
  }
  .actor-name {
    font-family: 'Special Elite', monospace;
    font-size: 0.75rem;
    color: var(--gold);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
  }
  .actor-context { font-size: 0.8rem; color: var(--paper-dark); line-height: 1.5; }
  .slider-group { display: flex; flex-direction: column; gap: 1rem; }
  .slider-row {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 1rem;
    align-items: center;
  }
  .slider-actor {
    font-family: 'Special Elite', monospace;
    font-size: 0.7rem;
    color: var(--gold);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .slider-wrap { position: relative; }
  .slider-track {
    width: 100%;
    height: 4px;
    background: var(--olive);
    border-radius: 2px;
    position: relative;
  }
  input[type=range] {
    -webkit-appearance: none;
    width: 100%; height: 4px;
    background: transparent;
    cursor: pointer;
    position: absolute; top: 0; left: 0; margin: 0;
    outline: none;
  }
  input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px; height: 20px; border-radius: 50%;
    background: var(--gold);
    border: 2px solid var(--ink);
    cursor: grab;
    box-shadow: 0 1px 4px var(--shadow);
  }
  input[type=range]::-moz-range-thumb {
    width: 20px; height: 20px; border-radius: 50%;
    background: var(--gold);
    border: 2px solid var(--ink);
    cursor: grab;
    box-shadow: 0 1px 4px var(--shadow);
  }
  .slider-labels { display: flex; justify-content: space-between; margin-top: 0.6rem; }
  .slider-labels span {
    font-family: 'Special Elite', monospace;
    font-size: 0.58rem;
    color: var(--olive-lt);
    letter-spacing: 0.06em;
  }
  .confidence-row {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 1rem;
    align-items: center;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px dashed var(--olive);
  }

  .annotation-source {
    font-family: 'Libre Baskerville', serif;
    font-size: 0.92rem;
    line-height: 1.9;
    color: var(--paper-dark);
    background: rgba(242,234,216,0.05);
    border: 1px solid var(--olive);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative;
    cursor: text;
    user-select: text;
  }
  .annotation-source p { margin-bottom: 0.75rem; }
  .annotation-source p:last-child { margin-bottom: 0; }
  .annotation-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
  .annotation-tag {
    font-family: 'Special Elite', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    padding: 0.3rem 0.7rem;
    border: 1px solid;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
  }
  .annotation-tag.justification { border-color: var(--red); color: var(--red); }
  .annotation-tag.justification.active { background: var(--red); color: var(--paper); }
  .annotation-tag.cold-war { border-color: var(--gold); color: var(--gold); }
  .annotation-tag.cold-war.active { background: var(--gold); color: var(--ink); }
  .annotation-tag.international-law { border-color: var(--olive-lt); color: var(--olive-lt); }
  .annotation-tag.international-law.active { background: var(--olive-lt); color: var(--ink); }
  .annotation-tag.propaganda { border-color: #7a6080; color: #7a6080; }
  .annotation-tag.propaganda.active { background: #7a6080; color: var(--paper); }
  .selected-tags {
    font-family: 'Special Elite', monospace;
    font-size: 0.7rem;
    color: var(--paper-dark);
    margin-bottom: 0.5rem;
    letter-spacing: 0.05em;
  }

  .decision-scenario {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--olive);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .decision-scenario h4 {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    color: var(--paper);
    margin-bottom: 0.75rem;
  }
  .decision-scenario p { font-size: 0.88rem; color: var(--paper-dark); line-height: 1.7; margin-bottom: 0.5rem; }
  .intel-item {
    display: flex; gap: 0.75rem; align-items: flex-start;
    padding: 0.5rem 0;
    border-bottom: 1px dashed rgba(107,117,96,0.3);
  }
  .intel-item:last-child { border-bottom: none; }
  .intel-icon {
    font-family: 'Special Elite', monospace;
    font-size: 0.65rem;
    color: var(--red);
    letter-spacing: 0.1em;
    flex: 0 0 70px;
    padding-top: 0.1rem;
  }
  .intel-text { font-size: 0.85rem; color: var(--paper-dark); line-height: 1.6; }
  .choice-buttons { display: flex; gap: 1rem; flex-wrap: wrap; margin: 1.5rem 0; }
  .choice-btn {
    flex: 1; min-width: 200px;
    padding: 1rem 1.2rem;
    border: 1px solid var(--olive);
    background: rgba(255,255,255,0.04);
    color: var(--paper-dark);
    font-family: 'Libre Baskerville', serif;
    font-size: 0.88rem;
    line-height: 1.5;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
  }
  .choice-btn:hover { border-color: var(--gold); color: var(--paper); }
  .choice-btn.selected { border-color: var(--gold); background: rgba(184,134,11,0.12); color: var(--paper); }
  .choice-btn strong {
    font-family: 'Special Elite', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.3rem;
    color: var(--gold);
  }
  .outcome-reveal {
    background: rgba(139,26,26,0.15);
    border: 1px solid var(--red);
    padding: 1.5rem;
    animation: fadeIn 0.5s ease;
  }
  .outcome-reveal h4 {
    font-family: 'Special Elite', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    color: var(--red);
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }
  .outcome-reveal p { font-size: 0.88rem; color: var(--paper-dark); line-height: 1.7; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }

  .evidence-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .evidence-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--olive);
    padding: 1.2rem;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }
  .evidence-card:hover { border-color: var(--gold); }
  .evidence-card.selected { border-color: var(--gold); background: rgba(184,134,11,0.1); }
  .evidence-card.selected::after {
    content: '✓';
    position: absolute; top: 0.5rem; right: 0.7rem;
    font-size: 0.9rem;
    color: var(--gold);
  }
  .evidence-actor {
    font-family: 'Special Elite', monospace;
    font-size: 0.65rem;
    color: var(--gold);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
  .evidence-claim { font-size: 0.82rem; color: var(--paper-dark); line-height: 1.6; margin-bottom: 0.5rem; }
  .evidence-source {
    font-family: 'Special Elite', monospace;
    font-size: 0.6rem;
    color: var(--olive-lt);
    letter-spacing: 0.06em;
  }
  .selection-count {
    font-family: 'Special Elite', monospace;
    font-size: 0.72rem;
    color: var(--gold);
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
  }

  .meta-box {
    background: rgba(75,82,64,0.2);
    border: 1px dashed var(--olive-lt);
    padding: 1.5rem;
    margin-top: 1.5rem;
  }
  .meta-box h4 {
    font-family: 'Special Elite', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.15em;
    color: var(--olive-lt);
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }
  .meta-box p { font-size: 0.85rem; color: var(--paper-dark); font-style: italic; line-height: 1.6; }

  .rule-divider {
    height: 1px;
    background: repeating-linear-gradient(90deg, var(--paper-dark) 0, var(--paper-dark) 4px, transparent 4px, transparent 10px);
    margin: 2.5rem 0;
    opacity: 0.4;
  }

  .chapter-sep { height: 2rem; background: var(--ink); }

  .progress-bar {
    position: fixed; top: var(--nav-height, 60px); left: 0; right: 0; z-index: 99;
    height: 3px;
    background: rgba(255,255,255,0.05);
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--red), var(--gold));
    transition: width 0.3s;
  }

  @media (max-width: 700px) {
    .hero-content, .outcomes-panel, .chapter-body, .task-box,
    .source-doc, .chart-container, .map-container, .visual-panel,
    .timeline { padding-left: 1.5rem; padding-right: 1.5rem; }
    .chapter-opener { padding: 2rem 1.5rem; }
    .task-box { margin: 0 1.5rem 3rem; }
    .source-doc { margin: 2rem 1.5rem; }
    .visual-panel { grid-template-columns: 1fr; }
    .actor-cards { grid-template-columns: 1fr; }
    .slider-row { grid-template-columns: 80px 1fr; }
  }
`;

const CHAPTERS = [
  { id: "ch1", num: "I",   title: "A World Divided",         short: "A World Divided" },
  { id: "ch2", num: "II",  title: "Fire Across the Parallel", short: "Fire & Response" },
  { id: "ch3", num: "III", title: "The War Turns",            short: "The War Turns" },
  { id: "ch4", num: "IV",  title: "The Long Stalemate",       short: "The Stalemate" },
  { id: "ch5", num: "V",   title: "The Forgotten War",        short: "Legacy" },
];

const MAP_PHASES = [
  { id: "pre",       label: "Pre-War (1945–50)",           lineY: 50, lineColor: "#b8860b", annotation: "38th Parallel — the dividing line", desc: "After Japan's defeat in 1945, Korea was divided at the 38th parallel — a line drawn in just 30 minutes by two US officers using a National Geographic map. The Soviet Union occupied the north; the US the south. By 1948, two hostile states had crystallised. Neither accepted the division as permanent." },
  { id: "nk-advance",label: "NK Advance (Jun–Sep 1950)",   lineY: 82, lineColor: "#8b1a1a", annotation: "Pusan Perimeter — the last stand",    desc: "On 25 June 1950, 90,000 North Korean troops stormed south. Seoul fell in 3 days. By August, UN and South Korean forces were compressed into a tiny perimeter around Pusan in the south-east — their last foothold. The war seemed nearly over." },
  { id: "inchon",    label: "UN Counter (Sep–Oct 1950)",   lineY: 15, lineColor: "#4a5240", annotation: "UN forces reach the Yalu — Chinese border", desc: "Inchon changed everything. MacArthur's audacious landing (15 September) severed North Korean supply lines. Seoul was retaken in 11 days. UN forces then crossed the 38th parallel and surged north — taking Pyongyang on 19 October — aiming for the Yalu River and total victory." },
  { id: "china",     label: "Chinese Entry (Nov 1950–Jul 1951)", lineY: 50, lineColor: "#8b1a1a", annotation: "Front returns to the 38th — back to the start", desc: "On the very night Pyongyang fell, 300,000 Chinese troops secretly crossed the Yalu. They struck on 25 November. The UN collapse was catastrophic — driven 120 miles south in weeks. Seoul fell again in January 1951. By May 1951, the front had stabilised near the 38th parallel." },
  { id: "stalemate", label: "Stalemate (Jul 1951–Jul 1953)", lineY: 50, lineColor: "#b8860b", annotation: "Armistice line — almost identical to June 1950", desc: "For two years the front barely moved while armistice talks dragged on at Panmunjom. Men died for hills measured in yards of gain. On 27 July 1953 the armistice was signed — restoring almost exactly the pre-war boundary. No peace treaty was ever signed." },
];

const CASUALTIES = [
  { label: "South Korea — Military", killed: 137899, wounded: 450742, color: "#4a5240" },
  { label: "United States",          killed: 36574,  wounded: 103284, color: "#8b1a1a" },
  { label: "Other UN Forces",        killed: 3094,   wounded: 11297,  color: "#6b7560" },
  { label: "North Korea (est.)",     killed: 215000, wounded: 303000, color: "#5a3030" },
  { label: "China (est.)",           killed: 180000, wounded: 383000, color: "#6b3030" },
];

const EVIDENCE_CARDS = [
  { id: "usa",       actor: "United States",     claim: "Containment held. South Korea survived as a democracy. The UN mandate was fulfilled and communist expansion was checked in Asia — at a cost of 36,574 American lives.", source: "US Dept. of Defense / Truman Library" },
  { id: "sk",        actor: "South Korea",       claim: "Sovereignty was preserved. Today South Korea is the world's 13th largest economy and a functioning democracy. But 621,000 military casualties and up to 1 million civilian dead were the price.", source: "UN Command / World Bank" },
  { id: "nk",        actor: "North Korea",       claim: "Unification — the war's stated aim — failed completely. The Kim regime survived and hardened, eventually becoming a nuclear state. The war's unresolved status legitimises authoritarian rule today.", source: "Wilson Center / Britannica" },
  { id: "china",     actor: "China",             claim: "China fought the world's greatest military power to a standstill — an enormous gain in prestige. But 180,000+ Chinese soldiers died, and Taiwan's status remained unresolved.", source: "Brookings / PVA records" },
  { id: "un",        actor: "United Nations",    claim: "The first collective security test broadly worked. But UN Resolution 83 passed only because the Soviet delegate was absent — boycotting over Taiwan. The system worked by accident.", source: "UN Security Council records" },
  { id: "civilians", actor: "Korean Civilians",  claim: "Five million people were displaced. Families were divided by a line they had no say in drawing. Family reunion meetings only began in 2000; most participants are now in their 80s and 90s — running out of time.", source: "Korean Red Cross / Origins (OSU)" },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Sidebar({ activeChapter, onNav, onReset, isOpen, onToggle }) {
  const [showConfirm, setShowConfirm] = useState(false);

  function handleReset() {
    setShowConfirm(false);
    if (onReset) onReset();
  }

  return (
    <>
      <button
        className="kw-burger"
        onClick={onToggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      <nav className={`kw-sidebar${isOpen ? " open" : ""}`} aria-label="Chapter navigation">
        <div className="kw-sidebar-header">
          <div className="kw-sidebar-title">Korea<br />1950–53</div>
        </div>

        <div className="kw-sidebar-nav">
          <button className="kw-sidebar-btn" onClick={() => onNav("outcomes")}>
            Learning Outcomes
          </button>
          <div className="kw-sidebar-divider" />
          {CHAPTERS.map(c => (
            <button
              key={c.id}
              className={`kw-sidebar-btn${activeChapter === c.id ? " active" : ""}`}
              onClick={() => onNav(c.id)}
            >
              {c.num}. {c.short}
            </button>
          ))}
        </div>

        <div className="kw-sidebar-footer">
          <button className="kw-reset-btn" onClick={() => setShowConfirm(true)}>
            ⟳ Start again
          </button>
        </div>
      </nav>

      {showConfirm && (
        <div
          className="kw-confirm-overlay"
          onClick={e => { if (e.target === e.currentTarget) setShowConfirm(false); }}
        >
          <div className="kw-confirm-dialog">
            <div className="kw-confirm-title">Start again?</div>
            <p className="kw-confirm-text">
              All your progress on this inquiry will be permanently deleted.
            </p>
            <div className="kw-confirm-actions">
              <button className="task-btn secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="task-btn primary" onClick={handleReset}>
                Yes, start again
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProgressBar({ progress }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${progress}%` }} />
    </div>
  );
}

function FeedbackPanel({ loading, text }) {
  if (!loading && !text) return null;
  return (
    <div className="feedback-box">
      <div className="feedback-label">Tutor Feedback</div>
      {loading ? (
        <div className="feedback-loading">
          Thinking
          <div className="dot-pulse"><span /><span /><span /></div>
        </div>
      ) : (
        <div className="feedback-text">{text}</div>
      )}
    </div>
  );
}

function TaskTextArea({ placeholder, value, onChange, rows = 5 }) {
  return (
    <textarea
      className="task-input"
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}

function Ch1Task({ responses, onUpdate }) {
  const saved = responses.ch1 || {};
  const [sliders, setSliders] = useState(saved.sliders || { usa: 50, ussr: 50, china: 50, sk: 50 });
  const [confidence, setConfidence] = useState(saved.confidence || { usa: 50, ussr: 50, china: 50, sk: 50 });
  const [justification, setJustification] = useState(saved.justification || "");
  const [feedback, setFeedback] = useState(saved.feedback || "");
  const [loading, setLoading] = useState(false);
  const [saved_, setSaved_] = useState(false);

  const actors = [
    { key: "usa",  name: "United States", context: "Had just fought WWII, was war-weary but alarmed by Soviet expansion. Korea was outside Dean Acheson's stated 'defense perimeter' in January 1950." },
    { key: "ussr", name: "Soviet Union",  context: "Had supplied North Korea with weapons and advisors. Was absent from the UN Security Council when Resolution 83 was passed — a crucial miscalculation." },
    { key: "china",name: "China",         context: "Had just won a civil war in 1949. Was wary of US forces on its border but also exhausted. Mao saw Korea as both a threat and an opportunity for prestige." },
    { key: "sk",   name: "South Korea",   context: "Led by Syngman Rhee, who wanted unification — on his terms. Had been lobbying Washington for military support and explicitly sought confrontation." },
  ];

  function sliderLabel(v) {
    if (v < 20) return "Strongly sought peace";
    if (v < 40) return "Leaned toward peace";
    if (v < 60) return "Uncertain / mixed";
    if (v < 80) return "Leaned toward war";
    return "Strongly sought war";
  }

  function save() {
    const data = { sliders, confidence, justification, feedback };
    onUpdate("ch1", data);
    setSaved_(true);
    setTimeout(() => setSaved_(false), 2000);
  }

  async function getFeedback() {
    if (justification.trim().length < 20) return;
    setLoading(true);
    const ctx = actors.map(a => `${a.name}: ${sliderLabel(sliders[a.key])} (confidence: ${confidence[a.key]}%)`).join("; ");
    const fb = await getAIFeedback("Chapter 1: A World Divided", "Perspective sort + justification", justification, `Student positioned actors as: ${ctx}`);
    setFeedback(fb);
    setLoading(false);
    onUpdate("ch1", { sliders, confidence, justification, feedback: fb });
  }

  return (
    <div className="task-body">
      <div className="actor-cards">
        {actors.map(a => (
          <div key={a.key} className="actor-card">
            <div className="actor-name">{a.name}</div>
            <div className="actor-context">{a.context}</div>
          </div>
        ))}
      </div>

      <div className="task-label" style={{ marginBottom: "0.75rem" }}>
        For each power, drag the slider: did they want war or peace in June 1950?
      </div>

      <div className="slider-group">
        {actors.map(a => (
          <div key={a.key}>
            <div className="slider-row">
              <div className="slider-actor">{a.name.split(" ")[0]}</div>
              <div className="slider-wrap">
                <div className="slider-track">
                  <input type="range" min={0} max={100} value={sliders[a.key]}
                    onChange={e => setSliders(s => ({ ...s, [a.key]: +e.target.value }))} />
                </div>
                <div className="slider-labels">
                  <span>Wanted Peace</span>
                  <span style={{ color: "var(--gold)", fontSize: "0.65rem" }}>{sliderLabel(sliders[a.key])}</span>
                  <span>Wanted War</span>
                </div>
              </div>
            </div>
            <div className="confidence-row">
              <div className="slider-actor" style={{ fontSize: "0.6rem", color: "var(--olive-lt)" }}>Confidence</div>
              <div className="slider-wrap">
                <div className="slider-track">
                  <input type="range" min={0} max={100} value={confidence[a.key]}
                    onChange={e => setConfidence(c => ({ ...c, [a.key]: +e.target.value }))} />
                </div>
                <div className="slider-labels">
                  <span>Not sure</span>
                  <span style={{ color: "var(--olive-lt)", fontSize: "0.65rem" }}>{confidence[a.key]}% confident</span>
                  <span>Very sure</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rule-divider" />

      <div className="task-label">Justify your placements. Where are you least certain — and why?</div>
      <TaskTextArea
        placeholder="Explain your reasoning. Mention specific evidence where you can. Be honest about where your confidence is low and what you'd need to know to be more certain..."
        value={justification}
        onChange={setJustification}
      />

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "1rem", flexWrap: "wrap" }}>
        <button className="task-btn primary" onClick={save}>Save Response</button>
        <button className="task-btn secondary" onClick={getFeedback} disabled={loading || justification.trim().length < 20}>
          Get Tutor Feedback
        </button>
        {saved_ && <span className="saved-chip">SAVED</span>}
      </div>
      <FeedbackPanel loading={loading} text={feedback} />
    </div>
  );
}

function Ch2Task({ responses, onUpdate }) {
  const saved = responses.ch2 || {};
  const [selectedTags, setSelectedTags] = useState(saved.selectedTags || []);
  const [interpretation, setInterpretation] = useState(saved.interpretation || "");
  const [uncertainty, setUncertainty] = useState(saved.uncertainty || "");
  const [feedback, setFeedback] = useState(saved.feedback || "");
  const [loading, setLoading] = useState(false);
  const [saved_, setSaved_] = useState(false);

  const tags = [
    { id: "justification",      label: "Justification for action",     cls: "justification" },
    { id: "cold-war",           label: "Cold War framing",              cls: "cold-war" },
    { id: "international-law",  label: "Appeal to international law",   cls: "international-law" },
    { id: "propaganda",         label: "Propaganda / rhetoric",         cls: "propaganda" },
  ];

  function toggleTag(id) {
    setSelectedTags(t => t.includes(id) ? t.filter(x => x !== id) : [...t, id]);
  }

  function save() {
    const data = { selectedTags, interpretation, uncertainty, feedback };
    onUpdate("ch2", data);
    setSaved_(true);
    setTimeout(() => setSaved_(false), 2000);
  }

  async function getFeedback() {
    if (interpretation.trim().length < 20) return;
    setLoading(true);
    const ctx = `Tagged as: ${selectedTags.join(", ")}. Uncertainty noted: ${uncertainty}`;
    const fb = await getAIFeedback("Chapter 2: Fire Across the Parallel", "Source annotation and interpretation", interpretation, ctx);
    setFeedback(fb);
    setLoading(false);
    onUpdate("ch2", { selectedTags, interpretation, uncertainty, feedback: fb });
  }

  return (
    <div className="task-body">
      <div className="task-label" style={{ marginBottom: "0.5rem" }}>Historian's lens — ask before you annotate:</div>
      <div className="meta-box" style={{ marginBottom: "1.5rem", marginTop: 0 }}>
        <p>Who wrote this? For whom? When? What did they need to achieve by saying it? What might they have chosen NOT to say?</p>
      </div>

      <div className="annotation-source">
        <p><em>"The attack upon Korea makes it plain beyond all doubt that communism has passed beyond the use of subversion to conquer independent nations and will now use armed invasion and war."</em></p>
        <p><em>"In these circumstances I have ordered United States air and sea forces to give the Korean Government troops cover and support... The United States will continue to uphold the rule of law."</em></p>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <div className="task-label">Select all elements you can identify in this source:</div>
      </div>
      <div className="annotation-tags">
        {tags.map(t => (
          <button key={t.id} className={`annotation-tag ${t.cls} ${selectedTags.includes(t.id) ? "active" : ""}`} onClick={() => toggleTag(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <div className="selected-tags" style={{ marginBottom: "1rem" }}>
          Selected: {selectedTags.join(" · ")}
        </div>
      )}

      <div className="task-label">Write your interpretation of this source (2–4 sentences):</div>
      <TaskTextArea
        placeholder="What is Truman doing in this statement? What does it reveal about how the US understood the war? Refer to specific language..."
        value={interpretation}
        onChange={setInterpretation}
        rows={4}
      />

      <div style={{ marginTop: "1rem" }}>
        <div className="task-label">What would you need to know to be more confident in your reading?</div>
        <TaskTextArea
          placeholder="What questions does this source raise? What information would you want to find before drawing firm conclusions?"
          value={uncertainty}
          onChange={setUncertainty}
          rows={3}
        />
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "1rem", flexWrap: "wrap" }}>
        <button className="task-btn primary" onClick={save}>Save Response</button>
        <button className="task-btn secondary" onClick={getFeedback} disabled={loading || interpretation.trim().length < 20}>
          Get Tutor Feedback
        </button>
        {saved_ && <span className="saved-chip">SAVED</span>}
      </div>
      <FeedbackPanel loading={loading} text={feedback} />
    </div>
  );
}

function Ch3Task({ responses, onUpdate }) {
  const saved = responses.ch3 || {};
  const [choice, setChoice] = useState(saved.choice || null);
  const [reasoning, setReasoning] = useState(saved.reasoning || "");
  const [comparison, setComparison] = useState(saved.comparison || "");
  const [feedback, setFeedback] = useState(saved.feedback || "");
  const [loading, setLoading] = useState(false);
  const [saved_, setSaved_] = useState(false);

  const choices = [
    { id: "inchon", label: "Approve Inchon",          desc: "Back MacArthur's audacious plan. 75,000 troops. Extreme tides. Narrow channel. High risk — but total surprise if it works." },
    { id: "kunsan", label: "Choose Kunsan instead",   desc: "Safer beaches, 100 miles south. Lower risk, but further from Seoul — and the North Koreans won't be cut off as decisively." },
    { id: "wait",   label: "Wait for better conditions", desc: "Hold the Pusan Perimeter. Reinforce. Launch a conventional offensive when ready. Slower, steadier, less risk — but more attrition." },
  ];

  function save() {
    const data = { choice, reasoning, comparison, feedback };
    onUpdate("ch3", data);
    setSaved_(true);
    setTimeout(() => setSaved_(false), 2000);
  }

  async function getFeedback() {
    if (reasoning.trim().length < 20 || !choice) return;
    setLoading(true);
    const ctx = `Student chose: ${choice}. MacArthur chose Inchon and it succeeded spectacularly but led to overreach and Chinese intervention.`;
    const fullResponse = `Decision: ${choice}. Reasoning: ${reasoning}. Comparison with MacArthur's reasoning: ${comparison}`;
    const fb = await getAIFeedback("Chapter 3: The War Turns — Inchon Decision Point", "Historical decision-making task", fullResponse, ctx);
    setFeedback(fb);
    setLoading(false);
    onUpdate("ch3", { choice, reasoning, comparison, feedback: fb });
  }

  return (
    <div className="task-body">
      <div className="decision-scenario">
        <h4>Tokyo, 23 August 1950 — You are General Douglas MacArthur</h4>
        <p>The Pusan Perimeter is holding — barely. You have one chance for a decisive counterstrike. Your staff has compiled the intelligence. The Joint Chiefs are flying in to hear your plan.</p>
        <div style={{ marginTop: "1rem" }}>
          {[
            { icon: "TERRAIN",  text: "Inchon tides vary 30 feet. Landing windows: 3 hours, twice daily. Miss the window and your craft are stranded on mudflats." },
            { icon: "INTEL",    text: "North Korean defences at Inchon appear light. But Flying Fish Channel is easy to mine — one week's warning could end the operation." },
            { icon: "SURPRISE", text: "Admiral Doyle: 'The best that can be said about Inchon is that it is not impossible.'" },
            { icon: "STAKES",   text: "Success severs all North Korean supply lines south of Seoul. Failure leaves no reserve force — the US has nothing left in the region." },
            { icon: "POLITICS", text: "MacArthur's argument: the obstacles themselves guarantee surprise. The enemy won't expect an attack at the worst possible landing site." },
          ].map(item => (
            <div key={item.icon} className="intel-item">
              <div className="intel-icon">{item.icon}</div>
              <div className="intel-text">{item.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="task-label">What do you decide?</div>
      <div className="choice-buttons">
        {choices.map(c => (
          <button key={c.id} className={`choice-btn ${choice === c.id ? "selected" : ""}`} onClick={() => setChoice(c.id)}>
            <strong>{c.label}</strong>
            {c.desc}
          </button>
        ))}
      </div>

      {choice && (
        <>
          <div className="task-label">Explain your reasoning:</div>
          <TaskTextArea
            placeholder="Why did you make this choice? What evidence or logic drove your decision? What were you most worried about?"
            value={reasoning}
            onChange={setReasoning}
            rows={4}
          />
          {reasoning.trim().length > 30 && (
            <div className="outcome-reveal" style={{ marginTop: "1.5rem" }}>
              <h4>What MacArthur actually did — and what happened next</h4>
              <p>MacArthur chose Inchon. On 15 September 1950, 75,000 troops landed against minimal resistance. Seoul fell 11 days later. Within a month, 135,000 North Korean troops were captured. Military historian Spencer Tucker called it "a brilliant success, almost flawlessly executed."</p>
              <p style={{ marginTop: "0.75rem" }}>But success bred catastrophe. Drunk on victory, MacArthur drove north toward the Chinese border — ignoring warnings. On the same night Pyongyang fell, 300,000 Chinese troops were already crossing the Yalu. Three days after MacArthur's "final offensive to end the war," they struck.</p>
            </div>
          )}
          {reasoning.trim().length > 30 && (
            <div style={{ marginTop: "1.5rem" }}>
              <div className="task-label">Compare your reasoning with MacArthur's — even if you made the same choice:</div>
              <TaskTextArea
                placeholder="Was your reasoning the same as MacArthur's, even if you chose differently? What does the outcome reveal — about risk, about military genius, about the difference between a good decision and a lucky one?"
                value={comparison}
                onChange={setComparison}
                rows={4}
              />
            </div>
          )}
        </>
      )}

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "1rem", flexWrap: "wrap" }}>
        <button className="task-btn primary" onClick={save} disabled={!choice}>Save Response</button>
        <button className="task-btn secondary" onClick={getFeedback} disabled={loading || !choice || reasoning.trim().length < 20}>
          Get Tutor Feedback
        </button>
        {saved_ && <span className="saved-chip">SAVED</span>}
      </div>
      <FeedbackPanel loading={loading} text={feedback} />
    </div>
  );
}

function Ch4Task({ responses, onUpdate }) {
  const saved = responses.ch4 || {};
  const [fact, setFact]           = useState(saved.fact || "");
  const [inference, setInference] = useState(saved.inference || "");
  const [emotional, setEmotional] = useState(saved.emotional || "");
  const [connection, setConnection] = useState(saved.connection || "");
  const [feedback, setFeedback]   = useState(saved.feedback || "");
  const [loading, setLoading]     = useState(false);
  const [saved_, setSaved_]       = useState(false);

  function save() {
    const data = { fact, inference, emotional, connection, feedback };
    onUpdate("ch4", data);
    setSaved_(true);
    setTimeout(() => setSaved_(false), 2000);
  }

  async function getFeedback() {
    if ((fact + inference).trim().length < 30) return;
    setLoading(true);
    const fullResponse = `Fact: ${fact}. Inference: ${inference}. Emotional response: ${emotional}. Connection to stalemate: ${connection}`;
    const fb = await getAIFeedback("Chapter 4: The Long Stalemate", "Casualty data analysis", fullResponse, "Student analysed Korean War casualty statistics and soldier testimony");
    setFeedback(fb);
    setLoading(false);
    onUpdate("ch4", { fact, inference, emotional, connection, feedback: fb });
  }

  return (
    <div className="task-body">
      <div className="task-label" style={{ marginBottom: "0.75rem" }}>Read Kenneth Zill's words carefully before you look at the numbers below:</div>
      <div className="pull-quote" style={{ margin: "0 0 2rem" }}>
        <blockquote>"We've been up on the MLR now for 2 days. We're sitting on a hill overlooking a real wide valley. We control the valley in the day time and the Koreans control it by night... Talking about being scared at night, I was so scared I could hardly talk."</blockquote>
        <cite>Corporal Kenneth Zill, letter home from the Main Line of Resistance, December 1951</cite>
      </div>

      <div className="task-label">Now look at the data. Write one precise fact from the chart:</div>
      <TaskTextArea placeholder="State a specific, verifiable fact from the casualty data. Use numbers. Be precise." value={fact} onChange={setFact} rows={2} />

      <div style={{ marginTop: "1rem" }}>
        <div className="task-label">Write one inference — something the data suggests but doesn't directly state:</div>
        <TaskTextArea placeholder="What does the pattern of casualties tell you that isn't written in the numbers? Think about who suffered most, and why." value={inference} onChange={setInference} rows={2} />
      </div>

      <div style={{ marginTop: "1rem" }}>
        <div className="task-label">Connect the data to the stalemate — why were people still dying when the front wasn't moving?</div>
        <TaskTextArea placeholder="Two years of armistice talks, two years of dying for the same ground. What does this tell you about how wars end — or don't?" value={connection} onChange={setConnection} rows={3} />
      </div>

      <div className="meta-box" style={{ marginTop: "1.5rem" }}>
        <h4>Reflect on your response</h4>
        <p>Did looking at these numbers change how you feel about the war — or about Kenneth Zill's letter? Why or why not? Note your answer below.</p>
      </div>
      <TaskTextArea placeholder="Be honest. Data can make us feel more distant from suffering, or closer to it. Which happened for you, and why do you think that is?" value={emotional} onChange={setEmotional} rows={3} />

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "1rem", flexWrap: "wrap" }}>
        <button className="task-btn primary" onClick={save}>Save Response</button>
        <button className="task-btn secondary" onClick={getFeedback} disabled={loading || (fact + inference).trim().length < 30}>
          Get Tutor Feedback
        </button>
        {saved_ && <span className="saved-chip">SAVED</span>}
      </div>
      <FeedbackPanel loading={loading} text={feedback} />
    </div>
  );
}

function Ch5Task({ responses, onUpdate }) {
  const saved = responses.ch5 || {};
  const [selected, setSelected] = useState(saved.selected || []);
  const [argument, setArgument] = useState(saved.argument || "");
  const [metacog, setMetacog]   = useState(saved.metacog || "");
  const [feedback, setFeedback] = useState(saved.feedback || "");
  const [loading, setLoading]   = useState(false);
  const [saved_, setSaved_]     = useState(false);

  function toggleCard(id) {
    setSelected(s => {
      if (s.includes(id)) return s.filter(x => x !== id);
      if (s.length >= 3) return s;
      return [...s, id];
    });
  }

  function save() {
    const data = { selected, argument, metacog, feedback };
    onUpdate("ch5", data);
    setSaved_(true);
    setTimeout(() => setSaved_(false), 2000);
  }

  async function getFeedback() {
    if (argument.trim().length < 50) return;
    setLoading(true);
    const ctx = `Evidence cards selected: ${selected.join(", ")}. Student is arguing whether the Korean War was worth fighting.`;
    const fullResponse = `Argument: ${argument}. Metacognitive reflection: ${metacog}`;
    const fb = await getAIFeedback("Chapter 5: The Forgotten War", "Historical argument synthesis", fullResponse, ctx);
    setFeedback(fb);
    setLoading(false);
    onUpdate("ch5", { selected, argument, metacog, feedback: fb });
  }

  return (
    <div className="task-body">
      <div className="task-label" style={{ marginBottom: "0.75rem" }}>Select exactly 3 evidence cards to anchor your argument:</div>
      <div className="selection-count">
        {selected.length}/3 selected{selected.length === 3 && " — ready to write"}
      </div>

      <div className="evidence-grid">
        {EVIDENCE_CARDS.map(card => (
          <div
            key={card.id}
            className={`evidence-card ${selected.includes(card.id) ? "selected" : ""}`}
            onClick={() => toggleCard(card.id)}
            style={{ opacity: selected.length === 3 && !selected.includes(card.id) ? 0.5 : 1 }}
          >
            <div className="evidence-actor">{card.actor}</div>
            <div className="evidence-claim">{card.claim}</div>
            <div className="evidence-source">{card.source}</div>
          </div>
        ))}
      </div>

      {selected.length === 3 && (
        <>
          <div className="task-label">Build your argument: Was the Korean War worth fighting? Use your three cards as evidence.</div>
          <TaskTextArea
            placeholder="State your position clearly. Use evidence from your three selected cards. Acknowledge the strongest counter-argument. Conclude with a judgment — and own it."
            value={argument}
            onChange={setArgument}
            rows={7}
          />
        </>
      )}

      <div className="meta-box" style={{ marginTop: "1.5rem" }}>
        <h4>Look back across the whole inquiry</h4>
        <p>You've worked through five chapters. Has your view of the Korean War changed? What — a piece of evidence, an image, a number, someone's words — changed your thinking? What didn't shift you, and why?</p>
      </div>
      <TaskTextArea
        placeholder="This is about your thinking, not just the history. What moved you? What challenged you? Where did you feel most uncertain — and did you resolve it?"
        value={metacog}
        onChange={setMetacog}
        rows={5}
      />

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "1rem", flexWrap: "wrap" }}>
        <button className="task-btn primary" onClick={save}>Save Response</button>
        <button className="task-btn secondary" onClick={getFeedback} disabled={loading || argument.trim().length < 50}>
          Get Tutor Feedback
        </button>
        {saved_ && <span className="saved-chip">SAVED</span>}
      </div>
      <FeedbackPanel loading={loading} text={feedback} />
    </div>
  );
}

function CasualtyChart() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const maxVal = 900000;

  function fmt(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return Math.round(n / 1000) + "K";
    return n;
  }

  return (
    <div className="chart-container" ref={ref}>
      <div className="chart-title display">The Human Cost — Military Casualties</div>
      <div className="chart-note">Sources: US Dept. of Defense · UN Command · Korean War Ex-POW Association · Estimates for North Korea and China vary; figures shown are mid-range estimates.</div>
      <div className="chart-bars">
        {CASUALTIES.map(row => (
          <div key={row.label}>
            <div className="chart-row">
              <div className="chart-label">{row.label}</div>
              <div>
                <div className="chart-bar-wrap" style={{ marginBottom: "3px" }}>
                  <div className="chart-bar" style={{ width: visible ? `${(row.killed / maxVal) * 100}%` : "0%", background: "#8b1a1a" }} />
                </div>
                <div className="chart-bar-wrap">
                  <div className="chart-bar" style={{ width: visible ? `${(row.wounded / maxVal) * 100}%` : "0%", background: "#4a5240" }} />
                </div>
              </div>
              <div className="chart-value">{fmt(row.killed)} / {fmt(row.wounded)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        <div className="legend-item"><div className="legend-dot" style={{ background: "#8b1a1a" }} />Killed in action</div>
        <div className="legend-item"><div className="legend-dot" style={{ background: "#4a5240" }} />Wounded in action</div>
        <div className="legend-item" style={{ color: "var(--olive-lt)", fontStyle: "italic" }}>Note: Civilian dead estimated at 1.5–2 million. Records were incomplete — this is itself a historical fact worth examining.</div>
      </div>
    </div>
  );
}

function KoreaMap() {
  const [phase, setPhase] = useState(0);
  const p = MAP_PHASES[phase];
  const linePositions = { "pre": 50, "nk-advance": 82, "inchon": 12, "china": 50, "stalemate": 50 };
  const lineY = linePositions[p.id];
  const lineColor = p.lineColor;

  return (
    <div className="map-container">
      <div className="section-label" style={{ color: "var(--gold)", marginBottom: "1rem" }}>Front Lines — How the Map Changed</div>
      <div className="korea-map">
        <div className="map-svg-wrap">
          <svg viewBox="0 0 180 320" style={{ width: "100%", border: "1px solid var(--olive)", background: "rgba(255,255,255,0.03)" }}>
            <path d="M60,10 L120,10 L130,20 L140,60 L145,120 L140,180 L130,220 L120,270 L110,300 L100,315 L90,315 L80,300 L70,270 L60,220 L50,180 L45,120 L50,60 L60,10Z"
              fill="rgba(74,82,64,0.15)" stroke="var(--olive)" strokeWidth="1" />
            <line x1="45" y1="160" x2="145" y2="160" stroke="rgba(184,134,11,0.3)" strokeWidth="1" strokeDasharray="4,3" />
            <text x="148" y="163" fontSize="7" fill="rgba(184,134,11,0.5)" fontFamily="monospace">38°N</text>
            {[
              { label: "Pyongyang", x: 85, y: 100 },
              { label: "Seoul",     x: 90, y: 175 },
              { label: "Inchon",    x: 62, y: 178 },
              { label: "Pusan",     x: 120, y: 285 },
            ].map(city => (
              <g key={city.label}>
                <circle cx={city.x} cy={city.y} r="3" fill="rgba(242,234,216,0.4)" />
                <text x={city.x + 5} y={city.y + 3} fontSize="7" fill="rgba(242,234,216,0.6)" fontFamily="monospace">{city.label}</text>
              </g>
            ))}
            <path d="M50,20 Q90,15 140,25" stroke="rgba(107,117,96,0.5)" strokeWidth="1.5" fill="none" />
            <text x="50" y="13" fontSize="6" fill="rgba(107,117,96,0.6)" fontFamily="monospace">Yalu R. — Chinese border</text>
            <line x1="45" y1={lineY * 3.2} x2="145" y2={lineY * 3.2} stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" />
            <text x="32" y={lineY * 3.2 + 4} fontSize="6.5" fill={lineColor} fontFamily="monospace" textAnchor="end">
              {p.id === "pre" ? "38°N" : "Front"}
            </text>
            {p.id === "nk-advance" && (
              <path d={`M50,10 L130,10 L140,60 L145,${lineY * 3.2} L45,${lineY * 3.2} L50,60Z`} fill="rgba(139,26,26,0.12)" />
            )}
            {p.id === "inchon" && (
              <path d={`M50,${lineY * 3.2} L140,${lineY * 3.2} L140,300 L110,315 L80,300 L50,300Z`} fill="rgba(74,82,64,0.12)" />
            )}
            {p.id === "inchon" && (
              <g>
                <line x1="30" y1="178" x2="62" y2="178" stroke="var(--gold)" strokeWidth="1.5" markerEnd="url(#arrow)" />
                <text x="5" y="175" fontSize="6" fill="var(--gold)" fontFamily="monospace">Landing</text>
                <defs>
                  <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3Z" fill="var(--gold)" />
                  </marker>
                </defs>
              </g>
            )}
          </svg>
        </div>
        <div className="map-info">
          <div className="map-phase-buttons">
            {MAP_PHASES.map((mp, i) => (
              <button key={mp.id} className={`phase-btn ${i === phase ? "active" : ""}`} onClick={() => setPhase(i)}>
                {mp.label}
              </button>
            ))}
          </div>
          <div className="phase-desc">
            <strong>{p.annotation}</strong>
            {p.desc}
          </div>
        </div>
      </div>
    </div>
  );
}

function Timeline() {
  const events = [
    { date: "Jun 1945",      label: "Korea divided at 38th parallel",                    color: "gold" },
    { date: "Jun 25, 1950",  label: "North Korea invades",                               color: "red" },
    { date: "Jun 27, 1950",  label: "UN Resolution 83. Truman commits US forces",        color: "red" },
    { date: "Aug 1950",      label: "Pusan Perimeter — last UN foothold",                color: "red" },
    { date: "Sep 15, 1950",  label: "Inchon landing — Operation Chromite",               color: "gold" },
    { date: "Sep 26, 1950",  label: "Seoul retaken",                                     color: "olive" },
    { date: "Oct 19, 1950",  label: "Pyongyang falls. Chinese cross Yalu — same night",  color: "red" },
    { date: "Nov 25, 1950",  label: "China's main offensive — UN routed",                color: "red" },
    { date: "Apr 1951",      label: "Truman fires MacArthur",                            color: "gold" },
    { date: "Jul 1951",      label: "Armistice talks begin — war continues",              color: "olive" },
    { date: "Jul 27, 1953",  label: "Armistice signed. No peace treaty — ever.",         color: "red" },
  ];

  return (
    <div className="timeline">
      <div className="section-label" style={{ color: "var(--gold)", marginBottom: "1.5rem" }}>Key Events — 1945–1953</div>
      <div style={{ overflowX: "auto" }}>
        <div className="timeline-track">
          {events.map((e, i) => (
            <div key={i} className={`timeline-event ${e.color}`}>
              <div className="timeline-dot" />
              <div className="timeline-date">{e.date}</div>
              <div className="timeline-label">{e.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function KoreanWarInquiry({ onResponse, onComplete, savedResponses, isCompleted, onReset }) {
  const [responses, setResponses]         = useState(() => savedResponses ?? {});
  const [progress, setProgress]           = useState(0);
  const [activeChapter, setActiveChapter] = useState(null);
  const [sidebarOpen, setSidebarOpen]     = useState(false);

  function onUpdate(chapter, data) {
    setResponses(prev => {
      const next = { ...prev, [chapter]: data };
      onResponse(chapter, data);
      return next;
    });
  }

  useEffect(() => {
    if (['ch1', 'ch2', 'ch3', 'ch4', 'ch5'].every(c => responses[c])) {
      onComplete(100, { asset: 'korean-war' });
    }
  }, [responses]);

  function navTo(id) {
    if (id === "outcomes") {
      document.getElementById("outcomes")?.scrollIntoView({ behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onScroll() {
      for (const c of CHAPTERS) {
        const el = document.getElementById(c.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) { setActiveChapter(c.id); return; }
        }
      }
      setActiveChapter(null);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`kw-shell${sidebarOpen ? " sidebar-open" : ""}`}>
      <style>{CSS}</style>
      <Sidebar
        activeChapter={activeChapter}
        onNav={navTo}
        onReset={onReset}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(o => !o)}
      />
      <ProgressBar progress={progress} />

      <section className="hero">
        <div className="hero-img" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Korean_War_1950-HD-SN-99-03136.JPEG/1280px-Korean_War_1950-HD-SN-99-03136.JPEG')" }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-eyebrow">Historical Inquiry</div>
          <h1 className="hero-title">Korea<em>1950–1953</em></h1>
          <p className="hero-subtitle">A war the world called forgotten — by the people who were never allowed to forget it.</p>
          <div className="hero-dates">
            <span>25 June 1950 — Invasion</span>
            <span>27 July 1953 — Armistice</span>
            <span>2.5 million+ lives lost</span>
            <span>No peace treaty — to this day</span>
          </div>
        </div>
        <div className="scroll-hint">Scroll to begin</div>
      </section>

      <section id="outcomes" className="outcomes-panel">
        <div className="section-label">Before you begin</div>
        <h2 className="display" style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)", color: "var(--ink)", marginBottom: "0.5rem" }}>
          What you will be able to do
        </h2>
        <p style={{ fontStyle: "italic", color: "var(--olive)", fontSize: "0.95rem", maxWidth: "600px", lineHeight: "1.6" }}>
          By the end of this inquiry, you should be able to:
        </p>
        <div className="outcomes-grid">
          {[
            "Explain the geopolitical conditions that led to the outbreak of the Korean War, including the roles of the US, USSR, China, and the United Nations.",
            "Analyse the human cost of the conflict through primary sources, statistics, and personal testimony.",
            "Evaluate the military turning points of the war — Inchon, the Chinese intervention, and the stalemate — and their strategic consequences.",
            "Interpret the significance of the armistice and explain why the war became known as 'The Forgotten War.'",
            "Construct a historical argument using evidence about whether the Korean War was a success, failure, or something more complex for each major power involved.",
          ].map((text, i) => (
            <div key={i} className="outcome-card">
              <div className="outcome-num">{i + 1}</div>
              <div className="outcome-text">{text}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "2rem", fontFamily: "'Special Elite', monospace", fontSize: "0.72rem", color: "var(--olive)", letterSpacing: "0.08em" }}>
          YOUR RESPONSES ARE SAVED AUTOMATICALLY · THIS EXPERIENCE IS AS LONG AS IT NEEDS TO BE
        </p>
      </section>

      <div className="chapter-sep" />
      <Timeline />

      {/* ── CHAPTER 1 ── */}
      <section id="ch1" className="chapter">
        <div className="chapter-opener" style={{ background: "var(--paper)" }}>
          <div className="chapter-bg" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Cold_War_Europe_military_alliances_map_en.png/1200px-Cold_War_Europe_military_alliances_map_en.png')", opacity: 0.1 }} />
          <div className="chapter-bg-overlay" />
          <div className="chapter-meta">
            <div className="chapter-num">Chapter I</div>
            <h2 className="chapter-title display">A World Divided</h2>
            <p className="chapter-inquiry">Why was Korea the perfect flashpoint for Cold War conflict?</p>
          </div>
        </div>

        <div className="chapter-body">
          <p>Korea in 1945 was a country that had just escaped one occupation only to be handed to two. Colonised by Japan since 1910, Koreans had every reason to expect independence after Tokyo's defeat. Instead, two American officers — with a 30-minute deadline and a National Geographic map — drew a line across the 38th parallel, dividing the country between Soviet and American zones.</p>
          <p>No Korean was consulted. No Korean signed anything. The line was never meant to be permanent. It became the defining wound of modern Korean history.</p>
          <p>By 1948, the temporary division had calcified into two states: the Democratic People's Republic of Korea in the north, led by Kim Il-sung, armed and advised by the Soviet Union; and the Republic of Korea in the south, led by Syngman Rhee, backed by the United States. Both governments claimed to be the sole legitimate ruler of the entire peninsula. Both were willing to use force.</p>
          <p>The Cold War was the atmosphere in which all of this happened. The Soviet Union had just acquired nuclear weapons. China had become communist in 1949. In January 1950, US Secretary of State Dean Acheson gave a speech that seemed to place Korea outside America's defence perimeter. Whether Kim read this as a green light remains debated. What is certain is that by June 1950, he had Soviet tanks, Soviet weaponry, and Soviet encouragement.</p>
        </div>

        <div className="visual-panel">
          <div className="archive-photo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Cold_War_Europe_military_alliances_map_en.png/800px-Cold_War_Europe_military_alliances_map_en.png" alt="Cold War alliances map" onError={e => { e.target.style.display = 'none'; }} />
            <div className="photo-caption">
              Cold War Europe, late 1940s — but the same logic of alliance, competition, and proxy conflict extended to Asia.
              <span className="photo-question">Where does Korea fit in this global picture?</span>
            </div>
          </div>
          <div className="visual-text">
            <h3 className="display">Two superpowers. One peninsula. Neither willing to lose.</h3>
            <p>The United States had just fought a world war to defeat fascism. It was not prepared to see communism spread. The Soviet Union, exhausted but ambitious, saw Korea as a test of American resolve — and an opportunity to extend its influence in Asia.</p>
            <p>Neither superpower wanted a direct war with each other. Korea was the perfect proxy — small enough to be deniable, significant enough to matter.</p>
            <p>For ordinary Koreans, this global chess game meant their country would become a battlefield for other people's ideologies.</p>
          </div>
        </div>

        <div className="chapter-body">
          <div className="pull-quote">
            <blockquote>"The 38th parallel was drawn in thirty minutes, by two Americans with a map. No Korean was present."</blockquote>
            <cite>Historian Bruce Cumings, Korea: The Unknown War</cite>
          </div>
        </div>

        <div className="task-box">
          <div className="task-header">
            <h3>Task 1 — Perspective Sort</h3>
            <p>Before war broke out, how much did each major power actually want conflict? Use what you've read — and your own reasoning — to position each actor on the spectrum below. Then justify your placements, noting where you're uncertain.</p>
          </div>
          <Ch1Task responses={responses} onUpdate={onUpdate} />
        </div>
      </section>

      {/* ── CHAPTER 2 ── */}
      <div className="chapter-sep" />
      <section id="ch2" className="chapter">
        <div className="chapter-opener">
          <div className="chapter-bg" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Korean_War_refugees_1950-1951.jpg/1280px-Korean_War_refugees_1950-1951.jpg')" }} />
          <div className="chapter-bg-overlay" />
          <div className="chapter-meta">
            <div className="chapter-num">Chapter II</div>
            <h2 className="chapter-title display">Fire Across the Parallel</h2>
            <p className="chapter-inquiry">What happened when North Korea invaded — and how did the world respond?</p>
          </div>
        </div>

        <div className="chapter-body">
          <p>At four o'clock on the morning of 25 June 1950 — Korean time — 90,000 North Korean troops crossed the 38th parallel. They were equipped with Soviet T-34 tanks, veterans of the Second World War, superior to anything the South possessed. Seoul fell in three days.</p>
          <p>The speed of collapse was total. South Korea's army, never fully equipped or trained, disintegrated under the assault. American troops hurriedly sent from Japan — soft after years of occupation duty — were overwhelmed and retreating before they understood what was happening.</p>
          <p>The international response was unusually swift. The United Nations Security Council condemned the invasion as a breach of the peace and called for military assistance to South Korea — passing Resolution 83 by nine votes to zero. The Soviet delegate, who would have vetoed it, was absent: he had walked out months earlier to protest the UN's refusal to seat Communist China. It was a miscalculation that changed history.</p>
          <p>By August, UN and South Korean forces had been compressed into a tiny perimeter around the southern port of Pusan. It was their last foothold. If it fell, the war was over.</p>
        </div>

        <div className="visual-panel reverse">
          <div className="archive-photo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Korean_War_refugees_1950-1951.jpg/800px-Korean_War_refugees_1950-1951.jpg" alt="Korean War refugees 1950" onError={e => { e.target.style.display = 'none'; }} />
            <div className="photo-caption">
              Korean refugees flee south, 1950–51. Five million people were displaced during the conflict.
              <span className="photo-question">What do we lose when history is told only through military strategy?</span>
            </div>
          </div>
          <div className="visual-text">
            <h3 className="display">The human geography of war</h3>
            <p>Military maps show front lines. They don't show the families on the roads between them. In the summer of 1950, millions of South Korean civilians fled south ahead of the North Korean advance — with no certainty that there was anywhere left to go.</p>
            <p>The Pusan Perimeter was not just a military boundary. It was the edge of the world for the people trapped within it.</p>
          </div>
        </div>

        <div className="source-doc">
          <div className="source-doc-header">
            <h4>President Harry S. Truman — Statement on Korea</h4>
            <p>27 June 1950 · The White House · Public Domain (US Government Document)</p>
          </div>
          <div className="source-doc-body">
            <p>"In Korea the Government forces, which were armed to prevent border raids and to preserve internal security, were attacked by invading forces from North Korea. The Security Council of the United Nations called upon the invading troops to cease hostilities and to withdraw to the 38th parallel. This they have not done, but on the contrary have pressed the attack."</p>
            <p>"The attack upon Korea makes it plain beyond all doubt that communism has passed beyond the use of subversion to conquer independent nations and will now use armed invasion and war... The United States will continue to uphold the rule of law."</p>
          </div>
        </div>

        <div className="task-box">
          <div className="task-header">
            <h3>Task 2 — Source Analysis</h3>
            <p>A historian doesn't just read what a source says — they read why it was written, for whom, and what it reveals about the moment. Annotate the Truman statement above, then write your interpretation.</p>
          </div>
          <Ch2Task responses={responses} onUpdate={onUpdate} />
        </div>
      </section>

      {/* ── CHAPTER 3 ── */}
      <div className="chapter-sep" />
      <section id="ch3" className="chapter">
        <div className="chapter-opener">
          <div className="chapter-bg" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/MacArthur_Inchon.jpg/1200px-MacArthur_Inchon.jpg')" }} />
          <div className="chapter-bg-overlay" />
          <div className="chapter-meta">
            <div className="chapter-num">Chapter III</div>
            <h2 className="chapter-title display">The War Turns</h2>
            <p className="chapter-inquiry">How did Inchon and China's entry change everything?</p>
          </div>
        </div>

        <KoreaMap />

        <div className="chapter-body">
          <p>Operation Chromite — the landing at Inchon on 15 September 1950 — is one of the most audacious military operations of the twentieth century. MacArthur chose a landing site so difficult, so apparently impossible, that the North Koreans never fortified it adequately. The obstacles that made every naval planner pale — extreme tides, a narrow channel, sea walls requiring scaling ladders — were precisely what made it work. Surprise was total.</p>
          <p>Within eleven days, Seoul was retaken. Within a month, 135,000 North Korean troops were prisoners. The war seemed won.</p>
          <p>Then came the decision that transformed a victory into a new and more dangerous war. UN forces crossed the 38th parallel on 9 October and drove north, aiming for the Yalu River — the border with China. MacArthur, meeting Truman on Wake Island on 15 October, assured the President that Chinese intervention was "very little" risk. "Home by Christmas," the general promised his men.</p>
          <p>On the same night that UN forces captured Pyongyang — 19 October 1950 — 300,000 Chinese troops were secretly crossing the Yalu into North Korea. They moved only at night. They used no radios. They were invisible to UN aerial reconnaissance. MacArthur's intelligence estimated 30,000 Chinese in theatre. The real number was ten times that.</p>
          <p>On 25 November, the day after MacArthur announced his "final offensive to end the war," the Chinese struck. The Eighth Army collapsed. UN forces were driven 120 miles south in weeks. Seoul fell again in January 1951. It was the worst American military defeat since the Second World War.</p>
        </div>

        <div className="visual-panel">
          <div className="archive-photo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/MacArthur_Inchon.jpg/800px-MacArthur_Inchon.jpg" alt="MacArthur observes Inchon bombardment" onError={e => { e.target.style.display = 'none'; }} />
            <div className="photo-caption">
              General Douglas MacArthur observes the pre-landing bombardment of Inchon from USS Mt. McKinley, 15 September 1950. NARA catalogue item 531373. Public domain.
              <span className="photo-question">What does this image tell you about how MacArthur understood his own role in the war?</span>
            </div>
          </div>
          <div className="visual-text">
            <h3 className="display">Genius, gamble, and catastrophe — sometimes the same decision</h3>
            <p>Inchon was a masterpiece. The same man, six weeks later, marched his armies into a trap he had been warned about repeatedly. Military historian Max Hastings compared the subsequent collapse to the fall of Singapore.</p>
            <p>What does it mean that the same decision-making style — bold, intuitive, contemptuous of caution — produced both the greatest UN success and the greatest UN disaster?</p>
            <p>In April 1951, Truman fired MacArthur for publicly threatening to bomb China in defiance of US policy. The general went home to a hero's welcome. Truman's approval rating collapsed. The war went on.</p>
          </div>
        </div>

        <div className="pull-quote" style={{ margin: "0 4rem 0" }}>
          <blockquote style={{ fontSize: "1.1rem" }}>"The best that can be said about Inchon is that it is not impossible."</blockquote>
          <cite>Admiral James Doyle, briefing MacArthur on the Inchon landing plan, 23 August 1950</cite>
        </div>

        <div className="task-box">
          <div className="task-header">
            <h3>Task 3 — Decision Point</h3>
            <p>It is 23 August 1950. You are General MacArthur. The Joint Chiefs are in the room. You have the intelligence. You must make the call. What do you decide — and why?</p>
          </div>
          <Ch3Task responses={responses} onUpdate={onUpdate} />
        </div>
      </section>

      {/* ── CHAPTER 4 ── */}
      <div className="chapter-sep" />
      <section id="ch4" className="chapter">
        <div className="chapter-opener">
          <div className="chapter-bg" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Korean_War_stalemate.jpg/1280px-Korean_War_stalemate.jpg')" }} />
          <div className="chapter-bg-overlay" />
          <div className="chapter-meta">
            <div className="chapter-num">Chapter IV</div>
            <h2 className="chapter-title display">The Long Stalemate</h2>
            <p className="chapter-inquiry">What does it feel like when a war goes nowhere — and people keep dying?</p>
          </div>
        </div>

        <div className="chapter-body">
          <p>By May 1951, the front had stabilised near the 38th parallel — almost exactly where it had been in June 1950. The war had convulsed the entire peninsula, killed hundreds of thousands, displaced millions, and ended up more or less where it started.</p>
          <p>Armistice negotiations began in July 1951. They would last two years. During those two years, the fighting continued. Men died for individual hills — named by number and fought over repeatedly: Hill 355, Pork Chop Hill, the Hook. A hill gained one week might be lost the next. The front barely moved.</p>
          <p>Kenneth Zill, a 20-year-old from Michigan, arrived on the Main Line of Resistance in December 1951. He wrote home nearly every week. His letters are not about ideology or geopolitics. They are about fear, boredom, cold, and the strange intimacy of men living underground on the edge of someone else's country.</p>
          <p>The armistice was signed on 27 July 1953 — after two years of talking and dying. It established a ceasefire. It created a Demilitarized Zone running roughly along the 38th parallel, a 2.5-mile-wide buffer spanning the width of the peninsula. It was never meant to be permanent. It has now lasted over 70 years. No peace treaty has ever been signed. The Korean War, technically, has never ended.</p>
        </div>

        <CasualtyChart />

        <div className="visual-panel reverse">
          <div className="archive-photo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Korean_War%2C_1950-1953_%28The_war_correspondent_with_United_Nations_troops%29_%28T_series_L_000001%29.jpg/800px-Korean_War%2C_1950-1953_%28The_war_correspondent_with_United_Nations_troops%29_%28T_series_L_000001%29.jpg" alt="Korean War soldiers in trenches" onError={e => { e.target.style.display = "none"; }} />
            <div className="photo-caption">
              UN troops during the stalemate period, 1951–53. Life in the bunkers on the Main Line of Resistance.
              <span className="photo-question">Kenneth Zill wrote: "All they are is glorified foxholes, but they keep us pretty warm." What does that tell you about how soldiers cope?</span>
            </div>
          </div>
          <div className="visual-text">
            <h3 className="display">Two years of talks. Two years of dying.</h3>
            <p>The armistice negotiations at Panmunjom stalled repeatedly — over the fate of prisoners of war who did not want to be repatriated, over where exactly to draw a ceasefire line, over which side would be seen to have given ground.</p>
            <p>While diplomats argued, soldiers fought. The battles of the stalemate period were some of the most intense of the entire war — vicious, grinding, and nearly invisible to the publics back home who had moved on.</p>
            <p>This is partly why the war was "forgotten." Not because nothing happened — but because what happened seemed to lead nowhere.</p>
          </div>
        </div>

        <div className="task-box">
          <div className="task-header">
            <h3>Task 4 — Reading the Data</h3>
            <p>A historian uses quantitative evidence alongside personal testimony. Read Kenneth Zill's words, then examine the casualty data above. What do the numbers tell you — and what do they refuse to say?</p>
          </div>
          <Ch4Task responses={responses} onUpdate={onUpdate} />
        </div>
      </section>

      {/* ── CHAPTER 5 ── */}
      <div className="chapter-sep" />
      <section id="ch5" className="chapter">
        <div className="chapter-opener" style={{ background: "var(--paper)", minHeight: "40vh" }}>
          <div className="chapter-bg" style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Korean_Armistice_Agreement_1953_Press_Photo.jpg/1200px-Korean_Armistice_Agreement_1953_Press_Photo.jpg')", opacity: 0.12 }} />
          <div className="chapter-bg-overlay" />
          <div className="chapter-meta">
            <div className="chapter-num">Chapter V</div>
            <h2 className="chapter-title display">The Forgotten War</h2>
            <p className="chapter-inquiry">What did the Korean War actually achieve — and why does it still matter?</p>
          </div>
        </div>

        <div className="chapter-body">
          <p>The Korean War is called "forgotten" — but not by everyone. In the United States, sandwiched between the heroism of the Second World War and the trauma of Vietnam, Korea never quite found its place in national memory. The armistice produced no ticker-tape parades, no clear narrative of victory.</p>
          <p>In South Korea, the war is not forgotten. It is the founding event of the Republic. The country that emerged from the rubble of 1953 — desperately poor, physically destroyed, politically fragile — is today the world's thirteenth largest economy, a democracy that went through military dictatorship and came out the other side. The argument that the war "achieved nothing" is not one South Koreans make.</p>
          <p>In North Korea, the war is called the "Fatherland Liberation War" — a heroic resistance against American aggression. The narrative of national victimhood and martial glory has sustained the Kim dynasty for three generations. The unresolved armistice legitimises a state permanently mobilised for a war that never officially ended.</p>
          <p>For Korean civilians on both sides of the DMZ, the war's most enduring legacy is division. Five million people were displaced. Families were separated — sometimes by just a few miles — and were not allowed to reunite. The first family reunions, arranged by both governments, only began in 2000. Most of the people who were separated as children or young adults are now in their eighties and nineties. Many have died still waiting.</p>
        </div>

        <div className="visual-panel">
          <div className="archive-photo">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Korean_Armistice_Agreement_1953_Press_Photo.jpg/800px-Korean_Armistice_Agreement_1953_Press_Photo.jpg" alt="Korean Armistice Agreement signing 1953" onError={e => { e.target.style.display = "none"; }} />
            <div className="photo-caption">
              The Korean Armistice Agreement, signed 27 July 1953 at Panmunjom. It was a ceasefire — not a peace treaty. The war technically continues.
              <span className="photo-question">What does it mean to end a war without ending it?</span>
            </div>
          </div>
          <div className="visual-text">
            <h3 className="display">A war that never officially ended</h3>
            <p>The DMZ — 2.5 miles wide, 155 miles long — is today one of the most heavily fortified borders on earth. Ironically, it has also become one of the world's most biodiverse nature reserves, untouched by humans for 70 years.</p>
            <p>North Korea has tested nuclear weapons multiple times since 2006. South Korea maintains a military alliance with the United States. American troops are still stationed on the peninsula. The armistice line is maintained with the same anxious attention it received in 1953.</p>
            <p>The question of what the Korean War "achieved" depends entirely on who you ask — and when.</p>
          </div>
        </div>

        <div className="source-doc">
          <div className="source-doc-header">
            <h4>The Why of "Forgotten" — Three Reasons</h4>
            <p>Historical analysis · Multiple sources</p>
          </div>
          <div className="source-doc-body" style={{ fontStyle: "normal" }}>
            <p><strong style={{ color: "var(--olive)", fontFamily: "'Special Elite', monospace", fontSize: "0.8rem" }}>1. Chronological shadow.</strong> The Korean War followed the Second World War and preceded Vietnam. Both defined their eras. Korea fit neither narrative: it was not the "Good War" of clear moral purpose, nor the divisive tragedy of the 1960s. It occupied an awkward middle ground in American memory.</p>
            <p><strong style={{ color: "var(--olive)", fontFamily: "'Special Elite', monospace", fontSize: "0.8rem" }}>2. No decisive outcome.</strong> Wars tend to be remembered in proportion to how clearly they ended. The Korean War ended in a stalemate at almost exactly where it began. "We fought to restore a line, and we restored it" is not a story that lends itself to monuments.</p>
            <p><strong style={{ color: "var(--olive)", fontFamily: "'Special Elite', monospace", fontSize: "0.8rem" }}>3. The Korea paradox.</strong> The war's most significant long-term outcome — South Korea's transformation into a democracy and global economic power — took 40 years to become visible. It was an achievement invisible at the time of victory.</p>
          </div>
        </div>

        <div className="task-box">
          <div className="task-header">
            <h3>Task 5 — Synthesis Argument</h3>
            <p>You have now worked through five chapters of evidence, primary sources, data, and testimony. It is time to construct a historical argument. Select three evidence cards below — each representing a different perspective on the war's outcome — and use them to build your case.</p>
          </div>
          <Ch5Task responses={responses} onUpdate={onUpdate} />
        </div>
      </section>

      <footer style={{ background: "var(--ink)", padding: "4rem", borderTop: "2px solid var(--gold)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", flexWrap: "wrap", maxWidth: "800px" }}>
          <div>
            <div className="section-label" style={{ color: "var(--gold)" }}>Sources & Acknowledgements</div>
            <div style={{ fontFamily: "'Special Elite', monospace", fontSize: "0.68rem", color: "var(--olive-lt)", lineHeight: "1.9", letterSpacing: "0.04em", marginTop: "0.75rem" }}>
              <p>Casualty figures: US Dept. of Defense · UN Command · Korean War Ex-POW Association</p>
              <p>Primary sources: Truman Library (public domain) · American Veterans Center (Zill letters)</p>
              <p>Photographs: NARA Signal Corps collection (public domain) · Wikimedia Commons</p>
              <p>Historical analysis: Britannica · Brookings Institution · Origins (Ohio State University) · Imperial War Museum</p>
            </div>
          </div>
          <div>
            <div className="section-label" style={{ color: "var(--gold)" }}>A Note on Uncertainty</div>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: "0.82rem", color: "var(--paper-dark)", lineHeight: "1.7", marginTop: "0.75rem", fontStyle: "italic" }}>
              <p>Casualty figures in this experience are verified estimates. Where sources diverge — particularly for Chinese and North Korean losses — we use mid-range figures and say so. Acknowledging uncertainty is not a weakness in historical thinking. It is the work.</p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "3rem", fontFamily: "'Playfair Display', serif", fontSize: "0.8rem", color: "var(--olive)", borderTop: "1px solid var(--olive)", paddingTop: "1.5rem" }}>
          Korean War Historical Inquiry · For educational use
        </div>
      </footer>
    </div>
  );
}
