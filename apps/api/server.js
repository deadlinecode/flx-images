import http from 'node:http';
import pg from 'pg';

const { Client } = pg;
const port = process.env.PORT || 8080;
const databaseUrl = process.env.DATABASE_URL || '';
const clusterEnv = process.env.CLUSTER_ENV || 'unknown';

function maskDatabaseUrl(url) {
  return url.replace(/postgres:\/\/([^:]+):([^@]+)@/, 'postgres://$1:****@');
}

async function checkDb() {
  if (!databaseUrl) return { ok: false, error: 'DATABASE_URL is not set' };
  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    const result = await client.query('select now() as now');
    return { ok: true, now: result.rows[0].now };
  } catch (error) {
    return { ok: false, error: error.message };
  } finally {
    await client.end().catch(() => {});
  }
}

const server = http.createServer(async (req, res) => {
  if (req.url === '/healthz') {
    res.writeHead(200, { 'content-type': 'text/plain' });
    return res.end('ok\n');
  }

  if (req.url === '/db') {
    const db = await checkDb();
    res.writeHead(db.ok ? 200 : 500, { 'content-type': 'application/json' });
    return res.end(JSON.stringify(db, null, 2) + '\n');
  }

  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(JSON.stringify({
    service: 'api',
    status: 'running',
    clusterEnv,
    databaseUrl: databaseUrl ? maskDatabaseUrl(databaseUrl) : null,
    endpoints: ['/healthz', '/db']
  }, null, 2) + '\n');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`api listening on ${port}`);
});
