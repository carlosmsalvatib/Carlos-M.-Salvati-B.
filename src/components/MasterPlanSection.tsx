import React, { useState } from 'react';
import { CmsContent, LotItem, LotStatus } from '../types';
import { Layers, ZoomIn, Search, CheckCircle2, Clock, XCircle, Download, ArrowRight, X, Sparkles, Filter } from 'lucide-react';

interface MasterPlanSectionProps {
  content: CmsContent;
  lots: LotItem[];
  onSelectLotForQuote: (lot: LotItem) => void;
}

export const MasterPlanSection: React.FC<MasterPlanSectionProps> = ({ content, lots, onSelectLotForQuote }) => {
  const { masterPlan } = content;
  if (!masterPlan.active) return null;

  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [filterLocation, setFilterLocation] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [selectedLotDetail, setSelectedLotDetail] = useState<LotItem | null>(null);

  // Filter lots
  const filteredLots = lots.filter((lot) => {
    const matchesStatus = filterStatus === 'todos' || lot.status === filterStatus;
    const matchesLocation = filterLocation === 'todos' || lot.location === filterLocation;
    const matchesSearch =
      lot.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.manzana.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesLocation && matchesSearch;
  });

  // Calculate stats
  const availableCount = lots.filter((l) => l.status === 'disponible').length;
  const reservedCount = lots.filter((l) => l.status === 'reservado').length;
  const soldCount = lots.filter((l) => l.status === 'vendido').length;

  const getStatusBadge = (status: LotStatus) => {
    switch (status) {
      case 'disponible':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Disponible
          </span>
        );
      case 'reservado':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3 text-amber-600" />
            Reservado
          </span>
        );
      case 'vendido':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3 text-rose-600" />
            Vendido
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
            No disponible
          </span>
        );
    }
  };

  return (
    <section id="plan-maestro" className="py-20 bg-stone-50 text-stone-800 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>Urbanismo Planificado</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4" id="masterplan-title">
            {masterPlan.title || 'Distribución del Plan Maestro: 57 Soluciones Habitacionales'}
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed" id="masterplan-desc">
            {masterPlan.description}
          </p>
        </div>

        {/* The Two Main Sectors: Lote 1 & Lote 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Lote 1 */}
          <div className="bg-white border-2 border-blue-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                Sector 1 · {masterPlan.lote1.zone}
              </span>
              <span className="text-sm font-bold text-blue-700">{masterPlan.lote1.lotsCount} Lotes</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">{masterPlan.lote1.name}</h3>
            <p className="text-stone-600 text-sm mb-4">{masterPlan.lote1.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs text-stone-500">
              <span>Superficie total:</span>
              <span className="font-bold text-stone-900 text-sm">{masterPlan.lote1.areaM2.toLocaleString('es-VE')} m²</span>
            </div>
          </div>

          {/* Lote 2 */}
          <div className="bg-white border-2 border-emerald-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                Sector 2 · {masterPlan.lote2.zone}
              </span>
              <span className="text-sm font-bold text-emerald-700">{masterPlan.lote2.lotsCount} Lotes</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">{masterPlan.lote2.name}</h3>
            <p className="text-stone-600 text-sm mb-4">{masterPlan.lote2.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs text-stone-500">
              <span>Superficie total:</span>
              <span className="font-bold text-stone-900 text-sm">{masterPlan.lote2.areaM2.toLocaleString('es-VE')} m²</span>
            </div>
          </div>
        </div>

        {/* Master Plan Blueprint Visualizer with Zoom Capability */}
        <div className="bg-stone-900 rounded-2xl p-4 sm:p-6 border border-stone-800 shadow-xl mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <span className="text-white font-serif font-bold text-lg">Plano Arquitectónico y Lotificación</span>
              <span className="text-xs text-stone-400">Escala 1:2000 Oficial</span>
            </div>
            <button
              onClick={() => setIsZoomModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition-colors shadow-sm"
              id="btn-open-blueprint-zoom"
            >
              <ZoomIn className="w-4 h-4" />
              <span>Ampliar Plano en Alta Resolución</span>
            </button>
          </div>

          <div className="relative mt-4 rounded-xl overflow-hidden cursor-pointer group bg-stone-950 flex items-center justify-center" onClick={() => setIsZoomModalOpen(true)}>
            <img
              src={masterPlan.planImageUrl || '/api/images/blueprint-masterplan'}
              alt="Plano de lotificación oficial Mis Delirios Ranch"
              className="w-full max-h-[480px] object-contain transition-transform duration-300 group-hover:scale-101"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-lg bg-stone-900/90 text-amber-300 text-xs font-semibold backdrop-blur-sm border border-amber-400/40">
                Haz clic para ver en pantalla completa
              </span>
            </div>
          </div>

          {/* Availability Legend & Stats Counter */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-stone-800 text-xs text-stone-300">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Disponibles: <strong className="text-white font-bold">{availableCount}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span>Reservados: <strong className="text-white font-bold">{reservedCount}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span>Vendidos: <strong className="text-white font-bold">{soldCount}</strong></span>
              </div>
            </div>
            <div className="text-amber-400 font-medium">
              Preventa Etapa 1 · Valor garantizado: 20 USD/m²
            </div>
          </div>
        </div>

        {/* Interactive Lots Filter & Searchable Catalog Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900">Catálogo de Disponibilidad en Tiempo Real</h3>
              <p className="text-xs text-stone-500">Selecciona cualquier lote para consultar sus dimensiones, linderos y simular tu financiamiento.</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search */}
              <div className="relative min-w-[160px]">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar lote..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-stone-50 text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="todos">Todos los Estados</option>
                <option value="disponible">Disponibles ({availableCount})</option>
                <option value="reservado">Reservados ({reservedCount})</option>
                <option value="vendido">Vendidos ({soldCount})</option>
              </select>

              {/* Location Filter */}
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-stone-50 text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="todos">Todos los Sectores</option>
                <option value="alta">Parte Alta (Colinas - 14 lotes)</option>
                <option value="baja">Parte Baja (Ranch - 43 lotes)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[440px] rounded-xl border border-stone-200">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-100 text-stone-900 font-semibold sticky top-0 z-10 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Lote / Código</th>
                  <th className="py-3 px-3">Manzana</th>
                  <th className="py-3 px-3">Sector</th>
                  <th className="py-3 px-3">Superficie</th>
                  <th className="py-3 px-3">Precio m²</th>
                  <th className="py-3 px-3">Inversión Total</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-normal">
                {filteredLots.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-stone-400">
                      No se encontraron lotes con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredLots.map((lot) => (
                    <tr
                      key={lot.id}
                      className={`hover:bg-stone-50 transition-colors ${
                        lot.status === 'disponible' ? 'cursor-pointer' : ''
                      }`}
                      onClick={() => lot.status === 'disponible' && setSelectedLotDetail(lot)}
                    >
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {lot.code}
                      </td>
                      <td className="py-3 px-3 font-semibold text-stone-600">
                        Mz. {lot.manzana}
                      </td>
                      <td className="py-3 px-3 text-stone-500 capitalize">
                        {lot.location === 'alta' ? 'Parte Alta' : 'Parte Baja'}
                      </td>
                      <td className="py-3 px-3 font-medium">
                        {lot.areaM2.toLocaleString('es-VE')} m²
                      </td>
                      <td className="py-3 px-3 text-stone-500">
                        ${lot.priceUsdPerM2} USD
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-700">
                        ${lot.totalPriceUsd.toLocaleString('es-VE')} USD
                      </td>
                      <td className="py-3 px-3">
                        {getStatusBadge(lot.status)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {lot.status === 'disponible' ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectLotForQuote(lot);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors"
                          >
                            <span>Cotizar</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-stone-400 text-xs">No disponible</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contacto"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-emerald-700 hover:bg-emerald-600 text-white shadow-md transition-all"
            id="masterplan-ver-disponibilidad-cta"
          >
            <span>{masterPlan.primaryCtaText || 'Ver disponibilidad de lotes'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#contacto?asunto=solicitar_plano_detallado"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 shadow-sm transition-all"
            id="masterplan-solicitar-plano-cta"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>{masterPlan.secondaryCtaText || 'Solicitar plano detallado en PDF'}</span>
          </a>
        </div>
      </div>

      {/* Blueprint Fullscreen Zoom Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-6 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800 text-white">
            <div>
              <h4 className="font-serif font-bold text-base sm:text-lg text-amber-400">
                Plano de Lotificación Complejo Mis Delirios Ranch
              </h4>
              <p className="text-xs text-stone-400">57 Lotes · Manzanas A1, A2, B, C, D, E, F, G · Vialidad 8 a 10 metros</p>
            </div>
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-auto flex items-center justify-center p-4">
            <img
              src={masterPlan.planImageUrl || '/api/images/blueprint-masterplan'}
              alt="Plano detallado de lotificación"
              className="max-w-none w-full lg:w-[1400px] h-auto object-contain shadow-2xl rounded-lg"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between text-xs text-stone-400 gap-2">
            <span>Usa el scroll o gestos táctiles para explorar los linderos, calles internas y áreas comunales.</span>
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="px-4 py-1.5 rounded-lg bg-stone-800 text-white hover:bg-stone-700 font-semibold"
            >
              Cerrar visor
            </button>
          </div>
        </div>
      )}

      {/* Lot Detail Quick Preview Modal */}
      {selectedLotDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl text-stone-900">Lote {selectedLotDetail.code}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-semibold">
                  Mz. {selectedLotDetail.manzana}
                </span>
              </div>
              <button
                onClick={() => setSelectedLotDetail(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Sector:</span>
                <span className="font-semibold text-stone-900">
                  {selectedLotDetail.location === 'alta' ? 'Colinas de Mis Delirios (Parte Alta)' : 'Mis Delirios Ranch (Parte Baja)'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Superficie exacta:</span>
                <span className="font-bold text-stone-900">{selectedLotDetail.areaM2.toLocaleString('es-VE')} m²</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Precio preventa por m²:</span>
                <span className="font-semibold text-emerald-700">${selectedLotDetail.priceUsdPerM2} USD/m²</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Inversión total:</span>
                <span className="font-bold text-lg text-emerald-800">${selectedLotDetail.totalPriceUsd.toLocaleString('es-VE')} USD</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Inicial 10% para reservar:</span>
                <span className="font-bold text-amber-600">
                  ${Math.round(selectedLotDetail.totalPriceUsd * 0.1).toLocaleString('es-VE')} USD
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-500">Plan 50% inicial + 6 cuotas:</span>
                <span className="font-semibold text-stone-700">
                  6 cuotas de ${Math.round((selectedLotDetail.totalPriceUsd * 0.5) / 6).toLocaleString('es-VE')} USD
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex gap-3">
              <button
                onClick={() => {
                  onSelectLotForQuote(selectedLotDetail);
                  setSelectedLotDetail(null);
                }}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm text-center shadow-md transition-colors"
              >
                Cotizar este lote ahora
              </button>
              <button
                onClick={() => setSelectedLotDetail(null)}
                className="px-4 py-3 rounded-xl border border-stone-300 text-stone-700 font-semibold text-sm hover:bg-stone-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
