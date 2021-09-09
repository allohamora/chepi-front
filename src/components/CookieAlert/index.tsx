import { FC, useEffect, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { capitalize } from 'src/utils/string';
import { useConfig } from 'src/providers/ConfigProvider';
import { CookieAlert as Alert } from './style';

let showTimeout: NodeJS.Timeout;

const SHOW_TIMEOUT = 1000;

export const CookieAlert: FC = () => {
  const { t } = useTranslation('cookie');
  const { config, changeKey } = useConfig();
  const [show, setShow] = useState(false);

  useEffect(() => {
    clearTimeout(showTimeout);

    showTimeout = setTimeout(() => {
      if (show === config.showCookieAlert) return;

      setShow(config.showCookieAlert);
    }, SHOW_TIMEOUT);
  }, [config.showCookieAlert]);

  const closeAlertHandler = () => changeKey('showCookieAlert', false);

  if (config.showCookieAlert === false) {
    return null;
  }

  return (
    <Alert
      message={capitalize(t('cookie.message'))}
      afterClose={closeAlertHandler}
      show={show}
      type="info"
      showIcon
      closable
    />
  );
};
