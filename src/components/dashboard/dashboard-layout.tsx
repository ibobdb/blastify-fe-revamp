'use client';

import { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardNavbar } from '@/components/dashboard/dashboard-navbar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const pathname = usePathname();

  // Check for mobile view
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 1024);
      // Auto-collapse sidebar on small screens
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };

    // Initial check
    checkScreenSize();

    // Listen for window resize
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobileView) {
      setIsSidebarCollapsed(true);
    }
  }, [pathname, isMobileView]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <DashboardSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
      />
      <div className="flex flex-col flex-grow w-full">
        <DashboardNavbar onMenuClick={toggleSidebar} />
        <main
          className={cn(
            'flex-grow overflow-auto transition-all duration-300 bg-gray-50 dark:bg-gray-900/20'
          )}
        >
          <div className="px-2 py-8 md:px-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
