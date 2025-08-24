import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cmsApi, HotelContent } from '@/services/cmsApi';
import { usePersona } from '@/contexts/PersonaContext';
import { 
  Save, 
  Eye, 
  RefreshCw, 
  Plus, 
  Trash2, 
  MapPin, 
  DollarSign,
  Wifi,
  Car,
  Utensils,
  Accessibility
} from 'lucide-react';

const HotelForm = () => {
  const { disabilityType } = usePersona();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [adaptiveContent, setAdaptiveContent] = useState<any>(null);
  
  const [formData, setFormData] = useState<HotelContent>({
    name: '',
    location: '',
    coordinates: '',
    prices: {},
    accessibility_features: {},
    images: [],
    cancellation_conditions: '',
    meal_times: {},
    parking: '',
    amenities: {},
    nearby_accessible_places: [],
    accessibility_notes: ''
  });

  const [dynamicFields, setDynamicFields] = useState({
    prices: [{ key: '', value: '' }],
    accessibility_features: [{ key: '', value: '' }],
    amenities: [{ key: '', value: '' }],
    meal_times: [{ key: '', value: '' }]
  });

  const handleInputChange = (field: keyof HotelContent, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDynamicFieldChange = (section: string, index: number, type: 'key' | 'value', newValue: string) => {
    const newFields = [...(dynamicFields as any)[section]];
    newFields[index][type] = newValue;
    
    // Add new empty field if this is the last one and it's not empty
    if (index === newFields.length - 1 && (newFields[index].key || newFields[index].value)) {
      newFields.push({ key: '', value: '' });
    }
    
    setDynamicFields(prev => ({ ...prev, [section]: newFields }));
    
    // Update form data
    const fieldObject = newFields.reduce((acc: any, field: any) => {
      if (field.key && field.value) {
        acc[field.key] = field.value;
      }
      return acc;
    }, {});
    
    handleInputChange(section as keyof HotelContent, fieldObject);
  };

  const removeDynamicField = (section: string, index: number) => {
    const newFields = [...(dynamicFields as any)[section]];
    newFields.splice(index, 1);
    setDynamicFields(prev => ({ ...prev, [section]: newFields }));
    
    // Update form data
    const fieldObject = newFields.reduce((acc: any, field: any) => {
      if (field.key && field.value) {
        acc[field.key] = field.value;
      }
      return acc;
    }, {});
    
    handleInputChange(section as keyof HotelContent, fieldObject);
  };

  const handleImageAdd = () => {
    const newImages = [...formData.images, ''];
    handleInputChange('images', newImages);
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    handleInputChange('images', newImages);
  };

  const handleImageRemove = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    handleInputChange('images', newImages);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!formData.name || !formData.location) {
        toast({
          title: 'Validation Error',
          description: 'Name and location are required fields.',
          variant: 'destructive',
        });
        return;
      }

      const response = await cmsApi.createHotel(formData);
      
      if (response.success) {
        toast({
          title: 'Success!',
          description: `Hotel "${formData.name}" created successfully with AI-generated adaptive content.`,
        });
        
        // Reset form
        setFormData({
          name: '',
          location: '',
          coordinates: '',
          prices: {},
          accessibility_features: {},
          images: [],
          cancellation_conditions: '',
          meal_times: {},
          parking: '',
          amenities: {},
          nearby_accessible_places: [],
          accessibility_notes: ''
        });
        
        setDynamicFields({
          prices: [{ key: '', value: '' }],
          accessibility_features: [{ key: '', value: '' }],
          amenities: [{ key: '', value: '' }],
          meal_times: [{ key: '', value: '' }]
        });
        
      } else {
        throw new Error(response.error || 'Failed to create hotel');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create hotel',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    setIsLoading(true);
    try {
      // First validate the content
      const validation = await cmsApi.validateContent('hotel', formData);
      
      if (validation.success) {
        setAdaptiveContent(validation.validated_content);
        setIsPreviewMode(true);
        
        toast({
          title: 'Preview Ready',
          description: 'Content validated and preview generated.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Validation Error',
        description: error.message || 'Failed to validate content',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPreviewMode && adaptiveContent) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Hotel Preview: {adaptiveContent.name}
              </CardTitle>
              <CardDescription>
                {disabilityType ? `Optimized for ${disabilityType.replace('_', ' ')} users` : 'Original content preview'}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsPreviewMode(false)}>
              Back to Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hotel Preview Content */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </h3>
              <p>{adaptiveContent.location}</p>
              {adaptiveContent.coordinates && (
                <p className="text-sm text-muted-foreground">GPS: {adaptiveContent.coordinates}</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing
              </h3>
              <div className="space-y-1">
                {Object.entries(adaptiveContent.prices || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <span className="font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accessibility Features */}
          {Object.keys(adaptiveContent.accessibility_features || {}).length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Accessibility className="h-4 w-4" />
                Accessibility Features
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {Object.entries(adaptiveContent.accessibility_features).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {key.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-sm">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {Object.keys(adaptiveContent.amenities || {}).length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Amenities</h3>
              <div className="grid md:grid-cols-3 gap-2">
                {Object.entries(adaptiveContent.amenities).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    <span>{key}: {String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          {adaptiveContent.accessibility_notes && (
            <div>
              <h3 className="font-semibold mb-2">Accessibility Notes</h3>
              <p className="text-sm bg-muted/50 p-3 rounded-lg">
                {adaptiveContent.accessibility_notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Hotel
        </CardTitle>
        <CardDescription>
          Add a new accessible hotel with AI-generated adaptive content for all disability types.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Hotel Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter hotel name"
                />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="coordinates">GPS Coordinates</Label>
              <Input
                id="coordinates"
                value={formData.coordinates}
                onChange={(e) => handleInputChange('coordinates', e.target.value)}
                placeholder="47.3769, 8.5417"
              />
            </div>

            {/* Dynamic Prices */}
            <div>
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing Information
              </Label>
              {dynamicFields.prices.map((field, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Price type (e.g., 'standard_room')"
                    value={field.key}
                    onChange={(e) => handleDynamicFieldChange('prices', index, 'key', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Price (e.g., 'CHF 280-450')"
                    value={field.value}
                    onChange={(e) => handleDynamicFieldChange('prices', index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  {dynamicFields.prices.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeDynamicField('prices', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="parking">Parking Information</Label>
              <Textarea
                id="parking"
                value={formData.parking}
                onChange={(e) => handleInputChange('parking', e.target.value)}
                placeholder="Describe parking facilities and accessibility"
              />
            </div>

            <div>
              <Label htmlFor="cancellation">Cancellation Policy</Label>
              <Textarea
                id="cancellation"
                value={formData.cancellation_conditions}
                onChange={(e) => handleInputChange('cancellation_conditions', e.target.value)}
                placeholder="Describe cancellation terms and conditions"
              />
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-4">
            {/* Dynamic Accessibility Features */}
            <div>
              <Label className="flex items-center gap-2">
                <Accessibility className="h-4 w-4" />
                Accessibility Features
              </Label>
              {dynamicFields.accessibility_features.map((field, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Feature (e.g., 'wheelchair_ramps')"
                    value={field.key}
                    onChange={(e) => handleDynamicFieldChange('accessibility_features', index, 'key', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Description"
                    value={field.value}
                    onChange={(e) => handleDynamicFieldChange('accessibility_features', index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  {dynamicFields.accessibility_features.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeDynamicField('accessibility_features', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <Label htmlFor="accessibility_notes">Additional Accessibility Notes</Label>
              <Textarea
                id="accessibility_notes"
                value={formData.accessibility_notes}
                onChange={(e) => handleInputChange('accessibility_notes', e.target.value)}
                placeholder="Any additional accessibility information"
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="amenities" className="space-y-4">
            {/* Dynamic Amenities */}
            <div>
              <Label className="flex items-center gap-2">
                <Wifi className="h-4 w-4" />
                Hotel Amenities
              </Label>
              {dynamicFields.amenities.map((field, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Amenity (e.g., 'wifi', 'restaurant')"
                    value={field.key}
                    onChange={(e) => handleDynamicFieldChange('amenities', index, 'key', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Description"
                    value={field.value}
                    onChange={(e) => handleDynamicFieldChange('amenities', index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  {dynamicFields.amenities.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeDynamicField('amenities', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Dynamic Meal Times */}
            <div>
              <Label className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Meal Service Times
              </Label>
              {dynamicFields.meal_times.map((field, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Meal (e.g., 'breakfast', 'dinner')"
                    value={field.key}
                    onChange={(e) => handleDynamicFieldChange('meal_times', index, 'key', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Time (e.g., '7:00 AM - 10:00 AM')"
                    value={field.value}
                    onChange={(e) => handleDynamicFieldChange('meal_times', index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  {dynamicFields.meal_times.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeDynamicField('meal_times', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div>
              <Label>Hotel Images</Label>
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Image URL"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleImageRemove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={handleImageAdd} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Image URL
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 pt-6 border-t">
          <Button onClick={handlePreview} variant="outline" disabled={isLoading}>
            <Eye className="h-4 w-4 mr-2" />
            Preview Content
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary-glow">
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Creating Hotel...' : 'Create Hotel with AI Content'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelForm;