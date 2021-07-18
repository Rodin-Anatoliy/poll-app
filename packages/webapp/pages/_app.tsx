// pages/_app.js
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import React from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ApiProvider } from '../hooks/useApi';

export default function MyApp({ Component, pageProps }) {
  const queryClientRef = React.useRef<QueryClient>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  return (
    <ApiProvider>
      <QueryClientProvider client={queryClientRef.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />{' '}
        </Hydrate>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ApiProvider>
  );
}
