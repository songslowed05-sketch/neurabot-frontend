import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Bot, Lock, Mail, User } from "lucide-react";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/signup`,
  {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not create account.");
      }

      setSuccess("Account created successfully! Redirecting...");

      setForm({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="logo-icon">
            <Bot size={21} />
          </div>

          <span>
            Neura<span>Bot</span>
          </span>
        </div>

        <h1>Create your account</h1>

        <p className="auth-subtitle">
          Start building your AI business assistant.
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>

          <label>Full name</label>

          <div className="auth-input">
            <User size={17} />

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              autoComplete="name"
              disabled={loading}
            />
          </div>

          <label>Email address</label>

          <div className="auth-input">
            <Mail size={17} />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <label>Password</label>

          <div className="auth-input">
            <Lock size={17} />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}

            {!loading && <ArrowRight size={17} />}
          </button>

        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

        <Link to="/" className="back-home">
          ← Back to home
        </Link>

      </div>
    </div>
  );
}

export default Signup;