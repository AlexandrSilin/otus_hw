import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ContragentsProvider } from './context/ContragentsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ContragentsProvider>
      <App />
    </ContragentsProvider>
  </React.StrictMode>,
);
