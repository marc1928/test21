import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './provider/theme-provider';
import {Toaster} from "@/components/ui/sonner.jsx";
import { AuthContextProvider } from './context/AuthContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider defaultTheme='light'>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
      <Toaster richColors/>
    </ThemeProvider>
  </BrowserRouter>
)
