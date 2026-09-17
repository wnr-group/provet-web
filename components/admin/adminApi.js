// Thin fetch wrapper for the admin dashboard's client components. Auth rides
// along automatically via the httpOnly session cookie (same-origin, no
// manual Authorization header needed) - see lib/auth.js / proxy.js.
async function apiFetch(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw Object.assign(new Error(data?.error || "Request failed"), { data, status: res.status });
  }
  return data;
}

function withQuery(path, params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

// ---- Auth ----
export const login = (email, password) =>
  apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
export const logout = () => apiFetch("/auth/logout", { method: "POST" });
export const getMe = () => apiFetch("/auth/me");

// ---- Admin: Products ----
export const adminGetProducts = (params = {}) => apiFetch(withQuery("/admin/products", params));
export const adminGetProduct = (id) => apiFetch(`/admin/products/${id}`);
export const adminCreateProduct = (payload) =>
  apiFetch("/admin/products", { method: "POST", body: JSON.stringify(payload) });
export const adminUpdateProduct = (id, payload) =>
  apiFetch(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const adminDeleteProduct = (id) => apiFetch(`/admin/products/${id}`, { method: "DELETE" });

// ---- Admin: Categories ----
export const adminGetCategories = () => apiFetch("/admin/categories");
export const adminCreateCategory = (payload) =>
  apiFetch("/admin/categories", { method: "POST", body: JSON.stringify(payload) });
export const adminUpdateCategory = (id, payload) =>
  apiFetch(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const adminDeleteCategory = (id) => apiFetch(`/admin/categories/${id}`, { method: "DELETE" });

// ---- Admin: Banners ----
export const adminGetBanners = () => apiFetch("/admin/banners");
export const adminCreateBanner = (payload) =>
  apiFetch("/admin/banners", { method: "POST", body: JSON.stringify(payload) });
export const adminUpdateBanner = (id, payload) =>
  apiFetch(`/admin/banners/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const adminDeleteBanner = (id) => apiFetch(`/admin/banners/${id}`, { method: "DELETE" });

// ---- Admin: Content ----
export const adminGetContent = (page) => apiFetch(`/admin/content/${page}`);
export const adminUpdateContent = (page, sections) =>
  apiFetch(`/admin/content/${page}`, { method: "PUT", body: JSON.stringify({ sections }) });

// ---- Admin: Enquiries ----
export const adminGetEnquiries = (params = {}) => apiFetch(withQuery("/admin/enquiries", params));
export const adminUpdateEnquiryStatus = (id, status) =>
  apiFetch(`/admin/enquiries/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });

// ---- Admin: Upload ----
export const adminUploadFile = async (file) => {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw Object.assign(new Error(data?.error || "Upload failed"), { data, status: res.status });
  return data;
};
