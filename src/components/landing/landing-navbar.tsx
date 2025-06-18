'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Menu,
  X,
  MessageSquare,
  ChevronDown,
  UserPlus,
  LogIn,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
  ];

  // Resources dropdown items for future expansion
  const resourceItems = [
    { label: 'Documentation', href: '/docs' },
    { label: 'Tutorials', href: '/tutorials' },
    { label: 'Blog', href: '/blog' },
  ]; // This active item check will be used in future navigation improvements
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const checkActive = (href: string) => {
    if (href.startsWith('#') && typeof window !== 'undefined') {
      return pathname === '/' && window.location.hash === href;
    }
    return pathname === href;
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-18 flex items-center justify-between">
        {/* Logo with icon */}
        <div className="flex-1 flex items-center justify-start">
          <Link href="/" className="flex items-center gap-2 py-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#2979FF] text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl md:text-2xl text-[#222831]">
              Blastify
            </span>
          </Link>
        </div>

        {/* Desktop Navigation - centered with improved styling */}
        <nav className="hidden md:flex items-center justify-center flex-1">
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
                      typeof window !== 'undefined' &&
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
                  ></span>
                </Link>
              </Button>
            ))}

            {/* Resources dropdown for future expansion */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-md px-4 py-2.5 text-[15px] text-[#222831] hover:text-[#2979FF] flex items-center gap-1"
                >
                  Resources
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-48 bg-white border border-[#E5E7EB] shadow-md rounded-md p-1"
              >
                {resourceItems.map((item) => (
                  <DropdownMenuItem
                    key={item.href}
                    asChild
                    className="rounded-sm"
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm text-[#222831] hover:text-[#2979FF] hover:bg-[#F5F8FA]"
                    >
                      {item.label}
                      <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        {/* Auth Buttons - aligned right with enhanced styling */}
        <div className="flex-1 flex items-center justify-end">
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-[#E5E7EB] text-[#222831] hover:text-[#2979FF] hover:border-[#2979FF] hover:bg-transparent rounded-md px-5 py-2.5 text-[15px] flex items-center gap-2 transition-colors duration-200"
              asChild
            >
              <Link href="/signin">
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </Link>
            </Button>
            <Button
              size="sm"
              className="bg-[#2979FF] text-white hover:bg-[#1565C0] rounded-md px-5 py-2.5 text-[15px] flex items-center gap-2 shadow-sm hover:shadow transition-all duration-200"
              asChild
            >
              <Link href="/signup">
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Navigation - improved */}
          <div className="flex md:hidden items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="border-[#E5E7EB] hover:border-[#2979FF] hover:bg-[#F5F8FA] ml-2"
                >
                  <Menu className="h-5 w-5 text-[#222831]" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-white w-[300px] sm:w-[350px] p-0"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
                    <Link href="/" className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#2979FF] text-white">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-xl text-[#222831]">
                        Blastify
                      </span>
                    </Link>
                    <SheetTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-[#F5F8FA] rounded-full h-9 w-9"
                      >
                        <X className="h-5 w-5 text-[#222831]" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                    </SheetTrigger>
                  </div>

                  <div className="p-6">
                    <nav className="flex flex-col space-y-5">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`px-2 py-1 text-base font-medium relative group ${
                            pathname === item.href
                              ? 'text-[#2979FF]'
                              : 'text-[#222831]'
                          }`}
                        >
                          <div className="flex items-center">
                            <span>{item.label}</span>
                            {pathname === item.href && (
                              <span className="ml-2 w-1.5 h-1.5 rounded-full bg-[#2979FF]"></span>
                            )}
                          </div>
                          <span
                            className={`absolute bottom-0 left-2 right-2 h-0.5 bg-[#2979FF]/20 transform origin-left transition-transform duration-200 ${
                              pathname === item.href
                                ? 'scale-x-100'
                                : 'scale-x-0'
                            }`}
                          ></span>
                        </Link>
                      ))}

                      {/* Resources section in mobile */}
                      <div className="pt-2 border-t border-[#E5E7EB]">
                        <p className="text-sm text-[#222831]/70 mb-3 font-medium px-2">
                          Resources
                        </p>
                        {resourceItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="px-2 py-1 block text-base text-[#222831] hover:text-[#2979FF]"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </nav>
                  </div>

                  <div className="mt-auto p-6 pt-4 border-t border-[#E5E7EB] space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-center border-[#E5E7EB] text-[#222831] hover:bg-[#F5F8FA] hover:text-[#2979FF] hover:border-[#2979FF] flex items-center gap-2 h-11"
                      asChild
                    >
                      <Link href="/signin">
                        <LogIn className="w-4 h-4" />
                        <span>Log In</span>
                      </Link>
                    </Button>
                    <Button
                      className="w-full justify-center bg-[#2979FF] text-white hover:bg-[#1565C0] flex items-center gap-2 h-11 shadow-sm"
                      asChild
                    >
                      <Link href="/signup">
                        <UserPlus className="w-4 h-4" />
                        <span>Sign Up</span>
                      </Link>
                    </Button>

                    <div className="text-center text-[#222831]/60 text-sm pt-2">
                      New to Blastify?{' '}
                      <Link
                        href="/signup"
                        className="text-[#2979FF] hover:underline"
                      >
                        Create an account
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
