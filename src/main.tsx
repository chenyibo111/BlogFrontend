import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// #14: 自托管字体（替代 Google Fonts CDN，提升安全性）
// @ts-ignore - CSS modules without types
import '@fontsource/noto-serif/400.css';
// @ts-ignore
import '@fontsource/noto-serif/400-italic.css';
// @ts-ignore
import '@fontsource/noto-serif/700.css';
// @ts-ignore
import '@fontsource/noto-serif/900.css';
// @ts-ignore
import '@fontsource-variable/inter';
// @ts-ignore
import '@fontsource-variable/material-symbols-outlined';

import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
