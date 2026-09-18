class ApiService {
  constructor() {
    this.baseURL = (process.env.REACT_APP_API_BASE_URL || "https://api.oekfb.eu")
      .replace(/\/+$/, "");
  }

  getCookie(name) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  }

  async request(method, endpoint, body = null, headers = {}) {
    const normalizedEndpoint = String(endpoint).replace(/^\/+/, "");
    const token = this.getCookie("authToken");
    const url = `${this.baseURL}/${normalizedEndpoint}`;
    const options = {
      method,
      headers: {
        Accept: "application/json",
        ...(body !== null ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const text = await response.text();
    let payload = null;

    if (text) {
      try {
        payload = JSON.parse(text);
      } catch (_) {
        payload = text;
      }
    }

    if (!response.ok) {
      const message = typeof payload === "object" && payload?.reason
        ? payload.reason
        : typeof payload === "object" && payload?.message
          ? payload.message
          : `Request failed (${response.status})`;
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    return payload;
  }

  get(endpoint, headers = {}) {
    return this.request("GET", endpoint, null, headers);
  }

  post(endpoint, body, headers = {}) {
    return this.request("POST", endpoint, body, headers);
  }

  patch(endpoint, body = null, headers = {}) {
    return this.request("PATCH", endpoint, body, headers);
  }

  delete(endpoint, headers = {}) {
    return this.request("DELETE", endpoint, null, headers);
  }
}

export default ApiService;
