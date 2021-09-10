import { FC, createContext, useContext, useState, useEffect } from 'react';

interface ComparisonState {
  pizzasIds: Record<string, boolean>;
  addPizza: (pizzaId: string) => void;
  removePizzas: (...ids: string[]) => void;
  loading: boolean;
}

const defaultState = {} as ComparisonState;
const ComparisonContext = createContext(defaultState);

export const useComparison = () => useContext(ComparisonContext);

const PIZZAS_IDS_LS_KEY = 'pizzasIds';

export const ComparisonProvider: FC = ({ children }) => {
  const [pizzasIds, setPizzasIds] = useState<ComparisonState['pizzasIds']>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userPizzasIds = JSON.parse(localStorage.getItem(PIZZAS_IDS_LS_KEY) as string) ?? {};

    setPizzasIds(userPizzasIds);
    setLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem(PIZZAS_IDS_LS_KEY, JSON.stringify(pizzasIds));
  }, [pizzasIds]);

  const addPizza = (pizzaId: string) => setPizzasIds({ ...pizzasIds, [pizzaId]: true });
  const removePizzas = (...ids: string[]) => {
    const newPizzasIds = { ...pizzasIds };

    ids.forEach((id) => {
      delete newPizzasIds[id];
    });

    setPizzasIds(newPizzasIds);
  };

  return (
    <ComparisonContext.Provider value={{ pizzasIds, addPizza, removePizzas, loading }}>
      {children}
    </ComparisonContext.Provider>
  );
};
