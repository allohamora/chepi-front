import { Lang, Pizza } from 'src/services/pizza/types';

interface MinAndMax {
  min: number | null;
  max: number | null;
}

interface InitialPizzasState {
  ingredients: Record<string, number>;
  price: MinAndMax;
  weight: MinAndMax;
  size: MinAndMax;
}

export interface MinAndMaxNotNull {
  min: number;
  max: number;
}

export interface PizzasState {
  ingredients: Record<string, number>;
  price: MinAndMaxNotNull;
  weight: MinAndMaxNotNull;
  size: MinAndMaxNotNull;
}

export const handleMinAndMax = (minAndMax: MinAndMax, value: number | null) => {
  if (value === null) return minAndMax;

  const filtered = { ...minAndMax };

  if (minAndMax.min === null) filtered.min = value;
  if (minAndMax.max === null) filtered.max = value;

  if (filtered.min !== null && filtered.min > value) filtered.min = value;
  if (filtered.max !== null && filtered.max < value) filtered.max = value;

  return filtered as { min: number; max: number };
};

export const descriptionToIngredients = (description: string) => description.toLowerCase().split(', ');

export const getPizzasState = (pizzas: Pizza[], language: Lang) => {
  return pizzas.reduce(
    (pizzasState, pizza) => {
      pizzasState.price = handleMinAndMax(pizzasState.price, pizza.price);
      pizzasState.weight = handleMinAndMax(pizzasState.weight, pizza.weight);
      pizzasState.size = handleMinAndMax(pizzasState.size, pizza.size);

      const description = pizza[`${language}_description`];

      descriptionToIngredients(description).forEach((ing) => {
        const base = pizzasState.ingredients[ing] ?? 0;
        pizzasState.ingredients[ing] = base + 1;
      });

      return pizzasState as PizzasState;
    },
    {
      ingredients: {},
      price: { min: null, max: null },
      weight: { min: null, max: null },
      size: { min: null, max: null },
    } as InitialPizzasState,
  ) as PizzasState;
};
