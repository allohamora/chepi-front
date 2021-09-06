import { FC } from 'react';
import { QueryClient } from 'react-query';
import { ReactQueryProvider } from './ReactQueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { ConfigProvider } from './ConfigProvider';

interface AppProvidersProps {
  queryClient?: QueryClient;
  queryState?: unknown;
}

export const AppProviders: FC<AppProvidersProps> = ({ children, queryClient, queryState }) => (
  <ConfigProvider>
    <ReactQueryProvider client={queryClient} state={queryState}>
      <ThemeProvider>{children}</ThemeProvider>
    </ReactQueryProvider>
  </ConfigProvider>
);
