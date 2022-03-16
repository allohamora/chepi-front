import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Typography } from 'antd';
import { SearchOutlined, SettingOutlined, PushpinOutlined, RiseOutlined } from '@ant-design/icons';
import { SearchLayout } from 'src/layouts/Search';
import { capitalize } from 'src/utils/string';
import { Seo } from 'src/components/Seo';
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
          {capitalize(t('to-search'))} <SearchOutlined />
        </Paragraph>
        <Paragraph>
          {capitalize(t('to-comparison'))} <PushpinOutlined />
        </Paragraph>
        <Paragraph>
          {capitalize(t('to-settings'))} <SettingOutlined />
        </Paragraph>
        <Paragraph>
          {capitalize(t('to-stats'))} <RiseOutlined />
        </Paragraph>
        <Paragraph>
          {capitalize(t('translated-by'))}{' '}
          <a rel="noopener noreferrer" href="https://translate.google.com" target="_blank">
            Google Translate
          </a>
        </Paragraph>
        <Paragraph>{capitalize(t('good-luck'))}!</Paragraph>
      </Block>
    </SearchLayout>
  );
};
