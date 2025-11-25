import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMessages, sendMessage } from '../../api/messages';
import './styles.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      setError(null);
      const data = await getMessages();
      setMessages(data);
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('Error loading messages:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Ошибка загрузки сообщений');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadMessages();
  }, [navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim()) {
      return;
    }

    try {
      setSending(true);
      setError(null);
      await sendMessage(messageText);
      setMessageText('');
      await loadMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Ошибка отправки сообщения');
      }
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    const timeString = date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    if (isToday) {
      return timeString;
    }
    
    const dateStr = date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit' 
    });
    
    return `${dateStr} ${timeString}`;
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="chat-container" data-easytag="id3-react/src/components/Chat/index.jsx">
      <header className="chat-header">
        <h1 className="chat-title">Групповой чат</h1>
        <button className="profile-button" onClick={handleProfileClick}>
          Профиль
        </button>
      </header>

      <div className="messages-container">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Загрузка сообщений...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="empty-state">
            <p>Нет сообщений. Начните беседу!</p>
          </div>
        )}

        {!loading && messages.length > 0 && (
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className="message-card">
                <div className="message-header">
                  <span className="message-author">{message.author_login}</span>
                  <span className="message-time">{formatDate(message.created_at)}</span>
                </div>
                <div className="message-text">{message.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="message-input"
          placeholder="Введите сообщение..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={sending}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={sending || !messageText.trim()}
        >
          {sending ? 'Отправка...' : 'Отправить'}
        </button>
      </form>
    </div>
  );
};

export default Chat;
