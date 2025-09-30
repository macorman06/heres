import React from 'react';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import {
  salesianEphemerides,
  catholicSaints,
  getDefaultSalesianInfo,
  getDefaultCatholicInfo,
  DailyInfo
} from '../../data';

interface DailyCardsProps {
  date?: Date;
}

export const DailyCards: React.FC<DailyCardsProps> = ({ date = new Date() }) => {
  // Función para obtener la efeméride del día
  const getSalesianEphemeris = (): DailyInfo => {
    const currentMonth = date.getMonth() + 1;
    const currentDay = date.getDate();
    const dateKey = `${currentMonth}-${currentDay}`;

    return salesianEphemerides[dateKey] || getDefaultSalesianInfo();
  };

  // Función para obtener el santoral católico del día
  const getCatholicSaint = (): DailyInfo => {
    const currentMonth = date.getMonth() + 1;
    const currentDay = date.getDate();
    const dateKey = `${currentMonth}-${currentDay}`;

    return catholicSaints[dateKey] || getDefaultCatholicInfo();
  };

  const salesianInfo = getSalesianEphemeris();
  const catholicInfo = getCatholicSaint();

  return (
    <div className="flex gap-6">
      {/* Calendar Card - Cuadrado blanco */}
      <Card className="daily-card no-padding-card">
        <div className="flex flex-col items-center justify-center text-center h-full" style={{ width: '200px', height: '200px' }}>
          <div className="text-sm font-medium uppercase mb-2 text-gray-600 dark:text-gray-300">
            {date.toLocaleDateString('es-ES', { month: 'long' })}
          </div>
          <div className="text-6xl font-bold leading-none mb-2 text-gray-800 dark:text-gray-100">
            {date.getDate()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            {date.toLocaleDateString('es-ES', { weekday: 'long' })}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {date.getFullYear()}
          </div>
        </div>
      </Card>

      {/* Right Column - Two Cards */}
      <div className="flex-grow flex flex-col space-y-6">

        {/* Salesian Ephemeris Card */}
        <Card className="daily-card no-padding-card">
          <div className="flex items-center space-x-4 h-full">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-3 flex-shrink-0">
              <i className={`${salesianInfo.icon} text-red-600 dark:text-red-400 text-xl`}></i>
            </div>
            <div className="flex-grow">
              <div className="flex items-center space-x-2 mb-2">
                <h3>Efeméride Salesiana</h3>
                <Badge value="Efemérides"/>
              </div>
              <h4>{salesianInfo.title}</h4>
              <p>{salesianInfo.description}</p>
            </div>
          </div>
        </Card>

        {/* Catholic Saint Card */}
        <Card className="daily-card no-padding-card">
            <div className="flex items-center space-x-4 h-full">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 flex-shrink-0">
                <i className={`${catholicInfo.icon} text-blue-600 dark:text-blue-400 text-xl`}></i>
              </div>
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                  <h3>Santoral Católico</h3>
                  <Badge value="Santoral"/>
                </div>
                <h4>{catholicInfo.title}</h4>
                <p>{catholicInfo.description}</p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};
