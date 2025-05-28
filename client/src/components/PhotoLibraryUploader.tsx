import React, { useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePropertyStore } from '@/store/propertyStore';

interface PhotoLibraryUploaderProps {
  propertyId: number;
}

/**
 * A simple, focused component just for uploading photos to a property
 * This is designed to work independently of other components
 */
export function PhotoLibraryUploader({ propertyId }: PhotoLibraryUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { properties, updateProperty, selectProperty } = usePropertyStore();
  const [isUploading, setIsUploading] = useState(false);
  
  // Get the current property
  const property = properties.find(p => p.id === propertyId);
  if (!property) return null;
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      toast({
        title: "Processing photos...",
        description: "Please wait while we save your photos."
      });
      
      // Parse existing photos if available
      let existingPhotos = [];
      if (property.photos) {
        try {
          existingPhotos = JSON.parse(property.photos as string);
        } catch (error) {
          console.error('Error parsing photos:', error);
        }
      }
      
      // Process each file
      const files = Array.from(e.target.files);
      const newPhotos = [];
      
      for (const file of files) {
        // Create a data URL from the file
        const reader = new FileReader();
        const photoUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        // Add the photo to our array
        newPhotos.push({
          id: `photo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          url: photoUrl,
          name: file.name,
          isPrimary: existingPhotos.length === 0 && newPhotos.length === 0,
          tags: [],
          description: ""
        });
      }
      
      // Combine with existing photos
      const allPhotos = [...existingPhotos, ...newPhotos];
      
      // Save to the database
      await updateProperty(propertyId, {
        photos: JSON.stringify(allPhotos)
      });
      
      // Find the updated property and select it to refresh the UI
      const updatedProperty = properties.find(p => p.id === propertyId);
      if (updatedProperty) {
        selectProperty(updatedProperty);
      }
      
      toast({
        title: "Photos saved successfully",
        description: `Added ${newPhotos.length} photo${newPhotos.length !== 1 ? 's' : ''} to your library.`
      });
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Error saving photos",
        description: "There was a problem saving your photos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  return (
    <div className="mb-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*"
      />
      
      <button
        onClick={handleUploadClick}
        disabled={isUploading}
        className="w-full py-3 flex justify-center items-center gap-2 border-2 border-dashed border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
      >
        <ImagePlus className="w-5 h-5 text-neutral-700" />
        <span className="font-medium text-neutral-800">
          {isUploading ? 'Uploading photos...' : 'Add photos to library'}
        </span>
      </button>
      
      <p className="text-xs text-neutral-500 mt-1 text-center">
        Photos added here will be available in Content Generator
      </p>
    </div>
  );
}

export default PhotoLibraryUploader;