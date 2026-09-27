import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MARIADB_HOST || '45.79.40.132',
      port: Number(process.env.MARIADB_PORT) || 3306,
      user: process.env.MARIADB_USER || 'siacecom_aapu',
      password: process.env.MARIADB_PASSWORD || 'Admin2104aapu*',
      database: process.env.MARIADB_DATABASE || 'siacecom_misdelirios',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 8000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  return pool;
}

export default async function handler(req: any, res: any) {
  // CORS & headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawPath = String(req.query?.path || '').replace(/^\/+/, '').replace(/\/+$/, '');
  const method = req.method;

  try {
    const p = getPool();

    if (rawPath === 'health') {
      return res.status(200).json({
        status: 'ok',
        server: 'vercel-serverless',
        nodeVersion: process.version,
        time: new Date().toISOString(),
      });
    }

    if (rawPath === 'sync/version') {
      return res.status(200).json({
        version: Date.now(),
        contentVersion: 1,
        timestamp: new Date().toISOString(),
      });
    }

    if (rawPath === 'lots' && method === 'GET') {
      const [rows]: any = await p.query('SELECT data_json FROM lots ORDER BY code ASC;');
      const lots = rows.map((r: any) => JSON.parse(r.data_json));
      return res.status(200).json({ success: true, data: lots });
    }

    if (rawPath === 'content' && method === 'GET') {
      const [rows]: any = await p.query('SELECT content_json FROM cms_content WHERE id = "global_content" LIMIT 1;');
      if (rows && rows.length > 0 && rows[0].content_json) {
        return res.status(200).json({ success: true, data: JSON.parse(rows[0].content_json) });
      }
      return res.status(200).json({ success: true, data: null });
    }

    if (rawPath === 'models' && method === 'GET') {
      const [rows]: any = await p.query('SELECT data_json FROM housing_models;');
      const models = rows.map((r: any) => JSON.parse(r.data_json));
      return res.status(200).json({ success: true, data: models });
    }

    return res.status(200).json({
      success: true,
      message: 'Mis Delirios Ranch API',
      path: rawPath,
      method,
    });
  } catch (err: any) {
    console.error('[API Error]', err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}
