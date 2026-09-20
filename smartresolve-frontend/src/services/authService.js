import api from "./api";

const authService = {
  login(data) {
    return api.post("/api/auth/login", data);
  },

  register(data) {
    return api.post("/api/auth/register", data);
  },

  getCurrentUser() {
    return api.get("/api/auth/me");
  },

  googleLogin() {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google";
  },
};

export default authService;