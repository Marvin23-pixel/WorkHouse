import { useEffect, useId, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  Lock,
  LockKeyhole,
  MonitorSmartphone,
  ShieldCheck,
} from 'lucide-react';
import '../Styles/reset.css';

const TOTAL_STEPS = 3;

const RULES = [
  { id: 'length', label: 'At least 8 characters long', test: (v) => v.length >= 8 },
  { id: 'number', label: 'At least one number (0-9)', test: (v) => /\d/.test(v) },
  { id: 'upper', label: 'At least one uppercase letter (A-Z)', test: (v) => /[A-Z]/.test(v) },
  { id: 'symbol', label: 'Special symbol (!, @, #, $, %)', test: (v) => /[^A-Za-z0-9\s]/.test(v) },
];

// Returns the meter state for a password: how many bars to fill, its label and tone.
function getStrength(password, metCount) {
  if (!password) return { bars: 0, label: 'Not set yet', tone: 'muted' };
  if (metCount <= 1) return { bars: 1, label: 'Weak Password', tone: 'error' };
  if (metCount < RULES.length) return { bars: 2, label: 'Fair Password', tone: 'warning' };
  if (password.length >= 16) return { bars: 4, label: 'Very Strong Password', tone: 'success' };
  return { bars: 3, label: 'Strong Password', tone: 'success' };
}

/**
 * Step 3 of the password recovery flow: create the new password.
 *
 * Props
 * - step:      current step, 1-based (default 3)
 * - onSubmit:  (password: string) => void | Promise<void>. Throw/reject to show an error.
 * - onDone:    called shortly after a successful save (e.g. go back to Login)
 * - onBack:    called by the header arrow
 * - onCancel:  called by "Cancel and return to Login"
 */
export default function Reset({ step = 3, onSubmit, onDone, onBack, onCancel }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'saving' | 'success'

  const passwordRef = useRef(null);
  const confirmRef = useRef(null);
  const doneTimer = useRef(null);

  const passwordId = useId();
  const confirmId = useId();
  const errorId = useId();

  useEffect(() => () => clearTimeout(doneTimer.current), []);

  const results = RULES.map((rule) => ({ ...rule, met: rule.test(password) }));
  const metCount = results.filter((r) => r.met).length;
  const allMet = metCount === RULES.length;
  const strength = getStrength(password, metCount);

  const hasConfirm = confirm.length > 0;
  const matches = hasConfirm && confirm === password;
  const mismatch = hasConfirm && confirm !== password;

  const locked = status !== 'idle';

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    if (error) setError('');
  };

  const handleConfirmChange = (event) => {
    setConfirm(event.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (locked) return;

    if (!allMet) {
      setError('Your password must meet every requirement listed above.');
      passwordRef.current?.focus();
      return;
    }
    if (confirm !== password) {
      setError("Passwords don't match.");
      confirmRef.current?.focus();
      return;
    }

    setError('');
    setStatus('saving');
    try {
      await onSubmit?.(password);
      setStatus('success');
      doneTimer.current = setTimeout(() => onDone?.(), 1200);
    } catch (err) {
      setError(err?.message || 'We could not update your password. Try again.');
      setStatus('idle');
    }
  };

  const submitClass = [
    'rs-submit',
    status === 'success' ? 'rs-submit--success' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="rs-screen">
      {/* Header */}
      <header className="rs-header">
        <div className="rs-header__inner">
          <button type="button" className="rs-header__back" aria-label="Go back" onClick={onBack}>
            <ArrowLeft size={24} aria-hidden="true" />
          </button>
          <h1 className="rs-header__title">Reset Password</h1>
        </div>
      </header>

      <main className="rs-main">
        <div className="rs-content">
          {/* Progress */}
          <section className="rs-card rs-progress" aria-label="Progress">
            <div className="rs-progress__row">
              <div className="rs-progress__label">
                <span className="rs-progress__step">
                  Step {step} of {TOTAL_STEPS}
                </span>
                <span className="rs-progress__dot" aria-hidden="true">
                  •
                </span>
                <span className="rs-progress__name">Final Step</span>
              </div>
              <span className="rs-progress__ready">
                <span className="rs-dot" aria-hidden="true" />
                100% Ready
              </span>
            </div>
            <div className="rs-progress__bars" aria-hidden="true">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className={
                    i < step ? 'rs-progress__bar rs-progress__bar--done' : 'rs-progress__bar'
                  }
                />
              ))}
            </div>
          </section>

          {/* Emblem + heading */}
          <div className="rs-hero">
            <div className="rs-hero__emblem-wrap" aria-hidden="true">
              <div className="rs-hero__emblem">
                <LockKeyhole size={32} />
              </div>
              <span className="rs-hero__check">
                <Check size={14} strokeWidth={3} />
              </span>
            </div>
            <h2 className="rs-hero__title">Create New Password</h2>
            <p className="rs-hero__text">
              Identity verified. Create a robust, compliant credential for your Digisol staff
              account.
            </p>
          </div>

          <form className="rs-form" onSubmit={handleSubmit} noValidate>
            {/* New password */}
            <div className="rs-field">
              <div className="rs-field__head">
                <label className="rs-field__label" htmlFor={passwordId}>
                  New Password
                </label>
                <span className="rs-field__hint">Min. 8 characters</span>
              </div>
              <div className="rs-input">
                <KeyRound className="rs-input__icon" size={20} aria-hidden="true" />
                <input
                  ref={passwordRef}
                  id={passwordId}
                  className="rs-input__control"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={locked}
                  aria-required="true"
                />
                <button
                  type="button"
                  className="rs-input__toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? (
                    <EyeOff size={20} aria-hidden="true" />
                  ) : (
                    <Eye size={20} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Strength meter */}
            <div className="rs-card rs-meter">
              <div className="rs-meter__row">
                <span className="rs-meter__title">Security Tier</span>
                <span className={`rs-meter__state rs-tone--${strength.tone}`} aria-live="polite">
                  <span className="rs-dot" aria-hidden="true" />
                  {strength.label}
                </span>
              </div>
              <div className="rs-meter__bars" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={
                      i < strength.bars
                        ? `rs-meter__bar rs-meter__bar--${strength.tone}`
                        : 'rs-meter__bar'
                    }
                  />
                ))}
              </div>
            </div>

            {/* Policy checklist */}
            <div className="rs-policy">
              <div className="rs-policy__head">
                <div className="rs-policy__icon" aria-hidden="true">
                  <ShieldCheck size={16} />
                </div>
                <span className="rs-policy__title">Enterprise Policy Requirements</span>
              </div>
              <ul className="rs-policy__list">
                {results.map(({ id, label, met }) => (
                  <li key={id} className="rs-policy__item">
                    <span
                      className={met ? 'rs-policy__badge rs-policy__badge--met' : 'rs-policy__badge'}
                      aria-hidden="true"
                    >
                      {met && <Check size={15} />}
                    </span>
                    <span className="rs-policy__text">
                      <span className="rs-visually-hidden">{met ? 'Met: ' : 'Not met: '}</span>
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirm password */}
            <div className="rs-field">
              <label className="rs-field__label rs-field__label--solo" htmlFor={confirmId}>
                Confirm New Password
              </label>
              <div className={mismatch ? 'rs-input rs-input--error' : 'rs-input'}>
                <Lock className="rs-input__icon" size={20} aria-hidden="true" />
                <input
                  ref={confirmRef}
                  id={confirmId}
                  className="rs-input__control rs-input__control--confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={handleConfirmChange}
                  disabled={locked}
                  aria-required="true"
                  aria-invalid={mismatch ? 'true' : 'false'}
                />
                {matches && (
                  <span
                    className="rs-input__status rs-input__status--confirm rs-input__status--ok"
                    aria-hidden="true"
                  >
                    <CheckCircle size={20} />
                  </span>
                )}
                {mismatch && (
                  <span
                    className="rs-input__status rs-input__status--confirm rs-input__status--error"
                    aria-hidden="true"
                  >
                    <AlertCircle size={20} />
                  </span>
                )}
                <button
                  type="button"
                  className="rs-input__toggle"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  aria-pressed={showConfirm}
                  onClick={() => setShowConfirm((value) => !value)}
                >
                  {showConfirm ? (
                    <EyeOff size={20} aria-hidden="true" />
                  ) : (
                    <Eye size={20} aria-hidden="true" />
                  )}
                </button>
              </div>
              {mismatch && <p className="rs-field__error">Passwords don't match.</p>}
            </div>

            {/* Session notice */}
            <div className="rs-notice">
              <div className="rs-notice__icon" aria-hidden="true">
                <MonitorSmartphone size={18} />
              </div>
              <div className="rs-notice__body">
                <span className="rs-notice__title">Immediate Session Invalidation</span>
                <p className="rs-notice__text">
                  All active sessions across mobile terminals, handheld scanners, and desktop
                  portals will be instantly invalidated upon reset.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="rs-actions">
              {error && (
                <p id={errorId} className="rs-actions__error" role="alert">
                  <AlertCircle size={14} aria-hidden="true" />
                  <span>{error}</span>
                </p>
              )}
              <button type="submit" className={submitClass} disabled={locked}>
                {status === 'saving' && (
                  <>
                    <LoaderCircle className="rs-spin" size={20} aria-hidden="true" />
                    <span>Authenticating Credentials…</span>
                  </>
                )}
                {status === 'success' && (
                  <>
                    <CheckCircle size={20} aria-hidden="true" />
                    <span>Password Updated Successfully</span>
                  </>
                )}
                {status === 'idle' && (
                  <>
                    <span>Save Password &amp; Sign In</span>
                    <ArrowRight size={20} aria-hidden="true" />
                  </>
                )}
              </button>
              <button
                type="button"
                className="rs-actions__cancel"
                disabled={locked}
                onClick={onCancel}
              >
                Cancel and return to Login
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="rs-footer">
            <Lock size={15} aria-hidden="true" />
            <span>256-bit TLS Encrypted Session • DIGISOL Knox Security</span>
          </div>
        </div>
      </main>
    </div>
  );
}