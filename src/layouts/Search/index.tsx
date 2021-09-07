import { ChangeEvent, FC, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { Col, Row, Space, Input, Select, Button, Drawer, Typography } from 'antd';
import { SettingFilled, PushpinOutlined } from '@ant-design/icons';
import { image } from 'src/utils/path';
import { Container } from 'src/components/Container';
import { Config, useConfig } from 'src/providers/ConfigProvider';
import { useRouter } from 'next/dist/client/router';
import { Translate } from 'next-translate';
import { capitalize } from 'src/utils/string';
import { CookieAlert } from 'src/components/CookieAlert';
import { supportedCountries } from 'src/config/country';
import { Title, ImageContainer, Divider, HomeLink, BrandContainer, NavCol, BrandCol, OptionRow } from './style';

const { Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const getOptionsSelects = (config: Config, t: Translate) =>
  [
    {
      key: 'language',
      title: t('settings.language.title'),
      value: config.language,
      options: [
        {
          value: 'en',
          children: t('settings.language.options.en'),
        },
        {
          value: 'ru',
          children: t('settings.language.options.ru'),
        },
        {
          value: 'uk',
          children: t('settings.language.options.uk'),
        },
      ],
    },
    {
      key: 'country',
      title: t('settings.country.title'),
      value: config.country,
      options: Object.keys(supportedCountries).map((country) => ({
        value: country,
        children: t(`settings.country.options.${country}`),
      })),
    },
    {
      key: 'city',
      title: t('settings.city.title'),
      value: config.city,
      options: supportedCountries[config.country].cities.map((city) => ({
        value: city,
        children: t(`settings.city.options.${city}`),
      })),
    },
  ] as const;

export const SearchLayout: FC = ({ children }) => {
  const { config, changeKey } = useConfig();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const router = useRouter();
  const {
    query: { query },
  } = router;
  const { t } = useTranslation('search-layout');
  const [searchQuery, setSearchQuery] = useState(query);

  const searchHandler = (newQuery: string) =>
    router.push({
      pathname: '/search/[country]/[city]',
      query: { query: newQuery, country: config.country, city: config.city },
    });

  const searchChangeHandler = (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

  const openSettings = () => setSettingsVisible(true);
  const closeSettings = () => setSettingsVisible(false);

  const optionsSelects = getOptionsSelects(config, t);

  useEffect(() => {
    if (typeof query === 'string' && query.length > 0) {
      setSearchQuery(query);
    }
  }, [query]);

  return (
    <>
      <CookieAlert />

      <Container>
        <Row align="middle">
          <BrandCol sm={6} xs={12}>
            <BrandContainer>
              <Link href="/" passHref>
                <HomeLink>
                  <Space>
                    <ImageContainer>
                      <Image width={300} height={300} src={image('logo.svg')} alt="chepi logo" />
                    </ImageContainer>

                    <Title level={3}>Chepi</Title>
                  </Space>
                </HomeLink>
              </Link>
            </BrandContainer>
          </BrandCol>

          <Col xs={24} sm={12}>
            <Search
              placeholder={capitalize(t('search.placeholder'))}
              onSearch={searchHandler}
              onChange={searchChangeHandler}
              value={searchQuery}
            />
          </Col>

          <NavCol xs={12} sm={{ offset: 2, span: 4 }}>
            <Row justify="end">
              <Space>
                <Button>
                  <PushpinOutlined />
                </Button>
                <Button onClick={openSettings}>
                  <SettingFilled />
                </Button>
              </Space>
            </Row>
          </NavCol>
        </Row>
      </Container>

      <Drawer
        width="300"
        title={capitalize(t('settings.title'))}
        placement="right"
        onClose={closeSettings}
        visible={settingsVisible}
      >
        {optionsSelects.map(({ key, title, value, options }) => (
          <OptionRow key={key} justify="space-between" align="middle">
            <Text>{capitalize(title)}:</Text>

            <Select value={value} onChange={(newValue) => changeKey(key, newValue)}>
              {options.map(({ children: optionChildren, ...props }, i) => (
                <Option key={i} {...props}>
                  {capitalize(optionChildren)}
                </Option>
              ))}
            </Select>
          </OptionRow>
        ))}
      </Drawer>

      <Divider />

      <Container>{children}</Container>
    </>
  );
};
