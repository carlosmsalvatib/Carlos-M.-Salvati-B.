export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'api-index-active',
    url: req.url,
    originalUrl: req.originalUrl,
    method: req.method,
  });
}
