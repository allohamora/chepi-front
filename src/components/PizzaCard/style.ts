import styled from '@emotion/styled';
import { Card, Modal, Image } from 'antd';

export const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 200px;

  .ant-card-cover {
    position: relative;

    height: 200px;
    background-color: white;
  }

  .ant-card-actions {
    margin-top: auto;
  }

  img {
    position: absolute;
    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);
  }
`;

export const StyledModal = styled(Modal)`
  .ant-modal-footer {
    display: none;
  }
`;

export const DescriptionImage = styled(Image)`
  max-width: 100px;
`;
