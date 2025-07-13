import { UniversalErrorPage } from '@/components/universal-error-page';

export default function Custom403() {
  return <UniversalErrorPage errorCode="403" />;
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
