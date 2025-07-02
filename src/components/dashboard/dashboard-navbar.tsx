'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NotificationList } from './notification-list';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context';
import { useLogout } from '@/hooks/useLogout';
import { getUserInitials } from '@/lib/utils';
import { QuotaNav } from './quota-nav';
import {
  Bell,
  Menu,
  Search,
  Moon,
  Sun,
  User,
  Globe,
  LogOut,
  Settings,
} from 'lucide-react';
import { QuotaAddNav } from './quota-add-nav';

interface DashboardNavbarProps {
  onMenuClick: () => void;
}

export function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const { user } = useAuth();
  const logout = useLogout();
  const { setTheme, theme } = useTheme();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        isSearchExpanded
      ) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpanded]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const userInitials = user?.name ? getUserInitials(user.name) : 'U';
  return (
    <header className="bg-white dark:bg-gray-950 border-b border-border h-16 flex items-center px-6 md:px-8 justify-between sticky top-0 z-10 shadow-sm py-4">
      {/* Left Side - Menu Button and Search */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="mr-2 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>{' '}
        {/* Search Bar */}
        <div
          ref={searchRef}
          className={`relative hidden md:flex items-center ${
            isSearchExpanded ? 'w-80' : 'w-64'
          } transition-all duration-300`}
        >
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 py-5 h-10 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 rounded-md"
            onFocus={() => setIsSearchExpanded(true)}
          />
        </div>
        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>{' '}
      {/* Right Side - Icons and Profile */}
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* Quota / Credit */}
        <QuotaNav />
        {/* Quota ADD */}
        <QuotaAddNav />
        {/* Notifications */}
        {/* <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button> */}
        <NotificationList />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative h-8 w-8 rounded-full ml-1"
              aria-label="User menu"
            >
              {' '}
              <Avatar className="h-8 w-8">
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt={user?.name || 'User'} />
                ) : null}
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              {' '}
              <div className="flex h-10 w-10 shrink-0 select-none items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Avatar className="h-9 w-9">
                  {user?.avatar ? (
                    <AvatarImage src={user.avatar} alt={user?.name || 'User'} />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid gap-0.5">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/profile"
                className="flex justify-between cursor-pointer w-full"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </div>
                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                  ⌘P
                </kbd>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/settings"
                className="flex justify-between cursor-pointer w-full"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </div>
                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                  ⌘S
                </kbd>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />{' '}
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                logout(); // This is already an async function from useLogout
              }}
            >
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </div>
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                ⌘Q
              </kbd>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
