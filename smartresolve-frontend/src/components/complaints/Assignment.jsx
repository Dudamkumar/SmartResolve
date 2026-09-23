import { useEffect, useState } from "react";
import complaintService from "../../services/complaintService";

export default function Assignment({
    complaint,
    supportUsers = [],
    refresh
}) {
    const [assigning, setAssigning] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(
        complaint?.assignedToId
            ? String(complaint.assignedToId)
            : ""
    );
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        setSelectedUserId(
            complaint?.assignedToId
                ? String(complaint.assignedToId)
                : ""
        );
    }, [complaint?.assignedToId]);

    const handleAssign = async (event) => {
        const value = event.target.value;

        if (!value) {
            return;
        }

        if (!complaint?.id) {
            setError("Complaint information is missing.");
            return;
        }

        const assignedToId = Number(value);

        if (!assignedToId || Number.isNaN(assignedToId)) {
            setError("Invalid support user.");
            return;
        }

        setSelectedUserId(value);
        setAssigning(true);
        setError("");
        setSuccess("");

        try {
            await complaintService.assign(
                complaint.id,
                assignedToId
            );

            setSuccess("Complaint assigned successfully.");

            if (refresh) {
                await refresh();
            }

        } catch (error) {
            console.error(
                "ASSIGN COMPLAINT ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to assign complaint."
            );
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="assignment-box">

            <div className="assignment-content">

                <strong>
                    Assign support staff
                </strong>

                <p className="muted">
                    Select a SUPPORT employee
                    for this complaint.
                </p>

            </div>

            <select
                value={selectedUserId}
                disabled={assigning}
                onChange={handleAssign}
            >

                <option value="">
                    {assigning
                        ? "Assigning..."
                        : complaint?.assignedToName
                            ? "Change support user"
                            : "Select support user"
                    }
                </option>

                {supportUsers.map((user) => (
                    <option
                        key={user.id}
                        value={user.id}
                    >
                        {user.name} · {user.email}
                    </option>
                ))}

            </select>

            {error && (
                <div className="assignment-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="assignment-success">
                    {success}
                </div>
            )}

        </div>
    );
}