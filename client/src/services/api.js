const API_BASE = '/api';

class ApiClient {
  static async request(endpoint, options = {}) {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'omit', // or 'include' if using cookies
    };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, config);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
      }

      return data;
    } catch (err) {
      throw err;
    }
  }

  static get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  static post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  static put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  static delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export default ApiClient;
