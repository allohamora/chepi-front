import { ChangeEvent, FC, Fragment, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Row, Space, Input, Select, Button, Drawer, Typography } from 'antd';
import { SettingFilled, PushpinOutlined } from '@ant-design/icons';
import { image } from 'src/utils/path';
import { Container } from 'src/components/Container';
import { Config, useConfig } from 'src/providers/ConfigProvider';
import { useRouter } from 'next/dist/client/router';
import { Title, ImageContainer, Divider, HomeLink, BrandContainer, NavCol, BrandCol, OptionRow } from './style';

const { Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const getOptionsSelects = (config: Config) =>
  [
    {
      key: 'language',
      title: 'Language:',
      value: config.language,
      options: [
        {
          value: 'en',
          children: 'English',
        },
        {
          value: 'ru',
          children: 'Russian',
        },
        {
          value: 'uk',
          children: 'Ukranian',
        },
      ],
    },
    {
      key: 'country',
      title: 'Country:',
      value: config.country,
      options: [
        {
          value: 'ukraine',
          children: 'Ukraine',
        },
      ],
    },
    {
      key: 'city',
      title: 'City:',
      value: config.city,
      options: [
        {
          value: 'chernivtsi',
          children: 'Chernivtsi',
        },
      ],
    },
  ] as const;

export const SearchLayout: FC = ({ children }) => {
  const { config, changeKey } = useConfig();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const router = useRouter();
  const {
    query: { query },
  } = router;
  const [searchQuery, setSearchQuery] = useState(query);

  const searchHandler = (newQuery: string) => router.push({ pathname: '/', query: { query: newQuery } });

  const searchChangeHandler = (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

  const openSettings = () => setSettingsVisible(true);
  const closeSettings = () => setSettingsVisible(false);

  const optionsSelects = getOptionsSelects(config);

  useEffect(() => {
    if (typeof query === 'string' && query.length > 0 && query.length === 0) {
      setSearchQuery(query);
    }
  }, [query]);

  return (
    <>
      <Container>
        <Row align="middle">
          <BrandCol sm={6} xs={12}>
            <BrandContainer>
              <Link href="/">
                <HomeLink>
                  <Space>
                    <ImageContainer>
                      <Image width={300} height={300} src={image('logo.svg')} />
                    </ImageContainer>

                    <Title level={3}>Chepi</Title>
                  </Space>
                </HomeLink>
              </Link>
            </BrandContainer>
          </BrandCol>

          <Col xs={24} sm={12}>
            <Search placeholder="Search" onSearch={searchHandler} onChange={searchChangeHandler} value={searchQuery} />
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

      <Drawer width="300" title="Settings" placement="right" onClose={closeSettings} visible={settingsVisible}>
        {optionsSelects.map(({ key, title, value, options }) => (
          <OptionRow key={key} justify="space-between" align="middle">
            <Text>{title}</Text>

            <Select value={value} onChange={(newValue) => changeKey(key, newValue)}>
              {options.map((props, i) => (
                <Option key={i} {...props} />
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
