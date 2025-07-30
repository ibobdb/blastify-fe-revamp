'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Home,
  Key,
  Smartphone,
  Cast,
  History,
  WalletCards,
  CalendarCheck,
  MessageSquare,
} from 'lucide-react';

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const SidebarItem = ({
  icon,
  label,
  href,
  isCollapsed,
  isActive,
}: SidebarItemProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href} passHref>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'w-full justify-start h-auto py-2.5 px-3 my-1 rounded-lg',
                isActive
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400'
                  )}
                >
                  {icon}
                </div>
                {!isCollapsed && <span className="font-medium">{label}</span>}
              </div>
            </Button>
          </Link>
        </TooltipTrigger>
        {isCollapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

interface SidebarGroupProps {
  title: string;
  children: React.ReactNode;
  isCollapsed: boolean;
}

const SidebarGroup = ({ title, children, isCollapsed }: SidebarGroupProps) => {
  return (
    <div className="mb-6">
      {!isCollapsed && (
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-2">
          {title}
        </div>
      )}
      <div className="space-y-1 px-1">{children}</div>
    </div>
  );
};

export function DashboardSidebar({
  isCollapsed,
  onToggle,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      title: 'General',
      items: [
        {
          icon: <Home size={20} />,
          label: 'Dashboard',
          href: '/dashboard',
        },
        {
          icon: <Smartphone size={20} />,
          label: 'Devices',
          href: '/dashboard/devices',
        },
        {
          icon: <Cast size={20} />,
          label: 'Broadcast',
          href: '/dashboard/broadcast',
        },
        {
          icon: <CalendarCheck size={20} />,
          label: 'Scheduler',
          href: '/dashboard/scheduler',
        },
        {
          icon: <History size={20} />,
          label: 'History',
          href: '/dashboard/history',
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          icon: <WalletCards size={20} />,
          label: 'Billing / Quota',
          href: '/dashboard/billing',
        },
        {
          icon: <WalletCards size={20} />,
          label: 'Billing History',
          href: '/dashboard/billing-history',
        },
        {
          icon: <Key size={20} />,
          label: 'API Access',
          href: '/dashboard/api-management',
        },
      ],
    },
  ];
  return (
    <div
      className={cn(
        'border-r border-border bg-white dark:bg-gray-950 flex flex-col h-full transition-all duration-300 relative z-20 shadow-sm',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo and Toggle Button */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-blue-600 text-white">
            <MessageSquare className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <Link href="/dashboard">
              <div>
                <div className="font-semibold text-lg">Blastify</div>
                <div className="text-xs text-muted-foreground">
                  WhatsApp Management
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
      {/* Navigation Items */}
      <div className="flex-grow overflow-y-auto">
        <div className={cn('px-3 py-4', isCollapsed ? 'px-2' : '')}>
          {navigation.map((group, idx) => (
            <SidebarGroup
              key={idx}
              title={group.title}
              isCollapsed={isCollapsed}
            >
              {group.items.map((item, itemIdx) => (
                <SidebarItem
                  key={itemIdx}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  isCollapsed={isCollapsed}
                  isActive={pathname === item.href}
                />
              ))}
            </SidebarGroup>
          ))}
        </div>
      </div>
      {/* Sidebar Footer */}
      <div
        className={cn(
          'border-t border-gray-100 dark:border-gray-800 p-4 text-xs text-gray-500 dark:text-gray-400',
          isCollapsed && 'hidden sm:block text-center'
        )}
      >
        {!isCollapsed ? (
          <div>
            <div className="font-medium mb-1">Blastify © 2025</div>
            <div>Version 1.0.0</div>
          </div>
        ) : (
          <div className="py-2 text-xs">v1.0.0</div>
        )}
      </div>
    </div>
  );
}
