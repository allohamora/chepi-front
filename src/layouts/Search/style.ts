import styled from '@emotion/styled';
import { Typography, Divider as AntDivider, Col, Row } from 'antd';
import { Container } from 'src/components/Container';
import { color, media } from 'src/style/helpers';

export const Header = styled(Container)``.withComponent('header');

export const Main = styled(Container)`
  flex-grow: 1;
`.withComponent('main');

export const Footer = styled(Container)``.withComponent('footer');

export const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  flex-flow: column wrap;
`;

export const Title = styled(Typography.Title)`
  && {
    margin: 0;
    transition: 0.5s;
  }
`;

export const ImageContainer = styled.div`
  display: flex;

  width: 32px;
  height: 32px;
`;

export const Divider = styled(AntDivider)`
  margin: 0;
`;

export const HomeLink = styled.a`
  &:hover ${Title} {
    color: ${color('primary')};
  }
`;

export const BrandContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const BrandCol = styled(Col)`
  ${media.down('sm')} {
    order: -2;
  }
`;

export const NavCol = styled(Col)`
  ${media.down('sm')} {
    order: -1;
  }
`;

export const OptionRow = styled(Row)`
  &:not(:last-child) {
    padding-bottom: 5px;
  }
`;
