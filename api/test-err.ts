export default async function handler(req: any, res: any) {
  const results: any = {};
  
  try {
    const mod1 = await import('../server/mariadb');
    results.importWithoutExt = { ok: true, keys: Object.keys(mod1) };
  } catch (err: any) {
    results.importWithoutExt = { ok: false, message: err?.message, code: err?.code };
  }

  try {
    const mod2 = await import('../server/mariadb.ts');
    results.importWithTs = { ok: true, keys: Object.keys(mod2) };
  } catch (err: any) {
    results.importWithTs = { ok: false, message: err?.message, code: err?.code };
  }

  res.status(200).json(results);
}
