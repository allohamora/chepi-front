import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-flow: column wrap;

  margin-bottom: 20px;

  > * {
    max-width: 400px;
    max-height: 400px;
  }
`;

export const ContentContainer = styled.div`
  margin-top: 10px;

  text-align: center;
`;

export const Title = styled.h3`
  color: var(--ant-primary-color);
  font-size: 30px;
`;

export const Description = styled.p`
  font-size: 18px;
`;

export const PropertiesContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
`;

export const Property = styled.div`
  font-size: 16px;
`;
