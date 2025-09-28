import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex transition-colors duration-200">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <Topbar sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
