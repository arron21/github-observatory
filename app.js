// ============================================================================
// arron21 // Animated D3.js GitHub Repository Observatory
// Built with D3.js v7
// ============================================================================

(function () {
  'use strict';

  const rawData = window.ARRON21_GITHUB_DATA;
  if (!rawData || !rawData.repos) {
    console.error('GitHub dataset not loaded.');
    return;
  }

  // --------------------------------------------------------------------------
  // 1. Curated Color Palettes (Sanzo Wada, GitHub Linguist, Swiss Neon)
  // --------------------------------------------------------------------------
  const PALETTES = {
    wada: {
      // Inspired by arron21/dictionary-of-color-combinations (Sanzo Wada)
      domain: {
        'Sites, Static Web & Deno/Lume': '#2B72B8',     // Cerulean Cobalt
        'Design Systems, CSS & Color': '#E94E35',       // Vermilion Red
        'Angular & Frontend Architecture': '#9A51B6',   // Mauve Purple
        'Games & Interactive Engines': '#E8A829',       // Gamboge Gold
        'Web Apps, AI & Utilities': '#1E9E73',          // Viridian Green
        'Photography, Media & Creative': '#E85D88',     // Carmine Rose
      },
      language: {
        TypeScript: '#2B72B8',
        JavaScript: '#E8A829',
        HTML: '#E94E35',
        CSS: '#9A51B6',
        Other: '#7C8B99',
        SCSS: '#E85D88',
        Astro: '#FF6B35',
        Vue: '#1E9E73',
        Svelte: '#D9381E',
        Nunjucks: '#4EA8DE',
        Liquid: '#38BDF8',
        LilyPond: '#84CC16',
      },
    },
    github: {
      domain: {
        'Sites, Static Web & Deno/Lume': '#38bdf8',
        'Design Systems, CSS & Color': '#c6538c',
        'Angular & Frontend Architecture': '#dd0031',
        'Games & Interactive Engines': '#f1e05a',
        'Web Apps, AI & Utilities': '#41b883',
        'Photography, Media & Creative': '#ff5a03',
      },
      language: {
        TypeScript: '#3178c6',
        JavaScript: '#f1e05a',
        HTML: '#e34c26',
        CSS: '#563d7c',
        Other: '#8b949e',
        SCSS: '#c6538c',
        Astro: '#ff5a03',
        Vue: '#41b883',
        Svelte: '#ff3e00',
        Nunjucks: '#3d8137',
        Liquid: '#67b8de',
        LilyPond: '#9ccc65',
      },
    },
    swiss: {
      // Inspired by arron21/raster-css (International Typographic / Swiss Grid)
      domain: {
        'Sites, Static Web & Deno/Lume': '#00F0FF',
        'Design Systems, CSS & Color': '#FF2A00',
        'Angular & Frontend Architecture': '#B829FF',
        'Games & Interactive Engines': '#FFD600',
        'Web Apps, AI & Utilities': '#00E676',
        'Photography, Media & Creative': '#FF007A',
      },
      language: {
        TypeScript: '#00F0FF',
        JavaScript: '#FFD600',
        HTML: '#FF2A00',
        CSS: '#B829FF',
        Other: '#94A3B8',
        SCSS: '#FF007A',
        Astro: '#FF6D00',
        Vue: '#00E676',
        Svelte: '#FF3D00',
        Nunjucks: '#1DE9B6',
        Liquid: '#00B0FF',
        LilyPond: '#C6FF00',
      },
    },
  };

  const ERA_NOTES = {
    2013: {
      title: '2013 ERA // Early Web Typography',
      desc: 'First public repositories on GitHub — responsive headline experiments with slabText.',
    },
    2014: {
      title: '2014 ERA // First Original CSS Frameworks',
      desc: 'Created Waterfall ("a fluid CSS framework") and Airframe v1 utility grid system.',
    },
    2015: {
      title: '2015 ERA // Frontend Foundations',
      desc: 'Building client architectures and refining responsive CSS layout systems.',
    },
    2016: {
      title: '2016 ERA // WordPress & Responsive UI',
      desc: 'Released wordpress-snappy-theme and Envoy responsive CSS engineering showcase.',
    },
    2017: {
      title: '2017 ERA // React, Shopify Liquid & Angular 2+',
      desc: '10 repos including firstReactApp, reactCards, Shopify Liquid themes, and Angular2-Toaster.',
    },
    2018: {
      title: '2018 ERA // TypeScript Apps, Hugo & LilyPond',
      desc: 'Built RunTracker in TypeScript, Fat-Shadows CSS, Hugo sites, and LilyPond sheet music.',
    },
    2019: {
      title: '2019 ERA // Gatsby, OneCSS & Scully',
      desc: '11 repos exploring Gatsby SSR, Material Design OneCSS, Angular Scully, and Greece Cat Adoption.',
    },
    2020: {
      title: '2020 ERA // Microfrontends, 11ty & Themeable CSS',
      desc: '19 repos! Single-SPA Angular Microfrontends, Eleventy sites, Perfect-Nav, and Themeable-CSS.',
    },
    2021: {
      title: '2021 ERA // Canvas Generative Art & Feature Flags',
      desc: 'Sakura Canvas animations, Guess-Components UI generator, Airframe 2, and Simple Feature Flags.',
    },
    2022: {
      title: '2022 ERA // Arron.dev & Atomic CSS Sprinkles',
      desc: 'Launched arron.dev, Koso design system, and CSS-Sprinkles.',
    },
    2023: {
      title: '2023 ERA // Architecture Refinements',
      desc: 'Continued evolution of Perfect-Nav, CSS-Sprinkles, Scully, and 11ty client platforms.',
    },
    2024: {
      title: '2024 ERA // Vue Photo Filters, Next.js & Fresh',
      desc: 'Launched Online Photo Filters (Vue), Photography-EZ, Crypto-Vote, Orange-CSS, and Fresh.',
    },
    2025: {
      title: '2025 ERA // Deno Lume Ecosystem, Web Components & Pantheon',
      desc: '21 repos! Deep dive into Lume & Lume-CMS, Web Components, Cost-Genie, Angular SRP, and Pantheon.',
    },
    2026: {
      title: '2026 ERA // WebGPU RPGs, Diablo Engines & Sanzo Wada Color',
      desc: '21+ repos! Sanzo Wada Color Archive, Raster-CSS, Eos WebGPU LLM RPG, 4 Diablo ARPG engines & Air-Swarm.',
    },
  };

  // --------------------------------------------------------------------------
  // 2. Application State
  // --------------------------------------------------------------------------
  const state = {
    repos: rawData.repos.map((d) => ({ ...d })),
    user: rawData.user,
    view: 'constellation', // 'constellation' | 'timeline' | 'pack' | 'sunburst' | 'treemap'
    groupBy: 'domain',      // 'domain' | 'language'
    sizeBy: 'perceptual',   // 'perceptual' | 'recency' | 'uniform'
    palette: 'wada',        // 'wada' | 'github' | 'swiss'
    includeForks: true,
    liveOnly: false,
    selectedCluster: null,
    searchQuery: '',
    maxYear: 2026,
    isPlaying: false,
    playTimer: null,
    selectedRepo: null,
  };

  state.selectedRepo =
    state.repos.find((r) => r.name === 'dictionary-of-color-combinations') || state.repos[0];

  // --------------------------------------------------------------------------
  // 3. DOM & SVG References
  // --------------------------------------------------------------------------
  const stageContainer = document.getElementById('stage-container');
  const svg = d3.select('#d3-stage');
  const tooltip = d3.select('#d3-tooltip');
  const miniSvg = d3.select('#timeline-mini-svg');

  // Create root zoomable group and dedicated layers inside #d3-stage
  const zoomRoot = svg.append('g').attr('class', 'zoom-root');
  const bgGuidesLayer = zoomRoot.append('g').attr('class', 'layer-guides');
  const linksLayer = zoomRoot.append('g').attr('class', 'layer-links');
  const particlesLayer = zoomRoot.append('g').attr('class', 'layer-particles');
  const hubsLayer = zoomRoot.append('g').attr('class', 'layer-hubs');
  const nodesLayer = zoomRoot.append('g').attr('class', 'layer-nodes');
  const labelsLayer = zoomRoot.append('g').attr('class', 'layer-labels');

  let width = stageContainer.clientWidth || 1200;
  let height = stageContainer.clientHeight || 700;
  let currentSimulation = null;
  let linkParticleTimer = null;

  // Setup D3 Zoom behavior
  const zoomBehavior = d3
    .zoom()
    .scaleExtent([0.28, 6])
    .on('zoom', (event) => {
      zoomRoot.attr('transform', event.transform);
    });

  svg.call(zoomBehavior);

  function resetCamera(duration = 650) {
    svg
      .transition()
      .duration(duration)
      .ease(d3.easeCubicOut)
      .call(zoomBehavior.transform, d3.zoomIdentity);
  }

  // --------------------------------------------------------------------------
  // 4. Helper Functions (Colors, Radii, Filtering)
  // --------------------------------------------------------------------------
  function getClusterKey(repo) {
    return state.groupBy === 'domain' ? repo.domain : repo.language;
  }

  function getColor(key) {
    const map = PALETTES[state.palette][state.groupBy];
    if (map && map[key]) return map[key];
    // Fallback deterministic color
    const fallback = Object.values(PALETTES[state.palette].language);
    let hash = 0;
    for (let i = 0; i < String(key).length; i++) {
      hash = String(key).charCodeAt(i) + ((hash << 5) - hash);
    }
    return fallback[Math.abs(hash) % fallback.length];
  }

  function getRepoColor(repo) {
    return getColor(getClusterKey(repo));
  }

  function getNodeRadius(repo) {
    if (state.sizeBy === 'uniform') return 8.5;
    if (state.sizeBy === 'recency') {
      const yearSpan = Math.max(0, repo.pushed_year - 2012);
      const liveBonus = repo.has_live_url ? 3.5 : 0;
      return 5.5 + yearSpan * 0.75 + liveBonus;
    }
    // Perceptual codebase footprint (handles 0 KB up to 571,000 KB gracefully)
    const kb = Math.max(4, repo.size || 4);
    return Math.max(5.5, Math.min(26, 3.2 + Math.log10(kb) * 3.8));
  }

  function getHierarchyValue(repo) {
    if (state.sizeBy === 'uniform') return 10;
    if (state.sizeBy === 'recency') {
      return Math.pow(Math.max(1, repo.pushed_year - 2011), 1.8) + (repo.has_live_url ? 25 : 0);
    }
    // Perceptual power scale so 571MB photography repo doesn't swallow 100KB code repos
    return Math.max(12, Math.pow(Math.max(8, repo.size || 8), 0.42));
  }

  function getFilteredRepos() {
    const q = state.searchQuery.trim().toLowerCase();
    return state.repos.filter((r) => {
      if (!state.includeForks && r.fork) return false;
      if (state.liveOnly && !r.has_live_url) return false;
      if (r.created_year > state.maxYear) return false;
      if (state.selectedCluster && getClusterKey(r) !== state.selectedCluster) return false;
      if (q) {
        const hay = `${r.name} ${r.summary} ${r.language} ${r.domain}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function formatKB(kb) {
    if (!kb || kb === 0) return '< 1 KB';
    if (kb >= 1024 * 1024) return (kb / (1024 * 1024)).toFixed(2) + ' GB';
    if (kb >= 1024) return (kb / 1024).toFixed(1) + ' MB';
    return kb.toLocaleString() + ' KB';
  }

  // --------------------------------------------------------------------------
  // 5. Tooltip & Inspector Drawer Updates
  // --------------------------------------------------------------------------
  function showTooltip(event, htmlContent) {
    tooltip.html(htmlContent).classed('visible', true);
    moveTooltip(event);
  }

  function moveTooltip(event) {
    const pad = 16;
    const ttNode = tooltip.node();
    const ttW = ttNode ? ttNode.offsetWidth : 260;
    const ttH = ttNode ? ttNode.offsetHeight : 110;
    let x = event.clientX + pad;
    let y = event.clientY + pad;
    if (x + ttW > window.innerWidth - 12) x = event.clientX - ttW - pad;
    if (y + ttH > window.innerHeight - 12) y = event.clientY - ttH - pad;
    tooltip.style('left', `${x}px`).style('top', `${y}px`);
  }

  function hideTooltip() {
    tooltip.classed('visible', false);
  }

  function repoTooltipHTML(r) {
    const color = getRepoColor(r);
    return `
      <div class="tt-header">
        <span style="color:${color}">● ${r.name}</span>
        <span class="badge-mono">${r.language}</span>
      </div>
      <div class="tt-desc">${r.summary}</div>
      <div class="tt-meta">
        <span>Created: ${r.created_at.slice(0, 10)}</span>
        <span>•</span>
        <span>Size: ${formatKB(r.size)}</span>
        ${r.has_live_url ? '<span style="color:#38bdf8">• Live Demo ↗</span>' : ''}
        ${r.fork ? '<span style="color:#f59e0b">• Fork</span>' : ''}
      </div>
    `;
  }

  function updateInspector(repo) {
    if (!repo) return;
    state.selectedRepo = repo;
    const drawer = document.getElementById('inspector-drawer');
    drawer.classList.remove('collapsed');

    const typeBadge = document.getElementById('insp-type-badge');
    typeBadge.textContent = repo.fork ? 'FORKED REPOSITORY' : 'ORIGINAL REPOSITORY';
    typeBadge.style.color = repo.fork ? '#f59e0b' : 'var(--accent-primary)';

    document.getElementById('insp-name').textContent = repo.name;
    document.getElementById('insp-desc').textContent = repo.summary;
    document.getElementById('insp-created').textContent = repo.created_at.slice(0, 10);
    document.getElementById('insp-pushed').textContent = repo.pushed_at.slice(0, 10);
    document.getElementById('insp-size').textContent = formatKB(repo.size);
    document.getElementById('insp-stars').textContent = `★ ${repo.stargazers_count}   ⑂ ${repo.forks_count}`;

    // Badges
    const badgesEl = document.getElementById('insp-badges');
    const langColor = PALETTES[state.palette].language[repo.language] || '#38bdf8';
    const domColor = PALETTES[state.palette].domain[repo.domain] || '#ff5a36';
    badgesEl.innerHTML = `
      <span class="tag-badge"><span style="color:${langColor}">●</span> ${repo.language}</span>
      <span class="tag-badge"><span style="color:${domColor}">◆</span> ${repo.domain}</span>
      ${repo.has_live_url ? '<span class="tag-badge" style="color:#10b981;border-color:rgba(16,185,129,0.35)">● Live Deployment</span>' : ''}
    `;

    // Action links
    const linksEl = document.getElementById('insp-links');
    linksEl.innerHTML = `
      <a class="btn-action primary" href="${repo.html_url}" target="_blank" rel="noopener">
        View on GitHub ↗
      </a>
      ${
        repo.has_live_url
          ? `<a class="btn-action secondary" href="${repo.homepage}" target="_blank" rel="noopener">
              Launch Live Site ↗
            </a>`
          : ''
      }
    `;

    // Related repos in same cluster
    const clusterKey = getClusterKey(repo);
    document.getElementById('insp-related-title').textContent = `More in ${clusterKey}`;
    const siblings = state.repos
      .filter((r) => r.name !== repo.name && getClusterKey(r) === clusterKey)
      .slice(0, 6);

    const relList = document.getElementById('insp-related-list');
    relList.innerHTML = '';
    siblings.forEach((sib) => {
      const row = document.createElement('div');
      row.className = 'related-item';
      row.innerHTML = `
        <span style="font-weight:600;color:${getRepoColor(sib)}">${sib.name}</span>
        <span class="badge-mono" style="font-size:10px">${sib.created_year}</span>
      `;
      row.addEventListener('click', () => {
        updateInspector(sib);
        highlightSelectedRepoNode();
      });
      relList.appendChild(row);
    });

    highlightSelectedRepoNode();
  }

  function highlightSelectedRepoNode() {
    nodesLayer
      .selectAll('.repo-node')
      .attr('stroke-width', (d) => {
        const repo = d.data || d;
        return state.selectedRepo && repo.name === state.selectedRepo.name ? 3 : 1.2;
      })
      .attr('stroke', (d) => {
        const repo = d.data || d;
        if (state.selectedRepo && repo.name === state.selectedRepo.name) return '#ffffff';
        return repo.has_live_url ? '#38bdf8' : 'rgba(255,255,255,0.28)';
      });
  }

  // --------------------------------------------------------------------------
  // 6. Telemetry KPI & Interactive Legend Updates
  // --------------------------------------------------------------------------
  function updateTelemetryAndLegend(filtered) {
    const origCount = filtered.filter((r) => !r.fork).length;
    const forkCount = filtered.filter((r) => r.fork).length;
    const langs = new Set(filtered.map((r) => r.language));
    const demos = filtered.filter((r) => r.has_live_url).length;
    const totalKB = filtered.reduce((acc, r) => acc + (r.size || 0), 0);

    document.getElementById('kpi-repos').textContent = filtered.length;
    document.getElementById('kpi-sources').textContent = `${origCount} / ${forkCount}`;
    document.getElementById('kpi-langs').textContent = langs.size;
    document.getElementById('kpi-demos').textContent = demos;
    document.getElementById('kpi-size').textContent = formatKB(totalKB);

    // Build Legend Counts from all repos matching year/fork/search (ignoring selectedCluster so user can switch clusters)
    const q = state.searchQuery.trim().toLowerCase();
    const baseRepos = state.repos.filter((r) => {
      if (!state.includeForks && r.fork) return false;
      if (state.liveOnly && !r.has_live_url) return false;
      if (r.created_year > state.maxYear) return false;
      if (q && !`${r.name} ${r.summary} ${r.language} ${r.domain}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });

    const counts = d3.rollup(
      baseRepos,
      (v) => v.length,
      (d) => getClusterKey(d)
    );

    const sortedGroups = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);

    document.getElementById('legend-title').textContent =
      state.groupBy === 'domain' ? 'Creative Domains' : 'Primary Languages';

    const resetBtn = document.getElementById('legend-reset');
    resetBtn.classList.toggle('visible', Boolean(state.selectedCluster));

    const listEl = document.getElementById('legend-list');
    listEl.innerHTML = '';

    sortedGroups.forEach(([groupName, count]) => {
      const color = getColor(groupName);
      const item = document.createElement('div');
      const isSelected = state.selectedCluster === groupName;
      const isDimmed = state.selectedCluster && !isSelected;
      item.className = `legend-item ${isSelected ? 'selected' : ''} ${isDimmed ? 'dimmed' : ''}`;
      item.innerHTML = `
        <div class="legend-swatch-wrap">
          <span class="legend-swatch" style="background:${color};color:${color}"></span>
          <span class="legend-name" title="${groupName}">${groupName}</span>
        </div>
        <span class="legend-count">${count}</span>
      `;
      item.addEventListener('click', () => {
        state.selectedCluster = state.selectedCluster === groupName ? null : groupName;
        renderActiveView();
      });
      listEl.appendChild(item);
    });
  }

  // --------------------------------------------------------------------------
  // 7. VIEW 1: Force-Directed Constellation Network
  // --------------------------------------------------------------------------
  function renderConstellation(filtered) {
    document.getElementById('hud-mode-description').innerHTML =
      '<strong>Force Constellation:</strong> Central @arron21 core connected to cluster hubs & repositories. Drag any node or scroll to zoom.';

    const cx = width / 2;
    const cy = height / 2;
    const orbitRadius = Math.min(width, height) * 0.27;

    // Group repos by active cluster key
    const groups = Array.from(d3.group(filtered, (d) => getClusterKey(d)).entries());

    // Create Central Hub Node
    const coreNode = {
      id: 'CORE_ARRON21',
      type: 'core',
      label: '@arron21',
      fx: cx,
      fy: cy,
      r: 28,
    };

    // Create Cluster Hub Nodes arranged radially around core
    const hubNodes = groups.map(([groupName, repos], idx) => {
      const angle = (idx / Math.max(1, groups.length)) * Math.PI * 2 - Math.PI / 2;
      const hx = cx + Math.cos(angle) * orbitRadius;
      const hy = cy + Math.sin(angle) * orbitRadius;
      return {
        id: `HUB_${groupName}`,
        type: 'hub',
        groupName,
        count: repos.length,
        color: getColor(groupName),
        x: hx,
        y: hy,
        targetX: hx,
        targetY: hy,
        r: Math.max(14, Math.min(24, 11 + Math.sqrt(repos.length) * 2.2)),
      };
    });

    const hubMap = new Map(hubNodes.map((h) => [h.groupName, h]));

    // Create Repo Nodes
    const repoNodes = filtered.map((r, i) => {
      const hub = hubMap.get(getClusterKey(r));
      const angle = ((i % 17) / 17) * Math.PI * 2;
      return {
        ...r,
        id: `REPO_${r.name}`,
        type: 'repo',
        hubId: hub ? hub.id : coreNode.id,
        color: getRepoColor(r),
        r: getNodeRadius(r),
        x: r._lastX !== undefined ? r._lastX : (hub ? hub.x : cx) + Math.cos(angle) * 60,
        y: r._lastY !== undefined ? r._lastY : (hub ? hub.y : cy) + Math.sin(angle) * 60,
      };
    });

    const allNodes = [coreNode, ...hubNodes, ...repoNodes];

    // Links: Core -> Hubs, and Hubs -> Repos
    const coreLinks = hubNodes.map((h) => ({
      id: `LINK_CORE_${h.id}`,
      source: coreNode.id,
      target: h.id,
      kind: 'trunk',
      color: h.color,
    }));

    const repoLinks = repoNodes.map((r) => ({
      id: `LINK_HUB_${r.id}`,
      source: r.hubId,
      target: r.id,
      kind: 'branch',
      color: r.color,
    }));

    const allLinks = [...coreLinks, ...repoLinks];

    // Draw subtle orbital guide rings in bgGuidesLayer
    bgGuidesLayer.selectAll('*').remove();
    [orbitRadius, orbitRadius * 1.62].forEach((rad) => {
      bgGuidesLayer
        .append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', 0)
        .attr('fill', 'none')
        .attr('stroke', 'var(--border-subtle)')
        .attr('stroke-dasharray', '4 6')
        .transition()
        .duration(800)
        .attr('r', rad);
    });

    // Bind Links
    const linkSel = linksLayer
      .selectAll('path.constellation-link')
      .data(allLinks, (d) => d.id);

    linkSel.exit().transition().duration(300).attr('stroke-opacity', 0).remove();

    const linkEnter = linkSel
      .enter()
      .append('path')
      .attr('class', 'constellation-link')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0);

    const linkMerge = linkEnter
      .merge(linkSel)
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', (d) => (d.kind === 'trunk' ? 2.2 : 1.1))
      .attr('stroke-dasharray', (d) => (d.kind === 'trunk' ? 'none' : 'none'));

    linkMerge
      .transition()
      .duration(500)
      .attr('stroke-opacity', (d) => (d.kind === 'trunk' ? 0.55 : 0.28));

    // Bind Central Core + Cluster Hubs in hubsLayer
    const hubData = [coreNode, ...hubNodes];
    const hubSel = hubsLayer.selectAll('g.hub-group').data(hubData, (d) => d.id);
    hubSel.exit().transition().duration(300).style('opacity', 0).remove();

    const hubEnter = hubSel
      .enter()
      .append('g')
      .attr('class', 'hub-group')
      .style('cursor', 'pointer')
      .call(
        d3
          .drag()
          .on('start', (event, d) => {
            if (d.type === 'core') return;
            if (!event.active && currentSimulation) currentSimulation.alphaTarget(0.25).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            if (d.type === 'core') return;
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (d.type === 'core') return;
            if (!event.active && currentSimulation) currentSimulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Outer Halo
    hubEnter
      .append('circle')
      .attr('class', 'hub-halo')
      .attr('r', 0)
      .attr('fill', (d) => (d.type === 'core' ? 'url(#core-gradient)' : d.color))
      .attr('fill-opacity', 0.2);

    // Main Hub Circle
    hubEnter
      .append('circle')
      .attr('class', 'hub-circle')
      .attr('r', 0)
      .attr('fill', (d) => (d.type === 'core' ? '#ff5a36' : d.color))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', (d) => (d.type === 'core' ? 3 : 2));

    // Hub Label
    hubEnter
      .append('text')
      .attr('class', 'hub-label')
      .attr('text-anchor', 'middle')
      .attr('dy', (d) => (d.type === 'core' ? 4 : -d.r - 8))
      .text((d) => (d.type === 'core' ? '@arron21' : `${d.groupName} (${d.count})`));

    const hubMerge = hubEnter.merge(hubSel);
    hubMerge
      .select('.hub-halo')
      .transition()
      .duration(600)
      .attr('r', (d) => d.r * 1.65)
      .attr('fill', (d) => (d.type === 'core' ? 'url(#core-gradient)' : d.color));

    hubMerge
      .select('.hub-circle')
      .transition()
      .duration(600)
      .attr('r', (d) => d.r)
      .attr('fill', (d) => (d.type === 'core' ? '#ff5a36' : d.color));

    hubMerge
      .select('.hub-label')
      .attr('dy', (d) => (d.type === 'core' ? 4 : -d.r - 8))
      .text((d) => (d.type === 'core' ? '@arron21' : `${d.groupName} (${d.count})`));

    hubMerge.on('click', (event, d) => {
      event.stopPropagation();
      if (d.type === 'hub') {
        state.selectedCluster = state.selectedCluster === d.groupName ? null : d.groupName;
        renderActiveView();
      } else {
        state.selectedCluster = null;
        resetCamera();
        renderActiveView();
      }
    });

    // Bind Repo Nodes
    const nodeSel = nodesLayer.selectAll('circle.repo-node').data(repoNodes, (d) => d.name);
    nodeSel.exit().transition().duration(300).attr('r', 0).remove();

    const nodeEnter = nodeSel
      .enter()
      .append('circle')
      .attr('class', 'repo-node')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', 0)
      .style('cursor', 'pointer')
      .call(
        d3
          .drag()
          .on('start', (event, d) => {
            if (!event.active && currentSimulation) currentSimulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active && currentSimulation) currentSimulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    const nodeMerge = nodeEnter
      .merge(nodeSel)
      .attr('fill', (d) => d.color)
      .attr('fill-opacity', (d) => (d.fork ? 0.65 : 0.92))
      .attr('stroke-dasharray', (d) => (d.fork ? '2 2' : 'none'))
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(150)
          .attr('r', d.r * 1.35)
          .attr('filter', 'url(#glow-filter)');
        showTooltip(event, repoTooltipHTML(d));
      })
      .on('mousemove', (event) => moveTooltip(event))
      .on('mouseleave', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr('r', d.r)
          .attr('filter', null);
        hideTooltip();
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        updateInspector(d);
      });

    nodeMerge
      .transition()
      .duration(600)
      .ease(d3.easeBackOut)
      .attr('r', (d) => d.r);

    highlightSelectedRepoNode();

    // Repo Labels for notable / larger / recent repos
    const labelSel = labelsLayer
      .selectAll('text.node-label')
      .data(
        repoNodes.filter((d) => d.r >= 9.5 || d.pushed_year === 2026 || d.has_live_url),
        (d) => d.name
      );

    labelSel.exit().remove();

    const labelMerge = labelSel
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .merge(labelSel)
      .text((d) => (d.name.length > 22 ? d.name.slice(0, 20) + '…' : d.name));

    // Configure D3 Force Simulation
    if (currentSimulation) currentSimulation.stop();

    currentSimulation = d3
      .forceSimulation(allNodes)
      .force(
        'link',
        d3
          .forceLink(allLinks)
          .id((d) => d.id)
          .distance((d) => (d.kind === 'trunk' ? orbitRadius : 52))
          .strength((d) => (d.kind === 'trunk' ? 0.75 : 0.65))
      )
      .force(
        'charge',
        d3.forceManyBody().strength((d) => {
          if (d.type === 'core') return -600;
          if (d.type === 'hub') return -360;
          return -38;
        })
      )
      .force(
        'collide',
        d3
          .forceCollide()
          .radius((d) => (d.type === 'repo' ? d.r + 6 : d.r + 16))
          .iterations(2)
      )
      .force(
        'hubX',
        d3
          .forceX((d) => (d.type === 'hub' ? d.targetX : cx))
          .strength((d) => (d.type === 'hub' ? 0.45 : 0.02))
      )
      .force(
        'hubY',
        d3
          .forceY((d) => (d.type === 'hub' ? d.targetY : cy))
          .strength((d) => (d.type === 'hub' ? 0.45 : 0.02))
      )
      .alpha(0.9)
      .alphaDecay(0.022)
      .on('tick', () => {
        linkMerge.attr('d', (d) => {
          const sx = d.source.x;
          const sy = d.source.y;
          const tx = d.target.x;
          const ty = d.target.y;
          const dx = tx - sx;
          const dy = ty - sy;
          const dr = Math.sqrt(dx * dx + dy * dy) * 1.4;
          return `M${sx},${sy}A${dr},${dr} 0 0,1 ${tx},${ty}`;
        });

        hubMerge.attr('transform', (d) => `translate(${d.x},${d.y})`);

        nodeMerge
          .attr('cx', (d) => {
            d._lastX = d.x;
            return d.x;
          })
          .attr('cy', (d) => {
            d._lastY = d.y;
            return d.y;
          });

        labelMerge.attr('x', (d) => d.x).attr('y', (d) => d.y + d.r + 12);
      });

    // Animated signal pulses flowing along links
    if (linkParticleTimer) linkParticleTimer.stop();
    const activePulses = [];
    linkParticleTimer = d3.timer(() => {
      if (state.view !== 'constellation') return;
      if (activePulses.length < 18 && Math.random() < 0.35 && repoLinks.length > 0) {
        const randomLink = repoLinks[Math.floor(Math.random() * repoLinks.length)];
        if (randomLink.source && randomLink.target && randomLink.source.x !== undefined) {
          activePulses.push({
            link: randomLink,
            t: 0,
            speed: 0.014 + Math.random() * 0.018,
            color: randomLink.color,
          });
        }
      }
      for (let i = activePulses.length - 1; i >= 0; i--) {
        activePulses[i].t += activePulses[i].speed;
        if (activePulses[i].t >= 1) activePulses.splice(i, 1);
      }

      const pSel = particlesLayer.selectAll('circle.signal-pulse').data(activePulses);
      pSel.exit().remove();
      pSel
        .enter()
        .append('circle')
        .attr('class', 'signal-pulse')
        .attr('r', 2.4)
        .attr('pointer-events', 'none')
        .merge(pSel)
        .attr('fill', (d) => d.color)
        .attr('cx', (d) => d.link.source.x + (d.link.target.x - d.link.source.x) * d.t)
        .attr('cy', (d) => d.link.source.y + (d.link.target.y - d.link.source.y) * d.t)
        .attr('opacity', (d) => Math.sin(d.t * Math.PI));
    });
  }

  // --------------------------------------------------------------------------
  // 8. VIEW 2: Chronological Beeswarm & Swimlane Timeline (2013 - 2026)
  // --------------------------------------------------------------------------
  function renderTimeline(filtered) {
    document.getElementById('hud-mode-description').innerHTML =
      '<strong>Chronological Beeswarm (2013–2026):</strong> Repositories positioned by creation date across swimlanes. Arcs show multi-year maintenance spans.';

    if (currentSimulation) currentSimulation.stop();
    if (linkParticleTimer) linkParticleTimer.stop();
    particlesLayer.selectAll('*').remove();
    hubsLayer.selectAll('*').remove();
    linksLayer.selectAll('*').remove();
    bgGuidesLayer.selectAll('*').remove();

    const margin = { top: 68, right: 60, bottom: 55, left: 265 };
    const plotW = Math.max(400, width - margin.left - margin.right);
    const plotH = Math.max(300, height - margin.top - margin.bottom);

    const xScale = d3
      .scaleTime()
      .domain([new Date('2013-01-01T00:00:00Z'), new Date('2026-11-30T00:00:00Z')])
      .range([margin.left, margin.left + plotW]);

    const groups = Array.from(d3.group(filtered, (d) => getClusterKey(d)).keys());
    const yScale = d3
      .scaleBand()
      .domain(groups)
      .range([margin.top, margin.top + plotH])
      .padding(0.25);

    // Draw Swimlanes & Era Guides
    groups.forEach((gName) => {
      const yCenter = yScale(gName) + yScale.bandwidth() / 2;
      const color = getColor(gName);

      bgGuidesLayer
        .append('line')
        .attr('x1', margin.left)
        .attr('x2', margin.left + plotW)
        .attr('y1', yCenter)
        .attr('y2', yCenter)
        .attr('stroke', color)
        .attr('stroke-opacity', 0.22)
        .attr('stroke-dasharray', '3 5');

      bgGuidesLayer
        .append('text')
        .attr('x', margin.left - 12)
        .attr('y', yCenter + 4)
        .attr('text-anchor', 'end')
        .attr('fill', color)
        .style('font-family', 'var(--font-mono)')
        .style('font-size', '11px')
        .style('font-weight', '600')
        .text(gName.length > 26 ? gName.slice(0, 24) + '…' : gName);
    });

    // X-Axis Time Ticks
    const xAxis = d3.axisBottom(xScale).ticks(d3.timeYear.every(1)).tickFormat(d3.timeFormat('%Y'));
    bgGuidesLayer
      .append('g')
      .attr('class', 'axis-line')
      .attr('transform', `translate(0, ${margin.top + plotH + 8})`)
      .call(xAxis);

    // Vertical Year Gridlines
    const years = d3.range(2013, 2027);
    years.forEach((yr) => {
      const xPos = xScale(new Date(`${yr}-01-01T00:00:00Z`));
      bgGuidesLayer
        .append('line')
        .attr('x1', xPos)
        .attr('x2', xPos)
        .attr('y1', margin.top - 16)
        .attr('y2', margin.top + plotH + 8)
        .attr('stroke', 'var(--border-subtle)')
        .attr('stroke-opacity', 0.5);
    });

    // Prepare nodes with targetX / targetY
    const simNodes = filtered.map((r) => {
      const tx = xScale(new Date(r.created_at));
      const pushedX = xScale(new Date(r.pushed_at));
      const ty = (yScale(getClusterKey(r)) || margin.top) + yScale.bandwidth() / 2;
      return {
        ...r,
        targetX: tx,
        pushedX,
        targetY: ty,
        color: getRepoColor(r),
        r: getNodeRadius(r),
        x: r._lastX !== undefined ? r._lastX : tx,
        y: r._lastY !== undefined ? r._lastY : ty,
      };
    });

    // Draw maintenance longevity arcs for repos pushed > 180 days after creation
    const longevityRepos = simNodes.filter((d) => d.active_span_days > 180);
    linksLayer
      .selectAll('path.longevity-arc')
      .data(longevityRepos, (d) => d.name)
      .join('path')
      .attr('class', 'longevity-arc')
      .attr('fill', 'none')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 1.3)
      .attr('stroke-opacity', 0.35)
      .attr('stroke-dasharray', '3 3')
      .attr('d', (d) => {
        const dx = d.pushedX - d.targetX;
        const dr = Math.max(20, Math.abs(dx) * 0.65);
        return `M${d.targetX},${d.targetY}A${dr},${dr} 0 0,1 ${d.pushedX},${d.targetY}`;
      });

    // Bind Repo Circles
    const nodeSel = nodesLayer.selectAll('circle.repo-node').data(simNodes, (d) => d.name);
    nodeSel.exit().transition().duration(300).attr('r', 0).remove();

    const nodeMerge = nodeSel
      .enter()
      .append('circle')
      .attr('class', 'repo-node')
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y)
      .attr('r', 0)
      .style('cursor', 'pointer')
      .merge(nodeSel)
      .attr('fill', (d) => d.color)
      .attr('fill-opacity', 0.9)
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget).transition().duration(120).attr('r', d.r * 1.35);
        showTooltip(event, repoTooltipHTML(d));
      })
      .on('mousemove', (event) => moveTooltip(event))
      .on('mouseleave', (event, d) => {
        d3.select(event.currentTarget).transition().duration(150).attr('r', d.r);
        hideTooltip();
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        updateInspector(d);
      });

    nodeMerge.transition().duration(500).attr('r', (d) => d.r);
    highlightSelectedRepoNode();

    // Labels for larger repos
    const labelSel = labelsLayer
      .selectAll('text.node-label')
      .data(simNodes.filter((d) => d.r >= 10.5 || d.has_live_url), (d) => d.name);
    labelSel.exit().remove();
    const labelMerge = labelSel
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .merge(labelSel)
      .text((d) => (d.name.length > 18 ? d.name.slice(0, 16) + '…' : d.name));

    currentSimulation = d3
      .forceSimulation(simNodes)
      .force('x', d3.forceX((d) => d.targetX).strength(0.85))
      .force('y', d3.forceY((d) => d.targetY).strength(0.65))
      .force('collide', d3.forceCollide((d) => d.r + 2.5).iterations(3))
      .alpha(0.85)
      .alphaDecay(0.03)
      .on('tick', () => {
        nodeMerge
          .attr('cx', (d) => {
            d._lastX = d.x;
            return d.x;
          })
          .attr('cy', (d) => {
            d._lastY = d.y;
            return d.y;
          });
        labelMerge.attr('x', (d) => d.x).attr('y', (d) => d.y - d.r - 4);
      });
  }

  // --------------------------------------------------------------------------
  // 9. VIEW 3: Zoomable Hierarchical Circle Packing
  // --------------------------------------------------------------------------
  function renderCirclePack(filtered) {
    document.getElementById('hud-mode-description').innerHTML =
      '<strong>Hierarchical Circle Packing:</strong> Click any outer cluster ring to zoom in, or click a repository circle to inspect.';

    if (currentSimulation) currentSimulation.stop();
    if (linkParticleTimer) linkParticleTimer.stop();
    particlesLayer.selectAll('*').remove();
    linksLayer.selectAll('*').remove();
    bgGuidesLayer.selectAll('*').remove();

    const grouped = d3.group(filtered, (d) => getClusterKey(d));
    const hierarchyData = {
      name: '@arron21',
      children: Array.from(grouped, ([groupName, repos]) => ({
        name: groupName,
        children: repos,
      })),
    };

    const packSize = Math.min(width, height) - 40;
    const root = d3
      .hierarchy(hierarchyData)
      .sum((d) => (d.name && d.created_at ? getHierarchyValue(d) : 0))
      .sort((a, b) => b.value - a.value);

    d3.pack().size([packSize, packSize]).padding(6)(root);

    const offsetX = (width - packSize) / 2;
    const offsetY = (height - packSize) / 2;

    // Group circles (depth 1) in hubsLayer
    const clusterNodes = root.descendants().filter((d) => d.depth === 1);
    const hubSel = hubsLayer.selectAll('g.pack-cluster').data(clusterNodes, (d) => d.data.name);
    hubSel.exit().transition().duration(300).style('opacity', 0).remove();

    const hubEnter = hubSel
      .enter()
      .append('g')
      .attr('class', 'pack-cluster')
      .style('cursor', 'pointer');

    hubEnter.append('circle').attr('class', 'pack-cluster-circle').attr('r', 0);
    hubEnter.append('text').attr('class', 'hub-label').attr('text-anchor', 'middle');

    const hubMerge = hubEnter.merge(hubSel);
    hubMerge
      .transition()
      .duration(650)
      .ease(d3.easeCubicOut)
      .attr('transform', (d) => `translate(${d.x + offsetX},${d.y + offsetY})`);

    hubMerge
      .select('circle.pack-cluster-circle')
      .transition()
      .duration(650)
      .attr('r', (d) => d.r)
      .attr('fill', (d) => getColor(d.data.name))
      .attr('fill-opacity', 0.11)
      .attr('stroke', (d) => getColor(d.data.name))
      .attr('stroke-width', 1.8)
      .attr('stroke-dasharray', '4 3');

    hubMerge
      .select('text.hub-label')
      .attr('y', (d) => -d.r + 16)
      .attr('fill', (d) => getColor(d.data.name))
      .text((d) => `${d.data.name} (${d.children ? d.children.length : 0})`);

    hubMerge.on('click', (event, d) => {
      event.stopPropagation();
      const scale = Math.min(4, Math.min(width, height) / (d.r * 2.4));
      const tx = width / 2 - (d.x + offsetX) * scale;
      const ty = height / 2 - (d.y + offsetY) * scale;
      svg
        .transition()
        .duration(750)
        .ease(d3.easeCubicInOut)
        .call(zoomBehavior.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    });

    // Leaf repo circles (depth 2) in nodesLayer
    const leafNodes = root.leaves();
    const nodeSel = nodesLayer.selectAll('circle.repo-node').data(leafNodes, (d) => d.data.name);
    nodeSel.exit().transition().duration(300).attr('r', 0).remove();

    const nodeMerge = nodeSel
      .enter()
      .append('circle')
      .attr('class', 'repo-node')
      .attr('cx', (d) => (d.data._lastX !== undefined ? d.data._lastX : d.x + offsetX))
      .attr('cy', (d) => (d.data._lastY !== undefined ? d.data._lastY : d.y + offsetY))
      .attr('r', 0)
      .style('cursor', 'pointer')
      .merge(nodeSel)
      .attr('fill', (d) => getRepoColor(d.data))
      .attr('fill-opacity', (d) => (d.data.fork ? 0.65 : 0.88))
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget).attr('filter', 'url(#glow-filter)');
        showTooltip(event, repoTooltipHTML(d.data));
      })
      .on('mousemove', (event) => moveTooltip(event))
      .on('mouseleave', (event) => {
        d3.select(event.currentTarget).attr('filter', null);
        hideTooltip();
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        updateInspector(d.data);
      });

    nodeMerge
      .transition()
      .duration(700)
      .ease(d3.easeCubicOut)
      .attr('cx', (d) => {
        d.data._lastX = d.x + offsetX;
        return d.x + offsetX;
      })
      .attr('cy', (d) => {
        d.data._lastY = d.y + offsetY;
        return d.y + offsetY;
      })
      .attr('r', (d) => Math.max(3, d.r));

    highlightSelectedRepoNode();

    // Labels inside sufficiently large circles
    const labelSel = labelsLayer
      .selectAll('text.node-label')
      .data(leafNodes.filter((d) => d.r >= 16), (d) => d.data.name);
    labelSel.exit().remove();

    labelSel
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .merge(labelSel)
      .transition()
      .duration(700)
      .attr('x', (d) => d.x + offsetX)
      .attr('y', (d) => d.y + offsetY + 3)
      .text((d) => {
        const maxChars = Math.max(6, Math.floor(d.r / 2.8));
        return d.data.name.length > maxChars
          ? d.data.name.slice(0, maxChars - 1) + '…'
          : d.data.name;
      });
  }

  // --------------------------------------------------------------------------
  // 10. VIEW 4: Radial Ecosystem Sunburst & Partition Wheel
  // --------------------------------------------------------------------------
  function renderSunburst(filtered) {
    document.getElementById('hud-mode-description').innerHTML =
      '<strong>Radial Sunburst Wheel:</strong> Inner ring represents Domains/Languages; outer ring represents individual repositories.';

    if (currentSimulation) currentSimulation.stop();
    if (linkParticleTimer) linkParticleTimer.stop();
    particlesLayer.selectAll('*').remove();
    linksLayer.selectAll('*').remove();
    nodesLayer.selectAll('*').remove();
    hubsLayer.selectAll('*').remove();
    labelsLayer.selectAll('*').remove();
    bgGuidesLayer.selectAll('*').remove();

    const cx = width / 2;
    const cy = height / 2;
    const outerRadius = Math.min(width, height) * 0.42;

    const grouped = d3.group(filtered, (d) => getClusterKey(d));
    const hierarchyData = {
      name: '@arron21',
      children: Array.from(grouped, ([groupName, repos]) => ({
        name: groupName,
        children: repos,
      })),
    };

    const root = d3
      .hierarchy(hierarchyData)
      .sum((d) => (d.name && d.created_at ? getHierarchyValue(d) : 0))
      .sort((a, b) => b.value - a.value);

    d3.partition().size([2 * Math.PI, outerRadius])(root);

    const arcGen = d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.006))
      .padRadius(outerRadius / 2)
      .innerRadius((d) => (d.depth === 1 ? outerRadius * 0.28 : outerRadius * 0.54))
      .outerRadius((d) => (d.depth === 1 ? outerRadius * 0.52 : outerRadius * 0.92));

    const gWheel = bgGuidesLayer
      .append('g')
      .attr('transform', `translate(${cx},${cy})`);

    // Center telemetry core
    const centerCircle = gWheel
      .append('circle')
      .attr('r', outerRadius * 0.25)
      .attr('fill', 'var(--bg-surface)')
      .attr('stroke', 'var(--border-strong)')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', () => {
        state.selectedCluster = null;
        renderActiveView();
      });

    const centerTitle = gWheel
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.3em')
      .style('font-family', 'var(--font-mono)')
      .style('font-size', '14px')
      .style('font-weight', '700')
      .attr('fill', 'var(--text-primary)')
      .text('@arron21');

    const centerSub = gWheel
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .style('font-size', '11px')
      .attr('fill', 'var(--text-secondary)')
      .text(`${filtered.length} Repositories`);

    const slices = root.descendants().filter((d) => d.depth > 0);

    const pathSel = gWheel
      .selectAll('path.sunburst-arc')
      .data(slices, (d) => (d.depth === 1 ? `GROUP_${d.data.name}` : `REPO_${d.data.name}`))
      .join('path')
      .attr('class', 'sunburst-arc')
      .attr('fill', (d) =>
        d.depth === 1 ? getColor(d.data.name) : getRepoColor(d.data)
      )
      .attr('fill-opacity', (d) => (d.depth === 1 ? 0.85 : d.data.fork ? 0.6 : 0.9))
      .attr('stroke', 'var(--bg-deep)')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget).attr('fill-opacity', 1).attr('filter', 'url(#glow-filter)');
        if (d.depth === 1) {
          centerTitle.text(d.data.name.slice(0, 18));
          centerSub.text(`${d.children ? d.children.length : 0} repos in cluster`);
        } else {
          centerTitle.text(d.data.name.slice(0, 18));
          centerSub.text(`${d.data.language} • ${d.data.created_year}`);
          showTooltip(event, repoTooltipHTML(d.data));
        }
      })
      .on('mousemove', (event) => moveTooltip(event))
      .on('mouseleave', (event, d) => {
        d3.select(event.currentTarget)
          .attr('fill-opacity', d.depth === 1 ? 0.85 : 0.9)
          .attr('filter', null);
        centerTitle.text('@arron21');
        centerSub.text(`${filtered.length} Repositories`);
        hideTooltip();
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        if (d.depth === 1) {
          state.selectedCluster = state.selectedCluster === d.data.name ? null : d.data.name;
          renderActiveView();
        } else {
          updateInspector(d.data);
        }
      });

    pathSel
      .transition()
      .duration(750)
      .ease(d3.easeCubicOut)
      .attrTween('d', function (d) {
        const i = d3.interpolate({ x0: d.x0, x1: d.x0 }, d);
        return (t) => arcGen(i(t));
      });

    // Radial Labels for outer repo slices with enough angular width
    gWheel
      .selectAll('text.radial-label')
      .data(slices.filter((d) => d.depth === 2 && d.x1 - d.x0 > 0.042))
      .join('text')
      .attr('class', 'node-label')
      .attr('transform', (d) => {
        const angle = (((d.x0 + d.x1) / 2) * 180) / Math.PI - 90;
        const flip = angle > 90 ? 180 : 0;
        const r = outerRadius * 0.945;
        return `rotate(${angle}) translate(${r},0) rotate(${flip})`;
      })
      .attr('text-anchor', (d) => {
        const angle = (((d.x0 + d.x1) / 2) * 180) / Math.PI - 90;
        return angle > 90 ? 'end' : 'start';
      })
      .attr('dy', '0.32em')
      .style('opacity', 0)
      .text((d) => (d.data.name.length > 20 ? d.data.name.slice(0, 18) + '…' : d.data.name))
      .transition()
      .delay(350)
      .duration(400)
      .style('opacity', 0.9);
  }

  // --------------------------------------------------------------------------
  // 11. VIEW 5: Swiss International Codebase Matrix (D3 Treemap)
  // --------------------------------------------------------------------------
  function renderTreemap(filtered) {
    document.getElementById('hud-mode-description').innerHTML =
      '<strong>Swiss International Treemap:</strong> Proportional codebase architecture matrix inspired by arron21/raster-css.';

    if (currentSimulation) currentSimulation.stop();
    if (linkParticleTimer) linkParticleTimer.stop();
    particlesLayer.selectAll('*').remove();
    linksLayer.selectAll('*').remove();
    nodesLayer.selectAll('*').remove();
    hubsLayer.selectAll('*').remove();
    labelsLayer.selectAll('*').remove();
    bgGuidesLayer.selectAll('*').remove();

    const margin = { top: 56, right: 28, bottom: 24, left: 275 };
    const boxW = Math.max(400, width - margin.left - margin.right);
    const boxH = Math.max(300, height - margin.top - margin.bottom);

    const grouped = d3.group(filtered, (d) => getClusterKey(d));
    const hierarchyData = {
      name: '@arron21',
      children: Array.from(grouped, ([groupName, repos]) => ({
        name: groupName,
        children: repos,
      })),
    };

    const root = d3
      .hierarchy(hierarchyData)
      .sum((d) => (d.name && d.created_at ? getHierarchyValue(d) : 0))
      .sort((a, b) => b.value - a.value);

    d3
      .treemap()
      .tile(d3.treemapSquarify)
      .size([boxW, boxH])
      .paddingOuter(4)
      .paddingTop(22)
      .paddingInner(2)
      .round(true)(root);

    const gTree = bgGuidesLayer
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Group containers (depth 1)
    const groups = root.descendants().filter((d) => d.depth === 1);
    const groupG = gTree
      .selectAll('g.treemap-group')
      .data(groups, (d) => d.data.name)
      .join('g')
      .attr('class', 'treemap-group');

    groupG
      .append('rect')
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('width', (d) => Math.max(0, d.x1 - d.x0))
      .attr('height', (d) => Math.max(0, d.y1 - d.y0))
      .attr('fill', 'var(--bg-surface)')
      .attr('stroke', (d) => getColor(d.data.name))
      .attr('stroke-width', 1.5)
      .attr('rx', 4);

    groupG
      .append('text')
      .attr('x', (d) => d.x0 + 6)
      .attr('y', (d) => d.y0 + 15)
      .attr('fill', (d) => getColor(d.data.name))
      .style('font-family', 'var(--font-mono)')
      .style('font-size', '11px')
      .style('font-weight', '700')
      .text((d) =>
        d.x1 - d.x0 > 90 ? `${d.data.name.toUpperCase()} (${d.children.length})` : ''
      );

    // Leaf cells (depth 2)
    const leaves = root.leaves();
    const cellG = gTree
      .selectAll('g.treemap-cell')
      .data(leaves, (d) => d.data.name)
      .join('g')
      .attr('class', 'treemap-cell')
      .style('cursor', 'pointer')
      .attr('transform', (d) => `translate(${d.x0},${d.y0})`)
      .on('mouseenter', (event, d) => {
        d3.select(event.currentTarget).select('rect').attr('fill-opacity', 1);
        showTooltip(event, repoTooltipHTML(d.data));
      })
      .on('mousemove', (event) => moveTooltip(event))
      .on('mouseleave', (event, d) => {
        d3.select(event.currentTarget)
          .select('rect')
          .attr('fill-opacity', d.data.fork ? 0.55 : 0.82);
        hideTooltip();
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        updateInspector(d.data);
      });

    cellG
      .append('rect')
      .attr('class', 'repo-node')
      .attr('width', 0)
      .attr('height', 0)
      .attr('rx', 3)
      .attr('fill', (d) => getRepoColor(d.data))
      .attr('fill-opacity', (d) => (d.data.fork ? 0.55 : 0.82))
      .attr('stroke', (d) =>
        state.selectedRepo && state.selectedRepo.name === d.data.name
          ? '#ffffff'
          : 'rgba(0,0,0,0.25)'
      )
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .attr('width', (d) => Math.max(0, d.x1 - d.x0))
      .attr('height', (d) => Math.max(0, d.y1 - d.y0));

    cellG
      .append('text')
      .attr('class', 'node-label')
      .attr('x', 5)
      .attr('y', 14)
      .text((d) => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w < 42 || h < 20) return '';
        const maxChars = Math.max(4, Math.floor(w / 6.8));
        return d.data.name.length > maxChars
          ? d.data.name.slice(0, maxChars - 1) + '…'
          : d.data.name;
      });

    cellG
      .append('text')
      .attr('x', 5)
      .attr('y', 27)
      .style('font-family', 'var(--font-mono)')
      .style('font-size', '9.5px')
      .attr('fill', 'rgba(255,255,255,0.75)')
      .attr('pointer-events', 'none')
      .text((d) => {
        const w = d.x1 - d.x0;
        const h = d.y1 - d.y0;
        if (w < 60 || h < 34) return '';
        return `${d.data.created_year} • ${formatKB(d.data.size)}`;
      });
  }

  // --------------------------------------------------------------------------
  // 12. Bottom Timeline Streamgraph & Scrubber (2013 - 2026)
  // --------------------------------------------------------------------------
  function renderMiniStreamgraph() {
    const svgNode = miniSvg.node();
    if (!svgNode) return;
    const w = svgNode.clientWidth || 600;
    const h = 54;
    miniSvg.selectAll('*').remove();

    const years = d3.range(2013, 2027);
    const groups = Array.from(new Set(state.repos.map((r) => getClusterKey(r))));

    // Build table of counts per year per group
    const yearRows = years.map((yr) => {
      const row = { year: yr };
      groups.forEach((g) => (row[g] = 0));
      state.repos.forEach((r) => {
        if (r.created_year === yr) {
          const k = getClusterKey(r);
          row[k] = (row[k] || 0) + 1;
        }
      });
      return row;
    });

    const stack = d3.stack().keys(groups);
    const series = stack(yearRows);

    const x = d3.scaleLinear().domain([2013, 2026]).range([12, w - 12]);
    const maxTotal = d3.max(yearRows, (row) => d3.sum(groups, (g) => row[g])) || 25;
    const y = d3.scaleLinear().domain([0, maxTotal]).range([h - 16, 4]);

    const area = d3
      .area()
      .curve(d3.curveMonotoneX)
      .x((d) => x(d.data.year))
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]));

    miniSvg
      .selectAll('path.stream-layer')
      .data(series)
      .join('path')
      .attr('class', 'stream-layer')
      .attr('d', area)
      .attr('fill', (d) => getColor(d.key))
      .attr('fill-opacity', 0.72)
      .attr('stroke', (d) => getColor(d.key))
      .attr('stroke-width', 0.6);

    // Year tick labels along bottom
    miniSvg
      .selectAll('text.yr-tick')
      .data(years)
      .join('text')
      .attr('class', 'yr-tick')
      .attr('x', (yr) => x(yr))
      .attr('y', h - 2)
      .attr('text-anchor', 'middle')
      .style('font-family', 'var(--font-mono)')
      .style('font-size', '9.5px')
      .attr('fill', (yr) => (yr <= state.maxYear ? 'var(--text-primary)' : 'var(--text-muted)'))
      .text((yr) => `'${String(yr).slice(2)}`);

    // Shaded curtain for years after state.maxYear
    const cutoffX = x(state.maxYear);
    if (state.maxYear < 2026) {
      miniSvg
        .append('rect')
        .attr('x', cutoffX)
        .attr('y', 0)
        .attr('width', Math.max(0, w - cutoffX))
        .attr('height', h - 14)
        .attr('fill', 'var(--bg-deep)')
        .attr('fill-opacity', 0.72);
    }

    // Active playhead cursor
    miniSvg
      .append('line')
      .attr('x1', cutoffX)
      .attr('x2', cutoffX)
      .attr('y1', 2)
      .attr('y2', h - 14)
      .attr('stroke', 'var(--accent-primary)')
      .attr('stroke-width', 2.5);

    miniSvg
      .append('circle')
      .attr('cx', cutoffX)
      .attr('cy', 6)
      .attr('r', 4.5)
      .attr('fill', 'var(--accent-primary)')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    // Interactive scrubbing via click or drag
    function scrubToEvent(event) {
      const [mx] = d3.pointer(event, svgNode);
      const yr = Math.round(Math.max(2013, Math.min(2026, x.invert(mx))));
      if (yr !== state.maxYear) {
        state.maxYear = yr;
        updateScrubberReadout();
        renderActiveView();
      }
    }

    miniSvg.on('mousedown', (event) => {
      stopPlayback();
      scrubToEvent(event);
      const onMove = (e) => scrubToEvent(e);
      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    });
  }

  function updateScrubberReadout() {
    const yrLabel = document.getElementById('scrubber-year-label');
    const countLabel = document.getElementById('scrubber-count-label');
    const eraEl = document.getElementById('era-caption');

    const countUpToYear = state.repos.filter((r) => r.created_year <= state.maxYear).length;
    yrLabel.textContent = state.maxYear === 2026 ? '2013 – 2026' : `2013 – ${state.maxYear}`;
    countLabel.textContent = `${countUpToYear} of ${state.repos.length} Repos`;

    const note = ERA_NOTES[state.maxYear] || ERA_NOTES[2026];
    eraEl.innerHTML = `<strong>${note.title}</strong>${note.desc}`;
  }

  function startPlayback() {
    if (state.isPlaying) {
      stopPlayback();
      return;
    }
    state.isPlaying = true;
    const btn = document.getElementById('btn-play-history');
    btn.classList.add('playing');
    document.getElementById('play-icon').textContent = '⏸';
    document.getElementById('play-label').textContent = 'Playing History...';

    if (state.maxYear >= 2026) state.maxYear = 2013;
    updateScrubberReadout();
    renderActiveView();

    state.playTimer = setInterval(() => {
      if (state.maxYear < 2026) {
        state.maxYear += 1;
        updateScrubberReadout();
        renderActiveView();
      } else {
        stopPlayback();
      }
    }, 750);
  }

  function stopPlayback() {
    state.isPlaying = false;
    if (state.playTimer) {
      clearInterval(state.playTimer);
      state.playTimer = null;
    }
    const btn = document.getElementById('btn-play-history');
    btn.classList.remove('playing');
    document.getElementById('play-icon').textContent = '▶';
    document.getElementById('play-label').textContent = 'Replay 2013→2026';
  }

  // --------------------------------------------------------------------------
  // 13. Master Render Dispatcher
  // --------------------------------------------------------------------------
  function renderActiveView() {
    width = stageContainer.clientWidth || 1200;
    height = stageContainer.clientHeight || 700;

    const filtered = getFilteredRepos();
    updateTelemetryAndLegend(filtered);
    renderMiniStreamgraph();

    if (state.view === 'constellation') {
      renderConstellation(filtered);
    } else if (state.view === 'timeline') {
      renderTimeline(filtered);
    } else if (state.view === 'pack') {
      renderCirclePack(filtered);
    } else if (state.view === 'sunburst') {
      renderSunburst(filtered);
    } else if (state.view === 'treemap') {
      renderTreemap(filtered);
    }
  }

  // --------------------------------------------------------------------------
  // 14. Ambient Background Starfield Canvas
  // --------------------------------------------------------------------------
  function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let cw = (canvas.width = stageContainer.clientWidth || 1200);
    let ch = (canvas.height = stageContainer.clientHeight || 700);

    const stars = Array.from({ length: 75 }, () => ({
      x: Math.random() * cw,
      y: Math.random() * ch,
      r: 0.6 + Math.random() * 1.4,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14,
      alpha: 0.15 + Math.random() * 0.45,
    }));

    function drawFrame() {
      ctx.clearRect(0, 0, cw, ch);
      const isLight = document.body.classList.contains('theme-light');
      ctx.fillStyle = isLight ? '#141518' : '#cbd5e1';

      for (const s of stars) {
        s.x = (s.x + s.vx + cw) % cw;
        s.y = (s.y + s.vy + ch) % ch;
        ctx.globalAlpha = isLight ? s.alpha * 0.35 : s.alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(drawFrame);
    }
    drawFrame();

    window.addEventListener('resize', () => {
      cw = canvas.width = stageContainer.clientWidth || 1200;
      ch = canvas.height = stageContainer.clientHeight || 700;
    });
  }

  // --------------------------------------------------------------------------
  // 15. Live GitHub API Sync (Auto-runs on load + manual button trigger)
  // --------------------------------------------------------------------------
  function inferDomain(repo) {
    const text = `${repo.name} ${repo.description || ''}`;
    if (/diablo|rpg|pantheon|castaways|air-swarm|air-hack-n-slash|rage-commute|third-town|screaming-mario|time-travel-battle|konami-js|game/i.test(text)) {
      return 'Games & Interactive Engines';
    }
    if (/color-combinations|raster-css|orange-css|themeable-css|airframe|waterfall|onecss|css-sprinkles|css-layouts|fat-shadows|ui-components|perfect-nav|guess-components|matter|polaris|scss-starter|design-system/i.test(text)) {
      return 'Design Systems, CSS & Color';
    }
    if (/photography|photo-filters|image-compression|canvas-background|sakura-canvas|sheet-music|christmas-music|top-movies|falling-portfolio/i.test(text)) {
      return 'Photography, Media & Creative';
    }
    if (/angular|microfrontend|scully|web-components|feature-flags|nx-arron|cr-example|firstReactApp|reactCards|azos-js|slabText/i.test(text)) {
      return 'Angular & Frontend Architecture';
    }
    if (/browser-ai-workbench|what-the-cost|cost-genie|crypto-vote|daily-work|air-table|runtracker|boxing|wodscrapper|onlinefarm|friends|greece-cat-adoption|old-towne-orange/i.test(text)) {
      return 'Web Apps, AI & Utilities';
    }
    return 'Sites, Static Web & Deno/Lume';
  }

  async function syncLiveFromGitHub() {
    const btn = document.getElementById('btn-live-sync');
    const statusEl = document.getElementById('sync-status');
    btn.textContent = '↻ Syncing API...';
    btn.disabled = true;

    try {
      const [userRes, r1, r2] = await Promise.all([
        fetch('https://api.github.com/users/arron21').then((r) => (r.ok ? r.json() : null)),
        fetch('https://api.github.com/users/arron21/repos?per_page=100&page=1&sort=updated').then((r) =>
          r.ok ? r.json() : []
        ),
        fetch('https://api.github.com/users/arron21/repos?per_page=100&page=2&sort=updated').then((r) =>
          r.ok ? r.json() : []
        ),
      ]);

      if (userRes && userRes.avatar_url) {
        state.user = userRes;
        const avatarEl = document.getElementById('user-avatar');
        if (avatarEl) avatarEl.src = userRes.avatar_url;
      }

      const combined = [...(Array.isArray(r1) ? r1 : []), ...(Array.isArray(r2) ? r2 : [])];
      if (combined.length > 0) {
        const existingMap = new Map(state.repos.map((r) => [r.name, r]));
        const wasAtLatestYear = state.maxYear >= d3.max(state.repos, (d) => d.created_year);

        state.repos = combined.map((raw) => {
          const prev = existingMap.get(raw.name) || {};
          const createdYear = new Date(raw.created_at).getUTCFullYear();
          const pushedYear = new Date(raw.pushed_at).getUTCFullYear();
          const createdTime = new Date(raw.created_at).getTime();
          const pushedTime = new Date(raw.pushed_at).getTime();
          const activeSpanDays = Math.max(1, Math.round((pushedTime - createdTime) / (1000 * 60 * 60 * 24)));

          return {
            ...prev,
            id: raw.id,
            name: raw.name,
            html_url: raw.html_url,
            description: raw.description,
            summary: raw.description || prev.summary || `${raw.language || 'Web'} repository by arron21.`,
            fork: raw.fork,
            created_at: raw.created_at,
            updated_at: raw.updated_at,
            pushed_at: raw.pushed_at,
            homepage: raw.homepage,
            size: raw.size,
            stargazers_count: raw.stargazers_count,
            forks_count: raw.forks_count,
            language: raw.language || 'Other',
            domain: prev.domain || inferDomain(raw),
            created_year: createdYear,
            pushed_year: pushedYear,
            active_span_days: activeSpanDays,
            has_live_url: Boolean(raw.homepage && raw.homepage.trim().length > 0),
          };
        });

        const latestYear = Math.max(2026, d3.max(state.repos, (d) => d.created_year) || 2026);
        if (wasAtLatestYear) state.maxYear = latestYear;

        const forkCount = state.repos.filter((r) => r.fork).length;
        const origCount = state.repos.length - forkCount;
        const forkBtn = document.getElementById('btn-filter-forks');
        if (forkBtn) {
          forkBtn.textContent = state.includeForks
            ? `Include Forks (${forkCount})`
            : `Originals Only (${origCount})`;
        }

        statusEl.textContent = `Live from GitHub (${state.repos.length} Repos)`;
        updateScrubberReadout();
        renderActiveView();
      }
      btn.textContent = '✓ Live Synced';
    } catch (err) {
      console.warn('Live API sync fallback to bundled dataset:', err);
      statusEl.textContent = `${state.repos.length} Public Repositories (Cached)`;
      btn.textContent = '✓ Using Cached Data';
    } finally {
      setTimeout(() => {
        btn.textContent = '↻ Live API Sync';
        btn.disabled = false;
      }, 2500);
    }
  }

  // --------------------------------------------------------------------------
  // 16. Wire Up UI Event Listeners
  // --------------------------------------------------------------------------
  function bindEvents() {
    // View switcher tabs
    document.querySelectorAll('.view-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.view-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        state.view = tab.getAttribute('data-view');
        resetCamera(500);
        renderActiveView();
      });
    });

    // Group By selector
    document.getElementById('select-group').addEventListener('change', (e) => {
      state.groupBy = e.target.value;
      state.selectedCluster = null;
      renderActiveView();
    });

    // Size By selector
    document.getElementById('select-size').addEventListener('change', (e) => {
      state.sizeBy = e.target.value;
      renderActiveView();
    });

    // Color Palette selector
    document.getElementById('select-palette').addEventListener('change', (e) => {
      state.palette = e.target.value;
      updateInspector(state.selectedRepo);
      renderActiveView();
    });

    // Include Forks toggle
    const forkBtn = document.getElementById('btn-filter-forks');
    forkBtn.classList.add('active');
    forkBtn.addEventListener('click', () => {
      state.includeForks = !state.includeForks;
      forkBtn.classList.toggle('active', state.includeForks);
      forkBtn.textContent = state.includeForks ? 'Include Forks (12)' : 'Originals Only (103)';
      renderActiveView();
    });

    // Live Demos Only toggle
    const liveBtn = document.getElementById('btn-filter-live');
    liveBtn.addEventListener('click', () => {
      state.liveOnly = !state.liveOnly;
      liveBtn.classList.toggle('active', state.liveOnly);
      renderActiveView();
    });

    // Search input
    document.getElementById('input-search').addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderActiveView();
    });

    // Legend reset
    document.getElementById('legend-reset').addEventListener('click', () => {
      state.selectedCluster = null;
      renderActiveView();
    });

    // Inspector close
    document.getElementById('insp-close').addEventListener('click', () => {
      document.getElementById('inspector-drawer').classList.add('collapsed');
    });

    // Camera zoom buttons
    document.getElementById('btn-zoom-in').addEventListener('click', () => {
      svg.transition().duration(300).call(zoomBehavior.scaleBy, 1.35);
    });
    document.getElementById('btn-zoom-out').addEventListener('click', () => {
      svg.transition().duration(300).call(zoomBehavior.scaleBy, 0.74);
    });
    document.getElementById('btn-zoom-reset').addEventListener('click', () => {
      resetCamera(500);
    });

    // Theme toggle
    document.getElementById('btn-theme-toggle').addEventListener('click', () => {
      document.body.classList.toggle('theme-light');
    });

    // Live API Sync
    document.getElementById('btn-live-sync').addEventListener('click', syncLiveFromGitHub);

    // History Playback button
    document.getElementById('btn-play-history').addEventListener('click', startPlayback);

    // Stage background click resets cluster filter or zoom
    svg.on('click', () => {
      if (state.view === 'pack') resetCamera(600);
    });

    // Responsive resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        renderActiveView();
      }, 150);
    });
  }

  // Initialize Everything
  initAmbientCanvas();
  bindEvents();
  updateInspector(state.selectedRepo);
  updateScrubberReadout();
  renderActiveView();
  // Automatically fetch latest repositories from GitHub on every page load
  syncLiveFromGitHub();
})();
