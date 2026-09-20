import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import userService from "../../services/userService";
import { ALL_ROLES } from "../../constants/roles";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await userService.getAll();

      setUsers(response.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      setUpdatingId(userId);
      setError("");

      await userService.updateRole(userId, role);

      await loadUsers();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update user role."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="page-container">
        <div className="page-heading">
          <div>
            <p className="eyebrow">ADMIN</p>

            <h1>User Management</h1>

            <p>
              View users and manage their SmartResolve roles.
            </p>
          </div>
        </div>

        {loading && (
          <div className="loading-card">
            Loading users...
          </div>
        )}

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          users.length === 0 && (
            <div className="empty-card">
              <h3>No users found</h3>
              <p>
                There are currently no users in the system.
              </p>
            </div>
          )}

        {!loading && users.length > 0 && (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Change Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>

                    <td>
                      <strong>{user.name || "-"}</strong>
                    </td>

                    <td>{user.email || "-"}</td>

                    <td>
                      <span
                        className={`role-badge role-${String(
                          user.role || ""
                        ).toLowerCase()}`}
                      >
                        {user.role || "-"}
                      </span>
                    </td>

                    <td>
                      <select
                        value={user.role || ""}
                        disabled={updatingId === user.id}
                        onChange={(event) =>
                          handleRoleChange(
                            user.id,
                            event.target.value
                          )
                        }
                      >
                        {ALL_ROLES.map((role) => (
                          <option
                            key={role}
                            value={role}
                          >
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}