import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import notificationService from "../../services/notificationService";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await notificationService.getAll();

      setNotifications(response.data || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayout>
      <div className="page-container">
        <div className="page-heading">
          <div>
            <p className="eyebrow">SMARTRESOLVE</p>
            <h1>Notifications</h1>
            <p>
              Stay updated about your complaints.
            </p>
          </div>
        </div>

        {loading && (
          <div className="loading-card">
            Loading notifications...
          </div>
        )}

        {error && (
          <div className="alert error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          notifications.length === 0 && (
            <div className="empty-card">
              <h3>No notifications</h3>
              <p>
                You don't have any notifications yet.
              </p>
            </div>
          )}

        {!loading &&
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-card ${
                notification.read ? "is-read" : "is-unread"
              }`}
            >
              <div>
                <h3>
                  {notification.title || "Notification"}
                </h3>

                <p>
                  {notification.message ||
                    notification.content ||
                    "You have a new notification."}
                </p>

                {notification.createdAt && (
                  <small>
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </small>
                )}
              </div>

              {!notification.read && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    handleMarkAsRead(notification.id)
                  }
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
      </div>
    </AppLayout>
  );
}