import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/App.tsx';
import { BrowserRouter } from 'react-router-dom';

import './app/App.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
