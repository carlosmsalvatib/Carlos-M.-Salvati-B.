export default function handler(req: any, res: any) {
  res.status(200).json({
    success: true,
    url: req.url,
    path: req.query?.path,
    query: req.query,
    method: req.method,
  });
}
