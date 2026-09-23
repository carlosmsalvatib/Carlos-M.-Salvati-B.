import React, { useState } from 'react';
import { CmsContent } from '../types';
import { MapPin, Navigation, Compass, CloudSun, Mountain, ShieldCheck, ExternalLink, Clock, Route } from 'lucide-react';

interface LocationSectionProps {
  content: CmsContent;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ content }) => {
  const { location } = content;
  const [activeTab, setActiveTab] = useState<'map' | 'connectivity'>('map');

  if (!location.active) return null;

  return (
    <section id="ubicacion" className="py-20 bg-stone-900 text-stone-100 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#a3e635_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Ubicación Privilegiada</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4" id="location-title">
            {location.title || 'La Ruta de la Montaña y la Neblina'}
          </h2>
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed" id="location-desc">
            {location.description}
          </p>
        </div>

        {/* Travel Time Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-stone-800/80 border border-stone-700/80 rounded-xl p-5 flex items-center gap-4 hover:border-amber-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">San Cristóbal</span>
              <p className="text-stone-100 font-bold text-lg">{location.travelTimes.sanCristobal}</p>
              <p className="text-xs text-stone-400">Vía principal asfaltada</p>
            </div>
          </div>

          <div className="bg-stone-800/80 border border-stone-700/80 rounded-xl p-5 flex items-center gap-4 hover:border-emerald-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Navigation className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Centro de Cordero</span>
              <p className="text-stone-100 font-bold text-lg">{location.travelTimes.cordero}</p>
              <p className="text-xs text-stone-400">Supermercados, bancos y farmacias</p>
            </div>
          </div>

          <div className="bg-stone-800/80 border border-stone-700/80 rounded-xl p-5 flex items-center gap-4 hover:border-sky-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
              <Route className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">Carretera Trasandina</span>
              <p className="text-stone-100 font-bold text-lg">Acceso Directo Frontal</p>
              <p className="text-xs text-stone-400">714,46 metros de frente vial</p>
            </div>
          </div>
        </div>

        {/* Interactive Map & Geographic Highlights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Map Container */}
          <div className="lg:col-span-7 bg-stone-800 rounded-2xl overflow-hidden border border-stone-700 shadow-2xl flex flex-col">
            <div className="p-4 bg-stone-850 border-b border-stone-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="font-semibold">{location.municipality}</span>
                <span>·</span>
                <span className="text-stone-400">{location.sectors}</span>
              </div>
              <a
                href={location.mapExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium"
                id="location-maps-link"
              >
                <span>Ver en Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Embed Frame */}
            <div className="relative w-full h-[360px] sm:h-[420px] bg-stone-900">
              <iframe
                title="Mapa de Ubicación Mis Delirios Ranch"
                src={location.googleMapsEmbedUrl}
                className="w-full h-full border-0 filter contrast-105"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="p-3 bg-stone-900/90 text-[11px] text-stone-400 text-center border-t border-stone-800">
              Coordenadas: Lat {location.coordinates.lat}, Lng {location.coordinates.lng} · Altitud promedio: 1.150 m.s.n.m.
            </div>
          </div>

          {/* Environmental Attributes Checklist */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {location.features.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-stone-800/60 hover:bg-stone-800 border border-stone-700/60 hover:border-amber-400/40 p-5 rounded-xl transition-all duration-200"
                id={`location-feature-${idx}`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-stone-700/70 flex items-center justify-center flex-shrink-0 text-amber-400">
                    {idx === 0 && <CloudSun className="w-5 h-5" />}
                    {idx === 1 && <Mountain className="w-5 h-5" />}
                    {idx === 2 && <ShieldCheck className="w-5 h-5" />}
                    {idx === 3 && <MapPin className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 to-stone-900 border border-emerald-800/50">
              <p className="text-xs text-emerald-200 leading-relaxed">
                <strong>Reserva ecológica del Río Torbes:</strong> El lindero este del proyecto colinda con la cuenca del Río Torbes en línea quebrada (69,34 m y 165,51 m), proveyendo biodiversidad y brisas frescas permanentes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
