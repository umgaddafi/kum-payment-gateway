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
      <div className="panel dashboard-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome, {user?.name}</h1>
          <p className="lead">Your dashboard data is coming from the Laravel API.</p>
        </div>

        <button className="ghost-button" onClick={logout} type="button">
          Logout
        </button>
      </div>

      <div className="panel">
        <h2>Items</h2>
        {loading ? <p>Loading items...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {!loading && !error ? (
          <div className="item-grid">
            {items.map((item) => (
              <article className="item-card" key={item.id}>
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
