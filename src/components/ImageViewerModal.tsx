import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download } from 'lucide-react';

export interface ImageViewerModalProps {
  isOpen: boolean;
  images: string[];
  currentIndex?: number;
  initialIndex?: number;
  title?: string;
  subtitle?: string;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  images = [],
  currentIndex,
  initialIndex,
  title,
  subtitle,
  onClose,
  onIndexChange,
}) => {
  // Normalize images to ensure valid array of strings
  const validImages = Array.isArray(images)
    ? images.filter((img) => typeof img === 'string' && img.trim().length > 0)
    : typeof images === 'string' && (images as string).trim().length > 0
    ? [images]
    : [];

  const initialSafeIndex = typeof currentIndex === 'number'
    ? currentIndex
    : typeof initialIndex === 'number'
    ? initialIndex
    : 0;

  const [internalIndex, setInternalIndex] = useState<number>(initialSafeIndex);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Sync internalIndex when opening or when currentIndex/initialIndex changes
  useEffect(() => {
    if (isOpen) {
      const target = typeof currentIndex === 'number'
        ? currentIndex
        : typeof initialIndex === 'number'
        ? initialIndex
        : 0;
      const safe = validImages.length > 0 ? Math.max(0, Math.min(target, validImages.length - 1)) : 0;
      setInternalIndex(safe);
      setIsZoomed(false);
    }
  }, [isOpen, currentIndex, initialIndex, validImages.length]);

  const activeIndex = validImages.length > 0
    ? Math.max(0, Math.min(internalIndex, validImages.length - 1))
    : 0;

  const setIndex = useCallback(
    (newIndex: number) => {
      if (validImages.length === 0) return;
      const normalized = (newIndex % validImages.length + validImages.length) % validImages.length;
      setInternalIndex(normalized);
      setIsZoomed(false);
      if (onIndexChange) {
        onIndexChange(normalized);
      }
    },
    [validImages.length, onIndexChange]
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setIndex(activeIndex - 1);
    },
    [activeIndex, setIndex]
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setIndex(activeIndex + 1);
    },
    [activeIndex, setIndex]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && validImages.length > 1) {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' && validImages.length > 1) {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, validImages.length, handleNext, handlePrev, onClose]);

  if (!isOpen || validImages.length === 0) return null;

  const currentImage = validImages[activeIndex] || validImages[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) > 45) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-md transition-all duration-300 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Visor amplificado de imagen"
      id="image-viewer-modal"
    >
      {/* Top Bar Header */}
      <div
        className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/85 via-black/50 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col text-white max-w-xl">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-bold text-white tracking-wide truncate">
              {title || 'Visualización de Imagen'}
            </span>
            {validImages.length > 1 && (
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-stone-800/90 border border-stone-700 text-amber-400 rounded-full font-mono">
                {activeIndex + 1} de {validImages.length}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-stone-300 mt-0.5 truncate">{subtitle}</p>}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 transition-colors cursor-pointer"
            title={isZoomed ? 'Reducir zoom' : 'Ampliar detalle'}
            id="modal-zoom-toggle-btn"
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </button>
          <a
            href={currentImage}
            target="_blank"
            rel="noopener noreferrer"
            download="mis_delirios_ranch_imagen"
            className="p-2.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 hover:text-white border border-stone-700 transition-colors cursor-pointer"
            title="Abrir en pestaña nueva / Descargar"
            id="modal-download-image-btn"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-red-600/90 hover:bg-red-500 text-white shadow-lg transition-all hover:scale-105 cursor-pointer"
            title="Cerrar visor (Esc)"
            id="modal-close-viewer-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 overflow-hidden select-none"
        onClick={onClose}
      >
        {/* Navigation Arrow: Previous */}
        {validImages.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 z-50 p-3 rounded-full bg-stone-900/85 hover:bg-amber-500 hover:text-stone-950 text-white border border-stone-700 transition-all shadow-xl hover:scale-110 focus:outline-none cursor-pointer"
            title="Imagen anterior (Flecha izquierda)"
            id="viewer-prev-arrow-btn"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Amplified Image Wrapper */}
        <div
          className={`relative max-w-full max-h-full flex items-center justify-center transition-transform duration-200 ${
            isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(!isZoomed);
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            key={currentImage}
            src={currentImage}
            alt={title || 'Visualización ampliada'}
            className="max-w-[90vw] max-h-[75vh] object-contain rounded-lg shadow-2xl border border-stone-800 bg-stone-900"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (!target.src.includes('/api/images/model-a-render')) {
                target.src = '/api/images/model-a-render';
              }
            }}
          />
        </div>

        {/* Navigation Arrow: Next */}
        {validImages.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 sm:right-8 z-50 p-3 rounded-full bg-stone-900/85 hover:bg-amber-500 hover:text-stone-950 text-white border border-stone-700 transition-all shadow-xl hover:scale-110 focus:outline-none cursor-pointer"
            title="Imagen siguiente (Flecha derecha)"
            id="viewer-next-arrow-btn"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip for Multi-Image Items */}
      {validImages.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 bg-stone-900/90 border border-stone-800 rounded-full shadow-2xl overflow-x-auto max-w-[90vw]"
          onClick={(e) => e.stopPropagation()}
        >
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIndex(idx);
              }}
              className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                idx === activeIndex
                  ? 'border-amber-400 scale-105 shadow-md shadow-amber-400/30 ring-2 ring-amber-400/40'
                  : 'border-stone-700 opacity-60 hover:opacity-100 hover:border-stone-500'
              }`}
              title={`Ver imagen ${idx + 1}`}
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
