import React, { useState, useRef } from 'react';
import { usePropertyStore } from '@/store/propertyStore';
import { ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

/**
 * A very simple, isolated component for adding photos to properties
 */
export function SimplePhotoAdder({ propertyId }: { propertyId: number }) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { properties, updateProperty } = usePropertyStore();
  
  // Find the property
  const property = properties.find(p => p.id === propertyId);
  
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length || !property) {
      return;
    }
    
    setIsUploading(true);
    const files = Array.from(e.target.files);
    
    try {
      toast({
        title: "Processing photos",
        description: "Please wait while we save your photos..."
      });
      
      // Get existing photos
      let existingPhotos: any[] = [];
      if (property.photos) {
        try {
          if (typeof property.photos === 'string') {
            existingPhotos = JSON.parse(property.photos);
          } else if (Array.isArray(property.photos)) {
            existingPhotos = property.photos;
          }
        } catch (error) {
          console.error('Error parsing existing photos:', error);
        }
      }
      
      const newPhotos: any[] = [];
      
      for (const file of files) {
        // Create a data URL for the photo
        const reader = new FileReader();
        const photoUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        // Create a new photo object
        const newPhoto = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          url: photoUrl,
          name: file.name,
          isPrimary: existingPhotos.length === 0 && newPhotos.length === 0
        };
        
        newPhotos.push(newPhoto);
      }
      
      // Combine existing and new photos
      const allPhotos = [...existingPhotos, ...newPhotos];
      
      // Save to property
      await updateProperty(propertyId, {
        photos: JSON.stringify(allPhotos)
      });
      
      toast({
        title: "Photos saved",
        description: `Added ${newPhotos.length} photo${newPhotos.length !== 1 ? 's' : ''} to your property.`
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error saving photos:', error);
      toast({
        title: "Error saving photos",
        description: "There was a problem saving your photos.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        multiple
        accept="image/*"
        // No capture attribute - allows both camera and gallery selection
      />
      
      <Button 
        variant="outline" 
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full"
      >
        <ImagePlus className="h-4 w-4 mr-2" />
        {isUploading ? 'Uploading...' : 'Add More Photos'}
      </Button>
    </div>
  );
}