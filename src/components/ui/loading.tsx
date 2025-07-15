'use client';

import React from 'react';

interface LoadingProps {
  /**
   * Optional size for the loading animation
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Optional text to display below the animation
   */
  text?: string;

  /**
   * Optional full screen overlay
   * @default false
   */
  fullScreen?: boolean;

  /**
   * Type of loading animation to show
   * - 'page': For page transitions (plane animation)
   * - 'data': For data fetching (spinner)
   * @default 'page'
   */
  type?: 'page' | 'data';
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  fullScreen = false,
  type = 'page',
}) => {
  // Track if component should be visible or forcibly hidden
  const [isVisible, setIsVisible] = React.useState(true);

  // Size maps for different loading types
  const sizeMap = {
    // For page transition animation (video)
    page: {
      sm: 'h-16 w-16',
      md: 'h-24 w-24',
      lg: 'h-32 w-32',
      xl: 'h-40 w-40',
    },
    // For data loading (spinner)
    data: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-10 w-10',
    },
  };

  // Select the appropriate size based on type
  const elementSize = sizeMap[type][size];

  // Listen for force cleanup events (like during logout)
  React.useEffect(() => {
    const handleForceCleanup = () => {
      setIsVisible(false);
    };

    window.addEventListener('force-loading-cleanup', handleForceCleanup);

    return () => {
      window.removeEventListener('force-loading-cleanup', handleForceCleanup);
    };
  }, []);
  // Add effect to prevent scrolling when fullscreen loading is active
  React.useEffect(() => {
    if (fullScreen && typeof document !== 'undefined') {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Apply fixed positioning to body to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      // Add timeout to automatically clear loading after 10 seconds to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.warn('Loading timeout reached - clearing loading state');
        window.dispatchEvent(new CustomEvent('force-loading-cleanup'));
      }, 10000);

      // Re-enable scrolling when component unmounts
      return () => {
        clearTimeout(timeoutId);
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [fullScreen]); // If forced to hide, don't render anything
  if (!isVisible) {
    return null;
  }

  // Render the appropriate loading animation based on type
  const renderLoadingContent = () => {
    if (type === 'page') {
      // Page transition animation (plane)
      return (
        <>
          <video autoPlay loop muted playsInline className={elementSize}>
            <source src="/animations/loading-plane.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
          {text && <p className="text-muted-foreground">{text}</p>}
        </>
      );
    } else {
      // Data loading animation (spinner)
      return (
        <>
          <div
            className={`animate-spin rounded-full border-2 border-primary border-r-transparent ${elementSize}`}
          ></div>
          {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </>
      );
    }
  };

  // Full screen loading with backdrop
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999] flex items-center justify-center flex-col gap-3">
        {renderLoadingContent()}
      </div>
    );
  }

  // Inline loading animation
  return (
    <div className="flex items-center justify-center flex-col gap-3 p-2">
      {renderLoadingContent()}
    </div>
  );
};

/**
 * Component wrapper that handles loading states
 */
export const LoadingWrapper: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  type?: 'page' | 'data';
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({
  isLoading,
  children,
  loadingText = 'Loading...',
  type = 'data',
  fullScreen = false,
  size = 'md',
}) => {
  if (isLoading) {
    return (
      <Loading
        fullScreen={fullScreen}
        type={type}
        size={size}
        text={loadingText}
      />
    );
  }

  return <>{children}</>;
};

/**
 * Utility function to ensure loading state is cleared
 * This can be used in critical navigation points like logout
 */
export const clearLoadingState = () => {
  // Re-enable scrolling in case it was disabled by a loading component
  if (typeof document !== 'undefined') {
    // Store current scroll position
    const scrollY = parseInt(document.body.style.top || '0', 10) * -1;

    // Reset all styles that might have been set
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';

    // Restore scroll position if it was saved
    if (!isNaN(scrollY)) {
      window.scrollTo(0, scrollY);
    }

    // Force reload active loading components by dispatching a custom event
    window.dispatchEvent(new CustomEvent('force-loading-cleanup'));
  }
};

/**
 * Component specifically for page transitions
 */
export const PageLoading: React.FC<Omit<LoadingProps, 'type'>> = (props) => {
  return <Loading {...props} type="page" />;
};

/**
 * Component specifically for data loading
 */
export const DataLoading: React.FC<Omit<LoadingProps, 'type'>> = (props) => {
  return <Loading {...props} type="data" />;
};

/**
 * Wrapper specifically for data fetching components
 */
export const DataLoadingWrapper: React.FC<
  Omit<Parameters<typeof LoadingWrapper>[0], 'type'>
> = (props) => {
  return <LoadingWrapper {...props} type="data" />;
};

/**
 * Button with loading state
 */
export const LoadingButton: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loadingText?: string;
  size?: 'sm' | 'default' | 'lg';
}> = ({
  isLoading,
  children,
  onClick,
  className = '',
  disabled = false,
  loadingText,
  size = 'default',
}) => {
  // Define size mappings for the spinner
  const spinnerSize = size === 'sm' ? 'sm' : size === 'lg' ? 'md' : 'sm';

  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`inline-flex items-center justify-center gap-2 ${className}`}
    >
      {isLoading && <DataLoading size={spinnerSize} />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
};

export default Loading;
