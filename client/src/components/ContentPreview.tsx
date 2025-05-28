import React, { useRef, useState, useEffect } from "react";
const { Fragment } = React;
import { useContentStore } from "@/store/contentStore";
import { usePropertyStore } from "@/store/propertyStore";
import { RefreshCw, Check, Edit, Save, Camera, Image, Wand2 } from "lucide-react";
import EditWithPrompt from "@/components/EditWithPrompt";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import HashtagEngine from "@/components/HashtagEngine";

export default function ContentPreview() {
  const { 
    generatedContent, 
    updateGeneratedContent, 
    addKeyword, 
    removeKeyword, 
    saveContent, 
    loading, 
    photoData,
    generateSuggestedHashtags,
    generateContent
  } = useContentStore();
  const { selectedProperty } = usePropertyStore();
  const newKeywordRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Generate hashtag suggestions when content is generated
  useEffect(() => {
    if (generatedContent && selectedProperty) {
      generateSuggestedHashtags(selectedProperty);
    }
  }, [generatedContent, selectedProperty]);

  const handleAddKeyword = () => {
    if (newKeywordRef.current && newKeywordRef.current.value.trim()) {
      addKeyword(newKeywordRef.current.value.trim());
      newKeywordRef.current.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSaveContent = () => {
    saveContent();
    setIsEditing(false);
    toast({
      title: "Your content's ready",
      description: "All set for sharing",
    });
  };

  const toggleEditing = () => {
    if (!isEditing) {
      setIsEditing(true);
      // Focus the content textarea after toggling edit mode
      setTimeout(() => {
        if (contentTextareaRef.current) {
          contentTextareaRef.current.focus();
        }
      }, 100);
    } else {
      setIsEditing(false);
    }
  };

  if (!generatedContent) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {photoData.preview ? (
            <Image className="h-8 w-8 text-primary-500" />
          ) : (
            <Edit className="h-8 w-8 text-neutral-500" />
          )}
        </div>
        <h4 className="text-neutral-800 font-medium mb-2">Let's create something amazing!</h4>
        <p className="text-neutral-600 text-sm max-w-md mx-auto">
          {photoData.preview 
            ? "Loving that photo! Just hit Create Content to bring it to life with your brand voice."
            : "Pick a property, choose your content type, and let's make some magic happen."}
        </p>
        {photoData.preview && (
          <div className="mt-4 flex justify-center">
            <div className="relative w-40 h-40 rounded-md overflow-hidden border border-neutral-200">
              <img 
                src={photoData.preview} 
                alt="Uploaded" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Photo Preview (if available) and was used for generation */}
      {photoData.preview && (
        <div className="bg-neutral-50 rounded-lg p-4 mb-4 border border-neutral-200">
          <div className="flex items-center mb-3">
            <Camera className="h-5 w-5 text-primary-500 mr-2" />
            <h4 className="text-sm font-medium text-neutral-700">Generated with photo</h4>
          </div>
          <div className="flex items-center">
            <div className="w-24 h-24 rounded-md overflow-hidden mr-4 shadow-sm">
              <img src={photoData.preview} alt="Inspiration" className="w-full h-full object-cover" />
            </div>
            <p className="text-sm text-neutral-600 flex-1">
              Your content incorporates details from this photo, making it more authentic and personalized.
            </p>
          </div>
        </div>
      )}
      
      {/* Title */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-neutral-700">Title</label>
          {isEditing ? (
            <button 
              onClick={handleSaveContent}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center"
            >
              <Save className="h-3 w-3 mr-1" />
              Keep these changes
            </button>
          ) : (
            <button 
              onClick={toggleEditing}
              className="text-xs text-neutral-600 hover:text-neutral-800 flex items-center"
            >
              <Edit className="h-3 w-3 mr-1" />
              Make it yours
            </button>
          )}
        </div>
        <input 
          type="text" 
          value={generatedContent.title} 
          onChange={(e) => updateGeneratedContent({ title: e.target.value })}
          className="w-full rounded-lg border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" 
          disabled={!isEditing}
        />
      </div>
      
      {/* Content Type Badge */}
      {generatedContent.contentType && (
        <div className="mb-3">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-[#FFECEC] text-[#FF5C5C] border border-[#FFCFCF]">
            {generatedContent.contentType === 'social_media_caption' && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Social Media Caption
              </>
            )}
            {generatedContent.contentType === 'listing_description' && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Listing Description
              </>
            )}
            {generatedContent.contentType === 'welcome_message' && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Welcome Message
              </>
            )}
            {generatedContent.contentType === 'house_rules' && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                House Rules Reminder
              </>
            )}
            {generatedContent.contentType === 'guest_reengagement' && (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                </svg>
                Guest Re-engagement Message
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">Content</label>
        {isEditing ? (
          <textarea 
            ref={contentTextareaRef}
            value={generatedContent.content} 
            onChange={(e) => updateGeneratedContent({ content: e.target.value })}
            rows={10} 
            className="w-full rounded-lg border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          ></textarea>
        ) : (
          <div 
            className="prose prose-sm max-w-none border rounded-lg p-4 bg-white whitespace-pre-wrap" 
            onClick={toggleEditing}
          >
            {/* Process content to add spacing before hashtags if needed */}
            {generatedContent.content.split('\n').map((line, i) => {
              // Check if line starts with a hashtag and is not the first line
              const isHashtagLine = line.trim().startsWith('#') && i > 0;
              const prevLineEmpty = i > 0 && generatedContent.content.split('\n')[i-1].trim() === '';
              
              // Add a subtle separator before hashtags (but only if needed)
              return (
                <span key={i}>
                  {isHashtagLine && !prevLineEmpty && (
                    <div className="border-t border-neutral-100 my-2"></div>
                  )}
                  <p className={line.trim() === '' ? 'h-4' : ''}>
                    {line}
                  </p>
                </span>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Keywords section removed, but hashtag functionality is preserved */}
      
      {/* Hashtag Engine */}
      <HashtagEngine />
      
      {/* Edit with Prompt */}
      <EditWithPrompt location="generator" />
      
      {/* Action Buttons */}
      <div className="flex justify-end pt-3">
        <button 
          onClick={async () => {
            if (selectedProperty && !loading) {
              try {
                // Get the current property state from the store to ensure 
                // we include any booking gap information
                await generateContent(selectedProperty);
                toast({
                  title: "New content generated",
                  description: "Fresh content created with your same settings",
                });
              } catch (error) {
                toast({
                  title: "Error regenerating content",
                  description: "Please try again in a moment",
                  variant: "destructive"
                });
              }
            }
          }}
          disabled={loading || !selectedProperty}
          className="border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin mr-1.5 w-4 h-4 border-2 border-neutral-300 border-t-neutral-700 rounded-full" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Try Again
            </>
          )}
        </button>
      </div>
      
      {/* Social Preview CTA Button */}
      <div className="mt-6 border-t border-neutral-200 pt-6">
        {/* Check if content type is social media caption and show appropriate button */}
        {generatedContent.contentType === 'social_media_caption' ? (
          <Link 
            to="/share"
            onClick={() => {
              // Save the current content before navigating
              if (generatedContent && generatedContent.property) {
                // Create a complete content object with all needed data
                const content = {
                  ...generatedContent,
                  dateGenerated: new Date().toISOString()
                };
                
                // If we have photo data and there was an image uploaded, include that as well
                if (photoData && photoData.preview) {
                  content.imageUrl = photoData.preview;
                }
                
                // Save to localStorage to persist across navigation
                try {
                  localStorage.setItem('hostPrompt_savedContent', JSON.stringify(content));
                  localStorage.setItem('hostPrompt_socialShare', 'true');
                } catch (error) {
                  console.error('Error saving content to localStorage', error);
                }
                
                // Update the store
                updateGeneratedContent(content);
                saveContent();
              }
              // Link component will handle navigation
            }}
            className="w-full bg-[#FF5C5C] hover:bg-[#FF7070] text-white rounded-lg p-3 md:p-4 text-center font-medium transition-colors flex items-center justify-center shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="font-bold">Preview & Share on Social</span>
          </Link>
        ) : (
          <div 
            className="w-full bg-neutral-300 text-neutral-500 cursor-not-allowed rounded-lg p-3 md:p-4 text-center font-medium flex items-center justify-center shadow-md"
            title="Only available for social media captions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="font-bold">Preview & Share on Social</span>
          </div>
        )}
      </div>
    </div>
  );
}
