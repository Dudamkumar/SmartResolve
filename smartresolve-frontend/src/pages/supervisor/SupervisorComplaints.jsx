import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import ComplaintCard from "../../components/complaints/ComplaintCard";
import complaintService from "../../services/complaintService";
import Assignment from "../../components/complaints/Assignment";

export default function SupervisorComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await complaintService.getAll();

      setComplaints(response.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  return (
    <AppLayout>
      <div className="page-container">
        <div className="page-heading">
          <div>
            <p className="eyebrow">
              SUPERVISOR
            </p>

            <h1>All Complaints</h1>

            <p>
              Monitor complaints and manage assignments.
            </p>
          </div>
        </div>

        {loading && (
          <div className="loading-card">
            Loading complaints...
          </div>
        )}

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          complaints.length === 0 && (
            <div className="empty-card">
              <h3>No complaints found</h3>
              <p>
                There are currently no complaints.
              </p>
            </div>
          )}

       {!loading &&
  complaints.map((complaint) => (
    <div
      key={complaint.id}
      className="complaint-management-item"
    >
      <ComplaintCard
        complaint={complaint}
        showActions
        onUpdated={loadComplaints}
      />

      <Assignment
        complaintId={complaint.id}
        currentAssignedToId={
          complaint.assignedToId
        }
        onAssigned={loadComplaints}
      />
    </div>
  ))}
      </div>
    </AppLayout>
  );
}