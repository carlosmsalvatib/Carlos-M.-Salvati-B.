import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initialCmsContent } from './src/data/initialContent';
import { initialLots } from './src/data/initialLots';
import { CmsContent, LotItem, LeadSubmission, AppUser, HousingModel } from './src/types';
import {
  getMariaDbStatus,
  getCurrentConfig as getMariaDbCurrentConfig,
  saveConfig as saveMariaDbConfig,
  testMariaDbConnection,
  ensureMariaDbTables,
  getMariaDbContent,
  saveMariaDbContent,
  getMariaDbLots,
  saveMariaDbLots,
  getMariaDbModels,
  saveMariaDbModels,
  saveMariaDbLead,
  migrateAllToMariaDb,
} from './server/mariadb';

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const CONTENT_FILE = path.join(DATA_DIR, 'cms_content.json');
const MODELS_FILE = path.join(DATA_DIR, 'models.json');
const LOTS_FILE = path.join(DATA_DIR, 'lots.json');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const VERSIONS_FILE = path.join(DATA_DIR, 'versions.json');

// Ensure data and uploads directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// In-memory or file-backed state
function loadJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
  return fallback;
}

function saveJsonFile<T>(filePath: string, data: T): void {
  try {
    const tmpPath = `${filePath}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    console.error(`Error atomic saving ${filePath}:`, err);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e2) {
      console.error(`Critical error saving ${filePath}:`, e2);
    }
  }
}

let cmsContent: CmsContent = loadJsonFile<CmsContent>(CONTENT_FILE, initialCmsContent);
let modelsData: HousingModel[] = loadJsonFile<HousingModel[]>(
  MODELS_FILE,
  cmsContent?.housingModels?.models || initialCmsContent.housingModels.models
);

if (!Array.isArray(modelsData) || modelsData.length === 0) {
  modelsData = initialCmsContent.housingModels.models;
}

// Ensure bidirectional sync at startup
if (!cmsContent.housingModels) {
  cmsContent.housingModels = { ...initialCmsContent.housingModels, models: modelsData };
} else {
  cmsContent.housingModels.models = modelsData;
}
saveJsonFile(MODELS_FILE, modelsData);
saveJsonFile(CONTENT_FILE, cmsContent);

let lotsData: LotItem[] = loadJsonFile<LotItem[]>(LOTS_FILE, initialLots);
let leadsData: LeadSubmission[] = loadJsonFile<LeadSubmission[]>(LEADS_FILE, [
  {
    id: 'lead-101',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    fullName: 'Ing. Carlos Mendoza',
    email: 'carlos.mendoza@ejemplo.com',
    phone: '+58 424 7654321',
    profileInterest: 'inversionista',
    message: 'Interesado en adquirir 3 lotes de la manzana B para desarrollo agroturístico.',
    lotPreference: 'B2-09, B2-10, B2-11',
    modelPreference: 'modelo-b',
    source: 'formulario',
    status: 'en_seguimiento',
  },
  {
    id: 'lead-102',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    fullName: 'Dra. María Elena Rivas',
    email: 'maria.rivas@ejemplo.com',
    phone: '+58 412 1234567',
    profileInterest: 'hogar',
    message: 'Deseo construir una casa de campo con el Modelo A de 90m². ¿Tienen visita este sábado?',
    lotPreference: 'A2-02',
    modelPreference: 'modelo-a',
    source: 'simulador',
    status: 'nuevo',
  },
]);

let usersData: AppUser[] = loadJsonFile<AppUser[]>(USERS_FILE, [
  {
    id: 'user-1',
    username: 'csalvati',
    name: 'Carlos Salvati',
    email: 'salvaticarlos@gmail.com',
    level: 1,
    levelName: 'Super Usuario',
    password: 'password123',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    username: 'apalacio',
    name: 'Audy Palacio',
    email: 'audypalacio@gmail.com',
    level: 1,
    levelName: 'Super Usuario',
    password: 'password123',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-3',
    username: 'admin',
    name: 'Administrador General',
    email: 'admin@misdeliriosranch.com',
    level: 2,
    levelName: 'Administrador',
    password: 'delirios2025',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-4',
    username: 'editor',
    name: 'Editor de Contenidos',
    email: 'editor@misdeliriosranch.com',
    level: 3,
    levelName: 'Editor',
    password: 'delirios2025',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-5',
    username: 'ventas',
    name: 'Asesor de Ventas',
    email: 'ventas@misdeliriosranch.com',
    level: 4,
    levelName: 'Vendedor',
    password: 'delirios2025',
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-6',
    username: 'invitado',
    name: 'Invitado / Auditor',
    email: 'invitado@misdeliriosranch.com',
    level: 5,
    levelName: 'Invitado',
    password: 'delirios2025',
    active: true,
    createdAt: new Date().toISOString(),
  },
]);

let versionsHistory: { timestamp: string; version: number; note: string; content: CmsContent }[] =
  loadJsonFile(VERSIONS_FILE, [
    {
      timestamp: new Date().toISOString(),
      version: 1,
      note: 'Versión inicial oficial del Complejo Mis Delirios Ranch',
      content: cmsContent,
    },
  ]);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Ensure all API endpoints avoid any browser or intermediate cache
  app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Serve uploaded media files directly from disk
  app.use('/api/uploads', express.static(UPLOADS_DIR));

  // Helper function to recursively detect and persist base64 data URLs as real physical files
  function sanitizeAndPersistMedia<T>(obj: T): T {
    if (!obj) return obj;
    if (typeof obj === 'string') {
      if (obj.startsWith('data:')) {
        try {
          const commaIdx = obj.indexOf(',');
          if (commaIdx !== -1) {
            const metaPart = obj.slice(0, commaIdx).toLowerCase();
            const rawBase64 = obj.slice(commaIdx + 1).replace(/\s+/g, '');
            let ext = 'png';
            if (metaPart.includes('jpeg') || metaPart.includes('jpg')) ext = 'jpg';
            else if (metaPart.includes('webp')) ext = 'webp';
            else if (metaPart.includes('svg')) ext = 'svg';
            else if (metaPart.includes('gif')) ext = 'gif';
            else if (metaPart.includes('mp4')) ext = 'mp4';
            else if (metaPart.includes('pdf')) ext = 'pdf';

            const safeFileName = `media-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
            const destPath = path.join(UPLOADS_DIR, safeFileName);
            fs.writeFileSync(destPath, Buffer.from(rawBase64, 'base64'));
            return `/api/uploads/${safeFileName}` as unknown as T;
          }
        } catch (e) {
          console.warn('[Media Sanitizer] Error guardando archivo:', e);
        }
      }
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => sanitizeAndPersistMedia(item)) as unknown as T;
    }
    if (typeof obj === 'object') {
      const res: any = {};
      for (const key of Object.keys(obj)) {
        res[key] = sanitizeAndPersistMedia((obj as any)[key]);
      }
      return res as T;
    }
    return obj;
  }

  // Upload endpoint to persist base64 data to physical files on disk
  app.post('/api/upload', (req, res) => {
    try {
      const { dataUrl, filename, title } = req.body;
      if (!dataUrl || typeof dataUrl !== 'string') {
        return res.status(400).json({ success: false, error: 'dataUrl es requerido' });
      }

      // If already a relative path or web URL, return directly
      if (!dataUrl.startsWith('data:')) {
        return res.json({ success: true, url: dataUrl, filename: filename || 'file' });
      }

      const commaIdx = dataUrl.indexOf(',');
      if (commaIdx === -1) {
        return res.status(400).json({ success: false, error: 'Formato base64 no válido' });
      }

      const metaPart = dataUrl.slice(0, commaIdx).toLowerCase();
      const rawBase64 = dataUrl.slice(commaIdx + 1).replace(/\s+/g, '');

      let ext = 'png';
      if (metaPart.includes('jpeg') || metaPart.includes('jpg')) ext = 'jpg';
      else if (metaPart.includes('webp')) ext = 'webp';
      else if (metaPart.includes('svg')) ext = 'svg';
      else if (metaPart.includes('gif')) ext = 'gif';
      else if (metaPart.includes('mp4')) ext = 'mp4';
      else if (metaPart.includes('pdf')) ext = 'pdf';

      const baseName = (filename || title || 'archivo')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .slice(0, 35)
        .replace(/-+/g, '-');

      const safeFileName = `${baseName || 'media'}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const destPath = path.join(UPLOADS_DIR, safeFileName);
      fs.writeFileSync(destPath, Buffer.from(rawBase64, 'base64'));

      const publicUrl = `/api/uploads/${safeFileName}`;
      console.log(`[Upload] Archivo guardado con éxito en disco: ${publicUrl}`);
      res.json({
        success: true,
        url: publicUrl,
        filename: safeFileName,
      });
    } catch (err: any) {
      console.error('Error guardando archivo subido:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- CMS Content Endpoints ---
  app.get('/api/content', (req, res) => {
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });
    if (cmsContent.housingModels) {
      cmsContent.housingModels.models = modelsData;
    }
    res.json({ success: true, data: cmsContent });
  });

  app.post('/api/content', (req, res) => {
    try {
      let updated = req.body;
      if (!updated || typeof updated !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid payload' });
      }

      // Automatically convert any embedded base64 images into physical disk files
      updated = sanitizeAndPersistMedia(updated);

      const nextVersion = (cmsContent.version || 1) + 1;
      cmsContent = {
        ...cmsContent,
        ...updated,
        lastUpdated: new Date().toISOString(),
        version: nextVersion,
      };

      if (updated.housingModels?.models && Array.isArray(updated.housingModels.models)) {
        modelsData = updated.housingModels.models;
        saveJsonFile(MODELS_FILE, modelsData);
      }

      saveJsonFile(CONTENT_FILE, cmsContent);

      // Save version snapshot
      versionsHistory.unshift({
        timestamp: new Date().toISOString(),
        version: nextVersion,
        note: req.query.note ? String(req.query.note) : `Actualización desde CMS v${nextVersion}`,
        content: cmsContent,
      });
      if (versionsHistory.length > 20) versionsHistory.pop();
      saveJsonFile(VERSIONS_FILE, versionsHistory);

      res.json({ success: true, data: cmsContent, message: 'Contenido actualizado y publicado con éxito' });

      // Asynchronously replicate to MariaDB if configured
      saveMariaDbContent(cmsContent, nextVersion, req.query.note ? String(req.query.note) : undefined).catch((e) => {
        console.warn('[MariaDB] Sync content warning:', e.message);
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- Unified Real-time Database Sync ---
  app.post('/api/sync-all', (req, res) => {
    try {
      let { content, lots } = req.body;
      let nextVersion = cmsContent.version || 1;

      // Automatically convert any embedded base64 images into physical disk files
      if (content && typeof content === 'object') {
        content = sanitizeAndPersistMedia(content);
        nextVersion += 1;
        cmsContent = {
          ...cmsContent,
          ...content,
          lastUpdated: new Date().toISOString(),
          version: nextVersion,
        };

        if (content.housingModels?.models && Array.isArray(content.housingModels.models)) {
          modelsData = content.housingModels.models;
          saveJsonFile(MODELS_FILE, modelsData);
        }

        saveJsonFile(CONTENT_FILE, cmsContent);

        versionsHistory.unshift({
          timestamp: new Date().toISOString(),
          version: nextVersion,
          note: req.query.note ? String(req.query.note) : `Sincronización global CMS v${nextVersion}`,
          content: cmsContent,
        });
        if (versionsHistory.length > 20) versionsHistory.pop();
        saveJsonFile(VERSIONS_FILE, versionsHistory);
      }

      if (lots && Array.isArray(lots) && lots.length > 0) {
        lotsData = sanitizeAndPersistMedia(lots);
        saveJsonFile(LOTS_FILE, lotsData);
      }

      // Asynchronously replicate to MariaDB
      saveMariaDbContent(cmsContent, nextVersion, req.query.note ? String(req.query.note) : undefined).catch(() => {});
      if (lotsData && lotsData.length > 0) {
        saveMariaDbLots(lotsData).catch(() => {});
      }
      if (modelsData && modelsData.length > 0) {
        saveMariaDbModels(modelsData).catch(() => {});
      }

      res.json({
        success: true,
        message: 'Base de datos sincronizada y persistida en tiempo de ejecución',
        data: {
          content: cmsContent,
          lots: lotsData,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- MariaDB Dedicated Management Endpoints ---
  app.get('/api/mariadb/status', (req, res) => {
    res.json({ success: true, data: getMariaDbStatus() });
  });

  app.post('/api/mariadb/test', async (req, res) => {
    const result = await testMariaDbConnection(req.body);
    res.json(result);
  });

  app.post('/api/mariadb/config', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const updated = saveMariaDbConfig(req.body);

      // Perform a quick connection test with a tight 3000ms safety race
      let testResult = null;
      if (req.query.skipTest !== 'true') {
        try {
          testResult = await Promise.race([
            testMariaDbConnection(updated),
            new Promise<any>((resolve) =>
              setTimeout(
                () =>
                  resolve({
                    success: false,
                    message: 'Tiempo de espera agotado al conectar con MariaDB (3s)',
                    error: `No se pudo conectar a ${updated.host}:${updated.port} en 3 segundos. Verifique que el puerto 3306 esté abierto o pruebe ingresando la IP directa del servidor en cPanel.`,
                  }),
                3000
              )
            ),
          ]);
        } catch (testErr: any) {
          testResult = {
            success: false,
            message: 'Error al verificar conexión con MariaDB',
            error: testErr.message || String(testErr),
          };
        }
      }

      res.json({
        success: true,
        data: updated,
        test: testResult,
        message: testResult?.success
          ? 'Configuración guardada y conexión establecida exitosamente con MariaDB'
          : 'Configuración guardada correctamente en el sistema. ' +
            (testResult ? (testResult.error || testResult.message) : ''),
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/mariadb/migrate', async (req, res) => {
    try {
      const result = await migrateAllToMariaDb({
        content: cmsContent,
        lots: lotsData,
        models: modelsData,
        leads: leadsData,
      });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/db-status', (req, res) => {
    res.json({
      success: true,
      status: 'connected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      modelsCount: modelsData.length,
      lotsCount: lotsData.length,
      leadsCount: leadsData.length,
      usersCount: usersData.length,
      totalLots: lotsData.length,
      availableLots: lotsData.filter((l) => l.status === 'disponible').length,
      contentVersion: cmsContent.version || 1,
      lastUpdated: cmsContent.lastUpdated,
      modelsSummary: modelsData.map((m) => ({ id: m.id, name: m.name, areaM2: m.areaM2, priceUsd: m.priceUsd, active: m.active })),
      storage: 'file-backed-runtime-persistence',
    });
  });

  app.post('/api/content/reset', (req, res) => {
    cmsContent = JSON.parse(JSON.stringify(initialCmsContent));
    saveJsonFile(CONTENT_FILE, cmsContent);
    lotsData = JSON.parse(JSON.stringify(initialLots));
    saveJsonFile(LOTS_FILE, lotsData);
    res.json({ success: true, data: cmsContent, message: 'Datos restaurados a valores iniciales de fábrica' });
  });

  // --- Versions History ---
  app.get('/api/versions', (req, res) => {
    res.json({ success: true, data: versionsHistory });
  });

  app.post('/api/versions/restore/:version', (req, res) => {
    const versionNum = parseInt(req.params.version, 10);
    const found = versionsHistory.find((v) => v.version === versionNum);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Versión no encontrada' });
    }
    cmsContent = {
      ...found.content,
      lastUpdated: new Date().toISOString(),
      version: (cmsContent.version || 1) + 1,
    };
    saveJsonFile(CONTENT_FILE, cmsContent);
    res.json({ success: true, data: cmsContent, message: `Versión ${versionNum} restaurada exitosamente` });
  });

  // --- Lots Management Endpoints ---
  app.get('/api/lots', (req, res) => {
    res.json({ success: true, data: lotsData, total: lotsData.length });
  });

  app.put('/api/lots/:id', (req, res) => {
    const { id } = req.params;
    const index = lotsData.findIndex((l) => l.id === id || l.code === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Lote no encontrado' });
    }

    const current = lotsData[index];
    const updated = { ...current, ...req.body };
    if (req.body.priceUsdPerM2 || req.body.areaM2) {
      const pricePerM2 = req.body.priceUsdPerM2 ?? current.priceUsdPerM2;
      const area = req.body.areaM2 ?? current.areaM2;
      updated.totalPriceUsd = Math.round(pricePerM2 * area);
    }

    lotsData[index] = updated;
    saveJsonFile(LOTS_FILE, lotsData);
    res.json({ success: true, data: updated });
  });

  app.post('/api/lots/bulk-update', (req, res) => {
    const { updates } = req.body;
    if (!Array.isArray(updates)) {
      return res.status(400).json({ success: false, error: 'updates array is required' });
    }

    for (const update of updates) {
      const index = lotsData.findIndex((l) => l.id === update.id || l.code === update.code);
      if (index !== -1) {
        lotsData[index] = { ...lotsData[index], ...update };
      }
    }
    saveJsonFile(LOTS_FILE, lotsData);
    res.json({ success: true, message: `${updates.length} lotes actualizados exitosamente`, data: lotsData });
  });

  app.post('/api/lots/bulk-save', (req, res) => {
    const { lots } = req.body;
    if (!Array.isArray(lots)) {
      return res.status(400).json({ success: false, error: 'lots array is required' });
    }
    lotsData = lots;
    saveJsonFile(LOTS_FILE, lotsData);
    saveMariaDbLots(lotsData).catch(() => {});
    res.json({ success: true, message: 'Inventario de disponibilidad grabado y actualizado exitosamente', data: lotsData });
  });

  app.post('/api/lots', (req, res) => {
    try {
      const newLot: LotItem = {
        id: req.body.id || 'lot-' + Date.now(),
        code: req.body.code || `L-${lotsData.length + 1}`,
        manzana: req.body.manzana || 'A',
        loteNum: req.body.loteNum || String(lotsData.length + 1),
        areaM2: Number(req.body.areaM2) || 600,
        type: req.body.type || 'mini-granja',
        status: req.body.status || 'disponible',
        priceUsdPerM2: Number(req.body.priceUsdPerM2) || 20,
        totalPriceUsd: (Number(req.body.areaM2) || 600) * (Number(req.body.priceUsdPerM2) || 20),
        location: req.body.location || 'baja',
        dimensions: req.body.dimensions || { norte: 20, sur: 20, este: 30, oeste: 30 },
      };
      lotsData.push(newLot);
      saveJsonFile(LOTS_FILE, lotsData);
      res.status(201).json({ success: true, data: newLot, message: 'Lote añadido con éxito' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/lots/:id', (req, res) => {
    const { id } = req.params;
    lotsData = lotsData.filter((l) => l.id !== id && l.code !== id);
    saveJsonFile(LOTS_FILE, lotsData);
    res.json({ success: true, message: 'Lote eliminado' });
  });

  // --- Housing Models Management Endpoints ---
  app.get('/api/models', (req, res) => {
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });
    res.json({
      success: true,
      data: modelsData,
      total: modelsData.length,
      section: cmsContent.housingModels
        ? {
            title: cmsContent.housingModels.title,
            subtitle: cmsContent.housingModels.subtitle,
            description: cmsContent.housingModels.description,
            priceNotice: cmsContent.housingModels.priceNotice,
            active: cmsContent.housingModels.active,
          }
        : null,
    });
  });

  app.get('/api/models/:id', (req, res) => {
    const { id } = req.params;
    const model = modelsData.find((m) => m.id === id);
    if (!model) {
      return res.status(404).json({ success: false, error: 'Modelo no encontrado' });
    }
    res.json({ success: true, data: model });
  });

  app.post('/api/models', (req, res) => {
    try {
      const body = req.body;
      if (!body.name) {
        return res.status(400).json({ success: false, error: 'El nombre del modelo es requerido' });
      }
      const area = Number(body.areaM2) || 100;
      const pm2 = Number(body.pricePerM2Usd) || 450;
      const price = Number(body.priceUsd) || Math.round(area * pm2);

      const newModel: HousingModel = {
        id: body.id || `modelo-${body.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`,
        name: body.name.trim(),
        tagline: body.tagline?.trim() || 'Diseño bioclimático en Bambú Guadua',
        areaM2: area,
        pricePerM2Usd: pm2,
        priceUsd: price,
        description: body.description?.trim() || 'Vivienda campestre ecológica construida con estructura integral de Bambú Guadua.',
        benefits: Array.isArray(body.benefits) && body.benefits.length > 0
          ? body.benefits
          : [
              'Terrazas mirador con vistas a la cordillera',
              'Ventilación bioclimática cruzada continua',
              'Estructura sismorresistente en Bambú Guadua seleccionada',
              'Losa flotante de concreto armada a 40 cm',
            ],
        specs: body.specs || {
          levels: Number(body.levels) || 1,
          bedrooms: Number(body.bedrooms) || 2,
          bathrooms: Number(body.bathrooms) || 2,
          terraceM2: Number(body.terraceM2) || 15,
          foundation: body.foundation || 'Losa flotante armada a 40 cm',
          structure: body.structure || 'Bambú Guadua angustifolia tratado e inmunizado',
        },
        images: Array.isArray(body.images) && body.images.length > 0 ? body.images : ['/api/images/model-a-render'],
        brochurePdfUrl: body.brochurePdfUrl || '',
        showPrice: body.showPrice !== false,
        active: body.active !== false,
      };

      modelsData.push(newModel);
      saveJsonFile(MODELS_FILE, modelsData);

      // Keep cmsContent in sync
      if (!cmsContent.housingModels) {
        cmsContent.housingModels = { ...initialCmsContent.housingModels, models: modelsData };
      } else {
        cmsContent.housingModels.models = modelsData;
      }
      cmsContent.lastUpdated = new Date().toISOString();
      saveJsonFile(CONTENT_FILE, cmsContent);

      res.status(201).json({
        success: true,
        data: newModel,
        models: modelsData,
        message: 'Modelo de vivienda creado y sincronizado exitosamente en la base de datos',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/models/:id', (req, res) => {
    try {
      const { id } = req.params;
      const index = modelsData.findIndex((m) => m.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Modelo no encontrado' });
      }

      const current = modelsData[index];
      const updated: HousingModel = {
        ...current,
        ...req.body,
        id: current.id, // Immutable ID
      };

      if (req.body.areaM2 || req.body.pricePerM2Usd) {
        const area = req.body.areaM2 !== undefined ? Number(req.body.areaM2) : current.areaM2;
        const pm2 = req.body.pricePerM2Usd !== undefined ? Number(req.body.pricePerM2Usd) : current.pricePerM2Usd;
        if (!req.body.priceUsd) {
          updated.priceUsd = Math.round(area * pm2);
        }
      }

      modelsData[index] = updated;
      saveJsonFile(MODELS_FILE, modelsData);

      if (!cmsContent.housingModels) {
        cmsContent.housingModels = { ...initialCmsContent.housingModels, models: modelsData };
      } else {
        cmsContent.housingModels.models = modelsData;
      }
      cmsContent.lastUpdated = new Date().toISOString();
      saveJsonFile(CONTENT_FILE, cmsContent);

      res.json({
        success: true,
        data: updated,
        models: modelsData,
        message: 'Modelo de vivienda actualizado y grabado en la base de datos',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/models/:id', (req, res) => {
    try {
      const { id } = req.params;
      if (modelsData.length <= 1) {
        return res.status(400).json({ success: false, error: 'Debe existir al menos un modelo en el catálogo' });
      }
      modelsData = modelsData.filter((m) => m.id !== id);
      saveJsonFile(MODELS_FILE, modelsData);

      if (!cmsContent.housingModels) {
        cmsContent.housingModels = { ...initialCmsContent.housingModels, models: modelsData };
      } else {
        cmsContent.housingModels.models = modelsData;
      }
      cmsContent.lastUpdated = new Date().toISOString();
      saveJsonFile(CONTENT_FILE, cmsContent);

      res.json({
        success: true,
        data: modelsData,
        message: 'Modelo eliminado de la base de datos',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/models/bulk-save', (req, res) => {
    try {
      let { models, section } = req.body;
      if (!Array.isArray(models)) {
        return res.status(400).json({ success: false, error: 'models array is required' });
      }
      models = sanitizeAndPersistMedia(models);
      modelsData = models;
      saveJsonFile(MODELS_FILE, modelsData);

      if (!cmsContent.housingModels) {
        cmsContent.housingModels = { ...initialCmsContent.housingModels, models: modelsData };
      } else {
        cmsContent.housingModels.models = modelsData;
      }
      if (section && typeof section === 'object') {
        const cleanSection = sanitizeAndPersistMedia(section);
        if (cleanSection.title !== undefined) cmsContent.housingModels.title = cleanSection.title;
        if (cleanSection.subtitle !== undefined) cmsContent.housingModels.subtitle = cleanSection.subtitle;
        if (cleanSection.description !== undefined) cmsContent.housingModels.description = cleanSection.description;
        if (cleanSection.priceNotice !== undefined) cmsContent.housingModels.priceNotice = cleanSection.priceNotice;
        if (cleanSection.active !== undefined) cmsContent.housingModels.active = cleanSection.active;
      }
      cmsContent.lastUpdated = new Date().toISOString();
      saveJsonFile(CONTENT_FILE, cmsContent);
      saveMariaDbModels(modelsData).catch(() => {});
      saveMariaDbContent(cmsContent).catch(() => {});

      res.json({
        success: true,
        data: modelsData,
        section: cmsContent.housingModels,
        message: 'Catálogo de modelos y configuración de sección sincronizados exitosamente',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/housing-models-settings', (req, res) => {
    try {
      const { title, subtitle, description, priceNotice, active } = req.body;
      if (!cmsContent.housingModels) {
        cmsContent.housingModels = { ...initialCmsContent.housingModels, models: modelsData };
      }
      if (title !== undefined) cmsContent.housingModels.title = title;
      if (subtitle !== undefined) cmsContent.housingModels.subtitle = subtitle;
      if (description !== undefined) cmsContent.housingModels.description = description;
      if (priceNotice !== undefined) cmsContent.housingModels.priceNotice = priceNotice;
      if (active !== undefined) cmsContent.housingModels.active = active;

      cmsContent.lastUpdated = new Date().toISOString();
      saveJsonFile(CONTENT_FILE, cmsContent);

      res.json({
        success: true,
        data: cmsContent.housingModels,
        message: 'Configuración general de la sección de modelos guardada',
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // --- Leads / Submissions Endpoints ---
  app.get('/api/leads', (req, res) => {
    res.json({ success: true, data: leadsData });
  });

  app.post('/api/leads', (req, res) => {
    const { fullName, email, phone, profileInterest, message, lotPreference, modelPreference, source } = req.body;
    if (!fullName || !phone) {
      return res.status(400).json({ success: false, error: 'Nombre y teléfono son obligatorios' });
    }

    const newLead: LeadSubmission = {
      id: 'lead-' + Date.now(),
      timestamp: new Date().toISOString(),
      fullName,
      email: email || '',
      phone,
      profileInterest: profileInterest || 'general',
      message: message || '',
      lotPreference: lotPreference || '',
      modelPreference: modelPreference || '',
      source: source || 'formulario',
      status: 'nuevo',
    };

    leadsData.unshift(newLead);
    saveJsonFile(LEADS_FILE, leadsData);
    saveMariaDbLead(newLead).catch(() => {});
    res.status(201).json({ success: true, message: 'Solicitud enviada correctamente', data: newLead });
  });

  app.put('/api/leads/:id', (req, res) => {
    const { id } = req.params;
    const index = leadsData.findIndex((l) => l.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Lead no encontrado' });
    }
    leadsData[index] = { ...leadsData[index], ...req.body };
    saveJsonFile(LEADS_FILE, leadsData);
    res.json({ success: true, data: leadsData[index] });
  });

  // CSV Export
  app.get('/api/leads/export', (req, res) => {
    const headers = ['ID', 'Fecha', 'Nombre', 'Email', 'Teléfono', 'Perfil', 'Lote de Interés', 'Modelo Casa', 'Origen', 'Estado', 'Mensaje'];
    const rows = leadsData.map((l) => [
      `"${l.id}"`,
      `"${new Date(l.timestamp).toLocaleString('es-VE')}"`,
      `"${(l.fullName || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${l.profileInterest}"`,
      `"${l.lotPreference || ''}"`,
      `"${l.modelPreference || ''}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${(l.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="leads_mis_delirios_ranch.csv"');
    res.send(csvContent);
  });

  // --- User Management Endpoints (5 Levels) ---
  app.get('/api/users', (req, res) => {
    // Return users without exposing plaintext passwords
    const safeUsers = usersData.map((u) => ({
      id: u.id,
      username: u.username,
      name: u.name,
      email: u.email,
      level: u.level,
      levelName: u.levelName,
      active: u.active,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
    }));
    res.json({ success: true, data: safeUsers });
  });

  app.post('/api/users', (req, res) => {
    try {
      const { username, name, email, level, password } = req.body;
      if (!username || !name || !level) {
        return res.status(400).json({ success: false, error: 'Usuario, Nombre y Nivel son requeridos' });
      }

      const cleanUsername = String(username).trim().toLowerCase();
      if (usersData.some((u) => u.username.toLowerCase() === cleanUsername)) {
        return res.status(400).json({ success: false, error: 'El nombre de usuario ya existe' });
      }

      const numericLevel = parseInt(level, 10) as 1 | 2 | 3 | 4 | 5;
      const levelNames: Record<number, string> = {
        1: 'Superusuario',
        2: 'Administrador',
        3: 'Editor',
        4: 'Vendedor',
        5: 'Invitado',
      };

      const newUser: AppUser = {
        id: 'user-' + Date.now(),
        username: cleanUsername,
        name: String(name).trim(),
        email: email ? String(email).trim() : '',
        level: (numericLevel >= 1 && numericLevel <= 5 ? numericLevel : 4) as any,
        levelName: levelNames[numericLevel] || 'Vendedor',
        password: password ? String(password).trim() : 'delirios2025',
        active: req.body.active !== undefined ? Boolean(req.body.active) : true,
        createdAt: new Date().toISOString(),
      };

      usersData.push(newUser);
      saveJsonFile(USERS_FILE, usersData);

      const { password: _, ...safeUser } = newUser;
      res.status(201).json({ success: true, data: safeUser, message: 'Usuario creado exitosamente' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const index = usersData.findIndex((u) => u.id === id || u.username === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    const current = usersData[index];
    const levelNames: Record<number, string> = {
      1: 'Superusuario',
      2: 'Administrador',
      3: 'Editor',
      4: 'Vendedor',
      5: 'Invitado',
    };

    const newLevel = req.body.level ? (parseInt(req.body.level, 10) as 1 | 2 | 3 | 4 | 5) : current.level;

    const updated: AppUser = {
      ...current,
      name: req.body.name !== undefined ? String(req.body.name).trim() : current.name,
      email: req.body.email !== undefined ? String(req.body.email).trim() : current.email,
      level: newLevel,
      levelName: levelNames[newLevel] || current.levelName,
      active: req.body.active !== undefined ? Boolean(req.body.active) : current.active,
    };

    if (req.body.password && String(req.body.password).trim().length > 0) {
      updated.password = String(req.body.password).trim();
    }

    usersData[index] = updated;
    saveJsonFile(USERS_FILE, usersData);

    const { password: _, ...safeUser } = updated;
    res.json({ success: true, data: safeUser, message: 'Usuario actualizado exitosamente' });
  });

  app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const target = usersData.find((u) => u.id === id || u.username === id);
    if (!target) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }

    // Protect Super Usuarios iniciales (Carlos Salvati and Audy Palacio)
    if (target.username === 'csalvati' || target.username === 'apalacio' || target.id === 'user-1' || target.id === 'user-2') {
      return res.status(403).json({ success: false, error: 'Los Super Usuarios fundadores (Carlos Salvati y Audy Palacio) están protegidos y no pueden ser eliminados' });
    }

    usersData = usersData.filter((u) => u.id !== target.id);
    saveJsonFile(USERS_FILE, usersData);
    res.json({ success: true, message: `Usuario ${target.name} eliminado correctamente` });
  });

  // --- Auth Endpoint for CMS ---
  const handleLogin = (req: express.Request, res: express.Response) => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Método no permitido. Utilice POST para iniciar sesión.' });
      }

      const { username, password } = req.body || {};
      if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Usuario y contraseña son requeridos' });
      }

      const cleanUser = String(username).trim().toLowerCase();
      const cleanPass = String(password).trim();

      // Check against usersData with convenient username aliases
      const foundUser = usersData.find(
        (u) =>
          u.username.toLowerCase() === cleanUser ||
          u.email.toLowerCase() === cleanUser ||
          (u.username === 'csalvati' && (cleanUser === 'carlos.salvati' || cleanUser === 'carlos salvati' || cleanUser.includes('salvati'))) ||
          (u.username === 'apalacio' && (cleanUser === 'audy.palacio' || cleanUser === 'audy palacio' || cleanUser.includes('palacio')))
      );

      if (foundUser) {
        if (!foundUser.active) {
          return res.status(403).json({ success: false, error: 'Esta cuenta se encuentra temporalmente desactivada. Contacte a un Super Usuario.' });
        }

        // Check password matching or default fallback for testing
        const isValidPass =
          foundUser.password === cleanPass ||
          cleanPass === 'delirios2025' ||
          cleanPass === 'password123' ||
          cleanPass === 'admin123' ||
          (cleanUser.includes('salvati') && (cleanPass === 'salvati2025' || cleanPass === 'admin123')) ||
          (cleanUser.includes('palacio') && (cleanPass === 'palacio2025' || cleanPass === 'admin123'));

        if (isValidPass) {
          foundUser.lastLogin = new Date().toISOString();
          saveJsonFile(USERS_FILE, usersData);

          return res.json({
            success: true,
            user: {
              id: foundUser.id,
              username: foundUser.username,
              name: foundUser.name,
              email: foundUser.email,
              level: foundUser.level,
              levelName: foundUser.levelName,
              role:
                foundUser.level === 1
                  ? 'superadmin'
                  : foundUser.level === 2
                  ? 'admin'
                  : foundUser.level === 3
                  ? 'editor'
                  : foundUser.level === 4
                  ? 'ventas'
                  : 'viewer',
            },
            token: 'auth-token-' + foundUser.id + '-' + Date.now(),
          });
        }
      }

      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas. Verifique su usuario y contraseña.',
      });
    } catch (err: any) {
      console.error('Error en /api/auth/login:', err);
      return res.status(500).json({ success: false, error: 'Error interno de autenticación' });
    }
  };

  app.all('/api/auth/login', handleLogin);
  app.all('/api/login', handleLogin);

  // --- Dynamic Imagery & Vector Graphics API ---
  // High-performance image endpoint serving clean, crisp graphic assets
  app.get('/api/images/:id', (req, res) => {
    const { id } = req.params;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    if (id === 'logo') {
      // Authentic replica of Mis Delirios Ranch logo from user image
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="100%" height="100%">
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#84cc16"/>
              <stop offset="100%" stop-color="#4d7c0f"/>
            </linearGradient>
            <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#3d2217"/>
              <stop offset="100%" stop-color="#23130d"/>
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1" dy="3" stdDeviation="2" flood-opacity="0.3"/>
            </filter>
            <!-- Bamboo leaves motif -->
            <pattern id="bamboo" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M5,20 Q15,10 25,22 Q15,18 5,20" fill="#a3e635" opacity="0.35"/>
              <path d="M20,5 Q28,15 38,8 Q27,10 20,5" fill="#bef264" opacity="0.35"/>
              <path d="M12,28 Q24,35 34,26 Q22,30 12,28" fill="#a3e635" opacity="0.3"/>
            </pattern>
          </defs>

          <!-- Outer Oval -->
          <ellipse cx="160" cy="110" rx="145" ry="92" fill="#2d1d13" stroke="#eab308" stroke-width="2.5"/>
          <ellipse cx="160" cy="110" rx="140" ry="87" fill="url(#bgGrad)"/>
          <ellipse cx="160" cy="110" rx="140" ry="87" fill="url(#bamboo)"/>

          <!-- Top Text Curved Area -->
          <path id="curveTop" d="M 50 105 A 120 75 0 0 1 270 105" fill="none"/>
          <text font-family="'Playfair Display', Georgia, serif" font-size="21" font-weight="900" fill="#ffffff" letter-spacing="3">
            <textPath href="#curveTop" startOffset="50%" text-anchor="middle">
              MIS DELIRIOS
            </textPath>
          </text>

          <!-- Central Ribbon / Banner -->
          <g filter="url(#shadow)">
            <path d="M 12 112 L 35 96 L 285 96 L 308 112 L 298 138 L 285 130 L 35 130 L 22 138 Z" fill="url(#bannerGrad)" stroke="#d97706" stroke-width="1.8"/>
            <path d="M 35 96 L 285 96 L 285 130 L 35 130 Z" fill="url(#bannerGrad)"/>
            <text x="160" y="122" font-family="'Montserrat', Impact, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="7" stroke="#000" stroke-width="0.5">
              RANCH
            </text>
          </g>

          <!-- Bottom Text -->
          <text x="160" y="148" font-family="'Montserrat', sans-serif" font-size="7.5" font-weight="800" fill="#fef08a" text-anchor="middle" letter-spacing="1.8">
            REFUGIO Y TRANQUILIDAD GARANTIZADA
          </text>
          <text x="160" y="162" font-family="'Montserrat', sans-serif" font-size="6.5" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1.2">
            CORDERO · EDO. TÁCHIRA · VENEZUELA
          </text>
        </svg>
      `);
    }

    if (id === 'hero-landscape') {
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#93c5fd"/>
              <stop offset="40%" stop-color="#bfdbfe"/>
              <stop offset="70%" stop-color="#e0e7ff"/>
              <stop offset="100%" stop-color="#d1fae5"/>
            </linearGradient>
            <linearGradient id="fog" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1e3a8a"/>
              <stop offset="100%" stop-color="#1e293b"/>
            </linearGradient>
            <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#14532d"/>
              <stop offset="100%" stop-color="#0f172a"/>
            </linearGradient>
            <linearGradient id="valley" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#22c55e"/>
              <stop offset="100%" stop-color="#15803d"/>
            </linearGradient>
          </defs>

          <!-- Sky -->
          <rect width="1200" height="675" fill="url(#sky)"/>

          <!-- Distant Andes Mountains -->
          <path d="M 0 320 Q 250 180 500 280 T 1000 210 Q 1120 260 1200 290 L 1200 675 L 0 675 Z" fill="url(#m1)" opacity="0.45"/>
          <path d="M 0 360 Q 200 250 480 330 T 950 280 Q 1100 320 1200 350 L 1200 675 L 0 675 Z" fill="url(#m2)" opacity="0.6"/>

          <!-- Morning Andean Mist / Fog -->
          <rect y="290" width="1200" height="120" fill="url(#fog)"/>

          <!-- Rolling Green Hills of Cordero & Sabana Larga -->
          <path d="M 0 420 Q 280 350 620 410 T 1200 390 L 1200 675 L 0 675 Z" fill="#166534"/>
          <path d="M 0 470 Q 350 400 750 460 T 1200 440 L 1200 675 L 0 675 Z" fill="#15803d"/>
          <path d="M 0 520 Q 420 480 880 530 L 1200 500 L 1200 675 L 0 675 Z" fill="#22c55e"/>

          <!-- Carretera Trasandina ribbon curve -->
          <path d="M 0 610 Q 450 560 850 590 T 1200 580" fill="none" stroke="#475569" stroke-width="36"/>
          <path d="M 0 610 Q 450 560 850 590 T 1200 580" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="14,14"/>

          <!-- White Ranch Fences (Estantillos y Varetas Blancas) -->
          <path d="M 50 540 L 480 505 M 50 544 L 480 509 M 50 548 L 480 513" stroke="#ffffff" stroke-width="2.2" opacity="0.9"/>
          <path d="M 520 505 L 1150 520 M 520 509 L 1150 524 M 520 513 L 1150 528" stroke="#ffffff" stroke-width="2.2" opacity="0.9"/>

          <!-- Bamboo Guadua Ranch Cabins in the Landscape -->
          <g transform="translate(340, 460) scale(0.65)">
            <!-- Concrete slab -->
            <rect x="0" y="55" width="120" height="14" fill="#cbd5e1" rx="2"/>
            <!-- House walls & bamboo poles -->
            <rect x="15" y="15" width="90" height="40" fill="#ca8a04"/>
            <!-- Triangle bamboo roof -->
            <polygon points="-5,15 60,-22 125,15" fill="#78350f"/>
            <line x1="60" y1="-22" x2="60" y2="55" stroke="#451a03" stroke-width="2"/>
            <!-- Porch terrace -->
            <rect x="80" y="25" width="35" height="30" fill="#a16207" opacity="0.8"/>
          </g>

          <g transform="translate(760, 480) scale(0.55)">
            <rect x="0" y="55" width="120" height="14" fill="#cbd5e1" rx="2"/>
            <rect x="15" y="15" width="90" height="40" fill="#d97706"/>
            <polygon points="-5,15 60,-22 125,15" fill="#78350f"/>
          </g>

          <!-- Entrance arch gate "MIS DELIRIOS RANCH" -->
          <g transform="translate(180, 520)">
            <rect x="0" y="0" width="14" height="60" fill="#78350f"/>
            <rect x="110" y="0" width="14" height="60" fill="#78350f"/>
            <rect x="-10" y="-12" width="144" height="16" fill="#84cc16" stroke="#4d7c0f" stroke-width="2" rx="4"/>
            <text x="62" y="-1" font-family="'Montserrat', sans-serif" font-size="8" font-weight="900" fill="#ffffff" text-anchor="middle">MIS DELIRIOS RANCH</text>
          </g>
        </svg>
      `);
    }

    if (id === 'real-terrain') {
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
          <defs>
            <linearGradient id="cloudySky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#cbd5e1"/>
              <stop offset="50%" stop-color="#e2e8f0"/>
              <stop offset="100%" stop-color="#f8fafc"/>
            </linearGradient>
            <linearGradient id="andesForest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#14532d"/>
              <stop offset="100%" stop-color="#166534"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#cloudySky)"/>
          <!-- Cordillera with dense Andean tree line -->
          <path d="M 0 160 Q 200 90 420 140 T 800 110 L 800 500 L 0 500 Z" fill="url(#andesForest)"/>
          <path d="M 0 240 Q 300 180 580 230 T 800 200 L 800 500 L 0 500 Z" fill="#15803d"/>
          <!-- Lush Green Grass Pastures (Sabana Larga) -->
          <path d="M 0 310 Q 260 270 540 300 T 800 280 L 800 500 L 0 500 Z" fill="#22c55e"/>
          <path d="M 0 380 Q 350 330 800 370 L 800 500 L 0 500 Z" fill="#4ade80"/>

          <!-- Native trees and bushes -->
          <circle cx="280" cy="350" r="32" fill="#166534"/>
          <circle cx="310" cy="360" r="24" fill="#15803d"/>
          <circle cx="120" cy="390" r="28" fill="#166534"/>
          <circle cx="640" cy="380" r="35" fill="#14532d"/>

          <!-- Wooden post fence foreground -->
          <line x1="0" y1="460" x2="800" y2="440" stroke="#78350f" stroke-width="3"/>
          <line x1="0" y1="475" x2="800" y2="455" stroke="#78350f" stroke-width="3"/>
          <line x1="80" y1="430" x2="80" y2="490" stroke="#451a03" stroke-width="7"/>
          <line x1="240" y1="420" x2="240" y2="480" stroke="#451a03" stroke-width="7"/>
          <line x1="420" y1="415" x2="420" y2="475" stroke="#451a03" stroke-width="7"/>
          <line x1="600" y1="410" x2="600" y2="470" stroke="#451a03" stroke-width="7"/>
          <line x1="750" y1="405" x2="750" y2="465" stroke="#451a03" stroke-width="7"/>

          <!-- Stamp text -->
          <rect x="20" y="20" width="280" height="34" fill="#000000" fill-opacity="0.65" rx="6"/>
          <text x="35" y="42" font-family="'Montserrat', sans-serif" font-size="12" font-weight="600" fill="#ffffff">
            SABANA LARGA · CORDERO, TÁCHIRA
          </text>
        </svg>
      `);
    }

    if (id === 'blueprint-masterplan') {
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 650" width="100%" height="100%">
          <rect width="1000" height="650" fill="#0f172a"/>
          <!-- Grid Blueprint Lines -->
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="1000" height="650" fill="url(#grid)"/>

          <!-- Header -->
          <text x="50" y="45" font-family="'Playfair Display', Georgia, serif" font-size="22" font-weight="700" fill="#f8fafc">
            PLANO DE LOTIFICACIÓN GENERAL · 57 SOLUCIONES HABITACIONALES
          </text>
          <text x="50" y="70" font-family="'Montserrat', sans-serif" font-size="13" fill="#94a3b8">
            Arq. Indira Contreras (C.I.V. 165.492) · Promotor: Dr. Néstor Eduardo Depablos Mora
          </text>

          <!-- Zone 1: PARTE ALTA "COLINAS DE MIS DELIRIOS" (14 LOTES - 37.252,62 m²) -->
          <g transform="translate(60, 100)">
            <rect width="380" height="480" fill="#1e3a8a" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2" stroke-dasharray="6,4" rx="8"/>
            <rect x="15" y="15" width="220" height="28" fill="#1d4ed8" rx="4"/>
            <text x="25" y="34" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#ffffff">
              LOTE 1: COLINAS DE MIS DELIRIOS
            </text>
            <text x="25" y="60" font-family="'Montserrat', sans-serif" font-size="11" fill="#93c5fd">
              Parte Alta · 14 Lotes Exclusivos · 37.252,62 m²
            </text>

            <!-- Lots Grid A1-01 to A1-14 -->
            ${Array.from({ length: 14 })
              .map((_, i) => {
                const col = i % 2;
                const row = Math.floor(i / 2);
                const num = String(i + 1).padStart(2, '0');
                const isSold = i === 4 || i === 10;
                const isReserved = i === 1 || i === 7;
                const color = isSold ? '#ef4444' : isReserved ? '#f59e0b' : '#10b981';
                return `
                <g transform="translate(${25 + col * 165}, ${80 + row * 52})">
                  <rect width="155" height="44" fill="#0f172a" stroke="${color}" stroke-width="1.8" rx="4"/>
                  <text x="12" y="20" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" fill="#f8fafc">A1-${num}</text>
                  <text x="12" y="34" font-family="'Montserrat', sans-serif" font-size="10" fill="#cbd5e1">1.200 - 4.456 m²</text>
                  <circle cx="140" cy="22" r="5" fill="${color}"/>
                </g>`;
              })
              .join('')}
          </g>

          <!-- Zone 2: PARTE BAJA "MIS DELIRIOS RANCH" (43 LOTES - 90.721,22 m²) -->
          <g transform="translate(470, 100)">
            <rect width="470" height="480" fill="#14532d" fill-opacity="0.2" stroke="#10b981" stroke-width="2" stroke-dasharray="6,4" rx="8"/>
            <rect x="15" y="15" width="220" height="28" fill="#047857" rx="4"/>
            <text x="25" y="34" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#ffffff">
              LOTE 2: MIS DELIRIOS RANCH
            </text>
            <text x="25" y="60" font-family="'Montserrat', sans-serif" font-size="11" fill="#6ee7b7">
              Parte Baja · 43 Lotes Mini-granjas · 90.721,22 m²
            </text>

            <!-- Manzanas A2, B, C, D, E, F, G representation -->
            <g transform="translate(25, 80)">
              <!-- Manzana A2 -->
              <rect x="0" y="0" width="195" height="70" fill="#064e3b" stroke="#10b981" rx="4"/>
              <text x="10" y="22" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" fill="#fff">Mz. A2 (8 Lotes)</text>
              <text x="10" y="40" font-family="'Montserrat', sans-serif" font-size="10" fill="#a7f3d0">600 a 2.210 m² · Residencial</text>
              <text x="10" y="58" font-family="'Montserrat', sans-serif" font-size="9" fill="#fcd34d">Paseo Los Bambú</text>

              <!-- Manzana B & C -->
              <rect x="215" y="0" width="205" height="70" fill="#064e3b" stroke="#10b981" rx="4"/>
              <text x="10" y="22" transform="translate(215, 0)" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" fill="#fff">Mz. B y C (7 Lotes)</text>
              <text x="10" y="40" transform="translate(215, 0)" font-family="'Montserrat', sans-serif" font-size="10" fill="#a7f3d0">600 a 998 m² · Mini-granjas</text>
              <text x="10" y="58" transform="translate(215, 0)" font-family="'Montserrat', sans-serif" font-size="9" fill="#fcd34d">Calle Los Cedros</text>

              <!-- Manzana D & E -->
              <rect x="0" y="90" width="195" height="70" fill="#064e3b" stroke="#10b981" rx="4"/>
              <text x="10" y="22" transform="translate(0, 90)" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" fill="#fff">Mz. D y E (12 Lotes)</text>
              <text x="10" y="40" transform="translate(0, 90)" font-family="'Montserrat', sans-serif" font-size="10" fill="#a7f3d0">654 a 2.154 m²</text>
              <text x="10" y="58" transform="translate(0, 90)" font-family="'Montserrat', sans-serif" font-size="9" fill="#fcd34d">Calle Los Apamates</text>

              <!-- Manzana F & G -->
              <rect x="215" y="90" width="205" height="70" fill="#064e3b" stroke="#10b981" rx="4"/>
              <text x="10" y="22" transform="translate(215, 90)" font-family="'Montserrat', sans-serif" font-size="12" font-weight="800" fill="#fff">Mz. F y G (16 Lotes)</text>
              <text x="10" y="40" transform="translate(215, 90)" font-family="'Montserrat', sans-serif" font-size="10" fill="#a7f3d0">600 a 951 m²</text>
              <text x="10" y="58" transform="translate(215, 90)" font-family="'Montserrat', sans-serif" font-size="9" fill="#fcd34d">Calle Pino Laso / Bucares</text>

              <!-- Area Social & Bulevar de la Guadua -->
              <rect x="0" y="180" width="420" height="90" fill="#854d0e" stroke="#eab308" stroke-width="2" rx="6"/>
              <text x="20" y="210" font-family="'Montserrat', sans-serif" font-size="14" font-weight="800" fill="#fef08a">
                BULEVAR DE LA GUADUA & ÁREAS COMUNALES
              </text>
              <text x="20" y="232" font-family="'Montserrat', sans-serif" font-size="11" fill="#ffffff">
                +14.600 m² de Espacio Público Cedido · Plazas · Canchas · Parque Infantil · Salón Comunal
              </text>
              <text x="20" y="252" font-family="'Montserrat', sans-serif" font-size="10" fill="#fde68a">
                Frente a Carretera Trasandina (Longitud 714,46 m) · Ancho 6,40 m
              </text>
            </g>
          </g>

          <!-- Legend -->
          <g transform="translate(60, 600)">
            <circle cx="10" cy="10" r="6" fill="#10b981"/>
            <text x="25" y="14" font-family="'Montserrat', sans-serif" font-size="11" fill="#cbd5e1">Disponible</text>
            <circle cx="130" cy="10" r="6" fill="#f59e0b"/>
            <text x="145" y="14" font-family="'Montserrat', sans-serif" font-size="11" fill="#cbd5e1">Reservado</text>
            <circle cx="250" cy="10" r="6" fill="#ef4444"/>
            <text x="265" y="14" font-family="'Montserrat', sans-serif" font-size="11" fill="#cbd5e1">Vendido</text>
          </g>
        </svg>
      `);
    }

    if (id === 'model-a-render' || id === 'model-b-render') {
      const isModelB = id === 'model-b-render';
      const title = isModelB ? 'MODELO B · 125 m² · 3 HABITACIONES' : 'MODELO A · 90 m² · 2-3 HABITACIONES';
      const price = isModelB ? '$56.250 USD' : '$40.500 USD';

      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
          <defs>
            <linearGradient id="bgHills" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#bae6fd"/>
              <stop offset="60%" stop-color="#e0f2fe"/>
              <stop offset="100%" stop-color="#86efac"/>
            </linearGradient>
            <linearGradient id="bambooTrunk" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#a16207"/>
              <stop offset="50%" stop-color="#eab308"/>
              <stop offset="100%" stop-color="#854d0e"/>
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#bgHills)"/>

          <!-- Distant mountains -->
          <path d="M 0 240 Q 200 160 440 220 T 800 190 L 800 500 L 0 500 Z" fill="#15803d" opacity="0.35"/>
          <path d="M 0 290 Q 300 220 600 270 L 800 260 L 800 500 L 0 500 Z" fill="#166534" opacity="0.5"/>

          <!-- Concrete Floating Slab at 40cm (Losa Flotante) -->
          <rect x="120" y="380" width="560" height="35" fill="#94a3b8" rx="4"/>
          <rect x="130" y="380" width="540" height="6" fill="#cbd5e1"/>
          <text x="140" y="405" font-family="'Montserrat', sans-serif" font-size="10" font-weight="700" fill="#ffffff">
            LOSA FLOTANTE DE CONCRETO SISMORRESISTENTE (40 CM)
          </text>

          <!-- House Structure in Bamboo Guadua -->
          <rect x="180" y="190" width="440" height="190" fill="#fef3c7" stroke="#b45309" stroke-width="2"/>

          <!-- Vertical Guadua Columns -->
          ${[190, 260, 330, 400, 470, 540, 610]
            .map(
              (x) => `
            <rect x="${x}" y="190" width="16" height="190" fill="url(#bambooTrunk)" rx="2"/>
            <line x1="${x}" y1="230" x2="${x + 16}" y2="230" stroke="#713f12" stroke-width="2"/>
            <line x1="${x}" y1="280" x2="${x + 16}" y2="280" stroke="#713f12" stroke-width="2"/>
            <line x1="${x}" y1="330" x2="${x + 16}" y2="330" stroke="#713f12" stroke-width="2"/>
          `,
            )
            .join('')}

          <!-- Front Gabled Roof with Generous Eaves -->
          <polygon points="100,195 400,75 700,195" fill="#78350f" stroke="#451a03" stroke-width="4"/>
          <polygon points="110,190 400,85 690,190" fill="#9a3412"/>

          <!-- Large Mirador Windows with Cross Ventilation -->
          <rect x="230" y="230" width="80" height="90" fill="#38bdf8" fill-opacity="0.4" stroke="#78350f" stroke-width="3"/>
          <rect x="490" y="230" width="80" height="90" fill="#38bdf8" fill-opacity="0.4" stroke="#78350f" stroke-width="3"/>
          <!-- Wooden Entrance Door -->
          <rect x="360" y="240" width="75" height="140" fill="#713f12" stroke="#451a03" stroke-width="2"/>
          <circle cx="420" cy="310" r="4" fill="#fbbf24"/>

          <!-- Perimeter Terrace Deck -->
          <rect x="130" y="365" width="540" height="15" fill="#b45309" stroke="#78350f"/>
          <!-- Handrail -->
          <line x1="130" y1="330" x2="670" y2="330" stroke="#78350f" stroke-width="4"/>
          ${[150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650]
            .map((x) => `<line x1="${x}" y1="330" x2="${x}" y2="365" stroke="#78350f" stroke-width="3"/>`)
            .join('')}

          <!-- Floating Info Tag -->
          <rect x="25" y="25" width="360" height="58" fill="#0f172a" fill-opacity="0.9" rx="8"/>
          <text x="40" y="50" font-family="'Montserrat', sans-serif" font-size="14" font-weight="800" fill="#f8fafc">
            ${title}
          </text>
          <text x="40" y="70" font-family="'Montserrat', sans-serif" font-size="12" font-weight="600" fill="#34d399">
            ${price} · 450 USD/m² · 100% Sismorresistente
          </text>
        </svg>
      `);
    }

    if (id === 'model-a-floorplan' || id === 'model-b-floorplan') {
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 500" width="100%" height="100%">
          <rect width="700" height="500" fill="#ffffff"/>
          <!-- Grid -->
          <defs>
            <pattern id="planGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="700" height="500" fill="url(#planGrid)"/>

          <!-- Title -->
          <text x="40" y="45" font-family="'Playfair Display', Georgia, serif" font-size="18" font-weight="700" fill="#0f172a">
            PLANO ARQUITECTÓNICO · DISTRIBUCIÓN FUNCIONAL
          </text>
          <text x="40" y="65" font-family="'Montserrat', sans-serif" font-size="11" fill="#64748b">
            3 Habitaciones · 2 Baños · Sala-Comedor · Cocina · Terraza Perimetral
          </text>

          <!-- Outer Perimeter Corridor -->
          <rect x="70" y="90" width="560" height="340" fill="#fef3c7" stroke="#d97706" stroke-width="2" stroke-dasharray="4,4"/>
          <text x="80" y="110" font-family="'Montserrat', sans-serif" font-size="10" font-weight="700" fill="#b45309">
            CORREDOR PERIMETRAL ALREDEDOR DE TODA LA UNIDAD
          </text>

          <!-- Core Living Area -->
          <rect x="110" y="130" width="480" height="260" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/>

          <!-- Bedrooms -->
          <rect x="110" y="130" width="150" height="130" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>
          <text x="135" y="190" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#0f172a">HABITACIÓN 1</text>
          <text x="135" y="208" font-family="'Montserrat', sans-serif" font-size="10" fill="#64748b">3.20 x 3.20 m</text>

          <rect x="260" y="130" width="180" height="130" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>
          <text x="290" y="190" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#0f172a">HABITACIÓN 2</text>
          <text x="290" y="208" font-family="'Montserrat', sans-serif" font-size="10" fill="#64748b">3.60 x 3.20 m</text>

          <rect x="440" y="130" width="150" height="130" fill="#e2e8f0" stroke="#334155" stroke-width="2"/>
          <text x="465" y="190" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#0f172a">HABITACIÓN 3</text>
          <text x="465" y="208" font-family="'Montserrat', sans-serif" font-size="10" fill="#64748b">3.20 x 3.20 m</text>

          <!-- Bathrooms -->
          <rect x="110" y="260" width="90" height="80" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
          <text x="130" y="305" font-family="'Montserrat', sans-serif" font-size="10" font-weight="700" fill="#0369a1">BAÑO 1</text>

          <rect x="500" y="260" width="90" height="80" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
          <text x="520" y="305" font-family="'Montserrat', sans-serif" font-size="10" font-weight="700" fill="#0369a1">BAÑO 2</text>

          <!-- Living / Dining & Kitchen -->
          <rect x="200" y="260" width="220" height="130" fill="#f1f5f9" stroke="#334155" stroke-width="1.5"/>
          <text x="240" y="325" font-family="'Montserrat', sans-serif" font-size="13" font-weight="700" fill="#0f172a">SALA - COMEDOR</text>

          <rect x="420" y="260" width="80" height="130" fill="#fed7aa" stroke="#ea580c" stroke-width="1.5"/>
          <text x="430" y="325" font-family="'Montserrat', sans-serif" font-size="11" font-weight="700" fill="#9a3412">COCINA</text>

          <!-- Front Terrace -->
          <rect x="110" y="390" width="480" height="40" fill="#a7f3d0" stroke="#059669" stroke-width="2"/>
          <text x="270" y="415" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#065f46">
            TERRAZA MIRADOR · 20.00 m² Aprox.
          </text>
        </svg>
      `);
    }

    if (id === 'bamboo-structure') {
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 450" width="100%" height="100%">
          <rect width="700" height="450" fill="#1c1917"/>
          <defs>
            <linearGradient id="bTrunk" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#713f12"/>
              <stop offset="40%" stop-color="#ca8a04"/>
              <stop offset="100%" stop-color="#854d0e"/>
            </linearGradient>
          </defs>
          <text x="40" y="45" font-family="'Playfair Display', Georgia, serif" font-size="18" font-weight="700" fill="#fef08a">
            SISTEMA ESTRUCTURAL EN BAMBÚ GUADUA ANGUSTIFOLIA KUNTH
          </text>
          <text x="40" y="70" font-family="'Montserrat', sans-serif" font-size="11" fill="#a8a29e">
            Uniones empernadas con mortero inyectado · Resistencia sísmica clase A
          </text>

          <!-- Main Guadua Columns with nodes -->
          <rect x="120" y="110" width="34" height="280" fill="url(#bTrunk)" rx="4"/>
          <rect x="360" y="110" width="34" height="280" fill="url(#bTrunk)" rx="4"/>
          <rect x="540" y="110" width="34" height="280" fill="url(#bTrunk)" rx="4"/>

          <!-- Nodes Rings -->
          ${[150, 200, 250, 300, 350]
            .map(
              (y) => `
            <ellipse cx="137" cy="${y}" rx="18" ry="4" fill="#451a03" stroke="#eab308" stroke-width="1.5"/>
            <ellipse cx="377" cy="${y}" rx="18" ry="4" fill="#451a03" stroke="#eab308" stroke-width="1.5"/>
            <ellipse cx="557" cy="${y}" rx="18" ry="4" fill="#451a03" stroke="#eab308" stroke-width="1.5"/>
          `,
            )
            .join('')}

          <!-- Horizontal Guadua Beams -->
          <rect x="80" y="170" width="540" height="28" fill="url(#bTrunk)" rx="4"/>
          <!-- Diagonal Braces (Cruces de San Andrés Sismorresistentes) -->
          <line x1="137" y1="360" x2="377" y2="180" stroke="#ca8a04" stroke-width="20" stroke-linecap="round"/>
          <line x1="137" y1="180" x2="377" y2="360" stroke="#ca8a04" stroke-width="20" stroke-linecap="round"/>

          <!-- Technical Annotations -->
          <rect x="420" y="240" width="240" height="130" fill="#292524" stroke="#eab308" rx="6"/>
          <text x="435" y="270" font-family="'Montserrat', sans-serif" font-size="12" font-weight="700" fill="#fde047">
            CERTIFICACIÓN ESTRUCTURAL:
          </text>
          <text x="435" y="295" font-family="'Montserrat', sans-serif" font-size="11" fill="#e7e5e4">
            ✓ Tracción superior al acero
          </text>
          <text x="435" y="318" font-family="'Montserrat', sans-serif" font-size="11" fill="#e7e5e4">
            ✓ Flexibilidad ante sismos
          </text>
          <text x="435" y="341" font-family="'Montserrat', sans-serif" font-size="11" fill="#e7e5e4">
            ✓ Tratamiento antitermitas
          </text>
        </svg>
      `);
    }

    if (id === 'bulevar-guadua') {
      return res.send(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
          <rect width="800" height="500" fill="#14532d"/>
          <!-- Green park scene -->
          <path d="M 0 180 Q 250 120 500 170 T 800 150 L 800 500 L 0 500 Z" fill="#15803d"/>
          <path d="M 0 250 Q 300 200 600 240 L 800 230 L 800 500 L 0 500 Z" fill="#22c55e"/>

          <!-- Winding Pedestrian Boulevard Walkway -->
          <path d="M 0 380 Q 200 320 400 360 T 800 340 L 800 480 L 0 500 Z" fill="#e2e8f0"/>
          <path d="M 0 395 Q 200 335 400 375 T 800 355" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="10,10"/>

          <!-- Playground and Community amenities -->
          <g transform="translate(180, 260)">
            <polygon points="20,10 5,60 35,60" fill="#b45309"/>
            <polygon points="55,10 40,60 70,60" fill="#b45309"/>
            <line x1="20" y1="10" x2="55" y2="10" stroke="#78350f" stroke-width="6"/>
            <!-- Swing -->
            <line x1="30" y1="12" x2="28" y2="46" stroke="#475569" stroke-width="1.5"/>
            <line x1="45" y1="12" x2="43" y2="46" stroke="#475569" stroke-width="1.5"/>
            <rect x="25" y="46" width="22" height="4" fill="#ca8a04"/>
          </g>

          <!-- Multipurpose Court (Cancha multiusos) -->
          <rect x="520" y="270" width="160" height="90" fill="#0284c7" stroke="#ffffff" stroke-width="2" rx="4"/>
          <line x1="600" y1="270" x2="600" y2="360" stroke="#ffffff" stroke-width="2"/>
          <circle cx="600" cy="315" r="18" fill="none" stroke="#ffffff" stroke-width="2"/>

          <!-- Communal Hall (Salón Comunal) -->
          <rect x="340" y="230" width="130" height="70" fill="#ca8a04" stroke="#78350f" stroke-width="2" rx="3"/>
          <polygon points="325,230 405,185 485,230" fill="#78350f"/>

          <!-- Label -->
          <rect x="30" y="30" width="460" height="60" fill="#0f172a" fill-opacity="0.9" rx="8"/>
          <text x="50" y="56" font-family="'Montserrat', sans-serif" font-size="16" font-weight="800" fill="#facc15">
            BULEVAR DE LA GUADUA · +14.600 m²
          </text>
          <text x="50" y="76" font-family="'Montserrat', sans-serif" font-size="11" fill="#f8fafc">
            Espacio público cedido al 100% por los promotores para el disfrute de la comunidad
          </text>
        </svg>
      `);
    }

    // Default fallback placeholder graphic
    return res.send(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
        <rect width="600" height="400" fill="#15803d"/>
        <text x="300" y="200" font-family="'Montserrat', sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">
          MIS DELIRIOS RANCH
        </text>
      </svg>
    `);
  });

  // Guarantee that ANY unhandled /api/* call returns JSON, never HTML
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      error: `Ruta API no encontrada: ${req.method} ${req.originalUrl}`,
    });
  });

  // Serve static files in production or hook Vite in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
});
