import { Image, TableProps, Tag } from 'antd';
import { Translate } from 'next-translate';
import { capitalize } from 'src/utils/string';
import { compareTwoStrings } from 'string-similarity';
import { createTitleText } from 'src/utils/pizza';
import { LinkTitle } from 'src/components/LinkTitle';
import { MoreInfoLink } from 'src/components/MoreInfoLink';
import { BuyLink } from 'src/components/BuyLink';
import { DeleteIcon } from 'src/components/Icon';
import { Actions, DeleteButton } from './style';
import { descriptionToIngredients, MinAndMaxNotNull, PizzasState } from './pizzas-state';

const COMPARE_LIMIT = 0.85;

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

const sortNumberOrNull = (a: number | null, b: number | null) => {
  if (a === null) return 1;
  if (b === null) return -1;

  return a - b;
};

type TagColor = 'default' | 'success';
type Handler = (minAndMax: MinAndMaxNotNull, value: number) => TagColor;

export const numberHighlight =
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

export const getColumns = (
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
