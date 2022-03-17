import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { color } from 'src/style/helpers';
import { Theme } from 'src/style/theme';
import { ButtonBase } from './Button/ButtonBase';

export const actionStyles = (p: { theme: Theme }) => css`
  color: ${color('semiBlack')(p)};

  &:hover {
    color: ${color('primary')(p)};
  }
`;

export const AnchorAction = styled.a`
  ${actionStyles}
`;

export const ButtonAction = styled(ButtonBase)`
  ${actionStyles}
`;
