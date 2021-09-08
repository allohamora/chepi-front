import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Typography } from 'antd';
import { SearchOutlined, SettingFilled, PushpinOutlined } from '@ant-design/icons';
import { SearchLayout } from 'src/layouts/Search';
import { capitalize } from 'src/utils/string';
import { Block } from './style';

const { Title, Paragraph } = Typography;

export const Home: FC = () => {
  const { t } = useTranslation('home');

  return (
    <SearchLayout>
      <Block>
        <Title level={3}>{capitalize(t('welcome'))}!</Title>
        <Paragraph>
          <span
            dangerouslySetInnerHTML={{ __html: capitalize(t('you-are-at', { chepi: '<strong>Chepi</strong>' })) }}
          />
        </Paragraph>
        <Paragraph>
          {capitalize(t('for-search'))} <SearchOutlined />
        </Paragraph>
        <Paragraph>
          {capitalize(t('for-comparison'))} <PushpinOutlined />
        </Paragraph>
        <Paragraph>
          {capitalize(t('for-settings'))} <SettingFilled />
        </Paragraph>
        <Paragraph>{capitalize(t('good-luck'))}!</Paragraph>
      </Block>
    </SearchLayout>
  );
};
