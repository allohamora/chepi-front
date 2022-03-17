import { FC } from 'react';
import { Title, Children, Container } from './style';

interface Props {
  title: string;
}

export const ContentBlock: FC<Props> = ({ title, children }) => (
  <Container>
    <Title>{title}: </Title>
    <Children>{children}</Children>
  </Container>
);
