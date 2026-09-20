import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const email = form.email.trim().toLowerCase();
      const password = form.password;

      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const token = response.data?.token;

      if (!token) {
        throw new Error(
          "Login succeeded but no token was returned."
        );
      }

      // Save token and logged-in user
      login(token, response.data);

      // All roles go to /dashboard.
      // RoleDashboard decides which dashboard to display.
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <main className="auth-page">
      <section className="auth-card">

        <div className="brand-mark">
          S
        </div>

        <p className="eyebrow">
          SMARTRESOLVE
        </p>

        <h1>
          Welcome back
        </h1>

        <p className="auth-subtitle">
          Sign in to manage and track complaints.
        </p>

        <form
          className="form-stack"
          onSubmit={handleSubmit}
        >
          <label>
            Email

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
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
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register">
            Create account
          </Link>
        </p>

      </section>
    </main>
  );
}