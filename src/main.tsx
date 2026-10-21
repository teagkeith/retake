// Fonts
import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/500.css'; // Medium
import '@fontsource/inter/700.css'; // Bold

// Redux
import { Provider } from 'react-redux';
import { store } from './app/store';

import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import './styles/variables.css';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
