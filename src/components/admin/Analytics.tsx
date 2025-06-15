
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Eye, TrendingUp } from 'lucide-react';

const Analytics = () => {
  const stats = [
    {
      title: 'Visualizações Totais',
      value: '12,543',
      icon: Eye,
      trend: '+12.5%'
    },
    {
      title: 'Visitantes Únicos',
      value: '8,234',
      icon: Users,
      trend: '+8.2%'
    },
    {
      title: 'Posts do Blog',
      value: '45',
      icon: BarChart3,
      trend: '+3 este mês'
    },
    {
      title: 'Crescimento',
      value: '23.1%',
      icon: TrendingUp,
      trend: '+2.4%'
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Analytics Dashboard</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/5 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-green-400 mt-1">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Posts Mais Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Tendências de Design 2024', views: '2,543' },
                { title: 'Guia de UX/UI', views: '1,832' },
                { title: 'Cores e Tipografia', views: '1,234' }
              ].map((post, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300">{post.title}</span>
                  <span className="text-gray-400">{post.views} views</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Tráfego Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-400">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Dados de analytics serão exibidos aqui</p>
              </div>
            </CardContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
