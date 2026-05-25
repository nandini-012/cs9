import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../LoginPage/LoginPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });
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
      await register(form);
      navigate("/login", { replace: true });
    } catch (apiError) {
      setError(apiError.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>

        {error ? <p className="login-error">{error}</p> : null}

        <label>
          Name
          <input name="name" onChange={handleChange} value={form.name} />
        </label>

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
            autoComplete="new-password"
            name="password"
            onChange={handleChange}
            required
            type="password"
            value={form.password}
          />
        </label>

        <label>
          Role
          <select name="role" onChange={handleChange} value={form.role}>
            <option value="USER">User</option>
            <option value="RESOLVER">Resolver</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>

        <button disabled={submitting} type="submit">
          {submitting ? "Creating..." : "Create account"}
        </button>
      </form>
    </main>
  );
}
