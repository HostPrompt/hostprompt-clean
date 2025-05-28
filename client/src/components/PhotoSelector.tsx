import { useState, useRef } from "react";
import { usePropertyStore } from "@/store/propertyStore";
import { createImagePreview } from "@/lib/utils";
import { ImageIcon, X, ImagePlus, Folders, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CameraCapture from "./CameraCapture";

interface PhotoSelectorProps {
  onImageSelected: (file: File, preview: string) => void;
  clearPhotoData: () => void;
  currentPreview: string | null;
}

export default function PhotoSelector({ 
  onImageSelected, 
  clearPhotoData, 
  currentPreview 
}: PhotoSelectorProps) {
  const { selectedProperty } = usePropertyStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload');
  const [showCamera, setShowCamera] = useState(false);

  // Function to handle file input change
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Validate file size and type before processing
    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 20MB.",
        variant: "destructive"
      });
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Compress the image and create a preview URL
      const { file: compressedFile, url: previewUrl } = await createImagePreview(file);
      
      // Call the parent component's handler
      onImageSelected(compressedFile, previewUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error processing image",
        description: "There was a problem with your image. Please try another.",
        variant: "destructive"
      });
    }
  };

  // Function to select a photo from the property library
  const selectLibraryPhoto = async (photoUrl: string, photoFile?: File) => {
    try {
      // For data URLs (from property photos), we can use them directly
      if (photoUrl.startsWith('data:')) {
        // Create a placeholder file with appropriate MIME type
        const mimeMatch = photoUrl.match(/^data:([^;]+);/);
        const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
        const file = new File([new Uint8Array(1)], 'property-photo.jpg', { type: mime });
        onImageSelected(file, photoUrl);
        return;
      }
      
      // If we have the actual file object, use it
      if (photoFile) {
        // Compress and create preview
        const { file: compressedFile, url: previewUrl } = await createImagePreview(photoFile);
        onImageSelected(compressedFile, previewUrl);
      } else {
        // Standard approach for fetching
        const response = await fetch(photoUrl);
        const blob = await response.blob();
        const fileName = photoUrl.split('/').pop() || 'library-photo.jpg';
        const file = new File([blob], fileName, { type: blob.type });
          
        // Compress and create preview
        const { file: compressedFile, url: previewUrl } = await createImagePreview(file);
        onImageSelected(compressedFile, previewUrl);
      }
    } catch (error) {
      console.error('Error processing library image:', error);
      toast({
        title: "Oops, that photo's being stubborn",
        description: "Let's try with a different one that's ready to shine!",
        variant: "destructive"
      });
    }
  };
  
  // Function to get property photos
  const getPropertyPhotos = () => {
    if (!selectedProperty?.photos) return [];
    
    try {
      if (typeof selectedProperty.photos === 'string') {
        return JSON.parse(selectedProperty.photos);
      } else if (Array.isArray(selectedProperty.photos)) {
        return selectedProperty.photos;
      }
    } catch (error) {
      console.error('Error parsing property photos:', error);
    }
    
    return [];
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5 mt-6">
      <h3 className="font-heading font-medium text-lg mb-3">Give us a photo to inspire your content</h3>
      <p className="text-sm text-neutral-600 mb-4">Show us what makes your place shine! We'll spot all those amazing details and work them into your story.</p>
      
      {/* Tabs for Upload/Library */}
      <div className="flex border-b border-neutral-200 mb-4">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'upload' 
              ? 'border-b-2 border-primary-500 text-primary-600' 
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <div className="flex items-center">
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload New
          </div>
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'library' 
              ? 'border-b-2 border-primary-500 text-primary-600' 
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <div className="flex items-center">
            <Folders className="h-4 w-4 mr-2" />
            Property Photos
          </div>
        </button>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handlePhotoUpload} 
        accept="image/*" 
        className="hidden"
      />
      
      {currentPreview ? (
        <div className="mb-4">
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={currentPreview} 
              alt="Preview" 
              className="w-full h-48 object-cover"
            />
            <button 
              onClick={() => {
                clearPhotoData();
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-neutral-100 transition-colors"
              aria-label="Remove photo"
            >
              <X className="h-5 w-5 text-neutral-700" />
            </button>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            We'll use the details in this photo to personalize your story
          </p>
        </div>
      ) : (
        <>
          {activeTab === 'upload' ? (
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
              <ImageIcon className="h-8 w-8 mx-auto text-neutral-400 mb-2" />
              <p className="text-sm font-medium text-neutral-700">
                Add a photo of your space
              </p>
              <p className="text-xs text-neutral-500 mt-1 mb-4">
                Large photos? No worries — we'll optimize them for you
              </p>
              
              <div className="mt-4">
                {/* Single unified upload button */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <button 
                    className="w-full py-3 px-4 bg-[#FF5C5C] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#e05151] transition-colors font-medium"
                  >
                    <ImagePlus className="h-4 w-4 text-white" />
                    <span>Upload Photo</span>
                  </button>
                  <p className="text-xs text-center text-neutral-500 mt-2">
                    Your device will ask whether to use camera or photo library
                  </p>
                </div>
              </div>
              
              {showCamera && (
                <CameraCapture
                  onCapture={(imageDataUrl) => {
                    // Convert data URL to File object
                    fetch(imageDataUrl)
                      .then(res => res.blob())
                      .then(blob => {
                        const file = new File([blob], `camera-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
                        onImageSelected(file, imageDataUrl);
                        setShowCamera(false);
                      })
                      .catch(err => {
                        console.error('Error converting data URL to file:', err);
                        toast({
                          title: "Error processing photo",
                          description: "There was a problem with your photo. Please try again.",
                          variant: "destructive"
                        });
                      });
                  }}
                  onClose={() => setShowCamera(false)}
                />
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {!selectedProperty ? (
                <div className="text-center py-6 px-4 border border-neutral-200 rounded-lg">
                  <p className="text-neutral-500 text-sm">
                    Please select a property first.
                  </p>
                </div>
              ) : (
                <>
                  {getPropertyPhotos().length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {selectedProperty.image && (
                        <div 
                          className="aspect-square rounded-lg overflow-hidden border border-neutral-200 hover:border-primary-400 transition-colors cursor-pointer"
                          onClick={() => selectLibraryPhoto(selectedProperty.image as string)}
                        >
                          <img 
                            src={selectedProperty.image as string} 
                            alt={`${selectedProperty.name} primary photo`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {getPropertyPhotos().map((photo: any, index: number) => (
                        <div 
                          key={`property-photo-${index}`}
                          className="aspect-square rounded-lg overflow-hidden border border-neutral-200 hover:border-primary-400 transition-colors cursor-pointer"
                          onClick={() => selectLibraryPhoto(photo.url || photo)}
                        >
                          <img 
                            src={photo.url || photo} 
                            alt={`Property photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 px-4 border border-neutral-200 rounded-lg">
                      <p className="text-neutral-500 text-sm">
                        No photos available for this property.
                      </p>
                      <p className="text-neutral-500 text-xs mt-1">
                        Add photos in the Property Profile section.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}