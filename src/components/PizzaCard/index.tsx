import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Pizza } from 'src/services/pizza/types';
import { Card, Typography, Table, Image } from 'antd';
import { useConfig } from 'src/providers/ConfigProvider';
import { ShoppingOutlined } from '@ant-design/icons';
import { capitalize } from 'src/utils/string';
import { useComparison } from 'src/providers/ComparisonProvider';
import { numberOrNone } from 'src/utils/number';
import { StyledCard, PushinIcon } from './style';

const CLICK_IGNORE = 'click-ignore';

interface PizzaCardProps {
  pizza: Pizza;
  className?: string;
}

const { Meta } = Card;
const { Paragraph } = Typography;

export const PizzaCard: FC<PizzaCardProps> = ({ pizza, className }) => {
  const {
    config: { language },
  } = useConfig();
  const { pizzasIds, addPizza, removePizzas } = useComparison();
  const { t } = useTranslation('pizza-card');
  const { image, price, size, weight } = pizza;

  const title = capitalize(pizza[`${language}_title`]);
  const descripton = capitalize(pizza[`${language}_description`]);

  const columns = [
    {
      title: `${capitalize(t('size'))} (${t('cm')})`,
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: `${capitalize(t('price'))} (${t('grn')})`,
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: `${capitalize(t('weight'))} (${t('gram')})`,
      dataIndex: 'weight',
      key: 'weight',
    },
  ];

  const data = [{ key: 0, price: numberOrNone(price), size: numberOrNone(size), weight: numberOrNone(weight) }];

  const togglePushin = (pizzaId: string) => () => {
    if (pizzasIds[pizzaId]) {
      return removePizzas(pizzaId);
    }

    return addPizza(pizzaId);
  };

  return (
    <StyledCard
      className={className}
      cover={<Image alt={title} src={image} />}
      actions={[
        <PushinIcon
          className={CLICK_IGNORE}
          key="pushin"
          onClick={togglePushin(pizza.id)}
          inCompareList={pizzasIds[pizza.id]}
        />,
        <ShoppingOutlined className={CLICK_IGNORE} key="shopping" onClick={() => window.open(pizza.link)} />,
      ]}
      hoverable
    >
      <Meta
        title={title}
        description={
          <>
            <Paragraph>{capitalize(descripton)}</Paragraph>
            <Table bordered columns={columns} dataSource={data} pagination={false} />
          </>
        }
      />
    </StyledCard>
  );
};
