import styled from '@emotion/styled';
import { Typography } from 'antd';
import { Container } from 'src/components/Container';

export const StateTitle = styled(Typography.Title)`
  text-align: center;
`;

export const StateContainer = styled(Container)`
  display: flex;
  justify-content: center;

  & > * {
    margin-right: 20px;
  }
`;
