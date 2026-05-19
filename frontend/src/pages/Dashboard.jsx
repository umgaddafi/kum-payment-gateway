import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout, fetchItems } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadItems() {
      try {
        const response = await fetchItems();
        setItems(response.items);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, [fetchItems]);

  return (
    <section className="dashboard-layout">
      <div className="panel dashboard-header dashboard-hero">
        <div>
          <p className="eyebrow">Admin Overview</p>
          <h1>Welcome, {user?.name}</h1>
          <p className="lead">
            Your dashboard is powered by the Laravel API and currently using static
            service data that can be replaced with MySQL later.
          </p>
        </div>

        <button className="ghost-button" onClick={logout} type="button">
          Logout
        </button>
      </div>

      <div className="dashboard-summary">
        <article className="panel summary-card">
          <span className="summary-label">Account</span>
          <strong>{user?.email}</strong>
          <p>Signed in with the demo administrator profile.</p>
        </article>
        <article className="panel summary-card">
          <span className="summary-label">Items Available</span>
          <strong>{loading ? '...' : items.length}</strong>
          <p>Live cards loaded from the `/api/items` endpoint.</p>
        </article>
        <article className="panel summary-card">
          <span className="summary-label">Backend Mode</span>
          <strong>Static Service</strong>
          <p>Easy to replace with a repository or MySQL-backed data layer.</p>
        </article>
      </div>

      <div className="panel items-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Admin Items</p>
            <h2>Operational highlights</h2>
          </div>
        </div>
        {loading ? <p>Loading items...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {!loading && !error ? (
          <div className="item-grid">
            {items.map((item) => (
              <article className="item-card" key={item.id}>
                <span className="item-id">0{item.id}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
