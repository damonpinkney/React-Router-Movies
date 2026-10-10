import React from 'react';
import ReactDOM from 'react-dom/client';
import './rive/setupRive';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { TeddyProvider } from './rive/TeddyContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

// You'll need to wrap <App /> for routing to work

root.render(
  <BrowserRouter>
    <TeddyProvider>
      <App />
    </TeddyProvider>
  </BrowserRouter>
);
