import styled from '@emotion/styled';
import { PushpinOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { color, fontSize, fontWeight } from 'src/style/helpers';

export const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 280px;

  .ant-card-cover {
    position: relative;

    height: 280px;
    background-color: ${color('weakGray')};
  }

  .ant-card-actions {
    margin-top: auto;
  }

  .ant-image {
    position: absolute;
    top: 50%;
    left: 50%;

    width: calc(100% - 20px);

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

    font-size: ${fontSize(14)};
    text-align: center;
  }

  .ant-card-meta-title {
    white-space: normal;
    width: 100%;

    font-weight: ${fontWeight('bold')};
    font-size: ${fontSize(16)};
    text-align: center;
  }

  .ant-card-actions {
    svg {
      font-size: ${fontSize(16)};
    }
  }
`;

export const Property = styled.div`
  margin-top: 10px;

  font-weight: ${fontWeight('bold')};
  color: ${color('bold')};
`;

export const PushinIcon = styled(PushpinOutlined, { shouldForwardProp: (prop) => prop !== 'inCompareList' })<{
  inCompareList: boolean;
}>`
  ${(p) =>
    p.inCompareList &&
    `
    &&& {
      color: var(--ant-success-color);

      :hover {
        color: var(--ant-error-color);
      }
    }
  `}
`;
