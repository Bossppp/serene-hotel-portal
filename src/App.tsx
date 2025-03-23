import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import our pages
import HomePage from './components/pages/HomePage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Add more routes here */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
