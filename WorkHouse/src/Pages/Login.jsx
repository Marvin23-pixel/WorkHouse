import { useState } from 'react';
import {
  AlertCircle,
  Badge,
  CircleHelp,
  Eye,
  EyeOff,
  Info,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  ShieldCheck,
  Store,
  X,
  XCircle,
} from 'lucide-react';
import '../Styles/login.css';
import { findStaffByCredentials, logStaffIn } from "../utils/staffStore.js";
import Logo from '../assets/Logo.png';

const VALID_DEFAULTS = {
  staffId: 'sarah.j@digisol.com',
  password: 'DigiSol2025!',
};

const PRESETS = {
  sarah: { staffId: 'sarah.j@digisol.com', password: 'DigiSol2025!' },
  marcus: { staffId: 'DIGI-001', password: '1234' },
};

export default function Login({ onLogin, onForgotPassword }) {
  const [staffId, setStaffId] = useState(VALID_DEFAULTS.staffId);
  const [password, setPassword] = useState(VALID_DEFAULTS.password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');

  const applyPreset = (preset) => {
    setStaffId(PRESETS[preset].staffId);
    setPassword(PRESETS[preset].password);
    setError('');
    setIsSupervisor(false);
  };

  const toggleSupervisor = () => {
    const nextValue = !isSupervisor;
    setIsSupervisor(nextValue);
    setStaffId(nextValue ? 'mgr.adeniyi@digisol.com' : VALID_DEFAULTS.staffId);
    setPassword(nextValue ? '' : VALID_DEFAULTS.password);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError('');

    await new Promise((resolve) => setTimeout(resolve, 1100));

    const matchedStaff = findStaffByCredentials(staffId, password);

    if (!matchedStaff) {
      setIsLoading(false);
      setError('Invalid Staff ID or password, or this account is inactive.');
      return;
    }

    // Mark this staff member as online — reflected instantly in the
    // Staff Accounts "Online" capsule.
    logStaffIn(matchedStaff.id);

    setIsLoading(false);
    setIsAuthorized(true);
    onLogin?.({
      staff: matchedStaff,
      rememberTerminal,
      isSupervisor: matchedStaff.role === 'admin' || matchedStaff.role === 'manager',
    });

    window.setTimeout(() => setIsAuthorized(false), 2500);
  };

  return (
    <main className="login-page">
      <div className="login-shell">
        <header className="login-toolbar">
          <div className="toolbar-actions" style={{ marginLeft: 'auto' }}>
            <button className="icon-button" aria-label="Help and Support" type="button">
              <CircleHelp size={18} />
            </button>
          </div>
        </header>

        <section className="brand-section" aria-label="Store context">
          <div className="brand-row">
            <img src={Logo} alt="Workhouse logo" className="brand-logo" />
            <h1>WORKHOUSE</h1>
          </div>
          <div className="context-pills">
            <span className="context-pill">
              <Store size={14} /> Bonny Central Branch #01
            </span>
          </div>
        </section>

        <section className="auth-card">
          <div className="card-heading"></div>

          {error && (
            <div className="error-banner" role="alert">
              <AlertCircle size={18} />
              <div>
                <strong>Authentication failed</strong>
                <p>{error}</p>
              </div>
              <button type="button" aria-label="Dismiss error" onClick={() => setError('')}>
                <X size={16} />
              </button>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="staffIdInput">Staff ID or Enterprise Email</label>
            <div className="input-wrap">
              <Badge className="input-icon" size={18} />
              <input
                id="staffIdInput"
                value={staffId}
                onChange={(event) => setStaffId(event.target.value)}
                autoComplete="username"
                placeholder="e.g. sarah.j@digisol.com or DS-1042"
                type="text"
              />
              {staffId && (
                <button className="input-action" type="button" aria-label="Clear staff ID" onClick={() => setStaffId('')}>
                  <XCircle size={16} />
                </button>
              )}
            </div>

            <label className="field-label" htmlFor="passwordInput">Password or Till PIN</label>
            <div className="input-wrap">
              <LockKeyhole className="input-icon" size={18} />
              <input
                id="passwordInput"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                placeholder="Enter security key"
                type={showPassword ? 'text' : 'password'}
              />
              <button className="input-action" type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="form-options">
              <label className="remember-option">
                <input type="checkbox" checked={rememberTerminal} onChange={(event) => setRememberTerminal(event.target.checked)} />
                <span>Remember terminal login</span>
              </label>
              <button className="forgot-button" type="button" onClick={onForgotPassword}>Forgot Password?</button>
            </div>

            <button className={`submit-button${isAuthorized ? ' authorized' : ''}`} disabled={isLoading} type="submit">
              {isLoading ? <LoaderCircle className="spin" size={19} /> : isAuthorized ? <ShieldCheck size={19} /> : <LogIn size={19} />}
              {isLoading ? 'Verifying Authorization...' : isAuthorized ? 'Authorized! Till Opening...' : ' Log In'}
            </button>
          </form>
        </section>

        <footer className="security-footer">
          <div><ShieldCheck size={15} /> Encrypted End-to-End • WorkHouse Security v2.4</div>
          {/* <p><Info size={13} /> Authorized cashier personnel only. Unregistered till access is logged.</p> */}
        </footer>
      </div>
    </main>
  );
}