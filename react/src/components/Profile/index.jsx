import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../api/auth';
import './styles.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setUserData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Ошибка загрузки профиля');
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleBackToChat = () => {
    navigate('/chat');
  };

  if (loading) {
    return (
      <div className="profile-container" data-easytag="id4-react/src/components/Profile/index.jsx">
        <div className="profile-card">
          <p className="loading-text">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container" data-easytag="id4-react/src/components/Profile/index.jsx">
        <div className="profile-card">
          <p className="error-text">{error}</p>
          <button onClick={handleLogout} className="logout-button">
            Выйти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container" data-easytag="id4-react/src/components/Profile/index.jsx">
      <div className="profile-card">
        <h1 className="profile-title">Профиль пользователя</h1>
        
        {userData && (
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">Логин:</span>
              <span className="info-value">{userData.login}</span>
            </div>
          </div>
        )}

        <div className="profile-actions">
          <button onClick={handleBackToChat} className="back-button">
            Вернуться в чат
          </button>
          <button onClick={handleLogout} className="logout-button">
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
