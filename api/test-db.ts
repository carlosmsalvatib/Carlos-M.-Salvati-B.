import { checkConnection, getLots } from './db';

export default async function handler(req: any, res: any) {
  try {
    const conn = await checkConnection();
    const lots = await getLots();
    res.status(200).json({
      success: true,
      dbConnected: conn.ok,
      mariadbVersion: conn.version,
      lotsCount: lots ? lots.length : 0,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
