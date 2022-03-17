import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Typography } from 'antd';
import { SearchLayout } from 'src/layouts/Search';
import { capitalize } from 'src/utils/string';
import { Seo } from 'src/components/Seo';
import { ComparisonIcon, SearchIcon, SettingsIcon, StatsIcon } from 'src/components/Icon';
import { Block } from './style';

const { Title, Paragraph } = Typography;

export const Home: FC = () => {
  const { t } = useTranslation('home');

  return (
    <SearchLayout>
      <Seo title={capitalize(t('title'))} description={capitalize(t('title'))} />

      <Block>
        <Title level={3}>{capitalize(t('welcome'))}!</Title>
        <Paragraph>
          <span
            dangerouslySetInnerHTML={{ __html: capitalize(t('you-are-at', { chepi: '<strong>Chepi</strong>' })) }}
          />
        </Paragraph>
        <Paragraph>
          {capitalize(t('to-search'))} <SearchIcon />
        </Paragraph>
        <Paragraph>
          {capitalize(t('to-comparison'))} <ComparisonIcon />
        </Paragraph>
        <Paragraph>
          {capitalize(t('to-settings'))} <SettingsIcon />
        </Paragraph>
        <Paragraph>
          {capitalize(t('to-stats'))} <StatsIcon />
        </Paragraph>
        <Paragraph>
          {capitalize(t('translated-by'))}{' '}
          <a rel="noopener noreferrer" target="_blank" href="https://translate.google.com">
            Google Translate
          </a>
        </Paragraph>
        <Paragraph>{capitalize(t('good-luck'))}!</Paragraph>
      </Block>
    </SearchLayout>
  );
};
