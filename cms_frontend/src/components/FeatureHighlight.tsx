import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Brain, 
  Sparkles, 
  Globe, 
  Users,
  Zap,
  Shield
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Adaptation',
    description: 'Automatically adapts content for 5 different accessibility needs using advanced AI',
    color: 'text-blue-600'
  },
  {
    icon: Zap,
    title: 'Real-Time Generation',
    description: 'Instant content adaptation with smart caching for optimal performance',
    color: 'text-yellow-600'
  },
  {
    icon: Users,
    title: 'Universal Design',
    description: 'Covers wheelchair users, dyslexia, cognitive impairment, anxiety, and low vision',
    color: 'text-green-600'
  },
  {
    icon: Globe,
    title: 'Multi-Platform',
    description: 'Works seamlessly across hotels, tours, care services, and more',
    color: 'text-purple-600'
  },
  {
    icon: Shield,
    title: 'WCAG Compliant',
    description: 'Ensures all adapted content meets Web Content Accessibility Guidelines',
    color: 'text-red-600'
  },
  {
    icon: Sparkles,
    title: 'Smart Analytics',
    description: 'Track accessibility impact and content performance across all adaptations',
    color: 'text-teal-600'
  }
];

export const FeatureHighlight: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <Card 
            key={index}
            className="hover-lift group cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all duration-300"
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};