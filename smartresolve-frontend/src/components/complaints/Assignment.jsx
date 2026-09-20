import { useEffect, useState } from "react";

import userService from "../../services/userService";
import complaintService from "../../services/complaintService";

export default function Assignment({
  complaint,
  onAssigned,
}) {
  const [supportUsers, setSupportUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(
    complaint?.assignedToId
      ? String(complaint.assignedToId)
      : ""
  );

  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] =
    useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadSupportUsers = async () => {
      try {
        setLoadingUsers(true);
        setError("");

        const response =
          await userService.getSupportUsers();

        setSupportUsers(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (err) {
        console.error(
          "SUPPORT USERS ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load support users."
        );
      } finally {
        setLoadingUsers(false);
      }
    };

    loadSupportUsers();
  }, []);

  const handleAssign = async (event) => {
    const value = event.target.value;

    if (!value) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await complaintService.assign(
        complaint.id,
        Number(value)
      );

      setSelectedUser(value);

      setSuccess(
        "Complaint assigned successfully."
      );

      if (onAssigned) {
        await onAssigned();
      }
    } catch (err) {
      console.error(
        "ASSIGN COMPLAINT ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to assign complaint."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assignment-box">

      <div className="assignment-content">

        <div>
          <strong>
            Assign support staff
          </strong>

          <p className="muted">
            Assign this complaint to a
            SUPPORT employee.
          </p>
        </div>

        <select
          value={selectedUser}
          onChange={handleAssign}
          disabled={
            loading ||
            loadingUsers ||
            supportUsers.length === 0
          }
        >
          <option value="">
            {loadingUsers
              ? "Loading support users..."
              : supportUsers.length === 0
                ? "No support users available"
                : "Select support user"}
          </option>

          {supportUsers.map((supportUser) => (
            <option
              key={supportUser.id}
              value={supportUser.id}
            >
              {supportUser.name}
              {" · "}
              {supportUser.email}
            </option>
          ))}
        </select>

      </div>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {success && (
        <div className="alert success">
          {success}
        </div>
      )}

    </div>
  );
}