import React, { useState, useEffect, useRef } from "react";
import { usePropertyStore } from "@/store/propertyStore";
import { PlusIcon, HomeIcon, ImageIcon, MessageSquareQuote, UploadCloud, Trash2, Tag, Volume2 } from "lucide-react";
import SavedHashtagsEditor from "@/components/SavedHashtagsEditor";
import { createImagePreview } from "@/lib/utils";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AddPropertyModal from "@/components/AddPropertyModal";
import BrandVoiceModal from "@/components/BrandVoiceModal";
import DeletePropertyModal from "@/components/DeletePropertyModal";

interface PropertyProfileProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function PropertyProfile({ mobileMenuOpen, setMobileMenuOpen }: PropertyProfileProps) {
  const [activeTab, setActiveTab] = useState("property");
  const { properties, selectedProperty, selectProperty, updateProperty, deleteProperty } = usePropertyStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [amenitiesList, setAmenitiesList] = useState("");
  const [hostSignature, setHostSignature] = useState("");
  const [isAddPropertyModalOpen, setAddPropertyModalOpen] = useState(false);
  const [isBrandVoiceModalOpen, setIsBrandVoiceModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedProperty) {
      setName(selectedProperty.name || "");
      setDescription(selectedProperty.description || "");
      setLocation(selectedProperty.location || "");
      setAmenitiesList(selectedProperty.amenities ? selectedProperty.amenities.join(", ") : "");
      setHostSignature(selectedProperty.hostSignature || "");
    }
  }, [selectedProperty]);

  const handleSelectProperty = (property: any) => {
    selectProperty(property);
    setIsEditing(false);
  };
  
  const handleDeleteConfirm = async () => {
    if (propertyToDelete) {
      try {
        await deleteProperty(propertyToDelete);
        setIsDeleteDialogOpen(false);
        setPropertyToDelete(null);
        toast({
          title: "Property deleted",
          description: "The property has been successfully deleted."
        });
      } catch (error) {
        console.error('Error deleting property:', error);
        toast({
          title: "Error deleting property",
          description: "There was a problem deleting the property. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  const openDeleteDialog = (propertyId: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent selecting the property
    
    // Extra safeguard to only open dialog for real properties (not placeholders)
    const propertyExists = properties.some(p => p.id === propertyId);
    if (propertyExists && propertyId) {
      setPropertyToDelete(propertyId);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleSaveProperty = async () => {
    if (!selectedProperty) return;

    try {
      // Convert amenities from comma-separated string to array
      const amenitiesArray = amenitiesList
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "");

      await updateProperty(selectedProperty.id, {
        name,
        description,
        location,
        amenities: amenitiesArray,
        hostSignature,
      });

      setIsEditing(false);
      toast({
        title: "Property updated",
        description: "Your property details have been saved."
      });
    } catch (error) {
      toast({
        title: "Error updating property",
        description: "There was a problem saving your property details.",
        variant: "destructive"
      });
    }
  };

  const handleAddNewProperty = () => {
    setAddPropertyModalOpen(true);
  };
  
  // Handle property photo upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedProperty) {
      return;
    }
    
    const file = e.target.files[0];
    setIsUploading(true);
    
    try {
      // Compress and create preview URL
      const { file: compressedFile, url: imageUrl } = await createImagePreview(file);
      
      // Update property with new image
      const updatedProperty = await updateProperty(selectedProperty.id, {
        image: imageUrl
      });
      
      // Force refresh of selected property to show the new image
      // This ensures the UI updates properly with the new image
      if (updatedProperty) {
        selectProperty(updatedProperty);
      }
      
      toast({
        title: "Photo updated",
        description: "Your property photo has been updated successfully."
      });
    } catch (error) {
      console.error('Error uploading property photo:', error);
      toast({
        title: "Error uploading photo",
        description: "There was a problem uploading your photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Function to safely get property photos
  const getPropertyPhotos = (property: any) => {
    if (!property?.photos) return [];
    
    try {
      if (typeof property.photos === 'string') {
        return JSON.parse(property.photos);
      } else if (Array.isArray(property.photos)) {
        return property.photos;
      }
    } catch (error) {
      console.error('Error parsing photos:', error);
    }
    
    return [];
  };

  const getPrimaryPhoto = (property: any) => {
    const photos = getPropertyPhotos(property);
    return photos.find((p: any) => p.isPrimary) || photos[0];
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 pb-16 md:pb-0">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {/* Property Selector */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-4">Property Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className={`border rounded-xl overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${
                  selectedProperty?.id === property.id
                    ? "ring-2 ring-primary-500"
                    : ""
                }`}
                onClick={() => handleSelectProperty(property)}
              >
                <div className="aspect-[4/3] bg-neutral-100 relative">
                  {(() => {
                    // First check if there's a property image (from the new upload feature)
                    if (property.image) {
                      return (
                        <img
                          src={property.image}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                      );
                    }
                    // Fallback to checking for a primary photo in photos array
                    else if (property.photos) {
                      try {
                        const primaryPhoto = getPrimaryPhoto(property);
                        if (primaryPhoto?.url) {
                          return (
                            <img
                              src={primaryPhoto.url}
                              alt={property.name}
                              className="w-full h-full object-cover"
                            />
                          );
                        }
                      } catch (error) {
                        console.error('Error rendering primary photo:', error);
                      }
                    }
                    
                    // Default fallback if no image is found
                    return (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                        <HomeIcon className="h-8 w-8 text-neutral-400" />
                      </div>
                    );
                  })()}
                  
                  {/* Delete Button */}
                  <button
                    onClick={(e) => openDeleteDialog(property.id, e)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1.5 rounded-full transition-colors"
                    aria-label="Delete property"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-3">
                  <div className="font-medium line-clamp-1">{property.name}</div>
                  <div className="text-sm text-neutral-500 line-clamp-1">
                    {property.location || "No location"}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add New Property Button */}
            <div
              className="border border-dashed rounded-xl overflow-hidden cursor-pointer transition-shadow hover:shadow-md bg-white"
              onClick={handleAddNewProperty}
            >
              <div className="aspect-[4/3] flex flex-col items-center justify-center text-neutral-400 hover:text-neutral-600">
                <PlusIcon className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Add Property</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Property Details */}
        {selectedProperty ? (
          <div className="space-y-8">
            {isEditing ? (
              <div className="bg-white border border-neutral-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Edit Property Details</h2>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProperty}>Save Changes</Button>
                  </div>
                </div>
                
                {/* Property Photo Upload */}
                <div className="mb-6 pb-6 border-b border-neutral-200">
                  <Label className="mb-2 block flex items-center">
                    Property Photo
                    <div className="relative ml-1 group">
                      <span className="cursor-help text-neutral-400 hover:text-neutral-600 touch-action-manipulation p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                          <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                      </span>
                      {/* Desktop tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 rounded bg-black text-white text-xs px-3 py-2 hidden group-hover:block md:group-hover:block z-50 shadow-lg">
                        High-quality photos help create more relevant content that highlights what's actually in your property. Visual elements from your photos will be incorporated into your messaging for more accurate descriptions.
                      </div>
                      {/* Mobile tooltip */}
                      <div className="fixed inset-0 bg-black/50 hidden group-active:block md:group-active:hidden z-40" onClick={(e) => e.stopPropagation()}></div>
                      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-xs rounded-lg bg-white text-black text-sm p-4 hidden group-active:block md:group-active:hidden z-50 shadow-xl mx-auto">
                        <p className="mb-2 font-medium">Property Photos</p>
                        <p>High-quality photos help create more relevant content that highlights what's actually in your property. Visual elements from your photos will be incorporated into your messaging for more accurate descriptions.</p>
                        <div className="mt-3 text-center">
                          <button 
                            type="button" 
                            className="text-xs bg-[#FF5C5C] text-white px-4 py-2 rounded-md"
                            onClick={(e) => {e.stopPropagation(); (e.target as HTMLElement).parentElement?.parentElement?.classList.remove('group-active:block');}}
                          >
                            Got it
                          </button>
                        </div>
                      </div>
                    </div>
                  </Label>
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-32 bg-neutral-100 rounded-md overflow-hidden border border-neutral-200 flex items-center justify-center">
                      {selectedProperty.image ? (
                        <img 
                          src={selectedProperty.image} 
                          alt={selectedProperty.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <HomeIcon className="h-8 w-8 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <span className="animate-spin mr-2">◌</span> 
                            Uploading...
                          </>
                        ) : (
                          <>
                            <UploadCloud className="h-4 w-4 mr-1" /> 
                            Change Photo
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-neutral-500 mt-2">
                        Recommended: Square image, at least 500x500px
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center">
                      Property Name
                      <div className="relative ml-1 group">
                        <span className="cursor-help text-neutral-400 hover:text-neutral-600 touch-action-manipulation p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </span>
                        {/* Desktop tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 rounded bg-black text-white text-xs px-3 py-2 hidden group-hover:block md:group-hover:block z-50 shadow-lg">
                          A memorable, descriptive name helps make your property stand out. This creates a foundation for personalized, engaging content that feels authentic.
                        </div>
                        {/* Mobile tooltip */}
                        <div className="fixed inset-0 bg-black/50 hidden group-active:block md:group-active:hidden z-40" onClick={(e) => e.stopPropagation()}></div>
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-xs rounded-lg bg-white text-black text-sm p-4 hidden group-active:block md:group-active:hidden z-50 shadow-xl mx-auto">
                          <p className="mb-2 font-medium">Property Name</p>
                          <p>A memorable, descriptive name helps make your property stand out. This creates a foundation for personalized, engaging content that feels authentic.</p>
                          <div className="mt-3 text-center">
                            <button 
                              type="button" 
                              className="text-xs bg-[#FF5C5C] text-white px-4 py-2 rounded-md"
                              onClick={(e) => {e.stopPropagation(); (e.target as HTMLElement).parentElement?.parentElement?.classList.remove('group-active:block');}}
                            >
                              Got it
                            </button>
                          </div>
                        </div>
                      </div>
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter property name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location" className="flex items-center">
                      Location
                      <div className="relative ml-1 group">
                        <span className="cursor-help text-neutral-400 hover:text-neutral-600 touch-action-manipulation p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </span>
                        {/* Desktop tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 rounded bg-black text-white text-xs px-3 py-2 hidden group-hover:block md:group-hover:block z-50 shadow-lg">
                          Location details help generate content that highlights your area's unique appeal. Including this information allows for local attractions and regional context to create targeted listings that resonate with potential guests.
                        </div>
                        {/* Mobile tooltip */}
                        <div className="fixed inset-0 bg-black/50 hidden group-active:block md:group-active:hidden z-40" onClick={(e) => e.stopPropagation()}></div>
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-xs rounded-lg bg-white text-black text-sm p-4 hidden group-active:block md:group-active:hidden z-50 shadow-xl mx-auto">
                          <p className="mb-2 font-medium">Location Details</p>
                          <p>Location details help generate content that highlights your area's unique appeal. Including this information allows for local attractions and regional context to create targeted listings that resonate with potential guests.</p>
                          <div className="mt-3 text-center">
                            <button 
                              type="button" 
                              className="text-xs bg-[#FF5C5C] text-white px-4 py-2 rounded-md"
                              onClick={(e) => {e.stopPropagation(); (e.target as HTMLElement).parentElement?.parentElement?.classList.remove('group-active:block');}}
                            >
                              Got it
                            </button>
                          </div>
                        </div>
                      </div>
                    </Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Miami, FL"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="flex items-center">
                      Description
                      <div className="relative ml-1 group">
                        <span className="cursor-help text-neutral-400 hover:text-neutral-600 touch-action-manipulation p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </span>
                        {/* Desktop tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 rounded bg-black text-white text-xs px-3 py-2 hidden group-hover:block md:group-hover:block z-50 shadow-lg">
                          Detailed descriptions provide rich material for engaging listings. Being specific about your property's unique features and character creates more personalized, compelling content.
                        </div>
                        {/* Mobile tooltip */}
                        <div className="fixed inset-0 bg-black/50 hidden group-active:block md:group-active:hidden z-40" onClick={(e) => e.stopPropagation()}></div>
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-xs rounded-lg bg-white text-black text-sm p-4 hidden group-active:block md:group-active:hidden z-50 shadow-xl mx-auto">
                          <p className="mb-2 font-medium">Property Description</p>
                          <p>Detailed descriptions provide rich material for engaging listings. Being specific about your property's unique features and character creates more personalized, compelling content.</p>
                          <div className="mt-3 text-center">
                            <button 
                              type="button" 
                              className="text-xs bg-[#FF5C5C] text-white px-4 py-2 rounded-md"
                              onClick={(e) => {e.stopPropagation(); (e.target as HTMLElement).parentElement?.parentElement?.classList.remove('group-active:block');}}
                            >
                              Got it
                            </button>
                          </div>
                        </div>
                      </div>
                    </Label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your property"
                      className="w-full px-3 py-2 border rounded-md border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="amenities" className="flex items-center">
                      Amenities
                      <div className="relative ml-1 group">
                        <span className="cursor-help text-neutral-400 hover:text-neutral-600 touch-action-manipulation p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </span>
                        {/* Desktop tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 rounded bg-black text-white text-xs px-3 py-2 hidden group-hover:block md:group-hover:block z-50 shadow-lg">
                          Amenities are key selling points that help generate more specific, targeted content. Listing these features creates compelling property descriptions that showcase what makes your space special.
                        </div>
                        {/* Mobile tooltip */}
                        <div className="fixed inset-0 bg-black/50 hidden group-active:block md:group-active:hidden z-40" onClick={(e) => e.stopPropagation()}></div>
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-xs rounded-lg bg-white text-black text-sm p-4 hidden group-active:block md:group-active:hidden z-50 shadow-xl mx-auto">
                          <p className="mb-2 font-medium">Property Amenities</p>
                          <p>Amenities are key selling points that help generate more specific, targeted content. Listing these features creates compelling property descriptions that showcase what makes your space special.</p>
                          <div className="mt-3 text-center">
                            <button 
                              type="button" 
                              className="text-xs bg-[#FF5C5C] text-white px-4 py-2 rounded-md"
                              onClick={(e) => {e.stopPropagation(); (e.target as HTMLElement).parentElement?.parentElement?.classList.remove('group-active:block');}}
                            >
                              Got it
                            </button>
                          </div>
                        </div>
                      </div>
                    </Label>
                    <textarea
                      id="amenities"
                      value={amenitiesList}
                      onChange={(e) => setAmenitiesList(e.target.value)}
                      placeholder="List amenities, separated by commas"
                      className="w-full px-3 py-2 border rounded-md border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hostSignature" className="flex items-center">
                      Host's Name or Signature
                      <div className="relative ml-1 group">
                        <span className="cursor-help text-neutral-400 hover:text-neutral-600 touch-action-manipulation p-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                          </svg>
                        </span>
                        {/* Desktop tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 rounded bg-black text-white text-xs px-3 py-2 hidden group-hover:block md:group-hover:block z-50 shadow-lg">
                          Add your name(s) or preferred sign-off (e.g. "Tim", "Tim & Bec", "Warmly, Tim & Bec", "Your hosts, T + B"). This adds a personal touch to welcome messages, house rules, and guest re-engagement. If left blank, we'll skip the sign-off.
                        </div>
                        {/* Mobile tooltip */}
                        <div className="fixed inset-0 bg-black/50 hidden group-active:block md:group-active:hidden z-40" onClick={(e) => e.stopPropagation()}></div>
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-xs rounded-lg bg-white text-black text-sm p-4 hidden group-active:block md:group-active:hidden z-50 shadow-xl mx-auto">
                          <p className="mb-2 font-medium">Host's Name or Signature</p>
                          <p>Add your name(s) or preferred sign-off (e.g. "Tim", "Tim & Bec", "Warmly, Tim & Bec", "Your hosts, T + B"). This adds a personal touch to welcome messages, house rules, and guest re-engagement. If left blank, we'll skip the sign-off.</p>
                          <div className="mt-3 text-center">
                            <button 
                              type="button" 
                              className="text-xs bg-[#FF5C5C] text-white px-4 py-2 rounded-md"
                              onClick={(e) => {e.stopPropagation(); (e.target as HTMLElement).parentElement?.parentElement?.classList.remove('group-active:block');}}
                            >
                              Got it
                            </button>
                          </div>
                        </div>
                      </div>
                    </Label>
                    <Input
                      id="hostSignature"
                      value={hostSignature}
                      onChange={(e) => setHostSignature(e.target.value)}
                      placeholder="e.g. 'Tim', 'Tim & Bec', 'Your hosts, T + B'"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      Optional field - adds a personal touch to welcome messages and house rules
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold">{selectedProperty.name}</h2>
                      
                      {/* Property Badges */}
                      <div className="flex items-center gap-2 mt-1">
                        {selectedProperty.useBrandVoiceDefault && selectedProperty.brandVoice && (
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Volume2 className="h-3 w-3 mr-1" />
                            Brand Voice Active
                          </div>
                        )}
                        
                        {selectedProperty.savedHashtags && selectedProperty.savedHashtags.length > 0 && (
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Tag className="h-3 w-3 mr-1" />
                            {selectedProperty.savedHashtags.length} Saved Hashtags
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Details
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">
                        Location
                      </h3>
                      <p>{selectedProperty.location || "Not specified"}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">
                        Rooms
                      </h3>
                      <p>{selectedProperty.bedrooms} bedrooms, {selectedProperty.bathrooms} bathrooms</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-neutral-500 mb-1">
                      Description
                    </h3>
                    <p className="whitespace-pre-wrap">
                      {selectedProperty.description || "No description provided."}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-500 mb-1">
                      Amenities
                    </h3>
                    <p className="whitespace-pre-wrap">
                      {selectedProperty.amenities && selectedProperty.amenities.length > 0
                        ? selectedProperty.amenities.join(", ")
                        : "No amenities listed."}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Saved Hashtags Section */}
            <div className="mt-8">
              {selectedProperty && (
                <SavedHashtagsEditor 
                  property={selectedProperty}
                  onSave={(updatedProperty) => {
                    // Update the selected property with the new saved hashtags
                    selectProperty(updatedProperty);
                    toast({
                      title: "Hashtags saved",
                      description: "Your hashtags have been saved to this property profile."
                    });
                  }}
                />
              )}
            </div>
            
            {/* Brand Voice Section */}
            <div className="mt-8">
              <div className="bg-white border border-neutral-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Brand Voice</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBrandVoiceModalOpen(true)}
                  >
                    {selectedProperty.brandVoice ? "Edit Brand Voice" : "Set Brand Voice"}
                  </Button>
                </div>
                
                {selectedProperty.brandVoice ? (
                  <div>
                    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-4 relative">
                      <div className="absolute -top-3 left-3 bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded">
                        Your Brand Voice
                      </div>
                      <p className="text-neutral-800 italic">"{selectedProperty.brandVoice}"</p>
                    </div>
                    
                    {selectedProperty.brandVoiceSummary && (
                      <div>
                        <h3 className="text-sm font-medium text-neutral-700 mb-1">Summary</h3>
                        <p className="text-sm text-neutral-600">{selectedProperty.brandVoiceSummary}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-8 border border-dashed border-neutral-300 rounded-lg">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquareQuote className="h-8 w-8 text-primary-500" />
                    </div>
                    <h3 className="font-medium text-lg mb-2">No brand voice set</h3>
                    <p className="text-neutral-600 text-sm mb-4 max-w-md mx-auto">
                      Setting a brand voice helps HostPrompt generate content that matches your property's unique style and character.
                    </p>
                    <Button 
                      variant="default" 
                      onClick={() => setIsBrandVoiceModalOpen(true)}
                    >
                      Set Brand Voice
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Photo Section */}
{/* Property Photos section removed temporarily */}
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="h-8 w-8 text-primary-500" />
            </div>
            <h3 className="font-heading font-semibold text-xl mb-2">No property selected</h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Please select a property from the list above to edit its profile.
            </p>
          </div>
        )}
      </main>
      
      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={isAddPropertyModalOpen}
        onClose={() => setAddPropertyModalOpen(false)}
      />
      
      {/* Brand Voice Modal */}
      {selectedProperty && (
        <BrandVoiceModal
          isOpen={isBrandVoiceModalOpen}
          onClose={() => setIsBrandVoiceModalOpen(false)}
          propertyId={selectedProperty.id}
          currentBrandVoice={selectedProperty.brandVoice || ""}
          currentBrandVoiceSummary={selectedProperty.brandVoiceSummary || ""}
          useBrandVoiceDefault={selectedProperty.useBrandVoiceDefault || false}
        />
      )}
      
      {/* Delete Property Modal */}
      <DeletePropertyModal
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setPropertyToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}