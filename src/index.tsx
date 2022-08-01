import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.scss';
import { App } from './App';
import { HashRouter } from 'react-router-dom';
import { GlobalProvider } from './store/global.context';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
  <GlobalProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </GlobalProvider>
  // </React.StrictMode>
);
// * StrictMode duplicates or runs all the React components twice in development
// to reproduce this, add some: 
// (S1) Add Recipe with ingredients.. 
// (S2) Observe Inventory without StrictMode (1 item are displayed) .. 
// (S3) Observe Inventory with StrictMode (2 items are diplsayed)