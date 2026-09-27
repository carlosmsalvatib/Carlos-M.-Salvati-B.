export default async function handler(req: any, res: any) {
  const { slug } = req.query;
  res.status(200).json({
    success: true,
    slug,
    method: req.method,
    url: req.url,
  });
}
