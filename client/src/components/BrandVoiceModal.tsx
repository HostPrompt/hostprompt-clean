import React, { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { usePropertyStore } from "@/store/propertyStore";
import { Info, MessageSquare, Edit } from "lucide-react";

interface BrandVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: number;
  currentBrandVoice: string;
  currentBrandVoiceSummary: string;
  useBrandVoiceDefault: boolean;
}

export default function BrandVoiceModal({
  isOpen,
  onClose,
  propertyId,
  currentBrandVoice,
  currentBrandVoiceSummary,
  useBrandVoiceDefault
}: BrandVoiceModalProps) {
  const [brandVoice, setBrandVoice] = useState(currentBrandVoice);
  const [socialPosts, setSocialPosts] = useState("");
  const [useDefault, setUseDefault] = useState(useBrandVoiceDefault);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const { updateProperty } = usePropertyStore();
  const { toast } = useToast();

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setBrandVoice(currentBrandVoice);
      setUseDefault(useBrandVoiceDefault);
    }
  }, [isOpen, currentBrandVoice, useBrandVoiceDefault]);

  // Generate brand voice summary by calling the server API
  const analyzeBrandVoice = async (text: string) => {
    try {
      // Call the API endpoint to analyze the brand voice
      const response = await fetch('/api/analyze-brand-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          inputType: 'description',
          propertyId: propertyId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze brand voice');
      }
      
      const result = await response.json();
      return result.brandVoiceSummary;
    } catch (error) {
      console.error("Error analyzing brand voice:", error);
      // Fallback summary if the API call fails
      return "A friendly, conversational tone that's welcoming and informative.";
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      // Determine which input to use based on active tab
      const inputText = activeTab === 'description' ? brandVoice : socialPosts;
      const inputType = activeTab === 'description' ? 'description' : 'captions';
      
      if (!inputText.trim()) {
        throw new Error('Please enter some text to analyze');
      }
      
      // Make a direct call to the API for analysis
      // The API will analyze the text and save both the brand voice and summary to the property
      const response = await fetch('/api/analyze-brand-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: inputText,
          inputType: inputType,
          propertyId: propertyId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze and save brand voice');
      }
      
      const result = await response.json();
      
      // We also update the property with the use default setting
      await updateProperty(propertyId, {
        useBrandVoiceDefault: useDefault
      });
      
      toast({
        title: "Your voice is set!",
        description: "We'll make sure your content sounds just like you now."
      });
      
      onClose();
    } catch (error) {
      console.error("Error saving brand voice:", error);
      toast({
        title: "Oops, that didn't save!",
        description: error instanceof Error ? error.message : "Let's try that again in a moment.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Set Your Brand Voice</h2>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            ×
          </button>
        </div>
        
        <p className="text-sm text-neutral-600 mb-4">
          Tell us about your property's personality! This helps us write in your authentic voice and style.
        </p>
        
        <Tabs 
          defaultValue="description" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-4"
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="description" className="flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              <span>Description</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              <span>Social Posts</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description">
            <div className="bg-neutral-50 border border-neutral-200 rounded-md p-3 mb-4">
              <div className="flex items-start">
                <Info className="h-4 w-4 mr-2 text-[#FF5C5C] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-600">
                  <strong>Quick tip:</strong> Just write how you'd talk about your place! Like "Our cabin has that cozy mountain feel with a modern twist. We're laid-back but attentive to the little details that make stays special."
                </p>
              </div>
            </div>
            
            <textarea
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              className="w-full rounded-md border border-neutral-300 p-3 min-h-[150px] mb-4"
              placeholder="Tell us what makes your property's communication style unique..."
            />
          </TabsContent>
          
          <TabsContent value="posts">
            <div className="bg-neutral-50 border border-neutral-200 rounded-md p-3 mb-4">
              <div className="flex items-start">
                <Info className="h-4 w-4 mr-2 text-[#FF5C5C] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-600">
                  <strong>Share a few posts you love!</strong> Drop in 2-3 of your favorite captions so we can learn your style and get your vibe just right.
                </p>
              </div>
            </div>
            
            <textarea
              value={socialPosts}
              onChange={(e) => setSocialPosts(e.target.value)}
              className="w-full rounded-md border border-neutral-300 p-3 min-h-[150px] mb-4"
              placeholder="Just copy and paste a few of your favorite posts here..."
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex items-center space-x-2 mb-6">
          <Switch
            checked={useDefault}
            onCheckedChange={setUseDefault}
            id="default-voice"
          />
          <label htmlFor="default-voice" className="text-sm cursor-pointer">
            Always use this voice for all my properties (saves you time!)
          </label>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSubmitting || (activeTab === 'description' && !brandVoice.trim()) || (activeTab === 'posts' && !socialPosts.trim())}
            className="bg-[#FF5C5C] hover:bg-[#FF7070]"
          >
            {isSubmitting ? 'Analyzing...' : 'Analyze & Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}