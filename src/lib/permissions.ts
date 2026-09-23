import { AppUser, UserLevel } from '../types';

export type CmsTabType =
  | 'general'
  | 'hero'
  | 'propuesta'
  | 'planMaestro'
  | 'lotes'
  | 'modelos'
  | 'ubicacion'
  | 'financiamiento'
  | 'sostenibilidad'
  | 'contacto'
  | 'usuarios'
  | 'leads'
  | 'mariadb';

export interface UserLevelInfo {
  level: UserLevel;
  name: string;
  shortRole: string;
  badge: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  description: string;
  responsibilities: string[];
  allowedTabs: CmsTabType[];
  canEditContent: boolean;
  canEditLots: boolean;
  canDeleteLots: boolean;
  canManageUsers: boolean;
  canAuthorizeSuperuser: boolean;
  canManageLeads: boolean;
  isReadOnly: boolean;
}

export const USER_LEVEL_DEFINITIONS: Record<UserLevel, UserLevelInfo> = {
  1: {
    level: 1,
    name: 'Superusuario',
    shortRole: 'Superusuario (Fundadores)',
    badge: 'Nivel 1 · Superusuario',
    badgeBg: 'bg-amber-500/20',
    badgeBorder: 'border-amber-500/40',
    badgeText: 'text-amber-300',
    description:
      'Llave maestra constitucional con acceso irrestricto a todas las funciones del CMS. Exclusivo para Carlos Salvati y Audy Palacio. Permite crear, autorizar y gestionar todos los niveles (1 al 5).',
    responsibilities: [
      'Control total e inmutable del sistema',
      'Creación y autorización de nuevos usuarios en los 5 niveles',
      'Ascenso o aprobación de nuevos Superusuarios (Nivel 1)',
      'Edición de todas las secciones del sitio y catálogo',
      'Gestión integral de precios, lotes, contratos y prospectos',
      'Simulador de roles para auditoría de permisos',
    ],
    allowedTabs: [
      'general',
      'hero',
      'propuesta',
      'planMaestro',
      'lotes',
      'modelos',
      'ubicacion',
      'financiamiento',
      'sostenibilidad',
      'contacto',
      'usuarios',
      'leads',
      'mariadb',
    ],
    canEditContent: true,
    canEditLots: true,
    canDeleteLots: true,
    canManageUsers: true,
    canAuthorizeSuperuser: true,
    canManageLeads: true,
    isReadOnly: false,
  },
  2: {
    level: 2,
    name: 'Administrador',
    shortRole: 'Administrador General',
    badge: 'Nivel 2 · Administrador',
    badgeBg: 'bg-blue-500/20',
    badgeBorder: 'border-blue-500/40',
    badgeText: 'text-blue-300',
    description:
      'Gestión administrativa amplia de contenidos, catálogo de disponibilidad, modelos habitacionales y gestión de usuarios operativos (Niveles 3 a 5).',
    responsibilities: [
      'Edición general de textos, planes y secciones',
      'Gestión del catálogo de lotes y financiamiento',
      'Creación y gestión de usuarios Editor (3), Vendedor (4) e Invitado (5)',
      'Gestión y seguimiento de prospectos comerciales',
    ],
    allowedTabs: [
      'general',
      'hero',
      'propuesta',
      'planMaestro',
      'lotes',
      'modelos',
      'ubicacion',
      'financiamiento',
      'sostenibilidad',
      'contacto',
      'usuarios',
      'leads',
      'mariadb',
    ],
    canEditContent: true,
    canEditLots: true,
    canDeleteLots: true,
    canManageUsers: true,
    canAuthorizeSuperuser: false,
    canManageLeads: true,
    isReadOnly: false,
  },
  3: {
    level: 3,
    name: 'Editor',
    shortRole: 'Editor de Contenidos',
    badge: 'Nivel 3 · Editor',
    badgeBg: 'bg-purple-500/20',
    badgeBorder: 'border-purple-500/40',
    badgeText: 'text-purple-300',
    description:
      'Edición de textos, videos render de la propuesta de valor, planos arquitectónicos del plan maestro, especificaciones de modelos habitacionales y contenidos de sostenibilidad.',
    responsibilities: [
      'Actualización de textos, títulos y eslóganes',
      'Carga y reemplazo de videos render y planos',
      'Galería de imágenes de los modelos habitacionales',
      'Actualización de puntos de interés y ubicación',
    ],
    allowedTabs: [
      'hero',
      'propuesta',
      'planMaestro',
      'modelos',
      'ubicacion',
      'sostenibilidad',
      'contacto',
      'lotes',
      'leads',
    ],
    canEditContent: true,
    canEditLots: false, // Can view lots but cannot modify pricing or structure
    canDeleteLots: false,
    canManageUsers: false,
    canAuthorizeSuperuser: false,
    canManageLeads: false, // Read only
    isReadOnly: false,
  },
  4: {
    level: 4,
    name: 'Vendedor',
    shortRole: 'Gestor de Ventas & Lotes',
    badge: 'Nivel 4 · Vendedor',
    badgeBg: 'bg-emerald-500/20',
    badgeBorder: 'border-emerald-500/40',
    badgeText: 'text-emerald-300',
    description:
      'Enfoque comercial y de ventas. Actualización de disponibilidad de los 57 lotes (disponible, reservado, vendido), gestión del embudo de prospectos (leads) y consulta de financiamiento.',
    responsibilities: [
      'Actualización en tiempo real del estado de los 57 lotes',
      'Grabado y guardado del catálogo de disponibilidad',
      'Seguimiento a prospectos (marcar contactado/cerrado)',
      'Consulta de simulador y modalidades de financiamiento',
      'Consulta del plano maestro para ubicar parcelas',
    ],
    allowedTabs: ['lotes', 'leads', 'financiamiento', 'planMaestro', 'contacto'],
    canEditContent: false,
    canEditLots: true,
    canDeleteLots: false,
    canManageUsers: false,
    canAuthorizeSuperuser: false,
    canManageLeads: true,
    isReadOnly: false,
  },
  5: {
    level: 5,
    name: 'Invitado',
    shortRole: 'Visualizador / Auditor',
    badge: 'Nivel 5 · Invitado',
    badgeBg: 'bg-stone-500/20',
    badgeBorder: 'border-stone-500/40',
    badgeText: 'text-stone-300',
    description:
      'Acceso en modo auditoría y sólo lectura. Puede consultar todas las secciones y reportes del proyecto sin privilegios de edición o modificación de datos.',
    responsibilities: [
      'Visualización de contenidos y planos del complejo',
      'Auditoría de lotes y modelos habitacionales',
      'Consulta de prospectos sin edición',
      'Sin permisos de guardado o modificación',
    ],
    allowedTabs: [
      'general',
      'hero',
      'propuesta',
      'planMaestro',
      'lotes',
      'modelos',
      'ubicacion',
      'financiamiento',
      'sostenibilidad',
      'contacto',
      'leads',
    ],
    canEditContent: false,
    canEditLots: false,
    canDeleteLots: false,
    canManageUsers: false,
    canAuthorizeSuperuser: false,
    canManageLeads: false,
    isReadOnly: true,
  },
};

export function getUserLevelInfo(level?: UserLevel | number | null): UserLevelInfo {
  const safeLevel = (level && level >= 1 && level <= 5 ? level : 5) as UserLevel;
  return USER_LEVEL_DEFINITIONS[safeLevel] || USER_LEVEL_DEFINITIONS[5];
}

export function isFounderSuperUser(user?: Partial<AppUser> | null): boolean {
  if (!user) return false;
  const username = String(user.username || '').toLowerCase().trim();
  const email = String(user.email || '').toLowerCase().trim();
  return (
    user.level === 1 &&
    (username === 'csalvati' ||
      username === 'apalacio' ||
      username === 'carlos.salvati' ||
      username === 'audy.palacio' ||
      email === 'salvaticarlos@gmail.com' ||
      email === 'audypalacio@gmail.com' ||
      user.id === 'user-1' ||
      user.id === 'user-2')
  );
}

export function canAccessTab(userLevel: UserLevel | undefined | null, tab: CmsTabType): boolean {
  const info = getUserLevelInfo(userLevel);
  return info.allowedTabs.includes(tab);
}
