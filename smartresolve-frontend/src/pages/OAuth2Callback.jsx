import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { saveToken } from "../utils/auth";

export default function OAuth2Callback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [message, setMessage] =
    useState(
      "Completing Google sign-in..."
    );

  useEffect(() => {
    const completeLogin =
      async () => {
        try {
          const params =
            new URLSearchParams(
              window.location.search
            );

          const token =
            params.get("token");

          if (!token) {
            throw new Error(
              "Google login did not return a token."
            );
          }

          saveToken(token);

          const response =
            await api.get(
              "/api/auth/me"
            );

          login(
            token,
            response.data
          );

          setMessage(
            "Login successful. Redirecting..."
          );

          navigate(
            "/dashboard",
            { replace: true }
          );
        } catch (error) {
          console.error(error);

          setMessage(
            "Google login failed. Redirecting to login..."
          );

          setTimeout(() => {
            navigate("/login", {
              replace: true,
            });
          }, 1500);
        }
      };

    completeLogin();
  }, [login, navigate]);

  return (
    <main className="auth-page">
      <section className="auth-card callback-card">
        <div className="loader" />

        <h2>{message}</h2>

        <p className="auth-subtitle">
          Please wait...
        </p>
      </section>
    </main>
  );
}