let appInstance: any = null;
let initError: any = null;

async function getApp() {
  if (appInstance) return appInstance;
  if (initError) throw initError;
  try {
    const mod = await import('../server-core.ts');
    appInstance = mod.default || mod.app;
    return appInstance;
  } catch (err: any) {
    initError = err;
    console.error('Failed to initialize server-core in Vercel:', err);
    throw err;
  }
}

export default async function handler(req: any, res: any) {
  try {
    const app = await getApp();
    return app(req, res);
  } catch (err: any) {
    res.status(500).json({
      error: 'Function Initialization Failed',
      message: err?.message,
      stack: err?.stack,
    });
  }
}
