export default async function handler(req: any, res: any) {
  try {
    const serverCore = await import('../server-core');
    res.status(200).json({
      success: true,
      hasDefault: !!serverCore.default,
      hasApp: !!serverCore.app,
    });
  } catch (err: any) {
    res.status(200).json({
      success: false,
      error: err?.message,
      stack: err?.stack,
    });
  }
}
