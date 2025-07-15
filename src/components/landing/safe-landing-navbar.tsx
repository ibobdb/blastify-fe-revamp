'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ClientOnly from '@/components/client-only';
import {
  Menu,
  X,
  MessageSquare,
  UserPlus,
  LogIn,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname() || '/';

  // Nav items
  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Docs', href: '/docs' },
    { label: 'Tutorials', href: '/tutorials' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <ClientOnly>
        <NavbarContent
          navItems={navItems}
          pathname={pathname}
          setIsScrolled={setIsScrolled}
        />
      </ClientOnly>
    </header>
  );
}

function NavbarContent({
  navItems,
  pathname,
  setIsScrolled,
}: {
  navItems: Array<{ label: string; href: string }>;
  pathname: string;
  setIsScrolled: (isScrolled: boolean) => void;
}) {
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setIsScrolled]);
  // Active check is handled directly in UI classes instead
  // We're keeping this version as a backup for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const checkActive = (href: string) => {
    if (href.startsWith('#')) {
      return pathname === '/' && window.location.hash === href;
    }
    return pathname === href;
  };

  return (
    <div className="container mx-auto">
      <nav
        className={`bg-transparent mx-auto h-14 w-full flex items-center px-4 sm:px-6 md:px-8 lg:px-10`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#2979FF] text-white">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg text-[#222831]">Blastify</span>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex justify-between flex-1 items-center ml-8">
          <div className="flex items-center space-x-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                size="sm"
                asChild
                className="rounded-md relative group"
              >
                <Link
                  href={item.href}
                  className={`px-4 py-2.5 text-[15px] transition-all duration-200 ${
                    pathname === item.href ||
                    (pathname === '/' &&
                      item.href === '#features' &&
                      !window.location.hash)
                      ? 'text-[#2979FF] font-medium'
                      : 'text-[#222831] hover:text-[#2979FF]'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#2979FF] transform origin-left transition-transform duration-300 ${
                      pathname === item.href
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              </Button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="px-5 py-2 text-[#222831] hover:text-[#2979FF] hover:bg-[#2979FF]/5"
              asChild
            >
              <Link href="/signin">
                <LogIn className="h-4 w-4 mr-2" /> Sign in
              </Link>
            </Button>
            <Button
              size="sm"
              className="px-5 py-2 shadow-sm bg-[#2979FF] text-white hover:bg-[#1565C0] transition-colors"
              asChild
            >
              <Link href="/signup">
                <UserPlus className="h-4 w-4 mr-2" /> Sign up
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex-1 flex justify-end lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="px-2 text-[#222831] hover:text-[#2979FF] hover:bg-[#2979FF]/5"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[385px] p-0">
              <div className="h-full flex flex-col">
                {/* Mobile menu header */}
                <div className="h-14 border-b border-[#E5E7EB] px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#2979FF] text-white">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-lg text-[#222831]">
                      Blastify
                    </span>
                  </div>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-2 text-[#222831] hover:text-[#2979FF] hover:bg-[#2979FF]/5"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                </div>

                {/* Mobile menu items */}
                <div className="flex-1 px-4 py-6 overflow-auto">
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Button
                        key={item.href}
                        variant="ghost"
                        size="sm"
                        asChild
                        className="w-full justify-start rounded-md"
                      >
                        <Link
                          href={item.href}
                          className={`px-4 py-3 text-[15px] flex items-center justify-between ${
                            pathname === item.href
                              ? 'text-[#2979FF] font-medium bg-[#2979FF]/5'
                              : 'text-[#222831] hover:text-[#2979FF] hover:bg-[#2979FF]/5'
                          }`}
                        >
                          {item.label}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mobile menu footer */}
                <div className="border-t border-[#E5E7EB] px-4 py-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full shadow-sm border-[#E5E7EB] hover:bg-[#2979FF]/5 hover:text-[#2979FF] hover:border-[#2979FF]/30"
                      asChild
                    >
                      <Link href="/signin">
                        <LogIn className="h-4 w-4 mr-2" /> Sign in
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="w-full shadow-sm bg-[#2979FF] text-white hover:bg-[#1565C0] transition-colors"
                      asChild
                    >
                      <Link href="/signup">
                        <UserPlus className="h-4 w-4 mr-2" /> Sign up
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}
