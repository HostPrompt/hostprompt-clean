import { useState, useEffect } from "react";
import { X, Calendar, Clock, ArrowRight, Trash2 } from "lucide-react";
import { useContentStore } from "@/store/contentStore";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface SavedContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContent?: (content: any) => void;
}

export default function SavedContentModal({ isOpen, onClose, onSelectContent }: SavedContentModalProps) {
  const { savedContentLibrary, deleteContent, updateGeneratedContent } = useContentStore();
  const { toast } = useToast();
  const [selectedContent, setSelectedContent] = useState<number | null>(null);
  
  // Helper function to format date
  const formatDate = (dateString?: string) => {
    try {
      if (!dateString) return 'Recently added';
      
      const date = new Date(dateString);
      
      // Check if date is valid before formatting
      if (isNaN(date.getTime())) {
        return 'Recently added';
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Recently added';
    }
  };
  
  // Reset selection when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedContent(null);
    }
  }, [isOpen]);
  
  const handleSelectContent = (index: number) => {
    setSelectedContent(index);
  };
  
  const handleLoadContent = () => {
    if (selectedContent !== null && savedContentLibrary[selectedContent]) {
      if (onSelectContent) {
        onSelectContent(savedContentLibrary[selectedContent]);
      } else {
        // Default behavior if no callback provided
        updateGeneratedContent(savedContentLibrary[selectedContent]);
        
        toast({
          title: "Content ready to shine!",
          description: "Your saved creation is now loaded and ready for action",
        });
      }
      onClose();
    }
  };
  
  const handleDeleteContent = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    deleteContent(index);
    
    if (selectedContent === index) {
      setSelectedContent(null);
    } else if (selectedContent !== null && selectedContent > index) {
      setSelectedContent(selectedContent - 1);
    }
    
    toast({
      title: "Content removed!",
      description: "That piece is gone, but your creativity lives on",
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Saved Content</h2>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex flex-col md:flex-row h-full overflow-hidden">
          {/* Saved Content List */}
          <div className="w-full md:w-1/2 overflow-y-auto border-r">
            {savedContentLibrary.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your content showcase is empty</h3>
                <p className="text-neutral-600 text-sm">
                  When you save your brilliant creations, they'll be right here waiting for you.
                </p>
              </div>
            ) : (
              <ul className="divide-y">
                {savedContentLibrary.map((content, index) => (
                  <li 
                    key={index}
                    onClick={() => handleSelectContent(index)}
                    className={`p-4 hover:bg-neutral-50 cursor-pointer ${
                      selectedContent === index ? 'bg-neutral-100' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm line-clamp-1">{content.title}</h3>
                        <p className="text-xs text-neutral-600 line-clamp-2 mt-1">
                          {content.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center mt-2 text-xs text-neutral-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatDate(content.dateGenerated || content.createdAt) || 'Recently added'}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteContent(e, index)}
                        className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Preview Pane */}
          <div className="w-full md:w-1/2 p-4 overflow-y-auto bg-neutral-50">
            {selectedContent !== null && savedContentLibrary[selectedContent] ? (
              <div>
                <h3 className="font-semibold mb-2">{savedContentLibrary[selectedContent].title}</h3>
                
                {savedContentLibrary[selectedContent].imageUrl && (
                  <div className="mb-4 rounded-md overflow-hidden h-32 bg-neutral-200">
                    <img 
                      src={savedContentLibrary[selectedContent].imageUrl} 
                      alt="Content" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none mb-4 whitespace-pre-wrap">
                  {savedContentLibrary[selectedContent].content.split('\n').map((line, i) => (
                    <p key={i} className={line.trim() === '' ? 'h-4' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
                
                {savedContentLibrary[selectedContent].keywords?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-neutral-500 mb-2">Keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {savedContentLibrary[selectedContent].keywords.map((keyword, idx) => (
                        <span 
                          key={idx}
                          className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleLoadContent}
                  className="w-full bg-[#FF5C5C] hover:bg-[#FF7070] text-white rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center mt-4"
                >
                  <span>Use this content</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </button>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center p-4">
                <div>
                  <p className="text-neutral-500 mb-2">Select content to preview</p>
                  <p className="text-xs text-neutral-400">Choose an item from the list to see details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}