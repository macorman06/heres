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
      <Card className="border-0 shadow-md bg-white flex-shrink-0">
        <div className="p-8 flex flex-col items-center justify-center text-center h-full" style={{ width: '200px', height: '200px' }}>
          <div className="text-sm font-medium uppercase mb-2 text-gray-600">
            {date.toLocaleDateString('es-ES', { month: 'long' })}
          </div>
          <div className="text-6xl font-bold leading-none mb-2 text-gray-800">
            {date.getDate()}
          </div>
          <div className="text-sm text-gray-600 mb-1">
            {date.toLocaleDateString('es-ES', { weekday: 'long' })}
          </div>
          <div className="text-xs text-gray-500">
            {date.getFullYear()}
          </div>
        </div>
      </Card>

      {/* Right Column - Two Cards */}
      <div className="flex-grow flex flex-col space-y-3">
        {/* Salesian Ephemeris Card */}
        <Card className="border-0 shadow-md bg-white flex-1">
          <div className="flex items-center space-x-4 h-full">
            <div className="bg-red-100 rounded-full p-3 flex-shrink-0">
              <i className={`${salesianInfo.icon} text-red-600 text-xl`}></i>
            </div>
            <div className="flex-grow">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Efeméride Salesiana
                </h3>
                <Badge
                  value="Salesiano"
                  className="bg-red-100 text-red-800 text-xs !flex !items-center !justify-center !leading-none px-2 py-1"
                />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                {salesianInfo.title}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {salesianInfo.description}
              </p>
            </div>
          </div>
        </Card>

        {/* Catholic Saint Card */}
        <Card className="border-0 shadow-md bg-white flex-1">
            <div className="flex items-center space-x-4 h-full">
              <div className="bg-blue-100 rounded-full p-3 flex-shrink-0">
                <i className={`${catholicInfo.icon} text-blue-600 text-xl`}></i>
              </div>
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Santoral Católico
                  </h3>
                  <Badge
                    value="Santoral"
                    className="bg-blue-100 text-blue-800 text-xs !flex !items-center !justify-center !leading-none px-2 py-1"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                  {catholicInfo.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {catholicInfo.description}
                </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
