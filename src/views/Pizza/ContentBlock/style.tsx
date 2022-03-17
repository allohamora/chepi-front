import styled from '@emotion/styled';
import { fontSize, fontWeight } from 'src/style/helpers';

export const Container = styled.div`
  margin-top: 10px;
`;

export const Title = styled.div`
  font-size: ${fontSize(16)};
  font-weight: ${fontWeight('bold')};
`;

export const Children = styled.div`
  font-size: ${fontSize(14)};
  font-weight: ${fontWeight('regular')};
`;
