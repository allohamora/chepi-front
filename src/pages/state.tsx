import { GetStaticProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { keys } from 'src/lib/react-query';
import { getPizzasState } from 'src/services/pizza';
import { FIVE_MINUTES_IN_SECONDS } from 'src/utils/time-values';
import { State } from 'src/views/State';

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(keys.pizzasState, getPizzasState);

  return {
    props: {
      queryState: dehydrate(queryClient),
    },
    revalidate: FIVE_MINUTES_IN_SECONDS,
  };
};

export default State;
