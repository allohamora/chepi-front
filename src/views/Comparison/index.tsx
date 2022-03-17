import { FC, useEffect } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Alert, Image, Tag, Button, TableProps, Popconfirm } from 'antd';
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
import { AlertStatus } from 'src/components/AlertStatus';
import { createPriceText, createSizeText, createTitleText, createWeightText } from 'src/utils/pizza';
import { LinkTitle } from 'src/components/LinkTitle';
import { MoreInfoLink } from 'src/components/MoreInfoLink';
import { BuyLink } from 'src/components/BuyLink';
import { DeleteIcon } from 'src/components/Icon';
import { Actions, Buttons, DeleteButton, StyledTable } from './style';

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

interface TranlsateContext {
  t: Translate;
  tValue: Translate;
  tProperty: Translate;
}

const getColumns = (
  { t, tValue, tProperty }: TranlsateContext,
  state: PizzasState,
  deletePizza: (id: string) => unknown,
) => {
  const ingredientsState = Object.entries(state.ingredients);

  const columns: TableProps<TablePizza>['columns'] = [
    {
      title: capitalize(tProperty('title')),
      dataIndex: 'title',
      key: 'title',
      render: (title: string, pizza) => {
        const { link, size } = pizza;
        const titleText = createTitleText(title, size, tValue('cm'));

        return <LinkTitle href={link} title={titleText} />;
      },
    },
    {
      title: capitalize(tProperty('image')),
      dataIndex: 'image',
      key: 'image',
      render: (image: string, pizza) => {
        const { size, title } = pizza;
        const titleText = createTitleText(title, size, tValue('cm'));

        return <Image src={image} alt={titleText} />;
      },
    },
    {
      title: capitalize(tProperty('description')),
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
      title: `${capitalize(tProperty('price'))}`,
      dataIndex: 'priceText',
      key: 'price',
      render: (_, pizza) => minHandler(state.price, pizza.price, pizza.priceText),
      sorter: (a, b) => sortNumberOrNull(a.price, b.price),
    },
    {
      title: `${capitalize(tProperty('weight'))}`,
      dataIndex: 'weightText',
      key: 'weight',
      render: (_, pizza) => maxHandler(state.weight, pizza.weight, pizza.weightText),
      sorter: (a, b) => sortNumberOrNull(a.weight, b.weight),
    },
    {
      title: `${capitalize(tProperty('size'))}`,
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
          <MoreInfoLink id={pizza.id} />
          <BuyLink href={pizza.link} />

          <DeleteButton type="button" onClick={() => deletePizza(pizza.id)} title={t('table.delete')}>
            <DeleteIcon />
          </DeleteButton>
        </Actions>
      ),
    },
  ];

  return columns;
};

export const Comparison: FC = () => {
  const { t } = useTranslation('comparison');
  const { t: tValue } = useTranslation('value');
  const { t: tProperty } = useTranslation('property');
  const {
    config: { language },
  } = useConfig();
  const { pizzasIds: pizzasIdsState, removePizzas, isLoading: comparisonIsLoading } = useComparison();

  const seo = <Seo title={t('title')} description={t('description')} />;

  const pizzasIds = Object.keys(pizzasIdsState);

  const { isLoading, error, data } = useQuery([keys.pizzasByIds, pizzasIds], () => getPizzasByIds(pizzasIds), {
    keepPreviousData: true,
    enabled: !comparisonIsLoading,
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
        <AlertStatus status="loading" />
      </SearchLayout>
    );
  }

  if (error) {
    return (
      <SearchLayout>
        {seo}
        <AlertStatus status="error" />
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

  const tableColumns = getColumns({ t, tValue, tProperty }, state, deletePizza) as TableProps<object>['columns'];

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
      priceText: price === null ? '-' : createPriceText(price, tValue('uah')),
      weightText: weight === null ? '-' : createWeightText(weight, tValue('gram')),
      sizeText: size === null ? '-' : createSizeText(size, tValue('cm')),
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
            <Popconfirm onConfirm={clearComparison} title={t('clear-message')}>
              <Button type="ghost" danger>
                {capitalize(t('table.clear'))}
              </Button>
            </Popconfirm>
          </Buttons>

          <StyledTable columns={tableColumns} dataSource={tableData} scroll={{ x: 0 }} pagination={false} bordered />
        </>
      )}

      {pizzas.length === 0 && <Alert message={capitalize(t('comparison-empty'))} type="info" showIcon />}
    </SearchLayout>
  );
};
