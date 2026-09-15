import React from 'react';
import { CmsContent } from '../types';
import { Sprout, Home, Grid, Trees, Check, ShieldCheck, Mountain } from 'lucide-react';

interface ValuePropSectionProps {
  content: CmsContent;
}

export const ValuePropSection: React.FC<ValuePropSectionProps> = ({ content }) => {
  const { valueProp } = content;
  if (!valueProp.active) return null;

  // Icon mapping
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout':
        return <Sprout className="w-6 h-6 text-emerald-600" />;
      case 'Home':
        return <Home className="w-6 h-6 text-emerald-600" />;
      case 'Grid':
        return <Grid className="w-6 h-6 text-emerald-600" />;
      case 'Trees':
        return <Trees className="w-6 h-6 text-emerald-600" />;
      default:
        return <Check className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <section id="propuesta" className="py-20 bg-stone-100 text-stone-800 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
            <Sprout className="w-3.5 h-3.5" />
            <span>Propuesta de Valor Integral</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4" id="valueprop-title">
            {valueProp.title || 'Un Modelo de Desarrollo Sostenible e Innovación Arquitectónica'}
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed" id="valueprop-desc">
            {valueProp.description}
          </p>
        </div>

        {/* 2-Column Showcase: Real Terrain Photo & Detailed Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Authentic Real Land Image */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-300 group bg-stone-200">
              <img
                src={valueProp.imageUrl || '/api/images/real-terrain'}
                alt={valueProp.imageAlt || 'Fotografía real del terreno Sabana Larga Cordero Táchira'}
                className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider mb-1.5">
                    Terreno Real · Sabana Larga
                  </span>
                  <p className="text-white text-sm font-medium">
                    Topografía suave, tierra fértil andina y clima templado constante a 5 min de Cordero.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-2 italic text-center sm:text-left">
              * Documentación fotográfica del área real del proyecto, correspondiente al expediente urbanístico oficial.
            </p>
          </div>

          {/* Core Highlights List */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <div className="border-l-4 border-emerald-600 pl-4 mb-6">
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                La Armonía Perfecta entre Agroproducción y Turismo
              </h3>
              <p className="text-sm text-stone-600 mt-1">
                Diseñado para quienes valoran la independencia alimentaria, la bioconstrucción y un patrimonio que se revaloriza en dólares.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {valueProp.benefits.map((benefit, index) => (
                <div
                  key={benefit.id || index}
                  className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow"
                  id={`valueprop-card-${index}`}
                >
                  <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
                    {renderIcon(benefit.icon)}
                  </div>
                  <h4 className="font-semibold text-stone-900 text-base mb-1.5">{benefit.title}</h4>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
