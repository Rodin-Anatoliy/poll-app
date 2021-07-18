import Head from 'next/head';
import styles from './index.module.css';
import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '../hooks/useApi';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { dehydrate } from 'react-query/hydration';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import {Api} from '../Api';


export default function Index() {
  const api = useApi();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pollId } = router.query as any;

  return (
    <>
      <Head>
        <title>Polls create app</title>
        <meta name="description" content="Polls create app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">
          Polls create app
        </span>
      </nav>
    </>
  );
}
