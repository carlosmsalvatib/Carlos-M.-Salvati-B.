import { CmsContent, LotItem, LeadSubmission, AppUser, HousingModel } from '../types';
import { initialCmsContent } from '../data/initialContent';
import { initialLots } from '../data/initialLots';

export const API_BASE = '/api';

const STORAGE_KEY_CONTENT = 'mdr_runtime_cms_content_v3';
const STORAGE_KEY_LOTS = 'mdr_runtime_lots_v3';
const STORAGE_KEY_MODELS = 'mdr_runtime_models_v3';
const STORAGE_KEY_LAST_SAVED = 'mdr_runtime_last_saved_v3';

export interface MariaDbStatusResponse {
  success: boolean;
  connected?: boolean;
  config?: any;
  error?: string;
  tablesCreated?: boolean;
  sectionsCount?: number;
}

export interface DatabaseSectionsStatusResponse {
  success: boolean;
  sections?: any[];
  error?: string;
}

export interface SectionTableStatusItem {
  sectionKey: string;
  tableName: string;
  exists: boolean;
  recordCount: number;
  lastUpdated?: string;
  sample?: any;
}

export interface MariaDbDiagnosticResult {
  success: boolean;
  connected: boolean;
  host?: string;
  database?: string;
  tables?: SectionTableStatusItem[];
  error?: string;
}

export function getLocalCachedContent(): CmsContent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONTENT) || localStorage.getItem('mdr_runtime_cms_content_v2');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.site) {
        return parsed;
      }
    }
  } catch {}
  return null;
}

export function getLocalCachedLots(): LotItem[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return null;
}

export function getLocalCachedModels(): HousingModel[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MODELS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return null;
}

export function saveLocalCache(
  content?: CmsContent,
  lots?: LotItem[],
  models?: HousingModel[]
): void {
  try {
    if (content) {
      localStorage.setItem(STORAGE_KEY_CONTENT, JSON.stringify(content));
    }
    if (lots && Array.isArray(lots)) {
      localStorage.setItem(STORAGE_KEY_LOTS, JSON.stringify(lots));
    }
    const resolvedModels = models || content?.housingModels?.models;
    if (resolvedModels && Array.isArray(resolvedModels)) {
      localStorage.setItem(STORAGE_KEY_MODELS, JSON.stringify(resolvedModels));
    }
    localStorage.setItem(STORAGE_KEY_LAST_SAVED, new Date().toISOString());

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('mdr_data_updated', {
          detail: {
            content,
            lots,
            models: resolvedModels,
          },
        })
      );
    }
  } catch (err) {
    console.warn('Error guardando cache local:', err);
  }
}

export function extractErrorMessage(parsed: any, fallback: string): string {
  if (!parsed) return fallback;
  if (typeof parsed === 'string') return parsed;
  if (parsed.error) return String(parsed.error);
  if (parsed.message) return String(parsed.message);
  return fallback;
}

async function parseJsonSafely<T>(res: Response, fallbackErrorMsg?: string): Promise<T> {
  const text = await res.text();
  const trimmed = text.trim();
  if (
    trimmed.startsWith('<!DOCTYPE html>') ||
    trimmed.startsWith('<html') ||
    trimmed.includes('<body')
  ) {
    console.error(`[API Error] HTML response received instead of JSON (Status ${res.status}):`, trimmed.substring(0, 300));
    throw new Error(
      res.status === 404
        ? 'Servicio API no encontrado (404)'
        : `Error en la comunicación con el servidor (${res.status} - Respuesta HTML)`
    );
  }

  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (parseErr) {
    console.error(`[API] Error de parseo JSON (Status ${res.status}):`, trimmed.substring(0, 300));
    if (!res.ok) {
      throw new Error(
        res.status === 404
          ? 'Servicio API no encontrado (404)'
          : `Error en la comunicación con el servidor (${res.status})`
      );
    }
    throw new Error(fallbackErrorMsg || 'Respuesta del servidor no válida');
  }

  if (!res.ok) {
    const errorDetail = extractErrorMessage(
      parsed,
      fallbackErrorMsg || `Error en la solicitud (${res.status})`
    );
    throw new Error(errorDetail);
  }

  return parsed;
}

export async function uploadMediaToServer(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  const json = await parseJsonSafely<{ success: boolean; url: string; fileUrl?: string }>(
    res,
    'Error al subir archivo'
  );
  return { url: json.url || json.fileUrl || '' };
}

export async function fetchCmsContent(): Promise<CmsContent> {
  try {
    const res = await fetch(`${API_BASE}/content?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
    const json = await parseJsonSafely<{ success: boolean; data: CmsContent }>(
      res,
      'Error al cargar contenido'
    );
    if (json.data && json.data.site) {
      saveLocalCache(json.data);
      return json.data;
    }
  } catch (err) {
    console.warn('Aviso al cargar contenido desde MariaDB/Servidor, usando cache local:', err);
  }

  return getLocalCachedContent() || initialCmsContent;
}

export async function saveCmsContent(content: CmsContent, note?: string): Promise<CmsContent> {
  saveLocalCache(content);

  const query = note ? `?note=${encodeURIComponent(note)}` : '';
  try {
    const res = await fetch(`${API_BASE}/content${query}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    const json = await parseJsonSafely<{ success: boolean; data: CmsContent }>(
      res,
      'Error al guardar contenido'
    );
    if (json.data) {
      saveLocalCache(json.data);
      return json.data;
    }
  } catch (err: any) {
    console.warn('Guardado en servidor falló, contenido retenido en cache local:', err);
  }
  return content;
}

export async function resetCmsContent(): Promise<CmsContent> {
  try {
    localStorage.removeItem(STORAGE_KEY_CONTENT);
    localStorage.removeItem(STORAGE_KEY_LOTS);
    const res = await fetch(`${API_BASE}/content/reset`, { method: 'POST' });
    const json = await parseJsonSafely<{ success: boolean; data: CmsContent }>(
      res,
      'Error al reiniciar contenido'
    );
    if (json.data) {
      saveLocalCache(json.data, initialLots);
      return json.data;
    }
  } catch {}
  saveLocalCache(initialCmsContent, initialLots);
  return initialCmsContent;
}

export async function fetchLots(): Promise<LotItem[]> {
  try {
    const res = await fetch(`${API_BASE}/lots?_t=${Date.now()}`, {
      cache: 'no-store',
    });
    const json = await parseJsonSafely<{ success: boolean; data: LotItem[] }>(
      res,
      'Error al cargar lotes'
    );
    if (json.data && Array.isArray(json.data) && json.data.length > 0) {
      saveLocalCache(undefined, json.data);
      return json.data;
    }
  } catch (err) {
    console.warn('Aviso cargando lotes desde MariaDB:', err);
  }

  return getLocalCachedLots() || initialLots;
}

export async function updateLot(id: string, updates: Partial<LotItem>): Promise<LotItem> {
  try {
    const res = await fetch(`${API_BASE}/lots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await parseJsonSafely<{ success: boolean; data: LotItem }>(
      res,
      'Error al actualizar lote'
    );
    if (json.data) {
      const current = getLocalCachedLots() || initialLots;
      const nextLots = current.map((l) => (l.id === id ? json.data : l));
      saveLocalCache(undefined, nextLots);
      return json.data;
    }
  } catch (err: any) {
    console.warn('Actualización de lote en servidor falló:', err);
  }

  const current = getLocalCachedLots() || initialLots;
  const target = current.find((l) => l.id === id);
  if (!target) throw new Error('Lote no encontrado');
  const updated = { ...target, ...updates };
  const nextLots = current.map((l) => (l.id === id ? updated : l));
  saveLocalCache(undefined, nextLots);
  return updated;
}

export async function saveBulkLots(lots: LotItem[]): Promise<LotItem[]> {
  try {
    const res = await fetch(`${API_BASE}/lots/bulk-save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lots }),
    });
    const json = await parseJsonSafely<{ success: boolean; data: LotItem[] }>(
      res,
      'Error al guardar lotes'
    );
    if (json.data && Array.isArray(json.data)) {
      saveLocalCache(undefined, json.data);
      return json.data;
    }
  } catch (err: any) {
    console.warn('Guardado masivo de lotes en servidor falló:', err);
  }

  saveLocalCache(undefined, lots);
  return lots;
}

export async function createLot(lot: Partial<LotItem>): Promise<LotItem> {
  const lotId = lot.id || `lot-${Date.now()}`;
  const fullLot = { ...lot, id: lotId } as LotItem;

  try {
    const res = await fetch(`${API_BASE}/lots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullLot),
    });
    const json = await parseJsonSafely<{ success: boolean; data: LotItem }>(
      res,
      'Error al crear lote'
    );
    if (json.data) {
      const current = getLocalCachedLots() || initialLots;
      const nextLots = [...current, json.data];
      saveLocalCache(undefined, nextLots);
      return json.data;
    }
  } catch {}

  const current = getLocalCachedLots() || initialLots;
  const nextLots = [...current, fullLot];
  saveLocalCache(undefined, nextLots);
  return fullLot;
}

export async function deleteLot(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/lots/${id}`, { method: 'DELETE' });
  } catch {}

  const current = getLocalCachedLots() || initialLots;
  const nextLots = current.filter((l) => l.id !== id);
  saveLocalCache(undefined, nextLots);
}

export async function fetchHousingModels(): Promise<{ models: HousingModel[] }> {
  try {
    const res = await fetch(`${API_BASE}/models?_t=${Date.now()}`);
    const json = await parseJsonSafely<{ success: boolean; data: HousingModel[] }>(
      res,
      'Error al cargar modelos'
    );
    if (json.data && Array.isArray(json.data)) {
      saveLocalCache(undefined, undefined, json.data);
      return { models: json.data };
    }
  } catch (err) {
    console.warn('Aviso cargando modelos de vivienda:', err);
  }

  const cached = getLocalCachedModels();
  if (cached && cached.length > 0) {
    return { models: cached };
  }
  return { models: initialCmsContent.housingModels?.models || [] };
}

export async function saveHousingModelsBulk(models: HousingModel[]): Promise<HousingModel[]> {
  try {
    const res = await fetch(`${API_BASE}/models/bulk-save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ models }),
    });
    const json = await parseJsonSafely<{ success: boolean; data: HousingModel[] }>(
      res,
      'Error al guardar modelos'
    );
    if (json.data && Array.isArray(json.data)) {
      saveLocalCache(undefined, undefined, json.data);
      return json.data;
    }
  } catch {}

  saveLocalCache(undefined, undefined, models);
  return models;
}

export async function saveAllCmsAndLots(
  content: CmsContent,
  lots: LotItem[],
  note?: string
): Promise<{ content: CmsContent; lots: LotItem[] }> {
  saveLocalCache(content, lots);

  try {
    const query = note ? `?note=${encodeURIComponent(note)}` : '';
    const res = await fetch(`${API_BASE}/sync-all${query}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, lots }),
    });
    const json = await parseJsonSafely<{
      success: boolean;
      data: { content: CmsContent; lots: LotItem[] };
    }>(res, 'Error al sincronizar datos');

    if (json.data) {
      saveLocalCache(json.data.content, json.data.lots);
      return json.data;
    }
  } catch (err) {
    console.warn('Sincronización global con servidor falló, respaldado localmente:', err);
  }

  return { content, lots };
}

export async function saveCmsSection(sectionKey: string, sectionData: any): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/sections/${sectionKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sectionData),
    });
    const json = await parseJsonSafely<any>(res, 'Error al guardar sección');
    return json.data || sectionData;
  } catch (err) {
    console.warn(`Error guardando sección ${sectionKey} en servidor:`, err);
    return sectionData;
  }
}

export async function fetchLeads(): Promise<LeadSubmission[]> {
  try {
    const res = await fetch(`${API_BASE}/leads`);
    const json = await parseJsonSafely<{ success: boolean; data: LeadSubmission[] }>(
      res,
      'Error al cargar leads'
    );
    if (json.data && Array.isArray(json.data)) {
      return json.data;
    }
  } catch {}
  return [];
}

export async function submitLead(lead: Partial<LeadSubmission>): Promise<LeadSubmission> {
  try {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    const json = await parseJsonSafely<{ success: boolean; data: LeadSubmission }>(
      res,
      'Error al enviar lead'
    );
    if (json.data) return json.data;
  } catch {}
  return lead as LeadSubmission;
}

export async function updateLeadStatus(id: string, status: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  } catch {}
}

export async function fetchUsers(): Promise<AppUser[]> {
  try {
    const res = await fetch(`${API_BASE}/users`);
    const json = await parseJsonSafely<{ success: boolean; data: AppUser[] }>(
      res,
      'Error al cargar usuarios'
    );
    if (json.data && Array.isArray(json.data)) {
      return json.data;
    }
  } catch {}
  return [];
}

export async function saveUser(user: Partial<AppUser>): Promise<AppUser> {
  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const json = await parseJsonSafely<{ success: boolean; data: AppUser }>(
      res,
      'Error al guardar usuario'
    );
    if (json.data) return json.data;
  } catch {}
  return user as AppUser;
}

export async function updateUser(id: string, updates: Partial<AppUser>): Promise<AppUser> {
  try {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const json = await parseJsonSafely<{ success: boolean; data: AppUser }>(
      res,
      'Error al actualizar usuario'
    );
    if (json.data) return json.data;
  } catch {}
  throw new Error('No se pudo actualizar el usuario');
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
  } catch {}
}

export async function loginAdmin(username: string, pass: string): Promise<AppUser | null> {
  const users = await fetchUsers();
  const found = users.find(
    (u) =>
      (u.username === username || u.email === username) &&
      u.password === pass &&
      u.active !== false
  );
  if (found) return found;
  throw new Error('Credenciales inválidas o usuario inactivo');
}

// MariaDB Management Helpers for MariaDbCmsTab
export async function fetchMariaDbStatus(): Promise<MariaDbStatusResponse> {
  try {
    const res = await fetch(`${API_BASE}/mariadb/status`);
    const json = await parseJsonSafely<MariaDbStatusResponse>(res, 'Error al obtener estado MariaDB');
    return json;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function testMariaDbConnection(config?: any): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/mariadb/test`, {
      method: config ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: config ? JSON.stringify(config) : undefined,
    });
    const json = await parseJsonSafely<any>(res, 'Error probando conexión MariaDB');
    return json;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchMariaDbConfig(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/mariadb/config`);
    const json = await parseJsonSafely<any>(res, 'Error obteniendo config MariaDB');
    return json;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateMariaDbConfig(config: any): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/mariadb/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    const json = await parseJsonSafely<any>(res, 'Error actualizando config MariaDB');
    return json;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function migrateAllToMariaDb(): Promise<any> {
  try {
    const res = await fetch(`${API_BASE}/mariadb/migrate`, {
      method: 'POST',
    });
    const json = await parseJsonSafely<any>(res, 'Error migrando a MariaDB');
    return json;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchDatabaseSectionsStatus(): Promise<DatabaseSectionsStatusResponse> {
  try {
    const res = await fetch(`${API_BASE}/mariadb/sections-status`);
    const json = await parseJsonSafely<DatabaseSectionsStatusResponse>(res, 'Error obteniendo estado de secciones');
    return json;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function runMariaDbDiagnostics(): Promise<MariaDbDiagnosticResult> {
  try {
    const res = await fetch(`${API_BASE}/mariadb/diagnostics`, {
      method: 'POST',
    });
    const json = await parseJsonSafely<MariaDbDiagnosticResult>(res, 'Error ejecutando diagnóstico MariaDB');
    return json;
  } catch (err: any) {
    return { success: false, connected: false, error: err.message };
  }
}

export function subscribeToLiveContent(callback: (content: CmsContent) => void): () => void {
  const handleEvent = (e: any) => {
    if (e.detail?.content) {
      callback(e.detail.content);
    }
  };
  window.addEventListener('mdr_data_updated', handleEvent);
  return () => window.removeEventListener('mdr_data_updated', handleEvent);
}

export function subscribeToLiveModels(callback: (models: HousingModel[]) => void): () => void {
  const handleEvent = (e: any) => {
    if (e.detail?.models && Array.isArray(e.detail.models)) {
      callback(e.detail.models);
    }
  };
  window.addEventListener('mdr_models_updated', handleEvent);
  return () => window.removeEventListener('mdr_models_updated', handleEvent);
}

export function subscribeToLiveLots(callback: (lots: LotItem[]) => void): () => void {
  const handleEvent = (e: any) => {
    if (e.detail?.lots && Array.isArray(e.detail.lots)) {
      callback(e.detail.lots);
    }
  };
  window.addEventListener('mdr_data_updated', handleEvent);
  return () => window.removeEventListener('mdr_data_updated', handleEvent);
}

// Aliases for 100% compatibility
export const getContent = fetchCmsContent;
export const updateContent = saveCmsContent;
export const getLots = fetchLots;
export const getHousingModels = fetchHousingModels;
export const getLeads = fetchLeads;
export const getUsers = fetchUsers;
export const createUser = saveUser;
export const runMariaDbMigration = migrateAllToMariaDb;
