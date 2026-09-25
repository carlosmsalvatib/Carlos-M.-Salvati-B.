import React, { useState } from 'react';
import { CmsContent } from '../types';
import { ArrowRight, Download, Sparkles, MapPin, Play, Film, X } from 'lucide-react';
import { normalizeVideoUrl } from '../lib/mediaProcessor';

interface HeroSectionProps {
  content: CmsContent;
  onNavigate?: (pageId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ content, onNavigate }) => {
  const { hero } = content;
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [bgVideoError, setBgVideoError] = useState(false);

  if (!hero.active) return null;

  const rawVideoUrl = hero.backgroundVideoUrl || hero.videoUrl || '';
  const normalizedVideoUrl = rawVideoUrl ? normalizeVideoUrl(rawVideoUrl) : '';
  const isEmbedVideo =
    normalizedVideoUrl.includes('youtube.com') ||
    normalizedVideoUrl.includes('youtube-nocookie.com') ||
    normalizedVideoUrl.includes('youtu.be') ||
    normalizedVideoUrl.includes('vimeo.com') ||
    normalizedVideoUrl.includes('player.vimeo.com');

  const bgImageUrl = hero.backgroundImageUrl || (hero as any).backgroundImage || '/api/images/hero-landscape';

  const handlePrimaryClick = () => {
    if (onNavigate) {
      onNavigate('plan-maestro');
    } else {
      const el = document.getElementById('plan-maestro');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSecondaryClick = () => {
    if (onNavigate) {
      onNavigate('financiamiento');
    } else {
      const el = document.getElementById('financiamiento');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-stone-950">
      {/* Background Graphic & Video Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {normalizedVideoUrl && !isEmbedVideo && !bgVideoError ? (
          <video
            key={normalizedVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            poster={bgImageUrl}
            onError={() => setBgVideoError(true)}
            className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-105"
          >
            <source src={normalizedVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={bgImageUrl}
            alt="Paisaje montañoso Mis Delirios Ranch y cabañas en Guadua"
            className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-105"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-900/60" />
        <div className="absolute inset-0 bg-radial from-transparent via-stone-950/40 to-stone-950/90" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-6 sm:mt-10">
        {/* Promotional Badge / Sello */}
        {hero.showBadge && (
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm mb-6 shadow-lg animate-pulse"
            id="hero-promo-badge"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{hero.badgeText || 'Preventa Exclusiva Primera Etapa'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="text-amber-300 font-bold">{hero.priceBadge || '20 USD/m²'}</span>
          </div>
        )}

        {/* Main H1 Title */}
        <h1
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 drop-shadow-md"
          id="hero-main-title"
        >
          {hero.title || 'MIS DELIRIOS RANCH – Refugio y Tranquilidad Garantizada'}
        </h1>

        {/* Subtitle */}
        <p
          className="max-w-3xl mx-auto text-base sm:text-xl text-stone-200 font-normal leading-relaxed mb-8 drop-shadow"
          id="hero-subtitle"
        >
          {hero.subtitle || 'Complejo Urbanístico Agroproductivo y Turístico en el Corazón de los Andes'}
        </p>

        {/* High-Impact CTAs & Video Player Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={handlePrimaryClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-xl shadow-amber-950/40 hover:shadow-amber-500/20 transform hover:-translate-y-0.5 transition-all duration-200 group"
            id="hero-primary-cta"
          >
            <span>{hero.primaryCtaText || 'Reserva tu lote con 10% de inicial'}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleSecondaryClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-semibold bg-stone-900/80 hover:bg-stone-800 text-white border border-stone-700/80 backdrop-blur-sm shadow-lg hover:border-amber-400/60 transition-all duration-200"
            id="hero-secondary-cta"
          >
            <Download className="w-5 h-5 text-amber-400" />
            <span>{hero.secondaryCtaText || 'Simular Plan de Venta'}</span>
          </button>

          {rawVideoUrl && (
            <button
              onClick={() => setVideoModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-base font-semibold bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-500/60 backdrop-blur-sm shadow-lg hover:border-emerald-400 transition-all duration-200 group"
              id="hero-video-cta"
              title="Reproducir video de presentación"
            >
              <Play className="w-5 h-5 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
              <span>Ver Video Presentación</span>
            </button>
          )}
        </div>

        {/* Key Real Estate Pillars (Bento Strip) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 border-t border-stone-800/80">
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-3.5 backdrop-blur-sm text-left">
            <span className="block text-amber-400 font-serif font-bold text-xl sm:text-2xl">20 USD/m²</span>
            <span className="text-xs text-stone-300 font-medium">Precio Preventa Garantizado</span>
          </div>
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-3.5 backdrop-blur-sm text-left">
            <span className="block text-emerald-400 font-serif font-bold text-xl sm:text-2xl">Desde 600 m²</span>
            <span className="text-xs text-stone-300 font-medium">Mini-Granjas Autosustentables</span>
          </div>
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-3.5 backdrop-blur-sm text-left">
            <span className="block text-amber-400 font-serif font-bold text-xl sm:text-2xl">57 Lotes</span>
            <span className="text-xs text-stone-300 font-medium">Comunidad Planificada</span>
          </div>
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-3.5 backdrop-blur-sm text-left">
            <span className="block text-emerald-400 font-serif font-bold text-xl sm:text-2xl">+14.600 m²</span>
            <span className="text-xs text-stone-300 font-medium">Bulevar de Uso Comunal</span>
          </div>
        </div>

        {/* Location tag */}
        <div className="mt-8 inline-flex items-center gap-2 text-xs text-stone-400">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>Municipio Andrés Bello, Sabana Larga y Aldea Salomón · Cordero, Táchira · A 30 min de San Cristóbal</span>
        </div>
      </div>

      {/* Video Modal Player */}
      {videoModalOpen && rawVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 bg-stone-950 border-b border-stone-800">
              <div className="flex items-center gap-2 text-stone-200">
                <Film className="w-5 h-5 text-amber-400" />
                <span className="font-semibold text-sm">Video de Presentación · Mis Delirios Ranch</span>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                title="Cerrar video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              {isEmbedVideo ? (
                <iframe
                  src={`${normalizedVideoUrl}${normalizedVideoUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0`}
                  title="Video Presentación Mis Delirios Ranch"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src={normalizedVideoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Tu navegador no soporta reproducción de video.
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
