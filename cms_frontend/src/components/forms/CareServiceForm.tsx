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
import { Heart, Users, DollarSign, Camera, Phone, Shield } from 'lucide-react';

const careServiceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  care_types: z.array(z.string()).default([]),
  staff_qualifications: z.array(z.string()).default([]),
  pricing_insurance: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  images: z.array(z.string()).default([]),
  emergency_contact: z.array(z.object({ key: z.string(), value: z.string() })).default([]),
  accessibility_features: z.array(z.object({ key: z.string(), value: z.string() })).default([])
});

type CareServiceFormData = z.infer<typeof careServiceSchema>;

interface CareServiceFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const CareServiceForm: React.FC<CareServiceFormProps> = ({ onSubmit, isLoading }) => {
  const { control, register, handleSubmit, formState: { errors } } = useForm<CareServiceFormData>({
    resolver: zodResolver(careServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      care_types: [],
      staff_qualifications: [],
      pricing_insurance: [],
      images: [],
      emergency_contact: [],
      accessibility_features: []
    }
  });

  const onFormSubmit = (data: CareServiceFormData) => {
    // Transform array data for backend
    const transformedData = {
      ...data,
      pricing_insurance: Object.fromEntries(data.pricing_insurance.map(item => [item.key, item.value])),
      emergency_contact: Object.fromEntries(data.emergency_contact.map(item => [item.key, item.value])),
      accessibility_features: Object.fromEntries(data.accessibility_features.map(item => [item.key, item.value]))
    };
    onSubmit(transformedData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-primary" />
            Service Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Specialized Travel Care"
              className="mt-1"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="description">Service Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Professional care services for travelers with disabilities..."
              className="mt-1 min-h-[100px]"
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Care Types */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-red-600" />
            Types of Care
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicFieldArray
            control={control}
            name="care_types"
            label="Available Care Types"
            placeholder="Personal Care, Medical Support, Mobility Assistance..."
            description="List the different types of care services offered"
          />
        </CardContent>
      </Card>

      {/* Staff Qualifications */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-blue-600" />
            Staff & Qualifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicFieldArray
            control={control}
            name="staff_qualifications"
            label="Staff Qualifications"
            placeholder="Licensed Nurses, Certified Caregivers, First Aid Trained..."
            description="List staff qualifications and certifications"
          />
        </CardContent>
      </Card>

      {/* Pricing & Insurance */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-green-600" />
            Pricing & Insurance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicKeyValue
            control={control}
            name="pricing_insurance"
            label="Pricing & Insurance Details"
            keyPlaceholder="Service type (e.g., Hourly Rate)"
            valuePlaceholder="Details (e.g., $50/hour, Medicare accepted)"
            description="Add pricing information and insurance details"
          />
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border-l-4 border-l-destructive">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Phone className="h-5 w-5 text-destructive" />
            Emergency Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicKeyValue
            control={control}
            name="emergency_contact"
            label="Emergency Contacts"
            keyPlaceholder="Contact type (e.g., 24/7 Hotline)"
            valuePlaceholder="Contact details (e.g., +1-800-EMERGENCY)"
            description="Provide emergency contact information"
          />
        </CardContent>
      </Card>

      {/* Accessibility Features */}
      <Card className="border-l-4 border-l-accent">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-accent" />
            Service Accessibility Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicKeyValue
            control={control}
            name="accessibility_features"
            label="Accessibility Features"
            keyPlaceholder="Feature (e.g., Sign Language Support)"
            valuePlaceholder="Description"
            description="List accessibility features of the care service"
          />
        </CardContent>
      </Card>

      {/* Media */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Camera className="h-5 w-5 text-purple-600" />
            Service Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicFieldArray
            control={control}
            name="images"
            label="Image URLs"
            placeholder="https://example.com/service-image.jpg"
            description="Add URLs to service photos and facility images"
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
              "Create Care Service"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};