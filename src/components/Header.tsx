import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Settings, 
  Bell, 
  Search,
  Menu,
  Accessibility
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onCreateContent?: () => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onCreateContent,
  onSearch,
  searchQuery = ''
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Accessibility className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient-primary">
                AccessCMS
              </h1>
              <p className="text-xs text-muted-foreground">
                Inclusive Content Management
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content, locations, accessibility features..."
              value={searchQuery}
              onChange={(e) => onSearch?.(e.target.value)}
              className="pl-10 focus-ring"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Create Content Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onCreateContent?.()}>
                <span className="mr-2">🏨</span>
                Create Hotel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCreateContent?.()}>
                <span className="mr-2">🗺️</span>
                Create Tour
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCreateContent?.()}>
                <span className="mr-2">🏥</span>
                Create Care Service
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
              3
            </span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>

          {/* Mobile Menu */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};