import api from "./api";

const dashboardService = {
  getStats() {
    return api.get("/api/dashboard");
  },
};

export default dashboardService;