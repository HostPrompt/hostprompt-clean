import { useEffect, useState } from 'react';
import { useContentStore } from '@/store/contentStore';
import { usePropertyStore } from '@/store/propertyStore';
import { Property } from '@shared/schema';
import { RefreshCw, Star, Image, Edit, MessageSquare } from 'lucide-react';

// Define activity types for better organization
export interface ActivityItem {
  id: string;
  type: 'generation' | 'property' | 'photo' | 'save' | 'edit' | 'brandVoice';
  timestamp: Date;
  description: string;
  propertyId?: number;
  contentId?: number;
  propertyName?: string;
  contentType?: string;
}

interface RecentActivityLogProps {
  maxItems?: number;
  propertyId?: number; // Filter for specific property if provided
}

export default function RecentActivityLog({ maxItems = 5, propertyId }: RecentActivityLogProps) {
  const { savedContentLibrary } = useContentStore();
  const { properties } = usePropertyStore();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get property name by ID
  const getPropertyName = (id: number): string => {
    const property = properties.find(p => p.id === id);
    return property?.name || 'Unknown Property';
  };

  // Generate activities list from state
  useEffect(() => {
    if (!properties.length) return;
    
    setIsLoading(true);
    
    // Create activity items from saved content
    const contentActivities: ActivityItem[] = savedContentLibrary
      .filter(content => !propertyId || content.propertyId === propertyId)
      .map(content => ({
        id: `content-${content.id}-${Date.now()}`,
        type: 'generation' as const,
        timestamp: content.dateGenerated ? new Date(content.dateGenerated) : new Date(),
        description: `Generated "${content.contentType}" content`,
        propertyId: content.propertyId,
        contentId: content.id,
        propertyName: getPropertyName(content.propertyId),
        contentType: content.contentType
      }))
      .slice(0, maxItems);
    
    // Create property-related activities
    const propertyActivities: ActivityItem[] = properties
      .filter(property => !propertyId || property.id === propertyId)
      .map(property => ({
        id: `property-${property.id}`,
        type: 'property' as const,
        timestamp: new Date(), // Use current time as we don't track creation time
        description: `Added property "${property.name}"`,
        propertyId: property.id,
        propertyName: property.name
      }))
      .slice(0, maxItems);
    
    // Combine and sort activities by timestamp (newest first)
    const allActivities = [...contentActivities, ...propertyActivities]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, maxItems);
    
    setActivities(allActivities);
    setIsLoading(false);
  }, [savedContentLibrary, properties, propertyId, maxItems]);

  // Format relative time
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'generation':
        return <MessageSquare className="h-4 w-4 text-indigo-600" />;
      case 'property':
        return <Star className="h-4 w-4 text-amber-600" />;
      case 'photo':
        return <Image className="h-4 w-4 text-blue-600" />;
      case 'edit':
        return <Edit className="h-4 w-4 text-green-600" />;
      default:
        return <Star className="h-4 w-4 text-primary-600" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <RefreshCw className="h-5 w-5 text-neutral-400 animate-spin" />
      </div>
    );
  }
  
  if (activities.length === 0) {
    return (
      <div className="text-center py-3 px-4 text-neutral-500 text-sm">
        No recent activity found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 flex-shrink-0">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">
              {activity.description}
            </p>
            {activity.propertyName && (
              <p className="text-xs text-neutral-600 truncate">
                Property: {activity.propertyName}
              </p>
            )}
            <p className="text-xs text-neutral-500 mt-0.5">
              {getRelativeTime(activity.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}