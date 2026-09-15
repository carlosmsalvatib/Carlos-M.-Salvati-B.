import React, { useState } from 'react';
import { CmsContent, HousingModel } from '../types';
import { Home, ShieldCheck, Wind, Sun, Maximize2, Download, ArrowRight, Eye, CheckCircle2, FileText } from 'lucide-react';

interface HousingModelsSectionProps {
  content: CmsContent;
  onSelectModelForQuote: (model: HousingModel) => void;
}

export const HousingModelsSection: React.FC<HousingModelsSectionProps> = ({ content, onSelectModelForQuote }) => {
  const { housingModels } = content;
  if (!housingModels.active) return null;

  const [activeTabPerModel, setActiveTabPerModel] = useState<Record<string, 'render' | 'plano'>>({
    'modelo-a': 'render',
    'modelo-b': 'render',
  });

  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  const toggleTab = (modelId: string, tab: 'render' | 'plano') => {
    setActiveTabPerModel((prev) => ({ ...prev, [modelId]: tab }));
  };

  return (
    <section id="modelos" className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bioconstrucción en Bambú Guadua</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4" id="housing-models-title">
            {housingModels.title || 'Casas Ecológicas Sismorresistentes en Bambú Guadua'}
          </h2>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed mb-3" id="housing-models-desc">
            {housingModels.description}
          </p>
          <p className="text-xs text-amber-400/90 italic">
            *{housingModels.priceNotice}
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

        {/* The 2 Housing Models: Model A & Model B Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {housingModels.models.map((model) => {
            const currentTab = activeTabPerModel[model.id] || 'render';
            const imageUrl = currentTab === 'render' ? model.images[0] : model.images[1] || model.images[0];

            return (
              <div
                key={model.id}
                className="bg-stone-800/90 border border-stone-700/90 rounded-2xl overflow-hidden shadow-xl hover:border-amber-400/50 transition-all flex flex-col"
                id={`housing-model-card-${model.id}`}
              >
                {/* Visual Header with Tabs */}
                <div className="relative bg-stone-950 p-2 sm:p-3">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                        {model.areaM2} m² de Construcción
                      </span>
                    </div>

                    {/* Tabs for Render vs Floorplan */}
                    <div className="flex items-center bg-stone-900 rounded-lg p-0.5 border border-stone-800">
                      <button
                        onClick={() => toggleTab(model.id, 'render')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          currentTab === 'render'
                            ? 'bg-amber-500 text-stone-950 font-bold'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        Render 3D
                      </button>
                      <button
                        onClick={() => toggleTab(model.id, 'plano')}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          currentTab === 'plano'
                            ? 'bg-amber-500 text-stone-950 font-bold'
                            : 'text-stone-400 hover:text-white'
                        }`}
                      >
                        Plano Distribución
                      </button>
                    </div>
                  </div>

                  {/* Image View */}
                  <div
                    className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden cursor-pointer group bg-stone-900"
                    onClick={() => setActiveModalImage(imageUrl)}
                  >
                    <img
                      src={imageUrl}
                      alt={`${model.name} - ${currentTab === 'render' ? 'Render Arquitectónico' : 'Plano de Diseño'}`}
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="font-serif text-2xl font-bold text-white">{model.name}</h3>
                      {model.showPrice && (
                        <div className="text-right">
                          <span className="text-2xl font-bold text-amber-400 font-serif">
                            ${model.priceUsd.toLocaleString('es-VE')} USD
                          </span>
                          <span className="block text-[11px] text-stone-400 font-medium">
                            450 USD/m² construidos
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-amber-300/90 font-medium mb-3">{model.tagline}</p>
                    <p className="text-stone-300 text-sm mb-5 leading-relaxed">{model.description}</p>

                    {/* Specs Pills */}
                    <div className="grid grid-cols-3 gap-2 py-3 mb-5 border-y border-stone-700/60 text-center text-xs">
                      <div>
                        <span className="text-stone-400 block text-[11px]">Niveles</span>
                        <span className="text-white font-bold">{model.specs.levels} Planta</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">Habitaciones</span>
                        <span className="text-white font-bold">{model.specs.bedrooms} Hab</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">Baños</span>
                        <span className="text-white font-bold">{model.specs.bathrooms} Baños</span>
                      </div>
                    </div>

                    {/* Benefits list */}
                    <ul className="space-y-2 mb-6 text-xs sm:text-sm text-stone-300">
                      {model.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-stone-700/80 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => onSelectModelForQuote(model)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-md transition-all"
                      id={`btn-cotizar-${model.id}`}
                    >
                      <span>Cotiza tu modelo de vivienda</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href="#contacto?asunto=descargar_ficha_tecnica"
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-xs sm:text-sm bg-stone-700 hover:bg-stone-600 text-stone-200 transition-colors"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>Ficha Técnica</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Image Preview Modal */}
      {activeModalImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-amber-400"
            >
              Cerrar ✕
            </button>
            <img
              src={activeModalImage}
              alt="Vista previa ampliada"
              className="w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </section>
  );
};
