import styled from 'styled-components';
import { media } from 'src/style/helpers';

export const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;

  ${media.down('sm')} {
    padding: 8px;
  }
`;
