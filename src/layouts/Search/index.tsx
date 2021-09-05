import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Col, Row, Space, Input } from 'antd';
import { image } from 'src/utils/path';
import { Container } from 'src/components/Container';
import { Title, ImageContainer, Divider, HomeLink, BrandContainer } from './style';

const { Search } = Input;

export const SearchLayout: FC = ({ children }) => (
  <>
    <Container>
      <Row>
        <Col sm={6} xs={24}>
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
        </Col>
        <Col sm={18} xs={24}>
          <Search placeholder="Search" />
        </Col>
      </Row>
    </Container>

    <Divider />

    <Container>{children}</Container>
  </>
);
