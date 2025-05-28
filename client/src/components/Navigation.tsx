import { useLocation } from "wouter";
import { Home, Image, FileText, Share2, Folder, BookOpen } from "lucide-react";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const [location, setLocation] = useLocation();

  const handleTabClick = (tab: string, path: string) => {
    setActiveTab(tab);
    setLocation(path, { replace: true });
  };

  return (
    <div className="bg-white border-b border-neutral-200 sticky top-16 z-40 md:block">
      {/* Desktop tabs */}
      <div className="max-w-7xl mx-auto px-4 hidden md:block">
        <nav className="flex overflow-x-auto scrollbar-hide">
          <button 
            onClick={() => handleTabClick('dashboard', '/app')} 
            className={`border-b-2 py-4 px-1 text-sm font-medium whitespace-nowrap mr-8 transition-colors ${
              activeTab === 'dashboard' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}>
            Dashboard
          </button>
          <button 
            onClick={() => handleTabClick('property', '/property')} 
            className={`border-b-2 py-4 px-1 text-sm font-medium whitespace-nowrap mr-8 transition-colors ${
              activeTab === 'property' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}>
            Property Profile
          </button>
          <button 
            onClick={() => handleTabClick('generator', '/generator')} 
            className={`border-b-2 py-4 px-1 text-sm font-medium whitespace-nowrap mr-8 transition-colors ${
              activeTab === 'generator' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}>
            Create with HostPrompt
          </button>
          <button 
            onClick={() => handleTabClick('preview', '/preview')} 
            className={`border-b-2 py-4 px-1 text-sm font-medium whitespace-nowrap mr-8 transition-colors ${
              activeTab === 'preview' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}>
            Social Preview
          </button>
          <button 
            onClick={() => handleTabClick('library', '/library')} 
            className={`border-b-2 py-4 px-1 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === 'library' 
                ? 'border-primary-500 text-primary-600' 
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
            }`}>
            Content Library
          </button>
        </nav>
      </div>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-40 md:hidden">
        <div className="grid grid-cols-5 h-16">
          <button
            onClick={() => handleTabClick('dashboard', '/app')}
            className={`flex flex-col items-center justify-center ${
              activeTab === 'dashboard' ? 'text-[#FF5C5C]' : 'text-neutral-500'
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => handleTabClick('property', '/property')}
            className={`flex flex-col items-center justify-center ${
              activeTab === 'property' ? 'text-[#FF5C5C]' : 'text-neutral-500'
            }`}
          >
            <Image className="h-5 w-5" />
            <span className="text-xs mt-1">Property</span>
          </button>
          <button
            onClick={() => handleTabClick('generator', '/generator')}
            className={`flex flex-col items-center justify-center ${
              activeTab === 'generator' ? 'text-[#FF5C5C]' : 'text-neutral-500'
            }`}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs mt-1">Create</span>
          </button>
          <button
            onClick={() => handleTabClick('preview', '/preview')}
            className={`flex flex-col items-center justify-center ${
              activeTab === 'preview' ? 'text-[#FF5C5C]' : 'text-neutral-500'
            }`}
          >
            <Share2 className="h-5 w-5" />
            <span className="text-xs mt-1">Share</span>
          </button>
          <button
            onClick={() => handleTabClick('library', '/library')}
            className={`flex flex-col items-center justify-center ${
              activeTab === 'library' ? 'text-[#FF5C5C]' : 'text-neutral-500'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-xs mt-1">Library</span>
          </button>
        </div>
      </div>

      {/* FAB for creating new content - optimized for iOS */}
      <div className="fixed bottom-20 right-4 md:hidden z-50">
        <button 
          onClick={() => handleTabClick('generator', '/generator')}
          className="h-14 w-14 rounded-full bg-[#FF5C5C] text-white shadow-lg flex items-center justify-center active:bg-[#FF7070] transition-colors"
          aria-label="Create new content"
          style={{
            WebkitTapHighlightColor: 'transparent', /* iOS optimization */
            touchAction: 'manipulation' /* Better touch handling */
          }}
        >
          <FileText className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
