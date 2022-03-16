import { FC, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
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
import { Seo } from 'src/components/Seo';
import { compareTwoStrings } from 'string-similarity';
import { DeleteOutlined, ProfileOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Actions, Buttons, StyledTable, Title } from './style';

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

interface TablePizza {
  key: string;
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  priceText: string;
  weightText: string;
  sizeText: string;
  price: number | null;
  weight: number | null;
  size: number | null;
}

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

const numberHighlight =
  (handler: Handler) => (minAndMax: MinAndMaxNotNull, value: number | null, renderValue: string | number) => {
    let color: 'default' | 'success';

    if (value === null) {
      color = 'default';
    } else {
      color = handler(minAndMax, value);
    }

    return <Tag color={color}>{renderValue}</Tag>;
  };

const minHandler = numberHighlight((minAndMax, value) => (minAndMax.min < value ? 'default' : 'success'));
const maxHandler = numberHighlight((minAndMax, value) => (minAndMax.max > value ? 'default' : 'success'));

const getColumns = (t: Translate, state: PizzasState, deletePizza: (id: string) => unknown) => {
  const ingredientsState = Object.entries(state.ingredients);

  const columns: TableProps<TablePizza>['columns'] = [
    {
      title: capitalize(t('table.title')),
      dataIndex: 'title',
      key: 'title',
      render: (title: string, pizza: TablePizza) => {
        const { link, size } = pizza;

        return (
          <Title rel="noopener noreferrer" target="_blank" href={link}>
            {title}
            {size !== null ? ` ${size} ${t('table.cm')}` : ''}
          </Title>
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
      title: `${capitalize(t('table.price'))}`,
      dataIndex: 'priceText',
      key: 'price',
      render: (_, pizza) => minHandler(state.price, pizza.price, pizza.priceText),
      sorter: (a, b) => sortNumberOrNull(a.price, b.price),
    },
    {
      title: `${capitalize(t('table.weight'))}`,
      dataIndex: 'weightText',
      key: 'weight',
      render: (_, pizza) => maxHandler(state.weight, pizza.weight, pizza.weightText),
      sorter: (a, b) => sortNumberOrNull(a.weight, b.weight),
    },
    {
      title: `${capitalize(t('table.size'))}`,
      dataIndex: 'sizeText',
      key: 'size',
      render: (_, pizza) => maxHandler(state.size, pizza.size, pizza.sizeText),
      sorter: (a, b) => sortNumberOrNull(a.size, b.size),
    },
    {
      title: `${capitalize(t('table.actions'))}`,
      key: 'actions',
      render: (_, pizza) => (
        <Actions size="small">
          <Link href={`/pizza/${pizza.id}`}>
            <a rel="noopener noreferrer" href={`/pizza/${pizza.id}`} target="_blank" title={t('table.more-info')}>
              <ProfileOutlined />
            </a>
          </Link>

          <a rel="noopener noreferrer" href={pizza.link} target="_blank" title={t('table.buy')}>
            <ShoppingOutlined />
          </a>

          <button type="button" onClick={() => deletePizza(pizza.id)} title={t('table.delete')}>
            <DeleteOutlined />
          </button>
        </Actions>
      ),
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

  const deletePizza = (id: string) => {
    removePizzas(id);
  };

  const tableColumns = getColumns(t, state, deletePizza) as TableProps<object>['columns'];

  const tableData = pizzas.map((pizza) => {
    const { image, id, link, price, size, weight } = pizza;

    const title = capitalize(pizza[`${language}_title`]);
    const description = capitalize(pizza[`${language}_description`]);

    return {
      key: id,
      id,
      title,
      description,
      image,
      link,
      priceText: price === null ? '-' : `${price} ${t('table.grn')}`,
      weightText: weight === null ? '-' : `${weight} ${t('table.gram')}`,
      sizeText: size === null ? '-' : `${size} ${t('table.cm')}`,
      price,
      weight,
      size,
    };
  });

  const clearComparison = () => {
    removePizzas(...pizzasIds);
  };

  return (
    <SearchLayout>
      {seo}
      {pizzas.length > 0 && (
        <>
          <Buttons>
            <Button onClick={clearComparison} type="primary" danger>
              {capitalize(t('table.clear'))}
            </Button>
          </Buttons>

          <StyledTable columns={tableColumns} dataSource={tableData} scroll={{ x: 0 }} pagination={false} bordered />
        </>
      )}

      {pizzas.length === 0 && <Alert message={capitalize(t('comparison-empty'))} type="info" showIcon />}
    </SearchLayout>
  );
};
