import { useState, useEffect, useRef, ChangeEvent } from "react";
import { usePropertyStore } from "@/store/propertyStore";
import { useContentStore } from "@/store/contentStore";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import PropertySelector from "@/components/PropertySelector";
import ContentPreview from "@/components/ContentPreview";
import PhotoSelector from "@/components/PhotoSelector";
import EditWithPrompt from "@/components/EditWithPrompt";
import { useToast } from "@/hooks/use-toast";
import { createImagePreview } from "@/lib/utils";
import { 
  ChevronRight, 
  Info, 
  Edit, 
  Copy,
  Upload,
  X,
  ImageIcon,
  Save,
  CalendarDays,
  CalendarRange,
  Facebook,
  Instagram,
  Twitter,
  Music,
  ExternalLink,
  MessageCircle,
  PenSquare,
  RefreshCw
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ContentGeneratorProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function ContentGenerator({ mobileMenuOpen, setMobileMenuOpen }: ContentGeneratorProps) {
  const [activeTab, setActiveTab] = useState("generator");
  const { selectedProperty, selectProperty } = usePropertyStore();
  const { 
    contentType, setContentType, 
    brandVoice, setBrandVoice, 
    useBrandVoice, setUseBrandVoice,
    ctaEnhancements, setCTAEnhancements, 
    generateContent, loading,
    generatedContent,
    photoData, setPhotoData, clearPhotoData,
    currentLoadingMessage,
    contentLength, setContentLength,
    customWordCount, setCustomWordCount,
    saveContent,
    resetGenerator
  } = useContentStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [gapStartDate, setGapStartDate] = useState("");
  const [gapEndDate, setGapEndDate] = useState("");
  const [specialOffer, setSpecialOffer] = useState("");
  const generatedContentRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to generated content when it's available
  useEffect(() => {
    if (generatedContent && generatedContentRef.current) {
      generatedContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [generatedContent]);

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (10MB max for initial upload - we'll compress it)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 10MB",
        variant: "destructive"
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Show loading toast
      toast({
        title: "Processing image",
        description: "Optimizing your photo for best quality...",
      });
      
      // Compress image and create preview URL
      const { file: compressedFile, url: previewUrl } = await createImagePreview(file);
      
      // Calculate compression percentage
      const compressionPercent = Math.round((1 - (compressedFile.size / file.size)) * 100);
      
      // Show success message if compression was significant
      if (compressionPercent > 20) {
        toast({
          title: "Image optimized",
          description: `Reduced file size by ${compressionPercent}% while preserving quality.`,
        });
      }
      
      // Update photoData in store
      setPhotoData({
        file: compressedFile,
        preview: previewUrl,
        description: null
      });
    } catch (error) {
      console.error('Error processing image:', error);
      
      // Fallback to uncompressed version
      const previewUrl = URL.createObjectURL(file);
      setPhotoData({
        file,
        preview: previewUrl,
        description: null
      });
      
      toast({
        title: "Image processing issue",
        description: "Using original image instead. Everything should still work fine.",
        variant: "destructive"
      });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleGenerateContent = async () => {
    if (!selectedProperty) {
      toast({
        title: "No property selected",
        description: "Please select a property to generate content",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateContent(selectedProperty);
    } catch (error) {
      toast({
        title: "Oops! Couldn't generate this time",
        description: "Try again or upload a new photo",
        variant: "destructive",
      });
    }
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Function to handle slider change and update content length
  const handleLengthChange = (value: number) => {
    setCustomWordCount(value);
    
    // Update content length category based on word count
    if (value <= 50) {
      setContentLength('short');
    } else if (value <= 150) {
      setContentLength('medium');
    } else {
      setContentLength('long');
    }
  };

  // Function to handle preset button clicks
  const handlePresetClick = (length: string, count: number) => {
    setContentLength(length);
    setCustomWordCount(count);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 pb-16 md:pb-0">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-4 md:p-6 mt-2">
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-semibold text-neutral-800 mb-3">Create with HostPrompt</h2>
            <p className="text-neutral-600">Craft engaging content for your properties that connects with guests.</p>
          </div>

          {/* Brand Voice Preview section removed to eliminate duplication */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Property Selection & Settings */}
            <div className="lg:col-span-1">
              {/* Property Selector Component with enhanced visual styling */}
              <PropertySelector 
                onSelect={selectProperty} 
                selectedProperty={selectedProperty} 
              />

              {/* Photo Upload/Selection Section */}
              <PhotoSelector 
                onImageSelected={(file: File, preview: string) => {
                  setPhotoData({
                    file,
                    preview,
                    description: null
                  });
                }}
                clearPhotoData={clearPhotoData}
                currentPreview={photoData.preview}
              />

              {/* Content Settings */}
              <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-5 mt-6">
                {/* Content Type Dropdown */}
                <h3 className="font-heading font-medium text-lg mb-3">What do you want to create?</h3>
                <div className="mb-6">
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full p-3 bg-white border border-neutral-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-700"
                  >
                    <option value="social_media_caption">Social Media Caption</option>
                    <option value="listing_description">Listing Description</option>
                    <option value="welcome_message">Welcome Message</option>
                    <option value="house_rules">House Rules Reminder</option>
                    <option value="guest_reengagement">Guest Re-engagement Message</option>
                  </select>
                  
                  {/* Content type description based on selection */}
                  <div className="mt-2 px-1">
                    {contentType === 'social_media_caption' && (
                      <p className="text-xs text-neutral-500">Instagram, Facebook, TikTok. Short, visual, and eye-catching.</p>
                    )}
                    

                    
                    {contentType === 'listing_description' && (
                      <p className="text-xs text-neutral-500">For Airbnb/Vrbo. Clear, informative, feature-focused.</p>
                    )}
                    
                    {contentType === 'welcome_message' && (
                      <p className="text-xs text-neutral-500">Sent after booking. Friendly, sets expectations, builds excitement.</p>
                    )}
                    
                    {contentType === 'house_rules' && (
                      <p className="text-xs text-neutral-500">For check-in messages. Polite but clear on expectations.</p>
                    )}
                    
                    {contentType === 'guest_reengagement' && (
                      <p className="text-xs text-neutral-500">Post-stay follow-ups, review requests, thank-yous, return offers.</p>
                    )}
                  </div>
                </div>

                {/* Brand Voice */}
                <h3 className="font-heading font-medium text-lg mb-3">What's the vibe you're going for?</h3>
                <div className="space-y-4 mb-6">
                  {/* Brand Voice Toggle when a property with brand voice is selected */}
                  {selectedProperty?.brandVoice && (
                    <div className="flex items-center justify-between mb-4 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                      <div className="flex items-center">
                        <MessageCircle className="h-5 w-5 text-[#FF5C5C] mr-2" />
                        <span className="text-sm font-medium">Use {selectedProperty.name}'s brand voice</span>
                      </div>
                      <Switch 
                        checked={useBrandVoice} 
                        onCheckedChange={(checked) => setUseBrandVoice(checked)}
                        className="data-[state=checked]:bg-[#FF5C5C]" 
                      />
                    </div>
                  )}
                
                  {/* Display custom brand voice when active */}
                  {selectedProperty?.brandVoice && useBrandVoice ? (
                    <div className="bg-gradient-to-br from-[rgba(255,92,92,0.1)] to-[rgba(147,51,234,0.05)] border border-[rgba(255,92,92,0.2)] rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="text-[#FF5C5C] mt-0.5 mr-2">
                          <Info className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="text-sm font-medium text-neutral-800">Custom brand voice</h4>
                            <span className="ml-2 px-2 py-0.5 bg-[#FF5C5C] text-white text-xs rounded-full">Active</span>
                          </div>
                          <p className="text-xs text-neutral-700 mt-1">
                            <span className="font-semibold">Voice Profile:</span> 
                            <span className="font-medium"> "{selectedProperty.brandVoice}"</span>
                            {selectedProperty.useBrandVoiceDefault && 
                              <span className="ml-1 text-[#FF5C5C] text-xs font-medium">(Default)</span>
                            }
                          </p>
                          {selectedProperty.brandVoiceSummary && (
                            <p className="text-xs text-neutral-700 mt-1 italic">
                              "{selectedProperty.brandVoiceSummary}"
                            </p>
                          )}
                          <div className="flex items-center mt-3 pt-2 border-t border-[rgba(255,92,92,0.1)]">
                            <button
                              onClick={() => setLocation('/property')}
                              className="text-xs text-[#FF5C5C] font-medium hover:underline flex items-center"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit in Property Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">What's the mood you're after?</label>
                        <select 
                          value={brandVoice.tone}
                          onChange={(e) => setBrandVoice({ ...brandVoice, tone: e.target.value })}
                          className="w-full rounded-lg border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                          <option value="professional">Polished & trustworthy</option>
                          <option value="friendly">Warm & welcoming</option>
                          <option value="luxury">Elegant & sophisticated</option>
                          <option value="casual">Laid-back & approachable</option>
                          <option value="exciting">Energetic & vibrant</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">How should your story flow?</label>
                        <select 
                          value={brandVoice.style}
                          onChange={(e) => setBrandVoice({ ...brandVoice, style: e.target.value })}
                          className="w-full rounded-lg border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                          <option value="descriptive">Paint a vivid picture</option>
                          <option value="minimalist">Short & sweet</option>
                          <option value="storytelling">Tell a little story</option>
                          <option value="direct">Get straight to the point</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                {/* Content Length Control - Moved outside of Advanced Options */}
                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <label className="block text-sm font-medium text-neutral-700">Content length</label>
                      <div className="relative group ml-1.5">
                        <button className="text-neutral-400 hover:text-neutral-600">
                          <Info className="h-4 w-4" />
                        </button>
                        <div className="absolute left-0 bottom-full mb-2 w-64 bg-neutral-800 text-white text-xs rounded p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          Control how long your content should be — from brief captions to detailed descriptions.
                          <div className="absolute left-2 top-full h-2 w-2 bg-neutral-800 transform rotate-45"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Word count display */}
                    <div className="text-neutral-700">
                      <span className="text-sm font-medium">Words: </span>
                      <span className="text-sm font-bold">{customWordCount}</span>
                    </div>
                  </div>
                  
                  {/* Content length slider */}
                  <div className="mt-2 space-y-4">
                    {/* Slider control */}
                    <div>
                      <input
                        type="range"
                        min="5"
                        max="300"
                        step="5"
                        value={customWordCount}
                        onChange={(e) => handleLengthChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#FF5C5C]"
                      />
                      
                      {/* Range indicators */}
                      <div className="flex justify-between mt-1 text-xs text-neutral-500">
                        <span>5</span>
                        <span>150</span>
                        <span>300</span>
                      </div>
                    </div>
                    
                    {/* Quick selection preset buttons */}
                    <div className="flex justify-between items-center mt-2">
                      <button 
                        onClick={() => handlePresetClick('short', 30)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          contentLength === 'short' 
                            ? 'bg-[#FF5C5C] text-white' 
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        Short (30)
                      </button>
                      <button 
                        onClick={() => handlePresetClick('medium', 100)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          contentLength === 'medium' 
                            ? 'bg-[#FF5C5C] text-white' 
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        Medium (100)
                      </button>
                      <button 
                        onClick={() => handlePresetClick('long', 200)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          contentLength === 'long' 
                            ? 'bg-[#FF5C5C] text-white' 
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        Long (200)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Advanced Options (Collapsible) */}
                <div className="mt-6">
                  <button
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="w-full flex justify-between items-center text-neutral-700 hover:text-neutral-800 font-medium text-sm mb-3"
                  >
                    <span className="font-heading font-medium text-lg">Advanced options</span>
                    <ChevronRight className={`h-5 w-5 transition-transform ${showAdvancedOptions ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {showAdvancedOptions && (
                    <div className="mb-6 border-t border-neutral-100 pt-3">
                      {/* Human CTA Enhancement */}
                      <h3 className="font-heading font-medium text-lg mb-3">How do you want it to end?</h3>
                      <div className="space-y-3">
                        {/* Create urgency option */}
                        <div className="flex items-center gap-2 relative">
                          <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <input 
                              id="urgency" 
                              type="checkbox" 
                              checked={ctaEnhancements.urgency} 
                              onChange={() => setCTAEnhancements({ ...ctaEnhancements, urgency: !ctaEnhancements.urgency })}
                              className="rounded text-primary-500 focus:ring-primary-500 h-4 w-4"
                              style={{ touchAction: 'manipulation' }}
                            />
                          </div>
                          <label 
                            htmlFor="urgency" 
                            className="text-sm text-neutral-700 flex-grow cursor-pointer"
                            onClick={() => setCTAEnhancements({ ...ctaEnhancements, urgency: !ctaEnhancements.urgency })}
                          >
                            Add a touch of "book soon!"
                          </label>
                          <div className="relative flex-shrink-0">
                            <span className="cursor-pointer text-neutral-400 group block" tabIndex={0}>
                              <Info className="h-4 w-4" />
                              {/* Desktop-only tooltip */}
                              <div className="absolute bottom-full right-0 mb-2 w-64 rounded bg-black text-white text-xs px-3 py-2 hidden group-hover:block md:group-hover:block z-50 shadow-lg pointer-events-none">
                                Encourage immediate action with phrases like "Limited availability" or "Book now before it's gone!"
                              </div>
                            </span>
                          </div>
                        </div>
                        
                        {/* Add social proof option */}
                        <div className="flex items-center gap-2 relative">
                          <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <input 
                              id="socialProof" 
                              type="checkbox" 
                              checked={ctaEnhancements.socialProof} 
                              onChange={() => setCTAEnhancements({ ...ctaEnhancements, socialProof: !ctaEnhancements.socialProof })}
                              className="rounded text-primary-500 focus:ring-primary-500 h-4 w-4"
                              style={{ touchAction: 'manipulation' }}
                            />
                          </div>
                          <label 
                            htmlFor="socialProof" 
                            className="text-sm text-neutral-700 flex-grow cursor-pointer"
                            onClick={() => setCTAEnhancements({ ...ctaEnhancements, socialProof: !ctaEnhancements.socialProof })}
                          >
                            Mention how others love it
                          </label>
                          <div className="relative flex-shrink-0">
                            <span className="cursor-pointer text-neutral-400 group block" tabIndex={0}>
                              <Info className="h-4 w-4" />
                              {/* Desktop-only tooltip */}
                              <div className="absolute bottom-full right-0 mb-2 w-64 rounded bg-black text-white text-xs px-3 py-2 hidden group-hover:block md:group-hover:block z-50 shadow-lg pointer-events-none">
                                Build trust with mentions like "Join our 500+ happy guests" or "Consistently 5-star rated"
                              </div>
                            </span>
                          </div>
                        </div>
                        
                        {/* Benefits option */}
                        <div className="flex items-center gap-2 relative">
                          <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <input 
                              id="benefits" 
                              type="checkbox" 
                              checked={ctaEnhancements.benefits} 
                              onChange={() => setCTAEnhancements({ ...ctaEnhancements, benefits: !ctaEnhancements.benefits })}
                              className="rounded text-primary-500 focus:ring-primary-500 h-4 w-4"
                              style={{ touchAction: 'manipulation' }}
                            />
                          </div>
                          <label 
                            htmlFor="benefits" 
                            className="text-sm text-neutral-700 flex-grow cursor-pointer"
                            onClick={() => setCTAEnhancements({ ...ctaEnhancements, benefits: !ctaEnhancements.benefits })}
                          >
                            Show off the extras they'll love
                          </label>
                          <div className="relative flex-shrink-0">
                            <span className="cursor-pointer text-neutral-400 group block" tabIndex={0}>
                              <Info className="h-4 w-4" />
                              {/* Desktop-only tooltip */}
                              <div className="absolute bottom-full right-0 mb-2 w-64 rounded bg-black text-white text-xs px-3 py-2 hidden group-hover:block md:group-hover:block z-50 shadow-lg pointer-events-none">
                                Emphasize value with "Includes free airport pickup" or "Complimentary breakfast daily"
                              </div>
                            </span>
                          </div>
                        </div>
                        
                        {/* Direct option */}
                        <div className="flex items-center gap-2 relative">
                          <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <input 
                              id="directCTA" 
                              type="checkbox" 
                              checked={ctaEnhancements.directCTA} 
                              onChange={() => setCTAEnhancements({ ...ctaEnhancements, directCTA: !ctaEnhancements.directCTA })}
                              className="rounded text-primary-500 focus:ring-primary-500 h-4 w-4"
                              style={{ touchAction: 'manipulation' }}
                            />
                          </div>
                          <label 
                            htmlFor="directCTA" 
                            className="text-sm text-neutral-700 flex-grow cursor-pointer"
                            onClick={() => setCTAEnhancements({ ...ctaEnhancements, directCTA: !ctaEnhancements.directCTA })}
                          >
                            Add a clear "next step" invitation
                          </label>
                          <div className="relative flex-shrink-0">
                            <span className="cursor-pointer text-neutral-400 group block" tabIndex={0}>
                              <Info className="h-4 w-4" />
                              {/* Desktop-only tooltip */}
                              <div className="absolute bottom-full right-0 mb-2 w-64 rounded bg-black text-white text-xs px-3 py-2 hidden group-hover:block md:group-hover:block z-50 shadow-lg pointer-events-none">
                                End with a clear instruction like "Book now" or "Message us to reserve your stay"
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Booking Gap Section */}
                      <div className="mt-6 pt-4 border-t border-neutral-100">
                        {/* Any booking gap content would go here */}
                      </div>
                    </div>
                  )}
                </div>

                {/* Generate Content Button */}
                <div>
                  <button 
                    onClick={handleGenerateContent} 
                    disabled={!selectedProperty || loading}
                    className={`w-full rounded-lg px-4 py-3 font-medium transition-colors ${
                      !selectedProperty || loading
                        ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                        : 'bg-[#FF5C5C] hover:bg-[#FF7070] text-white'
                    }`}
                  >
                    <span className="font-semibold">{loading ? currentLoadingMessage : 'Create Content'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Created Content */}
            <div className="bg-white border border-neutral-200 rounded-xl shadow-sm lg:col-span-2" ref={generatedContentRef}>
              <div className="p-5 border-b border-neutral-200">
                <h3 className="font-heading font-medium text-lg">
                  {generatedContent 
                    ? "Here's your content — human, on-brand, and ready to share." 
                    : "Your Content"}
                </h3>
              </div>
              
              {/* Loading State with Animation */}
              {loading && (
                <div className="p-5">
                  <div className="animate-pulse space-y-3">
                    <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-5 bg-neutral-200 rounded"></div>
                    <div className="h-5 bg-neutral-200 rounded"></div>
                    <div className="h-5 bg-neutral-200 rounded w-1/2"></div>
                    <div className="h-5 bg-neutral-200 rounded w-2/3"></div>
                    <div className="h-5 bg-neutral-200 rounded"></div>
                    <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
                  </div>
                </div>
              )}
              
              {/* Content Preview Component */}
              {!loading && (
                <div className="p-5">
                  {generatedContent ? (
                    <div className="mb-4">
                      <ContentPreview />
                      
                      {/* Main Action Buttons */}
                      <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-3 sm:space-y-0 mt-6">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedContent.content);
                            toast({
                              title: "All set for posting!",
                              description: "Your content is ready to share with the world.",
                            });
                          }}
                          className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center text-sm font-medium transition-colors"
                          title="Copy content to clipboard for pasting elsewhere"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy for Posting
                        </button>
                        
                        <button
                          onClick={() => {
                            saveContent();
                            toast({
                              title: "Nice! Saved to your collection",
                              description: "You can find this in your library anytime you need it.",
                            });
                          }}
                          className="px-4 py-2 rounded-lg bg-[#FF5C5C] hover:bg-[#FF7070] text-white flex items-center justify-center text-sm font-medium transition-colors"
                          title="Save this content to your library for future use"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Content
                        </button>
                        
                        <button
                          onClick={() => {
                            if (window.confirm("Start fresh? This will clear all current content and settings.")) {
                              resetGenerator();
                              toast({
                                title: "Reset complete!",
                                description: "Generator has been reset to start fresh.",
                              });
                            }
                          }}
                          className="px-4 py-2 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-700 flex items-center justify-center text-sm font-medium transition-colors"
                          title="Reset all fields and start with fresh content creation"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Start Fresh
                        </button>
                      </div>
                      
                      {/* Social Channel CTAs */}
                      <div className="mt-8 pt-6 border-t border-neutral-200">
                        <h4 className="text-sm font-medium text-neutral-700 mb-3">Share directly to social media:</h4>
                        
                        {/* Social Buttons Row */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          
                          {/* Instagram */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(generatedContent.content);
                              window.open('https://business.instagram.com/', '_blank');
                              toast({
                                title: "Ready for the 'gram!",
                                description: "Your caption is copied and Instagram is open and waiting",
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-[#E1306C] text-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-colors flex items-center"
                          >
                            <Instagram className="h-4 w-4 mr-1.5" />
                            Instagram
                          </button>
                          
                          {/* Facebook */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(generatedContent.content);
                              window.open('https://www.facebook.com/', '_blank');
                              toast({
                                title: "Facebook post ready!",
                                description: "Just paste your content and you're good to go",
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors flex items-center"
                          >
                            <Facebook className="h-4 w-4 mr-1.5" />
                            Facebook
                          </button>
                          
                          {/* X */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(generatedContent.content);
                              window.open('https://twitter.com/compose/tweet', '_blank');
                              toast({
                                title: "Tweet away!",
                                description: "Your post is copied and ready to share on X",
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-black text-black hover:bg-black hover:text-white transition-colors flex items-center"
                          >
                            <Twitter className="h-4 w-4 mr-1.5" />
                            X
                          </button>
                          
                          {/* TikTok */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(generatedContent.content);
                              window.open('https://www.tiktok.com/upload?lang=en', '_blank');
                              toast({
                                title: "TikTok time!",
                                description: "Your caption is copied for your next viral video",
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-black text-black hover:bg-black hover:text-white transition-colors flex items-center"
                          >
                            <Music className="h-4 w-4 mr-1.5" />
                            TikTok
                          </button>
                          
                          {/* Meta Business Suite */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(generatedContent.content);
                              window.open('https://business.facebook.com/latest/home', '_blank');
                              toast({
                                title: "Opening Meta Business Suite",
                                description: "Content copied and Meta Business Suite opened",
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#FF5C5C] text-white hover:bg-[#e14c4c] transition-colors flex items-center relative group"
                          >
                            <Facebook className="h-4 w-4 mr-1.5" />
                            Meta Business
                            <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 w-56 text-center z-10">
                              Manage and schedule Instagram & Facebook posts
                              <div className="absolute left-1/2 top-full -translate-x-1/2 h-2 w-2 bg-black transform rotate-45"></div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <p className="text-neutral-600">Your generated content will appear here. Select a property and click "Create Content" to get started.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}