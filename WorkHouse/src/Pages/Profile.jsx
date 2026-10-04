import React, { useEffect, useState } from "react";
import {
  Badge,
  Check,
  ChevronRight,
  Copy,
  House,
  History,
  LockKeyhole,
  LogOut,
  Monitor,
  ScanBarcode,
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  Terminal,
  UserRound,
} from "lucide-react";
import "../Styles/profile.css";
import Logo from "../assets/Logo.png";
import ChatbotWindow from "../Adminfunctions/ChatbotWindow.jsx";

const STAFF_ID = "#DS-1042";
const STAFF_NAME = "Sarah Eniola";

export default function Profile({ onNavigate, onLogout, onChangePin }) {
  const [copied, setCopied] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // First name taken from the same name shown on the page.
  const firstName = STAFF_NAME.trim().split(" ")[0];

  // Close the logout popup with the Escape key.
  useEffect(() => {
    if (!showLogoutConfirm) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setShowLogoutConfirm(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [showLogoutConfirm]);

  const copyStaffId = async () => {
    try {
      await navigator.clipboard?.writeText(STAFF_ID);
    } catch {
      // Clipboard access may be unavailable in some POS webviews.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout?.();
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="profile-header-content">
          <div className="profile-header-brand">
            <img className="profile-brand-logo" src={Logo} alt="Digisol logo" />
            <span>Staff Profile</span>
          </div>
          <div className="profile-header-actions">
            <button
              className="notification-button chatbot-circle-button"
              type="button"
              onClick={() => setIsChatbotOpen(true)}
              aria-label="Open Chatbot Assistant"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#EEF3F8",
                border: "1px solid #D7E1EC",
                boxShadow: "0 4px 12px rgba(34, 55, 82, 0.12)",
                position: "relative",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="profileRobotShell" x1="4" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFFFFF" />
                    <stop offset="0.55" stopColor="#DCE5F2" />
                    <stop offset="1" stopColor="#AAB9CC" />
                  </linearGradient>
                  <linearGradient id="profileRobotScreen" x1="8" y1="7" x2="17" y2="17" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#253B63" />
                    <stop offset="0.5" stopColor="#101B35" />
                    <stop offset="1" stopColor="#060B18" />
                  </linearGradient>
                  <radialGradient id="profileRobotEye" cx="0" cy="0" r="1" gradientTransform="translate(10 11) rotate(90) scale(2.2)">
                    <stop stopColor="#FFFFFF" />
                    <stop offset="0.65" stopColor="#D7E8FF" />
                    <stop offset="1" stopColor="#70A8FF" />
                  </radialGradient>
                  <filter id="profileRobotGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="0.35" />
                  </filter>
                </defs>
                <path d="M4.1 10.2a7.9 7.9 0 0 1 15.8 0" stroke="#91A4BE" strokeWidth="1.3" strokeLinecap="round" />
                <rect x="2.7" y="10.2" width="2.2" height="4.8" rx="1.1" fill="#8FA1B9" />
                <rect x="19.1" y="10.2" width="2.2" height="4.8" rx="1.1" fill="#8FA1B9" />
                <rect x="4.8" y="4.8" width="14.4" height="14.4" rx="4.8" fill="url(#profileRobotShell)" stroke="#8799B1" strokeWidth="0.7" />
                <path d="M7.4 6.4c2.1-1.1 6.9-1 9.1.3" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="0.8" strokeLinecap="round" />
                <rect x="6.7" y="7.7" width="10.6" height="8.7" rx="3.35" fill="url(#profileRobotScreen)" stroke="#34496D" strokeWidth="0.55" />
                <ellipse cx="10" cy="11.2" rx="1.05" ry="1.25" fill="#7EB2FF" opacity="0.55" filter="url(#profileRobotGlow)" />
                <ellipse cx="14" cy="11.2" rx="1.05" ry="1.25" fill="#7EB2FF" opacity="0.55" filter="url(#profileRobotGlow)" />
                <ellipse cx="10" cy="11.2" rx="0.68" ry="0.85" fill="url(#profileRobotEye)" />
                <ellipse cx="14" cy="11.2" rx="0.68" ry="0.85" fill="url(#profileRobotEye)" />
                <path d="M9.25 13.65c.72.78 1.55 1.12 2.75 1.12s2.03-.34 2.75-1.12" stroke="#B9D7FF" strokeWidth="0.85" strokeLinecap="round" />
                <path d="M19.7 14.8v2.15c0 1.05-.85 1.9-1.9 1.9h-1.1" stroke="#8296B2" strokeWidth="0.9" strokeLinecap="round" />
                <rect x="15.5" y="18.1" width="2.3" height="1.15" rx="0.57" fill="#7186A3" />
              </svg>
              <span className="notification-dot" />
            </button>
            <div className="profile-header-avatar"><UserRound size={17} /></div>
          </div>
        </div>
      </header>

      <main className="profile-main">
        <div className="profile-content">
          <section className="profile-hero-card">
            <div className="profile-status-row"><span className="profile-status-chip"><span /> Online</span></div>
            <div className="profile-avatar-wrap"><div className="profile-avatar">👩‍💼</div><span className="profile-avatar-online"><span /></span></div>
            <h1>{STAFF_NAME}</h1>
            <p className="profile-role"><span>Sales Representative</span><i>•</i><strong>Bonny HQ</strong></p>
            <div className="profile-shift-pill"><ShieldCheck size={15} /> Active shift</div>
          </section>

          <section className="profile-details-card">
            <div className="profile-card-heading">Station Assignment</div>
            <div className="profile-detail-row"><div className="profile-detail-leading"><div className="profile-detail-icon profile-detail-icon-secondary"><Badge size={19} /></div><div className="profile-detail-copy"><span>Staff Identification</span><strong>{STAFF_ID}</strong></div></div><button className={`profile-copy-button ${copied ? "is-copied" : ""}`} type="button" onClick={copyStaffId}>{copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied!" : "Copy"}</button></div>
            <div className="profile-divider" />
            <div className="profile-detail-row"><div className="profile-detail-leading"><div className="profile-detail-icon profile-detail-icon-primary"><Monitor size={19} /></div><div className="profile-detail-copy"><span>Assigned Work Station</span><strong className="profile-truncate">POS Terminal 01 (Morning Shift)</strong></div></div><span className="profile-online-badge"><span /> Online</span></div>
            <div className="profile-divider" />
            <button className="profile-detail-row profile-action-row" type="button" onClick={onChangePin}><span className="profile-detail-leading"><span className="profile-detail-icon profile-detail-icon-neutral"><LockKeyhole size={19} /></span><span className="profile-detail-copy"><strong>Change PIN / Passcode</strong><span>Quick-auth station unlock</span></span></span><ChevronRight className="profile-chevron" size={20} /></button>
          </section>

          <section className="profile-logout-section"><button className="profile-logout-button" type="button" onClick={handleLogout}><LogOut size={19} /> Logout</button></section>
          <footer className="profile-footer-note"><div><Terminal size={14} /> WorkHouse Enterprise POS v2.4.0</div></footer>
        </div>
      </main>

      <nav className="bottom-navigation">
        <div className="bottom-nav-inner">
          <button className="nav-item" onClick={() => onNavigate?.("home")}><House size={22} /><span>Home</span></button>
          <button className="nav-item" onClick={() => onNavigate?.("sales")}><Receipt size={22} /><span>Sales</span></button>
          <div className="transaction-nav">
            <button className="transaction-button" onClick={() => onNavigate?.("admin")} aria-label="Open Admin Dashboard"><LayoutDashboard size={26} /></button>
            <span>Admin Dashboard</span>
          </div>
          <button className="nav-item" onClick={() => onNavigate?.("records")}><History size={22} /><span>Records</span></button>
          <button className="nav-item active" onClick={() => onNavigate?.("profile")} aria-label="Profile"><UserRound size={22} /><span>Profile</span></button>
        </div>
      </nav>

      {showLogoutConfirm && (
        <div
          className="logout-overlay"
          role="presentation"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="logout-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            aria-describedby="logout-dialog-text"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="logout-dialog-icon" aria-hidden="true">
              <LogOut size={26} />
            </div>
            <h2 id="logout-dialog-title">Log out?</h2>
            <p id="logout-dialog-text">
              {firstName}, are you sure you want to lock POS Terminal 01 and return to staff PIN entry?
            </p>
            <div className="logout-dialog-actions">
              <button
                type="button"
                className="logout-dialog-cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="logout-dialog-confirm"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatbotWindow isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}

export { STAFF_ID, STAFF_NAME };