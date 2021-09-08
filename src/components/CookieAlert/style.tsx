import styled from '@emotion/styled';
import { Alert } from 'antd';

export const CookieAlert = styled(Alert)`
  position: fixed;
  bottom: 10px;
  left: 50%;
  z-index: 1;
  width: 100%;
  max-width: 900px;
  transform: translateX(-50%);
`;
