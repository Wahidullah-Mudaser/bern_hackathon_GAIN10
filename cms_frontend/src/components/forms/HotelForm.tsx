import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DynamicFieldArray } from './DynamicFieldArray';
import { DynamicKeyValue } from './DynamicKeyValue';
import { Hotel, MapPin, DollarSign, Shield, Camera, Clock, Car, Star, FileText } from 'lucide-react';

const hotelSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  location: z.string().min(1, "Location is required"),
  coordinates: z.string().optional(),
  description: z.string().default(""),
  prices: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  accessibility_features: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  images: z.array(z.string()).default([]),
  cancellation_conditions: z.string().default(""),
  meal_times: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  parking: z.string().default(""),
  amenities: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  nearby_accessible_places: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  accessibility_notes: z.string().default("")
});

type HotelFormData = z.infer<typeof hotelSchema>;

interface HotelFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const HotelForm: React.FC<HotelFormProps> = ({ onSubmit, isLoading }) => {
  const { control, register, handleSubmit, formState: { errors } } = useForm<HotelFormData>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: "",
      location: "",
      coordinates: "",
      description: "",
      prices: [],
      accessibility_features: [],
      images: [],
      cancellation_conditions: "",
      meal_times: [],
      parking: "",
      amenities: [],
      nearby_accessible_places: [],
      accessibility_notes: ""
    }
  });

  const onFormSubmit = (data: HotelFormData) => {
    // Transform array data to dictionaries for backend
    const transformedData = {
      ...data,
      prices: Object.fromEntries(data.prices.map(item => [item.key, item.value])),
      accessibility_features: Object.fromEntries(data.accessibility_features.map(item => [item.key, item.value])),
      meal_times: Object.fromEntries(data.meal_times.map(item => [item.key, item.value])),
      amenities: Object.fromEntries(data.amenities.map(item => [item.key, item.value])),
      nearby_accessible_places: data.nearby_accessible_places.map(item => ({ [item.key]: item.value }))
    };
    onSubmit(transformedData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hotel className="h-5 w-5 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Hotel Name *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Grand Accessibility Resort"
                className="mt-1"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="Miami Beach, FL"
                className="mt-1"
              />
              {errors.location && (
                <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="coordinates">
              <MapPin className="h-4 w-4 inline mr-1" />
              GPS Coordinates
            </Label>
            <Input
              id="coordinates"
              {...register("coordinates")}
              placeholder="25.7907, -80.1300"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter a brief description of the hotel..."
              className="mt-1 min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-green-600" />
            Pricing Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicKeyValue
            control={control}
            name="prices"
            label="Room Prices"
            keyPlaceholder="Room type (e.g., Standard)"
            valuePlaceholder="Price (e.g., $299)"
            description="Add different room types and their prices"
          />
        </CardContent>
      </Card>

      {/* Accessibility Features */}
      <Card className="border-l-4 border-l-accent">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-accent" />
            Accessibility Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DynamicKeyValue
            control={control}
            name="accessibility_features"
            label="Accessibility Features"
            keyPlaceholder="Feature (e.g., Wheelchair Access)"
            valuePlaceholder="Description"
            description="List all accessibility features and their descriptions"
          />
          
          <Separator />
          
          <div>
            <Label htmlFor="accessibility_notes">Additional Accessibility Notes</Label>
            <Textarea
              id="accessibility_notes"
              {...register("accessibility_notes")}
              placeholder="Any additional accessibility information..."
              className="mt-1 min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Camera className="h-5 w-5 text-purple-600" />
            Media & Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicFieldArray
            control={control}
            name="images"
            label="Image URLs"
            placeholder="https://example.com/hotel-image.jpg"
            description="Add URLs to hotel images"
          />
        </CardContent>
      </Card>

      {/* Services & Amenities */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-yellow-600" />
            Services & Amenities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <DynamicKeyValue
            control={control}
            name="amenities"
            label="Hotel Amenities"
            keyPlaceholder="Amenity (e.g., Pool)"
            valuePlaceholder="Description"
            description="List hotel amenities and facilities"
          />
          
          <Separator />
          
          <DynamicKeyValue
            control={control}
            name="meal_times"
            label="Meal Service Times"
            keyPlaceholder="Meal (e.g., Breakfast)"
            valuePlaceholder="Time (e.g., 7:00 AM - 10:00 AM)"
            description="Dining service hours"
          />
          
          <Separator />
          
          <div>
            <Label htmlFor="parking">
              <Car className="h-4 w-4 inline mr-1" />
              Parking Information
            </Label>
            <Textarea
              id="parking"
              {...register("parking")}
              placeholder="Describe parking availability, accessibility, and pricing..."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Policies & Location */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-blue-600" />
            Policies & Nearby Places
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="cancellation_conditions">Cancellation Policy</Label>
            <Textarea
              id="cancellation_conditions"
              {...register("cancellation_conditions")}
              placeholder="Describe cancellation terms and conditions..."
              className="mt-1"
            />
          </div>
          
          <Separator />
          
          <DynamicKeyValue
            control={control}
            name="nearby_accessible_places"
            label="Nearby Accessible Places"
            keyPlaceholder="Place name"
            valuePlaceholder="Description & accessibility info"
            description="List accessible venues and attractions nearby"
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="sticky bottom-0 bg-background border-t pt-6 mt-8 -mx-6 px-6 pb-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            All fields will be processed by AI to create accessible versions
          </p>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="px-8 py-3 bg-gradient-primary text-white font-medium hover:shadow-lg transition-all duration-300 min-w-[160px]"
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </div>
            ) : (
              "Create Hotel"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};