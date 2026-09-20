import { useState } from "react";

import complaintService from "../../services/complaintService";

export default function Comments({
  complaintId,
}) {
  const [open, setOpen] =
    useState(false);

  const [comments, setComments] =
    useState([]);

  const [value, setValue] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const loadComments = async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await complaintService.getComments(
          complaintId
        );

      setComments(response.data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Could not load comments."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleComments = async () => {
    const nextState = !open;

    setOpen(nextState);

    if (
      nextState &&
      comments.length === 0
    ) {
      await loadComments();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmed =
      value.trim();

    if (!trimmed) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      await complaintService.addComment(
        complaintId,
        trimmed
      );

      setValue("");

      await loadComments();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Could not add comment."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="comments-section">
      <button
        type="button"
        className="text-button"
        onClick={toggleComments}
      >
        {open
          ? "Hide comments"
          : "View comments"}
      </button>

      {open && (
        <div className="comments-content">
          {loading && (
            <p className="muted">
              Loading comments...
            </p>
          )}

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          {!loading &&
            comments.length === 0 && (
              <p className="muted">
                No comments yet.
              </p>
            )}

          <div className="comments-list">
            {comments.map((comment) => (
              <div
                className="comment-item"
                key={comment.id}
              >
                <div className="comment-header">
                  <strong>
                    {comment.userName ||
                      "User"}
                  </strong>

                  <small>
                    {comment.createdAt
                      ? new Date(
                          comment.createdAt
                        ).toLocaleString()
                      : ""}
                  </small>
                </div>

                <p>
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>

          <form
            className="comment-form"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={value}
              onChange={(event) =>
                setValue(
                  event.target.value
                )
              }
              placeholder="Write a comment..."
            />

            <button
              type="submit"
              className="primary-button small-button"
              disabled={
                saving || !value.trim()
              }
            >
              {saving
                ? "Sending..."
                : "Send"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}