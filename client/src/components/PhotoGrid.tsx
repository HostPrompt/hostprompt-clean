import React from 'react';
import { Property } from '@shared/schema';

interface PropertyPhoto {
  id: string;
  url: string;
  isPrimary: boolean;
  name: string;
  tags?: string[];
  description?: string;
}

interface PhotoGridProps {
  property: Property;
  onSavePhotos?: (photos: PropertyPhoto[]) => Promise<void>;
}

export function PhotoGrid({ property, onSavePhotos }: PhotoGridProps) {
  // Parse photos from property
  const getPhotos = (): PropertyPhoto[] => {
    if (!property.photos) return [];
    
    try {
      if (typeof property.photos === 'string') {
        return JSON.parse(property.photos);
      } else if (Array.isArray(property.photos)) {
        return property.photos;
      }
    } catch (e) {
      console.error('Error parsing photos:', e);
    }
    return [];
  };

  const photos = getPhotos();

  if (photos.length === 0) {
    return (
      <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No photos available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo) => (
        <div 
          key={photo.id} 
          className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
        >
          <img 
            src={photo.url} 
            alt={photo.name || "Property photo"} 
            className="w-full h-full object-cover"
          />
          {photo.isPrimary && (
            <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
              Primary
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default PhotoGrid;