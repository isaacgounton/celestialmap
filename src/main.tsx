import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { createElement } from 'react';
import { setup } from 'goober';

// Setup goober
setup(createElement);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);