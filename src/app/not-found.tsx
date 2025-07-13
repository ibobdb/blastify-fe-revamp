'use client';

import { UniversalErrorPage } from '@/components/universal-error-page';

export default function NotFound() {
  return <UniversalErrorPage errorCode="404" showPopularLinks={true} />;
}
