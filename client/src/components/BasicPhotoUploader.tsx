import React, { useState, useRef } from 'react';
import { PlusCircle, ImagePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePropertyStore } from '@/store/propertyStore';

// A very simple photo uploader component that just does one thing:
// Upload photos and save them to a property
export function BasicPhotoUploader({ propertyId }: { propertyId: number }) {
  const { toast } = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const { properties, updateProperty, selectProperty } = usePropertyStore();
  const [isUploading, setIsUploading] = useState(false);
  
  // Find the current property
  const property = properties.find(p => p.id === propertyId);
  
  // Only show if we have a property
  if (!property) return null;
  
  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    toast({
      title: "Processing photos",
      description: "Please wait while we save your photos..."
    });
    
    try {
      // Get existing photos
      let existingPhotos = [];
      if (property.photos) {
        try {
          existingPhotos = JSON.parse(property.photos as string);
        } catch (err) {
          console.error("Error parsing photos:", err);
        }
      }
      
      // Process each file
      const newPhotos = [];
      for (const file of Array.from(e.target.files)) {
        // Create a data URL
        const reader = new FileReader();
        const photoUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        // Create a basic photo object
        newPhotos.push({
          id: `photo-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
          url: photoUrl,
          name: file.name,
          isPrimary: existingPhotos.length === 0 && newPhotos.length === 0
        });
      }
      
      // Combine photos
      const allPhotos = [...existingPhotos, ...newPhotos];
      
      // Save to the database
      await updateProperty(propertyId, {
        photos: JSON.stringify(allPhotos)
      });
      
      // Update property in UI - refresh
      const updatedProperty = properties.find(p => p.id === propertyId);
      if (updatedProperty) {
        selectProperty(updatedProperty);
      }
      
      toast({
        title: "Photos saved",
        description: `Added ${newPhotos.length} photo${newPhotos.length !== 1 ? 's' : ''}`
      });
    } catch (error) {
      console.error("Error saving photos:", error);
      toast({
        title: "Error",
        description: "Failed to save photos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInput.current) fileInput.current.value = '';
    }
  };
  
  return (
    <div>
      <input
        type="file"
        ref={fileInput}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
        // No capture attribute - allows both camera and gallery selection
      />
      
      <button
        onClick={() => fileInput.current?.click()}
        disabled={isUploading}
        className="px-3 py-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 flex items-center gap-2 text-sm"
      >
        <ImagePlus className="h-4 w-4 text-neutral-600" />
        {isUploading ? 'Uploading...' : 'Add Photos'}
      </button>
    </div>
  );
}

export default BasicPhotoUploader;