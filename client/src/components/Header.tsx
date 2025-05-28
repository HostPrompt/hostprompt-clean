import { useState } from "react";
import { Menu, X, Bell, Home, Image, FileText, Share2, BookOpen } from "lucide-react";
import { useLocation } from "wouter";

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Header({ mobileMenuOpen, setMobileMenuOpen }: HeaderProps) {
  const [location, setLocation] = useLocation();

  const handleNavigation = (path: string) => {
    setLocation(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-neutral-200 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div>
              <h1 className="text-lg sm:text-xl font-heading font-semibold" style={{color: "#FF5C5C"}}>HostPrompt</h1>
              <p className="text-xs text-neutral-500 -mt-1">Your Creative Co-Host</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-neutral-500 hover:text-primary-500 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button 
              className="block md:hidden p-2 text-neutral-700 hover:text-primary-500 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <button 
              onClick={() => window.open("https://hostprompt-ai.outseta.com/profile?#o-authenticated", "_blank")}
              className="hidden md:flex items-center space-x-2 text-neutral-700 hover:text-primary-500 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">JD</span>
              </div>
              <span className="text-sm font-medium">John Doe</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-200 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          className={`absolute top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">JD</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-500 hover:text-neutral-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-2">
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-neutral-500">john.doe@example.com</p>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <nav className="p-4 space-y-1">
                <button
                  onClick={() => handleNavigation("/app")}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg ${
                    location === "/dashboard" || location === "/app" ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <Home className="h-5 w-5 mr-3" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => handleNavigation("/property")}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg ${
                    location === "/property" ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <Image className="h-5 w-5 mr-3" />
                  <span>Property Profile</span>
                </button>
                <button
                  onClick={() => handleNavigation("/generator")}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg ${
                    location === "/generator" ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  <span>Content Generator</span>
                </button>
                <button
                  onClick={() => handleNavigation("/preview")}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg ${
                    location === "/preview" ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <Share2 className="h-5 w-5 mr-3" />
                  <span>Social Preview</span>
                </button>
                <button
                  onClick={() => handleNavigation("/library")}
                  className={`w-full flex items-center px-3 py-2.5 rounded-lg ${
                    location === "/library" ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <BookOpen className="h-5 w-5 mr-3" />
                  <span>Content Library</span>
                </button>
              </nav>
            </div>
            <div className="p-4 border-t border-neutral-200">
              <button 
                onClick={() => window.open("https://hostprompt-ai.outseta.com/profile?#o-authenticated", "_blank")}
                className="w-full px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
                My Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
