# Blastify - Next.js Frontend with Shadcn UI

A modern, scalable frontend application built with Next.js and Shadcn UI, designed to interact with a backend API service using JWT authentication.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Authentication**: JWT-based auth
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)

## Project Structure

```
src/
├── app/                # Next.js App Router
│   ├── dashboard/      # Dashboard page (protected)
│   ├── (landing)/      # Landing page and auth routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout with providers
│   └── page.tsx        # Home page
├── components/
│   ├── ui/             # Shadcn UI components
│   ├── landing/        # Landing page components
│   ├── dashboard/      # Dashboard components
│   ├── auth/           # Authentication components
│   ├── main-nav.tsx    # Main navigation component
│   └── theme-*.tsx     # Theme-related components
├── context/
│   └── auth.context.tsx  # Authentication context
├── hooks/
│   ├── useAuth.ts      # Auth-related custom hooks
│   └── useLogout.ts    # Logout functionality hook
├── lib/
│   └── utils.ts        # Utility functions
├── services/
│   ├── api.ts          # Axios instance setup
│   ├── auth.service.ts # Auth API service
│   └── device.service.ts # Device management service
├── types/
│   ├── auth.ts         # Auth-related TypeScript types
│   └── device.ts       # Device-related TypeScript types
└── utils/
    ├── auth.ts         # Auth utility functions
    ├── security-headers.ts # Security headers configuration
    └── logger.ts       # Logging utility
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Installation

1. Clone the repository

2. Install the dependencies:

   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory:

   ```
   NEXT_PUBLIC_API_URL=http://your-api-url.com/api
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your-midtrans-client-key
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication Flow

The application uses JWT-based authentication:

1. User login credentials are sent to the backend
2. Backend validates and returns a JWT token
3. Token is stored in localStorage
4. Token is included in the Authorization header for API requests
5. Protected routes redirect to login if no valid token exists

## Adding New Components

This project uses Shadcn UI for components. To add a new component:

```bash
npx shadcn@latest add button
```

## Configuration

The project comes with several configuration files:

- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration
- `components.json` - Shadcn UI configuration

## Logging System

The application implements a comprehensive logging system for better monitoring, debugging, and maintainability:

### Logging Features

- **Multiple log levels**: DEBUG, INFO, WARN, ERROR, FATAL
- **Colorized console output** in development
- **File-based logging** in production Node.js environment
- **Contextual logging** with metadata support
- **Component-specific loggers** via child loggers

### Usage Examples

```typescript
// Import the default logger
import logger from '@/utils/logger';

// Basic logging
logger.debug('This is a debug message');
logger.info('This is an info message');
logger.warn('This is a warning');
logger.error('This is an error', new Error('Something went wrong'));
logger.fatal('This is a fatal error');

// Logging with context/metadata
logger.info('User login', { userId: '123', timestamp: new Date() });

// Component-specific logger
const authLogger = logger.child('Auth');
authLogger.info('Authentication successful');
```

### Configuration

The logging system adapts based on the environment:

- In **development**, it shows colorized console output with all log levels
- In **production**, it filters to INFO level and above, with file output on the server
- Sensitive data is automatically redacted in logs

### Log File Location

In production, logs are stored in `./logs/blastify.log` by default. The `logs` directory is automatically created when needed and is excluded from Git commits to avoid exposing sensitive information.

## Deployment

This Next.js application can be deployed with [Vercel](https://vercel.com) or any other Next.js-compatible hosting service.
