import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: 'admin@example.com',
    password: 'password',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  function validate() {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.password.trim()) {
      nextErrors.password = 'Password is required.';
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      if (error.status === 422) {
        setErrors({
          email: error.errors.email?.[0],
          password: error.errors.password?.[0],
        });
      } else {
        setServerError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="form-wrap">
      <form className="panel form-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Login</p>
        <h1>Access the dashboard</h1>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
          />
          {errors.email ? <small className="error-text">{errors.email}</small> : null}
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
          />
          {errors.password ? (
            <small className="error-text">{errors.password}</small>
          ) : null}
        </label>

        {serverError ? <div className="error-banner">{serverError}</div> : null}

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </section>
  );
}
