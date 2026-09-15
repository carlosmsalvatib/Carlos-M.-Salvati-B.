import { CmsContent, LotItem, LeadSubmission } from '../types';

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

// Aliases for seamless imports across components
export const getContent = fetchCmsContent;
export const updateContent = saveCmsContent;
export const getLots = fetchLots;
export const getLeads = fetchLeads;

export async function loginAdmin(username: string, password: string): Promise<{ username: string; name: string; role: string; token: string }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Credenciales inválidas');
  return { ...json.user, token: json.token };
}
