import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Unauthorized</h1>
        <p>You do not have access to this page.</p>
        <Link to="/login">Back to login</Link>
      </section>
    </main>
  );
}
