export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    server: 'vercel-serverless',
    nodeVersion: process.version,
    envVercel: process.env.VERCEL,
  });
}
