
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

const App = ({ Component, pageProps }: { Component: React.ComponentType<any>; pageProps: any }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
