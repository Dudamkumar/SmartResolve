import api from "./api";

const userService = {
  getAll() {
    return api.get("/api/users");
  },

  getSupportUsers() {
    return api.get("/api/users/support");
  },

  updateRole(userId, role) {
    return api.put(
      `/api/users/${userId}/role`,
      {
        role,
      }
    );
  },

  createSupervisor(data) {
    return api.post(
      "/api/users/supervisor",
      data
    );
  },
};

export default userService;