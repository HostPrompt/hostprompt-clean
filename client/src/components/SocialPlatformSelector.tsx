import { useContentStore } from "@/store/contentStore";
import { Facebook, Instagram, Twitter, Music } from "lucide-react";

export default function SocialPlatformSelector() {
  const { previewPlatform, setPreviewPlatform } = useContentStore();

  return (
    <div className="flex mb-6 space-x-2 overflow-x-auto pb-2">
      <button 
        onClick={() => setPreviewPlatform('instagram')} 
        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center shrink-0 hover:shadow-sm ${
          previewPlatform === 'instagram'
            ? 'bg-[#E1306C] text-white border-[#E1306C] hover:bg-[#d62a63]'
            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
        }`}
      >
        <Instagram className="h-4 w-4 mr-1.5" />
        Instagram
      </button>
      <button 
        onClick={() => setPreviewPlatform('facebook')} 
        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center shrink-0 hover:shadow-sm ${
          previewPlatform === 'facebook'
            ? 'bg-[#1877F2] text-white border-[#1877F2] hover:bg-[#166fe0]'
            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
        }`}
      >
        <Facebook className="h-4 w-4 mr-1.5" />
        Facebook
      </button>
      <button 
        onClick={() => setPreviewPlatform('tiktok')} 
        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center shrink-0 hover:shadow-sm ${
          previewPlatform === 'tiktok'
            ? 'bg-black text-white border-black hover:bg-neutral-800'
            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
        }`}
      >
        <Music className="h-4 w-4 mr-1.5" />
        TikTok
      </button>
      <button 
        onClick={() => setPreviewPlatform('twitter')} 
        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center shrink-0 hover:shadow-sm ${
          previewPlatform === 'twitter'
            ? 'bg-black text-white border-black hover:bg-neutral-800'
            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
        }`}
      >
        <Twitter className="h-4 w-4 mr-1.5" />
        X
      </button>
    </div>
  );
}
