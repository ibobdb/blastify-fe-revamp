# Error Pages Documentation

This project includes a comprehensive error handling system with custom error pages that match the application's theme.

## Overview

The error pages are designed to provide a consistent user experience across different error scenarios while maintaining the application's visual identity using the Moby Blue color scheme and modern UI components.

## Available Error Pages

### App Router (Next.js 13+)

- `src/app/not-found.tsx` - 404 Not Found (App Router)
- `src/app/error.tsx` - Client-side errors (App Router)
- `src/app/global-error.tsx` - Global errors (App Router)

### Pages Router (Traditional Next.js)

- `pages/404.tsx` - 404 Not Found
- `pages/500.tsx` - Internal Server Error
- `pages/503.tsx` - Service Unavailable
- `pages/401.tsx` - Unauthorized Access
- `pages/403.tsx` - Access Forbidden
- `pages/offline.tsx` - No Internet Connection

## Components

### ErrorPageLayout

Base layout component for consistent error page styling.

```tsx
import { ErrorPageLayout } from '@/components/error-page-layout';
import { Search } from 'lucide-react';

<ErrorPageLayout
  errorCode="404"
  title="Page Not Found"
  description="The page you're looking for doesn't exist."
  icon={Search}
  iconColor="primary"
  actions={<YourActionButtons />}
  additionalInfo={<AdditionalContent />}
  showPopularLinks={true}
/>;
```

### UniversalErrorPage

Pre-configured error page component that handles common error scenarios.

```tsx
import { UniversalErrorPage } from '@/components/universal-error-page';

<UniversalErrorPage
  errorCode="404"
  showPopularLinks={true}
  showBackButton={true}
  showHomeButton={true}
  showRefreshButton={true}
  showAuthButtons={false}
/>;
```

### ErrorBoundary

React Error Boundary component for catching JavaScript errors.

```tsx
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary onError={(error, errorInfo) => console.log(error)}>
  <YourComponent />
</ErrorBoundary>;
```

## Error Configuration

Error configurations are centralized in `src/utils/error-configs.ts`:

```tsx
import { getErrorConfig, getErrorCodeFromStatus } from '@/utils/error-configs';

// Get configuration for a specific error
const config = getErrorConfig('404');

// Convert HTTP status to error code
const errorCode = getErrorCodeFromStatus(404);
```

## Supported Error Types

### Client Errors (4xx)

- **400** - Bad Request
- **401** - Unauthorized Access
- **403** - Access Forbidden
- **404** - Page Not Found
- **405** - Method Not Allowed
- **408** - Request Timeout
- **429** - Too Many Requests

### Server Errors (5xx)

- **500** - Internal Server Error
- **501** - Not Implemented
- **502** - Bad Gateway
- **503** - Service Unavailable
- **504** - Gateway Timeout

### Network Errors

- **offline** - No Internet Connection
- **timeout** - Connection Timeout
- **network** - Network Error

## Customization

### Theme Colors

Error pages use the following color scheme:

- **Primary**: Moby Blue (#1d63ed) for general errors
- **Destructive**: Red tones for server errors
- **Yellow**: Warning colors for maintenance/timeouts
- **Orange**: Auth-related errors
- **Red**: Security/forbidden errors

### Custom Error Pages

To create a custom error page:

```tsx
import { UniversalErrorPage } from '@/components/universal-error-page';

export default function CustomError() {
  return (
    <UniversalErrorPage
      errorCode="404"
      customTitle="Custom Title"
      customDescription="Custom description for your specific use case."
      customActions={<YourCustomActions />}
    />
  );
}
```

## Usage Examples

### Basic 404 Page

```tsx
export default function Custom404() {
  return <UniversalErrorPage errorCode="404" showPopularLinks={true} />;
}
```

### Authentication Error

```tsx
export default function AuthError() {
  return (
    <UniversalErrorPage
      errorCode="401"
      showAuthButtons={true}
      showBackButton={false}
    />
  );
}
```

### Maintenance Page

```tsx
export default function Maintenance() {
  return <UniversalErrorPage errorCode="503" showBackButton={false} />;
}
```

## Features

- **Responsive Design**: Works on all device sizes
- **Dark Mode Support**: Automatic theme switching
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Loading States**: Smooth transitions and animations
- **SEO Friendly**: Proper meta tags and static generation
- **Error Logging**: Development error details
- **Customizable**: Easy to modify and extend

## Best Practices

1. **Use specific error codes** for better user experience
2. **Provide helpful suggestions** for each error type
3. **Include navigation options** to help users recover
4. **Log errors appropriately** for debugging
5. **Test error pages** in different scenarios
6. **Keep error messages user-friendly** and actionable

## Development

When developing error pages:

- Test with different HTTP status codes
- Verify responsive design on multiple devices
- Check dark/light mode compatibility
- Ensure accessibility standards are met
- Test error boundary functionality

## Production Considerations

- Error pages are statically generated for better performance
- Error logging should be configured for monitoring
- Consider implementing error reporting services
- Regular testing of error scenarios is recommended
