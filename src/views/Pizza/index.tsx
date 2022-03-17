import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Image, Row } from 'antd';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { Seo } from 'src/components/Seo';
import { NotFoundException } from 'src/exceptions/not-found.exception';
import { SearchLayout } from 'src/layouts/Search';
import { keys } from 'src/lib/react-query';
import { getPizzaById } from 'src/services/pizza';
import { Lang, Pizza as PizzaType } from 'src/services/pizza/types';
import { capitalize } from 'src/utils/string';
import { createPriceText, createTitleText, createWeightText } from 'src/utils/pizza';
import { ComparisonToggleButton } from 'src/components/ComparisonToggleButton';
import { BuyLink } from 'src/components/BuyLink';
import { AlertStatus } from 'src/components/AlertStatus';
import { Actions, Container, Description, HistoryList, MainContent, Property, Title } from './style';
import { ContentBlock } from './ContentBlock';

const formatDate = (timestamp: number, lang: Lang) => {
  const date = new Date(timestamp * 1000);
  const formatter = new Intl.DateTimeFormat(lang, { day: '2-digit', month: '2-digit', year: '2-digit' });

  return formatter.format(date);
};

export const Pizza: FC = () => {
  const { t, lang } = useTranslation('pizza');
  const { t: tValue } = useTranslation('value');
  const { t: tCity } = useTranslation('city');
  const { t: tCountry } = useTranslation('country');
  const { t: tLanguage } = useTranslation('language');

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
        <AlertStatus status="loading" />
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
        <AlertStatus status="error" />
      </SearchLayout>
    );
  }

  const { country, city, lang: pizzaLang, image, link, price, size, weight, historyOfChanges } = data as PizzaType;

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

  const titleText = createTitleText(title as string, size, tValue('cm'));
  const weightText = createWeightText(weight, tValue('gram'));
  const pirceText = createPriceText(price, tValue('uah'));

  return (
    <SearchLayout>
      {seo}
      <Container>
        <MainContent>
          <Image src={image} alt={titleText} />

          <Title href={link} title={titleText} />

          <Description>{description}</Description>

          <Row justify="center">
            {weight && <Property>{weightText}</Property>}
            <Property>{pirceText}</Property>
          </Row>
          <Actions size="middle">
            <ComparisonToggleButton id={id} />

            <BuyLink href={link} />
          </Actions>
        </MainContent>

        <ContentBlock title={capitalize(t('where-sell'))}>
          {capitalize(tCity(city))}, {capitalize(tCountry(country))}
        </ContentBlock>

        <ContentBlock title={capitalize(t('original-language'))}>{capitalize(tLanguage(pizzaLang))}</ContentBlock>

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
