import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Pizza } from 'src/services/pizza/types';
import { Card, Typography, Image, Row } from 'antd';
import { useConfig } from 'src/providers/ConfigProvider';
import { capitalize } from 'src/utils/string';
import { createPriceText, createTitleText, createWeightText } from 'src/utils/pizza';
import { StyledCard, Property } from './style';
import { ComparisonToggleButton } from '../ComparisonToggleButton';
import { MoreInfoLink } from '../MoreInfoLink';
import { BuyLink } from '../BuyLink';
import { LinkTitle } from '../LinkTitle';

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
  const { t } = useTranslation('value');
  const { image, price, size, weight, id, link } = pizza;

  const title = capitalize(pizza[`${language}_title`]);
  const descripton = capitalize(pizza[`${language}_description`]);

  const titleText = createTitleText(title, size, t('cm'));
  const priceText = createPriceText(price, t('uah'));

  return (
    <StyledCard
      className={className}
      cover={<Image alt={title} src={image} />}
      actions={[
        <ComparisonToggleButton key="comparison-toggle-button" className={CLICK_IGNORE} id={id} />,
        <MoreInfoLink key="more-info-link" id={id} />,
        <BuyLink key="buy" href={link} />,
      ]}
      hoverable
    >
      <Meta
        title={<LinkTitle title={titleText} href={link} />}
        description={
          <>
            <Paragraph>{capitalize(descripton)}</Paragraph>
            <Row justify="space-around">
              <Property>{priceText}</Property>
              {weight && <Property>{createWeightText(weight, t('gram'))}</Property>}
            </Row>
          </>
        }
      />
    </StyledCard>
  );
};
