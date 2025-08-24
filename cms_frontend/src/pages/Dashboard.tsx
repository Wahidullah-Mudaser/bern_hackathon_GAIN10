import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { DashboardStats } from '@/components/DashboardStats';
import { ContentCard } from '@/components/ContentCard';
import { ContentPreview } from '@/components/ContentPreview';
import { FeatureHighlight } from '@/components/FeatureHighlight';
import { CreateContentDialog } from '@/components/CreateContentDialog';
import heroImage from '@/assets/hero-accessibility.jpg';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Plus,
  Sparkles,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data for demonstration
const mockStats = {
  totalContent: 47,
  hotels: 18,
  tours: 15,
  careServices: 14,
  adaptations: {
    wheelchair: 47,
    dyslexia: 47,
    cognitive: 47,
    anxiety: 47,
    lowVision: 47
  }
};

const mockContent = [
  {
    id: 1,
    type: 'hotel' as const,
    title: 'Grand Accessibility Resort',
    description: 'Luxury resort with comprehensive accessibility features for all guests',
    location: 'Miami Beach, FL',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    accessibilityTypes: ['wheelchair_user', 'dyslexia', 'low_vision']
  },
  {
    id: 2,
    type: 'tour' as const,
    title: 'Inclusive City Walking Tour',
    description: 'Guided tour designed for people with mobility and cognitive accessibility needs',
    location: 'New York City, NY',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
    accessibilityTypes: ['cognitive_impairment', 'anxiety_travel_fear']
  },
  {
    id: 3,
    type: 'care-service' as const,
    title: 'Specialized Travel Care',
    description: 'Professional care services for travelers with disabilities',
    location: 'Los Angeles, CA',
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    accessibilityTypes: ['wheelchair_user', 'cognitive_impairment', 'dyslexia']
  }
];

export const Dashboard: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createDialogTab, setCreateDialogTab] = useState<'hotel' | 'tour' | 'care-service'>('hotel');
  const [contentData, setContentData] = useState<any[]>([]);

  // Fetch content data from backend
  useEffect(() => {
    const fetchContentData = async () => {
      try {
        setContentLoading(true);
        
        // Fetch all content types
        const [hotelsResponse, toursResponse, careServicesResponse] = await Promise.all([
          fetch('http://127.0.0.1:5001/api/hotels'),
          fetch('http://127.0.0.1:5001/api/tours'),
          fetch('http://127.0.0.1:5001/api/care-services')
        ]);

        const [hotelsData, toursData, careServicesData] = await Promise.all([
          hotelsResponse.json(),
          toursResponse.json(),
          careServicesResponse.json()
        ]);

        // Transform data for display
        const transformedData = [
          ...(hotelsData.success ? hotelsData.hotels.map((hotel: any) => ({
            id: hotel.id,
            type: 'hotel' as const,
            title: hotel.name,
            description: hotel.location,
            location: hotel.location,
            createdAt: hotel.created_at,
            updatedAt: hotel.updated_at,
            accessibilityTypes: [] // Will be populated based on actual data
          })) : []),
          ...(toursData.success ? toursData.tours.map((tour: any) => ({
            id: tour.id,
            type: 'tour' as const,
            title: tour.name,
            description: tour.description,
            location: '', // Tours might not have location
            createdAt: tour.created_at,
            updatedAt: tour.updated_at,
            accessibilityTypes: []
          })) : []),
          ...(careServicesData.success ? careServicesData.care_services.map((service: any) => ({
            id: service.id,
            type: 'care-service' as const,
            title: service.name,
            description: service.description,
            location: '', // Services might not have location
            createdAt: service.created_at,
            updatedAt: service.updated_at,
            accessibilityTypes: []
          })) : [])
        ];

        setContentData(transformedData);
      } catch (error) {
        console.error('Error fetching content data:', error);
        // Fallback to mock data if API fails
        setContentData(mockContent);
      } finally {
        setContentLoading(false);
      }
    };

    fetchContentData();
  }, []);

  const handleViewContent = async (id: number) => {
    setIsLoading(true);
    try {
      // Find the content item to determine its type
      const contentItem = contentData.find(item => item.id === id);
      if (!contentItem) {
        console.error('Content item not found');
        return;
      }

      // Fetch detailed content from backend based on type
      let response;
      if (contentItem.type === 'hotel') {
        response = await fetch(`http://127.0.0.1:5001/api/hotels/${id}`);
      } else if (contentItem.type === 'tour') {
        response = await fetch(`http://127.0.0.1:5001/api/tours/${id}`);
      } else if (contentItem.type === 'care-service') {
        response = await fetch(`http://127.0.0.1:5001/api/care-services/${id}`);
      } else {
        console.error('Unknown content type');
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch ${contentItem.type} data`);
      }

      const data = await response.json();
      
      if (data.success) {
        setSelectedContent({
          ...data[contentItem.type === 'hotel' ? 'hotel' : contentItem.type === 'tour' ? 'tour' : 'service'],
          id: id,
          type: contentItem.type
        });
      } else {
        throw new Error(data.error || 'Failed to fetch content');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      // Fallback to mock data if API fails
      const content = mockContent.find(item => item.id === id);
      if (content) {
        // Mock detailed content based on type
        let detailedContent;
        if (content.type === 'hotel') {
          detailedContent = {
            name: content.title,
            location: content.location,
            prices: { standard: 299, deluxe: 399, suite: 599 },
            amenities: {
              'Free WiFi': 'High-speed internet throughout property',
              'Pool': 'Heated pool with accessible entry',
              'Fitness Center': 'Fully accessible gym equipment',
              'Restaurant': 'On-site dining with dietary accommodations'
            },
            accessibility_features: {
              'Wheelchair Access': 'Ramps and elevators throughout property',
              'Visual Alerts': 'Flashing lights for hearing impaired',
              'Braille Signage': 'All rooms and common areas',
              'Accessible Bathrooms': 'Roll-in showers and grab bars'
            }
          };
        } else if (content.type === 'tour') {
          detailedContent = {
            name: content.title,
            description: content.description,
            duration: '3 hours',
            destinations: ['Central Park', 'Times Square', 'Brooklyn Bridge'],
            activities: [
              { name: 'Guided Walking', description: 'Slow-paced with frequent rest stops' },
              { name: 'Historical Commentary', description: 'Clear audio guides available' },
              { name: 'Photo Opportunities', description: 'Accessible viewing areas' }
            ]
          };
        } else {
          detailedContent = {
            name: content.title,
            description: content.description,
            care_types: ['Personal Care', 'Medical Support', 'Mobility Assistance'],
            staff_qualifications: ['Licensed Nurses', 'Certified Caregivers', 'First Aid Trained']
          };
        }
        
        setSelectedContent({
          ...detailedContent,
          id: content.id,
          type: content.type
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateContent = (contentType?: string) => {
    if (contentType && ['hotel', 'tour', 'care-service'].includes(contentType)) {
      setCreateDialogTab(contentType as 'hotel' | 'tour' | 'care-service');
    }
    setCreateDialogOpen(true);
  };

  const filteredContent = contentData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    
    return matchesSearch && matchesTab;
  });

  if (selectedContent) {
    return (
      <div className="min-h-screen bg-gradient-surface">
        <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
        <ContentPreview
          content={selectedContent}
          contentType={selectedContent.type}
          onBack={() => setSelectedContent(null)}
          onEdit={() => console.log('Edit content')}
          onRegenerateContent={async (disabilityType) => {
            try {
              console.log('Regenerate content for:', disabilityType);
              
              // Call the backend API to regenerate content
              const response = await fetch(`http://127.0.0.1:5001/api/regenerate-content/${selectedContent.type}/${selectedContent.id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  disability_type: disabilityType
                })
              });

              if (!response.ok) {
                throw new Error('Failed to regenerate content');
              }

              const data = await response.json();
              
              if (data.success) {
                // Update the selected content with the new adaptive content
                setSelectedContent(prev => ({
                  ...prev,
                  ...data.content
                }));
              } else {
                throw new Error(data.error || 'Failed to regenerate content');
              }
            } catch (error) {
              console.error('Error regenerating content:', error);
              // You might want to show a toast notification here
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header 
        onCreateContent={handleCreateContent}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary text-white mb-12">
          <div className="absolute inset-0 bg-black/20"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${heroImage})` }}
          ></div>
          <div className="relative z-10 px-8 py-16 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              AI-Powered Accessibility Revolution
            </div>
            <h1 className="text-5xl font-bold text-white">
              Welcome to <span className="text-yellow-300">AccessCMS</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              The world's first AI-powered CMS that automatically adapts content for wheelchair users, dyslexia, cognitive impairments, travel anxiety, and low vision - creating truly inclusive digital experiences.
            </p>
            
            <div className="flex items-center justify-center gap-4 pt-6">
              <Button 
                onClick={() => handleCreateContent()}
                className="bg-white text-primary hover:bg-white/90 hover:shadow-xl transition-all duration-300 text-lg px-8 py-3"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Start Creating Accessible Content
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-3" size="lg">
                <BarChart3 className="h-5 w-5 mr-2" />
                View Impact Analytics
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-6 mb-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Powered by Advanced AI</h2>
            <p className="text-lg text-muted-foreground">Transforming how we create accessible content for everyone</p>
          </div>
          <FeatureHighlight />
        </div>

        {/* Dashboard Stats */}
        <DashboardStats stats={mockStats} />

        {/* Content Management Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Content Library</h2>
              <p className="text-muted-foreground">Manage your accessible content across different platforms</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
              <div className="flex items-center border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-7 w-7 p-0"
                >
                  <Grid3X3 className="h-3 w-3" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-7 w-7 p-0"
                >
                  <List className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Content ({contentData.length})</TabsTrigger>
                <TabsTrigger value="hotel">Hotels ({contentData.filter(c => c.type === 'hotel').length})</TabsTrigger>
                <TabsTrigger value="tour">Tours ({contentData.filter(c => c.type === 'tour').length})</TabsTrigger>
                <TabsTrigger value="care-service">Care Services ({contentData.filter(c => c.type === 'care-service').length})</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-accent-soft text-accent-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {filteredContent.length} results
                </Badge>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-3 bg-muted rounded"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredContent.length > 0 ? (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {filteredContent.map((content) => (
                    <ContentCard
                      key={content.id}
                      {...content}
                      onView={handleViewContent}
                      onEdit={(id) => console.log('Edit:', id)}
                      onDelete={(id) => console.log('Delete:', id)}
                      onDuplicate={(id) => console.log('Duplicate:', id)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">No content found</h3>
                        <p className="text-muted-foreground">
                          {searchQuery 
                            ? `No results for "${searchQuery}"`
                            : `Start by creating your first ${activeTab === 'all' ? 'content item' : activeTab}`
                          }
                        </p>
                      </div>
                      <Button onClick={() => handleCreateContent()} className="bg-gradient-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Content
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Create Content Dialog */}
      <CreateContentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultTab={createDialogTab}
      />
    </div>
  );
};