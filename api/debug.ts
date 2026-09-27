import app from '../server-core';

export default function handler(req: any, res: any) {
  res.status(200).json({
    success: true,
    hasApp: !!app,
  });
}
