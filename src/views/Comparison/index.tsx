import { FC, Key, useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Alert, Image, Tag, Button, TableProps } from 'antd';
import { Translate } from 'next-translate';
import { useQuery } from 'react-query';
import { SearchLayout } from 'src/layouts/Search';
import { keys } from 'src/lib/react-query';
import { useComparison } from 'src/providers/ComparisonProvider';
import { useConfig } from 'src/providers/ConfigProvider';
import { getPizzasByIds } from 'src/services/pizza';
import { capitalize } from 'src/utils/string';
import { unique } from 'src/utils/array';
import { numberOrNone } from 'src/utils/number';
import { Seo } from 'src/components/Seo';
import { compareTwoStrings } from 'string-similarity';
import { Pizza } from 'src/services/pizza/types';
import { StyledTable } from './style';

const COMPARE_LIMIT = 0.85;

interface MinAndMax {
  min: number | null;
  max: number | null;
}

interface MinAndMaxNotNull {
  min: number;
  max: number;
}

interface InitialPizzasState {
  ingredients: Record<string, number>;
  price: MinAndMax;
  weight: MinAndMax;
  size: MinAndMax;
}

type PizzasState = {
  ingredients: Record<string, number>;
  price: MinAndMaxNotNull;
  weight: MinAndMaxNotNull;
  size: MinAndMaxNotNull;
};

const descriptionToIngredients = (description: string) => description.toLowerCase().split(', ');
const sortNumberOrNull = (a: number | null, b: number | null) => {
  if (a === null) return 1;
  if (b === null) return -1;
  return a - b;
};

const handleMinAndMax = (minAndMax: MinAndMax, value: number | null) => {
  if (value === null) return minAndMax;

  const filtered = { ...minAndMax };

  if (minAndMax.min === null) filtered.min = value;
  if (minAndMax.max === null) filtered.max = value;

  if (filtered.min !== null && filtered.min > value) filtered.min = value;
  if (filtered.max !== null && filtered.max < value) filtered.max = value;

  return filtered as { min: number; max: number };
};

type TagColor = 'default' | 'success';
type Handler = (minAndMax: MinAndMaxNotNull, value: number) => TagColor;
const numberHighlight = (handler: Handler) => (minAndMax: MinAndMaxNotNull) => (value: number | null) => {
  let color: 'default' | 'success';

  if (value === null) {
    color = 'default';
  } else {
    color = handler(minAndMax, value);
  }

  return <Tag color={color}>{numberOrNone(value)}</Tag>;
};

const minHandler = numberHighlight((minAndMax, value) => (minAndMax.min < value ? 'default' : 'success'));
const maxHandler = numberHighlight((minAndMax, value) => (minAndMax.max > value ? 'default' : 'success'));

const getColumns = (t: Translate, state: PizzasState) => {
  const ingredientsState = Object.entries(state.ingredients);

  const columns: TableProps<Pizza>['columns'] = [
    {
      title: capitalize(t('table.title')),
      dataIndex: 'title',
      key: 'title',
      render: (title: string, pizza: Pizza) => {
        const { link, size } = pizza;

        return (
          <a rel="noopener noreferrer" target="_blank" href={link}>
            {title}
            {size !== null ? ` ${size}${t('table.cm')}` : ''}
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
      title: capitalize(t('table.description')),
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => {
        const ingredients = descriptionToIngredients(description);
        const tags = ingredients.map((ing, i) => {
          const finded = ingredientsState.find(([key, value]) => {
            if (ing === key && value <= 1) {
              return false;
            }

            return compareTwoStrings(key, ing) >= COMPARE_LIMIT;
          });

          const color = finded ? 'default' : 'success';

          return (
            <Tag key={`${ing}-${i}`} color={color}>
              {ing}
            </Tag>
          );
        });

        return <div>{tags}</div>;
      },
    },
    {
      title: `${capitalize(t('table.price'))} (${t('table.grn')})`,
      dataIndex: 'price',
      key: 'price',
      render: minHandler(state.price),
      sorter: (a: Pizza, b: Pizza) => sortNumberOrNull(a.price, b.price),
    },
    {
      title: `${capitalize(t('table.weight'))} (${t('table.gram')})`,
      dataIndex: 'weight',
      key: 'weight',
      render: maxHandler(state.weight),
      sorter: (a: Pizza, b: Pizza) => sortNumberOrNull(a.weight, b.weight),
    },
    {
      title: `${capitalize(t('table.size'))} (${t('table.cm')})`,
      dataIndex: 'size',
      key: 'size',
      render: maxHandler(state.size),
      sorter: (a: Pizza, b: Pizza) => sortNumberOrNull(a.size, b.size),
    },
  ];

  return columns;
};

export const Comparison: FC = () => {
  const { t } = useTranslation('comparison');
  const {
    config: { language },
  } = useConfig();
  const { pizzasIds: pizzasIdsState, removePizzas, loading } = useComparison();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const seo = <Seo title={t('title')} description={t('description')} />;

  const pizzasIds = Object.keys(pizzasIdsState);

  const { isLoading, error, data } = useQuery([keys.pizzasByIds, pizzasIds], () => getPizzasByIds(pizzasIds), {
    keepPreviousData: true,
    enabled: !loading,
  });

  useEffect(() => {
    if (data === undefined) return;

    const pizzas = data.value;

    if (pizzas.length !== pizzasIds.length) {
      const invalid = unique(
        pizzas.map(({ id }) => id),
        pizzasIds,
      );

      console.warn('some pizzas was not found', invalid);
      removePizzas(...invalid);
    }
  }, [data?.value]);

  if (isLoading || data === undefined) {
    return (
      <SearchLayout>
        {seo}
        <Alert message={`${capitalize(t('loading'))}...`} type="info" showIcon />
      </SearchLayout>
    );
  }

  if (error) {
    return (
      <SearchLayout>
        {seo}
        <Alert message={capitalize(t('error'))} type="error" showIcon />
      </SearchLayout>
    );
  }

  const { value: pizzas } = data;

  const state = pizzas.reduce(
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

  const tableColumns = getColumns(t, state) as TableProps<object>['columns'];

  const tableData = pizzas.map((pizza) => {
    const { image, id, link, price, size, weight } = pizza;

    const title = capitalize(pizza[`${language}_title`]);
    const description = capitalize(pizza[`${language}_description`]);

    return { key: id, image, title, description, price, weight, size, link };
  });

  const selectChangeHandler = (newSelectedkeys: Key[]) => setSelectedKeys(newSelectedkeys as string[]);
  const deleteKeysHandler = () => {
    removePizzas(...selectedKeys);
    setSelectedKeys([]);
  };

  return (
    <SearchLayout>
      {seo}
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
