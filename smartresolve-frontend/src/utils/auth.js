export function getToken() {
  return localStorage.getItem("token");
}

export function saveToken(token) {
  if (!token) {
    throw new Error("Token is required");
  }

  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

export function isAuthenticated() {
  return Boolean(getToken());
}