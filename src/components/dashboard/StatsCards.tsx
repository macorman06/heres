import React from 'react';
import { Card } from 'primereact/card';
import { DashboardStat } from '../../data/StatsDashboard';

interface StatsCardsProps {
  stats: DashboardStat[];
  loading?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="border-0 shadow-md animate-pulse">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-grow">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">
                  {stat.change}
                </p>
              </div>
              <div className={`${stat.color} rounded-full p-3 shadow-md`}>
                <i className={`${stat.icon} text-white text-xl`}></i>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
