import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Brain, 
  Heart, 
  Eye,
  CheckCircle 
} from 'lucide-react';

interface AccessibilityBadgeProps {
  type: 'wheelchair_user' | 'dyslexia' | 'cognitive_impairment' | 'anxiety_travel_fear' | 'low_vision' | 'original';
  variant?: 'default' | 'outline' | 'secondary';
  showIcon?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

const accessibilityConfig = {
  wheelchair_user: {
    label: 'Wheelchair Accessible',
    icon: Users,
    className: 'badge-wheelchair'
  },
  dyslexia: {
    label: 'Dyslexia Friendly',
    icon: BookOpen,
    className: 'badge-dyslexia'
  },
  cognitive_impairment: {
    label: 'Cognitive Accessible',
    icon: Brain,
    className: 'badge-cognitive'
  },
  anxiety_travel_fear: {
    label: 'Anxiety Supportive',
    icon: Heart,
    className: 'badge-anxiety'
  },
  low_vision: {
    label: 'Low Vision Optimized',
    icon: Eye,
    className: 'badge-low-vision'
  },
  original: {
    label: 'Original Content',
    icon: CheckCircle,
    className: 'bg-muted text-muted-foreground'
  }
};

export const AccessibilityBadge: React.FC<AccessibilityBadgeProps> = ({
  type,
  variant = 'default',
  showIcon = true,
  size = 'default'
}) => {
  const config = accessibilityConfig[type];
  const Icon = config.icon;

  return (
    <Badge 
      variant={variant}
      className={`${config.className} ${size === 'sm' ? 'text-xs px-2 py-1' : size === 'lg' ? 'text-sm px-3 py-2' : ''} inline-flex items-center gap-1.5 font-medium transition-all duration-200 hover:shadow-soft`}
    >
      {showIcon && <Icon className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />}
      {config.label}
    </Badge>
  );
};