import React, { useState } from 'react';
import { X, Lock, Shield, User, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { loginAdmin } from '../lib/api';
import { AppUser } from '../types';

interface CmsLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: Partial<AppUser> & { token: string }) => void;
}

export const CmsLoginModal: React.FC<CmsLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await loginAdmin(username, password);
      onLoginSuccess(user as any);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al autenticar. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      id="cms-login-modal"
    >
      <div
        className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-stone-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          id="close-login-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-white tracking-wide">
              Acceso Administrativo CMS
            </h3>
            <p className="text-xs text-stone-400">
              Gestión de Contenidos, Disponibilidad y Usuarios
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Usuario o Correo Electrónico
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej. csalvati o apalacio"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-stone-950 border border-stone-800 text-white placeholder-stone-600 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                id="login-username-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-stone-950 border border-stone-800 text-white placeholder-stone-600 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                id="login-password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            id="login-submit-btn"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                <span>Verificando accesos...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Ingresar al Sistema CMS</span>
              </>
            )}
          </button>
        </form>

        {/* Fast Credentials Selector for convenience */}
        <div className="mt-6 pt-5 border-t border-stone-800/80">
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mb-2.5">
            Super Usuarios Fundadores & Niveles (Clic para autocompletar):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setDemoCredentials('csalvati', 'password123')}
              className="p-2 rounded-lg bg-stone-950/80 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/50 text-left transition-all group"
            >
              <div className="font-bold text-amber-400 group-hover:text-amber-300">Carlos Salvati</div>
              <div className="text-[10px] text-stone-400">Nivel 1 · Super Usuario</div>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('apalacio', 'password123')}
              className="p-2 rounded-lg bg-stone-950/80 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/50 text-left transition-all group"
            >
              <div className="font-bold text-amber-400 group-hover:text-amber-300">Audy Palacio</div>
              <div className="text-[10px] text-stone-400">Nivel 1 · Super Usuario</div>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('admin', 'delirios2025')}
              className="p-2 rounded-lg bg-stone-950/80 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/50 text-left transition-all group"
            >
              <div className="font-bold text-stone-200">Admin General</div>
              <div className="text-[10px] text-stone-400">Nivel 2 · Administrador</div>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('editor', 'delirios2025')}
              className="p-2 rounded-lg bg-stone-950/80 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/50 text-left transition-all group"
            >
              <div className="font-bold text-stone-200">Editor</div>
              <div className="text-[10px] text-stone-400">Nivel 3 · Textos & Planos</div>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('ventas', 'delirios2025')}
              className="p-2 rounded-lg bg-stone-950/80 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/50 text-left transition-all group"
            >
              <div className="font-bold text-stone-200">Ventas</div>
              <div className="text-[10px] text-stone-400">Nivel 4 · Lotes & Leads</div>
            </button>

            <button
              type="button"
              onClick={() => setDemoCredentials('invitado', 'delirios2025')}
              className="p-2 rounded-lg bg-stone-950/80 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/50 text-left transition-all group"
            >
              <div className="font-bold text-stone-200">Invitado</div>
              <div className="text-[10px] text-stone-400">Nivel 5 · Solo Lectura</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
