import styled from '@emotion/styled';
import { media } from 'src/style/helpers';

export const Container = styled.div`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;

  ${media.down('sm')} {
    padding: 8px;
  }
`;
