import { FC } from 'react';
import { useRouter } from 'next/router';
import { useComparison } from 'src/providers/ComparisonProvider';
import { ComparisonContent } from './ComparisonContent';

export const Comparison: FC = () => {
  const router = useRouter();
  const {
    query: { isUrl, ...query },
  } = router;
  const comparison = useComparison();

  const queryPizzasIds = Object.keys(query);
  const isUrlVariant = isUrl === '1';

  const urlRemovePizzas = (...ids: string[]) => {
    const newIds = queryPizzasIds.filter((id) => !ids.includes(id));
    const urlSearchParams = new URLSearchParams([['isUrl', '1'], ...newIds.map((id) => [id, '1'])]);

    router.replace(`/comparison?${urlSearchParams.toString()}`);
  };

  if (isUrlVariant) {
    return <ComparisonContent pizzasIds={queryPizzasIds} removePizzas={urlRemovePizzas} isReady type="external" />;
  }

  return (
    <ComparisonContent
      pizzasIds={Object.keys(comparison.pizzasIds)}
      removePizzas={comparison.removePizzas}
      isReady={!comparison.isLoading}
      type="own"
    />
  );
};
