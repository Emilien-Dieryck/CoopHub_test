// ========================================
// App.tsx - Point d'entrée de l'application
// ========================================
import React from 'react';
import LoginPage from './pages/LoginPage/LoginPage';
import './styles/global.scss';

const App: React.FC = () => {
  return (
    <div className="app">
      <LoginPage />
    </div>
  );
};

export default App;
