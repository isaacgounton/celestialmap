import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { createElement } from 'react';
import { setup } from 'goober';
import { LoadScript } from '@react-google-maps/api';

// Setup goober
setup(createElement);

// Libraries to load only once
const libraries: ("places" | "geometry")[] = ["places", "geometry"];

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <App />
    </LoadScript>
  </React.StrictMode>
);