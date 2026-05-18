(function () {
  const TOKEN_KEY = 'kum_demo_token';
  const USER_KEY = 'kum_demo_user';
  const routes = new Set(['/', '/login', '/dashboard']);

  function getPath() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return routes.has(path) ? path : '/';
  }

  function getToken() {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  function getStoredUser() {
    const rawUser = window.localStorage.getItem(USER_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser);
    } catch (error) {
      return null;
    }
  }

  function saveSession(token, user) {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function clearSession() {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }

  async function apiRequest(path, options) {
    const response = await window.fetch('/api' + path, {
      headers: {
        'Content-Type': 'application/json',
        ...(options && options.headers ? options.headers : {}),
      },
      ...options,
    });

    const data = await response.json().catch(function () {
      return {};
    });

    if (!response.ok) {
      const error = new Error(data.message || 'Request failed.');
      error.status = response.status;
      error.errors = data.errors || {};
      throw error;
    }

    return data;
  }

  function navigate(path, replace) {
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }

    render();
  }

  function layout(content, path, isAuthenticated) {
    return `
      <div class="site-shell">
        <header class="topbar">
          <div class="brand-block">
            <p class="brand-kicker">Demo Full-Stack App</p>
            <a class="brand-name" href="/" data-link>KUM Payment Gateway</a>
          </div>

          <nav class="nav-links">
            <a class="${path === '/' ? 'is-active' : ''}" href="/" data-link>Home</a>
            ${
              isAuthenticated
                ? `
                  <a class="${path === '/dashboard' ? 'is-active' : ''}" href="/dashboard" data-link>Dashboard</a>
                  <button class="ghost-button" id="nav-logout" type="button">Logout</button>
                `
                : `<a class="${path === '/login' ? 'is-active' : ''}" href="/login" data-link>Login</a>`
            }
          </nav>
        </header>

        <main class="page-content">${content}</main>
      </div>
    `;
  }

  function homePage() {
    return `
      <section class="hero-grid">
        <div class="panel hero-copy">
          <p class="eyebrow">Homepage</p>
          <h1>React frontend with a Laravel API, built for simple shared hosting.</h1>
          <p class="lead">
            This starter project uses fake authentication and static dashboard data so
            you can validate the full flow before adding MySQL.
          </p>
          <div class="cta-row">
            <a class="primary-link" href="/login" data-link>Login to Demo</a>
          </div>
        </div>

        <div class="panel info-list">
          <h2>Demo credentials</h2>
          <p><strong>Email:</strong> admin@example.com</p>
          <p><strong>Password:</strong> password</p>
          <p>
            The backend exposes <code>/api/login</code>, <code>/api/user</code>, and
            <code>/api/items</code>, all with JSON responses.
          </p>
        </div>
      </section>
    `;
  }

  function loginPage() {
    return `
      <section class="form-wrap">
        <form class="panel form-card" id="login-form">
          <p class="eyebrow">Login</p>
          <h1>Access the dashboard</h1>

          <label class="field">
            <span>Email</span>
            <input id="email" type="email" value="admin@example.com">
            <small class="error-text hidden" id="email-error"></small>
          </label>

          <label class="field">
            <span>Password</span>
            <input id="password" type="password" value="password">
            <small class="error-text hidden" id="password-error"></small>
          </label>

          <div class="error-banner hidden" id="server-error"></div>

          <button class="primary-button" id="submit-button" type="submit">Login</button>
        </form>
      </section>
    `;
  }

  function dashboardShell(user) {
    return `
      <section class="dashboard-layout">
        <div class="panel dashboard-header">
          <div>
            <p class="eyebrow">Dashboard</p>
            <h1>Welcome, ${user && user.name ? user.name : 'User'}</h1>
            <p class="lead">Your dashboard data is coming from the Laravel API.</p>
          </div>

          <button class="ghost-button" id="dashboard-logout" type="button">Logout</button>
        </div>

        <div class="panel">
          <h2>Items</h2>
          <div id="dashboard-status">Loading items...</div>
          <div class="item-grid hidden" id="items-grid"></div>
        </div>
      </section>
    `;
  }

  function setText(id, text, hidden) {
    const node = document.getElementById(id);

    if (!node) {
      return;
    }

    node.textContent = text || '';
    node.classList.toggle('hidden', Boolean(hidden));
  }

  async function bindLoginForm() {
    const form = document.getElementById('login-form');

    if (!form) {
      return;
    }

    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const submitButton = document.getElementById('submit-button');
      const errors = {};

      setText('email-error', '', true);
      setText('password-error', '', true);
      setText('server-error', '', true);

      if (!email) {
        errors.email = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Enter a valid email address.';
      }

      if (!password) {
        errors.password = 'Password is required.';
      }

      if (errors.email || errors.password) {
        setText('email-error', errors.email, !errors.email);
        setText('password-error', errors.password, !errors.password);
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'Signing in...';

      try {
        const response = await apiRequest('/login', {
          method: 'POST',
          body: JSON.stringify({ email: email, password: password }),
        });

        saveSession(response.token, response.user);
        navigate('/dashboard', true);
      } catch (error) {
        if (error.status === 422) {
          setText('email-error', error.errors.email && error.errors.email[0], !(error.errors.email && error.errors.email[0]));
          setText('password-error', error.errors.password && error.errors.password[0], !(error.errors.password && error.errors.password[0]));
        } else {
          setText('server-error', error.message, false);
        }
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
      }
    });
  }

  async function hydrateDashboard() {
    const token = getToken();
    const status = document.getElementById('dashboard-status');
    const grid = document.getElementById('items-grid');

    if (!token) {
      clearSession();
      navigate('/login', true);
      return;
    }

    try {
      const userResponse = await apiRequest('/user', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      saveSession(token, userResponse.user);

      const itemsResponse = await apiRequest('/items', {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      status.classList.add('hidden');
      grid.classList.remove('hidden');
      grid.innerHTML = itemsResponse.items
        .map(function (item) {
          return `
            <article class="item-card">
              <h3>${item.title}</h3>
              <p>${item.description}</p>
            </article>
          `;
        })
        .join('');
    } catch (error) {
      if (error.status === 401) {
        clearSession();
        navigate('/login', true);
        return;
      }

      status.textContent = error.message;
      status.classList.remove('hidden');
    }
  }

  function bindSharedEvents() {
    document.querySelectorAll('[data-link]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        navigate(link.getAttribute('href'));
      });
    });

    const logoutButtons = ['nav-logout', 'dashboard-logout'];
    logoutButtons.forEach(function (id) {
      const button = document.getElementById(id);

      if (!button) {
        return;
      }

      button.addEventListener('click', function () {
        clearSession();
        navigate('/login', true);
      });
    });
  }

  async function render() {
    const path = getPath();
    const token = getToken();
    const app = document.getElementById('app');
    const isAuthenticated = Boolean(token);

    if (path === '/dashboard' && !isAuthenticated) {
      navigate('/login', true);
      return;
    }

    if (path === '/login' && isAuthenticated) {
      navigate('/dashboard', true);
      return;
    }

    let content = homePage();

    if (path === '/login') {
      content = loginPage();
    }

    if (path === '/dashboard') {
      content = dashboardShell(getStoredUser());
    }

    app.innerHTML = layout(content, path, isAuthenticated);
    bindSharedEvents();

    if (path === '/login') {
      await bindLoginForm();
    }

    if (path === '/dashboard') {
      await hydrateDashboard();
    }
  }

  window.addEventListener('popstate', render);
  render();
})();
