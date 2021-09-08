import { useState } from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { AppProviders } from 'src/providers/AppProviders';
import { QueryClient } from 'react-query';
import 'antd/dist/antd.variable.min.css';

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <Head>
        <title>Chepi</title>

        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="apple-mobile-web-app-title" content="Chepi" />
        <meta name="application-name" content="Chepi" />
        <meta name="msapplication-TileColor" content="#00aba9" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <AppProviders queryClient={queryClient} queryState={pageProps.queryState}>
        <Component {...pageProps} />
      </AppProviders>
    </>
  );
};

export default App;
