import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Search as SearchView } from 'src/views/Search';
import { QueryClient } from 'react-query';
import { keys } from 'src/lib/react-query';
import { getPizzas } from 'src/services/pizza';
import { dehydrate } from 'react-query/hydration';
import { supportedCountriesVariants } from 'src/config/country';
import { Pizza, supportedLangs } from 'src/services/pizza/types';

const Search: NextPage = () => <SearchView />;

interface Params {
  country: Pizza['country'];
  city: Pizza['city'];
}

export const getStaticProps: GetStaticProps = async (context) => {
  const queryClient = new QueryClient();
  const { country, city } = context.params as unknown as Params;
  const query = '';

  await queryClient.prefetchQuery([keys.pizzas, query], () => getPizzas({ query, city, country }));

  return {
    props: {
      queryState: dehydrate(queryClient),
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  const paths = supportedCountriesVariants
    .map(({ city, country }) => supportedLangs.map((locale) => ({ params: { city, country }, locale })))
    .flat(1);

  return {
    paths,
    fallback: false,
  };
};

export default Search;
