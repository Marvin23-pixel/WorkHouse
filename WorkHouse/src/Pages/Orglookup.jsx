import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Search,
  ArrowUpDown,
  BadgeCheck,
  ShoppingCart,
  Hash,
  ShieldCheck,
  Mail,
  X,
  Info,
  Unlock,
  CheckCircle2,
} from "lucide-react";
import "../Styles/orglookup.css";

const ORGS = [
  {
    id: "apex",
    name: "Apex Retail Group",
    role: "Administrator",
    roleClass: "ol-role--admin",
    detail: "Headquarters • 48 staff",
    avatarClass: "ol-avatar--primary",
    letter: "A",
  },
  {
    id: "metro",
    name: "Metro Supermarket Ltd",
    role: "Staff Member",
    roleClass: "ol-role--staff",
    detail: "Branch #04 • Active",
    avatarClass: "ol-avatar--success",
    icon: ShoppingCart,
  },
  {
    id: "digisol",
    name: "Digisol Logistics & Supply",
    role: "Manager",
    roleClass: "ol-role--manager",
    detail: "Supply Chain Hub",
    avatarClass: "ol-avatar--tertiary",
    letter: "D",
  },
];

export default function Orglookup({ onBack, onSelectOrg, onJoinOrg }) {
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [pressedId, setPressedId] = useState(null);
  const [toast, setToast] = useState(null);

  const codeInputRef = useRef(null);
  const toastTimer = useRef(null);
  const errorTimer = useRef(null);

  const filteredOrgs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ORGS;
    return ORGS.filter((org) =>
      `${org.name} ${org.role} ${org.detail}`.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    return () => {
      clearTimeout(toastTimer.current);
      clearTimeout(errorTimer.current);
    };
  }, []);

  useEffect(() => {
    if (modalOpen) {
      const t = setTimeout(() => codeInputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [modalOpen]);

  const showToast = (icon, message, duration) => {
    clearTimeout(toastTimer.current);
    setToast({ icon, message });
    toastTimer.current = setTimeout(() => setToast(null), duration);
  };

  const handleBack = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  const handleSelectOrg = (org) => {
    setPressedId(org.id);
    setTimeout(() => {
      setPressedId(null);
      showToast("unlock", `Connecting to ${org.name}...`, 2200);
      if (onSelectOrg) onSelectOrg(org);
    }, 180);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmitCode = () => {
    const value = code.trim();
    if (!value) {
      setCodeError(true);
      clearTimeout(errorTimer.current);
      errorTimer.current = setTimeout(() => setCodeError(false), 1000);
      return;
    }
    setModalOpen(false);
    setCode("");
    showToast("check", "Code accepted. Redirecting...", 2500);
    if (onJoinOrg) onJoinOrg(value);
  };

  return (
    <div className="ol-page">
      {/* Header */}
      <header className="ol-header">
        <div className="ol-header__bar">
          <div className="ol-header__left">
            <button
              type="button"
              aria-label="Go back"
              className="ol-icon-btn"
              onClick={handleBack}
            >
              <ChevronLeft size={22} />
            </button>
            <div className="ol-header__titles">
              <span className="ol-header__eyebrow">WorkHouse</span>
              <h1 className="ol-header__title">Organization Lookup</h1>
            </div>
          </div>
          <div className="ol-header__avatar">
            <User size={18} />
          </div>
        </div>
      </header>

      <main className="ol-main">
        <div className="ol-content">
          {/* Heading */}
          <div className="ol-heading">
            <h2 className="ol-heading__title">Organisations you bel</h2>
            <p className="ol-heading__sub">
              Select an organisation to continue to your workspace
            </p>
          </div>

          {/* Search & sort */}
          <div className="ol-toolbar">
            <div className="ol-search">
              <Search size={20} className="ol-search__icon" />
              <input
                id="org-search-input"
                type="text"
                className="ol-search__input"
                placeholder="Search workplaces or roles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              type="button"
              aria-label="Sort organisations"
              className="ol-sort-btn"
            >
              <ArrowUpDown size={18} />
              <span>Recent</span>
            </button>
          </div>

          {/* Info pill */}
          <div className="ol-pill">
            <div className="ol-pill__left">
              <BadgeCheck size={18} className="ol-pill__icon" />
              <span>3 connected corporate tenants</span>
            </div>
            <span className="ol-pill__right">Single Sign-On</span>
          </div>

          {/* Organisation list */}
          <div className="ol-list">
            {filteredOrgs.map((org) => {
              const Icon = org.icon;
              return (
                <div
                  key={org.id}
                  role="button"
                  tabIndex={0}
                  className={`ol-card${pressedId === org.id ? " ol-card--pressed" : ""}`}
                  onClick={() => handleSelectOrg(org)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectOrg(org);
                    }
                  }}
                >
                  <div className="ol-card__main">
                    <div className={`ol-avatar ${org.avatarClass}`}>
                      {Icon ? (
                        <Icon size={24} />
                      ) : (
                        <span className="ol-avatar__letter">{org.letter}</span>
                      )}
                      <span className="ol-avatar__status" />
                    </div>
                    <div className="ol-card__text">
                      <div className="ol-card__row">
                        <h3 className="ol-card__name">{org.name}</h3>
                        <span className={`ol-role ${org.roleClass}`}>
                          {org.role}
                        </span>
                      </div>
                      <p className="ol-card__detail">{org.detail}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="ol-card__chevron" />
                </div>
              );
            })}

            {filteredOrgs.length === 0 && (
              <p className="ol-empty">
                No organisations match “{query}”. Try a different name or role.
              </p>
            )}
          </div>

          {/* Primary action */}
          <div className="ol-actions">
            <button
              type="button"
              className="ol-primary-btn"
              onClick={() => setModalOpen(true)}
            >
              <Hash size={20} />
              <span>Join Another Organisation</span>
            </button>
            <div className="ol-note">
              <ShieldCheck size={15} className="ol-note__icon" />
              <p>
                Clicking an organisation proceeds directly to its staff
                credentials portal.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Invitation code sheet */}
      <div
        className={`ol-modal${modalOpen ? " ol-modal--open" : ""}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
      >
        <div className="ol-sheet" role="dialog" aria-modal="true" aria-labelledby="ol-sheet-title">
          <div className="ol-sheet__head">
            <div className="ol-sheet__head-left">
              <div className="ol-sheet__badge">
                <Mail size={20} />
              </div>
              <div>
                <h4 id="ol-sheet-title" className="ol-sheet__title">
                  Enter Invitation Code
                </h4>
                <p className="ol-sheet__sub">Provided by your workspace administrator</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close"
              className="ol-close-btn"
              onClick={closeModal}
            >
              <X size={18} />
            </button>
          </div>

          <div className="ol-sheet__body">
            <div className="ol-field">
              <label htmlFor="invitation-code" className="ol-field__label">
                Organisation Access Token
              </label>
              <input
                ref={codeInputRef}
                id="invitation-code"
                type="text"
                maxLength={12}
                placeholder="e.g. WK-9842-X"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmitCode();
                }}
                className={`ol-field__input${codeError ? " ol-field__input--error" : ""}`}
              />
            </div>
            <div className="ol-hint">
              <Info size={16} className="ol-hint__icon" />
              <span>
                If you received an invitation link via email, tapping it will
                automatically enroll your device.
              </span>
            </div>
          </div>

          <div className="ol-sheet__footer">
            <button type="button" className="ol-btn ol-btn--secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="button" className="ol-btn ol-btn--primary" onClick={handleSubmitCode}>
              Verify &amp; Continue
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="ol-toast" role="status" aria-live="polite">
          {toast.icon === "unlock" ? <Unlock size={16} /> : <CheckCircle2 size={16} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}