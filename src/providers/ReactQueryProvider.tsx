import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';

interface ReactQueryProviderProps {
  client?: QueryClient;
  state?: unknown;
}

export const ReactQueryProvider: FC<ReactQueryProviderProps> = ({ client = new QueryClient(), state, children }) => (
  <QueryClientProvider client={client}>
    <Hydrate state={state}>{children}</Hydrate>
  </QueryClientProvider>
);
