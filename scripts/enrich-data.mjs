import fs from 'node:fs';

const raw = JSON.parse(fs.readFileSync('data/github-data.json', 'utf8').replace(/^\uFEFF/, ''));

const domainRules = [
  {
    domain: 'Games & Interactive Engines',
    match: (r) =>
      /diablo|rpg|pantheon|castaways|air-swarm|air-hack-n-slash|rage-commute|third-town|screaming-mario|time-travel-battle|konami-js/i.test(
        r.name + ' ' + (r.description || '')
      ),
  },
  {
    domain: 'Design Systems, CSS & Color',
    match: (r) =>
      /color-combinations|raster-css|orange-css|themeable-css|airframe|waterfall|onecss|css-sprinkles|css-layouts|fat-shadows|ui-components|perfect-nav|guess-components|matter|polaris|scss-starter/i.test(
        r.name
      ),
  },
  {
    domain: 'Photography, Media & Creative',
    match: (r) =>
      /photography|photo-filters|image-compression|canvas-background|sakura-canvas|sheet-music|christmas-music|top-movies|falling-portfolio/i.test(
        r.name
      ),
  },
  {
    domain: 'Angular & Frontend Architecture',
    match: (r) =>
      /angular|microfrontend|scully|web-components|feature-flags|nx-arron|cr-example|firstReactApp|reactCards|azos-js|slabText/i.test(
        r.name
      ),
  },
  {
    domain: 'Web Apps, AI & Utilities',
    match: (r) =>
      /browser-ai-workbench|what-the-cost|cost-genie|crypto-vote|daily-work|air-table|runtracker|boxing|wodscrapper|onlinefarm|friends|greece-cat-adoption|old-towne-orange/i.test(
        r.name
      ),
  },
];

const fallbackDescriptions = {
  'arron-boxing-training': 'Interactive boxing training timer, combinations, and workout regimen tracker.',
  'arron-2026': '2026 personal portfolio and digital garden built with Astro.',
  'rage-commute': 'Fast-paced arcade driving & commuter survival game written in TypeScript.',
  'arron-mccrory-photography': 'Fine art and portrait photography showcase for Arron McCrory.',
  'browser-ai-workbench': 'Client-side AI experimentation workbench running directly in the browser.',
  'what-the-cost': 'Interactive cost comparison and financial impact calculator built with Svelte.',
  'old-towne-orange': 'Interactive guide and neighborhood web app for Old Towne Orange built with Vue.',
  'air-hack-n-slash': 'Fast-paced aerial hack-and-slash action game prototype in TypeScript.',
  'diablo-excalibur': 'Isometric dark fantasy action RPG built with the Excalibur.js TypeScript game engine.',
  'crypto-vote': 'Real-time community token & cryptocurrency voting application.',
  'third-town': 'Interactive browser-based town simulation and exploration game.',
  'cost-genie-angular': 'Angular edition of Cost Genie personal finance and budget analyzer.',
  'friends': 'Personal social directory and connection tracker project.',
  'arron-boxing': 'Astro-based boxing training resource and log.',
  'falling-portfolio': 'Physics-driven interactive falling elements portfolio experiment.',
  'air-table': 'Lightweight TypeScript data grid and spreadsheet interface.',
  'angular-runtime-type-safety-error-handling': 'Architectural showcase for runtime type validation and resilient error handling in Angular.',
  'nx-arron': 'Nx monorepo workspace and build architecture experiments.',
  'cr-example': 'TypeScript code review and architectural pattern example repository.',
  'angular-single-responsibility-api': 'Demonstration of Single Responsibility Principle API component architecture in Angular.',
  'nextjs-netlify-blog-template': 'Starter template for deploying Next.js blogs on Netlify.',
  'lume-test': 'Experimental static site testbed built on Deno Lume.',
  'canvas-background-animation': 'Generative HTML5 Canvas ambient background particle animation.',
  'simple-deno-server': 'Minimalist zero-dependency HTTP server built on Deno.',
  'arron.dev': 'First-generation arron.dev personal engineering website.',
  'css-sprinkles': 'Lightweight atomic CSS utility sprinkles and styling tokens.',
  'spiritandground-hugo': 'Hugo static site build for Spirit & Ground.',
  'photography-site': 'High-resolution photography gallery and visual portfolio.',
  'screaming-mario': 'Playful interactive HTML5 audio/visual Mario experiment.',
  'simple-feature-flags': 'Lightweight TypeScript feature toggle library for frontend applications.',
  'zodar-portfolio-simple': 'Streamlined JavaScript portfolio site for Zodar.',
  'eleventy-netlify-boilerplate': 'Fast static site boilerplate using 11ty (Eleventy) and Netlify.',
  'microfrontend-test': 'TypeScript micro-frontend integration and module federation testbed.',
  'greece-cat-adoption': 'Web platform connecting stray cats in Greece with adoptive homes.',
  'justine-hugo': 'Custom Hugo website and portfolio built for Justine.',
  'hugo-simple-blog': 'Minimalist content-focused blog theme for Hugo.',
  'spiritandground': 'Landing page and web presence for Spirit & Ground.',
  'airintrees': 'Creative web project and blog (Air in Trees v1).',
  'arron-scully': 'Personal site powered by Angular and the Scully static site generator.',
  'gatsby-universal': 'Universal React SSR/SSG starter using Gatsby.',
  'gatsby-starter-ecommerce': 'E-commerce storefront starter powered by Gatsby.',
  'hugo-scss-starter': 'Hugo static site boilerplate with integrated SCSS pipeline.',
  'angular-boiler': 'Clean TypeScript + Angular project starter template.',
  'one-click-hugo-cms': 'Hugo static site template pre-wired with Netlify CMS.',
  'arron-hugo': 'Personal website built with the Hugo static site generator.',
  'orangecirclecompanysite': 'Corporate web application built in TypeScript for Orange Circle Company.',
  'quick-presence': 'Rapid web presence generator and landing page toolkit in JavaScript.',
  'runtracker': 'TypeScript running log, pace calculator, and mileage tracker.',
  'fat-shadows': 'Expressive bold drop-shadow utility library in pure CSS.',
  'christmas-music': 'Festive holiday music player and visual web experience.',
  'onlinefarm': 'TypeScript web prototype for local farm produce discovery.',
  'wodscrapper': 'JavaScript scraper and parser for daily workout (WOD) routines.',
  'reactCards': 'Interactive card UI component experiment built with React.',
  'shopify1': 'Custom Liquid storefront theme and template for Shopify.',
  'envoy-test': 'Responsive CSS layout and UI engineering showcase.',
  'airframe': 'Original 2014 lightweight CSS grid and utility framework.',
};

const enrichedRepos = raw.repos.map((r) => {
  let domain = 'Sites, Static Web & Deno/Lume';
  for (const rule of domainRules) {
    if (rule.match(r)) {
      domain = rule.domain;
      break;
    }
  }
  const createdYear = new Date(r.created_at).getUTCFullYear();
  const pushedYear = new Date(r.pushed_at).getUTCFullYear();
  const createdTime = new Date(r.created_at).getTime();
  const pushedTime = new Date(r.pushed_at).getTime();
  const activeSpanDays = Math.max(1, Math.round((pushedTime - createdTime) / (1000 * 60 * 60 * 24)));

  return {
    ...r,
    domain,
    summary: r.description || fallbackDescriptions[r.name] || `${r.language} repository by arron21.`,
    created_year: createdYear,
    pushed_year: pushedYear,
    active_span_days: activeSpanDays,
    has_live_url: Boolean(r.homepage && r.homepage.trim().length > 0),
  };
});

// Compute summary breakdowns
const byLanguage = {};
const byDomain = {};
const byYearCreated = {};
const byYearPushed = {};

for (const r of enrichedRepos) {
  byLanguage[r.language] = (byLanguage[r.language] || 0) + 1;
  byDomain[r.domain] = (byDomain[r.domain] || 0) + 1;
  byYearCreated[r.created_year] = (byYearCreated[r.created_year] || 0) + 1;
  byYearPushed[r.pushed_year] = (byYearPushed[r.pushed_year] || 0) + 1;
}

const output = {
  user: raw.user,
  fetched_at: raw.fetched_at,
  stats: {
    total_repos: enrichedRepos.length,
    original_repos: enrichedRepos.filter((r) => !r.fork).length,
    forked_repos: enrichedRepos.filter((r) => r.fork).length,
    live_demos: enrichedRepos.filter((r) => r.has_live_url).length,
    total_size_kb: enrichedRepos.reduce((acc, r) => acc + (r.size || 0), 0),
    languages_count: Object.keys(byLanguage).length,
    domains_count: Object.keys(byDomain).length,
    years_active: 2026 - 2012,
    by_language: byLanguage,
    by_domain: byDomain,
    by_year_created: byYearCreated,
    by_year_pushed: byYearPushed,
  },
  repos: enrichedRepos,
};

fs.writeFileSync('data/github-data.json', JSON.stringify(output, null, 2), 'utf8');
fs.writeFileSync(
  'data/github-data.js',
  `// Auto-generated GitHub dataset for https://github.com/arron21\nwindow.ARRON21_GITHUB_DATA = ${JSON.stringify(output, null, 2)};\n`,
  'utf8'
);

console.log('Enriched repos count:', enrichedRepos.length);
console.log('Domains breakdown:', byDomain);
console.log('Live demos count:', output.stats.live_demos);
