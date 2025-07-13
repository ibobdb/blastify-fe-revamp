import { UniversalErrorPage } from '@/components/universal-error-page';

export default function Custom401() {
  return (
    <UniversalErrorPage
      errorCode="401"
      showAuthButtons={true}
      showBackButton={false}
    />
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
