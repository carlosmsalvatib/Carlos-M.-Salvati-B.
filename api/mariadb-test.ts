import mysql from 'mysql2/promise';

export default async function handler(req: any, res: any) {
  try {
    const conn = await mysql.createConnection({
      host: '45.79.40.132',
      port: 3306,
      user: 'siacecom_aapu',
      password: 'Admin2104aapu*',
      database: 'siacecom_misdelirios',
      connectTimeout: 8000,
    });
    const [rows]: any = await conn.query('SELECT count(*) as count FROM lots');
    await conn.end();
    res.status(200).json({
      success: true,
      message: 'Conexión exitosa a MariaDB desde Vercel Serverless!',
      lotsCount: rows[0]?.count,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message,
    });
  }
}
