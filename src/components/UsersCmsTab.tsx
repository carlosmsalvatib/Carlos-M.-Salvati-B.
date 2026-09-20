import React, { useState, useEffect } from 'react';
import { AppUser, UserLevel } from '../types';
import { fetchUsers, createUser, updateUser, deleteUser } from '../lib/api';
import {
  USER_LEVEL_DEFINITIONS,
  getUserLevelInfo,
  isFounderSuperUser,
} from '../lib/permissions';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Key,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  RefreshCw,
  Crown,
  Eye,
  Sliders,
  Check,
  Search,
  Sparkles,
  ShieldAlert,
  UserCheck,
  UserX,
  Building,
} from 'lucide-react';

interface UsersCmsTabProps {
  currentUser?: Partial<AppUser> | null;
  onSimulateRole?: (level: UserLevel | null) => void;
  simulatedRole?: UserLevel | null;
}

export const UsersCmsTab: React.FC<UsersCmsTabProps> = ({
  currentUser,
  onSimulateRole,
  simulatedRole,
}) => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // New user form state
  const [isCreating, setIsCreating] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('delirios2025');
  const [newLevel, setNewLevel] = useState<UserLevel>(4);

  // Quick action states
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  // Edit user modal state
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editLevel, setEditLevel] = useState<UserLevel>(4);
  const [editPassword, setEditPassword] = useState('');
  const [editActive, setEditActive] = useState(true);

  // Reset password inline modal
  const [resettingUser, setResettingUser] = useState<AppUser | null>(null);
  const [customPassword, setCustomPassword] = useState('');

  const isSuperUser = currentUser?.level === 1;
  const isFounder = isFounderSuperUser(currentUser);
  const isAdminOrSuper = currentUser?.level === 1 || currentUser?.level === 2;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation: Level 1 can only be authorized by Superusuarios (Carlos Salvati / Audy Palacio)
    if (newLevel === 1 && !isSuperUser) {
      setError(
        'Acceso denegado: Solo los Superusuarios fundadores (Carlos Salvati y Audy Palacio) tienen facultad legal para autorizar y expedir credenciales de Superusuario Nivel 1.'
      );
      return;
    }

    // Validation: Level 2 can only be authorized by Level 1 Superusuario
    if (newLevel === 2 && currentUser?.level !== 1) {
      setError(
        'Acceso denegado: La designación de Administradores Generales (Nivel 2) requiere la autorización expresa de Carlos Salvati o Audy Palacio.'
      );
      return;
    }

    try {
      await createUser({
        username: newUsername.trim(),
        name: newName.trim(),
        email: newEmail.trim(),
        password: newPassword.trim(),
        level: newLevel,
        active: true,
      });

      const levelInfo = getUserLevelInfo(newLevel);
      setSuccessMsg(
        `Usuario "${newName}" autorizado exitosamente con rango ${levelInfo.badge}.`
      );
      setTimeout(() => setSuccessMsg(null), 5000);

      // Reset form
      setNewUsername('');
      setNewName('');
      setNewEmail('');
      setNewPassword('delirios2025');
      setNewLevel(4);
      setIsCreating(false);

      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Error al crear y autorizar usuario');
    }
  };

  const handleToggleUserStatus = async (user: AppUser) => {
    if (isFounderSuperUser(user)) {
      alert(
        'Blindaje Constitucional: Las cuentas de los fundadores Carlos Salvati y Audy Palacio no pueden ser desactivadas ni suspendidas.'
      );
      return;
    }

    if (!isAdminOrSuper) {
      alert('No cuenta con privilegios para modificar el estado de usuarios.');
      return;
    }

    setProcessingUserId(user.id);
    try {
      const updatedStatus = !user.active;
      await updateUser(user.id, { active: updatedStatus });
      setSuccessMsg(
        `Cuenta de ${user.name} ${updatedStatus ? 'activada y habilitada' : 'suspendida temporalmente'}.`
      );
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Error al cambiar estado del usuario');
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleStartEdit = (user: AppUser) => {
    if (isFounderSuperUser(user) && !isSuperUser) {
      alert(
        'Acceso Restringido: Los perfiles fundadores de Carlos Salvati y Audy Palacio solo pueden ser modificados por ellos mismos.'
      );
      return;
    }

    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditLevel(user.level);
    setEditPassword('');
    setEditActive(user.active);
    setError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setError(null);

    // If attempting to promote to level 1, verify authorization
    if (editLevel === 1 && editingUser.level !== 1 && !isSuperUser) {
      setError(
        'Solo los Superusuarios Carlos Salvati y Audy Palacio pueden autorizar ascensos a Nivel 1.'
      );
      return;
    }

    try {
      await updateUser(editingUser.id, {
        name: editName.trim(),
        email: editEmail.trim(),
        level: editLevel,
        active: editActive,
        password: editPassword.trim() ? editPassword.trim() : undefined,
      });

      setSuccessMsg(`Ficha de ${editName} actualizada correctamente.`);
      setTimeout(() => setSuccessMsg(null), 4000);
      setEditingUser(null);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar usuario');
    }
  };

  const handleStartResetPassword = (user: AppUser) => {
    setResettingUser(user);
    setCustomPassword('delirios2025');
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser) return;

    try {
      await updateUser(resettingUser.id, {
        password: customPassword.trim(),
      });

      setSuccessMsg(
        `Contraseña restablecida exitosamente para ${resettingUser.name}. Nueva clave: ${customPassword}`
      );
      setTimeout(() => setSuccessMsg(null), 6000);
      setResettingUser(null);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Error al restablecer contraseña');
    }
  };

  const handleDeleteUser = async (user: AppUser) => {
    if (isFounderSuperUser(user)) {
      alert(
        'Protección Constitucional: Carlos Salvati y Audy Palacio son los Superusuarios fundadores protegidos y no pueden ser eliminados bajo ninguna circunstancia.'
      );
      return;
    }

    if (!isAdminOrSuper) {
      alert('Permisos insuficientes para eliminar usuarios.');
      return;
    }

    if (
      !confirm(
        `¿Confirmar revocación y eliminación de credenciales para ${user.name} (@${user.username})?`
      )
    ) {
      return;
    }

    try {
      await deleteUser(user.id);
      setSuccessMsg(`Usuario ${user.name} revocado y eliminado del sistema.`);
      setTimeout(() => setSuccessMsg(null), 4000);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar usuario');
    }
  };

  // Filtered list of users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel =
      selectedLevelFilter === 'all' || u.level === parseInt(selectedLevelFilter, 10);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && u.active) ||
      (statusFilter === 'inactive' && !u.active);

    return matchesSearch && matchesLevel && matchesStatus;
  });

  const getBadgeForLevel = (level: UserLevel) => {
    const info = getUserLevelInfo(level);
    switch (level) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Nivel 1 · Superusuario
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Nivel 2 · Administrador
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <Edit2 className="w-3.5 h-3.5 text-purple-400" />
            Nivel 3 · Editor
          </span>
        );
      case 4:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Building className="w-3.5 h-3.5 text-emerald-400" />
            Nivel 4 · Vendedor
          </span>
        );
      case 5:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-500/20 text-stone-300 border border-stone-500/40">
            <Eye className="w-3.5 h-3.5 text-stone-400" />
            Nivel 5 · Invitado
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs bg-stone-800 text-stone-400">
            Nivel {level}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-stone-200">
      {/* FOUNDER SUPERUSERS MASTHEAD CARD */}
      <div className="relative overflow-hidden bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/50 border-2 border-amber-500/40 rounded-2xl p-5 shadow-2xl">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Crown className="w-4 h-4 text-amber-400" />
                Consola de Superusuarios Fundadores
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Blindaje Constitucional Activo
              </span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
              Gestión y Autorización de Usuarios · 5 Niveles
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl mt-1 leading-relaxed">
              Interfaz exclusiva autorizada para{' '}
              <strong className="text-amber-300">Carlos Salvati</strong> y{' '}
              <strong className="text-amber-300">Audy Palacio</strong> para
              expedir, suspender, autorizar o elevar credenciales en los 5 rangos
              operativos de Mis Delirios Ranch: <em>Superusuario</em>, <em>Administrador</em>,{' '}
              <em>Editor</em>, <em>Vendedor</em> e <em>Invitado</em>.
            </p>

            {/* Founder Status Pills */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/90 border border-amber-500/30 text-xs">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-[11px]">
                  CS
                </div>
                <div>
                  <span className="font-bold text-white">Carlos Salvati</span>
                  <span className="text-stone-400 text-[10px] ml-1.5">Superusuario Fundador</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/90 border border-amber-500/30 text-xs">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-[11px]">
                  AP
                </div>
                <div>
                  <span className="font-bold text-white">Audy Palacio</span>
                  <span className="text-stone-400 text-[10px] ml-1.5">Superusuario Fundador</span>
                </div>
              </div>

              {currentUser && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Sesión activa:{' '}
                    <strong className="text-white">{currentUser.name}</strong> (
                    {getUserLevelInfo(currentUser.level).badge})
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={loadUsers}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-all text-xs font-semibold flex items-center justify-center gap-1.5 border border-stone-700"
              title="Recargar base de usuarios"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>

            {isAdminOrSuper && (
              <button
                onClick={() => setIsCreating(!isCreating)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
                id="btn-crear-usuario-cms"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isCreating ? 'Cerrar Formulario' : 'Autorizar Nuevo Usuario'}</span>
              </button>
            )}
          </div>
        </div>

        {/* ROLE SIMULATION BAR FOR CARLOS SALVATI & AUDY PALACIO */}
        {isSuperUser && onSimulateRole && (
          <div className="mt-4 pt-3.5 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-stone-950/60 -mx-5 -mb-5 px-5 py-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-stone-300">
                Simulador de Restricción de Roles (Auditoría en Vivo):
              </span>
              <span className="text-[11px] text-stone-400 hidden md:inline">
                Comprueba en tiempo real cómo experimenta el CMS cada uno de los 5 niveles.
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onSimulateRole(null)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  !simulatedRole
                    ? 'bg-amber-500 text-stone-950 shadow'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                1. Superusuario (Real)
              </button>
              <button
                onClick={() => onSimulateRole(2)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  simulatedRole === 2
                    ? 'bg-blue-500 text-white shadow'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                2. Administrador
              </button>
              <button
                onClick={() => onSimulateRole(3)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  simulatedRole === 3
                    ? 'bg-purple-500 text-white shadow'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                3. Editor
              </button>
              <button
                onClick={() => onSimulateRole(4)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  simulatedRole === 4
                    ? 'bg-emerald-500 text-stone-950 font-bold shadow'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                4. Vendedor
              </button>
              <button
                onClick={() => onSimulateRole(5)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  simulatedRole === 5
                    ? 'bg-stone-400 text-stone-950 font-bold shadow'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                5. Invitado
              </button>
            </div>
          </div>
        )}
      </div>

      {/* NOTIFICATIONS */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-200 font-bold text-sm px-2"
          >
            ×
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-200 text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-400 hover:text-emerald-200 font-bold text-sm px-2"
          >
            ×
          </button>
        </div>
      )}

      {/* CREATE NEW USER ACCORDION */}
      {isCreating && (
        <form
          onSubmit={handleCreateUser}
          className="bg-stone-950 p-6 rounded-2xl border-2 border-amber-500/50 shadow-2xl space-y-5 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-3.5 border-b border-stone-800">
            <div>
              <h4 className="font-serif font-bold text-amber-400 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <span>Expedición y Autorización de Nueva Cuenta</span>
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Cree un nuevo usuario y asigne estrictamente uno de los 5 niveles de acceso.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-stone-900 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              Autoriza: <strong>{currentUser?.name || 'Carlos Salvati / Audy Palacio'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">
                Nombre Completo del Usuario *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="ej. Lic. Mariana Rivas"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">
                Nombre de Usuario (Login ID) *
              </label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="ej. mrivas"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">
                Correo Electrónico Oficial *
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="ej. mrivas@misdeliriosranch.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1.5">
                Contraseña Inicial Asignada *
              </label>
              <input
                type="text"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="delirios2025"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-300 font-semibold mb-1.5">
                Nivel de Acceso y Permisos Asignados (5 Niveles) *
              </label>
              <select
                value={newLevel}
                onChange={(e) => setNewLevel(parseInt(e.target.value, 10) as UserLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white focus:border-amber-500 focus:outline-none font-medium text-xs"
              >
                <option value={1}>
                  Nivel 1: Superusuario · Acceso Total (Exclusivo Carlos Salvati / Audy Palacio)
                </option>
                <option value={2}>
                  Nivel 2: Administrador · Gestión general de contenidos, inventario y usuarios (3-5)
                </option>
                <option value={3}>
                  Nivel 3: Editor · Edición de textos, videos render, planos y modelos
                </option>
                <option value={4}>
                  Nivel 4: Vendedor · Disponibilidad de lotes, prospectos y cotizaciones
                </option>
                <option value={5}>
                  Nivel 5: Invitado · Visualización y auditoría de solo lectura
                </option>
              </select>
            </div>
          </div>

          {/* Level Preview Details */}
          <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-white">Privilegios para este nivel:</span>
              {getBadgeForLevel(newLevel)}
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              {getUserLevelInfo(newLevel).description}
            </p>
          </div>

          <div className="pt-2 flex justify-end gap-2.5 border-t border-stone-800">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Autorizar y Grabar Usuario</span>
            </button>
          </div>
        </form>
      )}

      {/* SEARCH AND FILTER CONTROLS */}
      <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, usuario o correo..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-semibold text-[11px]">Nivel:</span>
            <select
              value={selectedLevelFilter}
              onChange={(e) => setSelectedLevelFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todos los Niveles</option>
              <option value="1">Nivel 1: Superusuario</option>
              <option value="2">Nivel 2: Administrador</option>
              <option value="3">Nivel 3: Editor</option>
              <option value="4">Nivel 4: Vendedor</option>
              <option value="5">Nivel 5: Invitado</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-semibold text-[11px]">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Suspendidos</option>
            </select>
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-900/90 text-stone-400 font-bold border-b border-stone-800 uppercase tracking-wider text-[11px]">
                <th className="p-3.5">Usuario / Identidad</th>
                <th className="p-3.5">Nivel Asignado</th>
                <th className="p-3.5">Contacto / Acceso</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Acciones de Autorización</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-stone-400">
                    No se encontraron usuarios con los criterios de búsqueda seleccionados.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isFounderCard = isFounderSuperUser(user);
                  const isCurrentUserRow = user.id === currentUser?.id || user.username === currentUser?.username;

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-stone-900/50 transition-colors ${
                        isFounderCard ? 'bg-amber-950/10' : ''
                      }`}
                    >
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow ${
                              user.level === 1
                                ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 font-black'
                                : user.level === 2
                                ? 'bg-blue-600 text-white'
                                : user.level === 3
                                ? 'bg-purple-600 text-white'
                                : user.level === 4
                                ? 'bg-emerald-600 text-stone-950 font-bold'
                                : 'bg-stone-700 text-stone-300'
                            }`}
                          >
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>

                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5 flex-wrap">
                              <span>{user.name}</span>
                              {isFounderCard && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40 flex items-center gap-0.5">
                                  <Crown className="w-3 h-3 text-amber-400" />
                                  Fundador
                                </span>
                              )}
                              {isCurrentUserRow && (
                                <span className="px-1.5 py-0.2 rounded bg-stone-800 text-stone-300 text-[9px] font-semibold border border-stone-700">
                                  Tú
                                </span>
                              )}
                            </div>
                            <div className="text-stone-400 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                              <span>@{user.username}</span>
                              <span className="text-stone-600">·</span>
                              <span className="text-stone-500 text-[10px]">
                                Creado {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">{getBadgeForLevel(user.level)}</td>

                      <td className="p-3.5 text-stone-300">
                        <div className="font-mono text-stone-300 text-[11px]">
                          {user.email || '—'}
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5">
                          {user.lastLogin
                            ? `Último acceso: ${new Date(user.lastLogin).toLocaleString()}`
                            : 'Sin inicio de sesión reciente'}
                        </div>
                      </td>

                      <td className="p-3.5">
                        {user.active ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/70 border border-rose-500/40 text-rose-300 font-semibold text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            Suspendido
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Toggle Active Status */}
                          {!isFounderCard && isAdminOrSuper && (
                            <button
                              onClick={() => handleToggleUserStatus(user)}
                              disabled={processingUserId === user.id}
                              className={`p-2 rounded-xl transition-all ${
                                user.active
                                  ? 'bg-stone-800 hover:bg-amber-950/50 text-stone-300 hover:text-amber-400'
                                  : 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-400'
                              }`}
                              title={user.active ? 'Suspender acceso' : 'Reactivar acceso'}
                            >
                              {user.active ? (
                                <UserX className="w-3.5 h-3.5" />
                              ) : (
                                <UserCheck className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          {/* Reset Password */}
                          {isAdminOrSuper && (
                            <button
                              onClick={() => handleStartResetPassword(user)}
                              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 transition-colors"
                              title="Restablecer contraseña"
                            >
                              <Key className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Edit User Button */}
                          {isAdminOrSuper && (
                            <button
                              onClick={() => handleStartEdit(user)}
                              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                              title="Editar usuario y nivel"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete User Button */}
                          {!isFounderCard && isAdminOrSuper && (
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="p-2 rounded-xl bg-stone-800 hover:bg-red-950/80 text-stone-400 hover:text-red-300 transition-colors"
                              title="Eliminar usuario definitivamente"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Founder Lock Badge */}
                          {isFounderCard && (
                            <span
                              className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              title="Protección Constitucional: Inmutable"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl text-stone-100">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <h4 className="font-serif font-bold text-lg text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <span>Modificar Permisos: {editingUser.name}</span>
              </h4>
              <span className="font-mono text-xs text-stone-400">@{editingUser.username}</span>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Nivel de Acceso Asignado
                </label>
                <select
                  value={editLevel}
                  onChange={(e) => setEditLevel(parseInt(e.target.value, 10) as UserLevel)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value={1}>
                    Nivel 1: Superusuario (Carlos Salvati / Audy Palacio - Acceso Total)
                  </option>
                  <option value={2}>
                    Nivel 2: Administrador (Gestión amplia de contenidos e inventario)
                  </option>
                  <option value={3}>
                    Nivel 3: Editor (Textos, videos render, planos y modelos)
                  </option>
                  <option value={4}>
                    Nivel 4: Vendedor (Disponibilidad de 57 lotes y prospectos)
                  </option>
                  <option value={5}>
                    Nivel 5: Invitado (Visualizador / Auditor en solo lectura)
                  </option>
                </select>
                <p className="text-[11px] text-stone-400 mt-1">
                  {getUserLevelInfo(editLevel).description}
                </p>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Nueva Contraseña (dejar en blanco para conservar la actual)
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="chk-edit-active"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 bg-stone-950 border-stone-700 focus:ring-amber-500"
                />
                <label htmlFor="chk-edit-active" className="text-xs font-semibold text-stone-200">
                  Cuenta habilitada para iniciar sesión en el CMS
                </label>
              </div>

              <div className="pt-4 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-md"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-md shadow-2xl text-stone-100">
            <h4 className="font-serif font-bold text-base text-white mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Restablecer Contraseña para {resettingUser.name}</span>
            </h4>
            <p className="text-xs text-stone-400 mb-4">
              Defina una nueva clave de acceso para el usuario <strong>@{resettingUser.username}</strong>.
            </p>

            <form onSubmit={handleConfirmResetPassword} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Nueva Contraseña Temporal *
                </label>
                <input
                  type="text"
                  required
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold shadow-md"
                >
                  Actualizar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5 ACCESS LEVELS REFERENCE CARDS */}
      <div className="pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Estructura Constitucional de los 5 Niveles de Acceso</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Level 1 */}
          <div className="p-4 rounded-2xl bg-stone-950 border-2 border-amber-500/40 shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-400">Nivel 1: Superusuario</span>
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Carlos Salvati y Audy Palacio. Llave maestra con control total sobre todos los CMS,
                autorización de usuarios y auditoría general.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-800/80 text-[10px] text-amber-300/80 font-semibold">
              ✓ 11 Secciones Disponibles
            </div>
          </div>

          {/* Level 2 */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-blue-500/40 shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-blue-400">Nivel 2: Administrador</span>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Gestión amplia de contenidos, catálogo e inventario de lotes. Puede crear y autorizar
                usuarios de niveles 3, 4 y 5.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-800/80 text-[10px] text-blue-300/80 font-semibold">
              ✓ Contenidos, Lotes y Usuarios
            </div>
          </div>

          {/* Level 3 */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-purple-500/40 shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-purple-400">Nivel 3: Editor</span>
                <Edit2 className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Edición de textos, videos render de la propuesta, planos del plan maestro, modelos
                habitacionales y sostenibilidad. Sin gestión de usuarios.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-800/80 text-[10px] text-purple-300/80 font-semibold">
              ✓ Contenidos y Multimedia
            </div>
          </div>

          {/* Level 4 */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-emerald-500/40 shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-emerald-400">Nivel 4: Vendedor</span>
                <Building className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Actualización de disponibilidad de los 57 lotes (disponible, reservado, vendido),
                gestión y seguimiento de prospectos comerciales.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-800/80 text-[10px] text-emerald-300/80 font-semibold">
              ✓ Lotes, Disponibilidad y Leads
            </div>
          </div>

          {/* Level 5 */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-700 shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-stone-300">Nivel 5: Invitado</span>
                <Eye className="w-4 h-4 text-stone-400" />
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Modo de sólo lectura para auditoría y visualización del complejo. No cuenta con
                botones de guardado ni permisos de modificación.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-stone-800/80 text-[10px] text-stone-400 font-semibold">
              ✓ Solo Lectura / Auditoría
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
