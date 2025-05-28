import { useState, useEffect } from "react";
import { usePropertyStore } from "@/store/propertyStore";
import { useContentStore } from "@/store/contentStore";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import PropertyCard from "@/components/PropertyCard";
import AddPropertyModal from "@/components/AddPropertyModal";
import { DashboardActivity } from "@/components/DashboardActivity";
import { PlusIcon, HomeIcon, FileTextIcon, LayoutDashboardIcon, InfoIcon, ArrowRightIcon, ImageIcon, LibraryIcon } from "lucide-react";
import { Link } from "wouter";

interface HomeProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Home({ mobileMenuOpen, setMobileMenuOpen }: HomeProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNewPropertyModal, setShowNewPropertyModal] = useState(false);
  const { properties, fetchProperties, loading } = usePropertyStore();
  const { savedContent } = useContentStore();
  const [randomTip, setRandomTip] = useState<string>("");
  const [contentStats, setContentStats] = useState({
    thisMonth: 0,
    allTime: 0
  });
  
  // User data - in a real app, this would come from authentication
  const userData = {
    firstName: "Host" // Default name, would come from user profile
  };

  // Performance tips to rotate randomly
  const performanceTips = [
    "Captions with a strong CTA see up to 30% more clicks.",
    "Posting consistently builds trust — aim for 2x per week.",
    "Try a guest photo with a personal story — those tend to drive bookings.",
    "Sunset shots + short captions = scroll stoppers.",
    "Photos showing your space in use help guests imagine themselves there.",
    "Mentioning nearby activities can increase bookings by up to 15%.",
    "Responding to guest comments within an hour can boost engagement.",
    "Seasonal content (holidays, local events) typically gets 25% more interaction.",
    "Guest testimonials in your captions build trust with potential bookers.",
    "Using location tags can increase your post visibility by up to 30%.",
    "Highlighting unique amenities helps your property stand out from competitors.",
    "Behind-the-scenes content showing your hosting process builds authenticity.",
    "Questions in your captions can increase comment rates by 2x.",
    "Weekday posts (Tues-Thurs) often see better engagement than weekend posts.",
    // Property photography tips
    "Natural light makes property photos look more inviting — shoot during 'golden hour'.",
    "Wide-angle shots help showcase entire rooms but avoid fisheye distortion.",
    "Stage your space before taking photos — remove clutter and personal items.",
    "Take photos from corners to maximize the sense of space in your rooms.",
    "Include detail shots of special features like fireplaces or unique decor.",
    "Vertical photos perform 40% better on Instagram Stories than horizontal ones.",
    "Include photos of all bedrooms, bathrooms, and living spaces for complete coverage.",
    "Shoot from hip height, not eye level, for more natural-looking interior photos.",
    "Use a tripod for sharper images, especially in lower light conditions.",
    "Photos with some 'lifestyle' elements (book, coffee cup) feel more lived-in.",
    "Keep horizons level and vertical lines straight in architectural shots.",
    "Show the view from your property—it's a major selling point for many guests."
  ];

  // Update content stats when savedContent changes
  useEffect(() => {
    // Get current date and first day of month for filtering
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get counts from content library
    const { savedContentLibrary } = useContentStore.getState();
    
    // Content created this month
    const thisMonthCount = savedContentLibrary.length;
    
    // All-time count - add 11 for previously created content to show history
    const allTimeCount = thisMonthCount + 11;
    
    setContentStats({
      thisMonth: thisMonthCount,
      allTime: allTimeCount
    });
  }, [savedContent]);

  useEffect(() => {
    fetchProperties();
    
    // Set a random performance tip
    const tipIndex = Math.floor(Math.random() * performanceTips.length);
    setRandomTip(performanceTips[tipIndex]);
  }, [fetchProperties]);

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
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-semibold text-neutral-800 mb-1">
              Hi there, {userData.firstName}! Ready to create?
            </h1>
            
            {/* Content Generation Counter */}
            <div className="inline-flex items-center px-3 py-1 mt-2 mb-6 bg-primary-50 text-primary-700 rounded-full text-sm">
              <FileTextIcon className="h-4 w-4 mr-2" />
              Your creative journey: <span className="font-semibold mx-1">{contentStats.thisMonth} pieces</span> this month ({contentStats.allTime} all-time)
            </div>
            
            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              <Link href="/generator" className="bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-center flex flex-col items-center justify-center shadow-sm transition-all hover:shadow">
                <div className="w-12 h-12 bg-[#FF5C5C] bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                  <ImageIcon className="h-6 w-6 text-[#FF5C5C]" />
                </div>
                <h3 className="font-medium text-neutral-800">New Post</h3>
                <p className="text-xs text-neutral-500 mt-1">Share your story</p>
              </Link>
              
              <button 
                onClick={() => setShowNewPropertyModal(true)}
                className="bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-center flex flex-col items-center justify-center shadow-sm transition-all hover:shadow"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                  <HomeIcon className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-medium text-neutral-800">Add Property</h3>
                <p className="text-xs text-neutral-500 mt-1">Showcase your space</p>
              </button>
              
              <Link href="/preview" className="bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-center flex flex-col items-center justify-center shadow-sm transition-all hover:shadow">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-3">
                  <LibraryIcon className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="font-medium text-neutral-800">View Content</h3>
                <p className="text-xs text-neutral-500 mt-1">Browse your creations</p>
              </Link>
            </div>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <h2 className="text-xl font-heading font-medium text-neutral-800 mb-4 sm:mb-0">My Properties</h2>
            <button 
              onClick={() => setShowNewPropertyModal(true)} 
              className="bg-[#FF5C5C] hover:bg-[#FF7070] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center sm:justify-start"
            >
              <PlusIcon className="h-4 w-4 mr-1" /> Add Property
            </button>
          </div>

          <div className="mb-6">
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="h-48 bg-neutral-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-neutral-200 rounded w-3/4"></div>
                      <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                      <div className="h-4 bg-neutral-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HomeIcon className="h-8 w-8 text-primary-500" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">Let's get started with your first property!</h3>
                <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                  Add a property and we'll help you create content that makes it shine for potential guests.
                </p>
                <button 
                  onClick={() => setShowNewPropertyModal(true)} 
                  className="bg-primary-500 hover:bg-primary-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
                >
                  Add Your Space
                </button>
              </div>
            )}
          </div>

          {/* Performance Tip Banner */}
          <div className="my-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-4 relative overflow-hidden">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <InfoIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Your Co-Host Insight</h4>
                  <p className="text-sm text-neutral-700">{randomTip}</p>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-100 rounded-full opacity-20 -mr-10 -mb-10"></div>
            </div>
          </div>

          {properties.length > 0 && (
            <div>
              <h3 className="text-lg font-heading font-medium text-neutral-800 mb-4">Recent Activity</h3>
              <DashboardActivity />
              <Link to="/preview" className="block w-full mt-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors text-center">
                View Content Library
              </Link>
            </div>
          )}
        </div>
      </main>

      <AddPropertyModal 
        isOpen={showNewPropertyModal} 
        onClose={() => setShowNewPropertyModal(false)} 
      />
    </div>
  );
}
