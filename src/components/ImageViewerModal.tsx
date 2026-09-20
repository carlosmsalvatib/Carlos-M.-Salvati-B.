import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Download } from 'lucide-react';

interface ImageViewerModalProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  images,
  currentIndex,
  title,
  subtitle,
  onClose,
  onIndexChange,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        onIndexChange((currentIndex + 1) % images.length);
        setIsZoomed(false);
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        onIndexChange((currentIndex - 1 + images.length) % images.length);
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, currentIndex, onClose, onIndexChange]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(false);
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(false);
    onIndexChange((currentIndex + 1) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-md transition-all duration-300 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Visor amplificado de imagen"
      id="image-viewer-modal"
    >
      {/* Top Bar Header */}
      <div
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col text-white max-w-xl">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-bold text-white tracking-wide truncate">
              {title || 'Visualización de Imagen'}
            </span>
            {images.length > 1 && (
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-stone-800/90 border border-stone-700 text-amber-400 rounded-full">
                {currentIndex + 1} de {images.length}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-stone-300 mt-0.5 truncate">{subtitle}</p>}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 transition-colors"
            title={isZoomed ? 'Reducir zoom' : 'Ampliar al 100%'}
            id="modal-zoom-toggle-btn"
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>
          <a
            href={currentImage}
            target="_blank"
            rel="noopener noreferrer"
            download="mis_delirios_ranch_imagen"
            className="p-2.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 transition-colors"
            title="Abrir en pestaña nueva / Descargar"
            id="modal-download-image-btn"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-red-600/80 hover:bg-red-500 text-white shadow-lg transition-all hover:scale-105"
            title="Cerrar visor (Esc)"
            id="modal-close-viewer-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrow: Previous */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 z-40 p-3 rounded-full bg-stone-900/80 hover:bg-amber-500 hover:text-stone-950 text-white border border-stone-700 transition-all shadow-xl hover:scale-110 focus:outline-none"
            title="Imagen anterior (Flecha izquierda)"
            id="viewer-prev-arrow-btn"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Amplified Image */}
        <div
          className={`relative max-w-full max-h-full flex items-center justify-center transition-transform duration-200 ${
            isZoomed ? 'scale-125 cursor-zoom-out overflow-auto' : 'scale-100 cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={currentImage}
            alt={title || 'Visualización ampliada'}
            className="max-w-[90vw] max-h-[75vh] object-contain rounded-lg shadow-2xl border border-stone-800 bg-stone-900"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Navigation Arrow: Next */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 z-40 p-3 rounded-full bg-stone-900/80 hover:bg-amber-500 hover:text-stone-950 text-white border border-stone-700 transition-all shadow-xl hover:scale-110 focus:outline-none"
            title="Imagen siguiente (Flecha derecha)"
            id="viewer-next-arrow-btn"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip for Multi-Image Items */}
      {images.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 bg-stone-900/90 border border-stone-800/90 rounded-full shadow-2xl overflow-x-auto max-w-[90vw]"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsZoomed(false);
                onIndexChange(idx);
              }}
              className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                idx === currentIndex
                  ? 'border-amber-400 scale-105 shadow-md shadow-amber-400/30'
                  : 'border-stone-700 opacity-60 hover:opacity-100 hover:border-stone-500'
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
        </div>
      )}
    </div>
  );
};
