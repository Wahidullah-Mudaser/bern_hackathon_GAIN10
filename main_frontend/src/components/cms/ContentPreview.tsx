import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { usePersona } from '@/contexts/PersonaContext';
import { cmsApi } from '@/services/cmsApi';
import { 
  Eye, 
  RefreshCw, 
  Bot, 
  Hotel as HotelIcon, 
  MapPin, 
  Calendar,
  Users,
  Heart,
  Accessibility,
  AlertTriangle
} from 'lucide-react';

const disabilityTypes = [
  { 
    id: 'wheelchair_user', 
    name: 'Wheelchair User', 
    icon: '♿', 
    color: 'text-blue-600',
    issues: ['Ramps & elevators info', 'Door width details', 'Bathroom accessibility', 'Accessible images']
  },
  { 
    id: 'dyslexia', 
    name: 'Dyslexia', 
    icon: '📖', 
    color: 'text-green-600',
    issues: ['Long dense text', 'Complex words', 'Overwhelming paragraphs', 'Needs visual support']
  },
  { 
    id: 'cognitive_impairment', 
    name: 'Cognitive', 
    icon: '🧠', 
    color: 'text-purple-600',
    issues: ['Complex instructions', 'Information overload', 'Unclear ordering', 'Needs simplification']
  },
  { 
    id: 'anxiety_travel_fear', 
    name: 'Anxiety', 
    icon: '😰', 
    color: 'text-orange-600',
    issues: ['Safety info hidden', 'Formal tone', 'Information overload', 'Cancellation unclear']
  },
  { 
    id: 'low_vision', 
    name: 'Low Vision', 
    icon: '👓', 
    color: 'text-red-600',
    issues: ['Small text', 'Low contrast', 'Missing alt text', 'Cluttered navigation']
  },
];

interface ContentItem {
  id: number;
  name: string;
  location?: string;
  content_type: string;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

const ContentPreview = () => {
  const { disabilityType } = usePersona();
  const { toast } = useToast();
  const [selectedContentType, setSelectedContentType] = useState<'hotel' | 'tour' | 'care-service'>('hotel');
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [selectedDisabilityType, setSelectedDisabilityType] = useState<string>(disabilityType || '');
  const [content, setContent] = useState<ContentItem | null>(null);
  const [availableContent, setAvailableContent] = useState<ContentItem[]>([]);
  const [apiDisabilityTypes, setApiDisabilityTypes] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Load available disability types
  useEffect(() => {
    const loadDisabilityTypes = async () => {
      try {
        const response = await cmsApi.getDisabilityTypes();
        if (response.success) {
          setApiDisabilityTypes(response.descriptions);
        }
      } catch (error) {
        console.error('Failed to load disability types:', error);
      }
    };
    loadDisabilityTypes();
  }, []);

  // Load available content when content type changes
  useEffect(() => {
    const loadAvailableContent = async () => {
      try {
        if (selectedContentType === 'hotel') {
          const response = await cmsApi.getHotels();
          if (response.success) {
            setAvailableContent(response.hotels);
          }
        }
        // Add similar logic for tours and care services when you have list endpoints
      } catch (error) {
        console.error('Failed to load content:', error);
      }
    };
    loadAvailableContent();
  }, [selectedContentType]);

  // Load content when selection changes
  useEffect(() => {
    if (selectedContentId && selectedContentType) {
      loadContent();
    }
  }, [selectedContentId, selectedContentType, selectedDisabilityType]);

  const loadContent = async () => {
    if (!selectedContentId) return;
    
    setIsLoading(true);
    try {
      let response;
      
      switch (selectedContentType) {
        case 'hotel':
          response = await cmsApi.getHotel(selectedContentId, selectedDisabilityType);
          setContent(response.hotel);
          break;
        case 'tour':
          response = await cmsApi.getTour(selectedContentId, selectedDisabilityType);
          setContent(response.tour);
          break;
        case 'care-service':
          response = await cmsApi.getCareService(selectedContentId, selectedDisabilityType);
          setContent(response.service);
          break;
      }
    } catch (error: any) {
      toast({
        title: 'Error Loading Content',
        description: error.message || 'Failed to load content',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateContent = async () => {
    if (!selectedContentId || !selectedDisabilityType) return;
    
    setIsRegenerating(true);
    try {
      const response = await cmsApi.regenerateAdaptiveContent(
        selectedContentType,
        selectedContentId,
        selectedDisabilityType
      );
      
      if (response.success) {
        toast({
          title: 'Content Regenerated',
          description: `AI has regenerated the content for ${selectedDisabilityType.replace('_', ' ')} users.`,
        });
        
        // Reload the content
        await loadContent();
      }
    } catch (error: any) {
      toast({
        title: 'Regeneration Failed',
        description: error.message || 'Failed to regenerate content',
        variant: 'destructive',
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const getContentIcon = () => {
    switch (selectedContentType) {
      case 'hotel': return HotelIcon;
      case 'tour': return MapPin;
      case 'care-service': return Heart;
      default: return HotelIcon;
    }
  };

  const ContentIcon = getContentIcon();

  const renderContentDetails = () => {
    if (!content) return null;

    switch (selectedContentType) {
      case 'hotel':
        return (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </h3>
                <p>{content.location}</p>
                {content.coordinates && (
                  <p className="text-sm text-muted-foreground">GPS: {content.coordinates}</p>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Pricing</h3>
                <div className="space-y-1">
                  {Object.entries(content.prices || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Accessibility Features */}
            {Object.keys(content.accessibility_features || {}).length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Accessibility className="h-4 w-4" />
                  Accessibility Features
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {Object.entries(content.accessibility_features).map(([key, value]) => (
                    <div key={key} className="p-3 bg-muted/50 rounded-lg">
                      <Badge variant="secondary" className="text-xs mb-2">
                        {key.replace(/_/g, ' ')}
                      </Badge>
                      <p className="text-sm">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {Object.keys(content.amenities || {}).length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Amenities</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  {Object.entries(content.amenities).map(([key, value]) => (
                    <div key={key} className="text-sm p-2 bg-muted/30 rounded">
                      <span className="font-medium">{key.replace(/_/g, ' ')}</span>
                      <p className="text-muted-foreground">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {content.accessibility_notes && (
              <div>
                <h3 className="font-semibold mb-2">Accessibility Notes</h3>
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-sm">{content.accessibility_notes}</p>
                </div>
              </div>
            )}

            {content.parking && (
              <div>
                <h3 className="font-semibold mb-2">Parking Information</h3>
                <p className="text-sm text-muted-foreground">{content.parking}</p>
              </div>
            )}
          </div>
        );

      case 'tour':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm">{content.description}</p>
            </div>

            {content.destinations && content.destinations.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Destinations</h3>
                <div className="flex flex-wrap gap-2">
                  {content.destinations.map((destination: string, index: number) => (
                    <Badge key={index} variant="outline">{destination}</Badge>
                  ))}
                </div>
              </div>
            )}

            {content.duration && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Duration
                </h3>
                <p className="text-sm">{content.duration}</p>
              </div>
            )}

            {content.support_services && content.support_services.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Support Services</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {content.support_services.map((service: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Heart className="h-4 w-4 text-primary" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'care-service':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm">{content.description}</p>
            </div>

            {content.care_types && content.care_types.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Care Types</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {content.care_types.map((type: string, index: number) => (
                    <Badge key={index} variant="secondary">{type}</Badge>
                  ))}
                </div>
              </div>
            )}

            {content.staff_qualifications && content.staff_qualifications.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Staff Qualifications
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {content.staff_qualifications.map((qualification: string, index: number) => (
                    <li key={index}>{qualification}</li>
                  ))}
                </ul>
              </div>
            )}

            {content.emergency_contact && Object.keys(content.emergency_contact).length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Emergency Contact</h3>
                <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                  {Object.entries(content.emergency_contact).map(([key, value]) => (
                    <p key={key} className="text-sm">
                      <span className="font-medium">{key.replace(/_/g, ' ')}:</span> {String(value)}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return <p>Content type not supported for preview</p>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Accessibility Issues Overview */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            Accessibility Pain Points Addressed
          </CardTitle>
          <CardDescription className="text-orange-700">
            Our AI adapts content to solve these specific accessibility challenges:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disabilityTypes.map((type) => (
              <div key={type.id} className="p-3 bg-white/70 rounded-lg border border-orange-100">
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{type.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{type.name}</h3>
                    <div className="mt-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Issues Solved:</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        {type.issues.map((issue, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1 h-1 bg-current rounded-full mr-2 flex-shrink-0"></span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Content Preview & AI Management
          </CardTitle>
          <CardDescription>
            Preview and manage AI-generated adaptive content for different disability types.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Content Type</label>
              <Select value={selectedContentType} onValueChange={(value: any) => setSelectedContentType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Hotels</SelectItem>
                  <SelectItem value="tour">Tours</SelectItem>
                  <SelectItem value="care-service">Care Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Content Item</label>
              <Select value={selectedContentId?.toString() || ''} onValueChange={(value) => setSelectedContentId(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content" />
                </SelectTrigger>
                <SelectContent>
                  {availableContent.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name} {item.location && `- ${item.location}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Disability Type</label>
              <Select value={selectedDisabilityType} onValueChange={setSelectedDisabilityType}>
                <SelectTrigger>
                  <SelectValue placeholder="Original content" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Original Content</SelectItem>
                  {Object.entries(apiDisabilityTypes).map(([type, description]) => (
                    <SelectItem key={type} value={type}>
                      {type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleRegenerateContent}
                disabled={!selectedContentId || !selectedDisabilityType || isRegenerating}
                variant="outline"
                className="w-full"
              >
                {isRegenerating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Bot className="h-4 w-4 mr-2" />
                )}
                {isRegenerating ? 'Regenerating...' : 'Regenerate AI'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Display */}
      {content && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ContentIcon className="h-5 w-5" />
                  {content.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Badge variant={selectedDisabilityType ? "default" : "outline"}>
                    {selectedDisabilityType 
                      ? `${selectedDisabilityType.replace(/_/g, ' ')} Optimized`
                      : 'Original Content'
                    }
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Content Type: {content.content_type || 'original'}
                  </span>
                </CardDescription>
              </div>
              
              <div className="text-sm text-muted-foreground text-right">
                <p>Created: {new Date(content.created_at).toLocaleDateString()}</p>
                <p>Updated: {new Date(content.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              renderContentDetails()
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentPreview;