import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Alert, Image } from 'antd';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { Seo } from 'src/components/Seo';
import { NotFoundException } from 'src/exceptions/not-found.exception';
import { SearchLayout } from 'src/layouts/Search';
import { keys } from 'src/lib/react-query';
import { getPizzaById } from 'src/services/pizza';
import { Lang, Pizza as PizzaEntity } from 'src/services/pizza/types';
import { capitalize } from 'src/utils/string';
import { Container, ContentContainer, Description, PropertiesContainer, Property, Title } from './style';

export const Pizza: FC = () => {
  const { t, lang } = useTranslation('pizza');
  const {
    query: { id },
  } = useRouter();
  const { isLoading, error, data } = useQuery([keys.pizzaById, id], () => getPizzaById(id as string));

  const titleKey = `${lang as Lang}_title` as const;
  const descriptionKey = `${lang as Lang}_description` as const;

  const title = data?.[titleKey];
  const description = data?.[descriptionKey];

  const seo = (
    <Seo title={`${title ?? capitalize(t('loading'))}`} description={`${description ?? capitalize(t('loading'))}`} />
  );

  if (isLoading) {
    return (
      <SearchLayout>
        {seo}
        <Alert message={capitalize(t('loading'))} type="info" showIcon />
      </SearchLayout>
    );
  }

  if (error) {
    const message = error instanceof NotFoundException ? t('not-found') : t('error');

    return (
      <SearchLayout>
        {seo}
        <Alert message={capitalize(message)} type="error" showIcon />
      </SearchLayout>
    );
  }

  const { image, price, size, weight, link } = data as PizzaEntity;

  return (
    <SearchLayout>
      {seo}

      <Container>
        <Image src={image} alt={title} />

        <ContentContainer>
          <Title>
            <a rel="noopener noreferrer" href={link} target="_blank">
              {title} {`${size} ${t('cm')}`}
            </a>
          </Title>
          <Description>{description}</Description>
        </ContentContainer>

        <PropertiesContainer>
          <Property>{`${price} ${t('grn')}`}</Property>
          <Property>{`${weight} ${t('gram')}`}</Property>
        </PropertiesContainer>
      </Container>
    </SearchLayout>
  );
};
