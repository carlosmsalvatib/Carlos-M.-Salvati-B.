import React, { useState } from 'react';
import { CmsContent, PropuestaVideo } from '../types';
import { initialCmsContent } from '../data/initialContent';
import { normalizeVideoUrl } from '../lib/mediaProcessor';
import {
  Sprout,
  Home,
  Grid,
  Trees,
  Check,
  ShieldCheck,
  Play,
  Video,
  Eye,
  Maximize2,
  Sparkles,
  Layers,
  Film,
  Camera,
  AlertCircle,
} from 'lucide-react';

interface ValuePropSectionProps {
  content: CmsContent;
  onOpenImageViewer?: (images: string[], index?: number, title?: string, subtitle?: string) => void;
  onNavigate?: (page: string) => void;
}

export const ValuePropSection: React.FC<ValuePropSectionProps> = ({
  content,
  onOpenImageViewer,
  onNavigate,
}) => {
  const valueProp = content?.valueProp || initialCmsContent.valueProp;

  const rawVideos = valueProp.videos && valueProp.videos.length > 0 ? valueProp.videos : initialCmsContent.valueProp.videos;
  const videos: PropuestaVideo[] = rawVideos && rawVideos.length > 0
    ? rawVideos
    : [
          {
            id: 'video-render-1',
            title: 'Recorrido Arquitectónico 3D · Mis Delirios Ranch',
            description: 'Paseo virtual panorámico por el complejo, vialidades comunales y bulevar de la Guadua.',
            url: 'https://assets.mixkit.co/videos/preview/mixkit-flying-over-a-green-mountain-valley-41004-large.mp4',
            videoType: 'render_3d',
            duration: '01:45',
          },
          {
            id: 'video-render-2',
            title: 'Vuelo de Dron & Renders sobre Terreno Real',
            description: 'Sobrevolando la topografía suave de Sabana Larga con integración de modelos de casas en bambú.',
            url: 'https://assets.mixkit.co/videos/preview/mixkit-pine-trees-in-a-forest-on-a-windy-day-41005-large.mp4',
            videoType: 'dron_aereo',
            duration: '02:10',
          },
          {
            id: 'video-render-3',
            title: 'Bioconstrucción Sismorresistente en Bambú Guadua',
            description: 'Animación estructural de losa flotante de concreto a 40 cm y columnas de Guadua angustifolia.',
            url: 'https://assets.mixkit.co/videos/preview/mixkit-river-surrounded-by-trees-in-a-forest-41006-large.mp4',
            videoType: 'bioconstruccion',
            duration: '01:30',
          },
        ];

  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'foto'>('video');

  if (valueProp && valueProp.active === false) return null;

  const currentVideo: any = videos[selectedVideoIndex] || videos[0] || {};
  const rawVideoUrl = currentVideo.url || currentVideo.videoUrl || '';
  const normalizedVideoUrl = normalizeVideoUrl(rawVideoUrl);
  const isEmbedVideo =
    normalizedVideoUrl.includes('youtube.com') ||
    normalizedVideoUrl.includes('youtu.be') ||
    normalizedVideoUrl.includes('vimeo.com') ||
    normalizedVideoUrl.includes('player.vimeo.com');
  const videoPosterImage =
    currentVideo.posterUrl ||
    currentVideo.thumbnailUrl ||
    valueProp.imageUrl ||
    '/api/images/hero-landscape';

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

  const handleOpenPhotoZoom = () => {
    if (onOpenImageViewer) {
      const terrainImages = [
        valueProp.imageUrl || '/api/images/real-terrain',
        '/api/images/hero-landscape',
        '/api/images/bulevar-guadua',
      ];
      onOpenImageViewer(
        terrainImages,
        0,
        'Terreno Real · Sabana Larga, Cordero',
        'Topografía suave andina, tierra fértil y clima templado constante'
      );
    }
  };

  return (
    <section id="propuesta" className="py-16 sm:py-20 bg-stone-100 text-stone-800 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200">
            <Film className="w-3.5 h-3.5 text-emerald-700" />
            <span>Propuesta de Valor Integral & Renders Audiovisuales</span>
          </div>
          {valueProp.subtitle && (
            <p className="text-emerald-700 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2" id="valueprop-subtitle">
              {valueProp.subtitle}
            </p>
          )}
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-4" id="valueprop-title">
            {valueProp.title || 'Un Modelo de Desarrollo Sostenible e Innovación Arquitectónica'}
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed" id="valueprop-desc">
            {valueProp.description}
          </p>
        </div>

        {/* 2-Column Showcase: Render Video Player in place of image + Core Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          {/* LEFT: Video Render Player loaded via CMS */}
          <div className="lg:col-span-7 order-1 space-y-4">
            {/* Media Selector Tabs: Renders de Video vs Foto Real */}
            <div className="flex items-center justify-between bg-stone-200/80 p-1.5 rounded-xl border border-stone-300">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveMediaTab('video')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeMediaTab === 'video'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-white/50'
                  }`}
                  id="tab-renders-video"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Renders de Video ({videos.length})</span>
                </button>
                <button
                  onClick={() => setActiveMediaTab('foto')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeMediaTab === 'foto'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-white/50'
                  }`}
                  id="tab-foto-terreno"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Foto Terreno Real</span>
                </button>
              </div>

              <span className="text-[11px] text-stone-500 font-medium hidden sm:inline px-2">
                Cargados desde CMS
              </span>
            </div>

            {/* VIDEO RENDER MODE */}
            {activeMediaTab === 'video' && (
              <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col">
                {/* Main Video Viewport */}
                <div className="relative aspect-video w-full bg-stone-950 flex items-center justify-center group overflow-hidden">
                  {isPlaying ? (
                    videoError ? (
                      <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-stone-900 text-stone-200">
                        <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
                        <h4 className="font-bold text-stone-100 text-base mb-1">
                          No se pudo reproducir este archivo de video
                        </h4>
                        <p className="text-xs text-stone-400 max-w-sm mb-4">
                          El enlace del video puede requerir un formato directo compatible (.mp4, .webm) o estar temporalmente inaccesible.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setVideoError(false);
                              setSelectedVideoIndex((prev) => (prev + 1) % videos.length);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                          >
                            Probar siguiente video
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setVideoError(false);
                              setIsPlaying(false);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                          >
                            Volver a portada
                          </button>
                        </div>
                      </div>
                    ) : isEmbedVideo ? (
                      <iframe
                        src={`${normalizedVideoUrl}${normalizedVideoUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0`}
                        title={currentVideo.title || 'Render de Video 3D'}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={normalizedVideoUrl || rawVideoUrl}
                        controls
                        autoPlay
                        playsInline
                        onError={() => setVideoError(true)}
                        className="w-full h-full object-cover"
                      >
                        <source src={normalizedVideoUrl || rawVideoUrl} type="video/mp4" />
                        Tu navegador no soporta la reproducción de video HTML5.
                      </video>
                    )
                  ) : (
                    /* High-tech 3D Render Screen Poster */
                    <div
                      className="relative w-full h-full cursor-pointer bg-gradient-to-tr from-stone-950 via-emerald-950/50 to-stone-900 flex items-center justify-center"
                      onClick={() => setIsPlaying(true)}
                    >
                      {/* Background render graphic */}
                      <img
                        src={videoPosterImage}
                        alt={currentVideo.title || 'Render 3D'}
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {/* Dark overlay with architectural grid accents */}
                      <div className="absolute inset-0 bg-stone-950/40 group-hover:bg-stone-950/20 transition-colors" />

                      {/* Tech HUD overlay badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          RENDER 3D VIRTUAL
                        </span>
                        {currentVideo.duration && (
                          <span className="px-2 py-0.5 rounded bg-black/70 text-stone-300 text-[10px] font-mono border border-stone-700">
                            {currentVideo.duration}
                          </span>
                        )}
                      </div>

                      {/* Glowing Big Play Button */}
                      <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 transform group-hover:scale-110 transition-all">
                        <Play className="w-8 h-8 fill-stone-950 translate-x-0.5" />
                      </div>

                      {/* Bottom Banner on Video */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                        <p className="text-white font-bold text-sm sm:text-base line-clamp-1">
                          {currentVideo.title}
                        </p>
                        <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">
                          Click para reproducir render arquitectónico interactivo
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Info & Video Switcher Buttons */}
                <div className="p-4 sm:p-5 bg-stone-900 border-t border-stone-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-serif font-bold text-white text-base">
                        {currentVideo.title}
                      </h4>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {currentVideo.description}
                      </p>
                    </div>
                    {isPlaying && (
                      <button
                        onClick={() => setIsPlaying(false)}
                        className="self-start sm:self-auto px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors"
                      >
                        Pausar
                      </button>
                    )}
                  </div>

                  {/* Carousel of Available Videos from CMS */}
                  {videos.length > 1 && (
                    <div className="pt-3 border-t border-stone-800/80">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                        Seleccionar Render de Video:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {videos.map((vid, idx) => (
                          <button
                            key={vid.id || idx}
                            onClick={() => {
                              setSelectedVideoIndex(idx);
                              setIsPlaying(false);
                            }}
                            className={`p-2 rounded-xl text-left border transition-all ${
                              idx === selectedVideoIndex
                                ? 'bg-emerald-950/80 border-emerald-500 text-white shadow-md'
                                : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:bg-stone-800 hover:text-white'
                            }`}
                            id={`select-video-btn-${idx}`}
                          >
                            <div className="flex items-center gap-1.5 text-[11px] font-bold mb-1 truncate">
                              <Film className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              <span className="truncate">{vid.title}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-stone-400">
                              <span>{vid.videoType || 'Render'}</span>
                              <span className="font-mono text-amber-300/80">{vid.duration}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* REAL TERRAIN PHOTO MODE (when toggled) */}
            {activeMediaTab === 'foto' && (
              <div
                className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-300 group bg-stone-200 cursor-pointer"
                onClick={handleOpenPhotoZoom}
              >
                <img
                  src={valueProp.imageUrl || '/api/images/real-terrain'}
                  alt={valueProp.imageAlt || 'Fotografía real del terreno Sabana Larga Cordero Táchira'}
                  className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 p-2 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors shadow-lg">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-6">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider mb-1.5">
                      Terreno Real · Sabana Larga
                    </span>
                    <p className="text-white text-sm font-medium">
                      Topografía suave, tierra fértil andina y clima templado constante a 5 min de Cordero.
                    </p>
                    <p className="text-xs text-amber-300 mt-1 font-semibold flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Click para ampliar imagen en alta resolución
                    </p>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-stone-500 italic text-center sm:text-left">
              * Los renders de video y fotografías son gestionables y actualizables en tiempo real mediante el CMS de la sección.
            </p>
          </div>

          {/* RIGHT: Detailed Pillars & Highlights */}
          <div className="lg:col-span-5 order-2 space-y-5">
            <div className="border-l-4 border-emerald-600 pl-4 mb-4">
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                {valueProp.subtitle || 'La Armonía Perfecta entre Agroproducción y Turismo'}
              </h3>
              <p className="text-sm text-stone-600 mt-1">
                Diseñado para quienes valoran la independencia alimentaria, la bioconstrucción y un patrimonio que se revaloriza en dólares.
              </p>
            </div>

            <div className="space-y-3.5">
              {(valueProp.benefits || initialCmsContent.valueProp.benefits || []).map((benefit, index) => (
                <div
                  key={benefit.id || index}
                  className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                  id={`valueprop-card-${index}`}
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-700">
                    {renderIcon(benefit.icon)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-base mb-1">{benefit.title}</h4>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Navigation Buttons */}
            {onNavigate && (
              <div className="pt-3 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onNavigate('plan-maestro')}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all text-center"
                >
                  Ver Plan Maestro & Planos →
                </button>
                <button
                  onClick={() => onNavigate('contacto')}
                  className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all text-center"
                >
                  Cotizar Lote
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
