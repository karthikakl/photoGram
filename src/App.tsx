import * as React from 'react';
import { RouterProvider } from 'react-router-dom';
import {ApolloClient,InMemoryCache,ApolloProvider} from '@apollo/client';
import NewsFeed from './components/newsFeed'
import router from './routes';
import { UserAuthProvider } from './context/userAuthContext';
import ErrorBoundary from './components/errorBoundary';

interface IAppProps {
}

const App: React.FunctionComponent<IAppProps> = (props) => {
  return (
    <ErrorBoundary>
    <UserAuthProvider>
    <RouterProvider router={router}/>
    </UserAuthProvider>
    </ErrorBoundary>
  )
};

export default App;
