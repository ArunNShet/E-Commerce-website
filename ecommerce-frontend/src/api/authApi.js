import { apiRequest } from "./http";

export function registerUser(payload) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function loginUser(payload) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function resetPassword(payload) {
  return apiRequest("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getAdminCustomers(token) {
  return apiRequest("/api/admin/customers", {
    headers: { Authorization: `Bearer ${token}` }
  });
}
