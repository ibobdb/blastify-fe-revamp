'use client';

import { ErrorPageLayout } from '@/components/error-page-layout';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, ArrowLeft, LogIn, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getErrorConfig, type ErrorCode } from '@/utils/error-configs';

interface UniversalErrorPageProps {
  errorCode: ErrorCode;
  customTitle?: string;
  customDescription?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showRefreshButton?: boolean;
  showAuthButtons?: boolean;
  showPopularLinks?: boolean;
  customActions?: React.ReactNode;
}

export function UniversalErrorPage({
  errorCode,
  customTitle,
  customDescription,
  showBackButton = true,
  showHomeButton = true,
  showRefreshButton = true,
  showAuthButtons = false,
  showPopularLinks = false,
  customActions,
}: UniversalErrorPageProps) {
  const router = useRouter();
  const config = getErrorConfig(errorCode);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const defaultActions = (
    <>
      {showBackButton && (
        <Button
          onClick={handleBack}
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      )}

      {showHomeButton && (
        <Link href="/" className="w-full sm:w-auto">
          <Button
            variant={showBackButton ? 'default' : 'outline'}
            size="sm"
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Home Page
          </Button>
        </Link>
      )}

      {showRefreshButton && (
        <Button
          onClick={handleRefresh}
          variant="ghost"
          size="sm"
          className="w-full sm:w-auto"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      )}

      {showAuthButtons && (
        <>
          <Link href="/signin" className="w-full sm:w-auto">
            <Button size="sm" className="w-full">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </Link>

          <Link href="/signup" className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full">
              <KeyRound className="w-4 h-4 mr-2" />
              Create Account
            </Button>
          </Link>
        </>
      )}
    </>
  );

  const additionalInfo = config.suggestions && (
    <div className="p-3 bg-muted/50 rounded-lg">
      <h3 className="font-medium text-xs text-foreground mb-2">
        What you can try:
      </h3>
      <ul className="text-xs text-muted-foreground space-y-0.5 text-left">
        {config.suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start">
            <span className="text-primary mr-1.5 text-xs">•</span>
            <span className="leading-relaxed">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <ErrorPageLayout
      errorCode={config.code}
      title={customTitle || config.title}
      description={customDescription || config.description}
      icon={config.icon}
      iconColor={config.iconColor}
      actions={customActions || defaultActions}
      additionalInfo={additionalInfo}
      showPopularLinks={showPopularLinks}
    />
  );
}
