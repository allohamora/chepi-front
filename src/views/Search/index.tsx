import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from 'react-query';
import { SearchLayout } from 'src/layouts/Search';
import { keys } from 'src/lib/react-query';
import { getPizzas } from 'src/services/pizza';
import { Alert, Row } from 'antd';
import { useConfig } from 'src/providers/ConfigProvider';
import { useRouter } from 'next/dist/client/router';
import { PizzaCard } from 'src/components/PizzaCard';
import { capitalize } from 'src/utils/string';

export const Search: FC = () => {
  const {
    config: { city, country },
  } = useConfig();

  const {
    query: { query = '' },
  } = useRouter();

  const { isLoading, data, error } = useQuery([keys.pizzas, query], () =>
    getPizzas({ city, country, query: query as string }),
  );

  const { t } = useTranslation('search-view');

  if (isLoading) {
    return (
      <SearchLayout>
        <Alert message={capitalize(`${t('pizza.fetch.loading')}...`)} type="info" showIcon />
      </SearchLayout>
    );
  }

  if (error) {
    return (
      <SearchLayout>
        <Alert message={capitalize(t('pizza.fetch.error'))} type="error" showIcon />
      </SearchLayout>
    );
  }

  return (
    <SearchLayout>
      <Row justify="space-around" gutter={[16, 16]}>
        {data?.value.map((pizza) => (
          <PizzaCard key={pizza.id} pizza={pizza} />
        ))}
      </Row>

      {data?.value.length === 0 && <Alert message={capitalize(t('pizza.results-not-found'))} type="info" showIcon />}
    </SearchLayout>
  );
};
