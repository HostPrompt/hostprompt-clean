import { useEffect, useState, useRef } from "react";
import { usePropertyStore } from "@/store/propertyStore";
import { Property } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, MapPin, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "wouter";

interface PropertySelectorProps {
  onSelect: (property: Property) => void;
  selectedProperty: Property | null;
}

export default function PropertySelector({ onSelect, selectedProperty }: PropertySelectorProps) {
  const { properties, fetchProperties, loading } = usePropertyStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle property selection
  const handleSelectProperty = (property: Property) => {
    onSelect(property);
    setIsOpen(false);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5 lg:col-span-1">
      <h3 className="font-heading font-medium text-lg mb-4">Select a Property</h3>
      
      {loading ? (
        <div className="mb-6">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ) : properties.length > 0 ? (
        <div className="mb-6 relative" ref={dropdownRef}>
          {/* Dropdown Trigger */}
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className={`border ${selectedProperty ? 'border-primary-500' : 'border-neutral-200'} 
              rounded-lg p-3 cursor-pointer transition-all hover:border-primary-300 flex justify-between items-center
              ${selectedProperty ? 'bg-primary-50' : 'bg-white'}`}
          >
            <div className="flex items-center min-w-0 flex-1">
              {selectedProperty ? (
                <>
                  {/* Thumbnail (optional) */}
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-100 mr-3 shrink-0">
                    <img src={selectedProperty.image} alt={selectedProperty.name} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Property Info */}
                  <div className="min-w-0">
                    <h4 className="font-medium text-neutral-800 truncate">
                      {selectedProperty.name}
                    </h4>
                    <div className="flex items-center text-sm text-neutral-500">
                      <MapPin className="h-3 w-3 mr-1 text-neutral-400" />
                      <span className="truncate">{selectedProperty.location}</span>
                    </div>
                  </div>
                </>
              ) : (
                <span className="text-neutral-600">Select a property...</span>
              )}
            </div>
            
            {/* Dropdown Icon */}
            {isOpen ? 
              <ChevronUp className="h-5 w-5 text-neutral-500" /> : 
              <ChevronDown className="h-5 w-5 text-neutral-500" />
            }
          </div>
          
          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-0 right-0 mt-1 border border-neutral-200 rounded-lg bg-white shadow-lg z-10 max-h-60 overflow-y-auto">
              {properties.map((property) => {
                const isSelected = selectedProperty && selectedProperty.id === property.id;
                return (
                  <div 
                    key={property.id}
                    onClick={() => handleSelectProperty(property)}
                    className={`p-3 cursor-pointer hover:bg-neutral-50 flex items-center ${
                      isSelected ? 'bg-primary-50' : ''
                    } border-b border-neutral-100 last:border-b-0`}
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-100 mr-3 shrink-0">
                      <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Property Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-neutral-800 truncate">{property.name}</h4>
                        {isSelected && (
                          <span className="ml-2 text-primary-500">
                            <Check className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-neutral-500">
                        <MapPin className="h-3 w-3 mr-1 text-neutral-400" />
                        <span className="truncate">{property.location}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-lg p-5 text-center mb-6">
          <Home className="h-10 w-10 mx-auto text-neutral-300 mb-2" />
          <p className="text-neutral-600 mb-3">Let's add your first property!</p>
          <button 
            onClick={() => { window.location.href = "/property"; }}
            className="text-primary-500 hover:text-primary-600 text-sm font-medium"
          >
            Create your first space
          </button>
        </div>
      )}
    </div>
  );
}
