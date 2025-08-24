import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal, 
  Search,
  Filter,
  Hotel,
  MapPin,
  Heart,
  FileText
} from "lucide-react";

const ContentManager = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const contentItems = [
    {
      id: 1,
      title: "Wheelchair Accessible Hotels in Zurich",
      type: "Hotels",
      status: "Published",
      lastModified: "2024-01-15",
      author: "Claire Admin",
      icon: Hotel
    },
    {
      id: 2,
      title: "Alpine Accessibility Tour Package",
      type: "Tours",
      status: "Draft",
      lastModified: "2024-01-14",
      author: "George Admin",
      icon: MapPin
    },
    {
      id: 3,
      title: "Care Services for Travelers",
      type: "Services",
      status: "Published",
      lastModified: "2024-01-13",
      author: "Claire Admin",
      icon: Heart
    },
    {
      id: 4,
      title: "Summer Accessibility Guide 2024",
      type: "Content",
      status: "Review",
      lastModified: "2024-01-12",
      author: "Content Team",
      icon: FileText
    },
    {
      id: 5,
      title: "Barrier-Free Swiss Railways",
      type: "Transport",
      status: "Published",
      lastModified: "2024-01-11",
      author: "George Admin",
      icon: MapPin
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "default";
      case "Draft":
        return "secondary";
      case "Review":
        return "outline";
      default:
        return "secondary";
    }
  };

  const filteredItems = contentItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Content Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Content Management</h2>
          <p className="text-muted-foreground">Manage your accessible tourism content</p>
        </div>
        <Button className="bg-primary hover:bg-primary-glow text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create New Content
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
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
        </CardContent>
      </Card>

      {/* Content Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Content</CardTitle>
          <CardDescription>
            Manage pages, tours, hotels, and services content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.author}</TableCell>
                  <TableCell className="text-muted-foreground">{item.lastModified}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-alpine transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <Hotel className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Add Hotel</h3>
            <p className="text-sm text-muted-foreground">Create accessible hotel listing</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-alpine transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Add Tour</h3>
            <p className="text-sm text-muted-foreground">Create new accessible tour</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-alpine transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Add Service</h3>
            <p className="text-sm text-muted-foreground">Create care service offering</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-alpine transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Add Page</h3>
            <p className="text-sm text-muted-foreground">Create content page</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentManager;