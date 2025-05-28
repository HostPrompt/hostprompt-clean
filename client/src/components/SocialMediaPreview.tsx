import { useRef, useEffect } from "react";
import { useContentStore } from "@/store/contentStore";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal, 
  ThumbsUp, 
  Share,
  Repeat,
  Upload,
  Send,
  Music,
  Facebook,
  Instagram,
  Twitter,
  Video,
  Copy,
  CheckCircle
} from "lucide-react";

export default function SocialMediaPreview() {
  const { savedContent, generatedContent, socialSettings, previewPlatform, addHashtag, removeHashtag, setSocialSettings } = useContentStore();
  const { toast } = useToast();
  
  // Use either savedContent or generatedContent, preferring generatedContent if it exists
  const displayContent = generatedContent || savedContent || { 
    content: '',
    property: { 
      name: 'Your Property',
      location: 'Your Location',
      image: ''
    }
  };
  
  // Make sure we don't have any default hashtags when initializing the preview
  useEffect(() => {
    if (socialSettings.hashtags.length > 0 && 
        socialSettings.hashtags.some(tag => ['pool', 'beachaccess', 'spa', 'familyescape', 'malibumoments', 'family', 'relaxation'].includes(tag))) {
      setSocialSettings({ hashtags: [] });
    }
  }, []);
  
  // Determine which image to use - prioritize content-specific image over property image
  const getContentImage = () => {
    // First try to use the photo uploaded specifically for this content
    if ('imageUrl' in displayContent && displayContent.imageUrl) {
      return displayContent.imageUrl;
    }
    // If no content-specific image, use the property image
    if (displayContent.property?.image) {
      return displayContent.property.image;
    }
    // Fallback to empty string
    return '';
  };
  
  const contentImage = getContentImage();
  const newHashtagRef = useRef<HTMLInputElement>(null);

  const handleAddHashtag = () => {
    if (newHashtagRef.current && newHashtagRef.current.value.trim()) {
      addHashtag(newHashtagRef.current.value.trim());
      newHashtagRef.current.value = '';
    }
  };

  const renderPlatformPreview = () => {
    switch (previewPlatform) {
      case 'instagram':
        return (
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden max-w-md mx-auto">
            {/* Instagram Header */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-neutral-200 mr-2 overflow-hidden">
                  <img src={contentImage} className="w-full h-full object-cover" alt="Profile" />
                </div>
                <p className="text-sm font-semibold">{displayContent.property?.name || 'Your Property Name'}</p>
              </div>
              <MoreHorizontal className="h-5 w-5 text-neutral-500" />
            </div>
            
            {/* Image */}
            <div className="aspect-square bg-neutral-100">
              <img src={contentImage} className="w-full h-full object-cover" alt="Post" />
            </div>
            
            {/* Actions */}
            <div className="p-3">
              <div className="flex justify-between mb-2">
                <div className="flex space-x-4">
                  <Heart className="h-6 w-6" />
                  <MessageCircle className="h-6 w-6" />
                  <Share2 className="h-6 w-6" />
                </div>
                <Bookmark className="h-6 w-6" />
              </div>
              
              {/* Caption - Using just the content which now includes hashtags */}
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-semibold mr-1">{displayContent.property?.name || 'Your Property Name'}</span>
                  {displayContent.content}
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'facebook':
        return (
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden max-w-md mx-auto">
            {/* Facebook Header */}
            <div className="p-3 flex items-center">
              <div className="w-10 h-10 rounded-full bg-neutral-200 mr-3 overflow-hidden">
                <img src={contentImage} className="w-full h-full object-cover" alt="Profile" />
              </div>
              <div>
                <p className="text-sm font-semibold">{displayContent.property?.name || 'Your Property Name'}</p>
                <div className="flex items-center text-xs text-neutral-500">
                  <span>Just now</span>
                  <span className="mx-1">•</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="px-3 pb-3">
              <p className="text-sm">{displayContent.content}</p>
              
              {/* Hashtags */}
              <p className="text-sm text-primary-600 mt-1">
                {socialSettings.hashtags.map((hashtag, index) => (
                  <span key={index}>#{hashtag} </span>
                ))}
              </p>
            </div>
            
            {/* Image */}
            <div className="aspect-video bg-neutral-100 relative">
              <img src={contentImage} className="w-full h-full object-cover" alt="Property" />
            </div>
            
            {/* Actions */}
            <div className="p-3 border-t border-neutral-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-1 text-neutral-600 text-sm">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Like</span>
                </div>
                <div className="flex items-center space-x-1 text-neutral-600 text-sm">
                  <MessageCircle className="h-4 w-4" />
                  <span>Comment</span>
                </div>
                <div className="flex items-center space-x-1 text-neutral-600 text-sm">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'twitter':
        return (
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden max-w-md mx-auto">
            {/* Twitter Header */}
            <div className="p-3 flex">
              <div className="w-10 h-10 rounded-full bg-neutral-200 mr-3 overflow-hidden">
                <img src={contentImage} className="w-full h-full object-cover" alt="Profile" />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <p className="text-sm font-semibold">{displayContent.property?.name || 'Your Property Name'}</p>
                  <p className="text-xs text-neutral-500 ml-1">@yourproperty</p>
                  <span className="mx-1 text-neutral-500">•</span>
                  <p className="text-xs text-neutral-500">Just now</p>
                </div>
                
                {/* Content */}
                <p className="text-sm mt-1">{displayContent.content}</p>
                
                {/* Hashtags are now part of the content */}
                
                {/* Image */}
                <div className="mt-3 rounded-xl overflow-hidden bg-neutral-100">
                  <img src={contentImage} className="w-full h-auto object-cover" alt="Property" />
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between mt-3 text-neutral-600">
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">0</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Repeat className="h-4 w-4" />
                    <span className="text-xs">0</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">0</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Upload className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'tiktok':
        return (
          <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden max-w-md mx-auto">
            {/* TikTok Header */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-neutral-200 mr-3 overflow-hidden">
                  <img src={contentImage} className="w-full h-full object-cover" alt="Profile" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{displayContent.property?.name || 'Your Property Name'}</p>
                  <p className="text-xs text-neutral-500">@yourproperty</p>
                </div>
              </div>
              <Music className="h-5 w-5 text-neutral-700" />
            </div>
            
            {/* Video Placeholder (using image) */}
            <div className="aspect-[9/16] bg-neutral-100 relative">
              <img src={contentImage} className="w-full h-full object-cover" alt="Property" />
              
              {/* Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-sm text-white">{displayContent.content}</p>
                <p className="text-sm text-white mt-1">
                  {socialSettings.hashtags.map((hashtag, index) => (
                    <span key={index}>#{hashtag} </span>
                  ))}
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="p-3 flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <div className="flex flex-col items-center">
                  <Heart className="h-6 w-6" />
                  <span className="text-xs mt-1">0</span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-xs mt-1">0</span>
                </div>
                <div className="flex flex-col items-center">
                  <Bookmark className="h-6 w-6" />
                  <span className="text-xs mt-1">0</span>
                </div>
              </div>
              <div>
                <Send className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
        
      default:
        return <div className="p-4 text-center">Select a platform to preview</div>;
    }
  };

  return (
    <div className="mb-24 md:mb-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Social Preview</h3>
        <p className="text-sm text-neutral-600 mb-4">See how your content will look on different platforms.</p>
      </div>
      
      {renderPlatformPreview()}
      <div className="mt-6 bg-white p-4 border border-neutral-200 rounded-lg shadow-sm">
        <h3 className="text-md font-semibold mb-3">Hashtags</h3>
        
        {/* Hashtag Display */}
        <div className="flex flex-wrap gap-2 mb-4">
          {socialSettings.hashtags.length === 0 ? (
            <p className="text-sm text-neutral-500">No hashtags added yet</p>
          ) : (
            socialSettings.hashtags.map((hashtag, index) => (
              <div key={index} className="bg-neutral-100 text-neutral-800 rounded-full px-3 py-1 text-sm flex items-center">
                #{hashtag}
                <button 
                  onClick={() => removeHashtag(index)}
                  className="ml-2 text-neutral-400 hover:text-neutral-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* Add Hashtag */}
        <div className="flex mb-4">
          <input
            ref={newHashtagRef}
            type="text"
            placeholder="Add a hashtag"
            className="flex-1 p-2 border border-neutral-300 rounded-l-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAddHashtag()}
          />
          <button 
            onClick={handleAddHashtag}
            className="bg-[#FF5C5C] hover:bg-[#FF7070] text-white rounded-r-lg px-4 transition-colors"
          >
            Add
          </button>
        </div>
        
        {/* Copy & Share Action Buttons */}
        <div className="mt-5 border-t pt-4">
          <div className="flex flex-wrap gap-2 mb-3">
            <button 
              onClick={() => {
                // Copy full caption + hashtags to clipboard
                const content = displayContent.content || '';
                const hashtags = socialSettings.hashtags.map(tag => `#${tag}`).join(' ');
                const fullContent = `${content} ${hashtags}`.trim();
                navigator.clipboard.writeText(fullContent);
                // Show toast notification
                toast({
                  title: "Copied to clipboard",
                  description: "Your content has been copied and is ready to paste",
                });
              }}
              className="bg-[#FF5C5C] hover:bg-[#e14c4c] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center"
            >
              <Copy className="h-4 w-4 mr-1.5" />
              Copy for Posting
            </button>
            
            {/* TikTok-specific CapCut Button */}
            {previewPlatform === 'tiktok' && (
              <a
                href="https://www.capcut.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black hover:bg-neutral-800 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center"
              >
                <Video className="h-4 w-4 mr-1.5" />
                Create Video in CapCut
              </a>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={() => {
                // Copy content and open Instagram
                const content = displayContent.content || '';
                const hashtags = socialSettings.hashtags.map(tag => `#${tag}`).join(' ');
                const fullContent = `${content} ${hashtags}`.trim();
                navigator.clipboard.writeText(fullContent);
                window.open('https://www.instagram.com/', '_blank');
                toast({
                  title: "Copied for Instagram",
                  description: "Content copied and Instagram opened in a new tab",
                });
              }}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-[#E1306C] text-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-colors flex items-center"
            >
              <Instagram className="h-4 w-4 mr-1.5" />
              Instagram
            </button>
            
            <button 
              onClick={() => {
                // Copy content and open Facebook
                const content = displayContent.content || '';
                const hashtags = socialSettings.hashtags.map(tag => `#${tag}`).join(' ');
                const fullContent = `${content} ${hashtags}`.trim();
                navigator.clipboard.writeText(fullContent);
                window.open('https://www.facebook.com/', '_blank');
                toast({
                  title: "Copied for Facebook",
                  description: "Content copied and Facebook opened in a new tab",
                });
              }}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors flex items-center"
            >
              <Facebook className="h-4 w-4 mr-1.5" />
              Facebook
            </button>
            
            <button 
              onClick={() => {
                // Copy content and open Twitter/X compose page
                const content = displayContent.content || '';
                const hashtags = socialSettings.hashtags.map(tag => `#${tag}`).join(' ');
                const fullContent = `${content} ${hashtags}`.trim();
                navigator.clipboard.writeText(fullContent);
                window.open('https://twitter.com/compose/tweet', '_blank');
                toast({
                  title: "Copied for X",
                  description: "Content copied and X compose page opened in a new tab",
                });
              }}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-black text-black hover:bg-black hover:text-white transition-colors flex items-center"
            >
              <Twitter className="h-4 w-4 mr-1.5" />
              X
            </button>
            
            <button 
              onClick={() => {
                // Copy content and open TikTok upload page
                const content = displayContent.content || '';
                const hashtags = socialSettings.hashtags.map(tag => `#${tag}`).join(' ');
                const fullContent = `${content} ${hashtags}`.trim();
                navigator.clipboard.writeText(fullContent);
                window.open('https://www.tiktok.com/upload', '_blank');
                toast({
                  title: "Copied for TikTok",
                  description: "Content copied and TikTok upload page opened in a new tab",
                });
              }}
              className="px-3 py-1.5 rounded-lg text-sm font-medium border border-black text-black hover:bg-black hover:text-white transition-colors flex items-center"
            >
              <Music className="h-4 w-4 mr-1.5" />
              TikTok
            </button>
            
            {/* Meta Business Suite Button - Resized to match other buttons */}
            <button 
              onClick={() => {
                window.open('https://business.facebook.com/', '_blank');
                toast({
                  title: "Opening Meta Business Suite",
                  description: "Meta Business Suite opened in a new tab",
                });
              }}
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#FF5C5C] text-white hover:bg-[#e14c4c] transition-colors flex items-center relative group"
            >
              <Facebook className="h-4 w-4 mr-1.5" />
              Meta Business
              <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 w-56 text-center z-10">
                Manage and schedule your Instagram & Facebook posts in one place.
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}