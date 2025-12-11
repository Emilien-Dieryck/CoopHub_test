/**
 * App Component
 * Main application root component
 * 
 * This is the entry point for the React application.
 * Currently displays the LoginPage component.
 * 
 * Future: Add routing with React Router
 */

import React from 'react';
import LoginPage from './pages/LoginPage/LoginPage';
import './styles/global.scss';

/**
 * Root application component
 */
const App: React.FC = () => {
  return (
    <div className="app">
      <LoginPage />
    </div>
  );
};

export default App;
