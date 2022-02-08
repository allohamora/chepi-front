import { FC, ReactNode } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { CalendarOutlined, FileOutlined } from '@ant-design/icons';
import { Statistic } from 'antd';
import { Translate } from 'next-translate';
import { useQuery } from 'react-query';
import { Seo } from 'src/components/Seo';
import { SearchLayout } from 'src/layouts/Search';
import { keys } from 'src/lib/react-query';
import { getPizzasState } from 'src/services/pizza';
import { Lang } from 'src/services/pizza/types';
import { getLongDateString, timestampToDate } from 'src/utils/date';
import { StateContainer, StateTitle } from './style';

const createWithContainers = (t: Translate) => (children: ReactNode) => {
  return (
    <SearchLayout>
      <Seo title={t('title')} description="" />
      <StateTitle level={3}>{t('title')}</StateTitle>

      <StateContainer>{children}</StateContainer>
    </SearchLayout>
  );
};

export const State: FC = () => {
  const { t, lang } = useTranslation('state');
  const { isLoading, isError, data } = useQuery(keys.pizzasState, getPizzasState);

  const withContainers = createWithContainers(t);

  if (isLoading || data === undefined) {
    return withContainers(t('isLoading'));
  }

  if (isError) {
    return withContainers(t('isError'));
  }

  return withContainers(
    <>
      <Statistic
        prefix={<CalendarOutlined />}
        title={t('timestamp')}
        value={getLongDateString(timestampToDate(data.timestamp), lang as Lang)}
      />
      <Statistic prefix={<FileOutlined />} title={t('count')} value={data.count} />
    </>,
  );
};
