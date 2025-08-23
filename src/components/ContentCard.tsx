import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AccessibilityBadge } from './AccessibilityBadge';
import { 
  MapPin, 
  Calendar, 
  Eye, 
  Edit3, 
  MoreVertical,
  Copy,
  Trash2,
  ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ContentCardProps {
  id: number;
  type: 'hotel' | 'tour' | 'care-service';
  title: string;
  description?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  accessibilityTypes?: string[];
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onDuplicate?: (id: number) => void;
}

const typeConfig = {
  hotel: {
    icon: '🏨',
    label: 'Hotel',
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  tour: {
    icon: '🗺️',
    label: 'Tour',
    color: 'bg-green-50 text-green-700 border-green-200'
  },
  'care-service': {
    icon: '🏥',
    label: 'Care Service',
    color: 'bg-purple-50 text-purple-700 border-purple-200'
  }
};

export const ContentCard: React.FC<ContentCardProps> = ({
  id,
  type,
  title,
  description,
  location,
  createdAt,
  updatedAt,
  accessibilityTypes = [],
  onView,
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const config = typeConfig[type];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card 
      className={`group hover-lift cursor-pointer transition-all duration-300 ${
        isHovered ? 'shadow-large border-primary/20' : 'shadow-soft'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium border ${config.color}`}>
              <span className="text-base">{config.icon}</span>
              {config.label}
            </div>
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
              ID: {id}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onView?.(id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(id)}>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Content
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(id)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete?.(id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        
        {description && (
          <CardDescription className="text-muted-foreground line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {location}
          </div>
        )}

        {accessibilityTypes.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Accessibility Adaptations:</p>
            <div className="flex flex-wrap gap-1.5">
              {accessibilityTypes.map((accessType) => (
                <AccessibilityBadge
                  key={accessType}
                  type={accessType as any}
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Created {formatDate(createdAt)}
            </div>
            {updatedAt !== createdAt && (
              <div className="flex items-center gap-1">
                <Edit3 className="h-3 w-3" />
                Updated {formatDate(updatedAt)}
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView?.(id)}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};