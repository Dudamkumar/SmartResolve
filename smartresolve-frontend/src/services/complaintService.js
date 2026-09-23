import api from "./api";

const complaintService = {
    getAll() {
        return api.get("/api/complaints");
    },

    getMyComplaints() {
        return api.get("/api/complaints/my");
    },

    getAssignedComplaints() {
        return api.get("/api/complaints/assigned");
    },

    getById(id) {
        return api.get(`/api/complaints/${id}`);
    },

    create(data) {
        return api.post("/api/complaints", data);
    },

    assign(complaintId, assignedToId) {
        return api.put(
            `/api/complaints/${complaintId}/assign`,
            {
                assignedToId: Number(assignedToId)
            }
        );
    },

    updateStatus(complaintId, status) {
        return api.put(
            `/api/complaints/${complaintId}/status`,
            { status }
        );
    },

    getComments(complaintId) {
        return api.get(
            `/api/complaints/${complaintId}/comments`
        );
    },

    addComment(complaintId, comment) {
        return api.post(
            `/api/complaints/${complaintId}/comments`,
            { comment }
        );
    }
};

export default complaintService;