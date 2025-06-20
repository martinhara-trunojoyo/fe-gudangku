import React from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    // Contoh data user hardcoded
    const users = [
      {
        role: "admin",
        username: "admin",
        email: "admin@example.com",
        password: "adminpass",
        redirectTo: "/dashboard-admin",
      },
      {
        role: "petugas",
        username: "petugas",
        email: "petugas@example.com",
        password: "petugaspass",
        redirectTo: "/dashboard-petugas",
      },
    ];

    // Cari user yang cocok
    const user = users.find(
      (u) =>
        u.username === username &&
        u.email === email &&
        u.password === password
    );

    if (user) {
      navigate(user.redirectTo);
    } else {
      alert("Username, email, atau password salah");
    }
  };

  return (
    <div className="login-wrapper">
      {/* Gambar kiri */}
      <div className="login-image">
        <img src="/login.png" alt="Login Illustration" />
      </div>

      {/* Form kanan */}
      <div className="login-container">
        <div className="login-box">
          <div className="login-form">
            <h2>Log in</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username</label>
              <div className="input-group">
                <span className="icon">👤</span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  required
                />
              </div>

              <label htmlFor="email">Email</label>
              <div className="input-group">
                <span className="icon">📧</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  required
                />
              </div>

              <label htmlFor="password">Password</label>
              <div className="input-group">
                <span className="icon">🔒</span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="remember-me">
                <label>
                  <input type="checkbox" />
                  Remember me
                </label>
              </div>

              <button type="submit">Log in</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
