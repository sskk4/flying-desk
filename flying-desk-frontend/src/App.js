import React from 'react';
import './styles/global.css';
import './styles/Button.css';  
import Routes from './routes/Routes'; 
import { AuthProvider } from './services/AuthProvider';

const App = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;