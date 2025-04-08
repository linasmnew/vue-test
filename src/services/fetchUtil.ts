import { API_BASE_URL } from '../services/config';

const fetchJSON = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  return response.json();
};

export { fetchJSON };
