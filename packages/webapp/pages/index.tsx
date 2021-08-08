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
import { Api } from '../Api';
import { Button } from 'antd';


export default function Index() {
  const api = useApi();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pollId } = router.query as any;

  const prefetchedState = queryClient.getQueryState<any>([
    'cachedPoll',
    pollId,
  ]);
  const prefetchedData = prefetchedState && prefetchedState.data;
  const [data, setData] = useState<any>(prefetchedData ? prefetchedData : null);
  interface Question {
    questionText: string;
    answers: string[];
  }
  const [question, setQuestion] = useState<Question>({
    questionText: '',
    answers: [],
  });

  const handlePressPlus = () => {
    const changes = { ...question };
    changes.answers.push('');
    setQuestion(changes);
  };

  const handleChangeInput = ({
    event,
    index,
  }: {
      event: React.ChangeEvent<HTMLInputElement>;
      index?: number;
    }) => {
      const changes = { ...question };
      if (index || index === 0) {
        changes.answers[index] = event.target.value;
      } else if (event.target.name) {
        changes[event.target.name] = event.target.value; 
      }
    setQuestion(changes);
  }

  const createPollMutation = useMutation((question: Question) =>
    api.polls.createPoll(question),
  );

  const handlePressStart = async (question: Question) => {
    const res = await createPollMutation.mutateAsync(question);
    router.push(
      {
        pathname: '',
        query: {
          pollId: res.data.pollId,
        },
      },
      '',
      { shallow: true },
    );
    setData(res.data);

  };

  return (
    <>
      <Head>
        <title>Polls create app</title>
        <meta name="description" content="Polls create app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className={classNames(['navbar', 'navbar-light', 'bg-light', styles.customNavbar])}>
        <img className="navbar-brand mb-0 pl-20" src="/page-logo.png"/>
        <span className="navbar-brand mb-0 h1">
          Poll website task: HTML example 2
        </span>
      </nav>
      <div className={classNames([styles.pageImageContainer])}>
        <img className={classNames([styles.pageImage])} src="/header.jpg"/>
        <div className={classNames([styles.pageTask])}>
          <h1 className={classNames([styles.pageTaskTitle])}>
            Poll website task: HTML example 2
          </h1>
        </div>
      </div>
      <div className={classNames([styles.pageContent, styles.pageContentPadding])}>
        <div className={classNames([styles.poll])}>
            <div className={classNames([styles.pollTable])}>
                <div className={classNames([styles.pollTableCell, styles.pollTableCellGray])}>
                    <div className={classNames([styles.pollTableCellHead])}><p>Question:</p></div>
                    <div className={classNames([styles.pollTableCellBody])}>
                      <input type="text" value={question?.questionText} name="questionText" onChange={(event) => { handleChangeInput({event: event}) }} className={classNames([styles.inputText])} />
                    </div>
            </div>
            {
              question?.answers && (question.answers.map((item, index) => {
                return (
                  <div className={classNames([styles.pollTableCell])}  key={index}>
                    <div className={classNames([styles.pollTableCellHead])}>Answer {index + 1}:</div>
                    <div className={classNames([styles.pollTableCellBody])}>
                      <input type="text" onChange={(event) => { handleChangeInput({event: event, index: index})}}  value={question?.answers[index]} className={classNames([styles.inputText])}/>
                    </div>
                </div>
                )
              }))
            }
                <div>
                    <div className={classNames([styles.pollTablePlus])} >
                      <button className={classNames([styles.btn, styles.btnPlus])} onClick={ handlePressPlus }>
                        +
                      </button>
                    </div>
                </div>
            </div>

            <button className={classNames([styles.btn, styles.btnStart ])} onClick={() => handlePressStart(question)}>
                Start
            </button>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps({ query: { pollId } }) {
  const queryClient = new QueryClient();
  const apiUrl =
    typeof window === 'undefined' && process.env.NODE_ENV === 'production'
      ? 'http://poll-app-api:3002'
      : 'http://localhost:3002';
  const api = new Api<string>({
    baseUrl: apiUrl,
  });
  await queryClient.prefetchQuery(
    ['cachedPoll', pollId],
    async () => {
      const res = await api.polls.getPoll({
        pollId,
      });
      return res.data;
    },
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}