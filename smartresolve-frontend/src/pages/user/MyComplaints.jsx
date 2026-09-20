import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import ComplaintCard from "../../components/complaints/ComplaintCard";
import complaintService from "../../services/complaintService";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await complaintService.getMyComplaints();

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

        <section className="dashboard-hero">
          <div>
            <p className="eyebrow">
              USER
            </p>

            <h1>
              My Complaints
            </h1>

            <p>
              Complete history of complaints submitted
              by your account.
            </p>
          </div>

          <strong>
            {complaints.length} complaint
            {complaints.length !== 1 ? "s" : ""}
          </strong>

        </section>

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
              <h3>
                No complaints found
              </h3>

              <p>
                You have not submitted any complaints.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              onUpdated={loadComplaints}
            />
          ))}

      </div>
    </AppLayout>
  );
}