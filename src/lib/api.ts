const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
const ACCESS_KEY = 'yetustore_access';
const REFRESH_KEY = 'yetustore_refresh';

const PUBLIC_BACKEND_URL = API_URL.replace(/\/api\/v1\/?$/, '');
const PUBLIC_SITE_URL = import.meta.env.VITE_SITE_URL || '';

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY) || '';
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY) || '';

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const apiFetch = async (path, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return res.json();
};

export const refreshTokens = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');
  const res = await fetch(`${API_URL}/auth/client/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error('Refresh failed');
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data;
};

export const loginClient = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/client/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Login failed');
  }
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.user;
};

export const registerClient = async (payload) => {
  const res = await fetch(`${API_URL}/auth/client/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Register failed');
  }
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.user;
};

export const loginWithGoogle = async (idToken) => {
  const res = await fetch(`${API_URL}/auth/client/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Google login failed');
  }
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.user;
};

export const getClientMe = async () => {
  try {
    const data = await apiFetch('/auth/client/me');
    return data.user;
  } catch (err) {
    if (err.status === 401) {
      await refreshTokens();
      const data = await apiFetch('/auth/client/me');
      return data.user;
    }
    throw err;
  }
};

export const verifyEmail = async (code) => {
  const data = await apiFetch('/auth/client/verify-email', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
  return data.user;
};

export const verifyPhone = async (code) => {
  const data = await apiFetch('/auth/client/verify-phone', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
  return data.user;
};

export const resendEmail = async () => {
  await apiFetch('/auth/client/resend-email', { method: 'POST' });
};

export const resendPhone = async () => {
  await apiFetch('/auth/client/resend-phone', { method: 'POST' });
};

export const setPhone = async (phone) => {
  const data = await apiFetch('/auth/client/set-phone', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
  return data.user;
};

// update client profile information (name, email, etc.)
export const updateClientProfile = async (payload) => {
  // backend currently expects PATCH to /auth/client/me
  // adjust path/method if the API differs
  const data = await apiFetch('/auth/client/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return data.user;
};

export const requestPasswordReset = async (email, channel) => {
  const res = await fetch(`${API_URL}/auth/client/forgot-password/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, channel }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Erro ao enviar c�digo');
  }
  return res.json();
};

export const confirmPasswordReset = async (email, code, newPassword) => {
  const res = await fetch(`${API_URL}/auth/client/forgot-password/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPassword }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Erro ao atualizar senha');
  }
  return res.json();
};

export const getCategories = async () => {
  const data = await apiFetch('/categories');
  return data.categories;
};

export const getProducts = async (categoryId) => {
  const query = categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : '';
  const data = await apiFetch(`/products${query}`);
  return data.products;
};

export const getProductById = async (id) => {
  const data = await apiFetch(`/products/${id}`);
  return data.product;
};

export const getProductShareUrl = (productId) => {
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : (PUBLIC_SITE_URL || PUBLIC_BACKEND_URL);
  return `${origin.replace(/\/+$/, '')}/products/${encodeURIComponent(productId)}`;
};

export const createOrder = async (payload) => {
  const data = await apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.order;
};

export const getMyOrders = async () => {
  const data = await apiFetch('/orders/my');
  return data.orders;
};

export const createAffiliateLink = async (productId) => {
  const data = await apiFetch('/affiliates', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
  return data.link;
};

export const getMyAffiliateLinks = async () => {
  const data = await apiFetch('/affiliates/my');
  return data.links;
};

export const getAffiliateSummary = async () => {
  const data = await apiFetch('/affiliates/my/summary');
  return data;
};

export const getAffiliatePayouts = async () => {
  const data = await apiFetch('/affiliates/my/payouts');
  return data.payouts;
};

export const updateAffiliateBank = async (payload) => {
  const data = await apiFetch('/affiliates/my/bank', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return data.bank;
};

export const requestAffiliateWithdraw = async (amount) => {
  const data = await apiFetch('/affiliates/my/withdraw', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
  return data.payout;
};

export const trackAffiliateClick = async (code) => {
  await fetch(`${API_URL}/affiliates/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  }).catch(() => {});
};

export const resolveAffiliateCode = async (code) => {
  const data = await apiFetch(`/affiliates/code/${code}`);
  return data.link;
};

export const logoutClient = async () => {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    await fetch(`${API_URL}/auth/client/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }
  clearTokens();
};
