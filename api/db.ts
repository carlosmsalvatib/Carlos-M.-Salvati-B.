import mysql from 'mysql2/promise';

export interface MariaDbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

const config: MariaDbConfig = {
  host: process.env.MARIADB_HOST || '45.79.40.132',
  port: Number(process.env.MARIADB_PORT) || 3306,
  user: process.env.MARIADB_USER || 'siacecom_aapu',
  password: process.env.MARIADB_PASSWORD || 'Admin2104aapu*',
  database: process.env.MARIADB_DATABASE || 'siacecom_misdelirios',
};

// Global pool cached across serverless warm invocations
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 8000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }
  return pool;
}

export async function checkConnection(): Promise<{ ok: boolean; version?: string; error?: string }> {
  try {
    const p = getPool();
    const [rows]: any = await p.query('SELECT 1 as probe, VERSION() as version;');
    return { ok: true, version: rows[0]?.version };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

// Lots
export async function getLots(): Promise<any[] | null> {
  try {
    const p = getPool();
    const [rows]: any = await p.query('SELECT data_json FROM lots ORDER BY code ASC;');
    if (rows && rows.length > 0) {
      return rows.map((r: any) => JSON.parse(r.data_json));
    }
  } catch (err: any) {
    console.error('[DB] getLots error:', err.message);
  }
  return null;
}

export async function saveLots(lots: any[]): Promise<boolean> {
  if (!Array.isArray(lots)) return false;
  try {
    const p = getPool();
    for (const lot of lots) {
      const id = lot.id || `lot-${lot.code}`;
      const code = lot.code || id;
      const manzana = lot.manzana || '';
      const lote_num = String(lot.loteNum ?? lot.lote ?? '');
      const area = Number(lot.areaM2 ?? lot.area) || 0;
      const price_m2 = Number(lot.priceUsdPerM2 ?? lot.pricePerM2 ?? 20) || 20;
      const total = Number(lot.totalPriceUsd ?? lot.totalPrice) || Math.round(area * price_m2);
      const status = lot.status || 'disponible';
      const dataStr = JSON.stringify(lot);

      await p.query(
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
    console.error('[DB] saveLots error:', err.message);
    return false;
  }
}

// Housing Models
export async function getModels(): Promise<any[] | null> {
  try {
    const p = getPool();
    const [rows]: any = await p.query('SELECT data_json FROM housing_models;');
    if (rows && rows.length > 0) {
      return rows.map((r: any) => JSON.parse(r.data_json));
    }
  } catch (err: any) {
    console.error('[DB] getModels error:', err.message);
  }
  return null;
}

export async function saveModels(models: any[]): Promise<boolean> {
  if (!Array.isArray(models)) return false;
  try {
    const p = getPool();
    for (const m of models) {
      const id = m.id || `model-${Date.now()}`;
      const name = m.name || 'Modelo';
      const area = Number(m.areaM2 ?? m.constructionArea) || 0;
      const price = Number(m.priceUsd ?? m.price ?? m.estimatedPrice) || 0;
      const videoUrl = m.videoUrl || '';
      const active = m.active !== false;
      const dataStr = JSON.stringify(m);

      await p.query(
        `INSERT INTO housing_models (id, name, area_m2, price_usd, video_url, active, data_json, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           area_m2 = VALUES(area_m2),
           price_usd = VALUES(price_usd),
           video_url = VALUES(video_url),
           active = VALUES(active),
           data_json = VALUES(data_json),
           updated_at = NOW();`,
        [id, name, area, price, videoUrl, active ? 1 : 0, dataStr]
      );
    }
    return true;
  } catch (err: any) {
    console.error('[DB] saveModels error:', err.message);
    return false;
  }
}

// Global Content & Merged Sections
export async function getContent(): Promise<any | null> {
  try {
    const p = getPool();
    const [rows]: any = await p.query(
      'SELECT content_json FROM cms_content WHERE id = "global_content" LIMIT 1;'
    );
    if (rows && rows.length > 0 && rows[0].content_json) {
      return JSON.parse(rows[0].content_json);
    }
  } catch (err: any) {
    console.error('[DB] getContent error:', err.message);
  }
  return null;
}

export async function getAllContentMerged(fallback: any): Promise<any> {
  try {
    const p = getPool();
    let merged = fallback ? { ...fallback } : {};

    const globalContent = await getContent();
    if (globalContent && typeof globalContent === 'object') {
      merged = { ...merged, ...globalContent };
    }

    const sectionQueries = [
      { key: 'site', table: 'cms_section_site' },
      { key: 'hero', table: 'cms_section_hero' },
      { key: 'valueProp', table: 'cms_section_value_prop' },
      { key: 'location', table: 'cms_section_location' },
      { key: 'masterPlan', table: 'cms_section_master_plan' },
      { key: 'housingModels', table: 'cms_section_housing_models' },
      { key: 'customerProfiles', table: 'cms_section_customer_profiles' },
      { key: 'technicalAttributes', table: 'cms_section_technical_attributes' },
      { key: 'salesFinancing', table: 'cms_section_sales_financing' },
      { key: 'socialImpact', table: 'cms_section_social_impact' },
      { key: 'contactForm', table: 'cms_section_contact' },
      { key: 'footer', table: 'cms_section_footer' },
      { key: 'seo', table: 'cms_section_seo' },
    ];

    await Promise.all(
      sectionQueries.map(async ({ key, table }) => {
        try {
          const [rows]: any = await p.query(`SELECT data_json FROM ${table} ORDER BY updated_at DESC LIMIT 1;`);
          if (rows && rows.length > 0 && rows[0].data_json) {
            const parsed = JSON.parse(rows[0].data_json);
            if (parsed && typeof parsed === 'object') {
              merged[key] = parsed;
            }
          }
        } catch {}
      })
    );

    try {
      const dbModels = await getModels();
      if (dbModels && Array.isArray(dbModels) && dbModels.length > 0) {
        if (!merged.housingModels) {
          merged.housingModels = { ...(fallback?.housingModels || {}), models: dbModels };
        } else {
          merged.housingModels.models = dbModels;
        }
      }
    } catch {}

    return merged;
  } catch (err: any) {
    console.error('[DB] getAllContentMerged error:', err.message);
    return fallback;
  }
}

export async function saveContent(content: any, version = 1, note = ''): Promise<boolean> {
  try {
    const p = getPool();
    const contentStr = JSON.stringify(content);
    await p.query(
      `INSERT INTO cms_content (id, content_json, version, updated_at)
       VALUES ("global_content", ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         content_json = VALUES(content_json),
         version = VALUES(version),
         updated_at = NOW();`,
      [contentStr, version]
    );

    // Save history snapshot
    try {
      await p.query(
        `INSERT INTO cms_history (version, note, content_json, created_at)
         VALUES (?, ?, ?, NOW());`,
        [version, note || `Actualización v${version}`, contentStr]
      );
    } catch {}

    return true;
  } catch (err: any) {
    console.error('[DB] saveContent error:', err.message);
    return false;
  }
}

export async function saveSection(sectionKey: string, sectionData: any): Promise<boolean> {
  const tableMap: Record<string, string> = {
    site: 'cms_section_site',
    hero: 'cms_section_hero',
    valueProp: 'cms_section_value_prop',
    location: 'cms_section_location',
    masterPlan: 'cms_section_master_plan',
    housingModels: 'cms_section_housing_models',
    customerProfiles: 'cms_section_customer_profiles',
    technicalAttributes: 'cms_section_technical_attributes',
    salesFinancing: 'cms_section_sales_financing',
    socialImpact: 'cms_section_social_impact',
    contactForm: 'cms_section_contact',
    footer: 'cms_section_footer',
    seo: 'cms_section_seo',
  };

  const tableName = tableMap[sectionKey];
  if (!tableName) return false;

  try {
    const p = getPool();
    const dataStr = JSON.stringify(sectionData);
    await p.query(
      `INSERT INTO ${tableName} (section_key, data_json, updated_at)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         data_json = VALUES(data_json),
         updated_at = NOW();`,
      [sectionKey, dataStr]
    );

    // Also update global_content cache
    const current = await getContent();
    if (current) {
      current[sectionKey] = sectionData;
      current.lastUpdated = new Date().toISOString();
      await saveContent(current, (current.version || 1) + 1, `Actualizada sección ${sectionKey}`);
    }

    return true;
  } catch (err: any) {
    console.error(`[DB] saveSection(${sectionKey}) error:`, err.message);
    return false;
  }
}

// Leads
export async function getLeads(): Promise<any[]> {
  try {
    const p = getPool();
    const [rows]: any = await p.query('SELECT * FROM leads ORDER BY timestamp DESC;');
    if (rows && rows.length > 0) {
      return rows.map((r: any) => ({
        id: r.id,
        fullName: r.full_name,
        email: r.email,
        phone: r.phone,
        profileInterest: r.profile_interest,
        lotPreference: r.lot_preference,
        modelPreference: r.model_preference,
        message: r.message,
        source: r.source,
        status: r.status,
        timestamp: r.timestamp ? new Date(r.timestamp).toISOString() : new Date().toISOString(),
      }));
    }
  } catch (err: any) {
    console.error('[DB] getLeads error:', err.message);
  }
  return [];
}

export async function saveLead(lead: any): Promise<boolean> {
  try {
    const p = getPool();
    const id = lead.id || `lead-${Date.now()}`;
    await p.query(
      `INSERT INTO leads (id, full_name, email, phone, profile_interest, lot_preference, model_preference, message, source, status, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());`,
      [
        id,
        lead.fullName || '',
        lead.email || '',
        lead.phone || '',
        lead.profileInterest || 'general',
        lead.lotPreference || '',
        lead.modelPreference || '',
        lead.message || '',
        lead.source || 'formulario',
        lead.status || 'nuevo',
      ]
    );
    return true;
  } catch (err: any) {
    console.error('[DB] saveLead error:', err.message);
    return false;
  }
}

export async function updateLeadStatus(id: string, status: string): Promise<boolean> {
  try {
    const p = getPool();
    await p.query('UPDATE leads SET status = ? WHERE id = ?;', [status, id]);
    return true;
  } catch (err: any) {
    console.error('[DB] updateLeadStatus error:', err.message);
    return false;
  }
}

// Users
export async function getUsers(): Promise<any[] | null> {
  try {
    const p = getPool();
    const [rows]: any = await p.query('SELECT data_json FROM app_users;');
    if (rows && rows.length > 0) {
      return rows.map((r: any) => JSON.parse(r.data_json));
    }
  } catch (err: any) {
    console.error('[DB] getUsers error:', err.message);
  }
  return null;
}

export async function saveUser(user: any): Promise<boolean> {
  try {
    const p = getPool();
    const id = user.id || `user-${Date.now()}`;
    const username = user.username || '';
    const name = user.name || '';
    const email = user.email || '';
    const level = Number(user.level) || 3;
    const levelName = user.levelName || 'Editor';
    const password = user.password || 'delirios2025';
    const active = user.active !== false ? 1 : 0;
    const fullUser = { ...user, id, username, name, email, level, levelName, active: active === 1 };
    const dataStr = JSON.stringify(fullUser);

    await p.query(
      `INSERT INTO app_users (id, username, name, email, level, level_name, password_hash, active, data_json, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         username = VALUES(username),
         name = VALUES(name),
         email = VALUES(email),
         level = VALUES(level),
         level_name = VALUES(level_name),
         password_hash = VALUES(password_hash),
         active = VALUES(active),
         data_json = VALUES(data_json),
         updated_at = NOW();`,
      [id, username, name, email, level, levelName, password, active, dataStr]
    );
    return true;
  } catch (err: any) {
    console.error('[DB] saveUser error:', err.message);
    return false;
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const p = getPool();
    await p.query('DELETE FROM app_users WHERE id = ?;', [id]);
    return true;
  } catch (err: any) {
    console.error('[DB] deleteUser error:', err.message);
    return false;
  }
}

// Sections status
export async function getSectionsStatus(): Promise<any[]> {
  const p = getPool();
  const tables = [
    { key: 'site', table: 'cms_section_site' },
    { key: 'hero', table: 'cms_section_hero' },
    { key: 'valueProp', table: 'cms_section_value_prop' },
    { key: 'location', table: 'cms_section_location' },
    { key: 'masterPlan', table: 'cms_section_master_plan' },
    { key: 'housingModels', table: 'cms_section_housing_models' },
    { key: 'customerProfiles', table: 'cms_section_customer_profiles' },
    { key: 'technicalAttributes', table: 'cms_section_technical_attributes' },
    { key: 'salesFinancing', table: 'cms_section_sales_financing' },
    { key: 'socialImpact', table: 'cms_section_social_impact' },
    { key: 'contactForm', table: 'cms_section_contact' },
    { key: 'footer', table: 'cms_section_footer' },
    { key: 'seo', table: 'cms_section_seo' },
  ];

  const results: any[] = [];
  for (const { key, table } of tables) {
    try {
      const [rows]: any = await p.query(`SELECT COUNT(*) as count, MAX(updated_at) as last_updated FROM ${table};`);
      results.push({
        sectionKey: key,
        tableName: table,
        exists: true,
        recordCount: rows[0]?.count || 0,
        lastUpdated: rows[0]?.last_updated,
      });
    } catch {
      results.push({
        sectionKey: key,
        tableName: table,
        exists: false,
        recordCount: 0,
      });
    }
  }
  return results;
}
