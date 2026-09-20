import { CmsContent, LotItem, LeadSubmission, AppUser } from '../types';

export const API_BASE = '/api';

export async function fetchCmsContent(): Promise<CmsContent> {
  const res = await fetch(`${API_BASE}/content`);
  if (!res.ok) throw new Error('Error al cargar contenido');
  const json = await res.json();
  return json.data;
}

export async function saveCmsContent(content: CmsContent, note?: string): Promise<CmsContent> {
  const query = note ? `?note=${encodeURIComponent(note)}` : '';
  const res = await fetch(`${API_BASE}/content${query}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(content),
  });
  if (!res.ok) throw new Error('Error al guardar contenido');
  const json = await res.json();
  return json.data;
}

export async function resetCmsContent(): Promise<CmsContent> {
  const res = await fetch(`${API_BASE}/content/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Error al reiniciar contenido');
  const json = await res.json();
  return json.data;
}

export async function fetchLots(): Promise<LotItem[]> {
  const res = await fetch(`${API_BASE}/lots`);
  if (!res.ok) throw new Error('Error al cargar lotes');
  const json = await res.json();
  return json.data;
}

export async function updateLot(id: string, updates: Partial<LotItem>): Promise<LotItem> {
  const res = await fetch(`${API_BASE}/lots/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Error al actualizar lote');
  const json = await res.json();
  return json.data;
}

export async function saveBulkLots(lots: LotItem[]): Promise<LotItem[]> {
  const res = await fetch(`${API_BASE}/lots/bulk-save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lots }),
  });
  if (!res.ok) throw new Error('Error al grabar inventario de disponibilidad');
  const json = await res.json();
  return json.data;
}

export async function createLot(lot: Partial<LotItem>): Promise<LotItem> {
  const res = await fetch(`${API_BASE}/lots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lot),
  });
  if (!res.ok) throw new Error('Error al agregar lote');
  const json = await res.json();
  return json.data;
}

export async function deleteLot(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/lots/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar lote');
}

export async function fetchLeads(): Promise<LeadSubmission[]> {
  const res = await fetch(`${API_BASE}/leads`);
  if (!res.ok) throw new Error('Error al cargar leads');
  const json = await res.json();
  return json.data;
}

export async function submitLead(payload: Partial<LeadSubmission>): Promise<LeadSubmission> {
  const res = await fetch(`${API_BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al enviar solicitud');
  return json.data;
}

export async function updateLeadStatus(id: string, status: LeadSubmission['status']): Promise<LeadSubmission> {
  const res = await fetch(`${API_BASE}/leads/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Error al actualizar estado del lead');
  const json = await res.json();
  return json.data;
}

// --- Users Management API (5 Levels) ---
export async function fetchUsers(): Promise<AppUser[]> {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error('Error al cargar usuarios');
  const json = await res.json();
  return json.data;
}

export async function createUser(user: Partial<AppUser>): Promise<AppUser> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al crear usuario');
  return json.data;
}

export async function updateUser(id: string, updates: Partial<AppUser>): Promise<AppUser> {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al actualizar usuario');
  return json.data;
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error al eliminar usuario');
}

// Aliases for seamless imports across components
export const getContent = fetchCmsContent;
export const updateContent = saveCmsContent;
export const getLots = fetchLots;
export const getLeads = fetchLeads;

export async function loginAdmin(
  username: string,
  password: string
): Promise<{ id: string; username: string; name: string; email: string; level: number; levelName: string; role: string; token: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Credenciales inválidas');
  return { ...json.user, token: json.token };
}
