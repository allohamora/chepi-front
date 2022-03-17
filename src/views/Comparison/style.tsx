import styled from '@emotion/styled';
import { Space, Table } from 'antd';
import { actionWithBorder, ButtonAction } from 'src/components/Action';
import { color, fontSize, fontWeight, media } from 'src/style/helpers';

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
    ${actionWithBorder}

    display: flex;
    justify-content: center;
    align-items: center;

    height: 30px;
    width: 30px;
  }
`;

export const DeleteButton = styled(ButtonAction)`
  &&:hover {
    color: ${color('danger')};
    border-color: ${color('danger')};
  }
`;

export const Head = styled.div`
  display: flex;
  justify-content: space-between;

  ${media.down('md')} {
    flex-flow: column wrap;
    align-items: center;
  }
`;

export const Type = styled.h5`
  margin-left: 10px;
  margin-bottom: 0;

  font-size: ${fontSize(24)};
  font-weight: ${fontWeight('bold')};

  ${media.down('md')} {
    margin-left: 0;
  }
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: right;

  > *:not(:first-of-type) {
    margin-left: 10px;
  }
`;
