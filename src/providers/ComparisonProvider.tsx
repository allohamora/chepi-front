import { FC, createContext, useContext, useState, useEffect, useMemo } from 'react';
import { localStorageKeys } from 'src/config/localstorage';

interface ComparisonState {
  pizzasIds: Record<string, boolean>;
  addPizzas: (...ids: string[]) => void;
  removePizzas: (...ids: string[]) => void;
  isInComparisonCheck: (id: string) => boolean;
  isLoading: boolean;
}

const defaultState = {} as ComparisonState;
const ComparisonContext = createContext(defaultState);

export const useComparison = () => useContext(ComparisonContext);

export const ComparisonProvider: FC = ({ children }) => {
  const [pizzasIds, setPizzasIds] = useState<ComparisonState['pizzasIds']>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userPizzasIds = JSON.parse(localStorage.getItem(localStorageKeys.pizzasIds) as string) ?? {};

    setPizzasIds(userPizzasIds);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKeys.pizzasIds, JSON.stringify(pizzasIds));
  }, [pizzasIds]);

  const addPizzas = (...ids: string[]) => {
    const newPizzasIds = ids.reduce((state, id) => ({ ...state, [id]: true }), {});

    setPizzasIds({ ...pizzasIds, ...newPizzasIds });
  };

  const removePizzas = (...ids: string[]) => {
    const newPizzasIds = ids.reduce(
      (state, id) => {
        delete state[id];

        return state;
      },
      { ...pizzasIds },
    );

    setPizzasIds(newPizzasIds);
  };

  const isInComparisonCheck = (id: string) => {
    return pizzasIds[id];
  };

  const context = useMemo(() => ({ pizzasIds, addPizzas, removePizzas, isInComparisonCheck, isLoading }), [pizzasIds]);

  return <ComparisonContext.Provider value={context}>{children}</ComparisonContext.Provider>;
};
