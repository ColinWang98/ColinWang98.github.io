/* Local visual preview only. This does not replace a Jekyll build. */
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { marked } = require('marked');
const root = path.resolve(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const unquote = (value) => value.trim().replace(/^['"]|['"]$/g, '');
const fields = (source) => Object.fromEntries([...source.matchAll(/^([\w]+)[\t ]*:[\t ]*([^\r\n]*)/gm)].map((m) => [m[1], unquote(m[2])]));
const config = read('_config.yml');
const authorBlock = config.match(/^author:\s*\n([\s\S]*?)(?=^\S)/m)[1];
const site = { ...fields(config), author: fields(authorBlock.replace(/^  /gm, '')), time: String(Date.now()) };

function render(source, page, content = '') {
  const lookup = (value) => {
    value = value.trim().split('|')[0].trim();
    if (/^['"]/.test(value)) return unquote(value);
    if (value === 'content') return content;
    return value.split('.').reduce((obj, key) => obj?.[key], { site, page, layout: {} }) || '';
  };
  const condition = (expression) => expression.split(/\s+or\s+/).some((part) => {
    if (part.includes('==')) {
      const [left, right] = part.split('==');
      return lookup(left) === lookup(right);
    }
    return !!lookup(part);
  });
  source = source.replace(/\{%\s*include\s+([^\s%]+)\s*%\}/g, (_, file) => {
    if (['seo.html', 'analytics.html', 'browser-upgrade.html'].includes(file)) return '';
    return render(read(`_includes/${file}`), page, content);
  });
  source = source.replace(/\{%\s*if\s+([^%]+)%\}([\s\S]*?)\{%\s*endif\s*%\}/g, (_, expr, body) => condition(expr.trim()) ? body : '');
  return source.replace(/\{\{\s*([^}]+)\}\}/g, (_, value) => {
    if (value.includes("date: '%Y'")) return new Date().getFullYear();
    if (/relative_url|absolute_url/.test(value)) return '/' + String(lookup(value)).replace(/^\//, '');
    return lookup(value);
  });
}

function pageHtml(file) {
  const source = read(file);
  const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const page = { author_profile: true, ...fields(front[1]), url: file === 'index.md' ? '/' : `/${file.replace('.md', '')}/` };
  let body = render(source.slice(front[0].length), page);
  const blocks = [];
  // Kramdown preserves complete HTML blocks, including blank lines inside them.
  body = body.replace(/^<(div|section|script|aside|nav|details|form)\b/gm, (match) => `\u0000${match}`);
  while (body.includes('\u0000')) {
    const start = body.indexOf('\u0000');
    const tag = body.slice(start + 1).match(/^<(\w+)/)[1];
    const tokens = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'g');
    tokens.lastIndex = start + 1;
    let depth = 0;
    let token;
    while ((token = tokens.exec(body))) {
      depth += token[0].startsWith('</') ? -1 : 1;
      if (depth === 0) break;
    }
    if (!token) throw new Error(`Unclosed HTML block: ${tag}`);
    blocks.push(body.slice(start + 1, tokens.lastIndex).replaceAll('\u0000', ''));
    body = body.slice(0, start) + `<div data-preview-block="${blocks.length - 1}"></div>` + body.slice(tokens.lastIndex);
  }
  const renderer = new marked.Renderer();
  renderer.heading = function ({ depth, tokens }) {
    const text = this.parser.parseInline(tokens);
    const id = text.replace(/<[^>]+>/g, '').toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  };
  const content = marked.parse(body, { renderer }).replace(/<div data-preview-block="(\d+)"><\/div>/g, (_, index) => blocks[index]);
  const template = read('_layouts/default.html').replace(/^---[\s\S]*?---\s*/, '');
  return render(template, page, content);
}

const types = { '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.html': 'text/html' };
http.createServer((req, res) => {
  try {
    const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (url === '/' || /^\/(education|publications|work|activities|awards|others|deadlines)\/$/.test(url)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(pageHtml(url === '/' ? 'index.md' : `${url.slice(1, -1)}.md`));
      return;
    }
    const target = path.resolve(root, `.${url}`);
    if (!target.startsWith(root + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      res.writeHead(404).end(); return;
    }
    if (path.extname(target) === '.mp4') {
      const size = fs.statSync(target).size;
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
      if (range) {
        const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
        const end = range[1] && range[2] ? Math.min(size - 1, Number(range[2])) : size - 1;
        if ((!range[1] && !range[2]) || start > end || start >= size) {
          res.writeHead(416, { 'Content-Range': `bytes */${size}` }).end(); return;
        }
        res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
        if (req.method === 'HEAD') res.end();
        else fs.createReadStream(target, { start, end }).pipe(res);
        return;
      }
      res.setHeader('Content-Length', size);
    } else res.setHeader('Content-Type', `${types[path.extname(target)] || 'application/octet-stream'}; charset=utf-8`);
    if (req.method === 'HEAD') { res.end(); return; }
    fs.createReadStream(target).pipe(res);
  } catch (error) {
    res.writeHead(500).end(error.message);
  }
}).listen(4173, '127.0.0.1', () => console.log('Visual preview: http://127.0.0.1:4173 (not a Jekyll build)'));
