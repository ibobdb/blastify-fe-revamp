import {
  Search,
  ServerCrash,
  ShieldAlert,
  ShieldX,
  Ban,
  WifiOff,
  AlertTriangle,
  Clock,
  Zap,
} from 'lucide-react';

export type ErrorCode =
  | '400'
  | '401'
  | '403'
  | '404'
  | '405'
  | '408'
  | '429'
  | '500'
  | '501'
  | '502'
  | '503'
  | '504'
  | 'offline'
  | 'timeout'
  | 'network';

export interface ErrorPageConfig {
  code: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  iconColor: 'primary' | 'destructive' | 'yellow' | 'orange' | 'red';
  suggestions?: string[];
}

export const errorConfigs: Record<ErrorCode, ErrorPageConfig> = {
  // Client Errors (4xx)
  '400': {
    code: '400',
    title: 'Bad Request',
    description:
      'The request was invalid or cannot be served. Please check your input and try again.',
    icon: AlertTriangle,
    iconColor: 'orange',
    suggestions: [
      'Check your input data',
      'Verify form fields',
      'Contact support if needed',
    ],
  },
  '401': {
    code: '401',
    title: 'Unauthorized Access',
    description:
      'You need to sign in to access this page. Please authenticate to continue.',
    icon: ShieldX,
    iconColor: 'orange',
    suggestions: [
      'Sign in to your account',
      'Create a new account',
      'Reset your password',
    ],
  },
  '403': {
    code: '403',
    title: 'Access Forbidden',
    description:
      "You don't have permission to access this resource. Contact an administrator if you believe this is an error.",
    icon: Ban,
    iconColor: 'red',
    suggestions: [
      'Contact support for access',
      'Check your permissions',
      'Verify your account status',
    ],
  },
  '404': {
    code: '404',
    title: 'Page Not Found',
    description:
      "The page you're looking for doesn't exist or has been moved to a different location.",
    icon: Search,
    iconColor: 'primary',
    suggestions: [
      'Check the URL spelling',
      'Use the navigation menu',
      'Search for the content',
    ],
  },
  '405': {
    code: '405',
    title: 'Method Not Allowed',
    description: 'The request method is not supported for this resource.',
    icon: Ban,
    iconColor: 'orange',
    suggestions: [
      'Try a different approach',
      'Check the API documentation',
      'Contact support',
    ],
  },
  '408': {
    code: '408',
    title: 'Request Timeout',
    description: 'The request took too long to complete. Please try again.',
    icon: Clock,
    iconColor: 'yellow',
    suggestions: [
      'Check your internet connection',
      'Try again in a moment',
      'Reduce request size',
    ],
  },
  '429': {
    code: '429',
    title: 'Too Many Requests',
    description:
      "You've made too many requests in a short time. Please wait before trying again.",
    icon: Zap,
    iconColor: 'yellow',
    suggestions: [
      'Wait a few minutes',
      'Reduce request frequency',
      'Check rate limits',
    ],
  },

  // Server Errors (5xx)
  '500': {
    code: '500',
    title: 'Internal Server Error',
    description:
      "Something went wrong on our end. We're working to fix this issue as quickly as possible.",
    icon: ServerCrash,
    iconColor: 'destructive',
    suggestions: [
      'Try refreshing the page',
      'Wait a few minutes',
      'Contact support if persistent',
    ],
  },
  '501': {
    code: '501',
    title: 'Not Implemented',
    description: "This feature is not yet implemented. We're working on it!",
    icon: AlertTriangle,
    iconColor: 'yellow',
    suggestions: [
      'Check back later',
      'Use alternative features',
      'Contact support for updates',
    ],
  },
  '502': {
    code: '502',
    title: 'Bad Gateway',
    description:
      'Our servers are having trouble communicating. Please try again in a moment.',
    icon: ServerCrash,
    iconColor: 'destructive',
    suggestions: [
      'Refresh the page',
      'Wait a few minutes',
      'Check service status',
    ],
  },
  '503': {
    code: '503',
    title: 'Service Unavailable',
    description:
      "We're currently performing scheduled maintenance. The service will be back online shortly.",
    icon: ShieldAlert,
    iconColor: 'yellow',
    suggestions: [
      'Check our status page',
      'Follow us on social media',
      'Try again later',
    ],
  },
  '504': {
    code: '504',
    title: 'Gateway Timeout',
    description:
      'Our servers are taking too long to respond. Please try again.',
    icon: Clock,
    iconColor: 'yellow',
    suggestions: [
      'Refresh the page',
      'Check your connection',
      'Try again in a few minutes',
    ],
  },

  // Network/Connection Errors
  offline: {
    code: 'Offline',
    title: 'No Internet Connection',
    description: 'Please check your internet connection and try again.',
    icon: WifiOff,
    iconColor: 'orange',
    suggestions: ['Check your WiFi', 'Try mobile data', 'Contact your ISP'],
  },
  timeout: {
    code: 'Timeout',
    title: 'Connection Timeout',
    description: 'The connection to our servers timed out. Please try again.',
    icon: Clock,
    iconColor: 'yellow',
    suggestions: [
      'Check your connection',
      'Try again',
      'Contact support if persistent',
    ],
  },
  network: {
    code: 'Network',
    title: 'Network Error',
    description:
      'A network error occurred. Please check your connection and try again.',
    icon: WifiOff,
    iconColor: 'orange',
    suggestions: [
      'Check your connection',
      'Try again',
      'Contact your network administrator',
    ],
  },
};

export function getErrorConfig(errorCode: ErrorCode): ErrorPageConfig {
  return errorConfigs[errorCode] || errorConfigs['500'];
}

export function getErrorCodeFromStatus(status: number): ErrorCode {
  const statusStr = status.toString() as ErrorCode;
  return errorConfigs[statusStr] ? statusStr : '500';
}
