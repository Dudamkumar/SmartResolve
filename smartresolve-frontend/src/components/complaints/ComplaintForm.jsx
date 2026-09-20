import { useState } from "react";

import complaintService from "../../services/complaintService";

import { PRIORITY } from "../../constants/priority";
import { COMPLAINT_CATEGORY } from "../../constants/complaintCategories";

export default function ComplaintForm({
  onCreated,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: PRIORITY.MEDIUM,
    category: COMPLAINT_CATEGORY.IT,
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await complaintService.create(form);

      setForm({
        title: "",
        description: "",
        priority: PRIORITY.MEDIUM,
        category: COMPLAINT_CATEGORY.IT,
      });

      setSuccess(
        "Complaint submitted successfully."
      );

      if (onCreated) {
        await onCreated();
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Could not create complaint."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="complaint-form-card">
      <div className="page-section-heading">
        <div>
          <p className="section-eyebrow">
            NEW COMPLAINT
          </p>

          <h2>
            Report a problem
          </h2>

          <p>
            Provide enough information so the
            support team can resolve it quickly.
          </p>
        </div>
      </div>

      <form
        className="complaint-form"
        onSubmit={handleSubmit}
      >
        <label>
          Complaint title

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Example: Office Wi-Fi is not working"
            required
          />
        </label>

        <label>
          Description

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the problem clearly..."
            rows="6"
            required
          />
        </label>

        <div className="complaint-form-grid">
          <label>
            Category

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="IT">
                IT
              </option>

              <option value="HR">
                HR
              </option>

              <option value="FACILITY">
                Facility
              </option>

              <option value="FINANCE">
                Finance
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>
          </label>

          <label>
            Priority

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="CRITICAL">
                Critical
              </option>
            </select>
          </label>
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

        <button
          type="submit"
          className="primary-button complaint-submit-button"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Complaint"}
        </button>
      </form>
    </section>
  );
}