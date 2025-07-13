import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorPageProps {
  errorCode: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  iconColor?: 'primary' | 'destructive' | 'yellow' | 'orange' | 'red';
  actions?: React.ReactNode;
  additionalInfo?: React.ReactNode;
  showPopularLinks?: boolean;
}

const iconColorClasses = {
  primary: 'bg-primary/10 text-primary/60',
  destructive: 'bg-destructive/10 text-destructive/60',
  yellow: 'bg-yellow-500/10 text-yellow-500/60',
  orange: 'bg-orange-500/10 text-orange-500/60',
  red: 'bg-red-500/10 text-red-500/60',
};

const codeColorClasses = {
  primary: 'text-primary/20',
  destructive: 'text-destructive/20',
  yellow: 'text-yellow-500/20',
  orange: 'text-orange-500/20',
  red: 'text-red-500/20',
};

export function ErrorPageLayout({
  errorCode,
  title,
  description,
  icon: Icon,
  iconColor = 'primary',
  actions,
  additionalInfo,
  showPopularLinks = false,
}: ErrorPageProps) {
  return (
    <div className="h-screen bg-background flex items-center justify-center p-3 overflow-hidden">
      <div className="w-full max-w-md mx-auto text-center">
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            {/* Error Code & Icon Combined */}
            <div className="mb-4">
              <div
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${iconColorClasses[iconColor]}`}
              >
                <Icon className="w-8 h-8" />
              </div>
              <h1
                className={`text-3xl sm:text-4xl font-bold select-none ${codeColorClasses[iconColor]}`}
              >
                {errorCode}
              </h1>
            </div>

            {/* Error Message */}
            <div className="mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                {title}
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                {description}
              </p>
            </div>

            {/* Additional Information */}
            {additionalInfo && <div className="mb-4">{additionalInfo}</div>}

            {/* Action Buttons */}
            {actions && (
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mb-4">
                {actions}
              </div>
            )}

            {/* Popular Links */}
            {showPopularLinks && (
              <div className="pt-3 border-t border-border/30">
                <p className="text-xs text-muted-foreground mb-2">
                  Quick links:
                </p>
                <div className="flex flex-wrap justify-center gap-1">
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/signin">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                    >
                      Sign Up
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                    >
                      Contact
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
