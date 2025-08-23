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
import { MapPin, Camera, Clock, Activity, Shield, Users } from 'lucide-react';

const tourSchema = z.object({
  name: z.string().min(1, "Tour name is required"),
  description: z.string().min(1, "Description is required"),
  destinations: z.array(z.string()).default([]),
  activities: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  accessibility_features: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  photos: z.array(z.string()).default([]),
  duration: z.string().default(""),
  itinerary: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  support_services: z.array(z.string()).default([])
});

type TourFormData = z.infer<typeof tourSchema>;

interface TourFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const TourForm: React.FC<TourFormProps> = ({ onSubmit, isLoading }) => {
  const { control, register, handleSubmit, formState: { errors } } = useForm<TourFormData>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      name: "",
      description: "",
      destinations: [],
      activities: [],
      accessibility_features: [],
      photos: [],
      duration: "",
      itinerary: [],
      support_services: []
    }
  });

  const onFormSubmit = (data: TourFormData) => {
    // Transform array data for backend
    const transformedData = {
      ...data,
      activities: data.activities.map(item => ({ name: item.key, description: item.value })),
      accessibility_features: Object.fromEntries(data.accessibility_features.map(item => [item.key, item.value])),
      itinerary: data.itinerary.map(item => ({ time: item.key, activity: item.value }))
    };
    onSubmit(transformedData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            Tour Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Tour Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Inclusive City Walking Tour"
              className="mt-1"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description">Tour Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Guided tour designed for people with mobility and cognitive accessibility needs..."
              className="mt-1 min-h-[100px]"
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="duration">
              <Clock className="h-4 w-4 inline mr-1" />
              Tour Duration
            </Label>
            <Input
              id="duration"
              {...register("duration")}
              placeholder="3 hours"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Destinations */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-blue-600" />
            Destinations & Places
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicFieldArray
            control={control}
            name="destinations"
            label="Tour Destinations"
            placeholder="Central Park, Times Square, Brooklyn Bridge..."
            description="Add places and landmarks included in the tour"
          />
        </CardContent>
      </Card>

      {/* Activities */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-green-600" />
            Activities & Experiences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicKeyValue
            control={control}
            name="activities"
            label="Tour Activities"
            keyPlaceholder="Activity name (e.g., Guided Walking)"
            valuePlaceholder="Activity description"
            description="List activities and experiences during the tour"
          />
        </CardContent>
      </Card>

      {/* Itinerary */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-purple-600" />
            Detailed Itinerary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicKeyValue
            control={control}
            name="itinerary"
            label="Schedule"
            keyPlaceholder="Time (e.g., 9:00 AM)"
            valuePlaceholder="Activity or location"
            description="Create a detailed schedule for the tour"
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
        <CardContent>
          <DynamicKeyValue
            control={control}
            name="accessibility_features"
            label="Accessibility Features"
            keyPlaceholder="Feature (e.g., Audio Guide)"
            valuePlaceholder="Description"
            description="List accessibility accommodations for activities"
          />
        </CardContent>
      </Card>

      {/* Support Services */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-orange-600" />
            Support Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicFieldArray
            control={control}
            name="support_services"
            label="Available Support Services"
            placeholder="Personal assistance, Sign language interpreter..."
            description="List support services available during the tour"
          />
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Camera className="h-5 w-5 text-pink-600" />
            Tour Photos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicFieldArray
            control={control}
            name="photos"
            label="Photo URLs"
            placeholder="https://example.com/tour-photo.jpg"
            description="Add URLs to tour and destination photos"
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
              "Create Tour"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};