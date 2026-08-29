import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Bot, Lock, Mail } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/login`,
  {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email.trim(),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || `Login failed (${response.status})`
        );
      }

      if (!data.token) {
        throw new Error("Login successful but token was not received.");
      }

      if (!data.user) {
        throw new Error("Login successful but user information was not received.");
      }

      // Save authentication data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect according to account role
      if (data.user.role === "admin") {
        console.log("ADMIN LOGIN → /admin");
        navigate("/admin", { replace: true });
      } else {
        console.log("USER LOGIN → /dashboard");
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setError(
        error?.message || "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* LOGO */}
        <div className="auth-logo">
          <div className="logo-icon">
            <Bot size={21} />
          </div>

          <span>
            Neura<span>Bot</span>
          </span>
        </div>

        {/* HEADING */}
        <h1>Welcome back</h1>

        <p className="auth-subtitle">
          Login to manage your AI business assistant.
        </p>

        {/* ERROR */}
        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          {/* EMAIL */}
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

          {/* PASSWORD */}
          <label>Password</label>

          <div className="auth-input">
            <Lock size={17} />

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                Login
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* SIGNUP */}
        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/signup">
            Sign up
          </Link>
        </p>

        {/* HOME */}
        <Link
          to="/"
          className="back-home"
        >
          ← Back to home
        </Link>

      </div>
    </div>
  );
}

export default Login;