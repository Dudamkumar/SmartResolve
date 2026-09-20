import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import ComplaintCard from "../../components/complaints/ComplaintCard";
import complaintService from "../../services/complaintService";

export default function ComplaintManagement() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await complaintService.getAll();

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
            <p className="eyebrow">ADMIN</p>

            <h1>Complaint Management</h1>

            <p>
              View and manage all complaints.
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
            </div>
          )}

        {!loading &&
          complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              showActions
              onUpdated={loadComplaints}
            />
          ))}

      </div>
    </AppLayout>
  );
}