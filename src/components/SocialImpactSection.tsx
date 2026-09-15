import React from 'react';
import { CmsContent } from '../types';
import { Trees, CheckCircle2, ShieldCheck, Heart, Sparkles, Building2, Lightbulb, Users } from 'lucide-react';

interface SocialImpactSectionProps {
  content: CmsContent;
}

export const SocialImpactSection: React.FC<SocialImpactSectionProps> = ({ content }) => {
  const { socialImpact } = content;
  if (!socialImpact.active) return null;

  return (
    <section id="impacto-social" className="py-20 bg-stone-900 text-stone-100 border-b border-stone-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Heart className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compromiso Social y Ciudadano</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4" id="social-impact-title">
            {socialImpact.title || 'El Gran Aporte Social: Bulevar de la Guadua'}
          </h2>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed" id="social-impact-desc">
            {socialImpact.description}
          </p>
        </div>

        {/* 2-Column Presentation: Illustration Render & Public Equipments */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Bulevar Image / Render */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-stone-700 shadow-2xl bg-stone-950 group">
              <img
                src={socialImpact.imageUrl || '/api/images/bulevar-guadua'}
                alt={socialImpact.imageAlt || 'Render del Bulevar de la Guadua y espacios comunales'}
                className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 bg-stone-850 border-t border-stone-800 flex items-center justify-between">
                <span className="text-xs text-amber-400 font-bold">
                  +14.600 m² de Espacio Público Cedido
                </span>
                <span className="text-xs text-stone-400">100% Costos Asumidos por Promotores</span>
              </div>
            </div>
          </div>

          {/* Equipments & Key Points */}
          <div className="lg:col-span-6 space-y-6">
            <div className="border-l-4 border-amber-400 pl-4">
              <h3 className="font-serif text-2xl font-bold text-white">
                Infraestructura al Servicio de Toda la Comunidad
              </h3>
              <p className="text-sm text-stone-300 mt-1">
                Un entorno pensado para la recreación familiar, el deporte al aire libre y la cohesión comunitaria.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {socialImpact.publicEquipments.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-stone-800/80 border border-stone-700/80 p-4 rounded-xl flex items-center gap-3 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-stone-200">{item}</span>
                </div>
              ))}
            </div>

            {/* Promoter Guarantee Box */}
            <div className="p-5 rounded-xl bg-stone-800/90 border border-stone-700 text-xs sm:text-sm text-stone-300 leading-relaxed">
              <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Garantía Promotora sin Carga Municipal</span>
              </div>
              <p>{socialImpact.promoterGuarantee}</p>
            </div>
          </div>
        </div>

        {/* Vision 2030 Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-950 border border-emerald-700/40 rounded-2xl p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-xl">
          <Sparkles className="w-6 h-6 text-amber-400 mx-auto mb-3" />
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 block mb-1">
            Nuestra Visión 2030
          </span>
          <blockquote className="font-serif text-xl sm:text-2xl font-bold text-white max-w-2xl mx-auto mb-2">
            “{socialImpact.vision2030}”
          </blockquote>
          <p className="text-xs text-stone-400">
            Complejo Urbanístico Agroproductivo y Turístico Mis Delirios Ranch · Cordero, Táchira
          </p>
        </div>
      </div>
    </section>
  );
};
