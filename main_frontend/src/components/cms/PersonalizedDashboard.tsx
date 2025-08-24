import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePersona } from "@/contexts/PersonaContext";
import { 
  FileText, Image, Settings, Hotel, MapPin, Users, Calendar, Plus, Edit, Eye, Mountain, Heart
} from "lucide-react";
import CMSHeader from "@/components/cms/CMSHeader";
import ContentManager from "@/components/cms/ContentManager";
import MediaLibrary from "@/components/cms/MediaLibrary";
import SettingsPanel from "@/components/cms/SettingsPanel";
import HotelForm from "@/components/cms/HotelForm";
import ContentPreview from "@/components/cms/ContentPreview";

const PersonalizedDashboard = () => {
  const { disabilityType } = usePersona();
  const [activeTab, setActiveTab] = useState("content");

  // Simplified stats based on disability type
  const getStats = () => {
    const baseStats = [
      { icon: FileText, label: "Content Pages", value: "24", change: "+3 this week" },
      { icon: Hotel, label: "Hotels", value: "87", change: "+5 this month" },
      { icon: MapPin, label: "Tours", value: "156", change: "+12 this month" },
      { icon: Users, label: "Users", value: "2,341", change: "+18% this month" },
    ];

    if (!disabilityType) return baseStats;

    const personalizedStats = {
      wheelchair: [
        { icon: Hotel, label: "Wheelchair Accessible", value: "87", change: "+5 verified" },
        { icon: MapPin, label: "Ramp Access", value: "234", change: "+8 this week" },
        { icon: Users, label: "Wheelchair Users", value: "892", change: "+24%" },
        { icon: FileText, label: "Mobility Content", value: "45", change: "+6 new" },
      ],
      'low-vision': [
        { icon: Eye, label: "Audio Content", value: "123", change: "+15 this month" },
        { icon: FileText, label: "High Contrast", value: "67", change: "+5 this week" },
        { icon: Users, label: "Low Vision Users", value: "456", change: "+12%" },
        { icon: Mountain, label: "Audio Tours", value: "34", change: "+3 new" },
      ],
      cognitive: [
        { icon: FileText, label: "Simple Content", value: "34", change: "+6 this week" },
        { icon: Heart, label: "Support Guides", value: "28", change: "+4 this month" },
        { icon: Users, label: "Cognitive Users", value: "234", change: "+18%" },
        { icon: Mountain, label: "Easy Tours", value: "12", change: "+2 new" },
      ],
      anxiety: [
        { icon: Heart, label: "Calming Content", value: "45", change: "+7 this week" },
        { icon: Users, label: "24/7 Support", value: "Active", change: "Always on" },
        { icon: Mountain, label: "Quiet Tours", value: "89", change: "+3 this week" },
        { icon: FileText, label: "Stress-Free Guides", value: "32", change: "+5 new" },
      ]
    };

    return personalizedStats[disabilityType] || baseStats;
  };

  const getDashboardTitle = () => {
    const titles = {
      wheelchair: "Wheelchair Accessibility Hub",
      'low-vision': "Visual Accessibility Center", 
      cognitive: "Simplified Content Hub",
      anxiety: "Supportive Content Dashboard",
      dyslexia: "Reading-Friendly Hub",
      hearing: "Visual Communication Center"
    };
    return titles[disabilityType as keyof typeof titles] || "Content Management System";
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <CMSHeader />
      
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="relative mb-12 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-primary" />
          <div className="relative px-8 py-16 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Mountain className="h-6 w-6 text-white" />
              <span className="text-white font-semibold">CLAIRE & GEORGE CMS</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {getDashboardTitle()}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              {disabilityType ? `Specialized tools for ${disabilityType} accessibility` : "Manage your accessible content"}
            </p>
            <Button variant="hero" size="lg" className="bg-white/20 hover:bg-white/30 text-white">
              <Plus className="h-5 w-5 mr-2" />
              Create Content
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-alpine transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-primary">{stat.change}</p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disability Type Badge */}
        {disabilityType && (
          <div className="mb-8">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="capitalize">
                    {disabilityType.replace('-', ' ')} Support Active
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    CMS optimized for {disabilityType.replace('-', ' ')} accessibility
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main CMS Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-fit">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="create-hotel" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Hotel
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <ContentManager />
          </TabsContent>

          <TabsContent value="create-hotel" className="space-y-6">
            <HotelForm />
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <ContentPreview />
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <MediaLibrary />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>
                  {disabilityType ? `${disabilityType} accessibility metrics` : 'General accessibility metrics'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">
                    {disabilityType ? `Tracking ${disabilityType} user engagement and content performance` : 'Comprehensive accessibility analytics'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PersonalizedDashboard;