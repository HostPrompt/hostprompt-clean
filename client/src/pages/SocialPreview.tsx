import { useState, useEffect } from "react";
import { useContentStore } from "@/store/contentStore";
import { Link } from "wouter";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import SocialPlatformSelector from "@/components/SocialPlatformSelector";
import SocialMediaPreview from "@/components/SocialMediaPreview";
import SavedContentModal from "@/components/SavedContentModal";
import EditWithPrompt from "@/components/EditWithPrompt";
import { ImageIcon, Download, Share, Library, ArrowLeft, PenSquare } from "lucide-react";

interface SocialPreviewProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function SocialPreview({ mobileMenuOpen, setMobileMenuOpen }: SocialPreviewProps) {
  const [activeTab, setActiveTab] = useState("preview");
  const [savedContentModalOpen, setSavedContentModalOpen] = useState(false);
  const { 
    savedContent, 
    generatedContent, 
    updateGeneratedContent, 
    saveContent,
    setSocialSettings 
  } = useContentStore();
  
  // Try to load content from localStorage on component mount
  useEffect(() => {
    try {
      const savedContentJson = localStorage.getItem('hostPrompt_savedContent');
      const isSocialShare = localStorage.getItem('hostPrompt_socialShare');
      
      if (savedContentJson && isSocialShare) {
        const parsedContent = JSON.parse(savedContentJson);
        
        // Update the generated content only, don't save it again to prevent duplicates
        updateGeneratedContent(parsedContent);
        
        // Remove the flags once loaded
        localStorage.removeItem('hostPrompt_socialShare');
        
        // Only set hashtags if explicitly requested
        // We're removing the automatic conversion of keywords to hashtags
        // to avoid cluttering the social preview
      }
    } catch (error) {
      console.error('Error loading content from localStorage:', error);
    }
  }, [updateGeneratedContent, setSocialSettings]);
  
  // Use either the saved content or the generated content, 
  // with preference given to the generated content if it exists
  const displayContent = generatedContent || savedContent;

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 pb-16 md:pb-0">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="mb-6">
            <Link href="/generator" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-2 font-medium">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Create
            </Link>
            <h2 className="text-2xl font-heading font-semibold text-neutral-800 mb-2">Social Preview</h2>
            <p className="text-neutral-600">Preview your property content as it will appear on social media.</p>
          </div>

          {!displayContent ? (
            <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-8 w-8 text-neutral-500" />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-2">Nothing to see yet!</h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                Let's create some content first so we can see how amazing your property will look on social media.
              </p>
              <button 
                onClick={() => setActiveTab("generator")}
                className="bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
              >
                Create Content Now
              </button>
            </div>
          ) : (
            <>
              <SocialPlatformSelector />
              <SocialMediaPreview />
              
              {/* Edit with Prompt positioned between preview content and hashtags */}
              <div className="mt-6 mb-6">
                <EditWithPrompt location="preview" />
              </div>
              
              {/* Back to Create button */}
              <div className="mt-6 flex flex-col md:flex-row gap-4 items-center">
                <Link 
                  href="/generator" 
                  className="w-full md:w-auto flex items-center justify-center bg-[#FF5C5C] hover:bg-[#FF7070] text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <PenSquare className="h-5 w-5 mr-2" />
                  Generate New Content
                </Link>
                
                <button 
                  onClick={() => setSavedContentModalOpen(true)}
                  className="w-full md:w-auto flex items-center justify-center bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Library className="h-5 w-5 mr-2" />
                  View Saved Content
                </button>
              </div>
              
              {/* Moved from floating buttons to inline actions */}
              <div className="mt-6 bg-white rounded-lg border border-neutral-200 p-4 md:hidden">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Content Actions</h3>
                  <button 
                    onClick={() => setSavedContentModalOpen(true)}
                    className="text-sm text-primary-600 font-medium"
                  >
                    View Saved Content
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      {/* Saved Content Modal */}
      <SavedContentModal 
        isOpen={savedContentModalOpen}
        onClose={() => setSavedContentModalOpen(false)}
        onSelectContent={(content) => {
          updateGeneratedContent(content);
        }}
      />
    </div>
  );
}
