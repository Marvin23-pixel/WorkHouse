import { useId, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  AtSign,
  ExternalLink,
  Headset,
  Lock,
  Mail,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import '../Styles/inputemail.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOTAL_STEPS = 3;

/**
 * Step 1 of the password recovery flow: collect the work email.
 *
 * Props
 * - domain:       corporate domain used by the quick-fill chip (default "digisol.com")
 * - step:         current step, 1-based (default 1)
 * - initialEmail: email to prefill (e.g. when returning from the code screen)
 * - onSubmit:     (email: string) => void | Promise<void>. Throw/reject to show an error.
 * - onBack:       called by the header arrow and "Back to Sign In"
 * - helpHref:     link for "Contact IT Helpdesk"
 * - onHelpClick:  optional click handler for the helpdesk link
 */
export default function InputEmail({
  domain = 'digisol.com',
  step = 1,
  initialEmail = '',
  onSubmit,
  onBack,
  helpHref = '#',
  onHelpClick,
}) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);

  const inputId = useId();
  const hintId = useId();
  const errorId = useId();

  const suffix = `@${domain}`;
  const hasValue = email.length > 0;
  const showDomainChip = !email.trim().toLowerCase().endsWith(suffix);

  const handleChange = (event) => {
    setEmail(event.target.value);
    if (error) setError('');
  };

  const handleClear = () => {
    setEmail('');
    setError('');
    inputRef.current?.focus();
  };

  const handleDomainChip = () => {
    const username = email.split('@')[0].trim();
    if (username) setEmail(username + suffix);
    if (error) setError('');
    inputRef.current?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (sending) return;

    const value = email.trim();
    if (!value) {
      setError('Enter your work email.');
      inputRef.current?.focus();
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError(`Enter a full email address, like staff.name${suffix}.`);
      inputRef.current?.focus();
      return;
    }

    setError('');
    setSending(true);
    try {
      await onSubmit?.(value);
    } catch (err) {
      setError(err?.message || 'We could not send the code. Try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="ie-screen">
      {/* Header */}
      <header className="ie-header">
        <div className="ie-header__inner">
          <button
            type="button"
            className="ie-header__back"
            aria-label="Go back"
            onClick={onBack}
          >
            <ArrowLeft size={24} aria-hidden="true" />
          </button>
          <h1 className="ie-header__title">Password Recovery</h1>
        </div>
      </header>

      <main className="ie-main">
        <div className="ie-content">
          {/* Step progress */}
          <section className="ie-card ie-progress" aria-label="Progress">
            <div className="ie-progress__row">
              <span className="ie-progress__step">
                Step {step} of {TOTAL_STEPS}
              </span>
              <span className="ie-progress__name">Email Verification</span>
            </div>
            <div className="ie-progress__bars" aria-hidden="true">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className={
                    i < step
                      ? 'ie-progress__bar ie-progress__bar--done'
                      : 'ie-progress__bar'
                  }
                />
              ))}
            </div>
          </section>

          {/* Hero + instructions */}
          <section className="ie-card ie-hero">
            <div className="ie-hero__glow" aria-hidden="true" />
            <div className="ie-hero__emblem" aria-hidden="true">
              <Mail size={32} />
              <span className="ie-hero__lock">
                <Lock size={14} />
              </span>
            </div>
            <h2 className="ie-hero__title">Forgot Password?</h2>
            <p className="ie-hero__text">
              Enter your registered Digisol corporate work email. We will send a
              4-digit verification code to confirm your identity.
            </p>
            <div className="ie-hero__badge">
              <ShieldCheck size={16} aria-hidden="true" />
              <span>Corporate SSO &amp; Knox Protected</span>
            </div>
          </section>

          {/* Email form */}
          <form className="ie-card ie-form" onSubmit={handleSubmit} noValidate>
            <div className="ie-field">
              <div className="ie-field__head">
                <label className="ie-field__label" htmlFor={inputId}>
                  Work Email Address
                  <span className="ie-field__asterisk" aria-hidden="true">
                    *
                  </span>
                </label>
                <span className="ie-field__tag">Required</span>
              </div>

              <div className="ie-input">
                <AtSign className="ie-input__icon" size={20} aria-hidden="true" />
                <input
                  ref={inputRef}
                  id={inputId}
                  className="ie-input__control"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder={`staff.name${suffix}`}
                  value={email}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? errorId : hintId}
                  disabled={sending}
                />
                {hasValue && !sending && (
                  <button
                    type="button"
                    className="ie-input__clear"
                    aria-label="Clear email input"
                    onClick={handleClear}
                  >
                    <XCircle size={18} aria-hidden="true" />
                  </button>
                )}
              </div>

              {error ? (
                <p id={errorId} className="ie-field__error" role="alert">
                  <AlertCircle size={14} aria-hidden="true" />
                  <span>{error}</span>
                </p>
              ) : (
                <p id={hintId} className="ie-visually-hidden">
                  Use the email address registered with Digisol.
                </p>
              )}

              {showDomainChip && (
                <div className="ie-chips">
                  <button
                    type="button"
                    className="ie-chip"
                    onClick={handleDomainChip}
                  >
                    {suffix}
                  </button>
                </div>
              )}
            </div>

            <button type="submit" className="ie-submit" disabled={sending}>
              <span>{sending ? 'Sending code…' : 'Send Verification Code'}</span>
              {!sending && <ArrowRight size={20} aria-hidden="true" />}
            </button>
          </form>

          {/* Help */}
          <aside className="ie-help">
            <div className="ie-help__icon" aria-hidden="true">
              <Headset size={20} />
            </div>
            <div className="ie-help__body">
              <span className="ie-help__title">Locked terminal or mailbox issue?</span>
              <p className="ie-help__text">
                Reach out to Digisol IT Operations or your system administrator
                for rapid identity provisioning.
              </p>
              <a className="ie-help__link" href={helpHref} onClick={onHelpClick}>
                <span>Contact IT Helpdesk</span>
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            </div>
          </aside>

          {/* Footer */}
          <footer className="ie-footer">
            <button type="button" className="ie-footer__back" onClick={onBack}>
              <ArrowLeft size={18} aria-hidden="true" />
              <span>Back to Sign In</span>
            </button>
            <div className="ie-footer__secure">
              <Lock size={15} aria-hidden="true" />
              <span>256-bit TLS Encrypted Session • DIGISOL Knox Security</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}