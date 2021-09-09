import { FC } from 'react';
import { QueryClient } from 'react-query';
import { ReactQueryProvider } from './ReactQueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { ConfigProvider } from './ConfigProvider';
import { ComparisonProvider } from './ComparisonProvider';

interface AppProvidersProps {
  queryClient?: QueryClient;
  queryState?: unknown;
}

export const AppProviders: FC<AppProvidersProps> = ({ children, queryClient, queryState }) => (
  <ConfigProvider>
    <ReactQueryProvider client={queryClient} state={queryState}>
      <ThemeProvider>
        <ComparisonProvider>{children}</ComparisonProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  </ConfigProvider>
);
