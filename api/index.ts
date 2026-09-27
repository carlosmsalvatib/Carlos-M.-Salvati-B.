import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.MARIADB_HOST || '45.79.40.132',
      port: Number(process.env.MARIADB_PORT) || 3306,
      user: process.env.MARIADB_USER || 'siacecom_aapu',
      password: process.env.MARIADB_PASSWORD || 'Admin2104aapu*',
      database: process.env.MARIADB_DATABASE || 'siacecom_misdelirios',
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

const SECTION_TABLE_MAP: Record<string, string> = {
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

// SVG image generator for project assets
function getSvgImage(id: string): string {
  if (id === 'logo') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#84cc16"/><stop offset="100%" stop-color="#4d7c0f"/></linearGradient>
        <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#3d2217"/><stop offset="100%" stop-color="#23130d"/></linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="1" dy="3" stdDeviation="2" flood-opacity="0.3"/></filter>
      </defs>
      <ellipse cx="160" cy="110" rx="145" ry="92" fill="#2d1d13" stroke="#eab308" stroke-width="2.5"/>
      <ellipse cx="160" cy="110" rx="140" ry="87" fill="url(#bgGrad)"/>
      <path id="curveTop" d="M 50 105 A 120 75 0 0 1 270 105" fill="none"/>
      <text font-family="'Playfair Display', Georgia, serif" font-size="21" font-weight="900" fill="#ffffff" letter-spacing="3">
        <textPath href="#curveTop" startOffset="50%" text-anchor="middle">MIS DELIRIOS</textPath>
      </text>
      <g filter="url(#shadow)">
        <path d="M 12 112 L 35 96 L 285 96 L 308 112 L 298 138 L 285 130 L 35 130 L 22 138 Z" fill="url(#bannerGrad)" stroke="#d97706" stroke-width="1.8"/>
        <text x="160" y="122" font-family="'Montserrat', Impact, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="7">RANCH</text>
      </g>
      <text x="160" y="148" font-family="'Montserrat', sans-serif" font-size="7.5" font-weight="800" fill="#fef08a" text-anchor="middle" letter-spacing="1.8">REFUGIO Y TRANQUILIDAD GARANTIZADA</text>
      <text x="160" y="162" font-family="'Montserrat', sans-serif" font-size="6.5" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1.2">CORDERO · EDO. TÁCHIRA · VENEZUELA</text>
    </svg>`;
  }

  if (id === 'hero-landscape') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
      <defs>
        <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="1"><stop offset="0%" stop-color="#93c5fd"/><stop offset="100%" stop-color="#d1fae5"/></linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#sky)"/>
      <path d="M 0 320 Q 250 180 500 280 T 1000 210 Q 1120 260 1200 290 L 1200 675 L 0 675 Z" fill="#1e3a8a" opacity="0.45"/>
      <path d="M 0 360 Q 200 250 480 330 T 950 280 Q 1100 320 1200 350 L 1200 675 L 0 675 Z" fill="#14532d" opacity="0.6"/>
      <path d="M 0 420 Q 280 350 620 410 T 1200 390 L 1200 675 L 0 675 Z" fill="#166534"/>
      <path d="M 0 470 Q 350 400 750 460 T 1200 440 L 1200 675 L 0 675 Z" fill="#15803d"/>
      <path d="M 0 520 Q 420 480 880 530 L 1200 500 L 1200 675 L 0 675 Z" fill="#22c55e"/>
      <g transform="translate(180, 520)">
        <rect x="0" y="0" width="14" height="60" fill="#78350f"/>
        <rect x="110" y="0" width="14" height="60" fill="#78350f"/>
        <rect x="-10" y="-12" width="144" height="16" fill="#84cc16" stroke="#4d7c0f" stroke-width="2" rx="4"/>
        <text x="62" y="-1" font-family="'Montserrat', sans-serif" font-size="8" font-weight="900" fill="#ffffff" text-anchor="middle">MIS DELIRIOS RANCH</text>
      </g>
    </svg>`;
  }

  if (id === 'real-terrain') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
      <rect width="800" height="500" fill="#e2e8f0"/>
      <path d="M 0 160 Q 200 90 420 140 T 800 110 L 800 500 L 0 500 Z" fill="#14532d"/>
      <path d="M 0 240 Q 300 180 580 230 T 800 200 L 800 500 L 0 500 Z" fill="#15803d"/>
      <path d="M 0 310 Q 260 270 540 300 T 800 280 L 800 500 L 0 500 Z" fill="#22c55e"/>
      <circle cx="280" cy="350" r="32" fill="#166534"/>
      <circle cx="310" cy="360" r="24" fill="#15803d"/>
      <text x="400" y="450" font-family="'Montserrat', sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">Sector Salomón - Cordero, Táchira</text>
    </svg>`;
  }

  if (id === 'bamboo-structure') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
      <rect width="800" height="500" fill="#fefce8"/>
      <rect x="100" y="100" width="600" height="300" rx="8" fill="#ca8a04" opacity="0.3"/>
      <text x="400" y="240" font-family="'Montserrat', sans-serif" font-size="22" font-weight="bold" fill="#78350f" text-anchor="middle">Bioconstrucción en Guadua Sismorresistente</text>
      <text x="400" y="275" font-family="'Montserrat', sans-serif" font-size="14" fill="#854d0e" text-anchor="middle">Estructura certificada y ecológica</text>
    </svg>`;
  }

  if (id === 'bulevar-guadua') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
      <rect width="800" height="500" fill="#ecfdf5"/>
      <rect x="50" y="50" width="700" height="400" rx="12" fill="#10b981" opacity="0.2"/>
      <text x="400" y="230" font-family="'Montserrat', sans-serif" font-size="24" font-weight="bold" fill="#065f46" text-anchor="middle">Bulevar de la Guadua (+14.600 m²)</text>
      <text x="400" y="265" font-family="'Montserrat', sans-serif" font-size="15" fill="#047857" text-anchor="middle">Espacio recreativo y social cedido a la comunidad</text>
    </svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
    <rect width="600" height="400" fill="#15803d"/>
    <text x="300" y="200" font-family="'Montserrat', sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">${id.toUpperCase()}</text>
  </svg>`;
}

export default async function handler(req: any, res: any) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawPath = String(req.query?.path || '').replace(/^\/+/, '').replace(/\/+$/, '');
  const method = req.method;

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch {}
  }
  if (!body) body = {};

  try {
    const p = getPool();

    // 1. Health Endpoint
    if (rawPath === 'health') {
      return res.status(200).json({
        status: 'ok',
        server: 'vercel-serverless',
        nodeVersion: process.version,
        time: new Date().toISOString(),
      });
    }

    // 2. Sync polling version
    if (rawPath === 'sync/version' || rawPath === 'sync/stream') {
      return res.status(200).json({
        version: Date.now(),
        contentVersion: 1,
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Dynamic Imagery (SVG)
    if (rawPath.startsWith('images/')) {
      const imgId = rawPath.replace('images/', '').trim();
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.status(200).send(getSvgImage(imgId));
    }

    // 3.1 Uploads handler (Serves videos & images persisted in MariaDB cms_media)
    if (rawPath.startsWith('uploads/')) {
      const filename = rawPath.replace('uploads/', '').trim();
      try {
        const [rows]: any = await p.query(
          'SELECT mime_type, data_base64, size FROM cms_media WHERE filename = ? LIMIT 1;',
          [filename]
        );

        let mimeType = 'video/mp4';
        let buffer: Buffer | null = null;

        if (rows && rows.length > 0 && rows[0].data_base64) {
          mimeType = rows[0].mime_type || (filename.endsWith('.png') ? 'image/png' : filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? 'image/jpeg' : 'video/mp4');
          buffer = Buffer.from(rows[0].data_base64, 'base64');
        } else {
          // If not found by exact filename, check default video fallback if mp4 requested
          if (filename.match(/\.(mp4|webm|mov|avi|mkv)$/i)) {
            const [defRows]: any = await p.query(
              'SELECT mime_type, data_base64, size FROM cms_media WHERE filename = "default_video.mp4" LIMIT 1;'
            );
            if (defRows && defRows.length > 0 && defRows[0].data_base64) {
              mimeType = 'video/mp4';
              buffer = Buffer.from(defRows[0].data_base64, 'base64');
            }
          }
        }

        if (!buffer) {
          return res.status(404).json({ success: false, error: 'Archivo no encontrado' });
        }

        const totalSize = buffer.length;
        const range = req.headers.range;

        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Content-Type', mimeType);

        if (range && mimeType.startsWith('video/')) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
          const chunksize = end - start + 1;
          const chunk = buffer.subarray(start, end + 1);

          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${totalSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': mimeType,
          });
          return res.end(chunk);
        } else {
          res.setHeader('Content-Length', totalSize);
          return res.status(200).send(buffer);
        }
      } catch (uploadErr: any) {
        console.error('Error sirviendo archivo multimedia:', uploadErr);
        return res.status(500).json({ success: false, error: uploadErr.message });
      }
    }

    // 3.2 Upload endpoint (Persists base64 images & videos to MariaDB cms_media)
    if (rawPath === 'upload' && method === 'POST') {
      const { dataUrl, filename, title } = body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ success: false, error: 'dataUrl es requerido' });
      }

      if (!dataUrl.startsWith('data:')) {
        return res.status(200).json({ success: true, url: dataUrl, filename: filename || 'file' });
      }

      const commaIdx = dataUrl.indexOf(',');
      if (commaIdx === -1) {
        return res.status(400).json({ success: false, error: 'Formato base64 no válido' });
      }

      const metaPart = dataUrl.slice(0, commaIdx).toLowerCase();
      const rawBase64 = dataUrl.slice(commaIdx + 1).replace(/\s+/g, '');

      let ext = 'mp4';
      let mimeType = 'video/mp4';
      if (metaPart.includes('jpeg') || metaPart.includes('jpg')) {
        ext = 'jpg';
        mimeType = 'image/jpeg';
      } else if (metaPart.includes('png')) {
        ext = 'png';
        mimeType = 'image/png';
      } else if (metaPart.includes('webp')) {
        ext = 'webp';
        mimeType = 'image/webp';
      } else if (metaPart.includes('svg')) {
        ext = 'svg';
        mimeType = 'image/svg+xml';
      } else if (metaPart.includes('gif')) {
        ext = 'gif';
        mimeType = 'image/gif';
      } else if (metaPart.includes('webm')) {
        ext = 'webm';
        mimeType = 'video/webm';
      } else if (metaPart.includes('pdf')) {
        ext = 'pdf';
        mimeType = 'application/pdf';
      }

      const baseName = (filename || title || 'media')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .slice(0, 35)
        .replace(/-+/g, '-');

      const safeFileName = `${baseName || 'media'}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const buf = Buffer.from(rawBase64, 'base64');

      await p.query(
        `INSERT INTO cms_media (id, filename, mime_type, size, data_base64, section, updated_at)
         VALUES (?, ?, ?, ?, ?, 'propuesta', NOW())
         ON DUPLICATE KEY UPDATE data_base64 = VALUES(data_base64), size = VALUES(size), updated_at = NOW();`,
        [`media-${Date.now()}`, safeFileName, mimeType, buf.length, rawBase64]
      );

      const publicUrl = `/api/uploads/${safeFileName}`;
      return res.status(200).json({
        success: true,
        url: publicUrl,
        filename: safeFileName,
      });
    }

    // 4. Content (GET, POST, RESET)
    if (rawPath === 'content') {
      if (method === 'GET') {
        const [rows]: any = await p.query('SELECT content_json, version FROM cms_content WHERE id = "global_content" LIMIT 1;');
        if (rows && rows.length > 0 && rows[0].content_json) {
          return res.status(200).json({ success: true, data: JSON.parse(rows[0].content_json) });
        }
        return res.status(200).json({ success: true, data: null });
      }

      if (method === 'POST') {
        const nextVersion = (body.version || 1) + 1;
        const updated = { ...body, version: nextVersion, lastUpdated: new Date().toISOString() };
        const contentStr = JSON.stringify(updated);

        await p.query(
          `INSERT INTO cms_content (id, content_json, version, updated_at)
           VALUES ("global_content", ?, ?, NOW())
           ON DUPLICATE KEY UPDATE
             content_json = VALUES(content_json),
             version = VALUES(version),
             updated_at = NOW();`,
          [contentStr, nextVersion]
        );

        // Snapshot in cms_versions
        try {
          await p.query(
            `INSERT INTO cms_versions (version, description, data_json, created_at)
             VALUES (?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE description = VALUES(description), data_json = VALUES(data_json);`,
            [nextVersion, req.query?.note || `Actualización v${nextVersion}`, contentStr]
          );
        } catch {}

        return res.status(200).json({ success: true, data: updated });
      }
    }

    if (rawPath === 'content/reset' && method === 'POST') {
      const [rows]: any = await p.query('SELECT content_json FROM cms_content WHERE id = "global_content" LIMIT 1;');
      if (rows && rows.length > 0) {
        return res.status(200).json({ success: true, data: JSON.parse(rows[0].content_json) });
      }
      return res.status(200).json({ success: true, data: null });
    }

    // 5. Sections (PUT, GET)
    if (rawPath.startsWith('sections/')) {
      const sectionKey = rawPath.replace('sections/', '').trim();

      // DEDICATED HANDLER FOR VALUE PROP / PROPUESTA
      if (sectionKey === 'valueProp' || sectionKey === 'propuesta') {
        if (method === 'GET') {
          const [rows]: any = await p.query('SELECT data_json FROM cms_section_value_prop LIMIT 1;');
          if (rows && rows.length > 0 && rows[0].data_json) {
            try {
              return res.status(200).json({ success: true, data: JSON.parse(rows[0].data_json) });
            } catch {}
          }
          return res.status(200).json({ success: true, data: null });
        }

        if (method === 'PUT' || method === 'POST' || method === 'PATCH') {
          try {
            let existingData: any = {};
            try {
              const [existRows]: any = await p.query('SELECT data_json, title, subtitle, description, image_url, image_alt, video_url, videos_json, columns_count, active FROM cms_section_value_prop LIMIT 1;');
              if (existRows && existRows.length > 0) {
                if (existRows[0].data_json) {
                  existingData = JSON.parse(existRows[0].data_json);
                } else {
                  existingData = existRows[0];
                }
              }
            } catch (existErr) {
              console.warn('[valueProp] No se pudo leer fila existente para merge:', existErr);
            }

            const rawBody = body || {};
            const v = { ...existingData, ...rawBody };
            const id = 'valueProp';
            const title = v.title || '';
            const subtitle = v.subtitle || '';
            const description = v.description || '';
            const imageAlt = v.imageAlt || '';
            let imageUrl = v.imageUrl || '';
            let videoUrl = v.videoUrl || (v.videos && v.videos[0]?.videoUrl) || (v.videos && v.videos[0]?.url) || '';
            let videos = Array.isArray(v.videos) ? [...v.videos] : (Array.isArray(existingData.videos) ? existingData.videos : []);
            const columnsCount = Number(v.columnsCount) || 3;
            const active = v.active !== false ? 1 : 0;

            // Auto-persist any base64 data URLs in videos or imageUrl to cms_media
            if (imageUrl.startsWith('data:')) {
              try {
                const commaIdx = imageUrl.indexOf(',');
                const raw = imageUrl.slice(commaIdx + 1).replace(/\s+/g, '');
                const safeName = `propuesta-img-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.png`;
                await p.query(
                  `INSERT INTO cms_media (id, filename, mime_type, size, data_base64, section, updated_at)
                   VALUES (?, ?, 'image/png', ?, ?, 'propuesta', NOW())
                   ON DUPLICATE KEY UPDATE data_base64 = VALUES(data_base64), size = VALUES(size), updated_at = NOW();`,
                  [`media-${Date.now()}`, safeName, Buffer.from(raw, 'base64').length, raw]
                );
                imageUrl = `/api/uploads/${safeName}`;
                v.imageUrl = imageUrl;
              } catch (e: any) {
                console.warn('Error auto-persisting imageUrl:', e);
              }
            }

            videos = await Promise.all(
              videos.map(async (vid: any, idx: number) => {
                const nextVid = { ...vid };
                const vUrl = nextVid.videoUrl || nextVid.url || '';
                if (vUrl.startsWith('data:')) {
                  try {
                    const commaIdx = vUrl.indexOf(',');
                    const raw = vUrl.slice(commaIdx + 1).replace(/\s+/g, '');
                    const safeName = `propuesta-vid-${idx + 1}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.mp4`;
                    await p.query(
                      `INSERT INTO cms_media (id, filename, mime_type, size, data_base64, section, updated_at)
                       VALUES (?, ?, 'video/mp4', ?, ?, 'propuesta', NOW())
                       ON DUPLICATE KEY UPDATE data_base64 = VALUES(data_base64), size = VALUES(size), updated_at = NOW();`,
                      [`media-${Date.now()}-${idx}`, safeName, Buffer.from(raw, 'base64').length, raw]
                    );
                    nextVid.videoUrl = `/api/uploads/${safeName}`;
                    nextVid.url = `/api/uploads/${safeName}`;
                  } catch (e: any) {
                    console.warn('Error auto-persisting video:', e);
                  }
                }
                if (nextVid.posterUrl && nextVid.posterUrl.startsWith('data:')) {
                  try {
                    const commaIdx = nextVid.posterUrl.indexOf(',');
                    const raw = nextVid.posterUrl.slice(commaIdx + 1).replace(/\s+/g, '');
                    const safeName = `propuesta-poster-${idx + 1}-${Date.now()}.png`;
                    await p.query(
                      `INSERT INTO cms_media (id, filename, mime_type, size, data_base64, section, updated_at)
                       VALUES (?, ?, 'image/png', ?, ?, 'propuesta', NOW())
                       ON DUPLICATE KEY UPDATE data_base64 = VALUES(data_base64), size = VALUES(size), updated_at = NOW();`,
                      [`media-p-${Date.now()}-${idx}`, safeName, Buffer.from(raw, 'base64').length, raw]
                    );
                    nextVid.posterUrl = `/api/uploads/${safeName}`;
                    nextVid.thumbnailUrl = `/api/uploads/${safeName}`;
                  } catch {}
                }
                return nextVid;
              })
            );
            v.videos = videos;
            if (!videoUrl && videos.length > 0) {
              videoUrl = videos[0].videoUrl || videos[0].url || '';
            }

            const videosJson = JSON.stringify(videos);
            const dataJson = JSON.stringify(v);

            await p.query(
              `INSERT INTO cms_section_value_prop (
                id, title, subtitle, description, image_url, image_alt,
                video_url, videos_json, columns_count, active, data_json, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
              ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                subtitle = VALUES(subtitle),
                description = VALUES(description),
                image_url = VALUES(image_url),
                image_alt = VALUES(image_alt),
                video_url = VALUES(video_url),
                videos_json = VALUES(videos_json),
                columns_count = VALUES(columns_count),
                active = VALUES(active),
                data_json = VALUES(data_json),
                updated_at = NOW();`,
              [id, title, subtitle, description, imageUrl, imageAlt, videoUrl, videosJson, columnsCount, active, dataJson]
            );

            // Also update in global_content
            try {
              const [cRows]: any = await p.query('SELECT content_json, version FROM cms_content WHERE id = "global_content" LIMIT 1;');
              if (cRows && cRows.length > 0 && cRows[0].content_json) {
                const current = JSON.parse(cRows[0].content_json);
                current.valueProp = v;
                current.lastUpdated = new Date().toISOString();
                const nextV = (current.version || 1) + 1;
                current.version = nextV;
                await p.query('UPDATE cms_content SET content_json = ?, version = ?, updated_at = NOW() WHERE id = "global_content"', [JSON.stringify(current), nextV]);
              }
            } catch {}

            return res.status(200).json({ success: true, message: 'Propuesta de valor guardada en MariaDB', data: v });
          } catch (valPropErr: any) {
            console.error('Error guardando sección valueProp en MariaDB:', valPropErr);
            return res.status(500).json({ success: false, error: valPropErr.message || 'Error guardando en MariaDB' });
          }
        }
      }

      const tableName = SECTION_TABLE_MAP[sectionKey];

      if (!tableName) {
        return res.status(400).json({ success: false, error: `Sección no válida: ${sectionKey}` });
      }

      if (method === 'GET') {
        const [rows]: any = await p.query(`SELECT data_json FROM ${tableName} ORDER BY updated_at DESC LIMIT 1;`);
        if (rows && rows.length > 0 && rows[0].data_json) {
          return res.status(200).json({ success: true, data: JSON.parse(rows[0].data_json) });
        }
        return res.status(200).json({ success: true, data: null });
      }

      if (method === 'PUT' || method === 'POST') {
        const dataStr = JSON.stringify(body);
        await p.query(
          `INSERT INTO ${tableName} (id, data_json, updated_at)
           VALUES (?, ?, NOW())
           ON DUPLICATE KEY UPDATE data_json = VALUES(data_json), updated_at = NOW();`,
          [sectionKey, dataStr]
        );

        // Update in global_content
        try {
          const [cRows]: any = await p.query('SELECT content_json, version FROM cms_content WHERE id = "global_content" LIMIT 1;');
          if (cRows && cRows.length > 0 && cRows[0].content_json) {
            const current = JSON.parse(cRows[0].content_json);
            current[sectionKey] = body;
            current.lastUpdated = new Date().toISOString();
            const nextV = (current.version || 1) + 1;
            current.version = nextV;
            await p.query('UPDATE cms_content SET content_json = ?, version = ?, updated_at = NOW() WHERE id = "global_content"', [JSON.stringify(current), nextV]);
          }
        } catch {}

        return res.status(200).json({ success: true, data: body });
      }
    }

    // 6. Lots (GET, POST, PUT, DELETE)
    if (rawPath === 'lots') {
      if (method === 'GET') {
        const [rows]: any = await p.query('SELECT data_json FROM lots ORDER BY code ASC;');
        const lots = rows.map((r: any) => JSON.parse(r.data_json));
        return res.status(200).json({ success: true, data: lots });
      }

      if (method === 'POST') {
        const lot = body;
        const id = lot.id || `lot-${lot.code}`;
        const code = lot.code || id;
        const manzana = lot.manzana || '';
        const lote_num = String(lot.loteNum ?? lot.lote ?? '');
        const area = Number(lot.areaM2 ?? lot.area) || 0;
        const price_m2 = Number(lot.priceUsdPerM2 ?? lot.pricePerM2 ?? 20) || 20;
        const total = Number(lot.totalPriceUsd ?? lot.totalPrice) || Math.round(area * price_m2);
        const status = lot.status || 'disponible';
        const dataStr = JSON.stringify({ ...lot, id, code, manzana, loteNum: lote_num, areaM2: area, priceUsdPerM2: price_m2, totalPriceUsd: total, status });

        await p.query(
          `INSERT INTO lots (id, code, manzana, lote_num, area_m2, price_usd_per_m2, total_price_usd, status, data_json, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE
             code = VALUES(code), manzana = VALUES(manzana), lote_num = VALUES(lote_num),
             area_m2 = VALUES(area_m2), price_usd_per_m2 = VALUES(price_usd_per_m2),
             total_price_usd = VALUES(total_price_usd), status = VALUES(status),
             data_json = VALUES(data_json), updated_at = NOW();`,
          [id, code, manzana, lote_num, area, price_m2, total, status, dataStr]
        );

        return res.status(200).json({ success: true, data: JSON.parse(dataStr) });
      }
    }

    if (rawPath === 'lots/bulk-save' && method === 'POST') {
      const lots = Array.isArray(body.lots) ? body.lots : (Array.isArray(body) ? body : []);
      for (const lot of lots) {
        const id = lot.id || `lot-${lot.code}`;
        const code = lot.code || id;
        const manzana = lot.manzana || '';
        const lote_num = String(lot.loteNum ?? lot.lote ?? '');
        const area = Number(lot.areaM2 ?? lot.area) || 0;
        const price_m2 = Number(lot.priceUsdPerM2 ?? lot.pricePerM2 ?? 20) || 20;
        const total = Number(lot.totalPriceUsd ?? lot.totalPrice) || Math.round(area * price_m2);
        const status = lot.status || 'disponible';
        const dataStr = JSON.stringify({ ...lot, id, code });

        await p.query(
          `INSERT INTO lots (id, code, manzana, lote_num, area_m2, price_usd_per_m2, total_price_usd, status, data_json, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE
             code = VALUES(code), manzana = VALUES(manzana), lote_num = VALUES(lote_num),
             area_m2 = VALUES(area_m2), price_usd_per_m2 = VALUES(price_usd_per_m2),
             total_price_usd = VALUES(total_price_usd), status = VALUES(status),
             data_json = VALUES(data_json), updated_at = NOW();`,
          [id, code, manzana, lote_num, area, price_m2, total, status, dataStr]
        );
      }
      return res.status(200).json({ success: true, data: lots });
    }

    if (rawPath.startsWith('lots/')) {
      const lotId = rawPath.replace('lots/', '').trim();
      if (method === 'PUT') {
        const [existing]: any = await p.query('SELECT data_json FROM lots WHERE id = ? LIMIT 1;', [lotId]);
        const currentData = existing.length > 0 ? JSON.parse(existing[0].data_json) : {};
        const updated = { ...currentData, ...body, id: lotId };
        const dataStr = JSON.stringify(updated);

        await p.query(
          `UPDATE lots SET
             status = COALESCE(?, status),
             area_m2 = COALESCE(?, area_m2),
             price_usd_per_m2 = COALESCE(?, price_usd_per_m2),
             total_price_usd = COALESCE(?, total_price_usd),
             data_json = ?,
             updated_at = NOW()
           WHERE id = ?;`,
          [body.status || null, body.areaM2 || null, body.priceUsdPerM2 || null, body.totalPriceUsd || null, dataStr, lotId]
        );
        return res.status(200).json({ success: true, data: updated });
      }

      if (method === 'DELETE') {
        await p.query('DELETE FROM lots WHERE id = ?;', [lotId]);
        return res.status(200).json({ success: true, id: lotId });
      }
    }

    // 7. Housing Models
    if (rawPath === 'models') {
      if (method === 'GET') {
        const [rows]: any = await p.query('SELECT data_json FROM housing_models;');
        const models = rows.map((r: any) => JSON.parse(r.data_json));
        return res.status(200).json({ success: true, data: models });
      }

      if (method === 'POST') {
        const id = body.id || `model-${Date.now()}`;
        const name = body.name || 'Modelo';
        const area = Number(body.areaM2) || 0;
        const price = Number(body.priceUsd) || 0;
        const video = body.videoUrl || '';
        const active = body.active !== false ? 1 : 0;
        const dataStr = JSON.stringify({ ...body, id });

        await p.query(
          `INSERT INTO housing_models (id, name, area_m2, price_usd, video_url, active, data_json, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE name = VALUES(name), area_m2 = VALUES(area_m2), price_usd = VALUES(price_usd), video_url = VALUES(video_url), active = VALUES(active), data_json = VALUES(data_json), updated_at = NOW();`,
          [id, name, area, price, video, active, dataStr]
        );
        return res.status(200).json({ success: true, data: JSON.parse(dataStr) });
      }
    }

    if (rawPath === 'models/bulk-save' && method === 'POST') {
      const models = Array.isArray(body.models) ? body.models : (Array.isArray(body) ? body : []);
      for (const m of models) {
        const id = m.id || `model-${Date.now()}`;
        const name = m.name || 'Modelo';
        const area = Number(m.areaM2) || 0;
        const price = Number(m.priceUsd) || 0;
        const video = m.videoUrl || '';
        const active = m.active !== false ? 1 : 0;
        const dataStr = JSON.stringify({ ...m, id });

        await p.query(
          `INSERT INTO housing_models (id, name, area_m2, price_usd, video_url, active, data_json, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE name = VALUES(name), area_m2 = VALUES(area_m2), price_usd = VALUES(price_usd), video_url = VALUES(video_url), active = VALUES(active), data_json = VALUES(data_json), updated_at = NOW();`,
          [id, name, area, price, video, active, dataStr]
        );
      }
      return res.status(200).json({ success: true, data: models });
    }

    // 8. Leads
    if (rawPath === 'leads') {
      if (method === 'GET') {
        const [rows]: any = await p.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 100;');
        const leads = rows.map((r: any) => {
          try {
            return JSON.parse(r.data_json);
          } catch {
            return {
              id: r.id,
              fullName: r.full_name,
              email: r.email,
              phone: r.phone,
              lotPreference: r.lot_code,
              modelPreference: r.model_name,
              timestamp: r.created_at,
            };
          }
        });
        return res.status(200).json({ success: true, data: leads });
      }

      if (method === 'POST') {
        const id = body.id || `lead-${Date.now()}`;
        const full = { ...body, id, timestamp: body.timestamp || new Date().toISOString() };
        const dataStr = JSON.stringify(full);

        await p.query(
          `INSERT INTO leads (id, full_name, email, phone, lot_code, model_name, data_json, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE data_json = VALUES(data_json);`,
          [id, full.fullName || '', full.email || '', full.phone || '', full.lotPreference || '', full.modelPreference || '', dataStr]
        );
        return res.status(200).json({ success: true, data: full });
      }
    }

    // 9. Users
    if (rawPath === 'users') {
      if (method === 'GET') {
        const [rows]: any = await p.query('SELECT id, username, name, email, level, level_name as levelName, active FROM cms_users;');
        return res.status(200).json({ success: true, data: rows.map((r: any) => ({ ...r, active: !!r.active })) });
      }

      if (method === 'POST') {
        const id = body.id || `user-${Date.now()}`;
        await p.query(
          `INSERT INTO cms_users (id, username, name, email, level, level_name, password, active, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), level = VALUES(level), level_name = VALUES(level_name), password = VALUES(password), active = VALUES(active), updated_at = NOW();`,
          [id, body.username, body.name, body.email, body.level || 3, body.levelName || 'Editor', body.password || 'delirios2025', body.active !== false ? 1 : 0]
        );
        return res.status(200).json({ success: true, data: { ...body, id } });
      }
    }

    if (rawPath.startsWith('users/')) {
      const userId = rawPath.replace('users/', '').trim();
      if (method === 'PUT') {
        await p.query(
          `UPDATE cms_users SET
             name = COALESCE(?, name),
             email = COALESCE(?, email),
             level = COALESCE(?, level),
             level_name = COALESCE(?, level_name),
             password = COALESCE(?, password),
             active = COALESCE(?, active),
             updated_at = NOW()
           WHERE id = ?;`,
          [body.name || null, body.email || null, body.level || null, body.levelName || null, body.password || null, body.active !== undefined ? (body.active ? 1 : 0) : null, userId]
        );
        return res.status(200).json({ success: true, data: { ...body, id: userId } });
      }

      if (method === 'DELETE') {
        await p.query('DELETE FROM cms_users WHERE id = ?;', [userId]);
        return res.status(200).json({ success: true, id: userId });
      }
    }

    // 10. Login
    if (rawPath === 'login' && method === 'POST') {
      const { username, password } = body;
      const [rows]: any = await p.query(
        'SELECT id, username, name, email, level, level_name as levelName, active FROM cms_users WHERE username = ? AND password = ? AND active = 1 LIMIT 1;',
        [String(username).trim(), String(password).trim()]
      );

      if (rows && rows.length > 0) {
        const user = { ...rows[0], active: !!rows[0].active };
        return res.status(200).json({ success: true, user });
      }

      return res.status(401).json({ success: false, error: 'Credenciales inválidas o usuario inactivo' });
    }

    // 11. Sync-all (global save)
    if (rawPath === 'sync-all' && method === 'POST') {
      const { content, lots } = body;
      if (content) {
        const nextV = (content.version || 1) + 1;
        const updatedContent = { ...content, version: nextV, lastUpdated: new Date().toISOString() };
        const contentStr = JSON.stringify(updatedContent);
        await p.query(
          `INSERT INTO cms_content (id, content_json, version, updated_at)
           VALUES ("global_content", ?, ?, NOW())
           ON DUPLICATE KEY UPDATE content_json = VALUES(content_json), version = VALUES(version), updated_at = NOW();`,
          [contentStr, nextV]
        );

        // Also persist valueProp into cms_section_value_prop
        if (content.valueProp && typeof content.valueProp === 'object') {
          try {
            const v = content.valueProp;
            const id = 'valueProp';
            const title = v.title || '';
            const subtitle = v.subtitle || '';
            const description = v.description || '';
            const imageAlt = v.imageAlt || '';
            const imageUrl = v.imageUrl || '';
            const videoUrl = v.videoUrl || (v.videos && v.videos[0]?.videoUrl) || (v.videos && v.videos[0]?.url) || '';
            const videos = Array.isArray(v.videos) ? v.videos : [];
            const columnsCount = Number(v.columnsCount) || 3;
            const active = v.active !== false ? 1 : 0;
            const videosJson = JSON.stringify(videos);
            const dataJson = JSON.stringify(v);

            await p.query(
              `INSERT INTO cms_section_value_prop (
                id, title, subtitle, description, image_url, image_alt,
                video_url, videos_json, columns_count, active, data_json, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
              ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                subtitle = VALUES(subtitle),
                description = VALUES(description),
                image_url = VALUES(image_url),
                image_alt = VALUES(image_alt),
                video_url = VALUES(video_url),
                videos_json = VALUES(videos_json),
                columns_count = VALUES(columns_count),
                active = VALUES(active),
                data_json = VALUES(data_json),
                updated_at = NOW();`,
              [id, title, subtitle, description, imageUrl, imageAlt, videoUrl, videosJson, columnsCount, active, dataJson]
            );
          } catch (vpErr) {
            console.warn('[sync-all] Error persisting valueProp table:', vpErr);
          }
        }
      }
      return res.status(200).json({ success: true, data: { content, lots } });
    }

    // 12. MariaDB Management
    if (rawPath === 'mariadb/status' || rawPath === 'mariadb/test') {
      const [probe]: any = await p.query('SELECT 1 as probe, VERSION() as version;');
      return res.status(200).json({
        success: true,
        connected: true,
        host: '45.79.40.132',
        database: 'siacecom_misdelirios',
        version: probe[0]?.version,
        tablesCreated: true,
      });
    }

    if (rawPath === 'mariadb/sections-status') {
      const results: any[] = [];
      for (const [key, table] of Object.entries(SECTION_TABLE_MAP)) {
        try {
          const [r]: any = await p.query(`SELECT COUNT(*) as count, MAX(updated_at) as last_updated FROM ${table};`);
          results.push({
            sectionKey: key,
            tableName: table,
            exists: true,
            recordCount: r[0]?.count || 0,
            lastUpdated: r[0]?.last_updated,
          });
        } catch {
          results.push({ sectionKey: key, tableName: table, exists: false, recordCount: 0 });
        }
      }
      return res.status(200).json({ success: true, sections: results });
    }

    if (rawPath === 'mariadb/diagnostics' && method === 'POST') {
      const [probe]: any = await p.query('SELECT 1 as probe, VERSION() as version;');
      const [lotsCount]: any = await p.query('SELECT COUNT(*) as c FROM lots;');
      return res.status(200).json({
        success: true,
        connected: true,
        host: '45.79.40.132',
        database: 'siacecom_misdelirios',
        mariadbVersion: probe[0]?.version,
        lotsCount: lotsCount[0]?.c,
      });
    }

    // Default Fallback
    return res.status(200).json({
      success: true,
      service: 'Mis Delirios Ranch API',
      path: rawPath,
      method,
    });
  } catch (err: any) {
    console.error(`[API Error in ${rawPath}]`, err);
    return res.status(500).json({
      success: false,
      error: err.message,
      path: rawPath,
    });
  }
}
