import Head from 'next/head';
import styles from './index.module.css';
import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { v4 as uuidv4 } from 'uuid';

import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query';
import { dehydrate } from 'react-query/hydration';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { Api, IAnswer, IPoll } from '../Api';

export default function poll() {
  const api = useApi();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pollId } = router.query as any;

  const pollQuery = useQuery<IPoll>(['cachedPoll', pollId]);
  const [currentAnswer, setCurrentAnswer] = useState<IAnswer>(null);
  const [answers, setAnswers] = useState<IAnswer[]>(
    pollQuery.data?.answers ? pollQuery.data?.answers : [],
  );
  const [userId, setUserId] = useState<string>(
    typeof window !== 'undefined' && localStorage.getItem('userId'),
  );
  const handleChangeInput = ({
    event,
    index,
  }: {
    event: React.ChangeEvent<HTMLInputElement>;
    index?: number;
  }) => {
    const changes = { ...currentAnswer };
    if (index || index === 0) {
      changes.selectedOption = index;
    } else if (event.target.name) {
      changes[event.target.name] = event.target.value;
    }
    setCurrentAnswer(changes);
  };

  const updatePollMutation = useMutation(
    ({
      pollId,
      userName,
      selectedOption,
      userId,
    }: {
      pollId: string;
      userName: string;
      selectedOption: number;
      userId: string;
    }) => {
      return api.polls.updatePoll({ pollId, userName, selectedOption, userId });
    },
  );
  const handleClickSubmit = async () => {
    const uuid = uuidv4();
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', uuid);
      setUserId(uuid);
    }

    const res = await updatePollMutation.mutateAsync({
      pollId: pollId,
      userName: currentAnswer?.userName,
      selectedOption: currentAnswer?.selectedOption,
      userId: userId,
    });
    setAnswers([
      ...res.data.answers,
      {
        userName: currentAnswer?.userName,
        selectedOption: currentAnswer?.selectedOption,
        userId: userId,
      },
    ]);
  };
  return (
    <>
      <Head>
        <title>Polls create app</title>
        <meta name="description" content="Polls create app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav
        className={classNames([
          'navbar',
          'navbar-light',
          'bg-light',
          styles.customNavbar,
        ])}
      >
        <img className="navbar-brand mb-0 pl-20" src="/page-logo.png" />
        <span className="navbar-brand mb-0 h1">
          Poll website task: HTML example 2
        </span>
      </nav>
      <div className={classNames([styles.pageImageContainer])}>
        <img className={classNames([styles.pageImage])} src="/header.jpg" />
        <div className={classNames([styles.pageTask])}>
          <h1 className={classNames([styles.pageTaskTitle])}>
            Poll website task: HTML example 2
          </h1>
        </div>
      </div>
      <div className={classNames([styles.poll])}>
        {pollQuery.isLoading && <div>Loading...</div>}
        {pollQuery.data ? (
          <div>
            <div
              className={classNames([
                styles.pageContent,
                styles.pageContentPadding,
              ])}
            >
              <>
                <h1>{pollQuery.data.question}</h1>
                <div className="ex2-question">
                  <div className="ex2-question__label">Your name:</div>
                  <div className="ex2-question__input">
                    <input
                      type="text"
                      name="userName"
                      className="input-text"
                      onChange={(event) => handleChangeInput({ event: event })}
                    />
                  </div>
                  <div className="ex2-question__answer">
                    {pollQuery.data.answerOptions.map((item, index) => {
                      return (
                        <label key={index}>
                          <input
                            type="radio"
                            name="do-we-go"
                            value={item}
                            onChange={(event) =>
                              handleChangeInput({ event: event, index: index })
                            }
                          />
                          {item}
                        </label>
                      );
                    })}
                  </div>
                  <div className="ex2-question__submit">
                    <input
                      type="submit"
                      className="btn"
                      disabled={
                        currentAnswer?.userName &&
                        (currentAnswer?.selectedOption ||
                          currentAnswer?.selectedOption === 0) &&
                        !answers.find((elem) => elem.userId === userId)
                          ? false
                          : true
                      }
                      onClick={handleClickSubmit}
                      value={
                        answers.find((elem) => elem.userId === userId)
                          ? 'You already voted'
                          : 'Submit'
                      }
                    />
                  </div>
                </div>
                {answers.find((elem) => elem.userId === userId) && (
                  <>
                    <h1>Results</h1>
                    <table className="ex2-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          {pollQuery.data.answerOptions.map((item, index) => {
                            return <th key={index}>{item}</th>;
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {answers.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item.userName}</td>
                              {pollQuery.data.answerOptions.map(
                                (answerOptions, answerOptionsIndex) => {
                                  return (
                                    <td key={answerOptionsIndex}>
                                      {item.selectedOption ===
                                        answerOptionsIndex && 'x'}
                                    </td>
                                  );
                                },
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                )}
              </>
            </div>
          </div>
        ) : (
          pollQuery.isError && <div>Poll does not exist</div>
        )}
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
  await queryClient.prefetchQuery(['cachedPoll', pollId], async () => {
    const res = await api.polls.getPoll({
      pollId,
    });
    return res.data;
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
