import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FolderArchive,
  Globe,
  X,
  Check,
  Image as ImageIcon,
  Video,
  FileText,
  Search,
  Maximize2,
  AlertCircle,
  HardDrive,
  Copy,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { PROJECT_MEDIA_LIBRARY, ProjectMediaItem } from '../data/projectMediaLibrary';
import {
  readAndProcessMediaFile,
  normalizeVideoUrl,
  detectMediaOrigin,
  ProcessedMediaFile,
} from '../lib/mediaProcessor';
import { uploadMediaToServer } from '../lib/api';

export interface MediaSourceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia: (url: string, metadata?: { title?: string; mediaType?: 'image' | 'video' }) => void;
  initialUrl?: string;
  mediaType?: 'image' | 'video' | 'any';
  fieldTitle?: string;
}

export const MediaSourceSelectorModal: React.FC<MediaSourceSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia,
  initialUrl = '',
  mediaType = 'any',
  fieldTitle = 'Render o Imagen',
}) => {
  // Determine default tab based on initialUrl or mediaType
  const initialOrigin = detectMediaOrigin(initialUrl);
  const [activeTab, setActiveTab] = useState<'upload' | 'library' | 'url'>(
    initialOrigin === 'local' ? 'upload' : initialOrigin === 'project' ? 'library' : 'library'
  );

  // Tab 1: Local Upload State
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<ProcessedMediaFile | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab 2: Project Library State
  const [libraryFilter, setLibraryFilter] = useState<string>('todos');
  const [librarySearch, setLibrarySearch] = useState<string>('');
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<ProjectMediaItem | null>(null);

  // Tab 3: URL State
  const [webUrl, setWebUrl] = useState<string>('');
  const [urlPreviewValid, setUrlPreviewValid] = useState<boolean | null>(null);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setWebUrl(initialUrl || '');
      setUploadError(null);
      setUploadedFile(null);

      // Find matching item in library if exists
      const match = PROJECT_MEDIA_LIBRARY.find((item) => item.url === initialUrl);
      setSelectedLibraryItem(match || null);

      if (initialOrigin === 'local') {
        setActiveTab('upload');
      } else if (initialOrigin === 'project') {
        setActiveTab('library');
      } else if (initialUrl) {
        setActiveTab('url');
      } else {
        setActiveTab('library');
      }
    }
  }, [isOpen, initialUrl]);

  if (!isOpen) return null;

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (file: File) => {
    setIsProcessing(true);
    setUploadError(null);
    try {
      const processed = await readAndProcessMediaFile(file);
      setUploadedFile(processed);
    } catch (err: any) {
      setUploadError(err.message || 'Error al procesar el archivo seleccionado.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter Project Library
  const filteredLibrary = PROJECT_MEDIA_LIBRARY.filter((item) => {
    // Media type filter
    if (mediaType === 'image' && item.mediaType !== 'image') return false;
    if (mediaType === 'video' && item.mediaType !== 'video') return false;

    // Category filter
    if (libraryFilter !== 'todos' && item.category !== libraryFilter) return false;

    // Search filter
    if (librarySearch.trim()) {
      const query = librarySearch.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(query);
      const matchDesc = item.description.toLowerCase().includes(query);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(query));
      return matchTitle || matchDesc || matchTags;
    }

    return true;
  });

  // Confirm Handlers
  const handleConfirmUpload = async () => {
    if (!uploadedFile) return;
    setIsProcessing(true);
    try {
      let finalUrl = uploadedFile.dataUrl;
      if (finalUrl.startsWith('data:')) {
        try {
          const uploadedUrl = await uploadMediaToServer(finalUrl, uploadedFile.name);
          if (uploadedUrl) finalUrl = uploadedUrl;
        } catch (uploadErr) {
          console.warn('Fallback a dataUrl:', uploadErr);
        }
      }
      onSelectMedia(finalUrl, {
        title: uploadedFile.name,
        mediaType: uploadedFile.isVideo ? 'video' : 'image',
      });
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmLibrary = (item?: ProjectMediaItem) => {
    const target = item || selectedLibraryItem;
    if (!target) return;
    onSelectMedia(target.url, {
      title: target.title,
      mediaType: target.mediaType,
    });
    onClose();
  };

  const handleConfirmUrl = () => {
    const clean = webUrl.trim();
    if (!clean) return;
    const normalized = mediaType === 'video' || clean.includes('youtube') || clean.includes('vimeo')
      ? normalizeVideoUrl(clean)
      : clean;

    onSelectMedia(normalized, {
      title: 'Enlace Web',
      mediaType: clean.includes('youtube') || clean.includes('vimeo') || clean.endsWith('.mp4') ? 'video' : 'image',
    });
    onClose();
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setWebUrl(text.trim());
      }
    } catch {
      // Clipboard access might be blocked in iframe
    }
  };

  return (
    <div
      id="media-source-selector-overlay"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="media-source-selector-modal"
        className="relative w-full max-w-3xl bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl text-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {mediaType === 'video' ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                Seleccionar Origen del Archivo
              </h3>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Destino: <span className="text-amber-400 font-semibold">{fieldTitle}</span>
            </p>
          </div>

          <button
            id="btn-close-media-modal"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Origin Selection Tabs (Pills) */}
        <div className="px-4 sm:px-5 py-3 border-b border-stone-800/80 bg-stone-900/60 flex items-center gap-2 overflow-x-auto text-xs">
          <button
            id="tab-origin-library"
            type="button"
            onClick={() => setActiveTab('library')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'library'
                ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>Biblioteca del Ranch (Renders & Planos)</span>
          </button>

          <button
            id="tab-origin-upload"
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'upload'
                ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Subir desde mi Dispositivo (PC / Móvil)</span>
          </button>

          <button
            id="tab-origin-url"
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'url'
                ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Enlace Web / URL Directa</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* TAB 1: LOCAL UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4 text-xs">
              <div
                id="dropzone-upload-area"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                    : 'border-stone-700 hover:border-amber-500/60 bg-stone-950/60 hover:bg-stone-950'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={
                    mediaType === 'video'
                      ? 'video/mp4,video/webm,video/ogg,video/quicktime'
                      : mediaType === 'image'
                      ? 'image/png,image/jpeg,image/jpg,image/webp,image/svg+xml'
                      : 'image/*,video/*'
                  }
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="max-w-md mx-auto space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                    <UploadCloud className="w-7 h-7" />
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      Arrastra tu archivo aquí o haz clic para explorar
                    </h4>
                    <p className="text-stone-400 text-xs mt-1">
                      {mediaType === 'video'
                        ? 'Soporta archivos MP4, WEBM, MOV'
                        : 'Soporta imágenes JPG, PNG, WEBP, SVG de alta definición'}
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800/80 border border-stone-700 text-stone-300 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Optimización y compresión automática de peso incluida</span>
                  </div>
                </div>
              </div>

              {isProcessing && (
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center gap-3 text-stone-300">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Procesando archivo y preparando vista previa...</span>
                </div>
              )}

              {uploadError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadedFile && (
                <div className="p-4 rounded-xl bg-stone-950 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-bold text-emerald-300">Archivo cargado con éxito</span>
                    </div>
                    <span className="text-[11px] font-mono text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                      {uploadedFile.sizeFormatted}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-full sm:w-48 h-32 rounded-lg overflow-hidden border border-stone-800 bg-stone-900 flex-shrink-0 flex items-center justify-center">
                      {uploadedFile.isVideo ? (
                        <video
                          src={uploadedFile.dataUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={uploadedFile.dataUrl}
                          alt={uploadedFile.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5 w-full text-xs">
                      <p className="font-bold text-white truncate" title={uploadedFile.name}>
                        {uploadedFile.name}
                      </p>
                      <p className="text-stone-400 text-[11px]">
                        Tipo: <span className="text-stone-300 font-mono">{uploadedFile.type}</span>
                      </p>
                      {uploadedFile.dimensions && (
                        <p className="text-stone-400 text-[11px]">
                          Dimensiones: <span className="text-stone-300 font-mono">{uploadedFile.dimensions.width} x {uploadedFile.dimensions.height} px</span>
                        </p>
                      )}
                      <p className="text-emerald-400 text-[11px]">
                        Listo para guardarse y mostrarse en la sección seleccionada.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROJECT MEDIA LIBRARY */}
          {activeTab === 'library' && (
            <div className="space-y-4 text-xs">
              {/* Category filters & search */}
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'render_3d', label: 'Renders 3D' },
                    { id: 'blueprint', label: 'Planos Oficiales' },
                    { id: 'landscape', label: 'Paisajes & Terreno' },
                    { id: 'video', label: 'Videos Render' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setLibraryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        libraryFilter === cat.id
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar en catálogo..."
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-950 border border-stone-700 text-white text-xs placeholder:text-stone-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid of Library Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredLibrary.map((item) => {
                  const isSelected = selectedLibraryItem?.id === item.id || initialUrl === item.url;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedLibraryItem(item)}
                      className={`rounded-xl border p-2.5 cursor-pointer transition-all flex flex-col justify-between group ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400'
                          : 'border-stone-800 bg-stone-950/70 hover:border-stone-600 hover:bg-stone-950'
                      }`}
                    >
                      <div>
                        {/* Thumbnail */}
                        <div className="relative w-full h-28 rounded-lg overflow-hidden border border-stone-800 bg-stone-900 mb-2">
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 text-[10px] text-amber-400 font-semibold border border-amber-500/20">
                            {item.categoryLabel}
                          </span>
                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 p-1 rounded-full bg-amber-500 text-stone-950">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>

                        {/* Title & Desc */}
                        <h5 className="font-bold text-white text-xs leading-tight line-clamp-1">
                          {item.title}
                        </h5>
                        <p className="text-stone-400 text-[11px] line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      </div>

                      {/* Select Action */}
                      <div className="pt-2 mt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px]">
                        <span className="font-mono text-stone-400 truncate max-w-[120px]">{item.url}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmLibrary(item);
                          }}
                          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-colors"
                        >
                          Usar este
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredLibrary.length === 0 && (
                <div className="p-8 text-center text-stone-400 border border-stone-800 rounded-xl bg-stone-950">
                  <p>No se encontraron renders o planos con los filtros seleccionados.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WEB URL */}
          {activeTab === 'url' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 mb-1.5 font-semibold">
                  URL Directa del Archivo (Imagen, Render o Video)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={webUrl}
                    onChange={(e) => {
                      setWebUrl(e.target.value);
                      setUrlPreviewValid(null);
                    }}
                    placeholder={
                      mediaType === 'video'
                        ? 'https://www.youtube.com/watch?v=... o URL de video .mp4'
                        : 'https://images.unsplash.com/... o /api/images/...'
                    }
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    title="Pegar del portapapeles"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Pegar</span>
                  </button>
                </div>
                <p className="text-[11px] text-stone-400 mt-1.5">
                  Detecta automáticamente enlaces de YouTube (watch/shorts) y los formatea para reproducción directa sin publicidad.
                </p>
              </div>

              {/* Live URL Preview */}
              {webUrl.trim() && (
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-300">Vista Previa del Enlace:</span>
                    <span className="text-[10px] text-stone-400 font-mono">{webUrl}</span>
                  </div>

                  <div className="w-full h-56 rounded-lg overflow-hidden border border-stone-800 bg-stone-900 flex items-center justify-center">
                    {webUrl.includes('youtube.com') || webUrl.includes('youtu.be') || webUrl.includes('vimeo') ? (
                      <iframe
                        src={normalizeVideoUrl(webUrl)}
                        title="Previsualización de Video"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : webUrl.endsWith('.mp4') || webUrl.endsWith('.webm') ? (
                      <video src={webUrl} controls className="w-full h-full object-contain" />
                    ) : (
                      <img
                        src={webUrl}
                        alt="Previsualización de Enlace"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                        onLoad={() => setUrlPreviewValid(true)}
                        onError={() => setUrlPreviewValid(false)}
                      />
                    )}
                  </div>

                  {urlPreviewValid === false && (
                    <div className="text-red-400 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>La imagen no pudo cargarse desde esa URL. Verifique que sea pública y accesible.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950 flex items-center justify-between">
          <button
            id="btn-cancel-media-modal"
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs transition-colors"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2">
            {activeTab === 'upload' && (
              <button
                id="btn-apply-uploaded-file"
                type="button"
                disabled={!uploadedFile}
                onClick={handleConfirmUpload}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  uploadedFile
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Aplicar Archivo Seleccionado</span>
              </button>
            )}

            {activeTab === 'library' && (
              <button
                id="btn-apply-library-file"
                type="button"
                disabled={!selectedLibraryItem}
                onClick={() => handleConfirmLibrary()}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedLibraryItem
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Selección de Biblioteca</span>
              </button>
            )}

            {activeTab === 'url' && (
              <button
                id="btn-apply-url-file"
                type="button"
                disabled={!webUrl.trim()}
                onClick={handleConfirmUrl}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  webUrl.trim()
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Aplicar URL Web</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
