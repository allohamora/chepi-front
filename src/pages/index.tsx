import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import { Home as HomePageView } from 'src/views/Home';
import { QueryClient } from 'react-query';
import { keys } from 'src/lib/react-query';
import { getPizzas } from 'src/services/pizza';
import { dehydrate } from 'react-query/hydration';

const Home: NextPage = () => <HomePageView />;

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  const query = '';
  const city = 'chernivtsi';
  const country = 'ukraine';

  await queryClient.prefetchQuery([keys.pizzas, query], () => getPizzas({ query, city, country }));

  return {
    props: {
      queryState: dehydrate(queryClient),
    },
  };
};

export default Home;
