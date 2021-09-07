import { FC } from 'react';
import { useQuery } from 'react-query';
import { SearchLayout } from 'src/layouts/Search';
import { keys } from 'src/lib/react-query';
import { getPizzas } from 'src/services/pizza';
import { Alert } from 'antd';
import { useConfig } from 'src/providers/ConfigProvider';
import { useRouter } from 'next/dist/client/router';

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

  if (isLoading) {
    return (
      <SearchLayout>
        <Alert message="Loading..." type="info" showIcon />
      </SearchLayout>
    );
  }

  if (error) {
    return (
      <SearchLayout>
        <Alert message="Error during loading" type="error" showIcon />
      </SearchLayout>
    );
  }

  return <SearchLayout>{JSON.stringify(data)}</SearchLayout>;
};
