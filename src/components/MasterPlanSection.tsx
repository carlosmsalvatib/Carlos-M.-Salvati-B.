import React, { useState, useMemo } from 'react';
import { CmsContent, LotItem, LotStatus, MasterPlanBlueprint } from '../types';
import { normalizeVideoUrl } from '../lib/mediaProcessor';
import {
  MasterPlanAdvancedSearch,
  LotFilterState,
  initialFilterState,
} from './MasterPlanAdvancedSearch';
import {
  Layers,
  ZoomIn,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  ArrowRight,
  X,
  Sparkles,
  Filter,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Compass,
  FileText,
  Info,
  SlidersHorizontal,
  Play,
  Film,
  Video,
} from 'lucide-react';

interface MasterPlanSectionProps {
  content: CmsContent;
  lots: LotItem[];
  onSelectLotForQuote: (lot: LotItem) => void;
  onOpenImageViewer?: (images: string[], index?: number, title?: string, subtitle?: string) => void;
  onNavigate?: (page: string) => void;
}

export const MasterPlanSection: React.FC<MasterPlanSectionProps> = ({
  content,
  lots,
  onSelectLotForQuote,
  onOpenImageViewer,
  onNavigate,
}) => {
  const { masterPlan } = content;

  const blueprints: MasterPlanBlueprint[] =
    masterPlan.blueprints && masterPlan.blueprints.length > 0
      ? masterPlan.blueprints
      : [
          {
            id: 'plano-general',
            title: 'Plano General de Lotificación Integral (57 Lotes)',
            subtitle: 'Lote 1 (Colinas) + Lote 2 (Ranch) con vialidad de 8 a 10m',
            imageUrl: masterPlan.planImageUrl || '/api/images/blueprint-masterplan',
            sector: 'General Complejo',
            description: 'Distribución macro con áreas comunales, accesos principales desde la Trasandina y linderos con el Río Torbes.',
          },
          {
            id: 'plano-sector-1',
            title: 'Sector 1: Colinas de Mis Delirios (Manzana A1)',
            subtitle: '14 Lotes exclusivos en terraza alta con vistas panorámicas',
            imageUrl: '/api/images/blueprint-masterplan',
            sector: 'Parte Alta',
            description: 'Superficie de 37.252,62 m² distribuida en 14 parcelas residenciales de baja densidad.',
          },
          {
            id: 'plano-sector-2',
            title: 'Sector 2: Mis Delirios Ranch (Manzanas A2 a G)',
            subtitle: '43 Lotes tipo mini-granjas desde 600 m²',
            imageUrl: '/api/images/blueprint-masterplan',
            sector: 'Parte Baja',
            description: 'Superficie de 90.721,22 m² con integración directa al bulevar comunal y áreas agroturísticas.',
          },
          {
            id: 'plano-bulevar',
            title: 'Plano del Bulevar de la Guadua y Espacios Comunitarios',
            subtitle: 'Más de 14.600 m² de áreas públicas cedidas',
            imageUrl: '/api/images/bulevar-guadua',
            sector: 'Áreas Públicas',
            description: 'Equipamiento comunal: plazas, parques infantiles, canchas deportivas multiusos y salón comunal.',
          },
        ];

  const [currentBlueprintIndex, setCurrentBlueprintIndex] = useState<number>(0);
  const [filterState, setFilterState] = useState<LotFilterState>(initialFilterState);
  const [selectedLotDetail, setSelectedLotDetail] = useState<LotItem | null>(null);
  const [visualizerTab, setVisualizerTab] = useState<'planos' | 'video'>('planos');

  const masterPlanVideoUrl =
    masterPlan.videoUrl ||
    masterPlan.virtualTourUrl ||
    content.valueProp?.videos?.[0]?.videoUrl ||
    '/api/uploads/default_video.mp4';
  const normalizedMasterPlanVideoUrl = normalizeVideoUrl(masterPlanVideoUrl);
  const isMasterPlanVideoEmbed =
    normalizedMasterPlanVideoUrl.includes('youtube.com') ||
    normalizedMasterPlanVideoUrl.includes('youtube-nocookie.com') ||
    normalizedMasterPlanVideoUrl.includes('youtu.be') ||
    normalizedMasterPlanVideoUrl.includes('vimeo.com') ||
    normalizedMasterPlanVideoUrl.includes('player.vimeo.com');

  const activeBlueprint = blueprints[currentBlueprintIndex] || blueprints[0];

  // Advanced filtered lots
  const filteredLots = useMemo(() => {
    return lots
      .filter((lot) => {
        // 1. Availability / Status filter
        if (filterState.status !== 'todos' && lot.status !== filterState.status) {
          return false;
        }

        // 2. Location / Sector filter
        if (filterState.location !== 'todos' && lot.location !== filterState.location) {
          return false;
        }

        // 3. Text search
        if (filterState.searchTerm.trim()) {
          const q = filterState.searchTerm.toLowerCase().trim();
          const matchesCode = lot.code.toLowerCase().includes(q);
          const matchesManzana = lot.manzana.toLowerCase().includes(q);
          const matchesArea = String(lot.areaM2).includes(q);
          const matchesPrice = String(lot.totalPriceUsd).includes(q);
          const matchesSector = (
            lot.location === 'alta' ? 'colinas alta sector 1' : 'ranch baja sector 2'
          ).includes(q);

          if (!matchesCode && !matchesManzana && !matchesArea && !matchesPrice && !matchesSector) {
            return false;
          }
        }

        // 4. Area (m²) min and max
        if (filterState.areaMin !== '' && lot.areaM2 < Number(filterState.areaMin)) {
          return false;
        }
        if (filterState.areaMax !== '' && lot.areaM2 > Number(filterState.areaMax)) {
          return false;
        }

        // 5. Price (USD) min and max
        if (filterState.priceMin !== '' && lot.totalPriceUsd < Number(filterState.priceMin)) {
          return false;
        }
        if (filterState.priceMax !== '' && lot.totalPriceUsd > Number(filterState.priceMax)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filterState.sortBy) {
          case 'price_asc':
            return a.totalPriceUsd - b.totalPriceUsd;
          case 'price_desc':
            return b.totalPriceUsd - a.totalPriceUsd;
          case 'area_asc':
            return a.areaM2 - b.areaM2;
          case 'area_desc':
            return b.areaM2 - a.areaM2;
          case 'code':
          default:
            return a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' });
        }
      });
  }, [lots, filterState]);

  if (!masterPlan.active) return null;

  // Calculate stats
  const availableCount = lots.filter((l) => l.status === 'disponible').length;
  const reservedCount = lots.filter((l) => l.status === 'reservado').length;
  const soldCount = lots.filter((l) => l.status === 'vendido').length;

  const handlePrevBlueprint = () => {
    setCurrentBlueprintIndex((prev) => (prev - 1 + blueprints.length) % blueprints.length);
  };

  const handleNextBlueprint = () => {
    setCurrentBlueprintIndex((prev) => (prev + 1) % blueprints.length);
  };

  const handleOpenBlueprintZoom = () => {
    if (onOpenImageViewer) {
      const blueprintUrls = blueprints.map((b) => b.imageUrl);
      onOpenImageViewer(
        blueprintUrls,
        currentBlueprintIndex,
        activeBlueprint.title,
        activeBlueprint.subtitle || activeBlueprint.description
      );
    }
  };

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
    <section id="plan-maestro" className="py-16 sm:py-20 bg-stone-50 text-stone-800 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>Urbanismo Planificado & Planos Oficiales</span>
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

        {/* ARCHITECTURAL BLUEPRINTS VISUALIZER WITH DIRECTIONAL NAVIGATION & ZOOM */}
        <div className="bg-stone-900 rounded-2xl p-4 sm:p-6 border border-stone-800 shadow-2xl mb-16">
          {/* Visualizer Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-white font-serif font-bold text-lg sm:text-xl">
                  {activeBlueprint.title}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  {activeBlueprint.sector || 'Planos CMS'}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                {activeBlueprint.subtitle || activeBlueprint.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
              <div className="inline-flex p-1 bg-stone-950 rounded-xl border border-stone-800">
                <button
                  onClick={() => setVisualizerTab('planos')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    visualizerTab === 'planos'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  id="tab-planos-view"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Planos ({blueprints.length})</span>
                </button>
                <button
                  onClick={() => setVisualizerTab('video')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    visualizerTab === 'video'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  id="tab-video-view"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video Recorrido</span>
                </button>
              </div>

              {visualizerTab === 'planos' && (
                <button
                  onClick={handleOpenBlueprintZoom}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 transition-all shadow-sm"
                  id="btn-open-blueprint-zoom"
                  title="Ver amplificado a pantalla completa"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span>Ampliar</span>
                </button>
              )}
            </div>
          </div>

          {visualizerTab === 'video' ? (
            /* Video Stage */
            <div className="mt-4 rounded-xl overflow-hidden bg-stone-950 border border-stone-800 aspect-video w-full flex items-center justify-center">
              {isMasterPlanVideoEmbed ? (
                <iframe
                  src={`${normalizedMasterPlanVideoUrl}${normalizedMasterPlanVideoUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0`}
                  title="Video Recorrido Plan Maestro Mis Delirios Ranch"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src={normalizedMasterPlanVideoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                  poster={activeBlueprint.imageUrl}
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              )}
            </div>
          ) : (
            /* Blueprint Images Stage */
            <>
              {/* Blueprint Selector Tabs */}
              <div className="flex items-center gap-2 py-3 overflow-x-auto border-b border-stone-800/80 scrollbar-none">
                {blueprints.map((bp, idx) => (
                  <button
                    key={bp.id || idx}
                    onClick={() => setCurrentBlueprintIndex(idx)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                      idx === currentBlueprintIndex
                        ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                        : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-700/50'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>{bp.title.split('(')[0].trim()}</span>
                  </button>
                ))}
              </div>

              {/* Blueprint Image Stage with Directional Arrows */}
              <div className="relative mt-4 rounded-xl overflow-hidden group bg-stone-950 flex items-center justify-center min-h-[320px] sm:min-h-[460px]">
                {/* Directional Arrow: Previous */}
                {blueprints.length > 1 && (
                  <button
                    onClick={handlePrevBlueprint}
                    className="absolute left-3 sm:left-5 z-20 p-3 rounded-full bg-stone-900/80 hover:bg-amber-500 hover:text-stone-950 text-white border border-stone-700 transition-all shadow-xl hover:scale-110 focus:outline-none"
                    title="Plano anterior"
                    id="btn-blueprint-prev"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {/* Clickable Image to Amplified Mode */}
                <div
                  className="relative w-full h-full flex items-center justify-center cursor-pointer"
                  onClick={handleOpenBlueprintZoom}
                >
                  <img
                    src={activeBlueprint.imageUrl}
                    alt={activeBlueprint.title}
                    className="w-full max-h-[500px] object-contain transition-transform duration-300 group-hover:scale-101"
                    referrerPolicy="no-referrer"
                  />

                  {/* Hover Badge */}
                  <div className="absolute top-4 right-4 p-2 rounded-lg bg-black/70 text-white group-hover:bg-amber-500 group-hover:text-stone-950 transition-colors shadow-lg flex items-center gap-1.5 text-xs font-bold">
                    <Maximize2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Click para Ampliar</span>
                  </div>
                </div>

                {/* Directional Arrow: Next */}
                {blueprints.length > 1 && (
                  <button
                    onClick={handleNextBlueprint}
                    className="absolute right-3 sm:right-5 z-20 p-3 rounded-full bg-stone-900/80 hover:bg-amber-500 hover:text-stone-950 text-white border border-stone-700 transition-all shadow-xl hover:scale-110 focus:outline-none"
                    title="Plano siguiente"
                    id="btn-blueprint-next"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}

                {/* Counter Overlay */}
                {blueprints.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-black/70 text-stone-300 text-xs font-mono border border-stone-700">
                    Plano {currentBlueprintIndex + 1} de {blueprints.length}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
            <span>
              * Planos certificados por Arq. Indira Contreras (C.I.V. 165.492) y Promotor Dr. Néstor E. Depablos Mora.
            </span>
            <span className="text-amber-400">
              Navega con flechas o haz click sobre el plano para ampliar con zoom.
            </span>
          </div>
        </div>

        {/* LIVE REAL-TIME AVAILABILITY INVENTORY CATALOG */}
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-lg p-6 sm:p-8" id="catalogo-disponibilidad">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Catálogo y Disponibilidad de Lotes en Vivo
                </h3>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-sm text-stone-600 mt-1">
                Consulta en tiempo real la disponibilidad, dimensiones y precios calculados a $20 USD/m²
              </p>
            </div>

            {/* Live Stats Counters */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="block text-lg font-bold text-emerald-700 leading-tight">{availableCount}</span>
                <span className="text-[10px] text-emerald-800 font-semibold uppercase">Disponibles</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <span className="block text-lg font-bold text-amber-700 leading-tight">{reservedCount}</span>
                <span className="text-[10px] text-amber-800 font-semibold uppercase">Reservados</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-center">
                <span className="block text-lg font-bold text-rose-700 leading-tight">{soldCount}</span>
                <span className="text-[10px] text-rose-800 font-semibold uppercase">Vendidos</span>
              </div>
            </div>
          </div>

          {/* ADVANCED SEARCH & FILTER BAR */}
          <MasterPlanAdvancedSearch
            lots={lots}
            filterState={filterState}
            onFilterChange={setFilterState}
            filteredCount={filteredLots.length}
            totalCount={lots.length}
          />

          {/* Lots Grid / Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[640px] overflow-y-auto pr-1">
            {filteredLots.map((lot) => {
              const isAvailable = lot.status === 'disponible';

              return (
                <div
                  key={lot.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isAvailable
                      ? 'bg-stone-50/80 border-stone-200 hover:border-emerald-500 hover:shadow-md'
                      : 'bg-stone-100/60 border-stone-200 opacity-75'
                  }`}
                  id={`lot-card-${lot.code}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-extrabold text-base text-stone-900">{lot.code}</span>
                      {getStatusBadge(lot.status)}
                    </div>
                    <div className="text-xs text-stone-600 mb-1 flex items-center justify-between">
                      <span>Manzana: <strong className="text-stone-800">{lot.manzana}</strong></span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-200/70 text-[10px] font-semibold text-stone-700">
                        {lot.location === 'alta' ? 'Sector 1 · Alta' : 'Sector 2 · Baja'}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 mb-2">
                      Superficie: <strong className="text-stone-900">{lot.areaM2.toLocaleString('es-VE')} m²</strong>
                    </div>

                    <div className="pt-2 border-t border-stone-200/80 flex items-baseline justify-between mb-3">
                      <span className="text-[11px] text-stone-500">Precio de lista:</span>
                      <span className="font-serif font-bold text-base text-stone-900">
                        ${lot.totalPriceUsd.toLocaleString('es-VE')} USD
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {isAvailable ? (
                      <button
                        onClick={() => onSelectLotForQuote(lot)}
                        className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                        id={`btn-quote-lot-${lot.code}`}
                      >
                        <span>Cotizar este lote</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="text-center py-2.5 min-h-[44px] flex items-center justify-center text-xs font-medium text-stone-500 italic bg-stone-200/50 rounded-xl">
                        No disponible
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedLotDetail(lot)}
                      className="w-full py-1.5 px-2 text-[11px] font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Info className="w-3 h-3 text-stone-500" />
                      <span>Ver linderos y ficha técnica</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLots.length === 0 && (
            <div className="py-12 text-center text-stone-500 bg-stone-50 rounded-2xl border border-dashed border-stone-300 my-4">
              <Search className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-800">
                No se encontraron lotes que coincidan con los criterios.
              </p>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                Prueba relajando los rangos de precio o superficie, o cambiando el estado de disponibilidad.
              </p>
              <button
                type="button"
                onClick={() => setFilterState(initialFilterState)}
                className="mt-3 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center gap-1.5"
              >
                <span>Restablecer todos los filtros</span>
              </button>
            </div>
          )}

          {/* Bottom Action bar */}
          {onNavigate && (
            <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-stone-600">
                ¿Deseas ver las opciones de casas en bambú para tu lote?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('modelos')}
                  className="py-2.5 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all"
                >
                  Ver Modelos de Vivienda →
                </button>
                <button
                  onClick={() => onNavigate('financiamiento')}
                  className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all"
                >
                  Simular Financiamiento
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LOT DETAIL / TECHNICAL SPECS MODAL */}
      {selectedLotDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedLotDetail(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-extrabold text-xl text-stone-900">
                Lote {selectedLotDetail.code}
              </span>
              {getStatusBadge(selectedLotDetail.status)}
            </div>

            <p className="text-xs text-stone-500 mb-4">
              Sector {selectedLotDetail.location === 'alta' ? '1: Colinas de Mis Delirios (Parte Alta)' : '2: Mis Delirios Ranch (Parte Baja)'} · Manzana {selectedLotDetail.manzana}
            </p>

            <div className="space-y-4">
              {/* Technical Specifications */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-500 block">Superficie Total:</span>
                  <span className="font-bold text-stone-900 text-sm">
                    {selectedLotDetail.areaM2.toLocaleString('es-VE')} m²
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Precio Lista ($20/m²):</span>
                  <span className="font-serif font-bold text-emerald-800 text-sm">
                    ${selectedLotDetail.totalPriceUsd.toLocaleString('es-VE')} USD
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Tipología:</span>
                  <span className="font-semibold text-stone-800 capitalize">
                    {selectedLotDetail.type}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Estado Actual:</span>
                  <span className="font-semibold text-stone-800 capitalize">
                    {selectedLotDetail.status}
                  </span>
                </div>
              </div>

              {/* Boundary Dimensions if available */}
              {selectedLotDetail.dimensions && (
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 text-xs">
                  <span className="font-bold text-emerald-950 block mb-2">
                    Linderos y Medidas Perimétricas:
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-stone-700">
                    <div>Norte: <strong>{selectedLotDetail.dimensions.norte || 'S/D'} m</strong></div>
                    <div>Sur: <strong>{selectedLotDetail.dimensions.sur || 'S/D'} m</strong></div>
                    <div>Este: <strong>{selectedLotDetail.dimensions.este || 'S/D'} m</strong></div>
                    <div>Oeste: <strong>{selectedLotDetail.dimensions.oeste || 'S/D'} m</strong></div>
                  </div>
                </div>
              )}

              {/* Urban Services included */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
                <span className="font-bold text-stone-800 block">Servicios e Infraestructura Incluidos:</span>
                <ul className="text-stone-600 space-y-1 list-disc pl-4 text-[11px]">
                  <li>Vialidad interna pavimentada / enripiada de 8 a 10 metros de ancho.</li>
                  <li>Acometida a red eléctrica y canalización de aguas pluviales.</li>
                  <li>Acceso directo al Bulevar Comunal de la Guadua (14.600 m² áreas verdes).</li>
                  <li>Linderos naturales con vistas andinas de Sabana Larga y Río Torbes.</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                {selectedLotDetail.status === 'disponible' ? (
                  <button
                    type="button"
                    onClick={() => {
                      const lot = selectedLotDetail;
                      setSelectedLotDetail(null);
                      onSelectLotForQuote(lot);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Solicitar Cotización y Reserva</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex-1 py-3 px-4 rounded-xl bg-stone-200 text-stone-500 text-xs font-medium text-center italic">
                    Este lote se encuentra {selectedLotDetail.status}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedLotDetail(null)}
                  className="px-4 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
