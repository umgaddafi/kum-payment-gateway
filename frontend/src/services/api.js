const API_BASE = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed.');
    error.status = response.status;
    error.errors = data.errors || {};
    throw error;
  }

  return data;
}

export function loginRequest(payload) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getUser(token) {
  return request('/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getItems(token) {
  return request('/items', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
