import { UniversalErrorPage } from '@/components/universal-error-page';

export default function Custom503() {
  return <UniversalErrorPage errorCode="503" showBackButton={false} />;
}

// This enables static optimization for better performance
export async function getStaticProps() {
  return {
    props: {},
  };
}
