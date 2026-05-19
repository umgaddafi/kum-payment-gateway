import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="hero-grid hero-grid-expanded">
      <div className="panel hero-copy hero-panel">
        <p className="eyebrow">Modern Payment Workspace</p>
        <h1>Launch a clean payment dashboard experience without the full backend complexity.</h1>
        <p className="lead">
          This demo pairs a React frontend with a lightweight Laravel API so you can
          validate the entire login-to-dashboard journey before connecting real data.
        </p>
        <div className="cta-row">
          <Link className="primary-link" to="/login">
            Explore the Demo
          </Link>
          <a className="secondary-link" href="#platform-preview">
            See Preview
          </a>
        </div>

        <div className="hero-metrics">
          <article className="metric-card">
            <strong>React + Vite</strong>
            <span>Fast frontend workflow with clean routing.</span>
          </article>
          <article className="metric-card">
            <strong>Laravel API</strong>
            <span>Dummy auth and JSON endpoints ready for MySQL later.</span>
          </article>
          <article className="metric-card">
            <strong>Shared Hosting Ready</strong>
            <span>Built around root `app/`, `.htaccess`, and `index.php` routing.</span>
          </article>
        </div>
      </div>

      <aside className="home-stack" id="platform-preview">
        <div className="panel info-list feature-panel">
          <div className="panel-badge">Demo Access</div>
          <h2>Sign in with preloaded credentials.</h2>
          <div className="credential-list">
            <p><strong>Email</strong><span>admin@example.com</span></p>
            <p><strong>Password</strong><span>password</span></p>
          </div>
          <p>
            The backend exposes `/api/login`, `/api/user`, and `/api/items` with a
            fake token flow that can be swapped for real persistence later.
          </p>
        </div>

        <div className="panel feature-panel compact-panel">
          <div className="panel-badge">What You Get</div>
          <ul className="feature-list">
            <li>Protected dashboard routing with stored session state</li>
            <li>API-driven item cards for admin data previews</li>
            <li>Beginner-friendly structure for frontend and backend separation</li>
          </ul>
        </div>
      </aside>
    </section>
  );
}
