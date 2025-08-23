import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Map, 
  Heart, 
  TrendingUp,
  Users,
  BookOpen,
  Brain,
  Eye
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  color: string;
}

interface DashboardStatsProps {
  stats: {
    totalContent: number;
    hotels: number;
    tours: number;
    careServices: number;
    adaptations: {
      wheelchair: number;
      dyslexia: number;
      cognitive: number;
      anxiety: number;
      lowVision: number;
    };
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const mainStats: StatCard[] = [
    {
      title: 'Total Content Items',
      value: stats.totalContent,
      change: '+12%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      title: 'Hotels',
      value: stats.hotels,
      icon: Building2,
      color: 'text-blue-600'
    },
    {
      title: 'Tours',
      value: stats.tours,
      icon: Map,
      color: 'text-green-600'
    },
    {
      title: 'Care Services',
      value: stats.careServices,
      icon: Heart,
      color: 'text-purple-600'
    }
  ];

  const accessibilityStats: StatCard[] = [
    {
      title: 'Wheelchair Adaptations',
      value: stats.adaptations.wheelchair,
      icon: Users,
      color: 'text-yellow-600'
    },
    {
      title: 'Dyslexia Friendly',
      value: stats.adaptations.dyslexia,
      icon: BookOpen,
      color: 'text-purple-600'
    },
    {
      title: 'Cognitive Accessible',
      value: stats.adaptations.cognitive,
      icon: Brain,
      color: 'text-teal-600'
    },
    {
      title: 'Low Vision Optimized',
      value: stats.adaptations.lowVision,
      icon: Eye,
      color: 'text-orange-600'
    }
  ];

  const StatCard: React.FC<{ stat: StatCard }> = ({ stat }) => {
    const Icon = stat.icon;
    
    return (
      <Card className="hover-lift transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {stat.title}
          </CardTitle>
          <Icon className={`h-5 w-5 ${stat.color}`} />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-3">
            <div className="text-3xl font-bold text-foreground">
              {stat.value}
            </div>
            {stat.change && (
              <div className={`text-sm font-medium ${
                stat.changeType === 'positive' 
                  ? 'text-green-600' 
                  : stat.changeType === 'negative' 
                  ? 'text-red-600' 
                  : 'text-gray-600'
              }`}>
                {stat.change}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Main Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Content Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
      </div>

      {/* Accessibility Statistics */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Accessibility Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accessibilityStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
      </div>
    </div>
  );
};