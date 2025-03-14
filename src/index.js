import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles.css';
import { initializeLocalStorage } from './data/localStorageUtils';

// Inicializar o localStorage antes de renderizar a aplicação
initializeLocalStorage();

const root = createRoot(document.getElementById('root'));
root.render(<App />);
