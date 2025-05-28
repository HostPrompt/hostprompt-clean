import { useState } from 'react';
import { usePropertyStore } from '@/store/propertyStore';
import { useContentStore } from '@/store/contentStore';
import { useToast } from '@/hooks/use-toast';
import { Wand2, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface EditWithPromptProps {
  location: 'generator' | 'preview';
}

export default function EditWithPrompt({ location }: EditWithPromptProps) {
  const [prompt, setPrompt] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { selectedProperty } = usePropertyStore();
  const { 
    generatedContent, 
    editContentWithPrompt, 
    loading, 
    editingWithPrompt, 
    error 
  } = useContentStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Need your ideas first!",
        description: "Tell us how you'd like to change your content",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedProperty || !generatedContent) {
      toast({
        title: "Oops, we need content first!",
        description: "Create some amazing content before editing",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await editContentWithPrompt(prompt, selectedProperty);
      toast({
        title: "Changes complete!",
        description: "Your content has been magically transformed",
      });
      setPrompt('');
      setIsOpen(false);
    } catch (err) {
      toast({
        title: "That didn't quite work",
        description: "Let's try a different way of explaining what you'd like to change",
        variant: "destructive"
      });
    }
  };

  // Don't show if no content exists
  if (!generatedContent) return null;

  return (
    <div className={`${location === 'preview' ? 'mb-6' : 'mt-4 mb-4'}`}>
      {isOpen ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-neutral-800 flex items-center">
              <Wand2 className="h-4 w-4 text-primary-500 mr-1.5" />
              Edit with Natural Language
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <p className="text-xs text-neutral-600 mb-3">
            Just tell us what you want to change in plain English, and we'll work our magic while keeping your unique voice!
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-3" id="hostprompt-edit-form">
            <div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Try: 'Make it punchier!' or 'Add more about the beautiful sunset views' or 'Shorten this a bit'"
                className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm h-24 focus:border-primary-500 focus:ring-primary-500"
                disabled={loading || editingWithPrompt}
              ></textarea>
            </div>
            
            {error && (
              <div className="text-red-600 text-xs flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {error}
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 border border-neutral-300 rounded-md text-sm mr-2 hover:bg-neutral-50 transition-colors"
                disabled={loading || editingWithPrompt}
              >
                Cancel
              </button>
              <button
                type="submit"
                id="hostprompt-edit-submit"
                className="px-4 py-2 bg-[#FF5C5C] hover:bg-[#FF7070] text-white rounded-md text-sm font-medium transition-colors flex items-center shadow-sm"
                disabled={loading || editingWithPrompt}
              >
                {loading || editingWithPrompt ? (
                  <div className="flex items-center justify-center w-full">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    <span>Working magic...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <Wand2 className="h-4 w-4 mr-2" />
                    <span>Make it happen</span>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 rounded-lg py-2.5 text-sm text-neutral-700 font-medium transition-colors flex items-center justify-center"
        >
          <Wand2 className="h-4 w-4 mr-1.5 text-primary-500" />
          Tweak it your way
        </button>
      )}
    </div>
  );
}