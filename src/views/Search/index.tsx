import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from 'react-query';
import { SearchLayout } from 'src/layouts/Search';
import { keys } from 'src/lib/react-query';
import { getPizzas } from 'src/services/pizza';
import { Alert, Pagination, Row } from 'antd';
import { useConfig } from 'src/providers/ConfigProvider';
import { useRouter } from 'next/dist/client/router';
import { PizzaCard } from 'src/components/PizzaCard';
import { capitalize } from 'src/utils/string';
import { Seo } from 'src/components/Seo';
import { PaginationContainer } from './style';

const PIZZAS_PER_PAGE = 20;

export const Search: FC = () => {
  const {
    config: { city, country },
  } = useConfig();

  const router = useRouter();
  const {
    query: { query = '', page: pageQuery },
  } = router;
  const offset = !pageQuery ? 0 : PIZZAS_PER_PAGE * (Number(pageQuery) - 1);

  const { isLoading, data, error } = useQuery(
    [keys.pizzas, query, offset],
    () => getPizzas({ city, country, query: query as string, offset, limit: PIZZAS_PER_PAGE }),
    { keepPreviousData: true },
  );

  const { t } = useTranslation('search-view');
  const seo = (
    <Seo
      title={(query as string).length === 0 ? capitalize(t('title')) : (query as string)}
      description={capitalize(t('description', { query: query as string }))}
    />
  );

  if (isLoading || data === undefined) {
    return (
      <SearchLayout>
        {seo}
        <Alert message={capitalize(`${t('pizza.fetch.loading')}...`)} type="info" showIcon />
      </SearchLayout>
    );
  }

  if (error) {
    return (
      <SearchLayout>
        {seo}
        <Alert message={capitalize(t('pizza.fetch.error'))} type="error" showIcon />
      </SearchLayout>
    );
  }

  const { value, total } = data;

  const paginatonChangeHandler = (page: number) => {
    const finalPage = page === 1 ? undefined : page;

    router.push({ query: { ...router.query, page: finalPage } });
  };

  return (
    <SearchLayout>
      {seo}
      {value.length > 0 && (
        <>
          <Row justify="space-around" gutter={[16, 16]}>
            {value.map((pizza) => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))}
          </Row>

          <PaginationContainer>
            <Pagination
              defaultCurrent={1}
              total={total}
              onChange={paginatonChangeHandler}
              defaultPageSize={PIZZAS_PER_PAGE}
              showQuickJumper={false}
              showSizeChanger={false}
              responsive
            />
          </PaginationContainer>
        </>
      )}

      {value.length === 0 && <Alert message={capitalize(t('pizza.results-not-found'))} type="info" showIcon />}
    </SearchLayout>
  );
};
