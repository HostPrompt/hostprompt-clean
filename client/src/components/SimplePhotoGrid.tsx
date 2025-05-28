import React from 'react';
import { TrashIcon, StarIcon } from 'lucide-react';

interface PropertyPhoto {
  id: string;
  url: string;
  isPrimary: boolean;
  name: string;
}

interface SimplePhotoGridProps {
  photos: PropertyPhoto[];
  onDeletePhoto?: (id: string) => void;
  onSetPrimary?: (id: string) => void;
}

export function SimplePhotoGrid({ photos, onDeletePhoto, onSetPrimary }: SimplePhotoGridProps) {
  if (!photos || photos.length === 0) {
    return (
      <div className="text-center p-8 border border-neutral-200 rounded-lg bg-white">
        <p className="text-neutral-500">No photos available.</p>
        <p className="text-sm text-neutral-400 mt-1">
          Add photos using the uploader below.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div 
          key={photo.id} 
          className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200 group"
        >
          <img 
            src={photo.url} 
            alt={photo.name} 
            className="w-full h-full object-cover"
          />
          
          {photo.isPrimary && (
            <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
              Primary
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2">
            <p className="text-xs truncate text-center">
              {photo.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}