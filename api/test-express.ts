import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const express = require('express');

export default function handler(req: any, res: any) {
  try {
    const app = express();
    app.get('/api/test-express', (q: any, s: any) => s.json({ expressWithRequireWorks: true }));
    return app(req, res);
  } catch (err: any) {
    res.status(500).json({ error: err?.message, stack: err?.stack });
  }
}
