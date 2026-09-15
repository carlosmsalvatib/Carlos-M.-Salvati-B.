import React from 'react';
import { CmsContent } from '../types';
import { ShieldCheck, Compass, Users, Sprout, FileText, Globe2, Award, CheckCircle2 } from 'lucide-react';

interface TechnicalAttributesSectionProps {
  content: CmsContent;
}

export const TechnicalAttributesSection: React.FC<TechnicalAttributesSectionProps> = ({ content }) => {
  const { technicalAttributes } = content;
  if (!technicalAttributes.active) return null;

  return (
    <section id="atributos" className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Estándares de Excelencia</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4" id="tech-attributes-title">
            {technicalAttributes.title || 'Ingeniería, Sostenibilidad y Compromiso Social'}
          </h2>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed" id="tech-attributes-desc">
            {technicalAttributes.subtitle || 'Un desarrollo planificado bajo estrictos criterios de bioconstrucción y responsabilidad ambiental.'}
          </p>
        </div>

        {/* Technical Attributes Grid & Graphic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          {/* Attributes list */}
          <div className="lg:col-span-7 space-y-4">
            {technicalAttributes.attributes.map((attr, idx) => (
              <div
                key={attr.id || idx}
                className="bg-stone-800/70 border border-stone-700/70 hover:border-amber-400/50 p-5 rounded-xl transition-all duration-200"
                id={`tech-attr-card-${idx}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-stone-750 border border-stone-700 flex items-center justify-center flex-shrink-0 text-amber-400">
                    {idx === 0 && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                    {idx === 1 && <Compass className="w-5 h-5 text-sky-400" />}
                    {idx === 2 && <Users className="w-5 h-5 text-amber-400" />}
                    {idx === 3 && <Sprout className="w-5 h-5 text-emerald-400" />}
                    {idx === 4 && <FileText className="w-5 h-5 text-indigo-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <h4 className="text-base font-bold text-white">{attr.title}</h4>
                      {attr.highlight && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-700 text-amber-300">
                          {attr.highlight}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">{attr.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Structural Detail Graphic */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-stone-700 shadow-2xl bg-stone-950">
              <img
                src={technicalAttributes.imageUrl || '/api/images/bamboo-structure'}
                alt={technicalAttributes.imageAlt || 'Detalle estructural de Guadua sismorresistente'}
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 bg-stone-850 border-t border-stone-800">
                <p className="text-xs text-stone-300 leading-relaxed">
                  <strong className="text-amber-400">Guadua angustifolia Kunth:</strong> Denominada el "acero vegetal", su relación resistencia-peso supera al concreto tradicional en esfuerzos de tracción y flexión.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* UN SDGs (Objetivos de Desarrollo Sostenible ONU) Section */}
        <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Globe2 className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Alineación con los Objetivos de Desarrollo Sostenible (ONU)
              </h3>
              <p className="text-xs sm:text-sm text-stone-400">
                Compromiso activo con la Agenda 2030 para el bienestar comunitario y la preservación ambiental.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {technicalAttributes.sdgs.map((sdg) => (
              <div
                key={sdg.id}
                className="bg-stone-900/90 border border-stone-700/80 rounded-xl p-5 hover:border-amber-400/40 transition-colors"
                id={`sdg-card-${sdg.number}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-md"
                    style={{ backgroundColor: sdg.color }}
                  >
                    {sdg.number}
                  </div>
                  <span className="font-bold text-sm text-white">{sdg.name}</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">{sdg.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
