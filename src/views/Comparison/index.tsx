import { FC } from 'react';
import { useRouter } from 'next/router';
import { useComparison } from 'src/providers/ComparisonProvider';
import { useConfig } from 'src/providers/ConfigProvider';
import { ComparisonContent } from './ComparisonContent';

export const Comparison: FC = () => {
  const router = useRouter();
  const {
    query: { isExternal, ids: queryIds },
  } = router;
  const comparison = useComparison();
  const {
    config: { language },
  } = useConfig();

  const queryPizzasIds = (typeof queryIds === 'string' ? [queryIds] : queryIds) ?? [];
  const isExternalVariant = isExternal === '1';

  const urlRemovePizzas = (...ids: string[]) => {
    const newIds = queryPizzasIds.filter((id) => !ids.includes(id));
    const urlSearchParams = new URLSearchParams([['isExternal', '1'], ...newIds.map((id) => ['ids', id])]);

    router.replace(`${language}/comparison?${urlSearchParams.toString()}`);
  };

  if (isExternalVariant) {
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
