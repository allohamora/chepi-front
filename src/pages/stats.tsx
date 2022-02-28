import { GetStaticProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { keys } from 'src/lib/react-query';
import { getPizzasStats } from 'src/services/pizza';
import { FIVE_MINUTES_IN_SECONDS } from 'src/utils/time-values';
import { Stats } from 'src/views/Stats';

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(keys.pizzasStats, getPizzasStats);

  return {
    props: {
      queryState: dehydrate(queryClient),
    },
    revalidate: FIVE_MINUTES_IN_SECONDS,
  };
};

export default Stats;
