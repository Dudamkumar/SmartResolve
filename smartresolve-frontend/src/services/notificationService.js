import api from "./api";

const notificationService = {
  getAll() {
    return api.get("/api/notifications");
  },

  markAsRead(id) {
    return api.put(
      `/api/notifications/${id}/read`
    );
  },
};

export default notificationService;