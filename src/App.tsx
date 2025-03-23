import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Import our pages
import HomePage from './components/pages/HomePage';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add more routes here */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
