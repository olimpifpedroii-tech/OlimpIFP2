// Cliente HTTP para a API Python (FastAPI)

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const TOKEN_KEY = "olimpifp2_token";


// ─────────────────────────────────────────────────────
// GERENCIAMENTO DO TOKEN
// ─────────────────────────────────────────────────────

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const isAuthenticated = () => Boolean(getToken());


// ─────────────────────────────────────────────────────
// REQUISIÇÃO BASE
// ─────────────────────────────────────────────────────

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
    }
    const message = data?.detail || `Erro ${response.status}`;
    throw new Error(message);
  }

  return data;
}


// ─────────────────────────────────────────────────────
// MÉTODOS PÚBLICOS
// ─────────────────────────────────────────────────────

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};


// ─────────────────────────────────────────────────────
// HELPERS DE AUTENTICAÇÃO
// ─────────────────────────────────────────────────────

export const auth = {
  login: async (email, password) => {
    const data = await api.post("/api/auth/login", { email, password });
    setToken(data.access_token);
    return data;
  },

  me: () => api.get("/api/auth/me"),

  logout: () => {
    clearToken();
  },
};


// ─────────────────────────────────────────────────────
// ENDPOINTS POR ENTIDADE
// ─────────────────────────────────────────────────────

export const noticias = {
  list: () => api.get("/api/noticias"),
  listPaginado: (skip = 0, limit = 9) =>
    api.get(`/api/noticias/paginado?skip=${skip}&limit=${limit}`),
  get: (id) => api.get(`/api/noticias/${id}`),
  create: (data) => api.post("/api/noticias", data),
  update: (id, data) => api.put(`/api/noticias/${id}`, data),
  remove: (id) => api.delete(`/api/noticias/${id}`),
};

export const medalhistas = {
  list: () => api.get("/api/medalhistas"),
  listPaginado: (skip = 0, limit = 9) =>
    api.get(`/api/medalhistas/paginado?skip=${skip}&limit=${limit}`),
  get: (id) => api.get(`/api/medalhistas/${id}`),
  create: (data) => api.post("/api/medalhistas", data),
  update: (id, data) => api.put(`/api/medalhistas/${id}`, data),
  remove: (id) => api.delete(`/api/medalhistas/${id}`),
};

export const olimpiadas = {
  list: () => api.get("/api/olimpiadas"),
  listPaginado: (skip = 0, limit = 9) =>
    api.get(`/api/olimpiadas/paginado?skip=${skip}&limit=${limit}`),
  get: (id) => api.get(`/api/olimpiadas/${id}`),
  create: (data) => api.post("/api/olimpiadas", data),
  update: (id, data) => api.put(`/api/olimpiadas/${id}`, data),
  remove: (id) => api.delete(`/api/olimpiadas/${id}`),
};

export const galeria = {
  list: () => api.get("/api/galeria"),
  listPaginado: (skip = 0, limit = 8) =>
    api.get(`/api/galeria/paginado?skip=${skip}&limit=${limit}`),
  get: (id) => api.get(`/api/galeria/${id}`),
  create: (data) => api.post("/api/galeria", data),
  update: (id, data) => api.put(`/api/galeria/${id}`, data),
  remove: (id) => api.delete(`/api/galeria/${id}`),
};

export const videos = {
  list: () => api.get("/api/videos"),
  listPaginado: (skip = 0, limit = 6) =>
    api.get(`/api/videos/paginado?skip=${skip}&limit=${limit}`),
  get: (id) => api.get(`/api/videos/${id}`),
  create: (data) => api.post("/api/videos", data),
  update: (id, data) => api.put(`/api/videos/${id}`, data),
  remove: (id) => api.delete(`/api/videos/${id}`),
};

export const eventos = {
  list: () => api.get("/api/eventos"),
  listPaginado: (skip = 0, limit = 9) =>
    api.get(`/api/eventos/paginado?skip=${skip}&limit=${limit}`),
  get: (id) => api.get(`/api/eventos/${id}`),
  create: (data) => api.post("/api/eventos", data),
  update: (id, data) => api.put(`/api/eventos/${id}`, data),
  remove: (id) => api.delete(`/api/eventos/${id}`),
};