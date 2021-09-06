import { createContext, FC, useContext, useState } from 'react';
import { Pizza } from 'src/services/pizza/types';

export interface Config {
  language: Pizza['lang'];
  country: Pizza['country'];
  city: Pizza['city'];
}

const defaultConfig: Config = { language: 'en', country: 'ukraine', city: 'chernivtsi' };
type ChangeKey = (key: keyof Config, value: Config[typeof key]) => void;

interface Context {
  config: Config;
  changeKey: ChangeKey;
}

const ConfigContext = createContext<Context>({} as Context);

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider: FC = ({ children }) => {
  const [config, setConfig] = useState(defaultConfig);

  const changeKey = (key: keyof Config, value: Config[typeof key]) => setConfig({ ...config, [key]: value });

  return <ConfigContext.Provider value={{ config, changeKey }}>{children}</ConfigContext.Provider>;
};
