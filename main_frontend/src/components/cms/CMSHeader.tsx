import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CMSHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C&G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Claire & George</h1>
                <p className="text-sm text-muted-foreground">Content Management System</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Dashboard
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                Content
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                Media
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                Users
              </Button>
            </nav>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                className="pl-10 w-64"
              />
            </div>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatars/admin.jpg" alt="Admin" />
                    <AvatarFallback className="bg-primary text-white">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@claireundgeorge.ch
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CMSHeader;