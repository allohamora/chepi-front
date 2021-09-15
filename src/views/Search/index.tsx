import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from 'react-query';
import { SearchLayout } from 'src/layouts/Search';
import { keys } from 'src/lib/react-query';
import { getPizzas } from 'src/services/pizza';
import { Alert, Pagination, Row, Select } from 'antd';
import { useConfig } from 'src/providers/ConfigProvider';
import { useRouter } from 'next/dist/client/router';
import { PizzaCard } from 'src/components/PizzaCard';
import { capitalize } from 'src/utils/string';
import { Seo } from 'src/components/Seo';
import { PaginationContainer, SelectContainer } from './style';

const PIZZAS_PER_PAGE = 20;

const { Option } = Select;

export const Search: FC = () => {
  const {
    config: { city, country },
  } = useConfig();

  const { t } = useTranslation('search-view');

  const router = useRouter();
  const {
    query: { query: queryString = '', sort: sortString = '0', page: pageQuery, ...restQuery },
  } = router;
  const offset = !pageQuery ? 0 : PIZZAS_PER_PAGE * (Number(pageQuery) - 1);
  const query = queryString as string;
  const sort = parseInt(sortString as string, 10);

  const sortOptions = [
    { text: capitalize(t('sort.no-sort')), value: null },
    { text: capitalize(t('sort.price-asc')), value: { target: 'price', cause: 'asc' } },
    { text: capitalize(t('sort.price-desc')), value: { target: 'price', cause: 'desc' } },
    { text: capitalize(t('sort.size-asc')), value: { target: 'size', cause: 'asc' } },
    { text: capitalize(t('sort.size-desc')), value: { target: 'size', cause: 'desc' } },
    { text: capitalize(t('sort.weight-asc')), value: { target: 'weight', cause: 'asc' } },
    { text: capitalize(t('sort.weight-desc')), value: { target: 'weight', cause: 'desc' } },
  ] as const;

  const sortChangeHandler = (newSort: number) => {
    router.push({ query: { query, sort: newSort, ...restQuery } });
  };

  const { isLoading, data, error } = useQuery(
    [keys.pizzas, query, offset, sort],
    () =>
      getPizzas({
        city,
        country,
        query: query as string,
        offset,
        limit: PIZZAS_PER_PAGE,
        orderBy: sortOptions[sort].value,
      }),
    { keepPreviousData: true },
  );

  const seo = (
    <Seo
      title={query.length === 0 ? capitalize(t('title')) : query}
      description={capitalize(t('description', { query }))}
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
          <SelectContainer>
            <Select defaultValue={sort} onChange={sortChangeHandler}>
              {sortOptions.map(({ text }, i) => (
                <Option key={i} value={i}>
                  {text}
                </Option>
              ))}
            </Select>
          </SelectContainer>

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
