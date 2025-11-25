import instance from './axios';

/**
 * Get all messages (requires authentication)
 * @returns {Promise} Response with array of messages
 */
export const getMessages = async () => {
  const token = localStorage.getItem('token');
  const response = await instance.get('/api/messages/', {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
  return response.data;
};

/**
 * Send a new message (requires authentication)
 * @param {string} text - Message text
 * @returns {Promise} Response with created message data
 */
export const sendMessage = async (text) => {
  const token = localStorage.getItem('token');
  const response = await instance.post('/api/messages/', 
    { text },
    {
      headers: {
        'Authorization': `Token ${token}`
      }
    }
  );
  return response.data;
};
