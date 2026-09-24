import React from 'react';
import { CmsContent, LotItem, HousingModel } from '../types';
import { HeroSection } from './HeroSection';
import { ValuePropSection } from './ValuePropSection';
import { HousingModelsSection } from './HousingModelsSection';
import {
  Sprout,
  Layers,
  Home,
  MapPin,
  Users,
  DollarSign,
  TreePine,
  ArrowRight,
  Video,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Compass,
} from 'lucide-react';

interface HomePageOverviewProps {
  content: CmsContent;
  lots: LotItem[];
  onNavigate: (pageId: string) => void;
  onSelectModelForQuote?: (model: HousingModel) => void;
  onOpenImageViewer?: (title: string, imageUrl: string, caption?: string) => void;
}

export const HomePageOverview: React.FC<HomePageOverviewProps> = ({
  content,
  lots,
  onNavigate,
  onSelectModelForQuote,
  onOpenImageViewer,
}) => {
  const availableLotsCount = lots.filter((l) => l.status === 'disponible').length;

  const sectionCards = [
    {
      id: 'propuesta',
      title: content.valueProp?.title || 'Propuesta de Valor Integral',
      badge: `${(content.valueProp?.videos || []).length > 0 ? `${(content.valueProp?.videos || []).length} Renders de Video` : 'Renders de Video & Terreno Real'}`,
      desc: content.valueProp?.description || 'Modelo de desarrollo sostenible que combina agroproducción orgánica, turismo andino y bioconstrucción.',
      icon: <Sprout className="w-6 h-6 text-emerald-600" />,
      accentColor: 'border-emerald-200 hover:border-emerald-500 bg-emerald-50/40',
      actionText: 'Explorar Propuesta & Ver Videos',
    },
    {
      id: 'plan-maestro',
      title: 'Plan Maestro & Catálogo de Lotes',
      badge: `${availableLotsCount} Lotes Disponibles`,
      desc: '57 parcelas en 2 sectores (Colinas y Ranch). Visualiza planos arquitectónicos oficiales y disponibilidad en vivo.',
      icon: <Layers className="w-6 h-6 text-blue-600" />,
      accentColor: 'border-blue-200 hover:border-blue-500 bg-blue-50/40',
      actionText: 'Ver Planos & Inventario en Vivo',
    },
    {
      id: 'modelos',
      title: 'Casas en Bambú Guadua',
      badge: `${(content.housingModels?.models || []).filter((m) => m.active !== false).length} Modelos Disponibles`,
      desc: 'Diseños sismorresistentes con ventilación cruzada y terrazas mirador. Galerías de imágenes ampliables con planos.',
      icon: <Home className="w-6 h-6 text-amber-600" />,
      accentColor: 'border-amber-200 hover:border-amber-500 bg-amber-50/40',
      actionText: 'Conocer Diseños Arquitectónicos',
    },
    {
      id: 'ubicacion',
      title: 'Ubicación & Cordero Táchira',
      badge: 'A 5 min del Pueblo de Cordero',
      desc: 'Aldea Sabana Larga y Sector Salomón. Clima templado andino, accesos por la Troncal 1 y vía Trasandina.',
      icon: <MapPin className="w-6 h-6 text-rose-600" />,
      accentColor: 'border-rose-200 hover:border-rose-500 bg-rose-50/40',
      actionText: 'Ver Mapa & Tiempos de Recorrido',
    },
    {
      id: 'perfiles',
      title: 'Perfiles de Inversión',
      badge: 'Familias, Retiro & Retorno en USD',
      desc: 'Soluciones a la medida para productores ecológicos, familias en busca de serenidad e inversionistas turísticos.',
      icon: <Users className="w-6 h-6 text-purple-600" />,
      accentColor: 'border-purple-200 hover:border-purple-500 bg-purple-50/40',
      actionText: 'Descubrir Tu Perfil Ideal',
    },
    {
      id: 'financiamiento',
      title: 'Planes de Venta & Simulador',
      badge: 'Desde 10% Reserva',
      desc: 'Precio base de $20 USD/m². Simula en línea tu cuota inicial del 50% y plan de 6 mensualidades consecutivas.',
      icon: <DollarSign className="w-6 h-6 text-amber-600" />,
      accentColor: 'border-amber-200 hover:border-amber-500 bg-amber-50/40',
      actionText: 'Simular Cuotas de Financiamiento',
    },
    {
      id: 'sostenibilidad',
      title: 'Sostenibilidad & Bulevar',
      badge: '+14.600 m² Áreas Públicas',
      desc: 'Parque lineal del Bulevar de la Guadua, plazas, canchas multiusos y salón comunal integrados con la comunidad.',
      icon: <TreePine className="w-6 h-6 text-emerald-600" />,
      accentColor: 'border-emerald-200 hover:border-emerald-500 bg-emerald-50/40',
      actionText: 'Conocer Equipamiento Comunal',
    },
    {
      id: 'contacto',
      title: 'Contacto & Cotización Oficial',
      badge: 'Atención Personalizada',
      desc: 'Asesoría directa con los promotores y equipo técnico. Agenda tu visita guiada al terreno en Sabana Larga.',
      icon: <PhoneCall className="w-6 h-6 text-stone-700" />,
      accentColor: 'border-stone-300 hover:border-stone-600 bg-stone-50',
      actionText: 'Contactar al Equipo Asesor',
    },
  ];

  return (
    <div className="animate-fadeIn">
      {/* 1. Main Hero Stage */}
      <HeroSection content={content} onNavigate={onNavigate} />

      {/* 2. Key Metrics Showcase Bar */}
      <section className="bg-stone-900 text-stone-100 py-10 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 text-center">
            <div className="p-3">
              <span className="block font-serif font-extrabold text-2xl sm:text-3xl text-amber-400">
                127.973 m²
              </span>
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
                Superficie Total Urbanizable
              </span>
            </div>

            <div className="p-3">
              <span className="block font-serif font-extrabold text-2xl sm:text-3xl text-emerald-400">
                57 Lotes
              </span>
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
                Soluciones Habitacionales
              </span>
            </div>

            <div className="p-3">
              <span className="block font-serif font-extrabold text-2xl sm:text-3xl text-white">
                $20 USD/m²
              </span>
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
                Precio Preventa Exclusivo
              </span>
            </div>

            <div className="p-3">
              <span className="block font-serif font-extrabold text-2xl sm:text-3xl text-amber-400">
                {(content.housingModels?.models || []).filter((m) => m && m.active !== false).length} Modelos
              </span>
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
                Casas en Bambú Guadua
              </span>
            </div>

            <div className="p-3 col-span-2 lg:col-span-1">
              <span className="block font-serif font-extrabold text-2xl sm:text-3xl text-emerald-400">
                +14.600 m²
              </span>
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold">
                Áreas Públicas & Bulevar
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2.3 Propuesta de Valor Integral & Renders Audiovisuales */}
      <ValuePropSection
        content={content}
        onOpenImageViewer={(images, idx, title, caption) => {
          if (onOpenImageViewer && images && images.length > 0) {
            onOpenImageViewer(title || 'Propuesta de Valor', images[idx || 0], caption);
          }
        }}
        onNavigate={onNavigate}
      />

      {/* 2.5 Catálogo Oficial de Modelos de Vivienda en la Sección Principal */}
      <HousingModelsSection
        content={content}
        onSelectModelForQuote={onSelectModelForQuote}
        onOpenImageViewer={onOpenImageViewer}
        onNavigate={onNavigate}
      />

      {/* 3. Directory of Project Pages (Each Section as a Dedicated Page) */}
      <section className="py-16 sm:py-20 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-200 text-stone-800 text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5 text-stone-700" />
              <span>Estructura de Navegación del Proyecto</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4">
              Explora Cada Sección de Mis Delirios Ranch
            </h2>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              Haz clic en cualquiera de las secciones para acceder a su página completa con información técnica, planos arquitectónicos, renders interactivos y disponibilidad.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {sectionCards.map((card) => (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group ${card.accentColor} bg-white`}
                id={`home-card-goto-${card.id}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-stone-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {card.icon}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-stone-700 border border-stone-200">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200/60 flex items-center justify-between text-xs font-bold text-stone-900 group-hover:text-emerald-700">
                  <span>{card.actionText}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Direct Pre-Sale CTA Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white p-8 sm:p-10 border border-stone-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Preventa Exclusiva en Desarrollo
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                Asegura tu Parcela Agroproductiva con Solo 10% de Reserva
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Adquiere tu mini-granja en Sabana Larga a $20 USD/m² con financiamiento directo sin intermediarios bancarios, agua pura de manantial y clima templado constante.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('plan-maestro')}
                className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all text-center whitespace-nowrap"
              >
                Ver Catálogo de Lotes
              </button>
              <button
                onClick={() => onNavigate('contacto')}
                className="py-3 px-6 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-sm border border-stone-700 transition-all text-center whitespace-nowrap"
              >
                Contactar Asesor
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
