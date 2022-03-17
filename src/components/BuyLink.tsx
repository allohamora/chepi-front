import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { AnchorAction } from './Action';
import { BuyIcon } from './Icon';

interface Props {
  href: string;
  className?: string;
}

export const BuyLink: FC<Props> = ({ href, className }) => {
  const { t } = useTranslation('buy-link');

  return (
    <AnchorAction href={href} className={className} title={t('buy')} rel="noopener noreferrer" target="_blank">
      <BuyIcon />
    </AnchorAction>
  );
};
