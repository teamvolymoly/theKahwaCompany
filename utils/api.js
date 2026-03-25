const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://tkc.volymoly.com";

const extractToken = (payload) =>
  payload?.token ||
  payload?.access_token ||
  payload?.data?.token ||
  payload?.data?.access_token;

export async function apiFetch(path, options = {}, { retry = true } = {}) {
  const normalizePath = (p) => {
    if (!p.startsWith("/")) return `/${p}`;
    return p;
  };

  const withApiPrefix = (p) => {
    const normalized = normalizePath(p);
    if (normalized.startsWith("/api/")) return normalized;
    return `/api${normalized}`;
  };

  const url = path.startsWith("http")
    ? path
    : `${BASE_URL}${withApiPrefix(path)}`;
  const isFormData = options.body instanceof FormData;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const headers = {
    ...(isFormData
      ? {}
      : options.body
        ? { "Content-Type": "application/json" }
        : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (err) {
    throw new Error(
      `Network request failed. Check NEXT_PUBLIC_API_BASE_URL and server availability. (${BASE_URL})`
    );
  }

  let json = null;
  try {
    json = await res.json();
  } catch {}

  if (res.status === 401 && retry) {
    const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (refreshRes.ok) {
      let refreshJson = null;
      try {
        refreshJson = await refreshRes.json();
      } catch {}
      const newToken = extractToken(refreshJson);
      if (newToken) {
        localStorage.setItem("auth_token", newToken);
      }
      return apiFetch(path, options, { retry: false });
    }

    throw new Error("TOKEN_EXPIRED");
  }

  if (!res.ok) {
    const message =
      json?.message || json?.detail || `Request failed (${res.status})`;
    throw new Error(message);
  }

  if (json && json.status === false) {
    throw new Error(json.message || "API Error");
  }

  return json?.data ?? json;
}
