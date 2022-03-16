import styled from '@emotion/styled';
import { Space, Table } from 'antd';
import { color, fontSize } from 'src/style/helpers';

export const StyledTable = styled(Table)`
  margin-top: 10px;

  .ant-tag {
    margin-top: 5px;
  }

  .ant-table-cell {
    text-align: center;
  }

  .ant-image {
    min-width: 100px;
  }
`;

export const Actions = styled(Space)`
  font-size: ${fontSize(20)}; /*icon size*/

  display: flex;
  justify-content: center;
  align-items: center;

  a,
  button {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 0;

    background-color: transparent;

    color: ${color('semiBlack')};
    border: none;

    cursor: pointer;

    &:hover {
      color: ${color('primary')};
    }
  }
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: right;
`;
