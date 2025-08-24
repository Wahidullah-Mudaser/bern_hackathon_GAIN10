import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Shield, 
  Accessibility, 
  Mail, 
  Phone, 
  MapPin,
  Save,
  RefreshCw
} from "lucide-react";

const SettingsPanel = () => {
  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground">Configure your Claire & George CMS</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Site Configuration
              </CardTitle>
              <CardDescription>
                Basic settings for your accessible tourism website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="site-title">Site Title</Label>
                  <Input 
                    id="site-title" 
                    defaultValue="Claire & George - Accessible Switzerland"
                    placeholder="Enter site title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site-tagline">Tagline</Label>
                  <Input 
                    id="site-tagline" 
                    defaultValue="Accessible holidays and travel in Switzerland"
                    placeholder="Enter site tagline"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea 
                  id="site-description"
                  defaultValue="We are your one stop shop for accessible holidays and travel in Switzerland. Our award-winning team has over 10 years of experience in simplifying holidays for people affected by physical or sensory disability."
                  placeholder="Enter site description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="default-language">Default Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="it">Italiano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="europe-zurich">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="europe-zurich">Europe/Zurich</SelectItem>
                      <SelectItem value="europe-vienna">Europe/Vienna</SelectItem>
                      <SelectItem value="europe-berlin">Europe/Berlin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable the website for maintenance
                  </p>
                </div>
                <Switch id="maintenance-mode" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Accessibility Features
              </CardTitle>
              <CardDescription>
                Configure accessibility settings for your users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-contrast">High Contrast Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable high contrast colors for better visibility
                    </p>
                  </div>
                  <Switch id="high-contrast" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="keyboard-navigation">Enhanced Keyboard Navigation</Label>
                    <p className="text-sm text-muted-foreground">
                      Improve keyboard navigation with focus indicators
                    </p>
                  </div>
                  <Switch id="keyboard-navigation" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="screen-reader">Screen Reader Optimization</Label>
                    <p className="text-sm text-muted-foreground">
                      Enhanced support for screen readers
                    </p>
                  </div>
                  <Switch id="screen-reader" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="alt-text-required">Require Alt Text for Images</Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce alt text for all uploaded images
                    </p>
                  </div>
                  <Switch id="alt-text-required" defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessibility-statement">Accessibility Statement</Label>
                <Textarea 
                  id="accessibility-statement"
                  defaultValue="Claire & George is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards."
                  placeholder="Enter accessibility statement"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                SEO Settings
              </CardTitle>
              <CardDescription>
                Search engine optimization configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meta-description">Default Meta Description</Label>
                <Textarea 
                  id="meta-description"
                  defaultValue="Accessible holidays and travel in Switzerland. Expert advice, accessible hotels, and private tours for travelers with disabilities. Contact Claire & George for barrier-free Swiss adventures."
                  placeholder="Enter meta description (max 160 characters)"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">Max 160 characters for optimal SEO</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-keywords">Keywords</Label>
                <Input 
                  id="meta-keywords" 
                  defaultValue="accessible travel, wheelchair accessible hotels, Switzerland disability travel, barrier-free tourism"
                  placeholder="Enter keywords separated by commas"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="google-analytics">Google Analytics ID</Label>
                  <Input 
                    id="google-analytics" 
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="google-search-console">Search Console Verification</Label>
                  <Input 
                    id="google-search-console" 
                    placeholder="Enter verification code"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="xml-sitemap">Generate XML Sitemap</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate and update XML sitemap
                  </p>
                </div>
                <Switch id="xml-sitemap" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Update your contact details and business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email"
                      defaultValue="contact@claireundgeorge.ch"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      defaultValue="+41 31 301 55 65"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea 
                    id="address"
                    defaultValue="Switzerland"
                    placeholder="Enter business address"
                    className="pl-10"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergency-contact">Emergency Contact</Label>
                  <Input 
                    id="emergency-contact" 
                    defaultValue="+41 31 301 55 65"
                    placeholder="24/7 emergency number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input 
                    id="whatsapp" 
                    placeholder="+41 XX XXX XX XX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-hours">Business Hours</Label>
                <Textarea 
                  id="business-hours"
                  defaultValue="Monday - Friday: 9:00 AM - 6:00 PM CET
Saturday: 10:00 AM - 4:00 PM CET
Sunday: Closed
Emergency support available 24/7"
                  placeholder="Enter business hours"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Settings */}
      <div className="flex gap-4">
        <Button className="bg-primary hover:bg-primary-glow text-white">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
};

export default SettingsPanel;