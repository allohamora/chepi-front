import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { Space } from 'antd';
import { LinkTitle } from 'src/components/LinkTitle';
import { Value } from 'src/components/Value';
import { color, fontSize, fontWeight } from 'src/style/helpers';
import { actionWithBorder } from 'src/components/Action';

export const contentStyle = css`
  max-width: 90%;

  margin-right: auto;
  margin-left: auto;
`;

export const Container = styled.div`
  max-width: 500px;
  margin: 0 auto 10px;
`;

export const MainContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column wrap;

  text-align: center;
`;

export const Title = styled(LinkTitle)`
  ${contentStyle}

  margin-top: 10px;
  margin-bottom: 10px;

  font-size: ${fontSize(24)};
`;

export const Description = styled.p`
  ${contentStyle}

  margin-bottom: 10px;

  color: ${color('black')};
  font-size: ${fontSize(18)};
  font-weight: ${fontWeight('regular')};
`;

export const Actions = styled(Space)`
  margin-top: 15px;

  a,
  button {
    ${actionWithBorder}

    display: flex;
    justify-content: center;
    align-items: center;

    height: 40px;
    width: 40px;
  }

  svg {
    font-size: ${fontSize(20)};
  }
`;

export const Property = styled(Value)`
  font-size: ${fontSize(14)};

  &:not(:first-of-type) {
    margin-left: 10px;
  }
`;

export const HistoryList = styled.ul`
  padding-left: 2.5em;
  margin: 0;

  > li::marker {
    font-size: ${fontSize(20)};
    color: ${color('bold')};
  }
`;

export const Company = styled.a`
  font-weight: ${fontWeight('bold')};
`;
