import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const url = window.location.href;
const extensionID = url.substring(url.indexOf("="));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);