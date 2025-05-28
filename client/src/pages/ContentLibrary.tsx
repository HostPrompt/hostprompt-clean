import { useState, useEffect } from "react";
import { usePropertyStore } from "@/store/propertyStore";
import { useContentStore } from "@/store/contentStore";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Image, Clock, Search, Filter, PlusCircle, Calendar, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ContentLibraryProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function ContentLibrary({ mobileMenuOpen, setMobileMenuOpen }: ContentLibraryProps) {
  const [activeTab, setActiveTab] = useState("library");
  const { selectedProperty, properties } = usePropertyStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [savedContent, setSavedContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  
  // Fetch saved content on mount and whenever content is deleted
  useEffect(() => {
    const fetchSavedContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/contents');
        if (!response.ok) {
          throw new Error('Failed to fetch saved content');
        }
        
        const data = await response.json();
        setSavedContent(data);
      } catch (error) {
        console.error('Error fetching saved content:', error);
        toast({
          title: "Error loading content library",
          description: "There was a problem retrieving your saved content.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedContent();
  }, [toast, deleteInProgress]);
  
  // Function to handle content deletion
  const handleDeleteContent = async (contentId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    if (!contentId) {
      toast({
        title: "Error",
        description: "Cannot delete content without an ID",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setDeleteInProgress(true);
      
      const response = await fetch(`/api/contents/${contentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete content with ID ${contentId}`);
      }
      
      // Remove the deleted content from the state
      setSavedContent(prevContent => prevContent.filter(content => content.id !== contentId));
      
      toast({
        title: "Content deleted",
        description: "The content has been successfully removed from your library"
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error deleting content",
        description: "There was a problem deleting the content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleteInProgress(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      // Make sure we have a valid date string
      if (!dateString) return 'Recently added';
      
      // The database might return the date in a PostgreSQL timestamp format
      // Handle ISO strings and other common formats
      const date = new Date(dateString);
      
      // Check if date is valid before formatting
      if (isNaN(date.getTime())) {
        console.log('Invalid date detected:', dateString);
        return 'Recently added';
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.log('Error formatting date:', error, dateString);
      return 'Recently added';
    }
  };
  
  // Get property name by ID
  const getPropertyName = (propertyId: number | undefined) => {
    if (!propertyId) return 'Unknown Property';
    const property = properties?.find(p => p.id === propertyId);
    return property ? property.name : 'Unknown Property';
  };
  
  // Filter content based on search query
  const filteredContent = searchQuery.trim() === '' 
    ? savedContent 
    : savedContent.filter(content => {
        const propertyName = getPropertyName(content.propertyId);
        return (
          (content.content && content.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (content.type && content.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
          propertyName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 pb-16 md:pb-0">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-4 md:p-6 mt-2">
          <div className="mb-6">
            <h2 className="text-2xl font-heading font-semibold text-neutral-800 mb-3">Content Library</h2>
            <p className="text-neutral-600">Browse, search, and reuse your saved content.</p>
          </div>

          {/* Search & Filters */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search content, property names, or content types..."
                className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5C5C] focus:border-[#FF5C5C]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 animate-pulse">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-neutral-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-neutral-200 rounded w-1/3"></div>
                    <div className="h-3 bg-neutral-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : filteredContent.length === 0 ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
                <BookOpen className="h-12 w-12 text-neutral-300 mb-3" />
                {searchQuery.trim() !== '' ? (
                  <>
                    <h3 className="text-lg font-medium text-neutral-700 mb-1">No search results found</h3>
                    <p className="text-neutral-500 text-center mb-4">Try adjusting your search or filters</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-neutral-700 mb-1">Your library is waiting for its first post!</h3>
                    <p className="text-neutral-500 text-center mb-4">Time to create some amazing content and build your collection</p>
                  </>
                )}
                <button
                  onClick={() => window.location.href = '/generator'}
                  className="flex items-center px-4 py-2 bg-[#FF5C5C] text-white rounded-lg hover:bg-[#FF7070] transition-colors"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Content
                </button>
              </div>
            ) : (
              filteredContent.map((content) => (
                <div key={content.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-neutral-800">{content.type}</h3>
                        <p className="text-xs text-neutral-500">{getPropertyName(content.propertyId)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => handleDeleteContent(content.id, e)}
                          className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                          title="Delete content"
                          aria-label="Delete content"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {content.type && content.type.includes('Social') && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            Social
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 mb-3">
                      <p className="text-sm text-neutral-700 line-clamp-3">{content.content}</p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                      <div className="flex items-center text-xs text-neutral-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatDate(content.createdAt)}</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          window.location.href = '/preview';
                        }}
                        className="text-xs font-medium text-[#FF5C5C] hover:text-[#FF7070]"
                      >
                        View & Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}