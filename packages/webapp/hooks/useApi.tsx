import { Api } from '../Api';
import React, { useRef } from 'react';

const ApiContext = React.createContext<Api<string>>(null);
export const ApiProvider = ({
  children,
}): React.ReactElement<{ children: React.ReactElement }> => {
  const apiRef = useRef<Api<string>>();
  if (!apiRef.current) {
    apiRef.current = new Api<string>({
      baseUrl: '/api',
    });
  }
  return (
    <ApiContext.Provider value={apiRef.current}>{children}</ApiContext.Provider>
  );
};

export function useApi() {
  return React.useContext(ApiContext);
}
