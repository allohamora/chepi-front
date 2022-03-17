import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { Alert } from 'antd';
import { capitalize } from 'src/utils/string';

interface Props {
  status: 'error' | 'loading';
}

export const AlertStatus: FC<Props> = ({ status }) => {
  const { t } = useTranslation('alert-status');

  if (status === 'error') {
    return <Alert message={capitalize(t('error'))} type="error" showIcon />;
  }

  return <Alert message={`${capitalize(t('loading'))}...`} type="info" showIcon />;
};
