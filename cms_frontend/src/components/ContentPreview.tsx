import React, { useState } from 'react';
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

  const handleRegenerate = async (disabilityType: string) => {
    setIsRegenerating(disabilityType);
    try {
      await onRegenerateContent?.(disabilityType);
    } finally {
      setIsRegenerating(null);
    }
  };

  const renderHotelContent = (data: any) => (
    <div className="space-y-6">
      {/* Header Information */}
      <div className="border-b border-border pb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{data.name}</h2>
            {data.location && (
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {data.location}
              </div>
            )}
          </div>
          {data.prices && Object.keys(data.prices).length > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                ${String(Object.values(data.prices)[0])}
              </div>
              <div className="text-sm text-muted-foreground">per night</div>
            </div>
          )}
        </div>
      </div>

      {/* Amenities */}
      {data.amenities && Object.keys(data.amenities).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(data.amenities).map(([key, value]: [string, any]) => (
              <div key={key} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Wifi className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accessibility Features */}
      {data.accessibility_features && Object.keys(data.accessibility_features).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Accessibility Features</h3>
          <div className="grid gap-3">
            {Object.entries(data.accessibility_features).map(([key, value]: [string, any]) => (
              <div key={key} className="p-4 bg-accent-soft rounded-lg border-l-4 border-l-accent">
                <div className="font-medium text-accent-foreground">{key.replace(/_/g, ' ').toUpperCase()}</div>
                <div className="text-sm text-muted-foreground mt-1">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTourContent = (data: any) => (
    <div className="space-y-6">
      <div className="border-b border-border pb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">{data.name}</h2>
        {data.description && (
          <p className="text-muted-foreground">{data.description}</p>
        )}
        {data.duration && (
          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {data.duration}
          </div>
        )}
      </div>

      {data.destinations && data.destinations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Destinations</h3>
          <div className="flex flex-wrap gap-2">
            {data.destinations.map((destination: string, index: number) => (
              <Badge key={index} variant="outline">{destination}</Badge>
            ))}
          </div>
        </div>
      )}

      {data.activities && data.activities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Activities</h3>
          <div className="grid gap-3">
            {data.activities.map((activity: any, index: number) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="font-medium">{activity.name || activity}</div>
                {activity.description && (
                  <div className="text-sm text-muted-foreground mt-1">{activity.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCareServiceContent = (data: any) => (
    <div className="space-y-6">
      <div className="border-b border-border pb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">{data.name}</h2>
        {data.description && (
          <p className="text-muted-foreground">{data.description}</p>
        )}
      </div>

      {data.care_types && data.care_types.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Care Types</h3>
          <div className="flex flex-wrap gap-2">
            {data.care_types.map((type: string, index: number) => (
              <Badge key={index} variant="outline">{type}</Badge>
            ))}
          </div>
        </div>
      )}

      {data.staff_qualifications && data.staff_qualifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Staff Qualifications</h3>
          <div className="grid gap-2">
            {data.staff_qualifications.map((qualification: string, index: number) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{qualification}</span>
              </div>
            ))}
          </div>
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="focus-ring">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <AccessibilityBadge type={activeTab as any} />
        </div>
        <Button onClick={onEdit} variant="outline" className="focus-ring">
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Content
        </Button>
      </div>

      {/* Content Tabs */}
      <Card className="shadow-large">
        <CardHeader>
          <CardTitle>Content Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid grid-cols-6 w-full">
                {disabilityTypes.map((type) => (
                  <TabsTrigger 
                    key={type.key} 
                    value={type.key}
                    className="text-xs"
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
                  className="ml-4"
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
                <div className="min-h-[400px]">
                  {content && renderContent(content)}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};