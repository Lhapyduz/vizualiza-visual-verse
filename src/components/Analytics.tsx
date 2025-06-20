
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Eye, Clock, Calendar } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';

interface AnalyticsData {
  pageViews: { name: string; views: number }[];
  userStats: { visitors: number; newUsers: number; avgTime: string };
  deviceStats: { name: string; value: number; color: string }[];
  monthlyViews: { month: string; views: number }[];
}

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    // Simular dados de analytics
    const mockData: AnalyticsData = {
      pageViews: [
        { name: 'Início', views: 0 },
        { name: 'Portfólio', views: 0 },
        { name: 'Sobre', views: 0 },
        { name: 'Contato', views: 0 },
      ],
      userStats: {
        visitors: 0,
        newUsers: 0,
        avgTime: '0:00'
      },
      deviceStats: [
        { name: 'Desktop', value: 0, color: '#8B5CF6' },
        { name: 'Mobile', value: 0, color: '#F97316' },
        { name: 'Tablet', value: 0, color: '#10B981' },
      ],
      monthlyViews: [
        { month: 'Jan', views: 0 },
        { month: 'Fev', views: 0 },
        { month: 'Mar', views: 0 },
        { month: 'Abr', views: 0 },
        { month: 'Mai', views: 0 },
        { month: 'Jun', views: 0 },
      ]
    };

    setData(mockData);
  }, []);

  if (!data) return null;

  return (
    <section id="analytics" className="py-20 px-4 bg-vizualiza-bg-light">
      <div className="max-w-7xl mx-auto">
        <ScrollAnimation direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Nossos </span>
              <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Resultados</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Acompanhe o desempenho e o crescimento do nosso trabalho através de dados reais.
            </p>
          </div>
        </ScrollAnimation>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <ScrollAnimation direction="up" delay={0.1}>
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-vizualiza-purple" />
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{data.userStats.visitors.toLocaleString()}</h3>
              <p className="text-gray-400">Visitantes únicos</p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.2}>
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <Eye className="w-8 h-8 text-vizualiza-orange" />
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{data.userStats.newUsers.toLocaleString()}</h3>
              <p className="text-gray-400">Novos usuários</p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.3}>
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-8 h-8 text-blue-500" />
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{data.userStats.avgTime}</h3>
              <p className="text-gray-400">Tempo médio no site</p>
            </div>
          </ScrollAnimation>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Page Views Chart */}
          <ScrollAnimation direction="left" delay={0.4}>
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Visualizações por Página</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.pageViews}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Bar dataKey="views" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ScrollAnimation>

          {/* Device Stats */}
          <ScrollAnimation direction="right" delay={0.5}>
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">Dispositivos dos Usuários</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.deviceStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.deviceStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {data.deviceStats.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>

        {/* Monthly Trend */}
        <ScrollAnimation direction="up" delay={0.6}>
          <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10 mt-8">
            <h3 className="text-xl font-semibold text-white mb-6">Crescimento Mensal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#F97316" 
                  strokeWidth={3}
                  dot={{ fill: '#F97316', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default Analytics;
