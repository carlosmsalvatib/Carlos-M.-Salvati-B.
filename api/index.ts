import app from '../server-core';

export default function handler(req: any, res: any) {
  return app(req, res);
}
