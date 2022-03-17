import { FC } from 'react';
import { Anchor } from './style';

interface Props {
  href: string;
  title: string;
  className?: string;
}

export const LinkTitle: FC<Props> = ({ href, title, className }) => (
  <Anchor href={href} rel="noopener noreferrer" target="_blank" className={className}>
    {title}
  </Anchor>
);
