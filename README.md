# `@arron21` // Animated D3.js GitHub Repository Observatory

An interactive, multi-mode animated **D3.js v7** visualization of **Arron McCrory's (`https://github.com/arron21`)** 115 public repositories spanning 2012–2026.

## ✦ Five Animated D3.js Views

1. **Force Constellation (`d3.forceSimulation`)**
   - Central `@arron21` core node orbiting with dynamic cluster hubs (**6 Creative Domains** or **12 Primary Languages**), curved Bézier links, and animated signal pulses flowing along repository branches.
2. **Chronological Beeswarm & Swimlanes (2013–2026)**
   - Force-directed temporal layout positioning every repository by creation date across thematic or language swimlanes, with dashed longevity arcs connecting repositories maintained across multiple years.
3. **Hierarchical Circle Packing (`d3.pack`)**
   - Nested zoomable circle-packing hierarchy (`@arron21` → Cluster → Repository). Click any cluster ring for smooth camera zoom transitions.
4. **Radial Sunburst Wheel (`d3.partition` + `d3.arc`)**
   - Multi-ring radial partition wheel with animated arc interpolation and angled peripheral labels.
5. **Swiss International Treemap (`d3.treemapSquarify`)**
   - Codebase footprint matrix inspired by `arron21/raster-css`.

## 🎨 Color Systems & Controls

- **Sanzo Wada Pigments**: Inspired by `arron21/dictionary-of-color-combinations`
- **GitHub Linguist Official**: Official language hex colors (`TypeScript`, `JavaScript`, `HTML`, `CSS`, `Vue`, `Astro`, `Svelte`, etc.)
- **Swiss International Neon**: High-contrast editorial palette inspired by `arron21/raster-css`
- **2013 → 2026 Timeline Streamgraph & Playback Scrubber**: Click **▶ Replay 2013→2026** or scrub across the bottom D3 streamgraph to watch Arron's repository history unfold year by year.
- **Live GitHub API Sync**: Click **↻ Live API Sync** in the top bar to fetch live updates directly from `https://api.github.com/users/arron21/repos`.

## 🚀 Running Locally

- Open [`index.html`](file:///c:/Users/arron/Documents/antigravity/valiant-volta/index.html) or [`dist/arron21-github-d3-standalone.html`](file:///c:/Users/arron/Documents/antigravity/valiant-volta/dist/arron21-github-d3-standalone.html) directly in any browser (works offline via `file://`), or
- Run `npm start` and visit `http://localhost:8080`.
