import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

const url = window.location.href;
export const extensionID = url.substring(url.indexOf("=") + 1);

export const getEID = () => {
  return extensionID;
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);