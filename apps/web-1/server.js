const http = require('http');

const port = process.env.PORT || 3000;
const clusterEnv = process.env.CLUSTER_ENV || 'unknown';

const server = http.createServer((req, res) => {
  if (req.url === '/healthz') {
    res.writeHead(200, { 'content-type': 'text/plain' });
    return res.end('ok\n');
  }

  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(`<!doctype html>
<html>
  <head><title>web-1</title></head>
  <body style="font-family: system-ui; margin: 3rem;">
    <h1>web-1 is running ✅</h1>
    <p>V4</p>
    <p>Cluster environment: <strong>${clusterEnv}</strong></p>
  </body>
</html>\n`);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`web-1 listening on ${port}`);
});
