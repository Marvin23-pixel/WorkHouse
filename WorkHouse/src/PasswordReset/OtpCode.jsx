import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Delete,
  LoaderCircle,
  MessageSquare,
  Pencil,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import '../Styles/otpcode.css';

const TOTAL_STEPS = 3;

const KEYS = [
  { digit: '1', letters: '' },
  { digit: '2', letters: 'ABC' },
  { digit: '3', letters: 'DEF' },
  { digit: '4', letters: 'GHI' },
  { digit: '5', letters: 'JKL' },
  { digit: '6', letters: 'MNO' },
  { digit: '7', letters: 'PQRS' },
  { digit: '8', letters: 'TUV' },
  { digit: '9', letters: 'WXYZ' },
];

const formatTime = (totalSeconds) => {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${m}:${s}`;
};

/**
 * Step 2 of the password recovery flow: enter the verification code.
 *
 * Props
 * - email:         address the code was sent to (shown in the instructions)
 * - length:        number of digits (default 4)
 * - step:          current step, 1-based (default 2)
 * - resendSeconds: cooldown before the code can be resent (default 42)
 * - onVerify:      (code: string) => void | Promise<void>. Throw/reject to show an error.
 * - onResend:      () => void | Promise<void>. Called when the timer has finished.
 * - onSendSms:     () => void | Promise<void>. Called by "Send via SMS".
 * - onEditEmail:   called by "Edit email"
 * - onBack:        called by the header arrow
 */
export default function OtpCode({
  email = '',
  length = 4,
  step = 2,
  resendSeconds = 42,
  onVerify,
  onResend,
  onSendSms,
  onEditEmail,
  onBack,
}) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(resendSeconds);
  const [pending, setPending] = useState(''); // '' | 'verify' | 'resend' | 'sms'

  const busy = pending !== '';
  const percent = Math.floor((step / TOTAL_STEPS) * 100);

  /* ----- Countdown ----- */
  useEffect(() => {
    if (seconds <= 0) return undefined;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  /* ----- Entering digits ----- */
  const addDigit = useCallback(
    (digit) => {
      setError('');
      setCode((current) => (current.length < length ? current + digit : current));
    },
    [length],
  );

  const removeDigit = useCallback(() => {
    setError('');
    setCode((current) => current.slice(0, -1));
  }, []);

  // Hardware keyboard and paste support (the on-screen keypad works too).
  useEffect(() => {
    if (busy) return undefined;

    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
      ) {
        return;
      }
      if (/^\d$/.test(event.key)) {
        addDigit(event.key);
      } else if (event.key === 'Backspace') {
        removeDigit();
      }
    };

    const onPaste = (event) => {
      const digits = (event.clipboardData?.getData('text') ?? '')
        .replace(/\D/g, '')
        .slice(0, length);
      if (!digits) return;
      event.preventDefault();
      setError('');
      setCode(digits);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('paste', onPaste);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('paste', onPaste);
    };
  }, [busy, length, addDigit, removeDigit]);

  /* ----- Actions ----- */
  const handleVerify = async () => {
    if (busy) return;
    if (code.length < length) {
      setError(`Enter all ${length} digits.`);
      return;
    }
    setError('');
    setPending('verify');
    try {
      await onVerify?.(code);
    } catch (err) {
      setError(err?.message || 'That code is incorrect. Try again.');
      setCode('');
    } finally {
      setPending('');
    }
  };

  const handleResend = async (kind, callback) => {
    if (busy) return;
    setError('');
    setPending(kind);
    try {
      await callback?.();
      setCode('');
      setSeconds(resendSeconds);
    } catch (err) {
      setError(err?.message || 'We could not send a new code. Try again.');
    } finally {
      setPending('');
    }
  };

  return (
    <div className="oc-screen">
      {/* Header */}
      <header className="oc-header">
        <div className="oc-header__inner">
          <button type="button" className="oc-header__back" aria-label="Go back" onClick={onBack}>
            <ArrowLeft size={24} aria-hidden="true" />
          </button>
          <h1 className="oc-header__title">MFA Security Challenge</h1>
        </div>
      </header>

      <main className="oc-main">
        <div className="oc-content">
          {/* Progress */}
          <section className="oc-progress" aria-label="Progress">
            <div className="oc-progress__row">
              <span className="oc-progress__step">
                Step {step} of {TOTAL_STEPS}
                <span className="oc-progress__dot" aria-hidden="true">
                  •
                </span>
                Verification Code
              </span>
              <span className="oc-progress__percent">{percent}% Completed</span>
            </div>
            <div className="oc-progress__bars" aria-hidden="true">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                <div
                  key={i}
                  className={
                    i < step ? 'oc-progress__bar oc-progress__bar--done' : 'oc-progress__bar'
                  }
                />
              ))}
            </div>
          </section>

          {/* Shield emblem */}
          <div className="oc-emblem-wrap">
            <div className="oc-emblem" aria-hidden="true">
              <ShieldCheck size={32} fill="currentColor" stroke="var(--oc-primary-subtle)" />
              <span className="oc-emblem__check">
                <Check size={12} strokeWidth={3.5} />
              </span>
            </div>
          </div>

          {/* Headline + instructions */}
          <div className="oc-intro">
            <h2 className="oc-intro__title">Enter {length}-Digit Code</h2>
            <div className="oc-intro__text">
              <span className="oc-intro__muted">We sent a {length}-digit security code to</span>
              {email && <span className="oc-intro__email">{email}</span>}
              {email && (
                <button type="button" className="oc-intro__edit" onClick={onEditEmail}>
                  <Pencil size={14} aria-hidden="true" />
                  <span>Edit email</span>
                </button>
              )}
            </div>
          </div>

          {/* Code slots */}
          <div className="oc-slots" role="group" aria-label="Verification code">
            {Array.from({ length }, (_, i) => {
              const digit = code[i];
              const isActive = i === code.length && code.length < length;
              const className = [
                'oc-slot',
                isActive ? 'oc-slot--active' : '',
                error ? 'oc-slot--error' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <div key={i} className={className} aria-hidden="true">
                  {digit ? (
                    <span className="oc-slot__digit">{digit}</span>
                  ) : isActive ? (
                    <span className="oc-slot__cursor" />
                  ) : null}
                </div>
              );
            })}
          </div>
          <p className="oc-visually-hidden" aria-live="polite">
            {code.length} of {length} digits entered
          </p>

          {error && (
            <p className="oc-error" role="alert">
              <AlertCircle size={14} aria-hidden="true" />
              <span>{error}</span>
            </p>
          )}

          {/* Resend */}
          <div className="oc-resend">
            {seconds > 0 ? (
              <div className="oc-resend__timer">
                <Clock size={16} aria-hidden="true" />
                <span>
                  Resend code in <span className="oc-resend__time">{formatTime(seconds)}</span>
                </span>
              </div>
            ) : (
              <button
                type="button"
                className="oc-resend__button"
                disabled={busy}
                onClick={() => handleResend('resend', onResend)}
              >
                <RefreshCw size={16} aria-hidden="true" />
                <span>Resend code</span>
              </button>
            )}
            <button
              type="button"
              className="oc-resend__sms"
              disabled={busy}
              onClick={() => handleResend('sms', onSendSms)}
            >
              <MessageSquare size={16} aria-hidden="true" />
              <span>Didn't receive code? Send via SMS</span>
            </button>
          </div>

          {/* Verify */}
          <div className="oc-action">
            <button type="button" className="oc-submit" disabled={busy} onClick={handleVerify}>
              {pending === 'verify' ? (
                <>
                  <LoaderCircle className="oc-spin" size={20} aria-hidden="true" />
                  <span>Verifying…</span>
                </>
              ) : (
                <>
                  <span>Verify &amp; Proceed</span>
                  <ArrowRight size={20} aria-hidden="true" />
                </>
              )}
            </button>
          </div>

          {/* Keypad */}
          <div className="oc-keypad" role="group" aria-label="Numeric keypad">
            {[0, 1, 2].map((row) => (
              <div className="oc-keypad__row" key={row}>
                {KEYS.slice(row * 3, row * 3 + 3).map(({ digit, letters }) => (
                  <button
                    key={digit}
                    type="button"
                    className="oc-key"
                    disabled={busy}
                    onClick={() => addDigit(digit)}
                  >
                    <span className="oc-key__digit">{digit}</span>
                    <span className="oc-key__letters" aria-hidden="true">
                      {letters}
                    </span>
                  </button>
                ))}
              </div>
            ))}
            <div className="oc-keypad__row">
              <span aria-hidden="true" />
              <button
                type="button"
                className="oc-key"
                disabled={busy}
                onClick={() => addDigit('0')}
              >
                <span className="oc-key__digit">0</span>
                <span className="oc-key__letters" aria-hidden="true">
                  +
                </span>
              </button>
              <button
                type="button"
                className="oc-key oc-key--ghost"
                aria-label="Delete last digit"
                disabled={busy}
                onClick={removeDigit}
              >
                <Delete size={22} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}