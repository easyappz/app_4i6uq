import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api/auth';
import './styles.css';

const Login = () => {
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
      const data = await loginUser(login, password);
      localStorage.setItem('token', data.token);
      navigate('/chat');
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Ошибка входа. Проверьте логин и пароль.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" data-easytag="id2-react/src/components/Login/index.jsx">
      <div className="auth-card">
        <h1 className="auth-title">Вход</h1>
        <p className="auth-subtitle">Войдите в свой аккаунт</p>
        
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
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-link-text">
            Нет аккаунта? <Link to="/register" className="auth-link">Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;