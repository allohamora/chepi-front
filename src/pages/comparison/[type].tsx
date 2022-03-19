import { GetStaticPaths } from 'next';
import { supportedLangs } from 'src/services/pizza/types';
import { Comparison, COMPARISON_TYPES } from 'src/views/Comparison';

export const getStaticPaths: GetStaticPaths = () => {
  const paths = COMPARISON_TYPES.map((type) => supportedLangs.map((locale) => ({ params: { type }, locale }))).flat(1);

  return {
    paths,
    fallback: false,
  };
};

export default Comparison;
