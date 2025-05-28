import { useState, useRef, useEffect } from 'react';
import { Tag, PlusCircle, X, Save, Hash } from 'lucide-react';
import { Property } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface SavedHashtagsEditorProps {
  property: Property;
  onSave: (updatedProperty: Property) => void;
}

export default function SavedHashtagsEditor({ property, onSave }: SavedHashtagsEditorProps) {
  const [hashtags, setHashtags] = useState<string[]>(property.savedHashtags || []);
  const [newHashtag, setNewHashtag] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Focus the input when editing is enabled
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleAddHashtag = () => {
    if (!newHashtag.trim()) return;
    
    // Format hashtag (remove special chars, spaces, make lowercase)
    const formattedHashtag = newHashtag.trim()
      .toLowerCase()
      .replace(/\s+/g, '') // Remove spaces
      .replace(/[^\w]/g, ''); // Remove special characters
    
    // Check for duplicates
    if (hashtags.includes(formattedHashtag)) {
      toast({
        title: "Hashtag already exists",
        description: "This hashtag is already in your saved list.",
      });
      setNewHashtag('');
      return;
    }
    
    setHashtags(prev => [...prev, formattedHashtag]);
    setNewHashtag('');
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleRemoveHashtag = (index: number) => {
    setHashtags(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHashtag();
    }
  };

  const handleSaveHashtags = async () => {
    try {
      // Create a simplified update object with just the hashtags
      // This avoids sending unnecessary data and potential schema conflicts
      const updateData = {
        savedHashtags: hashtags 
      };
      
      // Use PATCH to only update the savedHashtags field
      const result = await apiRequest('PATCH', `/api/properties/${property.id}`, updateData);
      
      if (result) {
        // Create the full updated property for local state
        const updatedProperty = {
          ...property,
          savedHashtags: hashtags
        };
        
        onSave(updatedProperty);
        setIsEditing(false);
        
        toast({
          title: "Hashtags saved",
          description: "Your hashtags have been saved to this property.",
        });
      }
    } catch (error) {
      console.error('Error saving hashtags:', error);
      toast({
        title: "Error saving hashtags",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="mb-6 p-4 bg-white rounded-lg border border-neutral-200 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <Tag className="h-5 w-5 mr-2 text-neutral-600" />
          <h3 className="text-md font-semibold">Saved Hashtags</h3>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm text-primary-600 font-medium hover:text-primary-700"
          >
            Edit
          </button>
        ) : (
          <button 
            onClick={handleSaveHashtags}
            className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </button>
        )}
      </div>
      
      {hashtags.length === 0 && !isEditing ? (
        <p className="text-sm text-neutral-500">
          No saved hashtags yet. Add hashtags to easily include them in all your content.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-3">
          {hashtags.map((hashtag, index) => (
            <div 
              key={index} 
              className="bg-neutral-100 text-neutral-800 rounded-full px-3 py-1 text-sm flex items-center"
            >
              #{hashtag}
              {isEditing && (
                <button 
                  onClick={() => handleRemoveHashtag(index)}
                  className="ml-2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      
      {isEditing && (
        <div className="flex mt-3">
          <div className="relative flex-grow">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              <Hash className="h-4 w-4" />
            </span>
            <input
              ref={inputRef}
              type="text"
              value={newHashtag}
              onChange={(e) => setNewHashtag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a hashtag"
              className="w-full pl-9 py-2 border border-neutral-300 rounded-l-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button 
            onClick={handleAddHashtag}
            className="bg-[#FF5C5C] hover:bg-[#FF7070] text-white rounded-r-lg px-4 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}