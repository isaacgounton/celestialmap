import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { createElement } from 'react';
import { setup } from 'goober';
import { LoadScriptNext } from '@react-google-maps/api';
import type { Libraries } from '@react-google-maps/api';

// Setup goober
setup(createElement);

// Libraries to load only once
const libraries: Libraries = ['places', 'geometry', 'drawing'];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoadScriptNext
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      version="weekly"
      loadingElement={
        <div className="w-full h-screen flex items-center justify-center">
          Loading Maps...
        </div>
      }
    >
      <App />
    </LoadScriptNext>
  </React.StrictMode>
);