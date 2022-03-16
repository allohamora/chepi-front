import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { Pizza } from 'src/services/pizza/types';
import { Card, Typography, Image, Row } from 'antd';
import { useConfig } from 'src/providers/ConfigProvider';
import { ProfileOutlined, ShoppingOutlined } from '@ant-design/icons';
import { capitalize } from 'src/utils/string';
import { useComparison } from 'src/providers/ComparisonProvider';
import { StyledCard, PushinIcon, Property } from './style';

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
          key="add-to-comparison"
          onClick={togglePushin(pizza.id)}
          inCompareList={pizzasIds[pizza.id]}
          title={pizzasIds[pizza.id] ? t('action.delete-from-comparison') : t('action.add-to-comparison')}
        />,
        <Link key="more-info" href={`/pizza/${pizza.id}`}>
          <a href={`/pizza/${pizza.id}`} title={t('action.more-info')} rel="noopener noreferrer" target="_blank">
            <ProfileOutlined />
          </a>
        </Link>,
        <a key="buy" href={pizza.link} title={t('action.buy')} rel="noopener noreferrer" target="_blank">
          <ShoppingOutlined />
        </a>,
      ]}
      hoverable
    >
      <Meta
        title={
          <Link href={pizza.link}>
            <a href={pizza.link} rel="noopener noreferrer" target="_blank">
              {title} {size !== null ? ` ${size} ${t('cm')}` : ''}
            </a>
          </Link>
        }
        description={
          <>
            <Paragraph>{capitalize(descripton)}</Paragraph>
            <Row justify="space-around">
              <Property>
                {price} {t('grn')}
              </Property>
              {weight && (
                <Property>
                  {weight} {t('gram')}
                </Property>
              )}
            </Row>
          </>
        }
      />
    </StyledCard>
  );
};
