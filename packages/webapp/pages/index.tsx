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
import { Api, IAnswer, IPoll } from '../Api';
import { Modal, Button } from 'react-bootstrap';

interface Props {
  handleClose: () => void;
  onYesClick: () => void;
  show: boolean;
  bodyContent: string;
  title: string;
}

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
  const [modalShow, setModalShow] = useState<boolean>(false);
  const [data, setData] = useState<any>(prefetchedData ? prefetchedData : null);
  const [poll, setPoll] = useState<IPoll>({
    question: data?.question ? data?.question : '',
    answerOptions: data?.answerOptions ? data?.answerOptions : [],
    answers: data?.answers ? data?.answers : [],
  });
  const handlePressPlus = () => {
    const changes = { ...poll };
    changes.answerOptions.push('');
    setPoll(changes);
  };

  const handleChangeInput = ({
    event,
    index,
  }: {
    event: React.ChangeEvent<HTMLInputElement>;
    index?: number;
  }) => {
    const changes = { ...poll };
    if (index || index === 0) {
      changes.answerOptions[index] = event.target.value;
    } else if (event.target.name) {
      changes[event.target.name] = event.target.value;
    }
    setPoll(changes);
  };

  const createPollMutation = useMutation((poll: IPoll) =>
    api.polls.createPoll(poll),
  );

  const handlePressStart = async () => {
    const res = await createPollMutation.mutateAsync(poll);
    router.push(
      {
        pathname: '',
        query: {
          pollId: res.data.id,
        },
      },
      '',
      { shallow: true },
    );
    setData(res.data);
    setModalShow(true);
  };

  const handleModalClose = () => {
    setModalShow(false);
  };

  const handleModalYes = () => {
    router.replace({
      pathname: '/poll',
      query: {
        pollId: data.id,
      },
    });
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
      <div
        className={classNames([styles.pageContent, styles.pageContentPadding])}
      >
        <div className={classNames([styles.poll])}>
          <div className={classNames([styles.pollTable])}>
            <div
              className={classNames([
                styles.pollTableCell,
                styles.pollTableCellGray,
              ])}
            >
              <div className={classNames([styles.pollTableCellHead])}>
                <p>Question:</p>
              </div>
              <div className={classNames([styles.pollTableCellBody])}>
                <input
                  type="text"
                  value={poll?.question}
                  name="question"
                  onChange={(event) => {
                    handleChangeInput({ event: event });
                  }}
                  className={classNames([styles.inputText])}
                />
              </div>
            </div>
            {poll?.answerOptions &&
              poll.answerOptions.map((item, index) => {
                return (
                  <div
                    className={classNames([styles.pollTableCell])}
                    key={index}
                  >
                    <div className={classNames([styles.pollTableCellHead])}>
                      Answer {index + 1}:
                    </div>
                    <div className={classNames([styles.pollTableCellBody])}>
                      <input
                        type="text"
                        onChange={(event) => {
                          handleChangeInput({ event: event, index: index });
                        }}
                        value={poll?.answerOptions[index]}
                        className={classNames([styles.inputText])}
                      />
                    </div>
                  </div>
                );
              })}
            <div>
              <div className={classNames([styles.pollTablePlus])}>
                <button
                  className={classNames([styles.btn, styles.btnPlus])}
                  onClick={handlePressPlus}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            className={classNames([styles.btn, styles.btnStart])}
            onClick={handlePressStart}
            disabled={
              poll.question && poll.answerOptions.length >= 2 ? false : true
            }
          >
            Start
          </button>
        </div>
      </div>
      <Modal
        show={modalShow}
        onHide={handleModalClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>New poll created</Modal.Header>
        <Modal.Body>Do you want to open?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalYes}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleModalClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
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
