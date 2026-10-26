import fs from 'node:fs';
import path from 'node:path';

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const d3Code = fs.readFileSync('vendor/d3.min.js', 'utf8');
const dataCode = fs.readFileSync('data/github-data.js', 'utf8');
const appCode = fs.readFileSync('app.js', 'utf8');

// Replace external references with inline tags for standalone execution
const standalone = html
  .replace('<link rel="stylesheet" href="styles.css" />', () => `<style>\n${css}\n</style>`)
  .replace('<script src="vendor/d3.min.js"></script>', () => `<script>\n${d3Code}\n</script>`)
  .replace('<script src="data/github-data.js"></script>', () => `<script>\n${dataCode}\n</script>`)
  .replace('<script src="app.js"></script>', () => `<script>\n${appCode}\n</script>`);

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/arron21-github-d3-standalone.html', standalone, 'utf8');

const artifactPath =
  'C:\\Users\\arron\\.gemini\\antigravity\\brain\\271c7814-90d1-4da9-91af-adfbfcc58a43\\arron21-github-d3.html';
fs.writeFileSync(artifactPath, standalone, 'utf8');

console.log('Standalone bundle written successfully:', standalone.length, 'bytes');
