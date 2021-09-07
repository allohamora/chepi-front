import styled from '@emotion/styled';
import { Card } from 'antd';
import { color } from 'src/style/helpers';

export const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 280px;

  .ant-card-cover {
    position: relative;

    height: 280px;
    background-color: ${color('white')};
  }

  .ant-card-actions {
    margin-top: auto;
  }

  .ant-image {
    position: absolute;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);
  }

  .ant-card-body,
  .ant-card-meta,
  .ant-card-meta-detail,
  .ant-card-meta-description {
    width: 100%;
    display: flex;
    flex-grow: 1;
  }

  .ant-card-meta-detail {
    flex-flow: column wrap;
  }

  .ant-card-meta-detail {
    justify-content: space-between;
  }

  .ant-card-meta-description {
    flex-flow: column wrap;
    justify-content: space-between;
  }

  .ant-card-meta-title {
    width: 100%;
  }
`;
