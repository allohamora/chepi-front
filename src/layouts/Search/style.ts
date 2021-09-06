import styled from '@emotion/styled';
import { Typography, Divider as AntDivider, Col, Row } from 'antd';
import { color, media } from 'src/style/helpers';

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
