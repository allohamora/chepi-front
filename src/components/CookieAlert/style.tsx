import styled from '@emotion/styled';
import { Alert } from 'antd';
import { media } from 'src/style/helpers';

export const CookieAlert = styled(Alert)<{ show: boolean }>`
  position: fixed;
  bottom: 60px;
  left: 50%;
  z-index: 1;
  display: ${(p) => (p.show ? 'flex' : 'none')};
  width: 100%;
  max-width: 900px;
  transform: translateX(-50%);

  ${media.down('sm')} {
    bottom: 45px;
  }
`;
