import React, { useState, useRef } from 'react';
import { usePropertyStore } from '@/store/propertyStore';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { ImagePlus, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function SimplePhotoPage({
  mobileMenuOpen,
  setMobileMenuOpen
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState("property");
  const { properties, selectedProperty, updateProperty } = usePropertyStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<any[]>([]);
  
  // Get saved photos from selected property
  const getSavedPhotos = () => {
    if (!selectedProperty?.photos) return [];
    
    try {
      if (typeof selectedProperty.photos === 'string') {
        return JSON.parse(selectedProperty.photos);
      }
    } catch (error) {
      console.error('Error parsing photos:', error);
    }
    return [];
  };
  
  const savedPhotos = getSavedPhotos();
  
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length || !selectedProperty) {
      return;
    }
    
    setIsUploading(true);
    const files = Array.from(e.target.files);
    const newPhotos = [];
    
    try {
      toast({
        title: "Processing photos",
        description: "Please wait while we save your photos..."
      });
      
      for (const file of files) {
        // Create simple data URL
        const reader = new FileReader();
        const photoUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        // Create photo object
        const newPhoto = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: photoUrl,
          name: file.name,
          isPrimary: savedPhotos.length === 0 && newPhotos.length === 0
        };
        
        newPhotos.push(newPhoto);
        setUploadedPhotos(prev => [...prev, newPhoto]);
      }
      
      // Combine with existing photos
      const allPhotos = [...savedPhotos, ...newPhotos];
      
      // Save to property
      await updateProperty(selectedProperty.id, {
        photos: JSON.stringify(allPhotos)
      });
      
      toast({
        title: "Photos saved",
        description: `Added ${newPhotos.length} photo${newPhotos.length !== 1 ? 's' : ''} to your property.`
      });
    } catch (error) {
      console.error('Error saving photos:', error);
      toast({
        title: "Error saving photos",
        description: "There was a problem saving your photos.",
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
    <div className="min-h-screen flex flex-col bg-neutral-50 pb-16 md:pb-0">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/app/property" className="inline-flex items-center text-neutral-600 hover:text-neutral-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Profile
          </Link>
          
          <h1 className="text-2xl font-semibold mt-4 mb-2">Photo Library</h1>
          <p className="text-neutral-600 mb-6">
            Add photos to your property library. These photos will be saved and available in the Content Generator.
          </p>
          
          {/* Property selector */}
          {selectedProperty ? (
            <div className="p-4 bg-white rounded-lg shadow-sm mb-6">
              <h2 className="font-medium mb-1">
                Selected Property: {selectedProperty.name}
              </h2>
              <p className="text-sm text-neutral-600">
                Photos will be added to this property.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-lg shadow-sm mb-6">
              <p className="text-neutral-600">
                Please select a property from the Property Profile page first.
              </p>
            </div>
          )}
          
          {/* Photo uploader */}
          {selectedProperty && (
            <div className="mb-8">
              <div className="p-6 border-2 border-dashed border-neutral-300 rounded-lg bg-neutral-50 text-center">
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  multiple
                  accept="image/*"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  <ImagePlus className="h-5 w-5 mr-2" />
                  {isUploading ? 'Uploading...' : 'Add Photos'}
                </button>
                
                <p className="mt-2 text-sm text-neutral-500">
                  Photos will be saved to your property and accessible in Content Generator.
                </p>
              </div>
            </div>
          )}
          
          {/* Photo grid */}
          <div className="mt-6">
            <h2 className="text-xl font-medium mb-4">Property Photos</h2>
            
            {savedPhotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {savedPhotos.map((photo: any, index: number) => (
                  <div key={photo.id || index} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200">
                    <img 
                      src={photo.url} 
                      alt={photo.name || `Photo ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    
                    {photo.isPrimary && (
                      <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                        Primary
                      </div>
                    )}
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2">
                      <p className="text-xs truncate text-center">
                        {photo.name || `Photo ${index + 1}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border border-neutral-200 rounded-lg bg-white">
                <p className="text-neutral-500">No photos available.</p>
                <p className="text-sm text-neutral-400 mt-1">
                  Add photos using the uploader above.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}