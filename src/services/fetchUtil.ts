import { API_BASE_URL } from '../services/config';

const fetchUtil = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Not found');
    } else if (response.status >= 400 && response.status < 500) {
      throw new Error('Bad request');
    } else if (response.status >= 500) {
      throw new Error('Server error');
    } else {
      throw new Error('Network response was not ok');
    }
  }

  return response.json();
};

const fetchJSON = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetchUtil(endpoint, options);
  return response;
};

const postJSON = async (endpoint: string, data: unknown, options: RequestInit = {}) => {
  const response = await fetchUtil(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response
};

export { fetchJSON, postJSON };
