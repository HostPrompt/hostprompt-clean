// A dedicated component that manages photos independently
import { useState, useEffect } from 'react';
import { Property } from '@shared/schema';
import { usePropertyStore } from '@/store/propertyStore';
import { useToast } from '@/hooks/use-toast';

interface PropertyPhoto {
  id: string;
  url: string;
  isPrimary: boolean;
  name: string;
  tags?: string[];
  description?: string;
}

export function usePropertyPhotos(propertyId: number) {
  const { properties, updateProperty } = usePropertyStore();
  const { toast } = useToast();
  const [photos, setPhotos] = useState<PropertyPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Find the current property
  const property = properties.find(p => p.id === propertyId);
  
  // Load photos when property changes
  useEffect(() => {
    if (property) {
      try {
        if (typeof property.photos === 'string' && property.photos) {
          const parsedPhotos = JSON.parse(property.photos);
          if (Array.isArray(parsedPhotos)) {
            setPhotos(parsedPhotos);
            return;
          }
        }
        // If we get here, either photos is not a string or parsing failed
        setPhotos([]);
      } catch (error) {
        console.error('Error parsing photos:', error);
        setPhotos([]);
      }
    } else {
      setPhotos([]);
    }
  }, [property]);
  
  // Save photos to the database
  const savePhotos = async (newPhotos: PropertyPhoto[]) => {
    if (!property) return false;
    
    setLoading(true);
    try {
      // Update local state first
      setPhotos(newPhotos);
      
      // Save to database
      await updateProperty(propertyId, {
        photos: JSON.stringify(newPhotos)
      });
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error saving photos:', error);
      toast({
        title: 'Error Saving Photos',
        description: 'There was a problem saving your photos. Try again later.',
        variant: 'destructive',
      });
      setLoading(false);
      return false;
    }
  };
  
  // Add new photos to the library
  const addPhotos = async (newPhotos: PropertyPhoto[]) => {
    const updatedPhotos = [...photos, ...newPhotos];
    return savePhotos(updatedPhotos);
  };
  
  // Remove a photo from the library
  const removePhoto = async (photoId: string) => {
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    return savePhotos(updatedPhotos);
  };
  
  return {
    photos,
    loading,
    addPhotos,
    removePhoto,
    savePhotos
  };
}