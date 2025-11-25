import instance from './axios';

/**
 * Register a new user
 * @param {string} login - User login
 * @param {string} password - User password
 * @returns {Promise} Response with user data and token
 */
export const registerUser = async (login, password) => {
  const response = await instance.post('/api/register/', {
    login,
    password
  });
  return response.data;
};

/**
 * Login user
 * @param {string} login - User login
 * @param {string} password - User password
 * @returns {Promise} Response with user data and token
 */
export const loginUser = async (login, password) => {
  const response = await instance.post('/api/login/', {
    login,
    password
  });
  return response.data;
};

/**
 * Get user profile (requires authentication)
 * @returns {Promise} Response with user profile data
 */
export const getProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await instance.get('/api/profile/', {
    headers: {
      'Authorization': `Token ${token}`
    }
  });
  return response.data;
};
