import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const isTsx =
  process.execArgv.some((a) => a.includes('tsx')) ||
  process.env.TSX_ACTIVE === '1' ||
  (process as any).isTsx;

if (!isTsx) {
  process.env.TSX_ACTIVE = '1';
  const child = spawn(
    process.execPath,
    ['--import', 'tsx', fileURLToPath(import.meta.url), ...process.argv.slice(2)],
    {
      stdio: 'inherit',
      env: process.env,
    }
  );
  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
} else {
  await import('./server-core.ts');
}
