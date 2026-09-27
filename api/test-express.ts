import express from 'express';

export default function handler(req: any, res: any) {
  const app = express();
  app.get('/api/test-express', (q, s) => s.json({ expressWorks: true }));
  return app(req, res);
}
