import { FC, Key, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Alert, Image, Tag, Button } from 'antd';
import { Translate } from 'next-translate';
import { useQuery } from 'react-query';
import { SearchLayout } from 'src/layouts/Search';
import { keys } from 'src/lib/react-query';
import { useComparison } from 'src/providers/ComparisonProvider';
import { useConfig } from 'src/providers/ConfigProvider';
import { getPizzasByIds } from 'src/services/pizza';
import { Ingredient } from 'src/services/pizza/ingredient';
import { capitalize } from 'src/utils/string';
import { StyledTable } from './style';

interface MinAndMax {
  min: number | null;
  max: number | null;
}

interface MinAndMaxNotNull {
  min: number;
  max: number;
}

interface InitialPizzasState {
  ingredients: { [k in Ingredient]: number };
  price: MinAndMax;
  weight: MinAndMax;
  size: MinAndMax;
}

type PizzasState = Pick<InitialPizzasState, 'ingredients'> & {
  price: MinAndMaxNotNull;
  weight: MinAndMaxNotNull;
  size: MinAndMaxNotNull;
};

const handleMinAndMax = (minAndMax: MinAndMax, value: number) => {
  const filtered = { ...minAndMax };

  if (minAndMax.min === null) filtered.min = value;
  if (minAndMax.max === null) filtered.max = value;

  if (filtered.min !== null && filtered.min > value) filtered.min = value;
  if (filtered.max !== null && filtered.max < value) filtered.max = value;

  return filtered as { min: number; max: number };
};

const minHandler = (minAndMax: MinAndMaxNotNull) => (values: number[]) => {
  return values.map((value, i) => (
    <Tag key={i} color={minAndMax.min < value ? 'default' : 'success'}>
      {value}
    </Tag>
  ));
};

const maxHandler = (minAndMax: MinAndMaxNotNull) => (values: number[]) => {
  return values.map((value, i) => (
    <Tag key={i} color={minAndMax.max > value ? 'default' : 'success'}>
      {value}
    </Tag>
  ));
};

const getColumns = (t: Translate, state: PizzasState) => [
  {
    title: capitalize(t('table.title')),
    dataIndex: 'title',
    key: 'title',
    render: (title: string, pizzaArgs: unknown) => {
      const { link } = pizzaArgs as { link: string };

      return (
        <a rel="noopener noreferrer" target="_blank" href={link}>
          {title}
        </a>
      );
    },
  },
  {
    title: capitalize(t('table.image')),
    dataIndex: 'image',
    key: 'image',
    render: (image: string) => <Image src={image} alt="pizza image" />,
  },
  {
    title: capitalize(t('table.ingredients')),
    dataIndex: 'ingredients',
    key: 'ingredients',
    render: (ingredients: Ingredient[]) =>
      ingredients.map((ingredient) => {
        const isDefault = state.ingredients[ingredient] > 1;

        const color = isDefault ? 'default' : 'success';

        return (
          <Tag key={ingredient} color={color}>
            {t(`ingredient.${ingredient}`)}
          </Tag>
        );
      }),
  },
  {
    title: `${capitalize(t('table.price'))} (${t('table.grn')})`,
    dataIndex: 'price',
    key: 'price',
    render: minHandler(state.price),
  },
  {
    title: `${capitalize(t('table.weight'))} (${t('table.gram')})`,
    dataIndex: 'weight',
    key: 'weight',
    render: maxHandler(state.weight),
  },
  {
    title: `${capitalize(t('table.size'))} (${t('table.cm')})`,
    dataIndex: 'size',
    key: 'size',
    render: maxHandler(state.size),
  },
];

export const Comparison: FC = () => {
  const { t } = useTranslation('comparison');
  const {
    config: { language },
  } = useConfig();
  const { pizzasIds: pizzasIdsState, removePizzas } = useComparison();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const pizzasIds = Object.keys(pizzasIdsState);

  const { isLoading, error, data } = useQuery([keys.pizzasByIds, pizzasIds], () => getPizzasByIds(pizzasIds), {
    keepPreviousData: true,
  });

  if (isLoading || data === undefined)
    return (
      <SearchLayout>
        <Alert message="loading" type="info" showIcon />
      </SearchLayout>
    );

  if (error)
    return (
      <SearchLayout>
        <Alert message="loading error" type="error" showIcon />
      </SearchLayout>
    );

  const { value: pizzas } = data;

  const state = pizzas.reduce(
    /* eslint-disable @typescript-eslint/no-shadow, no-param-reassign */
    (state, pizza) => {
      pizza.ingredients.forEach((ingredient) => {
        const base = state.ingredients[ingredient] ?? 0;
        state.ingredients[ingredient] = base + 1;
      });

      pizza.variants.forEach(({ price, weight, size }) => {
        state.price = handleMinAndMax(state.price, price);
        state.weight = handleMinAndMax(state.weight, weight);
        state.size = handleMinAndMax(state.size, size);
      });

      return state as PizzasState;
    },
    /* eslint-enable @typescript-eslint/no-shadow, no-param-reassign */
    {
      ingredients: {},
      price: { min: null, max: null },
      weight: { min: null, max: null },
      size: { min: null, max: null },
    } as InitialPizzasState,
  ) as PizzasState;

  const tableColumns = getColumns(t, state);

  const tableData = pizzas.map((pizza) => {
    const { image, variants, id, ingredients, link } = pizza;
    const title = pizza[`${language}_title`];

    const { price, weight, size } = variants.reduce<{ price: number[]; weight: number[]; size: number[] }>(
      /* eslint-disable @typescript-eslint/no-shadow */
      (state, variant) => {
        state.price.push(variant.price);
        state.weight.push(variant.weight);
        state.size.push(variant.size);

        return state;
      },
      /* eslint-enable @typescript-eslint/no-shadow */
      { price: [], weight: [], size: [] },
    );

    return { key: id, image, title, ingredients, price, weight, size, link };
  });

  if (pizzas.length !== pizzasIds.length) {
    console.warn('some pizzas was not found');
  }

  const selectChangeHandler = (newSelectedkeys: Key[]) => setSelectedKeys(newSelectedkeys as string[]);
  const deleteKeysHandler = () => {
    removePizzas(...selectedKeys);
    setSelectedKeys([]);
  };

  return (
    <SearchLayout>
      {pizzas.length > 0 && (
        <>
          <Button onClick={deleteKeysHandler} disabled={selectedKeys.length === 0} type="primary" danger>
            {capitalize(t('table.delete'))}
          </Button>

          <StyledTable
            columns={tableColumns}
            dataSource={tableData}
            scroll={{ x: 0 }}
            rowSelection={{ type: 'checkbox', onChange: selectChangeHandler }}
            pagination={false}
            bordered
          />
        </>
      )}

      {pizzas.length === 0 && <Alert message={capitalize(t('comparison-empty'))} type="info" showIcon />}
    </SearchLayout>
  );
};
