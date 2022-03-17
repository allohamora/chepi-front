import styled from '@emotion/styled';
import { color } from 'src/style/helpers';
import { ButtonAction } from '../Action';

export const Container = styled(ButtonAction)<{ isInComparison: boolean }>`
  ${(p) =>
    p.isInComparison &&
    `
    && {
      color: ${color('success')(p)};
      border-color: ${color('success')(p)};
    
      &:hover {
        color: ${color('danger')(p)};
        border-color: ${color('danger')(p)}
      }
    }
  `}
`;
