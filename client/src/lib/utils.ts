import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import imageCompression from 'browser-image-compression';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Compresses an image file for upload
 * @param file - The image file to compress
 * @returns A Promise that resolves to the compressed file
 */
export async function compressImage(file: File): Promise<File> {
  // Skip compression for already small files (under 300KB)
  if (file.size <= 300 * 1024) {
    return file;
  }
  
  // Compression options
  const options = {
    maxSizeMB: 0.5, // Target compression to 500KB
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    fileType: file.type.includes('png') ? 'image/png' : 'image/jpeg'
  };
  
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Error compressing image:', error);
    // If compression fails, return the original file
    return file;
  }
}

/**
 * Creates a URL for an image file with optional compression
 * @param file - The image file
 * @param compress - Whether to compress the image (default: true)
 * @returns A Promise that resolves to an object with the compressed file and URL
 */
export async function createImagePreview(file: File, compress = true): Promise<{
  file: File;
  url: string;
}> {
  try {
    // Check if file is a valid image to prevent Safari issues
    if (!file.type.startsWith('image/')) {
      throw new Error('Not a valid image file');
    }
    
    // Detect Safari browser
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Compress the image if requested
    const processedFile = compress ? await compressImage(file) : file;
    
    // Create object URL for preview
    const previewUrl = URL.createObjectURL(processedFile);
    
    // For Safari, ensure the image has loaded before returning
    if (isSafari) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            file: processedFile,
            url: previewUrl
          });
        };
        img.onerror = () => {
          console.warn('Safari had trouble with image preview, using fallback');
          resolve({
            file: processedFile,
            url: previewUrl
          });
        };
        img.src = previewUrl;
      });
    }
    
    return {
      file: processedFile,
      url: previewUrl
    };
  } catch (error) {
    console.error('Error creating image preview:', error);
    // Fallback to uncompressed version
    return {
      file,
      url: URL.createObjectURL(file)
    };
  }
}
