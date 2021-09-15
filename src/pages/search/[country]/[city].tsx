import { GetStaticPaths } from 'next';
import { Search } from 'src/views/Search';
import { supportedCountriesVariants } from 'src/config/country';
import { supportedLangs } from 'src/services/pizza/types';

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
