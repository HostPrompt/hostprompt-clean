import { create } from 'zustand';
import { apiRequest } from '@/lib/queryClient';
import { Property } from '@shared/schema';
import { getUserId } from '@/lib/userId';

interface GeneratedContent {
  id?: number;
  title: string;
  content: string;
  keywords: string[];
  contentType: string;
  propertyId: number;
  property?: Property;
  dateGenerated?: string;
  imageUrl?: string;
  brandVoice?: string;
  ctaEnhancements?: {
    urgency: boolean;
    socialProof: boolean;
    benefits: boolean;
  };
}

interface BrandVoice {
  tone: string;
  style: string;
}

interface CTAEnhancements {
  urgency: boolean;
  socialProof: boolean;
  benefits: boolean;
  directCTA: boolean;
}

interface SocialSettings {
  hashtags: string[];
  cta: string;
}

interface PhotoData {
  file: File | null;
  preview: string | null;
  description: string | null;
}

interface ContentStore {
  contentType: string;
  brandVoice: BrandVoice;
  useBrandVoice: boolean;
  ctaEnhancements: CTAEnhancements;
  generatedContent: GeneratedContent | null;
  savedContent: GeneratedContent | null;
  savedContentLibrary: GeneratedContent[];
  loading: boolean;
  editingWithPrompt: boolean;
  error: string | null;
  socialSettings: SocialSettings;
  previewPlatform: string;
  photoData: PhotoData;
  contentLength: string;
  customWordCount: number;
  loadingMessages: string[];
  currentLoadingMessage: string;
  suggestedHashtags: string[];
  setContentType: (type: string) => void;
  setBrandVoice: (voice: Partial<BrandVoice>) => void;
  setUseBrandVoice: (use: boolean) => void;
  setCTAEnhancements: (enhancements: Partial<CTAEnhancements>) => void;
  setContentLength: (length: string) => void;
  setCustomWordCount: (count: number) => void;
  generateContent: (property: Property) => Promise<void>;
  saveContent: () => void;
  deleteContent: (index: number) => void;
  bulkDeleteContent: (indices: number[]) => void;
  updateGeneratedContent: (content: Partial<GeneratedContent>) => void;
  setSocialSettings: (settings: Partial<SocialSettings>) => void;
  setPreviewPlatform: (platform: string) => void;
  addKeyword: (keyword: string) => void;
  removeKeyword: (index: number) => void;
  addHashtag: (hashtag: string) => void;
  removeHashtag: (index: number) => void;
  appendHashtagToContent: (hashtag: string) => void;
  generateSuggestedHashtags: (property: Property) => void;
  addCustomHashtag: (hashtag: string) => void;
  setPhotoData: (data: Partial<PhotoData>) => void;
  clearPhotoData: () => void;
  analyzePhotoWithAI: (file: File) => Promise<string>;
  updateLoadingMessage: () => void;
  resetGenerator: () => void; // New method to reset generator state
  editContentWithPrompt: (prompt: string, property: Property) => Promise<void>; // New method to edit content with prompts
}

// Function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const useContentStore = create<ContentStore>((set, get) => {
  
  // Load saved content from database when the store is initialized
  const initializeStore = async () => {
    try {
      const contents = await apiRequest('GET', '/api/contents');
      
      // Transform content from database format to GeneratedContent format
      const formattedContents = contents.map((content: any) => {
        // Parse CTA enhancements if it's a string
        let ctaEnhancements = content.ctaEnhancements;
        if (typeof content.ctaEnhancements === 'string') {
          try {
            ctaEnhancements = JSON.parse(content.ctaEnhancements);
          } catch (e) {
            ctaEnhancements = {
              urgency: false,
              socialProof: false,
              benefits: false,
              directCTA: false
            };
          }
        }
        
        return {
          id: content.id,
          title: content.title,
          content: content.content,
          keywords: content.keywords,
          contentType: content.contentType,
          propertyId: content.propertyId,
          dateGenerated: content.dateGenerated,
          imageUrl: content.imageUrl,
          brandVoice: content.brandVoice,
          ctaEnhancements: ctaEnhancements || {
            urgency: false,
            socialProof: false,
            benefits: false,
            directCTA: false
          }
        };
      });
      
      set({ savedContentLibrary: formattedContents });
      
      // If there's at least one saved content, set it as the current saved content
      if (formattedContents.length > 0) {
        set({ savedContent: formattedContents[0] });
      }
    } catch (error) {
      console.error('Error loading saved content:', error);
    }
  };
  
  // Initialize the store
  initializeStore();
  
  return {
    suggestedHashtags: [],
    contentType: 'social_media_caption',
    brandVoice: {
      tone: 'professional',
      style: 'descriptive'
    },
    useBrandVoice: true,
    ctaEnhancements: {
      urgency: false,
      socialProof: false,
      benefits: false,
      directCTA: false
    },
    generatedContent: null,
    savedContent: null,
    savedContentLibrary: [],
    loading: false,
    editingWithPrompt: false,
    error: null,
    socialSettings: {
      hashtags: [],
      cta: 'Book now for your next dream getaway! Link in bio.'
    },
    previewPlatform: 'instagram',
    photoData: {
      file: null,
      preview: null,
      description: null
    },
    contentLength: 'medium',
    customWordCount: 50,
    loadingMessages: [
      "Ooh, loving this photo!",
      "Spotting all those amazing details...", 
      "Bringing your style to life...",
      "Making sure this sounds just like you...",
      "Adding that special spark...",
      "Just putting on the finishing touches..."
    ],
    currentLoadingMessage: "Getting inspired by your amazing space...",
    
    setContentType: (type) => {
      set({ contentType: type });
    },
    
    setBrandVoice: (voice) => {
      set((state) => ({
        brandVoice: { ...state.brandVoice, ...voice }
      }));
    },
    
    setUseBrandVoice: (use) => {
      set({ useBrandVoice: use });
    },
    
    setCTAEnhancements: (enhancements) => {
      set((state) => ({
        ctaEnhancements: { ...state.ctaEnhancements, ...enhancements }
      }));
    },
    
    setPhotoData: (data) => set((state) => ({
      photoData: {
        ...state.photoData,
        ...data,
      }
    })),
    
    clearPhotoData: () => set({
      photoData: {
        file: null,
        preview: null,
        description: null
      }
    }),
    
    analyzePhotoWithAI: async (file) => {
      try {
        // Convert the file to base64
        const base64Image = await fileToBase64(file);
        
        // Make API request to analyze the photo
        const response = await fetch('/api/analyze-photo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ base64Image }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to analyze photo');
        }
        
        const data = await response.json();
        return data.description;
      } catch (error) {
        console.error('Error analyzing photo:', error);
        return 'Unable to analyze photo';
      }
    },
    
    updateLoadingMessage: () => {
      const { loadingMessages } = get();
      // Get a random loading message
      const randomIndex = Math.floor(Math.random() * loadingMessages.length);
      set({ currentLoadingMessage: loadingMessages[randomIndex] });
    },
    
    generateContent: async (property) => {
      const { 
        contentType, 
        brandVoice, 
        useBrandVoice,
        ctaEnhancements,
        contentLength,
        customWordCount,
        photoData,
        updateLoadingMessage
      } = get();
      
      // Set loading state
      set({ loading: true, error: null });
      
      // Set up interval to update loading message every 3 seconds
      const updateLoading = setInterval(() => {
        updateLoadingMessage();
      }, 3000);
      
      try {
        // Prepare the API payload
        const payload: any = {
          propertyId: property.id,
          contentType,
          // If property has a custom brand voice, always use it (regardless of default setting)
          // If useBrandVoice is true and property has a brandVoice, use the property's full brand voice
          // Otherwise use the UI selections
          brandVoice: (useBrandVoice && property.brandVoice) 
            ? { 
                tone: 'custom', 
                style: 'custom',
                customVoice: property.brandVoice,
                customVoiceSummary: property.brandVoiceSummary
              } 
            : brandVoice,
          ctaEnhancements,
          contentLength,
          customWordCount,
          propertyBrandVoice: property.brandVoice,
          useBrandVoiceDefault: property.useBrandVoiceDefault || false,
          // Pass saved hashtags to backend for content generation
          savedHashtags: property.savedHashtags || []
        };
        
        // Include booking gap data if available
        if (contentType === 'booking_gap_filler' && 'bookingGap' in property) {
          // For booking gap filler, set content type as a special value to ensure proper handling
          payload.contentType = 'booking_gap_filler_special';
          payload.bookingGap = property.bookingGap;
          console.log("Sending booking gap data to backend:", property.bookingGap);
        }
        
        // Include photo data if available
        if (photoData.file && photoData.preview) {
          try {
            const base64Image = await fileToBase64(photoData.file);
            payload.photoData = {
              base64Image,
              description: photoData.description || null
            };
          } catch (err) {
            console.error('Error converting image to base64:', err);
            // Continue without photo data
            payload.photoData = null;
          }
        }
        
        // Call the API to generate content
        const response = await apiRequest('POST', '/api/generate-content', payload);
        
        // Add the property to the response
        if (response && typeof response === 'object') {
          // Convert API response to the expected format
          const responseData = response as any;
          
          const content: GeneratedContent = {
            title: responseData.title || `Discover ${property.name}`,
            content: responseData.content || '',
            keywords: responseData.keywords || [],
            contentType: responseData.contentType || contentType,
            propertyId: responseData.propertyId || property.id,
            property,
            imageUrl: photoData.preview || undefined,
            dateGenerated: new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            }),
            brandVoice: `${brandVoice.tone} + ${brandVoice.style}`,
            ctaEnhancements
          };
          
          // Automatically save the generated content
          // This ensures content persists until manually cleared by the user
          const { savedContentLibrary } = get();
          
          // We no longer remove hashtags from content text
          // Previously it was: content.content = content.content.replace(/#[\w\d]+/g, '').trim();
          
          // When property has saved hashtags, don't use any generated keywords
          if (property.savedHashtags && property.savedHashtags.length > 0) {
            // Completely replace the generated keywords with saved hashtags only
            content.keywords = [...property.savedHashtags];
            
            // Use ONLY the property's saved hashtags for social settings
            set({ 
              socialSettings: {
                ...get().socialSettings,
                hashtags: [...property.savedHashtags]
              }
            });
          } else {
            // Even if no saved hashtags, we won't use generic ones
            // Clear out all keywords to avoid generic hashtags
            content.keywords = [];
            
            // Clear hashtags in social settings
            set({ 
              socialSettings: {
                ...get().socialSettings,
                hashtags: []
              }
            });
          }
          
          // Clear the unused variable
          // We're not adding hashtags directly to content text
          // but keeping them in the social settings only
          
          // Set the state with all updates
          set({ 
            generatedContent: content,
            savedContent: content, // This ensures content is available for the social preview
            loading: false 
          });
        } else {
          throw new Error('Invalid response from content generation API');
        }
      } catch (error) {
        console.error('Content generation error:', error);
        set({ error: (error as Error).message || 'Failed to generate content', loading: false });
      }
      
      clearInterval(updateLoading);
    },
    
    saveContent: async () => {
      const { generatedContent, photoData, brandVoice, ctaEnhancements, savedContentLibrary } = get();
      if (generatedContent) {
        // Check for exact duplicates in the saved content library to prevent saving the same content
        const isDuplicate = savedContentLibrary.some(savedItem => 
          savedItem.content === generatedContent.content && 
          savedItem.title === generatedContent.title &&
          savedItem.propertyId === generatedContent.propertyId
        );
        
        if (isDuplicate) {
          console.log('This content is already saved in the library, preventing duplicate save');
          // Return the existing saved content with the same values
          return savedContentLibrary.find(savedItem => 
            savedItem.content === generatedContent.content && 
            savedItem.title === generatedContent.title &&
            savedItem.propertyId === generatedContent.propertyId
          );
        }
        
        // Create a formatted date
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
        
        // Create an enhanced content object with additional metadata
        const enhancedContent = { 
          ...generatedContent,
          dateGenerated: formattedDate,
          imageUrl: photoData.preview || undefined,
          // Include additional metadata:
          brandVoice: `${brandVoice.tone} + ${brandVoice.style}`,
          ctaEnhancements: ctaEnhancements
        };

        try {
          // Save to database via API
          const contentToSave = {
            title: enhancedContent.title,
            content: enhancedContent.content,
            keywords: enhancedContent.keywords,
            contentType: enhancedContent.contentType,
            propertyId: enhancedContent.propertyId,
            userId: getUserId(), // Add the user ID from localStorage
            imageUrl: enhancedContent.imageUrl,
            dateGenerated: enhancedContent.dateGenerated,
            brandVoice: enhancedContent.brandVoice,
            // Convert ctaEnhancements to string for storage
            ctaEnhancements: JSON.stringify(enhancedContent.ctaEnhancements)
          };
          
          const savedContent = await apiRequest('POST', '/api/contents', contentToSave);
          
          // Update state with the saved content including the database ID
          const savedContentWithId = {
            ...enhancedContent,
            id: savedContent.id
          };
          
          // Store to both current savedContent and the library array
          set({ 
            savedContent: savedContentWithId,
            savedContentLibrary: [savedContentWithId, ...savedContentLibrary]
          });
          
          return savedContentWithId;

        } catch (error) {
          console.error('Error saving content to database:', error);
          
          // Fall back to local storage if API call fails
          set({ 
            savedContent: enhancedContent,
            savedContentLibrary: [enhancedContent, ...savedContentLibrary]
          });
          
          return enhancedContent;
        }
      }
    },
    
    deleteContent: async (index: number) => {
      const { savedContentLibrary } = get();
      // Get the content to delete
      const contentToDelete = savedContentLibrary[index];
      
      if (!contentToDelete) return;
      
      // Create a new array without the item at the specified index
      const updatedLibrary = [...savedContentLibrary];
      updatedLibrary.splice(index, 1);
      
      // Update the state immediately for better UX
      set({ savedContentLibrary: updatedLibrary });
      
      // If the content has an ID, delete it from the database
      if (contentToDelete.id) {
        try {
          await apiRequest('DELETE', `/api/contents/${contentToDelete.id}`);
        } catch (error) {
          console.error('Error deleting content from database:', error);
          // If the API call fails, we don't revert the UI state to avoid confusion
          // The content will be removed from the UI but might remain in the database
        }
      }
    },
    
    bulkDeleteContent: async (indices: number[]) => {
      const { savedContentLibrary } = get();
      
      if (indices.length === 0) return;
      
      // Create a copy of the library
      const updatedLibrary = [...savedContentLibrary];
      
      // Sort indices in descending order to avoid index shifting problems
      const sortedIndices = [...indices].sort((a, b) => b - a);
      
      // Process deletions in reverse order
      for (const index of sortedIndices) {
        if (index >= 0 && index < updatedLibrary.length) {
          const contentToDelete = updatedLibrary[index];
          
          // Remove the item from the array
          updatedLibrary.splice(index, 1);
          
          // If the content has an ID, delete it from the database
          if (contentToDelete && contentToDelete.id) {
            try {
              await apiRequest('DELETE', `/api/contents/${contentToDelete.id}`);
            } catch (error) {
              console.error('Error deleting content from database:', error);
            }
          }
        }
      }
      
      // Update the state
      set({ savedContentLibrary: updatedLibrary });
    },
    
    updateGeneratedContent: (content) => {
      set((state) => ({
        generatedContent: state.generatedContent 
          ? { ...state.generatedContent, ...content } 
          : null
      }));
    },
    
    setSocialSettings: (settings) => {
      set((state) => ({
        socialSettings: { ...state.socialSettings, ...settings }
      }));
    },
    
    setPreviewPlatform: (platform) => {
      set({ previewPlatform: platform });
    },
    
    setContentLength: (length) => {
      set({ contentLength: length });
    },
    
    setCustomWordCount: (count) => {
      set({ customWordCount: count });
    },
    
    addKeyword: (keyword) => {
      const { generatedContent } = get();
      if (generatedContent && keyword && !generatedContent.keywords.includes(keyword)) {
        set({
          generatedContent: {
            ...generatedContent,
            keywords: [...generatedContent.keywords, keyword]
          }
        });
      }
    },
    
    removeKeyword: (index) => {
      const { generatedContent } = get();
      if (generatedContent) {
        const newKeywords = [...generatedContent.keywords];
        newKeywords.splice(index, 1);
        set({
          generatedContent: {
            ...generatedContent,
            keywords: newKeywords
          }
        });
      }
    },
    
    addHashtag: (hashtag) => {
      if (hashtag.trim()) {
        set((state) => ({
          socialSettings: {
            ...state.socialSettings,
            hashtags: [...state.socialSettings.hashtags, hashtag.trim()]
          }
        }));
      }
    },
    
    removeHashtag: (index) => {
      set((state) => {
        const newHashtags = [...state.socialSettings.hashtags];
        newHashtags.splice(index, 1);
        return {
          socialSettings: {
            ...state.socialSettings,
            hashtags: newHashtags
          }
        };
      });
    },
    
    generateSuggestedHashtags: async (property) => {
      try {
        // This would typically be an API call to suggest relevant hashtags
        // For simplicity, we're generating a set of hashtags based on property data
        const propertyType = property.name.toLowerCase().includes('house') ? 'house' : 
                              property.name.toLowerCase().includes('apartment') ? 'apartment' : 
                              property.name.toLowerCase().includes('villa') ? 'villa' : 'rental';
                              
        const location = property.location.split(',')[0].trim().toLowerCase().replace(/\s+/g, '');
        
        const amenities = property.amenities.filter(a => a.length < 10).map(a => a.toLowerCase().replace(/\s+/g, ''));
        
        const baseHashtags = ['vacation', 'travel', propertyType, location, 'getaway'];
        const amenityHashtags = amenities.slice(0, 3);
        
        set({ suggestedHashtags: [...baseHashtags, ...amenityHashtags] });
      } catch (error) {
        console.error('Error generating hashtags:', error);
      }
    },
    
    addCustomHashtag: (hashtag) => {
      const { suggestedHashtags } = get();
      if (hashtag && !suggestedHashtags.includes(hashtag)) {
        set({ suggestedHashtags: [...suggestedHashtags, hashtag] });
      }
    },
    
    appendHashtagToContent: (hashtag) => {
      const { generatedContent } = get();
      if (!generatedContent) return;
      
      // Format hashtag properly
      let formattedHashtag = hashtag.trim()
        .replace(/\s+/g, '') // Remove spaces
        .replace(/[^\w]/g, '') // Remove special chars
        .toLowerCase();
        
      // Ensure it has a '#' prefix
      if (!formattedHashtag.startsWith('#')) {
        formattedHashtag = '#' + formattedHashtag;
      }
      
      // Add to content text
      let updatedContent = generatedContent.content;
      
      // Add space before hashtag if content doesn't end with one
      if (!updatedContent.endsWith(' ')) {
        updatedContent += ' ';
      }
      
      // Add the hashtag with a trailing space
      updatedContent += formattedHashtag + ' ';
      
      // Update content
      set({
        generatedContent: {
          ...generatedContent,
          content: updatedContent
        }
      });
    },
    
    // New function to reset generator to initial state
    resetGenerator: () => {
      // Get the current state
      const { savedContentLibrary } = get();
      
      // Reset to initial state but keep savedContentLibrary
      set({
        contentType: 'social_media_caption',
        brandVoice: {
          tone: 'friendly',
          style: 'casual'
        },
        useBrandVoice: true,
        ctaEnhancements: {
          urgency: false,
          socialProof: false,
          benefits: false,
          directCTA: false
        },
        loading: false,
        photoData: {
          file: null,
          preview: null,
          description: null // Fixed property name
        },
        error: null,
        currentLoadingMessage: '',
        generatedContent: null,
        savedContent: null,
        previewPlatform: 'instagram',
        socialSettings: {
          hashtags: [], // Fixed property name
          cta: 'Book now!'
        },
        contentLength: 'medium',
        customWordCount: 150,
        suggestedHashtags: [],
        // Keep the savedContentLibrary to maintain history
        savedContentLibrary
      });
    },
    
    // Method to edit content using natural language prompts
    editContentWithPrompt: async (prompt, property) => {
      const { generatedContent, contentType } = get();
      
      if (!generatedContent) {
        set({ error: "No content to edit. Please generate content first." });
        return;
      }
      
      // Set loading state
      set({ loading: true, editingWithPrompt: true, error: null });
      
      try {
        // Prepare the API payload
        const payload = {
          content: generatedContent.content,
          prompt,
          propertyId: property.id,
          contentType
        };
        
        // Call the API to edit the content
        const response = await fetch('/api/edit-content-with-prompt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to edit content with prompt');
        }
        
        const editedContentData = await response.json();
        
        // Update the generated content with the edited content
        set({ 
          generatedContent: {
            ...generatedContent,
            content: editedContentData.editedContent
          },
          savedContent: {
            ...generatedContent,
            content: editedContentData.editedContent
          },
          loading: false,
          editingWithPrompt: false
        });
      } catch (error) {
        console.error('Content editing error:', error);
        set({ 
          error: error instanceof Error ? error.message : 'Failed to edit content with prompt', 
          loading: false,
          editingWithPrompt: false
        });
      }
    }
  };
});