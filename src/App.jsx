import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   INLINE STYLES (all CSS from original HTML)
───────────────────────────────────────── */
const globalCSS = `
:root {
  --ink:        #0D1117;
  --ink-soft:   #1E2535;
  --red:        #CC3322;
  --red-lt:     #E04430;
  --red-dim:    rgba(204,51,34,0.08);
  --red-rim:    rgba(204,51,34,0.18);
  --red-border: rgba(204,51,34,0.2);
  --amber:      #D97706;
  --green:      #10B981;
  --teal:       #0891B2;
  --teal-dim:   rgba(8,145,178,0.08);
  --bg:         #FAFAF8;
  --bg2:        #F4F3F0;
  --card:       #FFFFFF;
  --border:     #E5E7EB;
  --border-dk:  #D1D5DB;
  --text:       #374151;
  --muted:      #6B7280;
  --muted2:     #9CA3AF;
  --white:      #FFFFFF;
  --shadow:     0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05);
  --shadow-lg:  0 4px 24px rgba(0,0,0,0.10), 0 12px 48px rgba(0,0,0,0.07);
  --r:    16px;
  --r-sm: 10px;
  --r-xs:  8px;
  --nav-h: 68px;
  --font-h: 'Bricolage Grotesque', sans-serif;
  --font-b: 'Instrument Sans', sans-serif;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
body { font-family: var(--font-b); background: var(--bg); color: var(--text); line-height: 1.6; overflow-x: hidden; }
h1,h2,h3,h4,h5 { font-family: var(--font-h); color: var(--ink); line-height: 1.12; letter-spacing: -0.025em; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }
.wrap    { max-width: 1200px; margin: 0 auto; padding: 0 32px; }
.wrap-sm { max-width:  900px; margin: 0 auto; padding: 0 32px; }
.wrap-xs { max-width:  680px; margin: 0 auto; padding: 0 32px; }
.section { padding: 96px 0; }
.section-alt  { background: var(--bg2); }
.tc { text-align: center; }
.eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--font-b);
  font-size: 0.72rem; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--red); margin-bottom: 16px;
}
.eyebrow-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--red);
  animation: pulse 2.2s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
.eyebrow.teal { color: var(--teal); }
.eyebrow.teal .eyebrow-dot { background: var(--teal); }
.s-title { font-size: clamp(1.9rem,3.4vw,2.75rem); font-weight: 800; margin-bottom: 14px; }
.s-sub   { font-size: 1.05rem; color: var(--muted); line-height: 1.75; max-width: 560px; }
.s-sub.c { margin: 0 auto; }
.reveal { opacity:0; transform:translateY(22px); transition:opacity .6s ease,transform .6s ease; }
.reveal.visible { opacity:1; transform:translateY(0); }
.d1{transition-delay:.07s} .d2{transition-delay:.14s} .d3{transition-delay:.21s} .d4{transition-delay:.28s}
.btn {
  display:inline-flex; align-items:center; gap:8px;
  font-family:var(--font-b); font-weight:600; font-size:.92rem;
  border:none; cursor:pointer; border-radius:var(--r-sm);
  transition:all .2s ease; text-decoration:none;
}
.btn-primary {
  padding:12px 26px; background:var(--red); color:white;
  box-shadow:0 4px 14px rgba(204,51,34,.28);
  transition: transform .3s ease, box-shadow .3s ease !important;
}
.btn-primary:hover { background:var(--red-lt); transform:translateY(-6px) scale(1.04) !important; box-shadow:0 16px 36px rgba(204,51,34,.28) !important; }
.btn-outline {
  padding:11px 26px; background:transparent; color:var(--ink);
  border:1.5px solid var(--border-dk);
  transition: transform .3s ease, box-shadow .3s ease !important;
}
.btn-outline:hover { border-color:var(--red); color:var(--red); background:var(--red-dim); transform:translateY(-6px) scale(1.04) !important; box-shadow:0 16px 36px rgba(204,51,34,.28) !important; }
.btn-white {
  padding:12px 26px; background:white; color:var(--red);
  box-shadow:0 4px 14px rgba(0,0,0,.10);
}
.btn-white:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.16); }
.btn-ghost-white {
  padding:11px 26px; background:transparent; color:white;
  border:1.5px solid rgba(255,255,255,.35);
}
.btn-ghost-white:hover { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.65); }
.tag {
  display:inline-flex; align-items:center; gap:5px;
  padding:4px 12px; border-radius:100px;
  font-size:.72rem; font-weight:600; letter-spacing:.05em;
  transition: transform .25s ease, box-shadow .25s ease, background .25s ease, color .25s ease;
  cursor: default;
}
.tag:hover { transform: scale(1.12); box-shadow: 0 6px 16px rgba(0,0,0,.12); }
.tag-red    { background:var(--red-dim);  color:var(--red);   }
.tag-teal   { background:var(--teal-dim); color:var(--teal);  }
.tag-green  { background:rgba(16,185,129,.1); color:var(--green); }
.tag-amber  { background:rgba(217,119,6,.1);  color:var(--amber); }
.tag-gray   { background:var(--bg2); color:var(--muted); border:1px solid var(--border); }
.tag-red:hover   { background: var(--red);  color: white; }
.tag-teal:hover  { background: var(--teal); color: white; }
.tag-green:hover { background: var(--green); color: white; }
.tag-amber:hover { background: var(--amber); color: white; }
.tag-gray:hover  { background: var(--ink);  color: white; }
.plat-pill {
  display:inline-flex; align-items:center; gap:8px;
  padding:7px 16px; border-radius:100px;
  border:1px solid var(--border);
  font-size:.83rem; font-weight:600;
  background:white; color:var(--ink-soft);
  box-shadow:0 1px 3px rgba(0,0,0,.06);
  white-space:nowrap; cursor:pointer;
  transition: all .3s ease;
}
.plat-pill:hover, .plat-pill:active {
  background: var(--red); border-color: var(--red); color: white;
  transform: scale(1.08); box-shadow: 0 8px 24px rgba(204,51,34,.30);
}
.plat-pill:hover img, .plat-pill:active img { filter: brightness(0) invert(1); }
.card {
  background:var(--card); border:1px solid var(--border);
  border-radius:var(--r); padding:32px;
  box-shadow:var(--shadow);
  transition:transform .32s ease, box-shadow .32s ease, border-color .32s ease, background .32s ease;
  cursor: pointer;
}
.card:hover { transform: translateY(-8px) scale(1.04); box-shadow: 0 20px 48px rgba(204,51,34,.22); border-color: var(--red) !important; background: var(--red) !important; }
.card:hover h4 { color: white !important; }
.card:hover p  { color: rgba(255,255,255,.85) !important; }
.card:hover .tag { background: rgba(255,255,255,.2) !important; color: white !important; }
.nav-wrap {
  position:fixed; top:0; left:0; right:0; z-index:900;
  background:rgba(250,250,248,.96);
  backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
  border-bottom:1px solid var(--border);
  transition:box-shadow .3s;
}
.nav-wrap.scrolled { box-shadow:var(--shadow); }
.nav-inner {
  max-width:1280px; margin:0 auto;
  display:flex; align-items:center;
  padding:0 32px; height:var(--nav-h);
}
.nav-logo { font-family:var(--font-h); font-weight:800; font-size:1.45rem; letter-spacing:-.035em; color:var(--ink); margin-right:40px; flex-shrink:0; cursor:pointer; }
.nav-logo span { color:var(--red); }
.nav-menu { display:flex; align-items:center; gap:2px; flex:1; }
.nav-item {
  position:relative; display:flex; align-items:center; gap:5px;
  padding:8px 13px; font-size:.875rem; font-weight:500;
  color:var(--ink-soft); cursor:pointer; border-radius:var(--r-xs);
  transition:background .18s, color .18s; white-space:nowrap; user-select:none;
}
.nav-item:hover { background:var(--red-dim); color:var(--red); }
.nav-item .chev { width:13px; height:13px; flex-shrink:0; transition:transform .2s; stroke:currentColor; fill:none; stroke-width:2; }
.nav-item:hover .chev { transform:rotate(180deg); }
.nav-item::after { content: ''; position: absolute; bottom: -8px; left: 0; right: 0; height: 8px; background: transparent; }
.drop {
  position:absolute; top:calc(100% + 8px); left:50%;
  transform:translateX(-50%) translateY(-6px);
  background:var(--white); border:1px solid var(--border);
  border-radius:14px; box-shadow:var(--shadow-lg);
  padding:10px; min-width:230px;
  opacity:0; pointer-events:none;
  transition:opacity .18s, transform .18s; z-index:200;
}
.nav-item:hover .drop, .drop:hover { opacity:1; pointer-events:all; transform:translateX(-50%) translateY(0); }
.drop-item {
  display:flex; align-items:center; gap:10px;
  padding:10px 13px; border-radius:8px;
  font-size:.855rem; font-weight:500; color:var(--ink-soft);
  cursor:pointer; transition:background .14s, color .14s;
}
.drop-item:hover { background:var(--red-dim); color:var(--red); }
.drop-icon { width:30px; height:30px; border-radius:7px; background:var(--red-dim); display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:.9rem; }
.nav-cta { margin-left:auto; display:flex; align-items:center; gap:10px; }
.btn-nav-ghost { padding:7px 16px; border-radius:var(--r-xs); font-family:var(--font-b); font-size:.855rem; font-weight:600; color:var(--ink-soft); background:none; border:none; cursor:pointer; transition:background .18s, color .18s; }
.btn-nav-ghost:hover { background:var(--red-dim); color:var(--red); }
.btn-nav-cta { padding:9px 20px; border-radius:var(--r-xs); font-family:var(--font-b); font-size:.855rem; font-weight:700; background:var(--red); color:white; border:none; cursor:pointer; transition:background .2s, transform .15s; }
.btn-nav-cta:hover { background:var(--red-lt); transform:translateY(-1px); }
.nav-hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; margin-left:auto; padding:4px; }
.nav-hamburger span { display:block; width:22px; height:2px; background:var(--ink); border-radius:2px; transition:all .3s; }
.mobile-menu { display:none; position:fixed; top:var(--nav-h); left:0; right:0; background:var(--white); border-bottom:1px solid var(--border); padding:20px 24px; z-index:800; box-shadow:var(--shadow-lg); }
.mobile-menu.open { display:block; }
.mob-link { display:block; padding:12px 0; font-size:.95rem; font-weight:600; color:var(--ink-soft); border-bottom:1px solid var(--border); cursor:pointer; transition:color .15s; }
.mob-link:hover { color:var(--red); }
.mob-link:last-child { border-bottom:none; }
.hero {
  padding-top:calc(var(--nav-h) + 0px); padding-bottom:40px;
  min-height:100vh; display:flex; align-items:center;
  background:linear-gradient(135deg, #FFF7F6 0%, #FFF0EE 45%, #FFF8F6 100%);
  border-bottom:1px solid var(--border);
  position:relative; overflow:hidden;
}
.hero::before {
  content:''; position:absolute; top:-30%; right:-8%; width:600px; height:600px;
  background:radial-gradient(circle, rgba(204,51,34,.06) 0%, transparent 65%);
  border-radius:50%; pointer-events:none;
}
.hero::after {
  content:''; position:absolute; bottom:-20%; left:-6%; width:400px; height:400px;
  background:radial-gradient(circle, rgba(8,145,178,.05) 0%, transparent 65%);
  border-radius:50%; pointer-events:none;
}
.hero-inner {
  max-width:1200px; margin:0 auto; padding:0 32px;
  display:grid; grid-template-columns:1fr 1fr;
  align-items:center; gap:64px; position:relative; z-index:1;
}
.hero-kicker {
  display:inline-flex; align-items:center; gap:8px;
  background:white; border:1px solid var(--border);
  border-radius:100px; padding:6px 16px;
  font-size:.78rem; font-weight:600; color:var(--ink-soft); margin-bottom:24px;
  box-shadow:0 1px 4px rgba(0,0,0,.06);
  transition: transform .3s ease, box-shadow .3s ease; cursor: default;
}
.hero-kicker:hover { transform: scale(1.08); box-shadow: 0 8px 24px rgba(0,0,0,.12); }
.hero-kicker-dot { width:7px; height:7px; background:var(--green); border-radius:50%; box-shadow:0 0 0 2px rgba(16,185,129,.2); }
h1.hero-h { font-size:clamp(2.6rem, 4.8vw, 4rem); font-weight:800; line-height:1.05; letter-spacing:-.04em; color:var(--ink); margin-bottom:20px; }
h1.hero-h em { font-style:normal; color:var(--red); }
.hero-sub { font-size:1.08rem; color:var(--muted); line-height:1.75; margin-bottom:32px; max-width:480px; }
.hero-actions { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:44px; }
.hero-plats { display:flex; flex-direction:column; gap:10px; padding-top:20px; border-top:1px solid rgba(0,0,0,.07); margin-top:20px; }
.hero-plats-label { font-size:.72rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--muted2); }
.hero-plats-row { display:flex; flex-wrap:wrap; gap:8px; }
.hero-panel {
  background:white; border:1px solid var(--border);
  border-radius:20px; box-shadow:var(--shadow-lg);
  overflow:hidden; position:relative;
  animation: panelFloat 3.5s ease-in-out infinite;
  transition: transform .35s ease, box-shadow .35s ease;
}
.hero-panel:hover { animation: none; transform: translateY(-10px) scale(1.05); box-shadow: 0 32px 72px rgba(204,51,34,.18); }
@keyframes panelFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
.hero-float {
  position:absolute; top:16px; right:20px; background:white; border:1px solid var(--border);
  border-radius:100px; padding:6px 14px; font-size:.75rem; font-weight:700; color:var(--ink);
  box-shadow:var(--shadow); display:flex; align-items:center; gap:6px;
  transition: transform .3s ease, box-shadow .3s ease; cursor: default;
}
.hero-float:hover { transform: scale(1.12); box-shadow: 0 8px 20px rgba(0,0,0,.15); }
.hf-dot { width:7px; height:7px; background:var(--green); border-radius:50%; flex-shrink:0; box-shadow:0 0 0 2px rgba(16,185,129,.2); }
.hero-panel-top { background:linear-gradient(135deg, #FFF0EE, #FFF7F0); padding:28px 28px 0; display:flex; justify-content:space-between; align-items:flex-end; }
.hero-panel-label { font-family:var(--font-h); font-size:.8rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--red); margin-bottom:10px; }
.hero-panel-title { font-family:var(--font-h); font-size:1.15rem; font-weight:800; color:var(--ink); margin-bottom:4px; }
.hero-panel-sub { font-size:.8rem; color:var(--muted); }
.hero-panel-img { width:130px; height:110px; object-fit:cover; border-radius:12px 12px 0 0; flex-shrink:0; }
.hero-panel-body { padding:24px 28px; }
.hero-stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:var(--border); border:1px solid var(--border); border-radius:12px; overflow:hidden; margin-top:16px; }
.hsg-item { background:white; padding:16px 18px; transition: transform .3s ease, background .3s ease; cursor: default; }
.hsg-item:hover { transform: scale(1.06); background: #FFF0EE; z-index: 1; position: relative; }
.hsg-item:hover .hsg-val { color: var(--red); }
.hsg-val { font-family:var(--font-h); font-size:1.6rem; font-weight:800; color:var(--ink); line-height:1; letter-spacing:-.035em; transition: color .3s ease; }
.hsg-val em { font-style:normal; color:var(--red); }
.hsg-lbl { font-size:.72rem; color:var(--muted2); font-weight:500; margin-top:3px; }
.ticker-wrap { background:var(--ink); padding:13px 0; overflow:hidden; white-space:nowrap; }
.ticker-track { display:inline-flex; gap:40px; animation:ticker 42s linear infinite; }
@keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
.tick-item { display:flex; align-items:center; gap:10px; font-size:.72rem; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.38); }
.tick-item strong { color:rgba(255,255,255,.82); }
.tick-dot { width:3px; height:3px; background:var(--red-lt); border-radius:50%; flex-shrink:0; }
.trust-bar { background:white; border-bottom:1px solid var(--border); padding:28px 0; }
.trust-inner { display:flex; align-items:center; justify-content:center; gap:48px; flex-wrap:wrap; }
.trust-stat { text-align:center; opacity:0; transform:translateY(20px); animation: trustFadeUp .6s ease forwards; }
.trust-stat:nth-child(1) { animation-delay:.1s; }
.trust-stat:nth-child(3) { animation-delay:.2s; }
.trust-stat:nth-child(5) { animation-delay:.3s; }
.trust-stat:nth-child(7) { animation-delay:.4s; }
.trust-stat:nth-child(9) { animation-delay:.5s; }
@keyframes trustFadeUp { to { opacity:1; transform:translateY(0); } }
.trust-num { font-family:var(--font-h); font-size:1.9rem; font-weight:800; color:var(--red); line-height:1; margin-bottom:4px; display:inline-block; transition: transform .3s ease, color .3s ease; }
.trust-stat:hover .trust-num { transform: scale(1.18); color: #E04430; }
.trust-stat:hover .trust-desc { color: var(--ink); }
.trust-desc { font-size:.8rem; color:var(--muted); transition: color .3s ease; }
.trust-div { width:1px; height:36px; background:var(--border); }
.why-grid { display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:center; }
.why-feats { display:flex; flex-direction:column; gap:4px; }
.why-feat {
  display:flex; align-items:flex-start; gap:16px; padding:20px; border-radius:12px;
  cursor:default; position:relative;
  transition: background .3s ease, transform .3s ease, box-shadow .3s ease, border .3s ease;
  border: 1px solid transparent;
}
.why-feat:hover { background: white; transform: translateX(10px); box-shadow: 0 8px 32px rgba(204,51,34,.12); border: 1px solid rgba(204,51,34,.15); border-radius: 14px; }
.why-feat:hover .wf-ico { background: var(--red); border-color: var(--red); transform: scale(1.15) rotate(-6deg); box-shadow: 0 8px 20px rgba(204,51,34,.30); }
.why-feat:hover .wf-ico svg { stroke: white; }
.why-feat:hover .wf-txt h4 { color: var(--red); }
.wf-ico { width:44px; height:44px; border-radius:10px; background:white; border:1px solid var(--border); box-shadow:var(--shadow); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition: background .3s ease, transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
.wf-ico svg { width:19px; height:19px; transition: stroke .3s ease; }
.wf-txt h4 { font-size:.93rem; font-weight:700; margin-bottom:5px; transition: color .3s ease; }
.wf-txt p  { font-size:.83rem; color:var(--muted); line-height:1.65; }
.solutions-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:24px; margin-top:56px; }
.sol-card {
  background:white; border:1px solid var(--border);
  border-radius:var(--r); padding:32px;
  box-shadow:var(--shadow);
  transition: transform .35s ease, box-shadow .35s ease, background .35s ease, border-color .35s ease;
  position:relative; overflow:hidden; cursor:pointer;
}
.sol-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; border-radius:var(--r) var(--r) 0 0; opacity:0; transition:opacity .28s; }
.sol-card:hover::before { opacity:1; }
.sol-card.prim::before { background:linear-gradient(90deg, var(--red), var(--red-lt)); }
.sol-card.sec::before  { background:linear-gradient(90deg, var(--teal), #06B6D4); }
.sol-card.prim:hover { background: var(--red); border-color: var(--red); transform: scale(1.03) translateY(-6px); box-shadow: 0 24px 56px rgba(204,51,34,.25); }
.sol-card.prim:hover h3, .sol-card.prim:hover p  { color: white; }
.sol-card.prim:hover .sol-ico.prim { background: rgba(255,255,255,.2); border-color: rgba(255,255,255,.3); }
.sol-card.prim:hover .sol-ico.prim svg { stroke: white; }
.sol-card.prim:hover .tag-red { background: rgba(255,255,255,.2); color: white; }
.sol-card.prim:hover .btn-primary { background: white; color: var(--red); box-shadow: 0 4px 14px rgba(0,0,0,.15); }
.sol-card.sec:hover { background: var(--teal); border-color: var(--teal); transform: scale(1.03) translateY(-6px); box-shadow: 0 24px 56px rgba(8,145,178,.25); }
.sol-card.sec:hover h3, .sol-card.sec:hover p  { color: white; }
.sol-card.sec:hover .sol-ico.sec { background: rgba(255,255,255,.2); border-color: rgba(255,255,255,.3); }
.sol-card.sec:hover .sol-ico.sec svg { stroke: white; }
.sol-card.sec:hover .tag-teal { background: rgba(255,255,255,.2); color: white; }
.sol-card.sec:hover button { background: white !important; color: var(--teal) !important; box-shadow: 0 4px 14px rgba(0,0,0,.15); }
.sol-ico { width:52px; height:52px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; transition: background .35s ease, border-color .35s ease; }
.sol-ico.prim { background:var(--red-dim);  border:1px solid var(--red-border); }
.sol-ico.sec  { background:var(--teal-dim); border:1px solid rgba(8,145,178,.15); }
.sol-ico svg { width:24px; height:24px; transition: stroke .35s ease; }
.sol-card h3 { font-size:1.2rem; font-weight:800; margin-bottom:10px; transition: color .35s ease; }
.sol-card p  { font-size:.875rem; color:var(--muted); line-height:1.7; margin-bottom:20px; transition: color .35s ease; }
.sol-tags { display:flex; flex-wrap:wrap; gap:6px; }
.roles-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-top:52px; }
.role-card {
  background:white; border:1px solid var(--border); border-radius:var(--r);
  padding:24px 20px; text-align:center; box-shadow:var(--shadow);
  transition:transform .3s ease, box-shadow .3s ease, background .3s ease, border-color .3s ease, color .3s ease;
  cursor:pointer;
}
.role-card:hover { transform:scale(1.06); box-shadow:0 20px 48px rgba(204,51,34,.18); background:var(--red); border-color:var(--red); }
.role-card:hover h4 { color:white; }
.role-card:hover p  { color:rgba(255,255,255,.8); }
.role-card:hover .role-badge { color:rgba(255,255,255,.9); }
.role-card:hover .role-icon { background:rgba(255,255,255,.2); border-color:rgba(255,255,255,.3); }
.role-card:hover .role-icon svg { stroke:white; }
.role-icon { width:52px; height:52px; border-radius:13px; background:var(--red-dim); border:1px solid var(--red-border); margin:0 auto 16px; display:flex; align-items:center; justify-content:center; transition:background .3s ease, border-color .3s ease; }
.role-icon svg { width:22px; height:22px; transition:stroke .3s ease; }
.role-card h4 { font-size:.95rem; font-weight:800; margin-bottom:8px; transition:color .3s ease; }
.role-card p  { font-size:.8rem; color:var(--muted); line-height:1.6; margin-bottom:14px; transition:color .3s ease; }
.role-badge   { font-size:.7rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--red); transition:color .3s ease; }
.tech-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-top:52px; }
.tech-cat { background:white; border:1px solid var(--border); border-radius:var(--r); padding:24px; box-shadow:var(--shadow); position: relative; overflow: hidden; cursor: default; transition: transform .32s ease, box-shadow .32s ease, border-color .32s ease; }
.tech-cat::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, var(--red-dim) 0%, transparent 65%); opacity: 0; transition: opacity .35s ease; z-index: 0; border-radius: var(--r); pointer-events: none; }
.tech-cat.teal::before { background: linear-gradient(135deg, var(--teal-dim) 0%, transparent 65%); }
.tech-cat:hover::before { opacity: 1; }
.tech-cat:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 52px rgba(204,51,34,.13), 0 4px 16px rgba(0,0,0,.07); border-color: var(--red); }
.tech-cat.teal:hover { box-shadow: 0 20px 52px rgba(8,145,178,.16), 0 4px 16px rgba(0,0,0,.07); border-color: var(--teal); }
.tech-cat::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--red), var(--red-lt)); border-radius: 0 0 var(--r) var(--r); transform: scaleX(0); transform-origin: left; transition: transform .38s ease; z-index: 2; }
.tech-cat.teal::after { background: linear-gradient(90deg, var(--teal), #06B6D4); }
.tech-cat:hover::after { transform: scaleX(1); }
.tech-cat-label { font-size:.68rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--red); margin-bottom:14px; display:flex; align-items:center; gap:8px; position: relative; z-index: 1; transition: letter-spacing .3s ease; }
.tech-cat:hover .tech-cat-label { letter-spacing: .18em; }
.tech-cat-label::after { content:''; flex:1; height:1px; background:var(--red-dim); }
.tech-cat.teal .tech-cat-label { color:var(--teal); }
.tech-cat.teal .tech-cat-label::after { background:var(--teal-dim); }
.tech-badge { position: absolute; top: 14px; right: 14px; font-size: .62rem; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; padding: 3px 9px; border-radius: 100px; background: var(--red-dim); color: var(--red); border: 1px solid var(--red-border); opacity: 0; transform: translateY(-5px); transition: opacity .3s ease, transform .3s ease; z-index: 3; pointer-events: none; }
.tech-cat.teal .tech-badge { background: var(--teal-dim); color: var(--teal); border-color: rgba(8,145,178,.22); }
.tech-cat:hover .tech-badge { opacity: 1; transform: translateY(0); }
.tech-list { list-style:none; display:flex; flex-direction:column; gap:9px; position: relative; z-index: 1; }
.tech-list li { display:flex; align-items:center; gap:9px; font-size:.83rem; font-weight:500; color:var(--ink-soft); border-radius: 6px; padding: 3px 7px; transition: transform .2s ease, color .2s ease, background .2s ease, padding-left .2s ease; }
.tech-list li::before { content:''; width:5px; height:5px; border-radius:50%; background:var(--red); flex-shrink:0; }
.tech-cat.teal .tech-list li::before { background:var(--teal); }
.tech-list li:hover { transform: translateX(5px); padding-left: 11px; background: var(--red-dim); color: var(--red) !important; }
.tech-cat.teal .tech-list li:hover { background: var(--teal-dim); color: var(--teal) !important; }
.tech-cat:hover .tech-list li::before { animation: pulse 1s ease-in-out infinite; }
.staffing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:52px; align-items: stretch; }
.staff-card {
  height: 100%; background: white; border: 1px solid var(--border);
  border-radius: var(--r); padding: 28px;
  box-shadow: var(--shadow);
  position: relative; overflow: hidden; cursor: pointer;
  transition: transform .35s ease, box-shadow .35s ease, background .35s ease, border-color .35s ease;
  display: flex; flex-direction: column;
}
.staff-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:3px; background:white; transform:scaleX(0); transform-origin:left; transition:transform .35s ease; }
.staff-card:hover::after { transform:scaleX(1); }
.staff-card:hover { background: var(--red); border-color: var(--red); transform: scale(1.04) translateY(-6px); box-shadow: 0 24px 56px rgba(204,51,34,.25); }
.staff-card:hover h3 { color: white; }
.staff-card:hover p  { color: rgba(255,255,255,.85); }
.staff-card:hover .staff-badge { background: rgba(255,255,255,.2); color: white; border-color: rgba(255,255,255,.3); }
.staff-card:hover .staff-ico { background: rgba(255,255,255,.2); border-color: rgba(255,255,255,.3); }
.staff-card:hover .staff-ico svg { stroke: white; }
.staff-card:hover .staff-pros li { color: rgba(255,255,255,.85); }
.staff-card:hover .staff-pros li::before { color: white; }
.staff-card h3 { transition: color .35s ease; }
.staff-card p  { transition: color .35s ease; }
.staff-badge { display:inline-flex; align-items:center; gap:6px; background:var(--red-dim); color:var(--red); font-size:.7rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; padding:4px 10px; border-radius:100px; border:1px solid var(--red-border); transition: background .35s ease, color .35s ease, border-color .35s ease; }
.staff-ico { width:48px; height:48px; border-radius:12px; background:var(--red-dim); border:1px solid var(--red-border); display:flex; align-items:center; justify-content:center; margin-bottom:18px; transition: background .35s ease, border-color .35s ease; }
.staff-ico svg { width:22px; height:22px; transition: stroke .35s ease; }
.staff-card h3 { font-size:1.1rem; font-weight:800; margin-bottom:8px; }
.staff-card p  { font-size:.84rem; color:var(--muted); line-height:1.7; margin-bottom:16px; flex: 1; }
.staff-pros { list-style:none; display:flex; flex-direction:column; gap:7px; margin-top:14px; }
.staff-pros li { font-size:.82rem; color:var(--muted); display:flex; align-items:flex-start; gap:8px; line-height:1.5; transition: transform .25s ease, color .25s ease, gap .25s ease; cursor: default; }
.staff-pros li:hover { transform: translateX(8px); color: var(--red); gap: 12px; }
.staff-card:hover .staff-pros li:hover { color: white; }
.staff-pros li::before { content:'✓'; color:var(--green); font-weight:800; font-size:.78rem; flex-shrink:0; margin-top:1px; }
.hiw-grid { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:start; margin-top:0; }
.hiw-left { display:flex; flex-direction:column; gap:0; }
.hiw-left-head { margin-bottom:28px; }
.hiw-metrics { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:28px; }
.hiw-metric { background:white; border:1px solid var(--border); border-radius:12px; padding:18px 20px; box-shadow:var(--shadow); transition: transform .3s ease, box-shadow .3s ease, background .3s ease, border-color .3s ease; cursor: pointer; }
.hiw-metric:hover { transform: translateY(-8px) scale(1.04); background: var(--red) !important; border-color: var(--red) !important; box-shadow: 0 20px 48px rgba(204,51,34,.25); }
.hiw-metric:hover .hiw-metric-val, .hiw-metric:hover .hiw-metric-lbl { color: white !important; }
.hiw-metric-val { font-family:var(--font-h); font-size:1.7rem; font-weight:800; color:var(--red); line-height:1; margin-bottom:4px; }
.hiw-metric-lbl { font-size:.78rem; color:var(--muted); font-weight:500; }
.hiw-proof { margin-top:20px; padding:20px 22px; background:white; border:1px solid var(--border); border-radius:12px; box-shadow:var(--shadow); display:flex; align-items:flex-start; gap:14px; transition: transform .3s ease, box-shadow .3s ease, background .3s ease, border-color .3s ease; cursor: pointer; }
.hiw-proof:hover { transform: translateY(-8px) scale(1.04); background: var(--red) !important; border-color: var(--red) !important; box-shadow: 0 20px 48px rgba(204,51,34,.25); }
.hiw-proof:hover .hiw-proof-ico { background: rgba(255,255,255,.2) !important; border-color: rgba(255,255,255,.3) !important; }
.hiw-proof:hover .hiw-proof-ico svg { stroke: white; }
.hiw-proof:hover h5, .hiw-proof:hover p { color: white !important; }
.hiw-proof-ico { width:38px; height:38px; border-radius:9px; background:var(--red-dim); border:1px solid var(--red-border); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.hiw-proof-ico svg { width:16px; height:16px; }
.hiw-proof-text h5 { font-size:.88rem; font-weight:700; margin-bottom:3px; }
.hiw-proof-text p  { font-size:.8rem; color:var(--muted); line-height:1.6; }
.process-list { display:flex; flex-direction:column; gap:12px; }
.proc-step { display:flex; align-items:flex-start; gap:20px; padding:22px 26px; border-radius:14px; background:white; border:1px solid var(--border); box-shadow:var(--shadow); transition:transform .32s ease, border-color .32s ease, box-shadow .32s ease, background .32s ease; cursor:pointer; position:relative; overflow:hidden; }
.proc-step:hover { transform: translateY(-6px) scale(1.02); background: var(--red) !important; border-color: var(--red) !important; box-shadow: 0 20px 48px rgba(204,51,34,.25); }
.proc-step:hover .step-n { background: white !important; color: var(--red) !important; }
.proc-step:hover .step-body h4 { color: white !important; }
.proc-step:hover .step-body p  { color: rgba(255,255,255,.85) !important; }
.proc-step:hover .tag-teal, .proc-step:hover .tag-green, .proc-step:hover .tag-amber, .proc-step:hover .tag-gray { background: rgba(255,255,255,.2) !important; color: white !important; border-color: rgba(255,255,255,.3) !important; }
.step-n { width:40px; height:40px; border-radius:10px; background:var(--red); color:white; display:flex; align-items:center; justify-content:center; font-family:var(--font-h); font-weight:800; font-size:.95rem; flex-shrink:0; }
.step-body h4 { font-size:.95rem; font-weight:700; margin-bottom:5px; }
.step-body p  { font-size:.84rem; color:var(--muted); line-height:1.65; }
.step-tag { margin-top:9px; }
.roi-grid { display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:start; margin-top:52px; }
.roi-vs { display:flex; flex-direction:column; gap:10px; }
.roi-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:0; background:white; border:1px solid var(--border); border-radius:12px; overflow:hidden; box-shadow:var(--shadow); font-size:.84rem; transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease, background .28s ease; cursor: pointer; }
.roi-row.header { background:var(--ink); color:white; border-color:var(--ink); border-radius:12px 12px 0 0; }
.roi-row:not(.header):hover { transform: translateX(8px); border-color: var(--red) !important; box-shadow: 0 8px 28px rgba(204,51,34,.15); background: var(--red) !important; }
.roi-row:not(.header):hover .roi-cell { color: white !important; }
.roi-row:not(.header):hover .roi-cell:first-child { color: white !important; }
.roi-row:not(.header):hover .roi-yes { color: white !important; }
.roi-row:not(.header):hover .roi-no  { color: rgba(255,255,255,.7) !important; }
.roi-cell { padding:14px 18px; border-right:1px solid var(--border); }
.roi-cell:last-child { border-right:none; }
.roi-row.header .roi-cell { border-color:rgba(255,255,255,.1); font-family:var(--font-h); font-size:.75rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.7); }
.roi-row:not(.header) .roi-cell { color:var(--text); }
.roi-row:not(.header) .roi-cell:first-child { color:var(--ink); font-weight:600; }
.roi-yes { display:inline-flex; align-items:center; gap:5px; color:var(--green); font-weight:700; font-size:.82rem; }
.roi-no  { display:inline-flex; align-items:center; gap:5px; color:var(--muted2); font-weight:600; font-size:.82rem; }
.roi-right { display:flex; flex-direction:column; gap:16px; }
.roi-card { background:white; border:1px solid var(--border); border-radius:14px; padding:24px; box-shadow:var(--shadow); display:flex; align-items:flex-start; gap:16px; transition: transform .32s ease, box-shadow .32s ease, border-color .32s ease, background .32s ease; cursor: pointer; }
.roi-card:hover { transform: translateX(10px); border-color: var(--red) !important; box-shadow: 0 12px 36px rgba(204,51,34,.18); background: linear-gradient(90deg, #fff5f4, white); }
.roi-card:hover .roi-card-ico { background: var(--red) !important; border-color: var(--red) !important; }
.roi-card:hover .roi-card-ico svg { stroke: white; }
.roi-card:hover h4 { color: var(--red); }
.roi-card-ico { width:44px; height:44px; border-radius:10px; background:var(--red-dim); border:1px solid var(--red-border); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition: background .32s ease, border-color .32s ease; }
.roi-card-ico svg { width:19px; height:19px; transition: stroke .32s ease; }
.roi-card h4 { font-size:.93rem; font-weight:700; margin-bottom:4px; transition: color .32s ease; }
.roi-card p  { font-size:.82rem; color:var(--muted); line-height:1.65; }
.roi-card-val { font-family:var(--font-h); font-size:1.1rem; font-weight:800; color:var(--red); margin-top:6px; }
.ind-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:52px; }
.blog-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; margin-top:52px; }
.blog-card { background:white; border:1px solid var(--border); border-radius:var(--r); overflow:hidden; box-shadow:var(--shadow); transition:transform .28s, box-shadow .28s; cursor:pointer; }
.blog-card:hover { transform:translateY(-5px); box-shadow:var(--shadow-lg); }
.blog-thumb { height:178px; overflow:hidden; }
.blog-thumb img { width:100%; height:100%; object-fit:cover; transition:transform .4s ease; }
.blog-card:hover .blog-thumb img { transform:scale(1.04); }
.blog-body { padding:22px; }
.blog-meta { font-size:.75rem; color:var(--muted); margin-bottom:10px; display:flex; align-items:center; gap:8px; }
.blog-meta-dot { width:3px; height:3px; border-radius:50%; background:var(--muted2); }
.blog-card h3 { font-size:.98rem; font-weight:700; margin-bottom:8px; line-height:1.4; }
.blog-card p  { font-size:.83rem; color:var(--muted); line-height:1.65; margin-bottom:16px; }
.blog-read { font-size:.8rem; font-weight:700; color:var(--red); display:flex; align-items:center; gap:5px; transition:gap .2s; }
.blog-card:hover .blog-read { gap:8px; }
.cta-banner { background:var(--red); padding:96px 0; text-align:center; position:relative; overflow:hidden; }
.cta-banner::before { content:'REDTUF'; position:absolute; font-family:var(--font-h); font-size:18rem; font-weight:800; color:rgba(255,255,255,.04); top:50%; left:50%; transform:translate(-50%,-50%); white-space:nowrap; pointer-events:none; }
.cta-banner h2 { font-size:clamp(2rem,4vw,3rem); color:white; margin-bottom:16px; position:relative; }
.cta-banner p  { font-size:1.05rem; color:rgba(255,255,255,.78); line-height:1.75; margin-bottom:36px; position:relative; max-width:520px; margin-left:auto; margin-right:auto; }
.cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; position:relative; }
footer { background:var(--ink); color:rgba(255,255,255,.7); padding:72px 0 0; }
.footer-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1fr 1fr; gap:40px; margin-bottom:56px; }
.f-brand-name { font-family:var(--font-h); font-size:1.35rem; font-weight:800; color:white; letter-spacing:-.035em; margin-bottom:12px; }
.f-brand-name span { color:var(--red-lt); }
.f-desc { font-size:.875rem; line-height:1.72; margin-bottom:22px; color:rgba(255,255,255,.45); }
.f-contact { font-size:.84rem; color:rgba(255,255,255,.38); }
.f-contact a { color:rgba(255,255,255,.48); transition:color .2s; }
.f-contact a:hover { color:white; }
.f-contact div { margin-bottom:5px; }
.f-col h5 { font-family:var(--font-h); font-size:.78rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-bottom:16px; }
.f-col ul { list-style:none; display:flex; flex-direction:column; gap:10px; }
.f-col ul a { font-size:.875rem; color:rgba(255,255,255,.48); transition:color .2s; }
.f-col ul a:hover { color:white; }
.footer-bottom { border-top:1px solid rgba(255,255,255,.08); padding:24px 0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; font-size:.8rem; color:rgba(255,255,255,.28); }
.f-bottom-links { display:flex; gap:20px; }
.f-bottom-links a { color:rgba(255,255,255,.28); transition:color .2s; }
.f-bottom-links a:hover { color:white; }
.modal-overlay { position:fixed; inset:0; z-index:2000; background:rgba(13,17,23,.55); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; opacity:0; visibility:hidden; transition:all .22s ease; padding:16px; }
.modal-overlay.open { opacity:1; visibility:visible; }
.modal-box { background:white; border-radius:20px; width:100%; max-width:480px; box-shadow:var(--shadow-lg); transform:scale(.96) translateY(14px); transition:transform .26s ease; position:relative; }
.modal-overlay.open .modal-box { transform:scale(1) translateY(0); }
.modal-close { position:absolute; top:18px; right:18px; width:32px; height:32px; border-radius:50%; background:var(--bg2); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:.9rem; color:var(--muted); transition:background .15s; }
.modal-close:hover { background:var(--border-dk); }
.modal-box h3 { font-size:1.4rem; font-weight:800; margin-bottom:6px; letter-spacing:-.025em; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
.form-group { display:flex; flex-direction:column; gap:5px; margin-bottom:10px; }
.form-label { font-size:.75rem; font-weight:700; color:var(--muted); letter-spacing:.06em; text-transform:uppercase; }
.form-input,.form-select,.form-textarea { padding:8px 12px; border-radius:var(--r-xs); border:1.5px solid var(--border); font-family:var(--font-b); font-size:.84rem; color:var(--ink); background:white; transition:border-color .15s, box-shadow .15s; outline:none; }
.form-input:focus,.form-select:focus,.form-textarea:focus { border-color:var(--red); box-shadow:0 0 0 3px var(--red-dim); }
.form-textarea { resize:vertical; min-height:68px; }
.form-submit { width:100%; padding:10px; background:var(--red); color:white; border:none; border-radius:10px; font-family:var(--font-b); font-weight:700; font-size:.9rem; cursor:pointer; transition:background .2s, transform .15s; }
.form-submit:hover { background:var(--red-lt); transform:translateY(-1px); }
.sticky-cta { position:fixed; bottom:28px; right:28px; z-index:700; background:var(--red); color:white; padding:11px 22px; border-radius:100px; font-family:var(--font-b); font-weight:700; font-size:.82rem; box-shadow:0 8px 28px rgba(204,51,34,.4); display:flex; align-items:center; gap:6px; cursor:pointer; border:none; transition:transform .2s, box-shadow .2s, background .2s; }
.sticky-cta:hover { transform:translateY(-2px); background:var(--red-lt); box-shadow:0 12px 36px rgba(204,51,34,.48); }
.divider { height:1px; background:linear-gradient(90deg, transparent, var(--border), transparent); }
@media (max-width:1080px) {
  .hero-inner { grid-template-columns:1fr; gap:3rem; }
  .hero-right { display:none; }
  .why-grid { grid-template-columns:1fr; gap:3rem; }
  .hiw-grid { grid-template-columns:1fr; gap:3rem; }
  .roi-grid { grid-template-columns:1fr; }
  .roles-grid { grid-template-columns:repeat(2,1fr); }
  .tech-grid { grid-template-columns:repeat(2,1fr); }
  .solutions-grid { grid-template-columns:1fr; }
  .blog-grid { grid-template-columns:1fr; }
  .footer-grid { grid-template-columns:1fr 1fr; }
  .staffing-grid { grid-template-columns:1fr 1fr; }
  .ind-grid { grid-template-columns:1fr; }
}
@media (max-width:768px) {
  .nav-menu,.nav-cta { display:none; }
  .nav-hamburger { display:flex; }
  .wrap,.wrap-sm,.wrap-xs { padding:0 20px; }
  .hero-inner { padding:0 20px; }
  .section { padding:64px 0; }
  .roles-grid { grid-template-columns:1fr 1fr; }
  .tech-grid  { grid-template-columns:1fr 1fr; }
  .staffing-grid { display: block !important; }
  .staff-card { width: 100% !important; margin-bottom: 16px; }
  .footer-grid { grid-template-columns:1fr; }
  .footer-bottom { flex-direction:column; text-align:center; }
  .sticky-cta { bottom:16px; right:16px; font-size:.78rem; padding:9px 16px; }
  .cta-banner::before { font-size:8rem; }
  .hiw-proof { text-align:center; flex-direction:column; align-items:center; }
  .btn-primary, .btn-outline { width:100%; justify-content:center; }
  .roi-row { grid-template-columns:1fr; }
  .roi-row .roi-cell:not(:first-child) { display:none; }
  #engage-grid { grid-template-columns: 1fr !important; }
  .trust-inner { flex-direction: column; gap: 16px; padding: 0 16px; }
  .trust-stat { width: 100%; background: #f9f9f9; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .trust-div { display: none; }
  .roles-grid { grid-template-columns:1fr !important; }
  .hero { min-height:100vh; padding-bottom:32px; align-items:flex-start; padding-top:calc(var(--nav-h) + 20px); }
  .hero-plats { margin-top:16px; padding-top:16px; }
  .hero-plats-row { gap:6px; }
  .plat-pill { padding:5px 12px; font-size:.78rem; }
}
`;

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Submit form state
  const [submitBtnText, setSubmitBtnText] = useState("Submit Requirement →");
  const [submitBtnStyle, setSubmitBtnStyle] = useState({});
  const [submitDisabled, setSubmitDisabled] = useState(false);

  // Contact form state
  const [contactBtnText, setContactBtnText] = useState("Send Message →");
  const [contactBtnStyle, setContactBtnStyle] = useState({});
  const [contactDisabled, setContactDisabled] = useState(false);

  // Form fields - modal
  const fCompanyRef = useRef(null);
  const fEmailRef = useRef(null);
  const fEngagementRef = useRef(null);
  const fHiringRef = useRef(null);
  const fDetailsRef = useRef(null);

  // Form fields - contact modal
  const cNameRef = useRef(null);
  const cCompanyRef = useRef(null);
  const cEmailRef = useRef(null);
  const cPhoneRef = useRef(null);
  const cDomainRef = useRef(null);
  const cMessageRef = useRef(null);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = globalCSS;
    document.head.appendChild(styleEl);

    const link1 = document.createElement("link");
    link1.rel = "preconnect";
    link1.href = "https://fonts.googleapis.com";
    document.head.appendChild(link1);

    const link2 = document.createElement("link");
    link2.rel = "preconnect";
    link2.href = "https://fonts.gstatic.com";
    link2.crossOrigin = "";
    document.head.appendChild(link2);

    const link3 = document.createElement("link");
    link3.href = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap";
    link3.rel = "stylesheet";
    document.head.appendChild(link3);

    document.title = "Redtuf — Hire Top Cloud, AI & SaaS Engineers";

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      const menu = document.getElementById("mobileMenu");
      const ham = document.getElementById("hamburger");
      if (mobileOpen && menu && ham && !menu.contains(e.target) && !ham.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [mobileOpen]);

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") { setModalOpen(false); setContactModalOpen(false); } };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Body overflow
  useEffect(() => {
    document.body.style.overflow = (modalOpen || contactModalOpen) ? "hidden" : "";
  }, [modalOpen, contactModalOpen]);

  // IntersectionObserver for .reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => { entries.forEach(el => { if (el.isIntersecting) el.target.classList.add("visible"); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  async function submitForm() {
    const company = fCompanyRef.current?.value.trim();
    const email   = fEmailRef.current?.value.trim();
    const engage  = fEngagementRef.current?.value;
    const hiring  = fHiringRef.current?.value;
    const details = fDetailsRef.current?.value.trim();

    if (!company) { alert("Please enter your company name."); return; }
    if (!email)   { alert("Please enter your email."); return; }
    if (!engage)  { alert("Please select an engagement type."); return; }
    if (!hiring)  { alert("Please select what you are hiring for."); return; }

    setSubmitBtnText("Sending...");
    setSubmitDisabled(true);

    try {
      await fetch("https://script.google.com/macros/s/AKfycbwncve2RO5-9DgYkeBbRpCDf0IELsQmagx_IdRq5Att7lsnvZ12hpiCfnjq8IUhikWA/exec", {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: company, email, engagementType: engage, hiringFor: hiring, details }),
      });
      setSubmitBtnText("✓ Submitted Successfully");
      setSubmitBtnStyle({ background: "#10B981" });
      setTimeout(() => {
        setModalOpen(false);
        setSubmitBtnText("Submit Requirement →");
        setSubmitBtnStyle({});
        setSubmitDisabled(false);
        if (fCompanyRef.current) fCompanyRef.current.value = "";
        if (fEmailRef.current) fEmailRef.current.value = "";
        if (fEngagementRef.current) fEngagementRef.current.value = "";
        if (fHiringRef.current) fHiringRef.current.value = "";
        if (fDetailsRef.current) fDetailsRef.current.value = "";
      }, 2000);
    } catch {
      setSubmitBtnText("Error — Try Again");
      setSubmitBtnStyle({ background: "#D97706" });
      setSubmitDisabled(false);
    }
  }

  async function submitContact() {
    const name    = cNameRef.current?.value.trim();
    const company = cCompanyRef.current?.value.trim();
    const email   = cEmailRef.current?.value.trim();
    const phone   = cPhoneRef.current?.value.trim();
    const domain  = cDomainRef.current?.value;
    const message = cMessageRef.current?.value.trim();

    if (!name)    { alert("Please enter your name."); return; }
    if (!email)   { alert("Please enter your email."); return; }
    if (!message) { alert("Please enter a message."); return; }

    setContactBtnText("Sending...");
    setContactDisabled(true);

    try {
      await fetch("https://script.google.com/macros/s/AKfycbwncve2RO5-9DgYkeBbRpCDf0IELsQmagx_IdRq5Att7lsnvZ12hpiCfnjq8IUhikWA/exec", {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, email, phone, domain, message }),
      });
      setContactBtnText("✓ Message Sent!");
      setContactBtnStyle({ background: "#10B981" });
      setTimeout(() => {
        setContactModalOpen(false);
        setContactBtnText("Send Message →");
        setContactBtnStyle({});
        setContactDisabled(false);
        ["cNameRef","cCompanyRef","cEmailRef","cPhoneRef","cMessageRef"].forEach(r => {
          const ref = { cNameRef, cCompanyRef, cEmailRef, cPhoneRef, cMessageRef }[r];
          if (ref?.current) ref.current.value = "";
        });
        if (cDomainRef.current) cDomainRef.current.value = "";
      }, 2000);
    } catch {
      setContactBtnText("Send Message →");
      setContactBtnStyle({});
      setContactDisabled(false);
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      {/* ── MODAL ── */}
      <div
        className={`modal-overlay${modalOpen ? " open" : ""}`}
        id="modalOverlay"
        onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
      >
        <div className="modal-box" style={{ padding: "24px", width: "480px", maxWidth: "480px", overflow: "hidden" }}>
          <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "4px", textAlign: "center" }}>Submit a Requirement</h3>

          <div className="form-group" style={{ marginBottom: "8px" }}>
            <label className="form-label">Company Name</label>
            <input ref={fCompanyRef} id="f-company" className="form-input" type="text" placeholder="Acme Corp" style={{ padding: "7px 12px", fontSize: ".82rem" }} />
          </div>

          <div className="form-group" style={{ marginBottom: "8px" }}>
            <label className="form-label">Company Email</label>
            <input ref={fEmailRef} id="f-email" className="form-input" type="email" placeholder="you@company.com" style={{ padding: "7px 12px", fontSize: ".82rem" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "8px" }}>
            <div className="form-group" style={{ marginBottom: "0" }}>
              <label className="form-label">Engagement Type</label>
              <select ref={fEngagementRef} id="f-engagement" className="form-select" style={{ padding: "7px 10px", fontSize: ".78rem", width: "100%" }}>
                <option value="">Select type</option>
                <option>Direct Hire</option>
                <option>Staff Augmentation</option>
                <option>Hire Trial</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: "0" }}>
              <label className="form-label">Hiring For</label>
              <select ref={fHiringRef} id="f-hiring" className="form-select" style={{ padding: "7px 10px", fontSize: ".78rem", width: "100%" }}>
                <option value="">Select domain</option>
                <option>SAP Consultants</option>
                <option>Oracle / NetSuite</option>
                <option>Workday Consultants</option>
                <option>Salesforce Experts</option>
                <option>ServiceNow Developers</option>
                <option>Data Engineers</option>
                <option>BI &amp; Analytics</option>
                <option>Cloud Architects</option>
                <option>DevOps / SRE</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "12px" }}>
            <label className="form-label">Details</label>
            <textarea ref={fDetailsRef} id="f-details" className="form-textarea" style={{ minHeight: "68px", padding: "7px 12px", fontSize: ".82rem" }} placeholder="Platform, experience level, timeline..."></textarea>
          </div>

          <button
            id="submitBtn"
            className="form-submit"
            style={{ padding: "10px", ...submitBtnStyle }}
            onClick={submitForm}
            disabled={submitDisabled}
          >
            {submitBtnText}
          </button>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <div className={`nav-wrap${scrolled ? " scrolled" : ""}`} id="navWrap">
        <div className="nav-inner">
          <div className="nav-logo" onClick={() => scrollTo("#home")}>Red<span>Tuf</span></div>
          <nav className="nav-menu">
            <div className="nav-item" onClick={() => scrollTo("#home")}>Home</div>
            <div className="nav-item">
              Solutions
              <svg className="chev" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div className="drop">
                <div className="drop-item" onClick={() => scrollTo("#solutions")}><div className="drop-icon">🏢</div>ERP Hiring</div>
                <div className="drop-item" onClick={() => scrollTo("#solutions")}><div className="drop-icon">🤝</div>CRM Hiring</div>
                <div className="drop-item" onClick={() => scrollTo("#solutions")}><div className="drop-icon">📊</div>Data &amp; Analytics Hiring</div>
                <div className="drop-item" onClick={() => scrollTo("#solutions")}><div className="drop-icon">☁️</div>Cloud &amp; DevOps Hiring</div>
              </div>
            </div>
            <div className="nav-item" onClick={() => scrollTo("#tech")}>Technologies</div>
            <div className="nav-item">
              Company
              <svg className="chev" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div className="drop">
                <div className="drop-item" onClick={() => scrollTo("#industries")}><div className="drop-icon">🏭</div>Industries</div>
                <div className="drop-item" onClick={() => scrollTo("#process")}><div className="drop-icon">⚙️</div>How It Works</div>
                <div className="drop-item" onClick={() => scrollTo("#insights")}><div className="drop-icon">📝</div>Blog &amp; Insights</div>
              </div>
            </div>
            <div className="nav-item" onClick={() => scrollTo("#why")}>Why Redtuf</div>
            <div className="nav-item" onClick={() => setContactModalOpen(true)}>Contact Us</div>
          </nav>
          <div className="nav-cta">
            <button className="btn-nav-cta" onClick={() => setModalOpen(true)}>Hire Specialists →</button>
          </div>
          <div className="nav-hamburger" id="hamburger" onClick={() => setMobileOpen(v => !v)}>
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`} id="mobileMenu">
        <div className="mob-link" onClick={() => scrollTo("#home")}>Home</div>
        <div className="mob-link" onClick={() => scrollTo("#solutions")}>Solutions</div>
        <div className="mob-link" onClick={() => scrollTo("#tech")}>Technologies</div>
        <div className="mob-link" onClick={() => scrollTo("#industries")}>Company</div>
        <div className="mob-link" onClick={() => scrollTo("#why")}>Why Redtuf</div>
        <div className="mob-link" onClick={() => { setContactModalOpen(true); setMobileOpen(false); }}>Contact Us</div>
        <div className="mob-link" onClick={() => { setModalOpen(true); setMobileOpen(false); }} style={{ color: "var(--red)", marginTop: "8px" }}>Hire Specialists →</div>
      </div>

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-inner">
          <div className="reveal">
            <div className="hero-kicker"><span className="hero-kicker-dot"></span>India's Enterprise IT Staffing Specialist</div>
            <h1 className="hero-h">Hire Top <em>ERP, CRM</em><br />&amp; Data Specialists —<br />Fast.</h1>
            <p className="hero-sub">Pre-screened enterprise talent delivered in 48 hours. We place the specialists modern businesses run on — not keyword-matched CVs.</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Hire Specialists →</button>
              <button className="btn btn-outline">View Roles</button>
            </div>
            <div className="hero-plats">
              <div className="hero-plats-label">Platforms We Staff For</div>
              <div className="hero-plats-row">
                <span className="plat-pill">🏢 SAP S/4HANA</span>
                <span className="plat-pill">🔵 Salesforce</span>
                <span className="plat-pill">🟠 NetSuite</span>
                <span className="plat-pill">⚙️ ServiceNow</span>
                <span className="plat-pill">🔶 Oracle ERP</span>
                <span className="plat-pill">🔷 MS Dynamics</span>
                <span className="plat-pill">❄️ Snowflake</span>
                <span className="plat-pill">☁️ AWS · Azure</span>
              </div>
            </div>
          </div>
          <div className="hero-right reveal d2">
            <div className="hero-panel" style={{ position: "relative" }}>
              <div className="hero-float"><span className="hf-dot"></span> Live &amp; Filling Fast</div>
              <div className="hero-panel-top">
                <div style={{ paddingBottom: "20px" }}>
                  <div className="hero-panel-label">Open Demand</div>
                  <div className="hero-panel-title">ERP · CRM · Data · Cloud</div>
                  <div className="hero-panel-sub">Most-requested roles this quarter</div>
                </div>
                <img className="hero-panel-img" src="https://picsum.photos/seed/team/400/220" alt="Engineering team" />
              </div>
              <div className="hero-panel-body">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "6px" }}>
                  <span className="tag tag-red">🏢 ERP Consultants</span>
                  <span className="tag tag-teal">🔵 CRM Specialists</span>
                  <span className="tag tag-green">📊 Data Engineers</span>
                  <span className="tag tag-amber">☁️ Cloud Architects</span>
                </div>
                <div className="hero-stats-grid">
                  <div className="hsg-item"><div className="hsg-val">48<em>hrs</em></div><div className="hsg-lbl">Avg. shortlist time</div></div>
                  <div className="hsg-item"><div className="hsg-val">100<em>+</em></div><div className="hsg-lbl">Specialists placed</div></div>
                  <div className="hsg-item"><div className="hsg-val">4<em>+</em></div><div className="hsg-lbl">Enterprise domains</div></div>
                  <div className="hsg-item"><div className="hsg-val">0<em>%</em></div><div className="hsg-lbl">Fee unless you hire</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-wrap" aria-hidden="true">
        <div className="ticker-track">
          {[
            ["SAP S/4HANA", "Consultants"],["Salesforce","Specialists"],["ServiceNow","Developers"],
            ["Oracle ERP","Consultants"],["Snowflake","Architects"],["Databricks","Engineers"],
            ["NetSuite","Consultants"],["MS Dynamics","Specialists"],["AWS","Cloud Architects"],["Workday","Consultants"],
            ["SAP S/4HANA", "Consultants"],["Salesforce","Specialists"],["ServiceNow","Developers"],
            ["Oracle ERP","Consultants"],["Snowflake","Architects"],["Databricks","Engineers"],
            ["NetSuite","Consultants"],["MS Dynamics","Specialists"],["AWS","Cloud Architects"],["Workday","Consultants"],
          ].map(([bold, rest], i) => (
            <span className="tick-item" key={i}><span className="tick-dot"></span><strong>{bold}</strong> {rest}</span>
          ))}
        </div>
      </div>

      {/* ── TRUST BAR ── */}
      <div className="trust-bar">
        <div className="wrap">
          <div className="trust-inner">
            <div className="trust-stat reveal"><div className="trust-num">48<span style={{ fontSize: "1rem" }}>hrs</span></div><div className="trust-desc">Average shortlist delivery</div></div>
            <div className="trust-div"></div>
            <div className="trust-stat reveal d1"><div className="trust-num">100+</div><div className="trust-desc">Specialists placed</div></div>
            <div className="trust-div"></div>
            <div className="trust-stat reveal d2"><div className="trust-num">4+</div><div className="trust-desc">Enterprise domains</div></div>
            <div className="trust-div"></div>
            <div className="trust-stat reveal d3"><div className="trust-num">90<span style={{ fontSize: "1rem" }}>day</span></div><div className="trust-desc">Replacement guarantee</div></div>
            <div className="trust-div"></div>
            <div className="trust-stat reveal d4"><div className="trust-num">0%</div><div className="trust-desc">Fee unless you hire</div></div>
          </div>
        </div>
      </div>

      {/* ── WHY REDTUF ── */}
      <div className="divider"></div>
      <section className="section section-alt" id="why">
        <div className="wrap">
          <div className="why-grid">
            <div className="reveal">
              <div className="eyebrow"><span className="eyebrow-dot"></span>Why Redtuf</div>
              <h2 className="s-title">Enterprise hiring<br />done right —<br />the first time.</h2>
              <p className="s-sub" style={{ marginTop: "14px" }}>We don't just send CVs. We domain-screen every specialist, understand your platform deeply, and deliver talent that contributes from day one.</p>
              <div style={{ marginTop: "32px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Hire Specialists →</button>
                <button className="btn btn-outline">How It Works</button>
              </div>
            </div>
            <div className="why-feats reveal d2">
              <div className="why-feat">
                <div className="wf-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                <div className="wf-txt"><h4>Enterprise Domain Specialists</h4><p>Deep focus on ERP, CRM, Data and Cloud — the four enterprise domains where specialist talent is scarcest and most critical.</p></div>
              </div>
              <div className="why-feat">
                <div className="wf-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
                <div className="wf-txt"><h4>Rapid 48hr Shortlist</h4><p>Pre-built talent pipelines across SAP, Salesforce, Snowflake and Cloud mean you get a quality shortlist within 48 to 72 hours.</p></div>
              </div>
              <div className="why-feat">
                <div className="wf-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
                <div className="wf-txt"><h4>Domain Screening Built In</h4><p>Every candidate is assessed on their actual platform knowledge before you see them. No keyword matching, no noise, no wasted interviews.</p></div>
              </div>
              <div className="why-feat">
                <div className="wf-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
                <div className="wf-txt"><h4>Scales With Your Needs</h4><p>One urgent SAP hire or a full Salesforce implementation team — our model scales to your timeline without compromising quality.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLUTIONS ── */}
      <div className="divider"></div>
      <section className="section" id="solutions">
        <div className="wrap">
          <div className="tc reveal">
            <div className="eyebrow"><span className="eyebrow-dot"></span>Solutions</div>
            <h2 className="s-title">Hiring built for<br />enterprise platforms</h2>
            <p className="s-sub c" style={{ marginTop: "14px" }}>Four specialised hiring tracks — each built around a critical enterprise domain.</p>
          </div>
          <div className="solutions-grid">
            <div className="sol-card prim reveal d1">
              <div className="sol-ico prim"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
              <h3>ERP Hiring</h3>
              <p>SAP, Oracle, NetSuite, Dynamics and Workday specialists — functional consultants, technical leads and architects for enterprise ERP programmes.</p>
              <div className="sol-tags"><span className="tag tag-red">SAP S/4HANA</span><span className="tag tag-red">Oracle ERP</span><span className="tag tag-red">NetSuite</span><span className="tag tag-red">Workday</span></div>
              <div style={{ marginTop: "22px" }}><button className="btn btn-primary" onClick={() => setModalOpen(true)} style={{ fontSize: ".82rem", padding: "9px 18px" }}>Hire ERP Specialists →</button></div>
            </div>
            <div className="sol-card sec reveal d2">
              <div className="sol-ico sec"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <h3>CRM Hiring</h3>
              <p>Salesforce, ServiceNow, HubSpot and SAP C4C experts — admins, developers, architects and implementation leads for CRM transformation projects.</p>
              <div className="sol-tags"><span className="tag tag-teal">Salesforce</span><span className="tag tag-teal">ServiceNow</span><span className="tag tag-teal">HubSpot</span><span className="tag tag-teal">SAP C4C</span></div>
              <div style={{ marginTop: "22px" }}><button className="btn" style={{ background: "var(--teal)", color: "white", padding: "9px 18px", fontSize: ".82rem", borderRadius: "var(--r-sm)", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-b)", fontWeight: "600", boxShadow: "0 4px 14px rgba(8,145,178,.28)", transition: "all .2s" }} onClick={() => setModalOpen(true)}>Hire CRM Specialists →</button></div>
            </div>
            <div className="sol-card prim reveal d3">
              <div className="sol-ico prim"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg></div>
              <h3>Data &amp; Analytics Hiring</h3>
              <p>Snowflake, Databricks, Power BI and Tableau specialists — data engineers, analysts and architects building pipelines and dashboards enterprises rely on.</p>
              <div className="sol-tags"><span className="tag tag-red">Snowflake</span><span className="tag tag-red">Databricks</span><span className="tag tag-red">Power BI</span><span className="tag tag-red">Tableau</span></div>
              <div style={{ marginTop: "22px" }}><button className="btn btn-primary" onClick={() => setModalOpen(true)} style={{ fontSize: ".82rem", padding: "9px 18px" }}>Hire Data Specialists →</button></div>
            </div>
            <div className="sol-card sec reveal d4">
              <div className="sol-ico sec"><svg viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg></div>
              <h3>Cloud &amp; DevOps Hiring</h3>
              <p>AWS, Azure and GCP engineers and DevOps specialists — cloud architects, platform engineers and SREs keeping enterprise infrastructure scalable and resilient.</p>
              <div className="sol-tags"><span className="tag tag-teal">AWS</span><span className="tag tag-teal">Azure</span><span className="tag tag-teal">Kubernetes</span><span className="tag tag-teal">Terraform</span></div>
              <div style={{ marginTop: "22px" }}><button className="btn" style={{ background: "var(--teal)", color: "white", padding: "9px 18px", fontSize: ".82rem", borderRadius: "var(--r-sm)", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-b)", fontWeight: "600", boxShadow: "0 4px 14px rgba(8,145,178,.28)", transition: "all .2s" }} onClick={() => setModalOpen(true)}>Hire Cloud Engineers →</button></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STAFFING TYPES ── */}
      <div className="divider"></div>
      <section className="section section-alt" id="staffing-types">
        <div className="wrap">
          <div className="reveal">
            <div className="eyebrow"><span className="eyebrow-dot"></span>Engagement Models</div>
            <h2 className="s-title">Every way to hire,<br />covered.</h2>
            <p className="s-sub" style={{ marginTop: "14px" }}>Whether you need a permanent specialist, a project contractor, or a trial before committing — we match the right model to your need.</p>
          </div>
          <div style={{ marginTop: "52px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px" }} id="engage-grid">
            <div className="staff-card reveal d1" style={{ display: "flex", flexDirection: "column", minHeight: "360px" }}>
              <div className="staff-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <div className="staff-badge">Full-time / Permanent</div>
              <h3 style={{ marginTop: "12px", marginBottom: "12px" }}>Direct Hire</h3>
              <p style={{ flex: "1" }}>Hire enterprise specialists permanently. Pay only on successful hire. No upfront commitment.</p>
              <ul className="staff-pros" style={{ marginTop: "20px" }}>
                <li>No upfront fee — pay on hire only</li>
                <li>Full domain assessment included</li>
                <li>90-day replacement guarantee</li>
                <li>ERP · CRM · Data · Cloud</li>
              </ul>
            </div>
            <div className="staff-card reveal d2" style={{ display: "flex", flexDirection: "column", minHeight: "360px" }}>
              <div className="staff-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
              <div className="staff-badge">Contract / Fixed-term</div>
              <h3 style={{ marginTop: "12px", marginBottom: "12px" }}>Staff Augmentation</h3>
              <p style={{ flex: "1" }}>Deploy specialists for SAP migrations or Salesforce implementations. Fast, flexible, fully managed.</p>
              <ul className="staff-pros" style={{ marginTop: "20px" }}>
                <li>1 to 24 month engagements</li>
                <li>Live in days — fast mobilisation</li>
                <li>Payroll and compliance handled</li>
                <li>Scale up or down anytime</li>
              </ul>
            </div>
            <div className="staff-card reveal d3" style={{ display: "flex", flexDirection: "column", minHeight: "360px" }}>
              <div className="staff-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg></div>
              <div className="staff-badge">Contract-to-Hire</div>
              <h3 style={{ marginTop: "12px", marginBottom: "12px" }}>Hire Trial</h3>
              <p style={{ flex: "1" }}>Start on contract, evaluate on real work, convert to full-time when confident. Zero long-term risk.</p>
              <ul className="staff-pros" style={{ marginTop: "20px" }}>
                <li>3 to 6 month trial periods</li>
                <li>Low conversion fee</li>
                <li>No long-term obligation</li>
                <li>Proven fit before commitment</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROLES ── */}
      <div className="divider"></div>
      <section className="section" id="roles">
        <div className="wrap">
          <div className="reveal">
            <div className="eyebrow"><span className="eyebrow-dot"></span>Roles We Hire</div>
            <h2 className="s-title">The specialists enterprise<br />companies need most</h2>
            <p className="s-sub" style={{ marginTop: "14px" }}>Specialist roles that are hardest to source — and most critical to get right.</p>
          </div>
          <div className="roles-grid">
            <div className="role-card reveal d1"><div className="role-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div><h4>SAP Consultants</h4><p className="role-desc">S/4HANA functional and technical consultants for ERP transformations and rollouts.</p><div className="role-badge">↑ High Demand</div></div>
            <div className="role-card reveal d2"><div className="role-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg></div><h4>Oracle &amp; NetSuite</h4><p className="role-desc">Oracle ERP Cloud and NetSuite consultants for finance, supply chain and operations.</p><div className="role-badge">Enterprise Grade</div></div>
            <div className="role-card reveal d3"><div className="role-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><h4>Workday Consultants</h4><p className="role-desc">HCM, Financials and Payroll specialists for Workday implementations and support.</p><div className="role-badge">Always Hiring</div></div>
            <div className="role-card reveal d4"><div className="role-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div><h4>Salesforce Experts</h4><p className="role-desc">Admins, Developers, Architects, CPQ and Service Cloud — full Salesforce ecosystem.</p><div className="role-badge">Top Placed Role</div></div>
            <div className="role-card reveal d1"><div className="role-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><h4>ServiceNow Developers</h4><p className="role-desc">ITSM, HRSD and CSM platform developers for enterprise service management.</p><div className="role-badge">↑ Trending Now</div></div>
            <div className="role-card reveal d2"><div className="role-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg></div><h4>Data Engineers</h4><p className="role-desc">Snowflake, Databricks and Kafka — building pipelines and platforms that power decisions.</p><div className="role-badge">Growing Fast</div></div>
            <div className="role-card reveal d3"><div className="role-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div><h4>BI &amp; Analytics</h4><p className="role-desc">Power BI, Tableau and Looker specialists turning enterprise data into clear decisions.</p><div className="role-badge">High Demand</div></div>
            <div className="role-card reveal d4"><div className="role-icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg></div><h4>Cloud Architects</h4><p className="role-desc">AWS, Azure and GCP architects designing and managing enterprise cloud infrastructure.</p><div className="role-badge">Critical Roles</div></div>
          </div>
        </div>
      </section>

      {/* ── TECHNOLOGIES ── */}
      <div className="divider"></div>
      <section className="section section-alt" id="tech">
        <div className="wrap">
          <div className="tc reveal">
            <div className="eyebrow teal"><span className="eyebrow-dot"></span>Technologies</div>
            <h2 className="s-title">Enterprise platforms<br />we specialise in.</h2>
            <p className="s-sub c" style={{ marginTop: "14px" }}>From ERP and CRM to Data and Cloud — pre-screened talent across the enterprise platforms your business runs on.</p>
          </div>
          <div className="tech-grid" style={{ marginTop: "52px" }}>
            <div className="tech-cat reveal d1">
              <div className="tech-cat-label">ERP</div>
              <ul className="tech-list"><li>SAP S/4HANA</li><li>Oracle ERP Cloud</li><li>NetSuite</li><li>MS Dynamics 365</li><li>Workday</li></ul>
            </div>
            <div className="tech-cat teal reveal d2">
              <div className="tech-cat-label">CRM</div>
              <ul className="tech-list"><li>Salesforce</li><li>ServiceNow</li><li>HubSpot</li><li>SAP C4C</li><li>Zendesk</li></ul>
            </div>
            <div className="tech-cat reveal d3">
              <div className="tech-cat-label">Data &amp; Analytics</div>
              <ul className="tech-list"><li>Snowflake</li><li>Databricks</li><li>Power BI</li><li>Tableau</li><li>Apache Kafka</li></ul>
            </div>
            <div className="tech-cat teal reveal d4">
              <div className="tech-cat-label">Cloud &amp; DevOps</div>
              <ul className="tech-list"><li>AWS</li><li>Microsoft Azure</li><li>Google Cloud Platform</li><li>Kubernetes</li><li>Terraform</li></ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <div className="divider"></div>
      <section className="section" id="process">
        <div className="wrap">
          <div className="hiw-grid">
            <div className="hiw-left reveal">
              <div className="hiw-left-head">
                <div className="eyebrow"><span className="eyebrow-dot"></span>How It Works</div>
                <h2 className="s-title">From requirement<br />to hire in days —<br />not months.</h2>
                <p className="s-sub" style={{ marginTop: "14px" }}>A lean, technically-driven process built to move fast without cutting corners. Share your role today — shortlist in 48 hrs.</p>
              </div>
              <div className="hiw-metrics">
                <div className="hiw-metric"><div className="hiw-metric-val">48hrs</div><div className="hiw-metric-lbl">Avg. shortlist delivery</div></div>
                <div className="hiw-metric"><div className="hiw-metric-val">100+</div><div className="hiw-metric-lbl">Engineers placed</div></div>
                <div className="hiw-metric"><div className="hiw-metric-val">0%</div><div className="hiw-metric-lbl">Fee unless you hire</div></div>
                <div className="hiw-metric"><div className="hiw-metric-val">90d</div><div className="hiw-metric-lbl">Replacement guarantee</div></div>
              </div>
              <div className="hiw-proof">
                <div className="hiw-proof-ico"><svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                <div className="hiw-proof-text"><h5>No cure, no pay — always.</h5><p>We only invoice when you make a successful hire. Zero retainer, zero risk to explore our talent bench for any role.</p></div>
              </div>
              <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Submit a Requirement →</button>
                <button className="btn btn-outline">View Sample Profiles</button>
              </div>
            </div>
            <div className="process-list reveal d2">
              <div className="proc-step"><div className="step-n">01</div><div className="step-body"><h4>Share Your Requirement</h4><p>Tell us the role, tech stack, experience level and timeline. Takes under 2 minutes via form or a quick call.</p><div className="step-tag"><span className="tag tag-gray">Free · No commitment</span></div></div></div>
              <div className="proc-step"><div className="step-n">02</div><div className="step-body"><h4>We Source &amp; Screen</h4><p>We tap our pre-built talent pool and run a domain-specific technical assessment on every candidate before shortlisting.</p><div className="step-tag"><span className="tag tag-teal">Technical screening included</span></div></div></div>
              <div className="proc-step"><div className="step-n">03</div><div className="step-body"><h4>Shortlist Delivered in 48hrs</h4><p>3–5 fully pre-vetted profiles with assessment summaries delivered within 48–72 hours. No noise, no filler CVs.</p><div className="step-tag"><span className="tag tag-green">48–72hr guarantee</span></div></div></div>
              <div className="proc-step"><div className="step-n">04</div><div className="step-body"><h4>You Interview &amp; Hire</h4><p>Direct interviews, offer management and onboarding support included. Pay only when you make a successful hire.</p><div className="step-tag"><span className="tag tag-amber">Zero fee unless you hire</span></div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROI ── */}
      <div className="divider"></div>
      <section className="section section-alt" id="roi">
        <div className="wrap">
          <div className="tc reveal">
            <div className="eyebrow"><span className="eyebrow-dot"></span>ROI &amp; Profitability</div>
            <h2 className="s-title">Why companies profit<br />by partnering with Redtuf</h2>
            <p className="s-sub c" style={{ marginTop: "14px" }}>Traditional hiring is slow, expensive, and risky. See how Redtuf compares across every dimension that affects your bottom line.</p>
          </div>
          <div className="roi-grid">
            <div className="roi-vs reveal d1">
              <div className="roi-row header">
                <div className="roi-cell">What You're Comparing</div>
                <div className="roi-cell">With Redtuf</div>
                <div className="roi-cell">Without Redtuf</div>
              </div>
              {[
                ["Time to shortlist","✓ 48–72 hours","✗ 4–8 weeks"],
                ["Upfront fee","✓ Zero","✗ Retainer required"],
                ["Technical screening","✓ Included, domain-specific","✗ You screen yourself"],
                ["Risk if wrong hire","✓ 90-day guarantee","✗ Full cost absorbed"],
                ["Niche tech coverage","✓ SAP, Salesforce, Snowflake, AWS+","✗ Limited / generalist"],
                ["Hiring team bandwidth","✓ Saved — we handle it","✗ Internal HR time consumed"],
                ["Scale-up ability","✓ 1 to 50+ in one ask","✗ Bottleneck at HR capacity"],
                ["Avg. bad hire cost saved","✓ Up to ₹8–12L per role","✗ Fully at company risk"],
              ].map(([label, yes, no], i) => (
                <div className="roi-row reveal" key={i}>
                  <div className="roi-cell">{label}</div>
                  <div className="roi-cell"><span className="roi-yes">{yes}</span></div>
                  <div className="roi-cell"><span className="roi-no">{no}</span></div>
                </div>
              ))}
            </div>
            <div className="roi-right reveal d2">
              {[
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
                  title: "Time-to-Productivity Slashed",
                  desc: "Every week a role is unfilled costs you in delayed ERP go-lives, CRM projects and missed targets. We cut hiring time from months to days.",
                  val: "Save 4–6 weeks per hire"
                },
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                  title: "No Wasted Interview Cycles",
                  desc: "Every profile is domain-assessed before you see them. Your team spends 80% less time on interviews that go nowhere — that is time back in your projects.",
                  val: "80% fewer failed interviews"
                },
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
                  title: "Lower Cost Per Hire",
                  desc: "No retainers. No ads. No job board subscriptions. You pay a single success fee only when you hire — making your recruitment ROI measurable and predictable.",
                  val: "Up to 40% lower CPH"
                },
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
                  title: "90-Day Guarantee = Zero Risk",
                  desc: "If a placed specialist does not work out within 90 days, we replace them at no additional cost. Your hiring investment is fully protected.",
                  val: "Full 90-day replacement coverage"
                }
              ].map((c, i) => (
                <div className="roi-card" key={i}>
                  <div className="roi-card-ico">{c.icon}</div>
                  <div><h4>{c.title}</h4><p>{c.desc}</p><div className="roi-card-val">{c.val}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <div className="divider"></div>
      <section className="section" id="industries">
        <div className="wrap">
          <div className="tc reveal">
            <div className="eyebrow"><span className="eyebrow-dot"></span>Industries</div>
            <h2 className="s-title">Sectors we know deeply</h2>
            <p className="s-sub c" style={{ marginTop: "14px" }}>We don't just know the roles — we understand the businesses hiring for them. That makes every placement sharper.</p>
          </div>
          <div className="ind-grid">
            <div className="card reveal d1" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.2rem", marginBottom: "16px" }}>🏢</div>
              <h4 style={{ fontSize: "1rem", marginBottom: "10px" }}>Large Enterprises</h4>
              <p style={{ fontSize: ".84rem", color: "var(--muted)", lineHeight: "1.65" }}>SAP, Oracle and Workday talent for global enterprises running complex ERP programmes across finance, HR and supply chain.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center", marginTop: "14px" }}><span className="tag tag-red">SAP</span><span className="tag tag-red">Oracle</span><span className="tag tag-red">Workday</span></div>
            </div>
            <div className="card reveal d2" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.2rem", marginBottom: "16px" }}>🤝</div>
              <h4 style={{ fontSize: "1rem", marginBottom: "10px" }}>Mid-Market Companies</h4>
              <p style={{ fontSize: ".84rem", color: "var(--muted)", lineHeight: "1.65" }}>Salesforce, ServiceNow and NetSuite specialists for growing mid-market businesses transforming their CRM and operations.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center", marginTop: "14px" }}><span className="tag tag-teal">Salesforce</span><span className="tag tag-teal">ServiceNow</span><span className="tag tag-teal">NetSuite</span></div>
            </div>
            <div className="card reveal d3" style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2.2rem", marginBottom: "16px" }}>☁️</div>
              <h4 style={{ fontSize: "1rem", marginBottom: "10px" }}>Cloud-First Businesses</h4>
              <p style={{ fontSize: ".84rem", color: "var(--muted)", lineHeight: "1.65" }}>AWS, Azure and data platform talent for businesses modernising infrastructure and building analytics capabilities at scale.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center", marginTop: "14px" }}><span className="tag tag-red">AWS</span><span className="tag tag-red">Snowflake</span><span className="tag tag-red">Databricks</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INSIGHTS / BLOG ── */}
      <div className="divider"></div>
      <section className="section section-alt" id="insights">
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }} className="reveal">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot"></span>Insights</div>
              <h2 className="s-title">Hiring intelligence<br />for tech leaders</h2>
            </div>
            <button className="btn btn-outline" style={{ flexShrink: "0" }}>View All Articles →</button>
          </div>
          <div className="blog-grid">
            <div className="blog-card reveal d1">
              <div className="blog-thumb"><img src="https://picsum.photos/seed/ai/600/178" alt="AI Hiring" /></div>
              <div className="blog-body">
                <div className="blog-meta"><span className="tag tag-red" style={{ padding: "3px 9px", fontSize: ".68rem" }}>Hiring Guide</span><span className="blog-meta-dot"></span><span>5 min read</span></div>
                <h3>How to Hire AI Engineers Who Actually Build</h3>
                <p>Most AI Engineer CVs look the same. Here's how to screen for engineers who can ship real ML products into production.</p>
                <div className="blog-read">Read Guide <span>→</span></div>
              </div>
            </div>
            <div className="blog-card reveal d2">
              <div className="blog-thumb"><img src="/image/blog2.jpg" alt="Cloud Talent" /></div>
              <div className="blog-body">
                <div className="blog-meta"><span className="tag tag-teal" style={{ padding: "3px 9px", fontSize: ".68rem" }}>Blog</span><span className="blog-meta-dot"></span><span>4 min read</span></div>
                <h3>The Cloud Engineer Shortage Is Real — Here's What to Do</h3>
                <p>AWS and Azure-certified engineers are in short supply globally. We break down why and how to compete for the best talent.</p>
                <div className="blog-read">Read Blog <span>→</span></div>
              </div>
            </div>
            <div className="blog-card reveal d3">
              <div className="blog-thumb"><img src="/image/blog3.jpg" /></div>
              <div className="blog-body">
                <div className="blog-meta"><span className="tag tag-red" style={{ padding: "3px 9px", fontSize: ".68rem" }}>Hiring Guide</span><span className="blog-meta-dot"></span><span>6 min read</span></div>
                <h3>Why MuleSoft &amp; Boomi Engineers Are the Hardest Hire in IT</h3>
                <p>iPaaS talent is critically scarce. Here's what makes integration engineers rare, and how Redtuf fills these roles fast.</p>
                <div className="blog-read">Read Guide <span>→</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner" id="contact">
        <div className="wrap-xs">
          <h2>Ready to hire engineers<br />who actually build?</h2>
          <p>Submit your requirement and get a pre-screened shortlist in 48–72 hours. No retainer, no risk — fee only on successful hire.</p>
          <div className="cta-btns">
            <button className="btn btn-white" onClick={() => setModalOpen(true)}>Submit a Requirement →</button>
            <a href="mailto:hello@redtuf.com" className="btn btn-ghost-white">hello@redtuf.com</a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <div className="f-brand-name">Red<span>Tuf</span></div>
              <div className="f-desc">India's enterprise IT staffing specialist — placing ERP, CRM, Data and Cloud professionals for businesses worldwide.</div>
              <div className="f-contact">
                <div><a href="mailto:hello@redtuf.com">hello@redtuf.com</a></div>
                <div>+91 97778 88500</div>
                <div>321, DLF Cybercity, Bhubaneswar, India – 751024</div>
              </div>
            </div>
            <div className="f-col"><h5>Solutions</h5><ul>
              <li><a href="#solutions">ERP Hiring</a></li>
              <li><a href="#solutions">CRM Hiring</a></li>
              <li><a href="#solutions">Cloud &amp; DevOps Hiring</a></li>
            </ul></div>
            <div className="f-col"><h5>Roles</h5><ul>
              <li><a href="#roles">SAP Consultants</a></li>
              <li><a href="#roles">Salesforce Experts</a></li>
              <li><a href="#roles">Data Engineers</a></li>
            </ul></div>
            <div className="f-col"><h5>Engage</h5><ul>
              <li><a href="#staffing-types">Direct Hire</a></li>
              <li><a href="#staffing-types">Staff Augmentation</a></li>
              <li><a href="#staffing-types">Hire Trial</a></li>
            </ul></div>
            <div className="f-col"><h5>Company</h5><ul>
              <li><a href="#why">Why Redtuf</a></li>
              <li><a href="#process">How It Works</a></li>
              <li><a href="#insights">Blog</a></li>
            </ul></div>
          </div>
          <div className="footer-bottom">
            <div>© 2025 Redtuf Technologies Pvt. Ltd. All rights reserved.</div>
            <div className="f-bottom-links"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div>
          </div>
        </div>
      </footer>

      {/* ── STICKY CTA ── */}
      <button className="sticky-cta" onClick={() => setModalOpen(true)}>⚡ Hire Specialists</button>

      {/* ── CONTACT MODAL ── */}
      <div
        id="contactModalOverlay"
        style={{
          position: "fixed", inset: "0", zIndex: "2000", background: "rgba(13,17,23,.6)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
          opacity: contactModalOpen ? "1" : "0",
          visibility: contactModalOpen ? "visible" : "hidden",
          transition: "opacity .25s ease,visibility .25s ease"
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setContactModalOpen(false); }}
      >
        <div
          id="contactModalBox"
          style={{
            background: "white", borderRadius: "20px", width: "100%", maxWidth: "520px",
            maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 32px 80px rgba(0,0,0,.2)",
            transform: contactModalOpen ? "scale(1) translateY(0)" : "scale(.96) translateY(16px)",
            transition: "transform .28s ease"
          }}
        >
          <div style={{ background: "#CC3322", padding: "28px 32px 24px", borderRadius: "20px 20px 0 0", position: "relative" }}>
            <button
              onClick={() => setContactModalOpen(false)}
              style={{ position: "absolute", top: "14px", right: "16px", width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,.2)", border: "none", cursor: "pointer", color: "white", fontSize: "1rem", lineHeight: "1", display: "flex", alignItems: "center", justifyContent: "center" }}
            >✕</button>
            <h2 style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontSize: "1.4rem", fontWeight: "800", color: "white", marginBottom: "4px", letterSpacing: "-.02em" }}>Get in Touch</h2>
            <p style={{ fontSize: ".82rem", color: "rgba(255,255,255,.75)" }}>Tell us what you need — we'll respond within 24 hours.</p>
            <div style={{ display: "flex", gap: "16px", marginTop: "14px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: ".75rem", color: "rgba(255,255,255,.9)", fontWeight: "600" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }}></span>No upfront fee</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: ".75rem", color: "rgba(255,255,255,.9)", fontWeight: "600" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }}></span>48hr shortlist</div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: ".75rem", color: "rgba(255,255,255,.9)", fontWeight: "600" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }}></span>90-day guarantee</div>
            </div>
          </div>
          <div style={{ padding: "28px 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: ".7rem", fontWeight: "700", color: "#6B7280", letterSpacing: ".07em", textTransform: "uppercase" }}>Your Name</label>
                <input ref={cNameRef} id="c-name" type="text" placeholder="John Smith" style={{ padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: ".875rem", outline: "none", fontFamily: "'Instrument Sans',sans-serif", width: "100%", transition: "border-color .2s,box-shadow .2s" }} onFocus={e => { e.target.style.borderColor="#CC3322"; e.target.style.boxShadow="0 0 0 3px rgba(204,51,34,.1)"; }} onBlur={e => { e.target.style.borderColor="#E5E7EB"; e.target.style.boxShadow="none"; }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: ".7rem", fontWeight: "700", color: "#6B7280", letterSpacing: ".07em", textTransform: "uppercase" }}>Company</label>
                <input ref={cCompanyRef} id="c-company" type="text" placeholder="Acme Corp" style={{ padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: ".875rem", outline: "none", fontFamily: "'Instrument Sans',sans-serif", width: "100%", transition: "border-color .2s,box-shadow .2s" }} onFocus={e => { e.target.style.borderColor="#CC3322"; e.target.style.boxShadow="0 0 0 3px rgba(204,51,34,.1)"; }} onBlur={e => { e.target.style.borderColor="#E5E7EB"; e.target.style.boxShadow="none"; }} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: ".7rem", fontWeight: "700", color: "#6B7280", letterSpacing: ".07em", textTransform: "uppercase" }}>Work Email</label>
                <input ref={cEmailRef} id="c-email" type="email" placeholder="you@company.com" style={{ padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: ".875rem", outline: "none", fontFamily: "'Instrument Sans',sans-serif", width: "100%", transition: "border-color .2s,box-shadow .2s" }} onFocus={e => { e.target.style.borderColor="#CC3322"; e.target.style.boxShadow="0 0 0 3px rgba(204,51,34,.1)"; }} onBlur={e => { e.target.style.borderColor="#E5E7EB"; e.target.style.boxShadow="none"; }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: ".7rem", fontWeight: "700", color: "#6B7280", letterSpacing: ".07em", textTransform: "uppercase" }}>Phone</label>
                <input ref={cPhoneRef} id="c-phone" type="tel" placeholder="+91 98765 43210" style={{ padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: ".875rem", outline: "none", fontFamily: "'Instrument Sans',sans-serif", width: "100%", transition: "border-color .2s,box-shadow .2s" }} onFocus={e => { e.target.style.borderColor="#CC3322"; e.target.style.boxShadow="0 0 0 3px rgba(204,51,34,.1)"; }} onBlur={e => { e.target.style.borderColor="#E5E7EB"; e.target.style.boxShadow="none"; }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "12px" }}>
              <label style={{ fontSize: ".7rem", fontWeight: "700", color: "#6B7280", letterSpacing: ".07em", textTransform: "uppercase" }}>What are you hiring for?</label>
              <select ref={cDomainRef} id="c-domain" style={{ padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: ".875rem", outline: "none", fontFamily: "'Instrument Sans',sans-serif", width: "100%", appearance: "none", backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22%3E%3Cpath d=%22M2 4l4 4 4-4%22 stroke=%22%236B7280%22 stroke-width=%221.5%22 fill=%22none%22 stroke-linecap=%22round%22/%3E%3C/svg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", backgroundColor: "white", transition: "border-color .2s" }} onFocus={e => e.target.style.borderColor="#CC3322"} onBlur={e => e.target.style.borderColor="#E5E7EB"}>
                <option value="">Select a domain</option>
                <option>SAP Consultants</option>
                <option>Salesforce Experts</option>
                <option>Oracle / NetSuite</option>
                <option>Workday Consultants</option>
                <option>ServiceNow Developers</option>
                <option>Data Engineers</option>
                <option>BI &amp; Analytics</option>
                <option>Cloud Architects</option>
                <option>DevOps / SRE</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "16px" }}>
              <label style={{ fontSize: ".7rem", fontWeight: "700", color: "#6B7280", letterSpacing: ".07em", textTransform: "uppercase" }}>Message</label>
              <textarea ref={cMessageRef} id="c-message" placeholder="Tell us about the role — platform, experience level, timeline, location..." rows="4" style={{ padding: "10px 14px", borderRadius: "8px", border: "1.5px solid #E5E7EB", fontSize: ".875rem", outline: "none", fontFamily: "'Instrument Sans',sans-serif", width: "100%", resize: "vertical", transition: "border-color .2s,box-shadow .2s" }} onFocus={e => { e.target.style.borderColor="#CC3322"; e.target.style.boxShadow="0 0 0 3px rgba(204,51,34,.1)"; }} onBlur={e => { e.target.style.borderColor="#E5E7EB"; e.target.style.boxShadow="none"; }}></textarea>
            </div>
            <button
              id="contactSubmitBtn"
              onClick={submitContact}
              disabled={contactDisabled}
              style={{ width: "100%", padding: "13px", background: "#CC3322", color: "white", border: "none", borderRadius: "10px", fontFamily: "'Instrument Sans',sans-serif", fontWeight: "700", fontSize: ".92rem", cursor: "pointer", transition: "background .2s,transform .15s", ...contactBtnStyle }}
            >{contactBtnText}</button>
            <p style={{ textAlign: "center", fontSize: ".75rem", color: "#9CA3AF", marginTop: "12px" }}>Trusted by enterprises across India &amp; globally · <span style={{ color: "#CC3322", fontWeight: "600" }}>0% fee</span> unless you hire</p>
          </div>
        </div>
      </div>
    </>
  );
}
