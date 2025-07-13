import { UniversalErrorPage } from '@/components/universal-error-page';

export default function Custom500() {
  return <UniversalErrorPage errorCode="500" showBackButton={false} />;
}

// This enables static optimization for better performance
export async function getStaticProps() {
  return {
    props: {},
  };
}
