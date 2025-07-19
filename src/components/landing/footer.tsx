'use client';

import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-28">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-foreground">
                  Blastify
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              The most powerful WhatsApp marketing platform for businesses
              looking to engage with their customers effectively.
            </p>
            <div className="flex mt-6 space-x-4">
              <Button
                size="icon"
                variant="outline"
                className="border-border hover:border-primary hover:text-primary"
                asChild
              >
                <Link
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-border hover:border-primary hover:text-primary"
                asChild
              >
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-border hover:border-primary hover:text-primary"
                asChild
              >
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="border-border hover:border-primary hover:text-primary"
                asChild
              >
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-3">
            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">
                Product
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/features"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/integrations"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link
                    href="/changelog"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">
                Resources
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/documentation"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tutorials"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Support Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Privacy & Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-12 pt-6 border-t border-border">
          <div className="flex items-center">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>WhatsApp Business Solution Provider</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Blastify. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
