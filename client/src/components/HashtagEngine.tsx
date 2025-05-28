import { useState, useRef, useEffect } from 'react';
import { PlusCircle, X, Hash } from 'lucide-react';
import { useContentStore } from '@/store/contentStore';
import { usePropertyStore } from '@/store/propertyStore';

export default function HashtagEngine() {
  const { 
    generatedContent, 
    updateGeneratedContent 
  } = useContentStore();
  const { selectedProperty } = usePropertyStore();
  const [customHashtag, setCustomHashtag] = useState('');
  const [addedHashtags, setAddedHashtags] = useState<string[]>([]);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate suggested hashtags based on property, location, etc.
  useEffect(() => {
    if (selectedProperty) {
      // Generate hashtags based on property type and location
      const baseHashtags = [];
      
      // Add property type related hashtags
      if (selectedProperty.name.toLowerCase().includes('beach') || 
          selectedProperty.location.toLowerCase().includes('beach')) {
        baseHashtags.push('beachhouse', 'beachlife', 'beachfront');
      }
      
      if (selectedProperty.name.toLowerCase().includes('cabin') || 
          selectedProperty.name.toLowerCase().includes('mountain')) {
        baseHashtags.push('cabinlife', 'mountainview', 'escapetomountains');
      }
      
      if (selectedProperty.name.toLowerCase().includes('villa') || 
          selectedProperty.name.toLowerCase().includes('luxury')) {
        baseHashtags.push('luxuryvilla', 'luxurytravel', 'luxurystay');
      }
      
      // Add location-based hashtags
      if (selectedProperty.location) {
        const locationParts = selectedProperty.location.split(',').map(part => part.trim());
        locationParts.forEach(part => {
          if (part && part.length > 2) {
            baseHashtags.push(part.toLowerCase().replace(/\s+/g, ''));
          }
        });
      }
      
      // Add general vacation hashtags
      const generalHashtags = [
        'vacation', 'travel', 'getaway', 'staycation', 'holidayhome',
        'dreamstay', 'vacationrental', 'travelgram'
      ];
      
      // Combine hashtags and randomize selection to ensure variety
      const allHashtags = [...baseHashtags, ...generalHashtags]
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates
      
      // Randomly select 8-10 hashtags
      const shuffledHashtags = allHashtags.sort(() => 0.5 - Math.random());
      
      // Save to state
      setSuggestedHashtags(shuffledHashtags.slice(0, 8));
    }
  }, [selectedProperty]);

  const handleAddHashtag = (hashtag: string) => {
    if (!hashtag || hashtag.trim() === '') return;
    
    // Format the hashtag properly - remove spaces and special characters
    let formattedHashtag = hashtag.trim()
      .replace(/\s+/g, '') // Remove spaces
      .replace(/[^\w]/g, '') // Remove special characters
      .toLowerCase();
    
    // Add # prefix if not already present
    if (!formattedHashtag.startsWith('#')) {
      formattedHashtag = `#${formattedHashtag}`;
    }
    
    // Check if already added
    if (addedHashtags.includes(formattedHashtag)) return;
    
    // Add to state
    setAddedHashtags(prev => [...prev, formattedHashtag]);
    
    // Add to the end of the content
    if (generatedContent) {
      let content = generatedContent.content;
      
      // Ensure there's a space before adding hashtags
      if (!content.endsWith(' ')) {
        content += ' ';
      }
      
      // Add the hashtag
      content += formattedHashtag + ' ';
      
      // Update the content
      updateGeneratedContent({ content });
    }
  };

  const handleRemoveHashtag = (hashtag: string) => {
    // Remove from added hashtags
    setAddedHashtags(prev => prev.filter(h => h !== hashtag));
    
    // Remove from content if present
    if (generatedContent) {
      const content = generatedContent.content
        .replace(hashtag + ' ', '') // Remove hashtag with space
        .replace(hashtag, ''); // Remove hashtag without space
      
      updateGeneratedContent({ content });
    }
  };

  const handleCustomHashtagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (customHashtag.trim() !== '') {
      handleAddHashtag(customHashtag);
      setCustomHashtag('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  if (!generatedContent) return null;

  return (
    <div className="mt-6 border-t border-neutral-100 pt-4">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center text-primary-600 text-sm font-medium hover:text-primary-700 focus:outline-none"
      >
        <PlusCircle className="h-4 w-4 mr-1.5" />
        {expanded ? 'Hide Hashtags' : '+ Add Hashtags'}
      </button>
      
      {expanded && (
        <div className="mt-3 space-y-3">
          <p className="text-xs text-neutral-600">
            Grab a few hashtags to help your post get noticed! They'll show up at the end of your caption.
          </p>
          
          {/* Hashtag suggestions */}
          <div className="flex flex-wrap gap-2">
            {suggestedHashtags.map((hashtag, index) => (
              <button
                key={index}
                onClick={() => handleAddHashtag(hashtag)}
                className={`px-2 py-1 text-xs rounded-full flex items-center transition-colors 
                  ${addedHashtags.includes(`#${hashtag}`) 
                    ? 'bg-primary-100 text-primary-700 cursor-default' 
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                disabled={addedHashtags.includes(`#${hashtag}`)}
              >
                <Hash className="h-3 w-3 mr-1" />
                {hashtag}
                {!addedHashtags.includes(`#${hashtag}`) && (
                  <PlusCircle className="h-3 w-3 ml-1 text-neutral-500" />
                )}
              </button>
            ))}
            
            {/* Custom hashtag input */}
            <form 
              onSubmit={handleCustomHashtagSubmit}
              className="inline-flex items-center"
            >
              <div className="relative">
                <input
                  type="text"
                  ref={inputRef}
                  value={customHashtag}
                  onChange={(e) => setCustomHashtag(e.target.value)}
                  placeholder="Add your own..."
                  className="w-32 px-2 py-1 text-xs rounded-full border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-600"
                >
                  <PlusCircle className="h-3 w-3" />
                </button>
              </div>
            </form>
          </div>
          
          {/* Added hashtags */}
          {addedHashtags.length > 0 && (
            <div className="mt-2">
              <div className="text-xs font-medium text-neutral-700 mb-1">Your chosen hashtags:</div>
              <div className="flex flex-wrap gap-2">
                {addedHashtags.map((hashtag, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {hashtag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveHashtag(hashtag)} 
                      className="ml-1 inline-flex text-primary-400 hover:text-primary-600 focus:outline-none"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}