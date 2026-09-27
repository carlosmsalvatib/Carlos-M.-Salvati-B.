export default async function handler(req: any, res: any) {
  try {
    const db = await import('./db.js');
    const conn = await db.checkConnection();
    const lots = await db.getLots();
    res.status(200).json({
      success: true,
      dbConnected: conn.ok,
      mariadbVersion: conn.version,
      lotsCount: lots ? lots.length : 0,
    });
  } catch (err: any) {
    res.status(200).json({
      success: false,
      errorMessage: err.message,
      errorCode: err.code,
      stack: err.stack,
    });
  }
}
