import { FC, ReactNode } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { CalendarOutlined, FileOutlined } from '@ant-design/icons';
import { Statistic } from 'antd';
import { Translate } from 'next-translate';
import { useQuery } from 'react-query';
import { Seo } from 'src/components/Seo';
import { SearchLayout } from 'src/layouts/Search';
import { keys } from 'src/lib/react-query';
import { getPizzasStats } from 'src/services/pizza';
import { Lang } from 'src/services/pizza/types';
import { getLongDateString, timestampToDate } from 'src/utils/date';
import { AlertStatus } from 'src/components/AlertStatus';
import { StateContainer, StateTitle } from './style';

const createWithContainers = (t: Translate) => (children: ReactNode) => {
  return (
    <SearchLayout>
      <Seo title={t('title')} description={t('description')} />
      <StateTitle level={3}>{t('title')}</StateTitle>

      <StateContainer>{children}</StateContainer>
    </SearchLayout>
  );
};

export const Stats: FC = () => {
  const { t, lang } = useTranslation('stats');

  const { isLoading, isError, data } = useQuery(keys.pizzasStats, getPizzasStats);

  const withContainers = createWithContainers(t);

  if (isLoading || data === undefined) {
    return withContainers(<AlertStatus status="loading" />);
  }

  if (isError) {
    return withContainers(<AlertStatus status="error" />);
  }

  return withContainers(
    <>
      <Statistic
        prefix={<CalendarOutlined />}
        title={t('updatedAt')}
        value={getLongDateString(timestampToDate(data.updatedAt), lang as Lang)}
      />
      <Statistic prefix={<FileOutlined />} title={t('count')} value={data.count} />
    </>,
  );
};
