import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FolderArchive,
  Globe,
  Image as ImageIcon,
  Video,
  X,
  Eye,
  Sparkles,
  HardDrive,
  FileCheck,
} from 'lucide-react';
import { MediaSourceSelectorModal } from './MediaSourceSelectorModal';
import { detectMediaOrigin, normalizeVideoUrl, readAndProcessMediaFile } from '../lib/mediaProcessor';

export interface MediaFieldWithSourceSelectorProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onMetadataSelected?: (metadata: { title?: string; mediaType?: 'image' | 'video' }) => void;
  mediaType?: 'image' | 'video' | 'any';
  placeholder?: string;
  helperText?: string;
  required?: boolean;
}

export const MediaFieldWithSourceSelector: React.FC<MediaFieldWithSourceSelectorProps> = ({
  id,
  label,
  value,
  onChange,
  onMetadataSelected,
  mediaType = 'image',
  placeholder = 'Pegue una URL o seleccione el origen del archivo...',
  helperText,
  required = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputDirectRef = useRef<HTMLInputElement>(null);

  const origin = detectMediaOrigin(value);

  // Direct fast-upload from disk
  const handleDirectFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const processed = await readAndProcessMediaFile(e.target.files[0]);
        onChange(processed.dataUrl);
        if (onMetadataSelected) {
          onMetadataSelected({
            title: processed.name,
            mediaType: processed.isVideo ? 'video' : 'image',
          });
        }
      } catch (err: any) {
        alert(err.message || 'Error al procesar archivo');
      }
    }
  };

  const getOriginBadge = () => {
    switch (origin) {
      case 'local':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-medium">
            <HardDrive className="w-3 h-3 text-purple-400" />
            <span>Archivo Local (Dispositivo)</span>
          </span>
        );
      case 'project':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium">
            <FolderArchive className="w-3 h-3 text-emerald-400" />
            <span>Biblioteca Mis Delirios Ranch</span>
          </span>
        );
      case 'web':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-medium">
            <Globe className="w-3 h-3 text-blue-400" />
            <span>Enlace Web Externo</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-800 text-stone-400 border border-stone-700 text-[10px]">
            <span>Sin asignar</span>
          </span>
        );
    }
  };

  const isVideoSource =
    mediaType === 'video' ||
    value.includes('youtube.com') ||
    value.includes('youtu.be') ||
    value.includes('vimeo.com') ||
    value.endsWith('.mp4') ||
    value.endsWith('.webm');

  return (
    <div id={id ? `container-${id}` : undefined} className="space-y-1.5 text-xs">
      {/* Hidden file input for 1-click quick file upload button */}
      <input
        ref={fileInputDirectRef}
        type="file"
        accept={
          mediaType === 'video'
            ? 'video/mp4,video/webm,video/ogg,video/quicktime'
            : mediaType === 'image'
            ? 'image/png,image/jpeg,image/jpg,image/webp,image/svg+xml'
            : 'image/*,video/*'
        }
        onChange={handleDirectFileChange}
        className="hidden"
      />

      {/* Label and Origin Info */}
      <div className="flex items-center justify-between gap-2">
        <label className="block text-stone-300 font-semibold flex items-center gap-1.5">
          {mediaType === 'video' ? (
            <Video className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>{label}</span>
          {required && <span className="text-red-400">*</span>}
        </label>
        {getOriginBadge()}
      </div>

      {/* Input Control Row with Source Selection Button */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        {/* Thumbnail Preview Box if value is set */}
        {value ? (
          <div
            onClick={() => setPreviewOpen(!previewOpen)}
            className="w-12 h-10 rounded-lg overflow-hidden border border-stone-700 bg-stone-950 flex-shrink-0 cursor-pointer hover:border-amber-400 transition-colors relative group"
            title="Clic para previsualizar"
          >
            {isVideoSource ? (
              <div className="w-full h-full flex items-center justify-center bg-stone-900 text-amber-400">
                <Video className="w-5 h-5" />
              </div>
            ) : (
              <img
                src={value}
                alt="Miniatura"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Eye className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        ) : null}

        {/* Input text field (editable URL/path/base64 preview) */}
        <div className="relative flex-1 min-w-0">
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-3 pr-8 py-2 rounded-xl bg-stone-900 border border-stone-700 text-white font-mono text-xs focus:border-amber-500 focus:outline-none placeholder:text-stone-500 truncate"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-red-400 p-1 rounded transition-colors"
              title="Limpiar campo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Button: SELECCIONAR ORIGEN DEL ARCHIVO */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            id={id ? `btn-select-origin-${id}` : undefined}
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md hover:shadow-amber-500/20 transition-all whitespace-nowrap"
            title="Seleccionar origen: Archivo local de tu PC, Biblioteca del Ranch o Enlace Web"
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Seleccionar Origen</span>
          </button>

          {/* Quick upload trigger */}
          <button
            type="button"
            onClick={() => fileInputDirectRef.current?.click()}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 hover:border-amber-500/50 transition-colors"
            title="Subir archivo directo desde tu PC o dispositivo"
          >
            <UploadCloud className="w-4 h-4 text-amber-400" />
          </button>

          {/* Quick eye preview toggle if has value */}
          {value && (
            <button
              type="button"
              onClick={() => setPreviewOpen(!previewOpen)}
              className={`p-2 rounded-xl border transition-colors ${
                previewOpen
                  ? 'bg-amber-500 text-stone-950 border-amber-400'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
              }`}
              title="Mostrar / ocultar vista previa del render"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {helperText && <p className="text-[11px] text-stone-400 leading-normal">{helperText}</p>}

      {/* Inline Expanded Preview Box */}
      {previewOpen && value && (
        <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px] text-stone-400">
            <span className="font-semibold text-stone-300 flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Previsualización del Archivo Activo</span>
            </span>
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="text-stone-400 hover:text-stone-200 text-[10px]"
            >
              Ocultar
            </button>
          </div>

          <div className="w-full max-h-64 rounded-lg overflow-hidden border border-stone-800 bg-stone-900 flex items-center justify-center">
            {isVideoSource ? (
              value.includes('youtube.com') || value.includes('youtu.be') || value.includes('vimeo') ? (
                <iframe
                  src={normalizeVideoUrl(value)}
                  title="Vista Previa de Video"
                  className="w-full h-56 border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={value} controls className="w-full max-h-56 object-contain" />
              )
            ) : (
              <img
                src={value}
                alt="Vista previa completa"
                className="w-full max-h-56 object-contain"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </div>
      )}

      {/* Media Source Selector Modal */}
      <MediaSourceSelectorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialUrl={value}
        mediaType={mediaType}
        fieldTitle={label}
        onSelectMedia={(newUrl, metadata) => {
          onChange(newUrl);
          if (onMetadataSelected && metadata) {
            onMetadataSelected(metadata);
          }
        }}
      />
    </div>
  );
};
