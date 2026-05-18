import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="hero-grid">
      <div className="panel hero-copy">
        <p className="eyebrow">Homepage</p>
        <h1>React frontend with a Laravel API, built for simple shared hosting.</h1>
        <p className="lead">
          This starter project uses fake authentication and static dashboard data so
          you can validate the full flow before adding MySQL.
        </p>
        <div className="cta-row">
          <Link className="primary-link" to="/login">
            Login to Demo
          </Link>
        </div>
      </div>

      <div className="panel info-list">
        <h2>Demo credentials</h2>
        <p><strong>Email:</strong> admin@example.com</p>
        <p><strong>Password:</strong> password</p>
        <p>
          The backend exposes `/api/login`, `/api/user`, and `/api/items`, all with
          JSON responses.
        </p>
      </div>
    </section>
  );
}
