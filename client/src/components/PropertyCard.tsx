import { Property } from "@shared/schema";
import { usePropertyStore } from "@/store/propertyStore";
import { MapPinIcon, BedDoubleIcon, DropletIcon, PencilIcon } from "lucide-react";
import { Link, useLocation } from "wouter";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { selectProperty } = usePropertyStore();
  const [, setLocation] = useLocation();

  const handleCardClick = () => {
    selectProperty(property);
    setLocation('/property');
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    selectProperty(property);
    setLocation('/property');
  };

  return (
    <div 
      className="bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-48 bg-neutral-100">
        <img src={property.image} alt={property.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
          <h3 className="font-heading font-semibold text-lg">{property.name}</h3>
          <p className="text-sm text-white/90 flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{property.location}</span>
          </p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-sm">
            <span className="flex items-center mr-3">
              <BedDoubleIcon className="h-4 w-4 mr-1 text-neutral-500" />
              <span>{property.bedrooms}</span>
            </span>
            <span className="flex items-center mr-3">
              <DropletIcon className="h-4 w-4 mr-1 text-neutral-500" />
              <span>{property.bathrooms}</span>
            </span>
          </div>
        </div>
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{property.description}</p>
        <div className="flex justify-between">
          <span 
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              property.status === 'Active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}
          >
            {property.status}
          </span>
          <button 
            onClick={handleEditClick}
            className="text-primary-500 hover:text-primary-700 text-sm font-medium transition-colors flex items-center"
          >
            <PencilIcon className="h-3.5 w-3.5 mr-1" />
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
}
