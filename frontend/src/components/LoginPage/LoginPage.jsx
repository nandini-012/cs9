import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoleRedirect, useAuth } from "../../context/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm((currentForm) => ({
      ...currentForm,
      [event.target.name]: event.target.value,
    }));
  };
const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");
  setSubmitting(true);

  try {
    const user = await login(form);

    const redirectedFrom =
      location.state?.from?.pathname;

    navigate(
      redirectedFrom ||
      getRoleRedirect(user?.role),
      { replace: true }
    );

  } catch (apiError) {
    setError(
      apiError.message ||
      "Login failed"
    );

  } finally {
    setSubmitting(false);
  }
};


  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>HelpDesk</h1>

        {error ? <p className="login-error">{error}</p> : null}

        <label>
          Email
          <input
            autoComplete="email"
            name="email"
            onChange={handleChange}
            required
            type="email"
            value={form.email}
          />
        </label>

        <label>
          Password
          <input
            autoComplete="current-password"
            name="password"
            onChange={handleChange}
            required
            type="password"
            value={form.password}
          />
        </label>

        <button disabled={submitting} type="submit">
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
