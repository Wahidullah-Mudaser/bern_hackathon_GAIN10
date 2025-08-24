import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccessibilityBadge } from './AccessibilityBadge';
import { 
  MapPin, 
  Clock, 
  Users, 
  Star,
  Wifi,
  Car,
  Coffee,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  Edit3,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ContentPreviewProps {
  content: any;
  contentType: 'hotel' | 'tour' | 'care-service';
  onBack?: () => void;
  onEdit?: () => void;
  onRegenerateContent?: (disabilityType: string) => void;
}

const disabilityTypes = [
  { key: 'original', label: 'Original Content' },
  { key: 'wheelchair_user', label: 'Wheelchair Accessible' },
  { key: 'dyslexia', label: 'Dyslexia Friendly' },
  { key: 'cognitive_impairment', label: 'Cognitive Accessible' },
  { key: 'anxiety_travel_fear', label: 'Anxiety Supportive' },
  { key: 'low_vision', label: 'Low Vision Optimized' }
];

export const ContentPreview: React.FC<ContentPreviewProps> = ({
  content,
  contentType,
  onBack,
  onEdit,
  onRegenerateContent
}) => {
  const [activeTab, setActiveTab] = useState('original');
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState(content);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  // Update current content when content prop changes
  useEffect(() => {
    setCurrentContent(content);
  }, [content]);

  // Fetch content for specific disability type when tab changes
  useEffect(() => {
    const fetchDisabilityContent = async () => {
      if (activeTab === 'original' || !content?.id) {
        setCurrentContent(content);
        return;
      }

      setIsLoadingContent(true);
      try {
        const response = await fetch(`http://127.0.0.1:5001/api/${contentType === 'hotel' ? 'hotels' : contentType === 'tour' ? 'tours' : 'care-services'}/${content.id}?disability_type=${activeTab}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch disability content');
        }

        const data = await response.json();
        
        if (data.success) {
          const contentKey = contentType === 'hotel' ? 'hotel' : contentType === 'tour' ? 'tour' : 'service';
          setCurrentContent({
            ...data[contentKey],
            id: content.id,
            type: contentType
          });
        } else {
          // Fallback to original content if disability content not available
          setCurrentContent(content);
        }
      } catch (error) {
        console.error('Error fetching disability content:', error);
        // Fallback to original content
        setCurrentContent(content);
      } finally {
        setIsLoadingContent(false);
      }
    };

    fetchDisabilityContent();
  }, [activeTab, content, contentType]);

  const handleRegenerate = async (disabilityType: string) => {
    setIsRegenerating(disabilityType);
    try {
      await onRegenerateContent?.(disabilityType);
    } finally {
      setIsRegenerating(null);
    }
  };

  const renderHotelContent = (data: any) => (
    <div className="space-y-8">
      {/* Header Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{data.name || 'Hotel Name Not Available'}</h2>
            {data.description && (
              <p className="text-lg text-slate-600 mb-3 leading-relaxed">{data.description}</p>
            )}
            <div className="space-y-2">
              {data.location && (
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="h-4 w-4" />
                  {data.location}
                </div>
              )}
              {data.coordinates && (
                <div className="flex items-center gap-2 text-slate-500">
                  <Globe className="h-4 w-4" />
                  Coordinates: {data.coordinates}
                </div>
              )}
            </div>
          </div>
          {data.prices && Object.keys(data.prices).length > 0 && (
            <div className="text-right ml-4">
              <div className="text-3xl font-bold text-blue-600">
                ${String(Object.values(data.prices)[0])}
              </div>
              <div className="text-sm text-slate-500">per night</div>
            </div>
          )}
        </div>
      </div>

      {/* Images */}
      {data.images && data.images.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <Globe className="h-5 w-5 text-blue-500" />
            Images
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.images.map((image: string, index: number) => (
              <div key={index} className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                <span className="text-sm text-slate-500">Image {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Information */}
      {data.prices && Object.keys(data.prices).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <Star className="h-5 w-5 text-yellow-500" />
            Pricing Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.prices).map(([key, value]: [string, any]) => (
              <div key={key} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-medium text-slate-900">{key}</div>
                <div className="text-xl font-bold text-blue-600">${value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amenities */}
      {data.amenities && Object.keys(data.amenities).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <Wifi className="h-5 w-5 text-green-500" />
            Amenities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.amenities).map(([key, value]: [string, any]) => (
              <div key={key} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Wifi className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-slate-900">{key || 'Amenity'}</div>
                  {value && <div className="text-sm text-slate-600 mt-1">{value}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accessibility Features */}
      {data.accessibility_features && Object.keys(data.accessibility_features).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <Users className="h-5 w-5 text-purple-500" />
            Accessibility Features
          </h3>
          <div className="grid gap-4">
            {Object.entries(data.accessibility_features).map(([key, value]: [string, any]) => (
              <div key={key} className="p-4 bg-purple-50 rounded-lg border-l-4 border-l-purple-500">
                <div className="font-medium text-purple-900">{key.replace(/_/g, ' ').toUpperCase()}</div>
                {value && <div className="text-sm text-purple-700 mt-1">{value}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accessibility Notes */}
      {data.accessibility_notes && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <Users className="h-5 w-5 text-purple-500" />
            Accessibility Notes
          </h3>
          <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-l-purple-500">
            <p className="text-purple-900 leading-relaxed">{data.accessibility_notes}</p>
          </div>
        </div>
      )}

      {/* Meal Times */}
      {data.meal_times && Object.keys(data.meal_times).length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <Coffee className="h-5 w-5 text-orange-500" />
            Meal Service Times
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.meal_times).map(([key, value]: [string, any]) => (
              <div key={key} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Clock className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="font-medium text-slate-900">{key}</div>
                  {value && <div className="text-sm text-slate-600">{value}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parking Information */}
      {data.parking && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <Car className="h-5 w-5 text-blue-500" />
            Parking Information
          </h3>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-slate-900 leading-relaxed">{data.parking}</p>
          </div>
        </div>
      )}

      {/* Cancellation Conditions */}
      {data.cancellation_conditions && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <Phone className="h-5 w-5 text-red-500" />
            Cancellation Policy
          </h3>
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-slate-900 leading-relaxed">{data.cancellation_conditions}</p>
          </div>
        </div>
      )}

      {/* Nearby Accessible Places */}
      {data.nearby_accessible_places && data.nearby_accessible_places.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <MapPin className="h-5 w-5 text-green-500" />
            Nearby Accessible Places
          </h3>
          <div className="grid gap-4">
            {data.nearby_accessible_places.map((place: any, index: number) => (
              <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                {typeof place === 'string' ? (
                  <div className="font-medium text-slate-900">{place}</div>
                ) : (
                  <div>
                    {place.name && <div className="font-medium text-slate-900">{place.name}</div>}
                    {place.description && <div className="text-sm text-slate-600 mt-1">{place.description}</div>}
                    {place.distance && <div className="text-sm text-slate-500">{place.distance}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Missing Data */}
      {(!data.description && !data.coordinates && (!data.prices || Object.keys(data.prices).length === 0) && 
        (!data.amenities || Object.keys(data.amenities).length === 0) && 
        (!data.accessibility_features || Object.keys(data.accessibility_features).length === 0) && 
        (!data.images || data.images.length === 0) && !data.cancellation_conditions && 
        (!data.meal_times || Object.keys(data.meal_times).length === 0) && !data.parking && 
        (!data.nearby_accessible_places || data.nearby_accessible_places.length === 0) && !data.accessibility_notes) && (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Additional Information Available</h3>
          <p className="text-slate-600">This hotel listing contains basic information only.</p>
        </div>
      )}
    </div>
  );

  const renderTourContent = (data: any) => (
    <div className="space-y-8">
      {/* Header Information */}
      <div className="border-b border-border pb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-foreground mb-2">{data.name || 'Tour Name Not Available'}</h2>
            {data.description && (
              <p className="text-lg text-muted-foreground mb-3">{data.description}</p>
            )}
            {data.duration && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                Duration: {data.duration}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photos */}
      {data.photos && data.photos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Photos
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.photos.map((photo: string, index: number) => (
              <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Photo {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Destinations */}
      {data.destinations && data.destinations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Destinations
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.destinations.map((destination: string, index: number) => (
              <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                {destination}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Activities */}
      {data.activities && data.activities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Activities
          </h3>
          <div className="grid gap-3">
            {data.activities.map((activity: any, index: number) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                {typeof activity === 'string' ? (
                  <div className="font-medium text-foreground">{activity}</div>
                ) : (
                  <div>
                    {activity.name && <div className="font-medium text-foreground">{activity.name}</div>}
                    {activity.description && <div className="text-sm text-muted-foreground mt-1">{activity.description}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Itinerary */}
      {data.itinerary && data.itinerary.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Detailed Itinerary
          </h3>
          <div className="space-y-3">
            {data.itinerary.map((item: any, index: number) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                {typeof item === 'string' ? (
                  <div className="font-medium text-foreground">{item}</div>
                ) : (
                  <div>
                    {item.title && <div className="font-medium text-foreground">{item.title}</div>}
                    {item.description && <div className="text-sm text-muted-foreground mt-1">{item.description}</div>}
                    {item.time && <div className="text-sm text-muted-foreground">{item.time}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Support Services */}
      {data.support_services && data.support_services.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Support Services
          </h3>
          <div className="grid gap-2">
            {data.support_services.map((service: string, index: number) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{service}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accessibility Features */}
      {data.accessibility_features && Object.keys(data.accessibility_features).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Accessibility Features
          </h3>
          <div className="grid gap-3">
            {Object.entries(data.accessibility_features).map(([key, value]: [string, any]) => (
              <div key={key} className="p-4 bg-accent-soft rounded-lg border-l-4 border-l-accent">
                <div className="font-medium text-accent-foreground">{key.replace(/_/g, ' ').toUpperCase()}</div>
                {value && <div className="text-sm text-muted-foreground mt-1">{value}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Missing Data */}
      {(!data.description && !data.duration && (!data.photos || data.photos.length === 0) && 
        (!data.destinations || data.destinations.length === 0) && 
        (!data.activities || data.activities.length === 0) && 
        (!data.itinerary || data.itinerary.length === 0) && 
        (!data.support_services || data.support_services.length === 0) && 
        (!data.accessibility_features || Object.keys(data.accessibility_features).length === 0)) && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Additional Information Available</h3>
          <p className="text-muted-foreground">This tour listing contains basic information only.</p>
        </div>
      )}
    </div>
  );

  const renderCareServiceContent = (data: any) => (
    <div className="space-y-8">
      {/* Header Information */}
      <div className="border-b border-border pb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-foreground mb-2">{data.name || 'Service Name Not Available'}</h2>
            {data.description && (
              <p className="text-lg text-muted-foreground mb-3">{data.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Images */}
      {data.images && data.images.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Service Images
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.images.map((image: string, index: number) => (
              <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Image {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Care Types */}
      {data.care_types && data.care_types.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Types of Care Available
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.care_types.map((type: string, index: number) => (
              <Badge key={index} variant="outline" className="text-sm px-3 py-1">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Staff Qualifications */}
      {data.staff_qualifications && data.staff_qualifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Star className="h-5 w-5" />
            Staff Qualifications
          </h3>
          <div className="grid gap-2">
            {data.staff_qualifications.map((qualification: string, index: number) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{qualification}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing and Insurance */}
      {data.pricing_insurance && Object.keys(data.pricing_insurance).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Star className="h-5 w-5" />
            Pricing and Insurance Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(data.pricing_insurance).map(([key, value]: [string, any]) => (
              <div key={key} className="p-4 bg-muted rounded-lg">
                <div className="font-medium text-foreground">{key.replace(/_/g, ' ').toUpperCase()}</div>
                {value && <div className="text-sm text-muted-foreground mt-1">{value}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Contact */}
      {data.emergency_contact && Object.keys(data.emergency_contact).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Contact Information
          </h3>
          <div className="grid gap-3">
            {Object.entries(data.emergency_contact).map(([key, value]: [string, any]) => (
              <div key={key} className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium text-foreground">{key.replace(/_/g, ' ').toUpperCase()}</div>
                  {value && <div className="text-sm text-muted-foreground">{value}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accessibility Features */}
      {data.accessibility_features && Object.keys(data.accessibility_features).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Service Accessibility Features
          </h3>
          <div className="grid gap-3">
            {Object.entries(data.accessibility_features).map(([key, value]: [string, any]) => (
              <div key={key} className="p-4 bg-accent-soft rounded-lg border-l-4 border-l-accent">
                <div className="font-medium text-accent-foreground">{key.replace(/_/g, ' ').toUpperCase()}</div>
                {value && <div className="text-sm text-muted-foreground mt-1">{value}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State for Missing Data */}
      {(!data.description && (!data.images || data.images.length === 0) && 
        (!data.care_types || data.care_types.length === 0) && 
        (!data.staff_qualifications || data.staff_qualifications.length === 0) && 
        (!data.pricing_insurance || Object.keys(data.pricing_insurance).length === 0) && 
        (!data.emergency_contact || Object.keys(data.emergency_contact).length === 0) && 
        (!data.accessibility_features || Object.keys(data.accessibility_features).length === 0)) && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Additional Information Available</h3>
          <p className="text-muted-foreground">This care service listing contains basic information only.</p>
        </div>
      )}
    </div>
  );

  const renderContent = (data: any) => {
    switch (contentType) {
      case 'hotel':
        return renderHotelContent(data);
      case 'tour':
        return renderTourContent(data);
      case 'care-service':
        return renderCareServiceContent(data);
      default:
        return <div>Unknown content type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="focus-ring hover:bg-slate-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-slate-300"></div>
              <AccessibilityBadge type={activeTab as any} />
            </div>
            <Button onClick={onEdit} variant="outline" className="focus-ring hover:bg-slate-50">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Content
            </Button>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Content Preview</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                <TabsList className="grid grid-cols-6 w-full max-w-4xl bg-slate-100 p-1 rounded-lg">
                  {disabilityTypes.map((type) => (
                    <TabsTrigger 
                      key={type.key} 
                      value={type.key}
                      className="text-xs data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
                    >
                      {type.key === 'original' ? 'Original' : type.key.replace('_', ' ')}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {activeTab !== 'original' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRegenerate(activeTab)}
                    disabled={isRegenerating === activeTab}
                    className="ml-4 hover:bg-slate-50"
                  >
                    {isRegenerating === activeTab ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3 mr-2" />
                        Regenerate
                      </>
                    )}
                  </Button>
                )}
              </div>

              {disabilityTypes.map((type) => (
                <TabsContent key={type.key} value={type.key} className="mt-6">
                  <div className="min-h-[600px] p-6 bg-slate-50 rounded-lg">
                    {isLoadingContent ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mx-auto mb-4"></div>
                          <p className="text-slate-600">Loading content for {type.key.replace('_', ' ')}...</p>
                        </div>
                      </div>
                    ) : (
                      currentContent && renderContent(currentContent)
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};