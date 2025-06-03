import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setError(data.error || "Email already registered");
        return;
      }

      if (!res.ok) {
        setError("Signup failed");
        console.error("Signup failed:", data.error);
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/login");
      console.log("Signed up:", data);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h2>Sign Up</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={254}
            inputMode="email"
            autoComplete="email"
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Sign Up
        </button>
      </form>
      <p className="mt-3">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
