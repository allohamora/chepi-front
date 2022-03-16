import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { PushpinOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Alert, Image, Row } from 'antd';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { Seo } from 'src/components/Seo';
import { NotFoundException } from 'src/exceptions/not-found.exception';
import { SearchLayout } from 'src/layouts/Search';
import { keys } from 'src/lib/react-query';
import { useComparison } from 'src/providers/ComparisonProvider';
import { getPizzaById } from 'src/services/pizza';
import { Lang, Pizza as PizzaType } from 'src/services/pizza/types';
import { capitalize } from 'src/utils/string';
import { ContentBlock } from './ContentBlock';
import { Actions, Container, Description, HistoryList, MainContent, PinAction, Property, Title } from './style';

const formatDate = (timestamp: number, lang: Lang) => {
  const date = new Date(timestamp * 1000);
  const formatter = new Intl.DateTimeFormat(lang, { day: '2-digit', month: '2-digit', year: '2-digit' });

  return formatter.format(date);
};

export const Pizza: FC = () => {
  const { t, lang } = useTranslation('pizza');
  const { pizzasIds, addPizza, removePizzas } = useComparison();
  const router = useRouter();

  const id = router.query.id as string;

  const { isLoading, error, data } = useQuery([keys.pizzaById, id], () => getPizzaById(id), { retry: false });

  const titleKey = `${lang as Lang}_title` as const;
  const title = data?.[titleKey];

  const descriptionKey = `${lang as Lang}_description` as const;
  const description = data?.[descriptionKey];

  const seo = <Seo title={title ?? t('loading')} description={description ?? t('loading')} />;

  if (isLoading) {
    return (
      <SearchLayout>
        {seo}
        <Alert message={`${t('loading')}...`} type="info" showIcon />
      </SearchLayout>
    );
  }

  if (error && error instanceof NotFoundException) {
    router.replace('/404');
    return null;
  }

  if (error) {
    return (
      <SearchLayout>
        {seo}
        <Alert message={t('error')} type="error" showIcon />
      </SearchLayout>
    );
  }

  const { country, city, image, link, price, size, weight, historyOfChanges } = data as PizzaType;

  const isPinned = !!pizzasIds[id];
  const togglePin = () => {
    if (isPinned) {
      return removePizzas(id);
    }

    return addPizza(id);
  };

  const getChangeTitle = (key: string) => {
    if (key === titleKey) {
      return 'title';
    }

    if (key === descriptionKey) {
      return 'description';
    }

    return key;
  };

  const history =
    historyOfChanges
      ?.filter(({ key }) => {
        if (/(title|description)/.test(key)) {
          return titleKey === key || descriptionKey === key;
        }

        return true;
      })
      .map((change) => ({
        title: getChangeTitle(change.key),
        from: change.old ?? '-',
        to: change.new ?? '-',
        detectedAt: change.detectedAt,
      })) ?? [];

  return (
    <SearchLayout>
      {seo}
      <Container>
        <MainContent>
          <Image src={image} alt={title} />

          <Title href={link} rel="noopener noreferrer" target="_blank">
            {title}
            {size && ` ${size} ${t('cm')}`}
          </Title>
          <Description>{description}</Description>
          <Row justify="center">
            {weight && (
              <Property>
                {weight} {t('gram')}
              </Property>
            )}
            <Property>
              {price} {t('uah')}
            </Property>
          </Row>
          <Actions size="middle">
            <PinAction
              title={isPinned ? t('delete-from-comparison') : t('add-to-comparison')}
              type="button"
              isPinned={isPinned}
              onClick={togglePin}
            >
              <PushpinOutlined />
            </PinAction>

            <a title={t('buy')} rel="noopener noreferrer" target="_blank" href={link}>
              <ShoppingOutlined />
            </a>
          </Actions>
        </MainContent>

        <ContentBlock title={capitalize(t('where-sell'))}>
          {capitalize(t(city))}, {capitalize(t(country))}
        </ContentBlock>

        {historyOfChanges && history.length > 0 && (
          <ContentBlock title={capitalize(t('history-of-changes'))}>
            <HistoryList>
              {history.map(({ detectedAt, from, to, title: historyTitle }) => (
                <li key={JSON.stringify({ detectedAt, from, to, historyTitle })}>
                  {formatDate(detectedAt, lang as Lang)}: {t(`changed-${historyTitle}`)} {t('from')} {`"${from}"`}{' '}
                  {t('to')} {`"${to}"`}
                </li>
              ))}
            </HistoryList>
          </ContentBlock>
        )}
      </Container>
    </SearchLayout>
  );
};
