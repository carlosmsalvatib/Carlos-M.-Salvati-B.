import { checkMariaDbConnection } from '../server/mariadb';

export default async function handler(req: any, res: any) {
  try {
    const ok = await checkMariaDbConnection();
    res.status(200).json({ mariadbOperational: ok });
  } catch (err: any) {
    res.status(200).json({ error: err?.message, stack: err?.stack });
  }
}
