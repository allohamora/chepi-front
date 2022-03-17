import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import { AnchorAction } from './Action';
import { MoreInfoIcon } from './Icon';

interface Props {
  id: string;
  className?: string;
}

export const MoreInfoLink: FC<Props> = ({ id, className }) => {
  const { t } = useTranslation('more-info-link');

  return (
    <Link href={`/pizza/${id}`}>
      <AnchorAction href={`/pizza/${id}`} title={t('more-info')} className={className}>
        <MoreInfoIcon />
      </AnchorAction>
    </Link>
  );
};
