import { FC } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { capitalize } from 'src/utils/string';
import { useConfig } from 'src/providers/ConfigProvider';
import { CookieAlert as Alert } from './style';

export const CookieAlert: FC = () => {
  const { t } = useTranslation('cookie');
  const { config, changeKey } = useConfig();

  const closeAlertHandler = () => changeKey('showCookieAlert', false);

  if (config.showCookieAlert === false) {
    return null;
  }

  return (
    <Alert message={capitalize(t('cookie.message'))} afterClose={closeAlertHandler} type="info" showIcon closable />
  );
};
