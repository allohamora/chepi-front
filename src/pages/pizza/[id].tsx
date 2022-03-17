import { GetStaticPaths, GetStaticProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';
import { keys } from 'src/lib/react-query';
import { getPizzaById, getPizzaIds } from 'src/services/pizza';
import { supportedLangs } from 'src/services/pizza/types';
import { FIVE_MINUTES_IN_SECONDS } from 'src/utils/time-values';
import { Pizza } from 'src/views/Pizza';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const queryClient = new QueryClient();
  const id = params?.id as string;

  await queryClient.prefetchQuery([keys.pizzaById, id], () => getPizzaById(id));

  return {
    props: {
      queryState: dehydrate(queryClient),
    },
    revalidate: FIVE_MINUTES_IN_SECONDS,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await getPizzaIds();
  const paths = ids.map((id) => supportedLangs.map((locale) => ({ params: { id }, locale }))).flat(1);

  return {
    paths,
    fallback: false, // redirect to /404 if path not exist
  };
};

export default Pizza;
