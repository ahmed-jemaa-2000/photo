const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number.parseInt(process.env.PORT || '3002', 10);
const HOST = process.env.HOST || '0.0.0.0';

const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error(`[ai-studio] Missing build output: ${indexPath}`);
  console.error('[ai-studio] Run: npm install && npm run build');
  process.exit(1);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function send(res, statusCode, headers, body) {
  res.writeHead(statusCode, headers);
  if (body && res.req?.method !== 'HEAD') res.end(body);
  else res.end();
}

function safeDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function resolveFilePath(urlPathname) {
  const decoded = safeDecodeURIComponent(urlPathname);
  if (!decoded) return null;

  const normalized = path.posix.normalize(decoded);
  const withoutLeadingSlash = normalized.replace(/^\/+/, '');
  const filePath = path.join(distDir, withoutLeadingSlash);

  const relative = path.relative(distDir, filePath);
  const isInside = relative && !relative.startsWith('..') && !path.isAbsolute(relative);
  if (!isInside) return null;

  return filePath;
}

function shouldServeIndexHtml(req, urlPathname) {
  if (urlPathname === '/' || urlPathname === '') return true;
  if (path.posix.extname(urlPathname)) return false;

  const accept = req.headers?.accept || '';
  return typeof accept === 'string' && accept.includes('text/html');
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const urlPathname = url.pathname || '/';

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return send(res, 405, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Method Not Allowed');
    }

    const candidatePathname = urlPathname === '/' ? '/index.html' : urlPathname;
    const filePath = resolveFilePath(candidatePathname);

    if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      const cacheControl = filePath.includes(`${path.sep}assets${path.sep}`)
        ? 'public, max-age=31536000, immutable'
        : 'no-cache';

      const buffer = fs.readFileSync(filePath);
      return send(res, 200, { 'Content-Type': contentType, 'Cache-Control': cacheControl }, buffer);
    }

    if (shouldServeIndexHtml(req, urlPathname)) {
      const buffer = fs.readFileSync(indexPath);
      return send(res, 200, { 'Content-Type': MIME_TYPES['.html'], 'Cache-Control': 'no-cache' }, buffer);
    }

    return send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Not Found');
  } catch (err) {
    console.error('[ai-studio] Request error:', err);
    return send(res, 500, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Internal Server Error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[ai-studio] Serving ${distDir}`);
  console.log(`[ai-studio] Listening on http://${HOST}:${PORT}`);
});

