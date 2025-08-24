import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Image as ImageIcon,
  Video,
  FileText,
  Download,
  Trash2,
  Eye
} from "lucide-react";

const MediaLibrary = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const mediaItems = [
    {
      id: 1,
      name: "harderkulm-panorama.jpg",
      type: "image",
      size: "2.4 MB",
      dimensions: "1920x1080",
      uploadDate: "2024-01-15",
      alt: "Harder Kulm panoramic viewpoint with Swiss Alps",
      url: "/src/assets/harderkulm-hero.jpg"
    },
    {
      id: 2,
      name: "wheelchair-hotel-room.jpg",
      type: "image",
      size: "1.8 MB",
      dimensions: "1200x800",
      uploadDate: "2024-01-14",
      alt: "Accessible hotel room with wheelchair facilities",
      url: "/placeholder-image.jpg"
    },
    {
      id: 3,
      name: "alpine-tour-video.mp4",
      type: "video",
      size: "45.2 MB",
      dimensions: "1920x1080",
      uploadDate: "2024-01-13",
      alt: "Accessible alpine tour demonstration video",
      url: "/placeholder-video.mp4"
    },
    {
      id: 4,
      name: "accessibility-guide.pdf",
      type: "document",
      size: "3.1 MB",
      dimensions: "A4",
      uploadDate: "2024-01-12",
      alt: "Switzerland accessibility travel guide",
      url: "/placeholder-document.pdf"
    },
    {
      id: 5,
      name: "train-station-access.jpg",
      type: "image",
      size: "2.1 MB",
      dimensions: "1600x900",
      uploadDate: "2024-01-11",
      alt: "Accessible train station platform with lift",
      url: "/placeholder-image-2.jpg"
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return ImageIcon;
      case "video":
        return Video;
      case "document":
        return FileText;
      default:
        return FileText;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "image":
        return "default";
      case "video":
        return "secondary";
      case "document":
        return "outline";
      default:
        return "secondary";
    }
  };

  const filteredItems = mediaItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Media Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Media Library</h2>
          <p className="text-muted-foreground">Manage images, videos, and documents</p>
        </div>
        <Button className="bg-primary hover:bg-primary-glow text-white">
          <Upload className="h-4 w-4 mr-2" />
          Upload Media
        </Button>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search media..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Content */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Media</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => {
                const FileIcon = getFileIcon(item.type);
                return (
                  <Card key={item.id} className="group hover:shadow-alpine transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {item.type === "image" ? (
                          <img 
                            src={item.url} 
                            alt={item.alt}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileIcon className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate" title={item.name}>
                            {item.name}
                          </h3>
                          <Badge variant={getFileTypeColor(item.type)} className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>{item.size} • {item.dimensions}</p>
                          <p>{item.uploadDate}</p>
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Media Files</CardTitle>
                <CardDescription>All your uploaded media files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredItems.map((item) => {
                    const FileIcon = getFileIcon(item.type);
                    return (
                      <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                            <FileIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.size} • {item.dimensions} • {item.uploadDate}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant={getFileTypeColor(item.type)}>
                            {item.type}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardContent className="p-6 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Image Gallery</h3>
              <p className="text-muted-foreground mb-4">Manage all your accessible tourism images</p>
              <Button>Upload Images</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardContent className="p-6 text-center">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Video Library</h3>
              <p className="text-muted-foreground mb-4">Store tour videos and accessibility demonstrations</p>
              <Button>Upload Videos</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Document Storage</h3>
              <p className="text-muted-foreground mb-4">PDFs, guides, and accessibility information</p>
              <Button>Upload Documents</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaLibrary;