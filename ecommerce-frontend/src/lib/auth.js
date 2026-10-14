const AUTH_TOKEN_KEY = "ecommerce_auth_token";
const AUTH_ROLE_KEY = "ecommerce_auth_role";
const AUTH_PHONE_KEY = "ecommerce_auth_phone";
const AUTH_NAME_KEY = "ecommerce_auth_name";

export function getAuthSession() {
  return {
    token: localStorage.getItem(AUTH_TOKEN_KEY) || "",
    role: localStorage.getItem(AUTH_ROLE_KEY) || "",
    phone: localStorage.getItem(AUTH_PHONE_KEY) || "",
    name: localStorage.getItem(AUTH_NAME_KEY) || ""
  };
}

export function setAuthSession(token, role, profile = {}) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_ROLE_KEY, role || "");
  localStorage.setItem(AUTH_PHONE_KEY, profile.phone || "");
  localStorage.setItem(AUTH_NAME_KEY, profile.name || "");
  return {
    token,
    role,
    phone: profile.phone || "",
    name: profile.name || ""
  };
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_ROLE_KEY);
  localStorage.removeItem(AUTH_PHONE_KEY);
  localStorage.removeItem(AUTH_NAME_KEY);
}
