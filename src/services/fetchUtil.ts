import { API_BASE_URL } from '../services/config';

class FetchError extends Error {
  constructor(message = 'Something went wrong, please try again later', status, details) {
    super(message);
    this.name = 'CustomFetchError';
    this.details = details;
    this.status = status;
  }
}

const handleInvalidFetchResponse = async (response: Response) => {
  if (response.status >= 500) {
    throw new FetchError('Something went wrong, please try again later', response.status);
  } else if (response.status === 404) {
    const data = await response.json();
    throw new FetchError(data.message, response.status);
  } else if (response.status >= 400 && response.status < 500) {
    const data = await response.json();
    throw new FetchError(data.message, response.status, data.details);
  }
}

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
    await handleInvalidFetchResponse(response)
  }

  return response.json();
};

const fetchJSON = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetchUtil(endpoint, {
    ...options,
    method: 'GET',
  });
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
