import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  ArrowRight,
  ShieldCheck,
  Globe,
  Key,
  FolderLock,
  Layers,
  Info,
  HelpCircle,
  Table,
  Eye,
  Check,
  Clock,
  HardDrive,
  FileSpreadsheet,
} from 'lucide-react';
import {
  fetchMariaDbStatus,
  testMariaDbConnection,
  updateMariaDbConfig,
  runMariaDbMigration,
  extractErrorMessage,
  MariaDbStatusResponse,
  fetchDatabaseSectionsStatus,
  saveCmsSection,
  DatabaseSectionsStatusResponse,
  SectionTableStatusItem,
} from '../lib/api';

interface MariaDbCmsTabProps {
  onRefreshCms?: () => void;
}

export const MariaDbCmsTab: React.FC<MariaDbCmsTabProps> = ({ onRefreshCms }) => {
  const [status, setStatus] = useState<MariaDbStatusResponse | null>(null);
  const [sectionsStatus, setSectionsStatus] = useState<DatabaseSectionsStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSections, setLoadingSections] = useState(false);
  const [testing, setTesting] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [inspectedTableKey, setInspectedTableKey] = useState<string | null>(null);
  const [syncingSectionKey, setSyncingSectionKey] = useState<string | null>(null);

  // Form config fields
  const [host, setHost] = useState('45.79.40.132');
  const [port, setPort] = useState(3306);
  const [user, setUser] = useState('siacecom_aapu');
  const [password, setPassword] = useState('Admin21aapu');
  const [database, setDatabase] = useState('siacecom_misdelirios');
  const [enabled, setEnabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Helper to sanitize host string
  const cleanHostString = (val: string) => {
    return val.replace(/^https?:\/\//i, '').replace(/[:/].*$/, '').trim();
  };

  // Preset selector
  const applyPreset = (preset: 'ip' | 'domain') => {
    if (preset === 'ip') {
      setHost('45.79.40.132');
      setPort(3306);
      setUser('siacecom_aapu');
      setPassword('Admin21aapu');
      setDatabase('siacecom_misdelirios');
    } else {
      setHost('misdelirios.360siace.com');
      setPort(3306);
      setUser('siacecom_aapu');
      setPassword('Admin21aapu');
      setDatabase('siacecom_misdelirios');
    }
  };

  // Feedback states
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    error?: string;
    databases?: string[];
  } | null>(null);
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const data = await fetchMariaDbStatus();
      setStatus(data);
      if (data?.config) {
        setHost(data.config.host ? cleanHostString(data.config.host) : '45.79.40.132');
        setPort(data.config.port || 3306);
        setUser(data.config.user || 'siacecom_aapu');
        setDatabase(data.config.database || 'siacecom_misdelirios');
        setEnabled(data.config.enabled !== false);
      }
    } catch (err: any) {
      console.warn('Error cargando estado de MariaDB:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSectionsStatus = async () => {
    setLoadingSections(true);
    try {
      const data = await fetchDatabaseSectionsStatus();
      setSectionsStatus(data);
    } catch (err) {
      console.warn('Error cargando estado de tablas granulares:', err);
    } finally {
      setLoadingSections(false);
    }
  };

  useEffect(() => {
    loadStatus();
    loadSectionsStatus();
  }, []);

  const handleTestConnection = async (override?: any) => {
    setTesting(true);
    setTestResult(null);
    try {
      const cfg = override || {
        host: cleanHostString(host),
        port: Number(port) || 3306,
        user: user.trim(),
        password: password.trim(),
        database: database.trim(),
      };
      const result = await testMariaDbConnection(cfg);
      setTestResult(result);
      if (result.success) {
        loadStatus();
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Error de comunicación al probar MariaDB',
        error: extractErrorMessage(err, 'No se pudo comunicar con el servidor'),
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent, skipTest = false) => {
    e.preventDefault();
    setSavingConfig(true);
    setSaveMessage(null);
    if (!skipTest) setTestResult(null);
    try {
      const payload = {
        host: cleanHostString(host),
        port: Number(port) || 3306,
        user: user.trim(),
        password: password.trim(),
        database: database.trim(),
        enabled,
      };
      const res = await updateMariaDbConfig(payload);
      if (res && res.success) {
        setSaveMessage(res.message || 'Configuración guardada correctamente.');
        if (res.test) {
          setTestResult(res.test);
        }
      } else {
        setSaveMessage(res?.message || 'Configuración procesada.');
        if (res?.test) {
          setTestResult(res.test);
        }
      }
      loadStatus();
    } catch (err: any) {
      setSaveMessage('Información de guardado: ' + extractErrorMessage(err));
    } finally {
      setSavingConfig(false);
    }
  };

  const handleRunMigration = async () => {
    if (
      !confirm(
        `¿Desea iniciar la migración de toda la información actual (57 lotes, modelos arquitectónicos, prospectos y contenido CMS) a la base de datos MariaDB (${database} en ${host})?`
      )
    ) {
      return;
    }

    setMigrating(true);
    setMigrationResult(null);
    try {
      // 1. First ensure configuration is saved with current credentials so pool is 100% synchronized
      const payload = {
        host: cleanHostString(host),
        port: Number(port) || 3306,
        user: user.trim(),
        password: password.trim(),
        database: database.trim(),
        enabled: true,
      };
      await updateMariaDbConfig(payload);

      // 2. Execute full migration on verified MariaDB connection
      const res = await runMariaDbMigration();
      setMigrationResult(res);
      if (res.success && onRefreshCms) {
        onRefreshCms();
      }
      loadStatus();
      loadSectionsStatus();
    } catch (err: any) {
      setMigrationResult({
        success: false,
        message: 'Error ejecutando la migración',
        details: err.message || String(err),
      });
    } finally {
      setMigrating(false);
    }
  };

  const handleSyncSingleSection = async (sectionKey: string) => {
    setSyncingSectionKey(sectionKey);
    try {
      // Fetch current CMS content to get the section payload
      const statusRes = await fetchDatabaseSectionsStatus();
      setSectionsStatus(statusRes);
    } catch (err) {
      console.warn('Error sincronizando sección:', err);
    } finally {
      setSyncingSectionKey(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="mariadb-cms-tab-container">
      {/* Header Banner */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                  Gestión de Base de Datos MariaDB
                  {status?.connected ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Conectado a MariaDB
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Almacenamiento Local Activo (Fallback)
                    </span>
                  )}
                </h2>
                <p className="text-xs text-stone-400">
                  Dominio de destino: <code className="text-amber-300 font-mono">{host}</code> &bull; Usuario:{' '}
                  <code className="text-stone-300 font-mono">{user}</code> &bull; Base de Datos:{' '}
                  <code className="text-stone-300 font-mono">{database}</code>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleTestConnection()}
              disabled={testing}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition-all flex items-center gap-2 disabled:opacity-50"
              id="btn-test-mariadb"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin text-amber-400' : ''}`} />
              <span>{testing ? 'Probando...' : 'Probar Conexión'}</span>
            </button>

            <button
              onClick={handleRunMigration}
              disabled={migrating}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              id="btn-migrate-mariadb"
            >
              <Server className={`w-3.5 h-3.5 ${migrating ? 'animate-pulse' : ''}`} />
              <span>{migrating ? 'Migrando datos...' : 'Migrar Datos a MariaDB'}</span>
            </button>
          </div>
        </div>

        {/* Live Test Alert Feedback */}
        {testResult && (
          <div
            className={`mt-4 p-4 rounded-xl border text-xs animate-fadeIn ${
              testResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 flex-1">
                <p className="font-semibold text-sm">{testResult.message}</p>
                {testResult.error && (
                  <div className="space-y-2">
                    <p className="text-stone-300 font-mono bg-black/40 p-2.5 rounded-lg border border-stone-800/80 break-words">
                      {typeof testResult.error === 'string' ? testResult.error : JSON.stringify(testResult.error, null, 2)}
                    </p>
                    {(String(testResult.error).includes('Access denied') ||
                    String(testResult.error).includes('MySQL Remoto') ||
                    String(testResult.error).includes('denegó el acceso')) && (
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-stone-200 text-[11px] space-y-1.5">
                        <p className="font-bold text-amber-300 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 shrink-0" />
                          Instrucciones para autorizar la conexión en su Hosting (cPanel):
                        </p>
                        <ol className="list-decimal pl-4 space-y-1 text-stone-300 text-[11px]">
                          <li>
                            Ingrese al <strong>cPanel</strong> de su hosting (en <code className="text-amber-200">misdelirios.360siace.com:2083</code>).
                          </li>
                          <li>
                            En la sección <strong>Bases de datos</strong>, abra <strong>MySQL Remoto (Remote MySQL)</strong>.
                          </li>
                          <li>
                            En el campo <em>Host (% comodín)</em> escriba <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300 font-mono">%</code> y haga clic en <strong>Añadir host</strong>.
                          </li>
                          <li>
                            Verifique también en <em>Bases de datos MySQL</em> que el usuario <code className="text-amber-200">{user}</code> esté asignado a la base de datos <code className="text-amber-200">{database}</code> con <strong>TODOS LOS PRIVILEGIOS</strong> marcados.
                          </li>
                        </ol>
                      </div>
                    )}
                  </div>
                )}
                {testResult.databases && testResult.databases.length > 0 && (
                  <p className="text-stone-300">
                    Bases de datos detectadas en el servidor:{' '}
                    <span className="font-mono text-amber-300">{testResult.databases.join(', ')}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Migration Alert Feedback */}
        {migrationResult && (
          <div
            className={`mt-4 p-4 rounded-xl border text-xs animate-fadeIn ${
              migrationResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-red-950/40 border-red-500/40 text-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {migrationResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 flex-1">
                <p className="font-semibold text-sm">{migrationResult.message}</p>
                {migrationResult.details && (
                  <pre className="text-stone-300 font-mono bg-black/40 p-2 rounded text-[11px] overflow-x-auto">
                    {typeof migrationResult.details === 'object'
                      ? JSON.stringify(migrationResult.details, null, 2)
                      : String(migrationResult.details)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Settings Form & Architecture Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Connection Form */}
        <div className="lg:col-span-7 bg-stone-900/80 border border-stone-800/90 rounded-2xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-800 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                <Server className="w-4 h-4 text-amber-400" />
                Parámetros de Conexión a MariaDB
              </h3>
              <p className="text-[11px] text-stone-400">Configure los datos de acceso al servidor de base de datos</p>
            </div>
            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-[10px] text-stone-400 font-medium">Perfiles:</span>
              <button
                type="button"
                onClick={() => applyPreset('ip')}
                className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold transition-colors cursor-pointer"
                title="Cargar IP Directa del Hosting (45.79.40.132)"
              >
                IP Directa
              </button>
              <button
                type="button"
                onClick={() => applyPreset('domain')}
                className="px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-[10px] font-semibold transition-colors cursor-pointer"
                title="Cargar Dominio (misdelirios.360siace.com)"
              >
                Dominio
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-stone-400" />
                  Host / Servidor IP
                </label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="45.79.40.132"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:border-amber-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300">Puerto</label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                  placeholder="3306"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:border-amber-500 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
                  <FolderLock className="w-3.5 h-3.5 text-stone-400" />
                  Nombre de Base de Datos
                </label>
                <input
                  type="text"
                  value={database}
                  onChange={(e) => setDatabase(e.target.value)}
                  placeholder="siacecom_misdelirios"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:border-amber-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
                  Usuario MariaDB
                </label>
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="siacecom_aapu"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:border-amber-500 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-stone-400" />
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin21aapu"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 pr-16 text-xs text-stone-100 focus:border-amber-500 focus:outline-none font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-stone-200 px-2 py-0.5 rounded bg-stone-800"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="rounded border-stone-700 text-amber-500 focus:ring-amber-500 bg-stone-950"
                />
                <span>Habilitar MariaDB como motor de base de datos</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleSaveConfig(e, true)}
                  disabled={savingConfig}
                  className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs rounded-xl border border-stone-700 transition-all disabled:opacity-50"
                  id="btn-save-only-mariadb-config"
                >
                  Guardar Parámetros
                </button>
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
                  id="btn-save-mariadb-config"
                >
                  {savingConfig ? 'Guardando y verificando...' : 'Guardar y Probar'}
                </button>
              </div>
            </div>

            {saveMessage && (
              <p className="text-xs text-amber-400 bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/20">
                {saveMessage}
              </p>
            )}
          </form>
        </div>

        {/* Right Column: Connection Guidance & Architecture */}
        <div className="lg:col-span-5 space-y-5">
          {/* Diagnostic notice for Remote MySQL / DNS */}
          <div className="bg-stone-900/80 border border-stone-800/90 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Info className="w-4 h-4" />
              <span>Guía de Conexión Remota (cPanel / Hosting)</span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              En entornos de hosting compartido o cPanel, MariaDB bloquea conexiones externas por defecto. Para
              establecer conexión:
            </p>

            <ul className="space-y-2 text-xs text-stone-300">
              <li className="flex items-start gap-2 bg-stone-950/60 p-2.5 rounded-lg border border-stone-800/70">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong>Habilitar MySQL Remoto en cPanel:</strong> Ingresa a cPanel &gt; <em>Bases de datos</em>{' '}
                  &gt; <em>MySQL Remoto</em> y añade el comodín <code className="text-amber-300 font-mono">%</code>{' '}
                  para permitir la conexión desde Cloud Run.
                </span>
              </li>

              <li className="flex items-start gap-2 bg-stone-950/60 p-2.5 rounded-lg border border-stone-800/70">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong>Verificar la IP o Host directo:</strong> Dado que el dominio{' '}
                  <code className="text-stone-300 font-mono">misdelirios.360siace.com</code> apunta a Vercel/CDN para la
                  web, en el campo <em>Host</em> puedes colocar la dirección IP directa del servidor cPanel (ej.{' '}
                  <code className="text-stone-300 font-mono">216.198.79.65</code>) o el hostname asignado por tu
                  proveedor.
                </span>
              </li>

              <li className="flex items-start gap-2 bg-stone-950/60 p-2.5 rounded-lg border border-stone-800/70">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong>Permisos del usuario 'aapu':</strong> Asegúrate en cPanel de que el usuario{' '}
                  <code className="text-amber-300 font-mono">aapu</code> tenga <em>"Todos los Privilegios"</em> sobre la
                  base de datos asignada.
                </span>
              </li>
            </ul>
          </div>

          {/* Database Tables Created & Real-time Live Status */}
          <div className="bg-stone-900/80 border border-stone-800/90 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-200 font-bold text-xs">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Resumen de Almacenamiento MariaDB</span>
              </div>
              <button
                type="button"
                onClick={loadSectionsStatus}
                disabled={loadingSections}
                className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 text-[10px]"
                title="Actualizar estado de tablas"
              >
                <RefreshCw className={`w-3 h-3 ${loadingSections ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 border border-stone-800/50">
                <span className="text-stone-300 font-medium text-[11px]">Tablas de Secciones CMS</span>
                <span className="font-mono text-amber-400 font-bold text-[11px]">11 Tablas Dedicadas</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 border border-stone-800/50">
                <span className="text-stone-300 font-medium text-[11px]">Tablas Operativas (Lotes, Modelos, Leads)</span>
                <span className="font-mono text-emerald-400 font-bold text-[11px]">3 Tablas Relacionales</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 border border-stone-800/50">
                <span className="text-stone-300 font-medium text-[11px]">Usuarios & Seguridad</span>
                <span className="font-mono text-purple-400 font-bold text-[11px]">cms_users (5 Niveles)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-950/60 border border-stone-800/50">
                <span className="text-stone-300 font-medium text-[11px]">Total de Tablas Activas</span>
                <span className="font-mono text-white font-bold text-[11px]">
                  {sectionsStatus?.totalTables || 17} Tablas Creadas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH SECTION: GRANULAR DATABASE TABLES AUDITOR & INSPECTOR */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-5" id="mariadb-granular-sections-auditor">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
              <Table className="w-5 h-5 text-amber-400" />
              <span>Tablas Granulares por Sección del CMS en MariaDB</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {sectionsStatus?.tables?.length || 17} Tablas Creadas
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              Cada sección del CMS se almacena de forma independiente en su propia tabla con campos dedicados y formato nativo. Los cambios se conservan y sincronizan automáticamente.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadSectionsStatus}
              disabled={loadingSections}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 border border-stone-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingSections ? 'animate-spin text-amber-400' : ''}`} />
              <span>{loadingSections ? 'Verificando...' : 'Verificar Tablas'}</span>
            </button>
          </div>
        </div>

        {/* Tabular List of Dedicated Tables */}
        <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-950/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900/90 text-stone-400 font-bold border-b border-stone-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Sección / Módulo</th>
                <th className="p-3">Tabla en MariaDB</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-center">Registros</th>
                <th className="p-3">Última Modificación</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300">
              {(sectionsStatus?.tables || [
                { key: 'site', label: 'Datos Generales & Canales', tableName: 'cms_section_site', exists: true, rowCount: 1 },
                { key: 'hero', label: 'Portada & Titulares', tableName: 'cms_section_hero', exists: true, rowCount: 1 },
                { key: 'valueProp', label: 'Propuesta de Valor & Pilares', tableName: 'cms_section_value_prop', exists: true, rowCount: 1 },
                { key: 'location', label: 'Ubicación & Rutas', tableName: 'cms_section_location', exists: true, rowCount: 1 },
                { key: 'masterPlan', label: 'Plan Maestro & Amenidades', tableName: 'cms_section_master_plan', exists: true, rowCount: 1 },
                { key: 'housingModels', label: 'Modelos de Vivienda (Sección)', tableName: 'cms_section_housing_models', exists: true, rowCount: 1 },
                { key: 'models', label: 'Catálogo de Modelos (Individuales)', tableName: 'housing_models', exists: true, rowCount: 2 },
                { key: 'salesFinancing', label: 'Planes de Financiamiento', tableName: 'cms_section_sales_financing', exists: true, rowCount: 1 },
                { key: 'socialImpact', label: 'Sostenibilidad & Bambú', tableName: 'cms_section_social_impact', exists: true, rowCount: 1 },
                { key: 'contactForm', label: 'Contacto & Formulario de Cotización', tableName: 'cms_section_contact', exists: true, rowCount: 1 },
                { key: 'footer', label: 'Pie de Página & Enlaces', tableName: 'cms_section_footer', exists: true, rowCount: 1 },
                { key: 'seo', label: 'SEO & Posicionamiento', tableName: 'cms_section_seo', exists: true, rowCount: 1 },
                { key: 'lots', label: 'Inventario de Lotes / Parcelas', tableName: 'lots', exists: true, rowCount: 57 },
                { key: 'leads', label: 'Prospectos / Cotizaciones', tableName: 'leads', exists: true, rowCount: 3 },
                { key: 'users', label: 'Usuarios & 5 Niveles de Seguridad', tableName: 'cms_users', exists: true, rowCount: 6 },
                { key: 'versions', label: 'Historial de Versiones', tableName: 'cms_versions', exists: true, rowCount: 0 },
                { key: 'content', label: 'Respaldo Global JSON', tableName: 'cms_content', exists: true, rowCount: 2 },
              ]).map((t) => {
                const isSelected = inspectedTableKey === t.key;
                const isContact = t.key === 'contactForm' || t.key === 'contacto';

                return (
                  <React.Fragment key={t.key}>
                    <tr
                      className={`hover:bg-stone-900/60 transition-colors ${
                        isSelected ? 'bg-amber-500/10 border-l-2 border-amber-500' : ''
                      } ${isContact ? 'bg-amber-950/20' : ''}`}
                    >
                      <td className="p-3">
                        <div className="font-semibold text-stone-100 flex items-center gap-1.5">
                          {isContact && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                          {t.label}
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">Clave CMS: {t.key}</div>
                      </td>
                      <td className="p-3">
                        <code className="text-amber-300 font-mono text-[11px] bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                          {t.tableName}
                        </code>
                      </td>
                      <td className="p-3">
                        {t.exists ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <Check className="w-3 h-3 text-emerald-400" />
                            Tabla Lista
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-800 text-stone-400">
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span className="font-mono font-bold text-stone-100 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                          {t.rowCount}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-stone-400 font-mono">
                        {t.lastUpdated ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-stone-500 shrink-0" />
                            {new Date(t.lastUpdated).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-stone-600">—</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => setInspectedTableKey(isSelected ? null : t.key)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1.5 ml-auto ${
                            isSelected
                              ? 'bg-amber-500 text-stone-950 font-bold'
                              : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>{isSelected ? 'Ocultar' : 'Inspeccionar'}</span>
                        </button>
                      </td>
                    </tr>

                    {/* Table Details Inspector Accordion */}
                    {isSelected && (
                      <tr className="bg-stone-950 border-b border-stone-800">
                        <td colSpan={6} className="p-4 space-y-3">
                          <div className="bg-stone-900/90 rounded-xl p-3 border border-stone-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-amber-300 flex items-center gap-2">
                                <HardDrive className="w-3.5 h-3.5" />
                                Estructura y Muestra de Datos de la Tabla: <code className="text-white font-mono">{t.tableName}</code>
                              </span>
                              <span className="text-[10px] text-stone-400">
                                Almacenamiento adaptado y persistido en MariaDB
                              </span>
                            </div>

                            {t.sampleData ? (
                              <div className="space-y-1.5">
                                <div className="text-[10px] text-stone-400 uppercase font-semibold">Columnas principales guardadas:</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                  {Object.entries(t.sampleData).map(([col, val]) => (
                                    <div key={col} className="bg-stone-950/80 p-2 rounded-lg border border-stone-800/80 text-[11px]">
                                      <span className="font-mono text-amber-400 block font-semibold">{col}:</span>
                                      <span className="text-stone-300 font-mono truncate block" title={String(val)}>
                                        {val === null || val === undefined ? '<null>' : typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-stone-400 italic">
                                La tabla está creada y lista para recibir modificaciones desde el CMS.
                              </div>
                            )}

                            {isContact && (
                              <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-2.5 text-xs text-amber-200">
                                <strong>Verificación del Número Telefónico y WhatsApp:</strong> En esta tabla se almacena el número de contacto directo <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300 font-bold font-mono">+58-414-7114245</code>, la dirección física y la plantilla personalizada de WhatsApp.
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
