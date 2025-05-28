import { useState, useRef } from 'react';
import { ImagePlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@shared/schema';
import { usePropertyStore } from '@/store/propertyStore';

interface SimplePhotoUploaderProps {
  propertyId: number;
  onSuccess?: () => void;
}

// A simplified photo uploader that just saves photos to a property
export function SimplePhotoUploader({ propertyId, onSuccess }: SimplePhotoUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateProperty, properties } = usePropertyStore();
  const [isUploading, setIsUploading] = useState(false);
  
  // Get the current property
  const property = properties.find(p => p.id === propertyId);
  
  // Handle basic photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !property) return;
    
    setIsUploading(true);
    
    try {
      // Parse existing photos if any
      let existingPhotos = [];
      if (property.photos) {
        try {
          existingPhotos = JSON.parse(property.photos as string);
        } catch (err) {
          console.error('Error parsing existing photos:', err);
          existingPhotos = [];
        }
      }
      
      // Process new files
      const files = Array.from(e.target.files);
      const newPhotos = [];
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        
        // Create a data URL from the file
        const reader = new FileReader();
        const photoUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        // Create a simple photo object
        newPhotos.push({
          id: `photo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          url: photoUrl,
          name: file.name,
          isPrimary: existingPhotos.length === 0 && newPhotos.length === 0
        });
      }
      
      if (newPhotos.length === 0) {
        toast({
          title: 'No photos added',
          description: 'No valid images were found in your selection.',
          variant: 'destructive'
        });
        setIsUploading(false);
        return;
      }
      
      // Combine existing and new photos
      const allPhotos = [...existingPhotos, ...newPhotos];
      
      // Save photos to the property
      try {
        await updateProperty(propertyId, {
          photos: JSON.stringify(allPhotos)
        });
        
        toast({
          title: 'Photos saved',
          description: `Added ${newPhotos.length} photo${newPhotos.length !== 1 ? 's' : ''} to your property.`
        });
        
        // Call success callback if provided
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Error saving photos:', error);
        toast({
          title: 'Error saving photos',
          description: 'Photos may not persist between sessions.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      toast({
        title: 'Error processing photos',
        description: 'Please try again with fewer or smaller photos.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  return (
    <div className="my-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        className="hidden"
        multiple
        accept="image/*"
        // No capture attribute - allows both camera and gallery selection
      />
      
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 hover:bg-neutral-50 transition-colors"
      >
        <ImagePlus className="h-5 w-5 text-neutral-500" />
        <span className="font-medium text-neutral-700">
          {isUploading ? 'Uploading photos...' : 'Add Photos'}
        </span>
      </button>
    </div>
  );
}

export default SimplePhotoUploader;