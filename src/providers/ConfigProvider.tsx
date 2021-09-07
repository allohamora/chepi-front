import { createContext, FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { Pizza } from 'src/services/pizza/types';
import { supportedCountries } from 'src/config/country';

export interface Config {
  language: Pizza['lang'];
  country: Pizza['country'];
  city: Pizza['city'];
  showCookieAlert: boolean;
}

const defaultConfig: Config = { language: 'en', country: 'ukraine', city: 'chernivtsi', showCookieAlert: true };
type ChangeKey = (key: keyof Config, value: Config[typeof key]) => void;

interface Context {
  config: Config;
  changeKey: ChangeKey;
}

const ConfigContext = createContext<Context>({} as Context);

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider: FC = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig);
  const router = useRouter();

  useEffect(() => {
    const userConfig = JSON.parse(localStorage.getItem('config') as string) ?? defaultConfig;
    setConfig(userConfig);
  }, []);

  useEffect(() => {
    localStorage.setItem('config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    setConfig({ ...config, city: supportedCountries[config.country].cities[0] as Pizza['city'] });
  }, [config.country]);

  useEffect(() => {
    if (config === defaultConfig) return;

    const date = new Date();
    const expireMs = 100 * 24 * 60 * 60 * 1000; // 100 days
    date.setTime(date.getTime() + expireMs);
    document.cookie = `NEXT_LOCALE=${config.language};path=/`;

    router.push(router.asPath, router.asPath, { locale: config.language });
  }, [config.language]);

  const changeKey = (key: keyof Config, value: Config[typeof key]) => setConfig({ ...config, [key]: value });

  return <ConfigContext.Provider value={{ config, changeKey }}>{children}</ConfigContext.Provider>;
};
