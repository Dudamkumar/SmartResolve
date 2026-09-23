import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import ComplaintCard from "../../components/complaints/ComplaintCard";
import Assignment from "../../components/complaints/Assignment";

import complaintService from "../../services/complaintService";
import userService from "../../services/userService";

export default function SupervisorComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [supportUsers, setSupportUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadComplaints = async (updatedComplaint) => {
        try {
            setLoading(true);
            setError("");

            const [
                complaintsResponse,
                supportUsersResponse
            ] = await Promise.all([
                complaintService.getAll(),
                userService.getSupportUsers()
            ]);

            const loadedComplaints =
                complaintsResponse.data || [];

            if (updatedComplaint?.id) {
                const existingComplaint = complaints.find(
                    (complaint) =>
                        complaint.id === updatedComplaint.id
                );

                const mergedComplaint = {
                    ...existingComplaint,
                    ...updatedComplaint,
                };

                setComplaints(
                    loadedComplaints.some(
                        (complaint) =>
                            complaint.id === updatedComplaint.id
                    )
                        ? loadedComplaints.map((complaint) =>
                            complaint.id === updatedComplaint.id
                                ? {
                                    ...complaint,
                                    ...updatedComplaint,
                                }
                                : complaint
                        )
                        : [
                            mergedComplaint,
                            ...loadedComplaints,
                        ]
                );
            } else {
                setComplaints(loadedComplaints);
            }

            setSupportUsers(
                supportUsersResponse.data || []
            );

        } catch (err) {
            console.error(
                "SUPERVISOR COMPLAINT LOAD ERROR:",
                err
            );

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

                {/* =========================
                    PAGE HEADING
                ========================== */}
                <div className="page-heading">

                    <div>

                        <p className="eyebrow">
                            SUPERVISOR
                        </p>

                        <h1>
                            All Complaints
                        </h1>

                        <p>
                            Monitor complaints and
                            manage assignments.
                        </p>

                    </div>

                </div>


                {/* =========================
                    LOADING
                ========================== */}
                {loading && (
                    <div className="loading-card">
                        Loading complaints...
                    </div>
                )}


                {/* =========================
                    ERROR
                ========================== */}
                {error && (
                    <div className="alert error">
                        {error}
                    </div>
                )}


                {/* =========================
                    EMPTY
                ========================== */}
                {!loading &&
                    !error &&
                    complaints.length === 0 && (
                        <div className="empty-card">

                            <h3>
                                No complaints found
                            </h3>

                            <p>
                                There are currently
                                no complaints.
                            </p>

                        </div>
                    )
                }


                {/* =========================
                    COMPLAINT LIST
                ========================== */}
                {!loading &&
                    !error &&
                    complaints
                        .filter((complaint) => complaint.status !== "CLOSED")
                        .map((complaint) => (

                        <div
                            key={complaint.id}
                            className="complaint-management-item"
                        >

                            {/* Complaint information */}
                            <ComplaintCard
                                complaint={complaint}
                                showActions
                                onUpdated={loadComplaints}
                            />


                            {/* Assignment */}
                            <Assignment
                                complaint={complaint}
                                supportUsers={supportUsers}
                                refresh={loadComplaints}
                            />

                        </div>

                    ))
                }

                {!loading &&
                    !error &&
                    complaints.some(
                        (complaint) => complaint.status === "CLOSED"
                    ) && (
                        <section className="closed-complaints-section">
                            <div className="section-heading">
                                <div>
                                    <h2>Closed Complaints</h2>
                                    <p>Completed complaints remain available for review.</p>
                                </div>
                            </div>

                            {complaints
                                .filter((complaint) => complaint.status === "CLOSED")
                                .map((complaint) => (
                                    <div
                                        key={complaint.id}
                                        className="complaint-management-item"
                                    >
                                        <ComplaintCard
                                            complaint={complaint}
                                            showActions={false}
                                            onUpdated={loadComplaints}
                                        />
                                    </div>
                                ))}
                        </section>
                    )}

            </div>

        </AppLayout>
    );
}