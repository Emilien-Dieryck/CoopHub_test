/**
 * Login Page Component
 * Secure authentication page with rate limiting and input validation
 * 
 * Security features:
 * - Input sanitization
 * - Rate limiting (max 5 attempts)
 * - XSS protection
 * - Secure storage handling
 * - CSRF protection ready
 */

import React, { useState } from 'react';
import { login } from '../../api/authApi';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/Input';
import { LoginCredentials } from '../../types';
import { setAuthToken, setUserData, clearAppStorage } from '../../utils/storage';
import { 
  checkLoginAttempts, 
  recordFailedAttempt, 
  clearLoginAttempts,
  formatLockoutTime,
  escapeHtml
} from '../../utils/security';
import { ERROR_MESSAGES } from '../../config/constants';
import logo from '../../assets/logo.png';
import background from '../../assets/background.png';
import wave from '../../assets/wave.png';
import '../../styles/LoginPage.scss';

/**
 * Login Page Component
 */
const LoginPage: React.FC = () => {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState<{ username: string; email: string } | null>(null);

  const { values, errors, isSubmitting, handleChange, handleSubmit, setErrors } = useForm<LoginCredentials>({
    identifier: '',
    password: '',
  });

  /**
   * Handles login form submission with security checks
   * - Validates rate limiting
   * - Sanitizes inputs
   * - Stores credentials securely
   * - Tracks failed attempts
   */
  const onSubmit = async (credentials: LoginCredentials) => {
    // Check rate limiting before attempting login
    const { isLocked, remainingTime } = checkLoginAttempts(credentials.identifier);
    
    if (isLocked && remainingTime) {
      setErrors({
        general: `${ERROR_MESSAGES.TOO_MANY_ATTEMPTS} Réessayez dans ${formatLockoutTime(remainingTime)}.`,
      });
      return;
    }

    try {
      const response = await login(credentials);
      
      if (response.success) {
        // Clear failed attempts on successful login
        clearLoginAttempts(credentials.identifier);
        
        // Store auth data securely
        if (response.token) {
          setAuthToken(response.token);
        }
        
        if (response.user) {
          setUserData(response.user);
          setUserInfo(response.user);
        }
        
        setLoginSuccess(true);
        
        // Log success (no sensitive data)
        console.log('✅ Connexion réussie');
      }
    } catch (error: any) {
      // Record failed attempt for rate limiting
      recordFailedAttempt(credentials.identifier);
      
      setErrors({
        general: error.message || ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
      
      // Log error without exposing sensitive data
      console.error('❌ Erreur de connexion');
    }
  };

  /**
   * Handles user logout
   * Clears all stored auth data and resets state
   */
  const handleLogout = () => {
    clearAppStorage();
    setLoginSuccess(false);
    setUserInfo(null);
  };

  // Écran de succès
  if (loginSuccess && userInfo) {
    return (
      <div className="login-page">
        <div className="login-left">
          <div className="login-left-content">
            <img src={logo} alt="CoopHub" className="login-left-logo" />
            <div className="login-left-text">
              <h1 className="login-left-title">Accès à votre espace Coophub</h1>
              <p className="login-left-description">
                Votre compte sociétaire est accessible sur la plateforme sécurisée de souscription demo.coophub.eu. 
                Vous accédez à l'ensemble de vos informations et préférences : coordonnées, transactions, certificats, etc.
              </p>
            </div>
          </div>
          <img src={background} alt="" className="login-left-illustration" />
          <img src={wave} alt="" className="login-left-wave" />
        </div>
        
        <div className="login-right">
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h1 className="success-title">Connexion réussie !</h1>
            <p className="success-message">
              Bienvenue <strong>{escapeHtml(userInfo.username)}</strong>
            </p>
            <div className="user-details">
              <p><strong>Email:</strong> {escapeHtml(userInfo.email)}</p>
            </div>
            <button 
              className="logout-button"
              onClick={handleLogout}
              aria-label="Se déconnecter"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Page de connexion
  return (
    <div className="login-page">
      {/* Section gauche - Fond bleu avec texte et illustration */}
      <div className="login-left">
        <div className="login-left-content">
          <img src={logo} alt="CoopHub" className="login-left-logo" />
          <div className="login-left-text">
            <h1 className="login-left-title">Accès à votre espace Coophub</h1>
            <p className="login-left-description">
              Votre compte sociétaire est accessible sur la plateforme sécurisée de souscription demo.coophub.eu. 
              Vous accédez à l'ensemble de vos informations et préférences : coordonnées, transactions, certificats, etc.
              Et pouvez mettre à jour vos informations personnelles.
            </p>
          </div>
        </div>
        <img src={background} alt="" className="login-left-illustration" />
        <img src={wave} alt="" className="login-left-wave" />
      </div>

      {/* Section droite - Formulaire */}
      <div className="login-right">
        <div className="login-header-top">
          <a href="#" className="login-contact">Contactez-nous</a>
          <button className="login-language">Français ▼</button>
        </div>
        <div className="login-form-container">
          <div className="login-header">
            <h1 className="login-title">Accès à votre espace</h1>
            <p className="login-subtitle">
              Pas encore de compte ? <a href="#">S'enregistrer</a>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form" noValidate>
            {errors.general && (
              <div className="alert alert-error" role="alert">
                <span className="alert-icon">⚠</span>
                <span>{errors.general}</span>
              </div>
            )}

            <Input
              id="identifier"
              name="identifier"
              type="text"
              label="Adresse email ou nom d'utilisateur"
              placeholder=""
              value={values.identifier}
              onChange={handleChange}
              error={errors.identifier}
              required
              autoComplete="username"
              disabled={isSubmitting}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Mot de passe"
              placeholder=""
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="current-password"
              disabled={isSubmitting}
            />

            <div className="form-footer">
              <a href="#" className="forgot-password">
                Vous avez oublié votre nom d'utilisateur ?
              </a>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  <span>Connexion...</span>
                </>
              ) : (
                'ME CONNECTER'
              )}
            </button>
            
          </form>
          
        </div>
        <p className='copyright'>Copyright @ CoopHub 2016-2024  |  <a href="#">Conditions d'utilisations</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
