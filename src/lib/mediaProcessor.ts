/**
 * Utility functions for processing local images, videos, and normalizing URLs.
 */

export interface ProcessedMediaFile {
  dataUrl: string;
  name: string;
  size: number;
  sizeFormatted: string;
  type: string;
  isImage: boolean;
  isVideo: boolean;
  dimensions?: { width: number; height: number };
}

/**
 * Format bytes to readable string (e.g. "1.2 MB", "450 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Normalizes video URLs to ensure proper embed playback (YouTube, Vimeo, or direct MP4).
 */
export function normalizeVideoUrl(rawUrl: string): string {
  const clean = rawUrl.trim();
  if (!clean) return '';

  // YouTube embed already: https://www.youtube.com/embed/VIDEO_ID
  const ytEmbedMatch = clean.match(/(?:youtube(?:-nocookie)?\.com\/embed\/)([a-zA-Z0-9_-]+)/i);
  if (ytEmbedMatch && ytEmbedMatch[1]) {
    return `https://www.youtube.com/embed/${ytEmbedMatch[1]}`;
  }

  // YouTube watch link: https://www.youtube.com/watch?v=VIDEO_ID
  const ytWatchMatch = clean.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|shorts\/))([a-zA-Z0-9_-]+)/i);
  if (ytWatchMatch && ytWatchMatch[1]) {
    return `https://www.youtube.com/embed/${ytWatchMatch[1]}`;
  }

  // YouTube short link: https://youtu.be/VIDEO_ID
  const ytShortMatch = clean.match(/youtu\.be\/([a-zA-Z0-9_-]+)/i);
  if (ytShortMatch && ytShortMatch[1]) {
    return `https://www.youtube.com/embed/${ytShortMatch[1]}`;
  }

  // Vimeo link: https://vimeo.com/VIDEO_ID or player.vimeo.com/video/VIDEO_ID
  const vimeoMatch = clean.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return clean;
}

/**
 * Identifies the origin of a media URL/path.
 */
export function detectMediaOrigin(url: string): 'local' | 'project' | 'web' | 'empty' {
  if (!url || !url.trim()) return 'empty';
  const clean = url.trim();
  if (clean.startsWith('data:') || clean.startsWith('blob:')) return 'local';
  if (clean.startsWith('/api/images') || clean.startsWith('/images/')) return 'project';
  if (clean.startsWith('http://') || clean.startsWith('https://')) return 'web';
  return 'web';
}

/**
 * Reads a local File from disk, compresses images if larger than threshold, and returns a processed media object.
 */
export async function readAndProcessMediaFile(
  file: File,
  maxDimension = 1920,
  maxWeightKb = 1500
): Promise<ProcessedMediaFile> {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('No se pudo leer el archivo seleccionado.'));
    };

    reader.onload = () => {
      const rawDataUrl = reader.result as string;

      // If it's not an image or is SVG, return directly without canvas compression
      if (!isImage || file.type.includes('svg') || file.size < maxWeightKb * 1024) {
        return resolve({
          dataUrl: rawDataUrl,
          name: file.name,
          size: file.size,
          sizeFormatted: formatFileSize(file.size),
          type: file.type,
          isImage,
          isVideo,
        });
      }

      // Compress bitmap images using Canvas to keep app performant
      const img = new Image();
      img.onerror = () => {
        // Fallback to uncompressed
        resolve({
          dataUrl: rawDataUrl,
          name: file.name,
          size: file.size,
          sizeFormatted: formatFileSize(file.size),
          type: file.type,
          isImage,
          isVideo,
        });
      };

      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            return resolve({
              dataUrl: rawDataUrl,
              name: file.name,
              size: file.size,
              sizeFormatted: formatFileSize(file.size),
              type: file.type,
              isImage,
              isVideo,
              dimensions: { width: img.width, height: img.height },
            });
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Try exporting as webp, fallback to jpeg
          let compressedDataUrl = canvas.toDataURL('image/webp', 0.88);
          if (!compressedDataUrl.startsWith('data:image/webp')) {
            compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          }

          // Calculate estimated size from base64
          const approxBytes = Math.round((compressedDataUrl.length * 3) / 4);

          resolve({
            dataUrl: compressedDataUrl,
            name: file.name,
            size: approxBytes,
            sizeFormatted: formatFileSize(approxBytes),
            type: compressedDataUrl.startsWith('data:image/webp') ? 'image/webp' : 'image/jpeg',
            isImage: true,
            isVideo: false,
            dimensions: { width, height },
          });
        } catch {
          resolve({
            dataUrl: rawDataUrl,
            name: file.name,
            size: file.size,
            sizeFormatted: formatFileSize(file.size),
            type: file.type,
            isImage,
            isVideo,
          });
        }
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}
