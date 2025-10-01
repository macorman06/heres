// src/components/layout/Layout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed((v) => !v);

  // Ancho del sidebar según estado
  const sidebarWidth = sidebarCollapsed ? '80px' : '260px';

  return (
    <div className="min-h-screen w-full grid" style={{
      gridTemplateColumns: `${sidebarWidth} 1fr`
    }}>
      {/* Columna Sidebar */}
      <aside className="h-screen">
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      </aside>

      {/* Columna principal */}
      <div className="flex flex-col h-screen overflow-hidden">
        <Topbar sidebarCollapsed={false}/>
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
