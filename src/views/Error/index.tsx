import { FC, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Button, Result } from 'antd';
import { useRouter } from 'next/dist/client/router';
import { SearchLayout } from 'src/layouts/Search';
import { capitalize } from 'src/utils/string';
import { Seo } from 'src/components/Seo';

export const Error: FC = () => {
  const { t } = useTranslation('error');
  const router = useRouter();
  const backHome = () => router.push('/');

  useEffect(() => {
    if (router.route === '/500') return;

    router.push('/500');
  }, []);

  return (
    <SearchLayout>
      <Seo title="500" description="500" />

      <Result
        status="500"
        title="500"
        subTitle={capitalize(t('subTitle'))}
        extra={
          <Button type="primary" onClick={backHome}>
            {t('back-home')}
          </Button>
        }
      />
    </SearchLayout>
  );
};
