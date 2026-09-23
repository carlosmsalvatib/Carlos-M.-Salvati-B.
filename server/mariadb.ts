import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

export interface MariaDbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  enabled: boolean;
}

export function sanitizeHost(h: string): string {
  if (!h) return '';
  return h.trim().replace(/^https?:\/\//i, '').replace(/[:/].*$/, '').trim();
}

/**
 * Resolves the effective MariaDB host.
 * The domain 'www.360siace.com' or '360siace.com' points to a web CDN/proxy (216.198.79.65) where port 3306 is not open.
 * The actual MariaDB server is located at direct IP 45.79.40.132.
 */
export function resolveEffectiveHost(h: string): string {
  const clean = sanitizeHost(h);
  if (clean === 'www.360siace.com' || clean === '360siace.com' || clean === 'misdelirios.360siace.com') {
    return '45.79.40.132';
  }
  return clean;
}

const CONFIG_FILE = path.join(process.cwd(), 'data', 'mariadb-config.json');

// Default configuration with user-provided credentials
const rawEnvHost = process.env.MARIADB_HOST || '';
const cleanEnvHost = resolveEffectiveHost(rawEnvHost);

const defaultConfig: MariaDbConfig = {
  host: cleanEnvHost || '45.79.40.132',
  port: Number(process.env.MARIADB_PORT) || 3306,
  user: process.env.MARIADB_USER || 'siacecom_aapu',
  password: process.env.MARIADB_PASSWORD || 'Aapu2104MD..',
  database: process.env.MARIADB_DATABASE || 'siacecom_misdelirios',
  enabled: true,
};

let currentConfig: MariaDbConfig = loadSavedConfig();
let pool: mysql.Pool | null = null;
let lastStatus = {
  connected: false,
  error: null as string | null,
  lastChecked: null as string | null,
  tablesCreated: false,
};

function loadSavedConfig(): MariaDbConfig {
  let saved: Partial<MariaDbConfig> = {};
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      saved = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    }
  } catch (err) {
    console.warn('[MariaDB] Error leyendo configuración guardada:', err);
  }

  // Secrets from environment variables take priority or provide secure defaults
  const rawTargetHost = process.env.MARIADB_HOST || saved.host || defaultConfig.host;
  const merged: MariaDbConfig = {
    host: resolveEffectiveHost(rawTargetHost),
    port: Number(process.env.MARIADB_PORT || saved.port || defaultConfig.port),
    user: process.env.MARIADB_USER || saved.user || defaultConfig.user,
    password: process.env.MARIADB_PASSWORD || saved.password || defaultConfig.password,
    database: process.env.MARIADB_DATABASE || saved.database || defaultConfig.database,
    enabled: saved.enabled !== undefined ? saved.enabled : defaultConfig.enabled,
  };

  return merged;
}

export function saveConfig(cfg: Partial<MariaDbConfig>): MariaDbConfig {
  const cleanCfg = { ...cfg };
  if (cleanCfg.host) {
    cleanCfg.host = resolveEffectiveHost(cleanCfg.host);
  }
  currentConfig = { ...currentConfig, ...cleanCfg };
  try {
    const dataDir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(currentConfig, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[MariaDB] Error guardando archivo de configuración:', err);
  }
  // Reconnect pool with new config
  initMariaDbPool();
  return currentConfig;
}

export function getCurrentConfig(): MariaDbConfig {
  return { ...currentConfig };
}

export function getMariaDbStatus() {
  return {
    ...lastStatus,
    config: {
      host: currentConfig.host,
      port: currentConfig.port,
      user: currentConfig.user,
      database: currentConfig.database,
      enabled: currentConfig.enabled,
    },
  };
}

export function initMariaDbPool(): mysql.Pool | null {
  if (pool) {
    try {
      pool.end().catch(() => {});
    } catch {}
    pool = null;
  }

  if (!currentConfig.enabled) {
    lastStatus = {
      connected: false,
      error: 'MariaDB está deshabilitado en la configuración',
      lastChecked: new Date().toISOString(),
      tablesCreated: false,
    };
    return null;
  }

  try {
    const cleanHost = resolveEffectiveHost(currentConfig.host);
    pool = mysql.createPool({
      host: cleanHost,
      port: currentConfig.port,
      user: currentConfig.user,
      password: currentConfig.password,
      database: currentConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 4000,
      timezone: '+00:00',
    });
    return pool;
  } catch (err: any) {
    console.warn('[MariaDB] Error inicializando pool:', err.message);
    lastStatus = {
      connected: false,
      error: err.message,
      lastChecked: new Date().toISOString(),
      tablesCreated: false,
    };
    return null;
  }
}

export async function testMariaDbConnection(configOverride?: Partial<MariaDbConfig>): Promise<{
  success: boolean;
  message: string;
  error?: string;
  databases?: string[];
}> {
  const cfg = { ...currentConfig, ...configOverride };
  if (cfg.host) {
    cfg.host = resolveEffectiveHost(cfg.host);
  }
  try {
    // First try connecting with database specified
    let connection: mysql.Connection;
    try {
      connection = await mysql.createConnection({
        host: cfg.host,
        port: cfg.port,
        user: cfg.user,
        password: cfg.password,
        database: cfg.database,
        connectTimeout: 3000,
      });
    } catch (dbErr: any) {
      // If database does not exist, try connecting without database to check credentials
      if (dbErr.code === 'ER_BAD_DB_ERROR' || dbErr.message?.includes('Unknown database')) {
        const rootConn = await mysql.createConnection({
          host: cfg.host,
          port: cfg.port,
          user: cfg.user,
          password: cfg.password,
          connectTimeout: 3000,
        });
        const [dbRows]: any = await rootConn.query('SHOW DATABASES;');
        const availableDbs = dbRows.map((r: any) => Object.values(r)[0]);
        // Attempt to create the database if permissions allow
        try {
          await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${cfg.database}\`;`);
          await rootConn.end();
          return {
            success: true,
            message: `¡Conexión exitosa! La base de datos '${cfg.database}' fue creada automáticamente en MariaDB (${cfg.host}).`,
            databases: availableDbs,
          };
        } catch {
          await rootConn.end();
          return {
            success: false,
            message: `Credenciales válidas, pero la base de datos '${cfg.database}' no existe. Bases de datos disponibles: ${availableDbs.join(', ')}`,
            databases: availableDbs,
          };
        }
      }
      throw dbErr;
    }

    const [rows]: any = await connection.query('SELECT 1 as test, VERSION() as version;');
    const [dbRows]: any = await connection.query('SHOW DATABASES;').catch(() => [[]]);
    const availableDbs = dbRows.map((r: any) => Object.values(r)[0]);
    await connection.end();

    lastStatus = {
      connected: true,
      error: null,
      lastChecked: new Date().toISOString(),
      tablesCreated: lastStatus.tablesCreated,
    };

    return {
      success: true,
      message: `¡Conectado exitosamente a MariaDB! Versión: ${rows?.[0]?.version || 'OK'} (Servidor: ${cfg.host})`,
      databases: availableDbs,
    };
  } catch (err: any) {
    let friendlyError = err.message || String(err);
    if (err.code === 'ETIMEDOUT' || err.message?.includes('ETIMEDOUT')) {
      friendlyError = `Tiempo de espera agotado al conectar con ${cfg.host}:${cfg.port}. Posibles causas: 1) El puerto 3306 está bloqueado por firewall en el servidor de hosting. 2) En cPanel se requiere habilitar "MySQL Remoto" y agregar '%' como host de acceso. 3) El dominio apunta a Vercel/CDN y se requiere la IP directa del servidor MySQL.`;
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR' || err.message?.includes('Access denied')) {
      friendlyError = `El servidor MariaDB en '${cfg.host}' respondió, pero denegó el acceso al usuario '${cfg.user}'. Solución: En cPanel -> "MySQL Remoto" (Remote MySQL) agregue '%' (comodín para cualquier IP) y verifique que el usuario '${cfg.user}' tenga asignados todos los privilegios sobre la base de datos '${cfg.database}'. [Detalle técnico: ${err.message}]`;
    } else if (err.code === 'ENOTFOUND') {
      friendlyError = `No se pudo resolver el host '${cfg.host}'. Verifique el nombre de host o utilice la dirección IP directa.`;
    }

    lastStatus = {
      connected: false,
      error: friendlyError,
      lastChecked: new Date().toISOString(),
      tablesCreated: false,
    };

    return {
      success: false,
      message: 'Fallo al conectar con MariaDB',
      error: friendlyError,
    };
  }
}

export async function ensureMariaDbTables(): Promise<boolean> {
  if (!pool) initMariaDbPool();
  if (!pool) return false;

  try {
    // 1. Table for CMS content JSON
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_content (
        id VARCHAR(64) PRIMARY KEY,
        content_json LONGTEXT NOT NULL,
        version INT DEFAULT 1,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Table for Housing Models
    await pool.query(`
      CREATE TABLE IF NOT EXISTS housing_models (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        area_m2 INT,
        price_usd INT,
        active BOOLEAN DEFAULT TRUE,
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Table for Lots
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lots (
        id VARCHAR(64) PRIMARY KEY,
        code VARCHAR(64) NOT NULL,
        manzana VARCHAR(32),
        lote_num VARCHAR(32),
        area_m2 INT,
        price_usd_per_m2 INT,
        total_price_usd INT,
        status VARCHAR(32) DEFAULT 'disponible',
        data_json LONGTEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Table for Leads / Quotes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(64) PRIMARY KEY,
        full_name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(64),
        lot_code VARCHAR(64),
        model_name VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_json LONGTEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Table for CMS Versions / History
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cms_versions (
        version INT PRIMARY KEY,
        note TEXT,
        content_json LONGTEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    lastStatus.tablesCreated = true;
    lastStatus.connected = true;
    lastStatus.error = null;
    return true;
  } catch (err: any) {
    console.warn('[MariaDB] Error creando tablas:', err.message);
    lastStatus.connected = false;
    lastStatus.error = err.message;
    return false;
  }
}

export async function getMariaDbContent(): Promise<any | null> {
  if (!pool) return null;
  try {
    const [rows]: any = await pool.query(
      'SELECT content_json FROM cms_content WHERE id = "global_content" LIMIT 1;'
    );
    if (rows && rows.length > 0 && rows[0].content_json) {
      return JSON.parse(rows[0].content_json);
    }
  } catch (err: any) {
    console.warn('[MariaDB] Error leyendo contenido:', err.message);
  }
  return null;
}

export async function saveMariaDbContent(content: any, version = 1, note = ''): Promise<boolean> {
  if (!pool) return false;
  try {
    await ensureMariaDbTables();
    const contentStr = JSON.stringify(content);
    await pool.query(
      `INSERT INTO cms_content (id, content_json, version, updated_at)
       VALUES ("global_content", ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         content_json = VALUES(content_json),
         version = VALUES(version),
         updated_at = NOW();`,
      [contentStr, version]
    );

    // Save version history
    if (version) {
      await pool.query(
        `INSERT INTO cms_versions (version, note, content_json, created_at)
         VALUES (?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE note = VALUES(note), content_json = VALUES(content_json);`,
        [version, note, contentStr]
      ).catch(() => {});
    }

    return true;
  } catch (err: any) {
    console.warn('[MariaDB] Error guardando contenido:', err.message);
    return false;
  }
}

export async function getMariaDbLots(): Promise<any[] | null> {
  if (!pool) return null;
  try {
    const [rows]: any = await pool.query('SELECT data_json FROM lots ORDER BY code ASC;');
    if (rows && rows.length > 0) {
      return rows.map((r: any) => JSON.parse(r.data_json));
    }
  } catch (err: any) {
    console.warn('[MariaDB] Error leyendo lotes:', err.message);
  }
  return null;
}

export async function saveMariaDbLots(lots: any[]): Promise<boolean> {
  if (!pool || !Array.isArray(lots)) return false;
  try {
    await ensureMariaDbTables();
    for (const lot of lots) {
      const id = lot.id || `lot-${lot.code}`;
      const code = lot.code || id;
      const manzana = lot.manzana || '';
      const lote_num = String(lot.lote || '');
      const area = Number(lot.area) || 0;
      const price_m2 = Number(lot.pricePerM2) || 0;
      const total = Number(lot.totalPrice) || 0;
      const status = lot.status || 'disponible';
      const dataStr = JSON.stringify(lot);

      await pool.query(
        `INSERT INTO lots (id, code, manzana, lote_num, area_m2, price_usd_per_m2, total_price_usd, status, data_json, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE
           code = VALUES(code),
           manzana = VALUES(manzana),
           lote_num = VALUES(lote_num),
           area_m2 = VALUES(area_m2),
           price_usd_per_m2 = VALUES(price_usd_per_m2),
           total_price_usd = VALUES(total_price_usd),
           status = VALUES(status),
           data_json = VALUES(data_json),
           updated_at = NOW();`,
        [id, code, manzana, lote_num, area, price_m2, total, status, dataStr]
      );
    }
    return true;
  } catch (err: any) {
    console.warn('[MariaDB] Error guardando lotes:', err.message);
    return false;
  }
}

export async function getMariaDbModels(): Promise<any[] | null> {
  if (!pool) return null;
  try {
    const [rows]: any = await pool.query('SELECT data_json FROM housing_models;');
    if (rows && rows.length > 0) {
      return rows.map((r: any) => JSON.parse(r.data_json));
    }
  } catch (err: any) {
    console.warn('[MariaDB] Error leyendo modelos:', err.message);
  }
  return null;
}

export async function saveMariaDbModels(models: any[]): Promise<boolean> {
  if (!pool || !Array.isArray(models)) return false;
  try {
    await ensureMariaDbTables();
    for (const m of models) {
      const id = m.id || `model-${Date.now()}`;
      const name = m.name || 'Modelo';
      const area = Number(m.constructionArea) || 0;
      const price = Number(m.estimatedPrice) || 0;
      const active = m.active !== false;
      const dataStr = JSON.stringify(m);

      await pool.query(
        `INSERT INTO housing_models (id, name, area_m2, price_usd, active, data_json, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           area_m2 = VALUES(area_m2),
           price_usd = VALUES(price_usd),
           active = VALUES(active),
           data_json = VALUES(data_json),
           updated_at = NOW();`,
        [id, name, area, price, active, dataStr]
      );
    }
    return true;
  } catch (err: any) {
    console.warn('[MariaDB] Error guardando modelos:', err.message);
    return false;
  }
}

export async function saveMariaDbLead(lead: any): Promise<boolean> {
  if (!pool) return false;
  try {
    await ensureMariaDbTables();
    const id = lead.id || `lead-${Date.now()}`;
    const fullName = lead.fullName || lead.name || '';
    const email = lead.email || '';
    const phone = lead.phone || '';
    const lotCode = lead.lotCode || '';
    const modelName = lead.modelName || '';
    const dataStr = JSON.stringify(lead);

    await pool.query(
      `INSERT INTO leads (id, full_name, email, phone, lot_code, model_name, created_at, data_json)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), ?);`,
      [id, fullName, email, phone, lotCode, modelName, dataStr]
    );
    return true;
  } catch (err: any) {
    console.warn('[MariaDB] Error guardando prospecto:', err.message);
    return false;
  }
}

export async function migrateAllToMariaDb(data: {
  content: any;
  lots: any[];
  models?: any[];
  leads?: any[];
}): Promise<{ success: boolean; message: string; details: any }> {
  const connTest = await testMariaDbConnection();
  if (!connTest.success) {
    return {
      success: false,
      message: `No se pudo conectar a MariaDB para iniciar la migración: ${connTest.error || connTest.message}`,
      details: connTest,
    };
  }

  const tableReady = await ensureMariaDbTables();
  if (!tableReady) {
    return {
      success: false,
      message: 'No se pudieron crear las tablas necesarias en MariaDB.',
      details: lastStatus,
    };
  }

  const results: any = {};

  // 1. Migrate Content
  if (data.content) {
    results.content = await saveMariaDbContent(data.content, data.content.version || 1, 'Migración inicial a MariaDB');
  }

  // 2. Migrate Lots
  if (data.lots && data.lots.length > 0) {
    results.lots = await saveMariaDbLots(data.lots);
    results.lotsCount = data.lots.length;
  }

  // 3. Migrate Models
  const models = data.models || data.content?.housingModels?.models || [];
  if (models && models.length > 0) {
    results.models = await saveMariaDbModels(models);
    results.modelsCount = models.length;
  }

  // 4. Migrate Leads if any
  if (data.leads && data.leads.length > 0) {
    let leadSuccess = 0;
    for (const lead of data.leads) {
      if (await saveMariaDbLead(lead)) leadSuccess++;
    }
    results.leadsMigrated = leadSuccess;
  }

  return {
    success: true,
    message: `¡Migración completada con éxito en MariaDB! (${results.lotsCount || 0} lotes, ${results.modelsCount || 0} modelos y contenido global)`,
    details: results,
  };
}

// Initial pool creation on module load
initMariaDbPool();
