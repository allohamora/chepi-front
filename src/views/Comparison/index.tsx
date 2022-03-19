import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useComparison } from 'src/providers/ComparisonProvider';
import { ComparisonContent, ComparisonType } from './ComparisonContent';

const locationIds = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  return new URLSearchParams(window.location.search).getAll('ids');
};

export const COMPARISON_TYPES: ComparisonType[] = ['own', 'external'];

export const Comparison: FC = () => {
  const router = useRouter();
  const {
    query: { ids: queryIds },
  } = router;
  const comparison = useComparison();

  const [isQueryReady, setIsQueryReady] = useState(false);

  useEffect(() => {
    setIsQueryReady(true);
  }, []);

  const type = router.query.type as ComparisonType;

  const queryPizzasIds = (typeof queryIds === 'string' ? [queryIds] : queryIds) ?? [];
  const isExternalVariant = type === 'external';

  const urlRemovePizzas = (...ids: string[]) => {
    const newIds = queryPizzasIds.filter((id) => !ids.includes(id));
    const urlSearchParams = new URLSearchParams(newIds.map((id) => ['ids', id]));

    router.replace(`/comparison/external?${urlSearchParams.toString()}`);
  };

  if (isExternalVariant) {
    const isIdsLoadded = locationIds().length === queryPizzasIds.length;

    return (
      <ComparisonContent
        pizzasIds={queryPizzasIds}
        removePizzas={urlRemovePizzas}
        isReady={isIdsLoadded && isQueryReady}
        type="external"
      />
    );
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
