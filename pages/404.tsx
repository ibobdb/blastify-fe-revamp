import { UniversalErrorPage } from '@/components/universal-error-page';

export default function Custom404() {
  return <UniversalErrorPage errorCode="404" showPopularLinks={true} />;
}

// This enables static optimization for better performance
export async function getStaticProps() {
  return {
    props: {},
  };
}
