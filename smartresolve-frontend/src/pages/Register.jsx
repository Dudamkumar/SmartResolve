import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import authService from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
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

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        await authService.register(form);

        setSuccess(
          "Account created successfully. Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/login", {
            replace: true,
          });
        }, 1200);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data
            ?.message ||
          error.response?.data
            ?.error ||
          "Registration failed."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-mark">S</div>

        <p className="eyebrow">
          SMARTRESOLVE
        </p>

        <h1>Create account</h1>

        <p className="auth-subtitle">
          New public registrations are created
          with the USER role.
        </p>

        <form
          className="form-stack"
          onSubmit={handleSubmit}
        >
          <label>
            Full name

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </label>

          <label>
            Email

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              minLength={6}
              required
            />
          </label>

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
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}