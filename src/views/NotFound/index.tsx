import { FC, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Button, Result } from 'antd';
import { SearchLayout } from 'src/layouts/Search';
import { capitalize } from 'src/utils/string';
import { useRouter } from 'next/dist/client/router';
import { Seo } from 'src/components/Seo';

export const NotFound: FC = () => {
  const { t } = useTranslation('not-found');
  const router = useRouter();
  const backHome = () => router.push('/');

  useEffect(() => {
    router.replace('/404');
  }, []);

  return (
    <SearchLayout>
      <Seo title="404" description="404" />

      <Result
        status="404"
        title="404"
        subTitle={capitalize(t('subTitle'))}
        extra={
          <Button type="primary" onClick={backHome}>
            {capitalize(t('back-home'))}
          </Button>
        }
      />
    </SearchLayout>
  );
};
