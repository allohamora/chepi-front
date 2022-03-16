import styled from '@emotion/styled';
import { Space } from 'antd';
import { color, fontSize, fontWeight } from 'src/style/helpers';

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

export const Title = styled.a`
  margin-top: 10px;
  margin-bottom: 5px;

  color: ${color('primary')};
  font-size: ${fontSize(24)};
  font-weight: ${fontWeight('bold')};
`;

export const Description = styled.p`
  color: ${color('black')};
  font-size: ${fontSize(18)};
  font-weight: ${fontWeight('regular')};

  margin-bottom: 0;
`;

export const Actions = styled(Space)`
  margin-top: 10px;

  svg {
    font-size: ${fontSize(20)};
  }

  button,
  a {
    padding: 0;
    margin: 0;

    cursor: pointer;

    background-color: transparent;
    border: none;
    color: ${color('black')};

    transition: color 0.3s;

    &:hover {
      color: ${color('primary')};
    }
  }
`;

export const PinAction = styled.button<{ isPinned: boolean }>`
  && {
    ${(p) => p.isPinned && `color: ${color('success')(p)};`}

    &:hover {
      ${(p) => p.isPinned && `color: ${color('danger')(p)};`}
    }
  }
`;

export const Property = styled.div`
  margin-top: 5px;

  font-size: ${fontSize(14)};
  font-weight: ${fontWeight('bold')};

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
