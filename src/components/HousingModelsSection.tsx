import React, { useState, useEffect, useCallback } from 'react';
import { CmsContent, HousingModel } from '../types';
import { fetchHousingModels } from '../lib/api';
import {
  Home,
  ShieldCheck,
  Wind,
  Sun,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Layers,
  Bed,
  Bath,
  CheckCircle2,
  FileText,
  Sparkles,
  Info,
  RefreshCw,
} from 'lucide-react';

interface HousingModelsSectionProps {
  content: CmsContent;
  onSelectModelForQuote: (model: HousingModel) => void;
  onOpenImageViewer?: (images: string[], index?: number, title?: string, subtitle?: string) => void;
  onNavigate?: (page: string) => void;
}

export const HousingModelsSection: React.FC<HousingModelsSectionProps> = ({
  content,
  onSelectModelForQuote,
  onOpenImageViewer,
  onNavigate,
}) => {
  const defaultHousingModels = content?.housingModels;

  // Local live state synchronized in real-time with the database
  const [liveModels, setLiveModels] = useState<HousingModel[]>(() => {
    return defaultHousingModels?.models && defaultHousingModels.models.length > 0
      ? defaultHousingModels.models
      : [];
  });
  const [liveSection, setLiveSection] = useState(defaultHousingModels);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Fetch directly from database endpoint
  const syncWithDatabase = useCallback(async () => {
    setIsSyncing(true);
    try {
      const res = await fetchHousingModels();
      if (res.models && Array.isArray(res.models) && res.models.length > 0) {
        setLiveModels(res.models);
      }
      if (res.section) {
        setLiveSection((prev) => ({ ...prev, ...res.section }));
      }
      setLastSyncTime(new Date().toLocaleTimeString('es-VE'));
    } catch (e) {
      console.warn('Error sincronizando modelos con base de datos:', e);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Update when parent props change
  useEffect(() => {
    if (content?.housingModels?.models && content.housingModels.models.length > 0) {
      setLiveModels(content.housingModels.models);
    }
    if (content?.housingModels) {
      setLiveSection(content.housingModels);
    }
  }, [content]);

  // Real-time synchronization listeners
  useEffect(() => {
    // Initial fetch from DB
    syncWithDatabase();

    // Listen to real-time events broadcasted when CMS saves or updates models
    const handleModelsUpdated = (e: any) => {
      if (e.detail?.models && Array.isArray(e.detail.models)) {
        setLiveModels(e.detail.models);
        setLastSyncTime(new Date().toLocaleTimeString('es-VE'));
      }
    };

    const handleDataUpdated = (e: any) => {
      if (e.detail?.models && Array.isArray(e.detail.models)) {
        setLiveModels(e.detail.models);
        setLastSyncTime(new Date().toLocaleTimeString('es-VE'));
      } else if (e.detail?.content?.housingModels?.models) {
        setLiveModels(e.detail.content.housingModels.models);
        setLiveSection(e.detail.content.housingModels);
        setLastSyncTime(new Date().toLocaleTimeString('es-VE'));
      }
    };

    // Cross-tab storage synchronization
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'mdr_runtime_models_v2' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setLiveModels(parsed);
            setLastSyncTime(new Date().toLocaleTimeString('es-VE'));
          }
        } catch {}
      }
      if (e.key === 'mdr_runtime_cms_content_v2' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed?.housingModels?.models) {
            setLiveModels(parsed.housingModels.models);
            setLiveSection(parsed.housingModels);
            setLastSyncTime(new Date().toLocaleTimeString('es-VE'));
          }
        } catch {}
      }
    };

    window.addEventListener('mdr_models_updated', handleModelsUpdated);
    window.addEventListener('mdr_data_updated', handleDataUpdated);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('mdr_models_updated', handleModelsUpdated);
      window.removeEventListener('mdr_data_updated', handleDataUpdated);
      window.removeEventListener('storage', handleStorage);
    };
  }, [syncWithDatabase]);

  // Track active image index for each model: modelId -> number
  const [modelImageIndexes, setModelImageIndexes] = useState<Record<string, number>>({});

  const activeSection = liveSection || defaultHousingModels;
  if (!activeSection || activeSection.active === false) return null;

  // Resolved models: prefer liveModels, fallback to content models
  const rawModels = liveModels && liveModels.length > 0
    ? liveModels
    : defaultHousingModels?.models || [];
  const models = rawModels.filter((model) => model && model.active !== false);

  const getActiveIndex = (modelId: string, maxImages: number) => {
    const idx = modelImageIndexes[modelId] || 0;
    return idx < maxImages ? idx : 0;
  };

  const handlePrevImage = (e: React.MouseEvent, modelId: string, count: number) => {
    e.stopPropagation();
    setModelImageIndexes((prev) => {
      const current = prev[modelId] || 0;
      return { ...prev, [modelId]: (current - 1 + count) % count };
    });
  };

  const handleNextImage = (e: React.MouseEvent, modelId: string, count: number) => {
    e.stopPropagation();
    setModelImageIndexes((prev) => {
      const current = prev[modelId] || 0;
      return { ...prev, [modelId]: (current + 1) % count };
    });
  };

  const handleOpenModelZoom = (model: HousingModel, startIndex: number) => {
    if (onOpenImageViewer && model.images && model.images.length > 0) {
      onOpenImageViewer(
        model.images,
        startIndex,
        `${model.name} (${model.areaM2} m²)`,
        `Bioconstrucción en Guadua angustifolia Kunth · 450 USD/m² · $${model.priceUsd.toLocaleString('es-VE')} USD`
      );
    }
  };

  return (
    <section id="modelos" className="py-16 sm:py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bioconstrucción en Bambú Guadua & Diseños Arquitectónicos</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800/90 text-stone-300 border border-stone-700/80 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>DB en Vivo ({models.length} {models.length === 1 ? 'modelo' : 'modelos'})</span>
              <button
                onClick={syncWithDatabase}
                disabled={isSyncing}
                title="Actualizar datos desde la Base de Datos"
                className="ml-1 p-0.5 rounded hover:bg-stone-700 text-stone-400 hover:text-amber-400 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              </button>
            </div>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4" id="housing-models-title">
            {activeSection.title || 'Casas Ecológicas Sismorresistentes en Bambú Guadua'}
          </h2>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed mb-3" id="housing-models-desc">
            {activeSection.description}
          </p>
          <p className="text-xs text-amber-400/90 italic">
            *{activeSection.priceNotice}
          </p>
        </div>

        {/* 4 Universal Architectural Benefits */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <div className="bg-stone-800/80 border border-stone-700/80 rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2.5">
              <Sun className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white text-sm mb-1">Terrazas Mirador</h4>
            <p className="text-xs text-stone-400">Vistas panorámicas directas hacia las montañas andinas y el valle.</p>
          </div>

          <div className="bg-stone-800/80 border border-stone-700/80 rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2.5">
              <Wind className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white text-sm mb-1">Ventilación Cruzada</h4>
            <p className="text-xs text-stone-400">Flujo continuo de aire fresco que elimina la necesidad de climatización artificial.</p>
          </div>

          <div className="bg-stone-800/80 border border-stone-700/80 rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-2.5">
              <Sun className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white text-sm mb-1">Luz Natural Cenital</h4>
            <p className="text-xs text-stone-400">Aperturas bioclimáticas que maximizan la iluminación solar y el ahorro energético.</p>
          </div>

          <div className="bg-stone-800/80 border border-stone-700/80 rounded-xl p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-white text-sm mb-1">Corredor Perimetral</h4>
            <p className="text-xs text-stone-400">Aleros amplios alrededor de toda la vivienda que protegen contra lluvias y humedad.</p>
          </div>
        </div>

        {/* HOUSING MODELS GALLERY WITH DIRECTIONAL NAVIGATION & AMPLIFICATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {models.map((model) => {
              const images = model.images && model.images.length > 0 ? model.images : ['/api/images/model-a-render'];
              const currentIndex = getActiveIndex(model.id, images.length);
              const currentImg = images[currentIndex];

              return (
                <div
                  key={model.id}
                  className="bg-stone-800/90 border border-stone-700/90 rounded-2xl overflow-hidden shadow-2xl hover:border-amber-400/50 transition-all flex flex-col justify-between"
                  id={`housing-model-card-${model.id}`}
                >
                  <div>
                    {/* Model Header */}
                    <div className="p-4 sm:p-5 bg-stone-950 flex items-center justify-between border-b border-stone-800">
                      <div>
                        <h3 className="font-serif font-bold text-xl text-white">
                          {model.name}
                        </h3>
                        <p className="text-xs text-amber-400 font-medium">
                          {model.tagline}
                        </p>
                      </div>

                      <div className="text-right">
                        {model.showPrice !== false ? (
                          <>
                            <span className="block font-mono font-extrabold text-lg text-emerald-400">
                              ${model.priceUsd.toLocaleString('es-VE')} USD
                            </span>
                            <span className="text-[11px] text-stone-400">
                              {model.pricePerM2Usd || 450} USD/m² ({model.areaM2} m²)
                            </span>
                          </>
                        ) : (
                          <span className="inline-block px-2.5 py-1 rounded-full bg-stone-800 text-amber-300 text-xs font-semibold border border-stone-700">
                            Precio a consultar
                          </span>
                        )}
                      </div>
                    </div>

                  {/* Image Viewport with Directional Arrows */}
                  <div className="relative w-full h-72 sm:h-80 bg-stone-950 group overflow-hidden">
                    {/* Navigation Arrow: Previous */}
                    {images.length > 1 && (
                      <button
                        onClick={(e) => handlePrevImage(e, model.id, images.length)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 z-20 p-2.5 rounded-full bg-stone-900/80 hover:bg-amber-500 hover:text-stone-950 text-white border border-stone-700 transition-all shadow-lg hover:scale-110 focus:outline-none"
                        title="Imagen anterior"
                        id={`btn-model-${model.id}-prev-img`}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    )}

                    {/* Image with Click to Zoom */}
                    <div
                      className="w-full h-full cursor-pointer relative"
                      onClick={() => handleOpenModelZoom(model, currentIndex)}
                    >
                      <img
                        src={currentImg}
                        alt={`${model.name} - Imagen ${currentIndex + 1}`}
                        className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (!target.src.includes('/api/images/model-a-render')) {
                            target.src = '/api/images/model-a-render';
                          }
                        }}
                      />

                      {/* Top Overlay Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-stone-950/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/40">
                          {currentIndex === 0 ? 'Render 3D Exterior' : currentIndex === 1 ? 'Plano de Distribución' : `Vista Detallada ${currentIndex + 1}`}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/70 text-white hover:bg-amber-500 hover:text-stone-950 transition-colors shadow-lg flex items-center gap-1.5 text-xs font-semibold">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Ampliar</span>
                      </div>

                      {/* Bottom Counter */}
                      {images.length > 1 && (
                        <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-md bg-black/70 text-stone-300 text-[11px] font-mono border border-stone-700">
                          {currentIndex + 1} / {images.length}
                        </div>
                      )}
                    </div>

                    {/* Navigation Arrow: Next */}
                    {images.length > 1 && (
                      <button
                        onClick={(e) => handleNextImage(e, model.id, images.length)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 z-20 p-2.5 rounded-full bg-stone-900/80 hover:bg-amber-500 hover:text-stone-950 text-white border border-stone-700 transition-all shadow-lg hover:scale-110 focus:outline-none"
                        title="Imagen siguiente"
                        id={`btn-model-${model.id}-next-img`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Thumbnail Selector Strip */}
                  {images.length > 1 && (
                    <div className="flex items-center gap-2 p-2.5 bg-stone-950/90 border-b border-stone-800 overflow-x-auto">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setModelImageIndexes((prev) => ({ ...prev, [model.id]: idx }))}
                          className={`relative w-14 h-11 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                            idx === currentIndex
                              ? 'border-amber-400 scale-105 shadow-md shadow-amber-400/20'
                              : 'border-stone-800 opacity-60 hover:opacity-100 hover:border-stone-600'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Miniatura ${idx + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                      <span className="text-[10px] text-stone-400 italic pl-1">
                        {images.length} vistas cargadas en CMS
                      </span>
                    </div>
                  )}

                  {/* Model Description & Specs */}
                  <div className="p-5 space-y-4">
                    <p className="text-sm text-stone-300 leading-relaxed">
                      {model.description}
                    </p>

                    {/* Quick Specs Grid */}
                    {model.specs && (
                      <div className="grid grid-cols-3 gap-2.5 py-3 border-y border-stone-700/80 text-xs">
                        <div className="flex items-center gap-1.5 text-stone-300">
                          <Bed className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          <span>{model.specs.bedrooms} Habitaciones</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-300">
                          <Bath className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span>{model.specs.bathrooms} Baños</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-300">
                          <Layers className="w-4 h-4 text-sky-400 flex-shrink-0" />
                          <span>{model.specs.terraceM2 || 15} m² Terraza</span>
                        </div>
                      </div>
                    )}

                    {/* Architectural Highlights */}
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                        Características Constructivas:
                      </h5>
                      <ul className="space-y-1.5 text-xs text-stone-300">
                        {model.benefits.slice(0, 4).map((b, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA to Quote this Model */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => onSelectModelForQuote(model)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                    id={`btn-quote-model-${model.id}`}
                  >
                    <span>Cotizar {model.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Context Navigation */}
        {onNavigate && (
          <div className="p-6 rounded-2xl bg-stone-800/60 border border-stone-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-serif font-bold text-white text-base">
                ¿Deseas simular las cuotas mensuales de tu casa + lote?
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Calcula el monto de reserva, cuota inicial del 50% y plan de 6 cuotas consecutivas.
              </p>
            </div>
            <button
              onClick={() => onNavigate('financiamiento')}
              className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all whitespace-nowrap"
            >
              Ir al Simulador de Financiamiento →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
