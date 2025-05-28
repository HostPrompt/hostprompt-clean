import { useEffect, useState } from 'react';
import { useContentStore } from '@/store/contentStore';
import { usePropertyStore } from '@/store/propertyStore';
import { Property } from '@shared/schema';
import { Edit, Check, Home, Image, FileText } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'property' | 'content' | 'photo' | 'brandVoice';
  timestamp: Date;
  title: string;
  description: string;
  propertyId?: number;
  propertyName?: string;
  contentType?: string;
}

export function DashboardActivity() {
  const { savedContentLibrary } = useContentStore();
  const { properties } = usePropertyStore();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  // Function to get property name by ID
  const getPropertyName = (id: number): string => {
    const property = properties.find(p => p.id === id);
    return property?.name || 'Property';
  };
  
  // Track activity whenever content or properties change
  useEffect(() => {
    const activityList: ActivityItem[] = [];
    
    // Content generation activities
    const contentActivities = savedContentLibrary.map(content => ({
      id: `content-${content.id || Math.random().toString(36).substring(2, 9)}`,
      type: 'content' as const,
      timestamp: content.dateGenerated ? new Date(content.dateGenerated) : new Date(),
      title: 'Content Created',
      description: `You created ${content.contentType} content for "${getPropertyName(content.propertyId)}"`,
      propertyId: content.propertyId,
      propertyName: getPropertyName(content.propertyId),
      contentType: content.contentType
    }));
    
    // Property activities
    const propertyActivities = properties.map(property => ({
      id: `property-${property.id}`,
      type: 'property' as const,
      timestamp: new Date(), // We don't track property creation time, so use current
      title: 'Property Added',
      description: `You added "${property.name}" to your properties`,
      propertyId: property.id,
      propertyName: property.name
    }));
    
    // Combine all activities, sort by timestamp (newest first) and limit
    activityList.push(...contentActivities, ...propertyActivities);
    activityList.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Store in local state
    setActivities(activityList);
    
    // Optional: Store activities in localStorage for persistence between sessions
    localStorage.setItem('hostprompt_activity_log', JSON.stringify(activityList.slice(0, 10)));
  }, [savedContentLibrary, properties]);
  
  // Load activities from localStorage on component mount
  useEffect(() => {
    const storedActivities = localStorage.getItem('hostprompt_activity_log');
    if (storedActivities) {
      try {
        const parsedActivities = JSON.parse(storedActivities);
        // Convert string dates back to Date objects
        parsedActivities.forEach((activity: any) => {
          activity.timestamp = new Date(activity.timestamp);
        });
        
        // Only use stored activities if we don't have fresh ones
        if (activities.length === 0) {
          setActivities(parsedActivities);
        }
      } catch (error) {
        console.error('Error parsing stored activities:', error);
      }
    }
  }, []);
  
  // Format relative time
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'property':
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
            <Home className="h-5 w-5 text-green-600" />
          </div>
        );
      case 'content':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
        );
      case 'photo':
        return (
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
            <Image className="h-5 w-5 text-purple-600" />
          </div>
        );
      case 'brandVoice':
        return (
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
            <Edit className="h-5 w-5 text-amber-600" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mr-3 flex-shrink-0">
            <Check className="h-5 w-5 text-neutral-600" />
          </div>
        );
    }
  };
  
  if (activities.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl p-5">
        <p className="text-sm text-neutral-500 text-center py-2">No activity yet</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5">
      <div className="space-y-4">
        {activities.slice(0, 5).map((activity) => (
          <div key={activity.id} className="flex items-start">
            {getActivityIcon(activity.type)}
            <div>
              <h4 className="text-sm font-medium text-neutral-800">{activity.title}</h4>
              <p className="text-sm text-neutral-600">{activity.description}</p>
              <p className="text-xs text-neutral-500 mt-1">{getRelativeTime(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}