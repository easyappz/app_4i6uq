import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../api/auth';
import './styles.css';

const Register = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await registerUser(login, password);
      localStorage.setItem('token', data.token);
      navigate('/chat');
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Ошибка регистрации. Попробуйте еще раз.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" data-easytag="id1-react/src/components/Register/index.jsx">
      <div className="auth-card">
        <h1 className="auth-title">Регистрация</h1>
        <p className="auth-subtitle">Создайте новый аккаунт</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login" className="form-label">Логин</label>
            <input
              type="text"
              id="login"
              className="form-input"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              placeholder="Введите логин"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите пароль"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-link-text">
            Уже есть аккаунт? <Link to="/login" className="auth-link">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;