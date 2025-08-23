import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HotelForm } from './forms/HotelForm';
import { TourForm } from './forms/TourForm';
import { CareServiceForm } from './forms/CareServiceForm';
import { Hotel, MapPin, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'hotel' | 'tour' | 'care-service';
}

export const CreateContentDialog: React.FC<CreateContentDialogProps> = ({
  open,
  onOpenChange,
  defaultTab = 'hotel'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { toast } = useToast();

  const handleSubmit = async (data: any, contentType: string) => {
    setIsLoading(true);
    
    try {
      // Determine the API endpoint
      let endpoint = '';
      switch (contentType) {
        case 'hotel':
          endpoint = '/api/hotels';
          break;
        case 'tour':
          endpoint = '/api/tours';
          break;
        case 'care-service':
          endpoint = '/api/care-services';
          break;
      }

      // Make API call to backend
      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Content Created Successfully!",
          description: `Your ${contentType.replace('-', ' ')} has been created with AI-powered accessibility adaptations.`,
        });
        onOpenChange(false);
        
        // Refresh the page or update the content list
        window.location.reload();
      } else {
        throw new Error(result.error || 'Failed to create content');
      }
      
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : 'An error occurred while creating content',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b bg-background shrink-0">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Create New Accessible Content
          </DialogTitle>
          <p className="text-muted-foreground mt-2">
            AI will automatically adapt your content for wheelchair users, dyslexia, cognitive impairments, travel anxiety, and low vision
          </p>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'hotel' | 'tour' | 'care-service')} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-3 border-b bg-background shrink-0">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hotel" className="flex items-center gap-2">
                <Hotel className="h-4 w-4" />
                Hotel
              </TabsTrigger>
              <TabsTrigger value="tour" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Tour
              </TabsTrigger>
              <TabsTrigger value="care-service" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Care Service
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="px-6 py-6">
                <TabsContent value="hotel" className="mt-0">
                  <HotelForm 
                    onSubmit={(data) => handleSubmit(data, 'hotel')}
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="tour" className="mt-0">
                  <TourForm 
                    onSubmit={(data) => handleSubmit(data, 'tour')}
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="care-service" className="mt-0">
                  <CareServiceForm 
                    onSubmit={(data) => handleSubmit(data, 'care-service')}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </div>
            </ScrollArea>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};