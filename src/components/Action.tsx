import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { color } from 'src/style/helpers';
import { Props } from 'src/style/props';
import { ButtonBase } from './Button/ButtonBase';

export const actionStyles = (p: Props) => css`
  display: block;
  width: 100%;

  color: ${color('semiBlack')(p)};

  transition: 0.3s;

  &:hover {
    color: ${color('primary')(p)};
  }
`;

export const actionWithBorder = (p: Props) => css`
  ${actionStyles(p)}

  border: 1px solid ${color('gray')(p)};
  border-radius: 5px;

  &:hover {
    border-color: ${color('primary')(p)};
  }
`;

export const AnchorAction = styled.a`
  ${actionStyles}
`;

export const ButtonAction = styled(ButtonBase)`
  ${actionStyles}
`;
