import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  ShieldAlert,
  ShieldCheck,
  Check,
  History,
} from "lucide-react";
import "../Styles/settings.css";

// ---------------------------------------------------------------
// Seed data — swap these for your real settings source / API
// ---------------------------------------------------------------
const INITIAL_GENERAL = {
  businessName: "DIGISOL Supermarket & Retail Store",
  businessPhone: "+234 (0) 803 456 7890",
  businessEmail: "operations@digisolretail.com",
  businessAddress: "Plot 14 Commercial Avenue, Victoria Island, Lagos",
};

const STAFF_TOGGLES = [
  {
    key: "autoLogout",
    label: "Automatic Logout",
    desc: "Auto sign out idle staff devices after inactivity",
    defaultOn: true,
  },
  {
    key: "staffLoginNotifications",
    label: "Staff Login Notifications",
    desc: "Alert admin when cashiers log in from new POS",
    defaultOn: true,
  },
];

const SALES_TOGGLES = [
  { key: "allowFullPayment", label: "Allow Full Payment", defaultOn: true },
  { key: "allowAdvancedPayment", label: "Allow Advanced Payment", defaultOn: true },
  { key: "allowPartialBalanceUp", label: "Allow Partial Balance Up", defaultOn: true },
  { key: "requireCustomerPhone", label: "Require Customer Phone", defaultOn: false },
  { key: "requireSaleConfirmation", label: "Require Sale Confirmation", defaultOn: true },
  { key: "requireBalanceConfirmation", label: "Require Balance Confirmation", defaultOn: true },
  { key: "allowMultipleBalanceUp", label: "Allow Multiple Balance Up", defaultOn: false },
  { key: "allowRepsViewPreviousTransactions", label: "Allow Reps To View Previous Transactions", defaultOn: true },
];

const TRANSACTION_TOGGLES = [
  { key: "allowEditingCompletedTransactions", label: "Allow Editing Completed Transactions", defaultOn: false },
  { key: "allowTransactionCancellation", label: "Allow Transaction Cancellation", defaultOn: true },
];

const NOTIFICATION_TOGGLES = [
  { key: "newSaleNotifications", label: "New Sale Notifications", defaultOn: true },
  { key: "advancedPaymentNotifications", label: "Advanced Payment Notifications", defaultOn: true },
  { key: "balanceUpNotifications", label: "Balance Up Notifications", defaultOn: true },
];

const SESSION_TIMEOUT_OPTIONS = [15, 30, 60];

const ACTIVITY_LOG = [
  { id: 1, actor: "Amaka O.", action: "updated the Sales Settings policy", time: "2 hours ago" },
  { id: 2, actor: "Tunde B.", action: "logged in from a new POS terminal", time: "5 hours ago" },
  { id: 3, actor: "Admin", action: "changed Session Timeout to 30 minutes", time: "Yesterday" },
  { id: 4, actor: "Chidi E.", action: "cancelled a completed transaction", time: "Yesterday" },
  { id: 5, actor: "Admin", action: "enabled Staff Login Notifications", time: "2 days ago" },
];

function buildInitialToggles() {
  const state = {};
  [...STAFF_TOGGLES, ...SALES_TOGGLES, ...TRANSACTION_TOGGLES, ...NOTIFICATION_TOGGLES].forEach(
    (t) => (state[t.key] = t.defaultOn)
  );
  return state;
}

function Switch({ on, onToggle, ariaLabel }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      className={`set-switch ${on ? "set-switch--on" : ""}`}
      onClick={onToggle}
    />
  );
}

export default function Settings({ onBack, isAdmin: isAdminProp = true }) {
  const [isAdmin, setIsAdmin] = useState(isAdminProp);
  const [general, setGeneral] = useState(INITIAL_GENERAL);
  const [toggles, setToggles] = useState(buildInitialToggles);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [saveState, setSaveState] = useState("idle"); // idle | saved

  const staffPolicyCount = STAFF_TOGGLES.length;
  const salesPolicyCount = SALES_TOGGLES.length;

  const enabledSalesCount = useMemo(
    () => SALES_TOGGLES.filter((t) => toggles[t.key]).length,
    [toggles]
  );

  function updateGeneralField(field, value) {
    setGeneral((prev) => ({ ...prev, [field]: value }));
  }

  function toggle(key) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleSave() {
    setSaveState("saved");
    window.setTimeout(() => setSaveState("idle"), 1500);
  }

  return (
    <div className="set-root">
      <div className="set-frame">
        {/* Top bar */}
        <div className="set-topbar">
          <button type="button" className="set-icon-btn" aria-label="Go back" onClick={onBack}>
            <ArrowLeft size={16} strokeWidth={2.5} />
          </button>
          <div className="set-topbar-title">
            <span>Settings</span>
            {/* <span className="set-live-dot" aria-hidden="true" /> */}
          </div>
          <div className="set-bell-wrap">
            <button type="button" className="set-icon-btn" aria-label="Notifications">
              <Bell size={16} />
            </button>
            <span className="set-bell-dot" aria-hidden="true" />
          </div>
        </div>

        {/* Intro header */}
        <header className="set-header">
          <div className="set-header-row">
            <div />
            
          </div>
          <p className="set-intro-copy">
            Configure operational rules, business identity, POS permissions, and review recent audit events.
          </p>
        </header>

        {isAdmin ? (
          <main className="set-content">
            {/* 1. General Settings */}
            <section className="set-section">
              <div className="set-section-head">
                <div className="set-section-title-group">
                  <span className="set-section-bullet" aria-hidden="true" />
                  <h2 className="set-section-title">General Settings</h2>
                </div>
                <span className="set-section-tag">Store Profile</span>
              </div>
              <div className="set-fields">
                <div>
                  <label className="set-field-label" htmlFor="set-business-name">
                    Business Name
                  </label>
                  <input
                    id="set-business-name"
                    className="set-input"
                    type="text"
                    placeholder="Enter official business name"
                    value={general.businessName}
                    onChange={(e) => updateGeneralField("businessName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="set-field-label" htmlFor="set-business-phone">
                    Business Phone
                  </label>
                  <input
                    id="set-business-phone"
                    className="set-input"
                    type="tel"
                    placeholder="+234..."
                    value={general.businessPhone}
                    onChange={(e) => updateGeneralField("businessPhone", e.target.value)}
                  />
                </div>
                <div>
                  <label className="set-field-label" htmlFor="set-business-email">
                    Business Email
                  </label>
                  <input
                    id="set-business-email"
                    className="set-input"
                    type="email"
                    placeholder="billing or contact email"
                    value={general.businessEmail}
                    onChange={(e) => updateGeneralField("businessEmail", e.target.value)}
                  />
                </div>
                <div>
                  <label className="set-field-label" htmlFor="set-business-address">
                    Business Address
                  </label>
                  <textarea
                    id="set-business-address"
                    className="set-textarea"
                    rows={2}
                    placeholder="Store branch or street address"
                    value={general.businessAddress}
                    onChange={(e) => updateGeneralField("businessAddress", e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* 2. Staff & Roles */}
            <section className="set-section">
              <div className="set-section-head set-section-head--tight">
                <div className="set-section-title-group">
                  <span className="set-section-bullet" aria-hidden="true" />
                  <h2 className="set-section-title">Staff &amp; Roles</h2>
                </div>
                <span className="set-section-tag">{staffPolicyCount} Policies</span>
              </div>
              <div className="set-toggle-list">
                {STAFF_TOGGLES.map((t) => (
                  <div className="set-toggle-row set-toggle-row--wide" key={t.key}>
                    <div className="set-toggle-copy">
                      <span className="set-toggle-label">{t.label}</span>
                      <p className="set-toggle-desc">{t.desc}</p>
                    </div>
                    <Switch on={toggles[t.key]} onToggle={() => toggle(t.key)} ariaLabel={t.label} />
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Sales Settings */}
            <section className="set-section">
              <div className="set-section-head set-section-head--tight">
                <div className="set-section-title-group">
                  <span className="set-section-bullet" aria-hidden="true" />
                  <h2 className="set-section-title">Sales Settings</h2>
                </div>
                <span className="set-section-tag">
                  {enabledSalesCount}/{salesPolicyCount} Enabled
                </span>
              </div>
              <div className="set-toggle-list">
                {SALES_TOGGLES.map((t) => (
                  <div className="set-toggle-row set-toggle-row--simple" key={t.key}>
                    <span className="set-toggle-label">{t.label}</span>
                    <Switch on={toggles[t.key]} onToggle={() => toggle(t.key)} ariaLabel={t.label} />
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Transaction Settings */}
            <section className="set-section">
              <div className="set-section-head set-section-head--tight">
                <div className="set-section-title-group">
                  <span className="set-section-bullet" aria-hidden="true" />
                  <h2 className="set-section-title">Transaction Settings</h2>
                </div>
                <span className="set-section-tag">Audit Lock</span>
              </div>
              <div className="set-toggle-list">
                {TRANSACTION_TOGGLES.map((t) => (
                  <div className="set-toggle-row set-toggle-row--simple" key={t.key}>
                    <span className="set-toggle-label">{t.label}</span>
                    <Switch on={toggles[t.key]} onToggle={() => toggle(t.key)} ariaLabel={t.label} />
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Notifications */}
            <section className="set-section">
              <div className="set-section-head set-section-head--tight">
                <div className="set-section-title-group">
                  <span className="set-section-bullet" aria-hidden="true" />
                  <h2 className="set-section-title">Notifications</h2>
                </div>
                <span className="set-section-tag">Push &amp; Alerts</span>
              </div>
              <div className="set-toggle-list">
                {NOTIFICATION_TOGGLES.map((t) => (
                  <div className="set-toggle-row set-toggle-row--simple" key={t.key}>
                    <span className="set-toggle-label">{t.label}</span>
                    <Switch on={toggles[t.key]} onToggle={() => toggle(t.key)} ariaLabel={t.label} />
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Security */}
            <section className="set-section">
              <div className="set-section-head">
                <div className="set-section-title-group">
                  <span className="set-section-bullet" aria-hidden="true" />
                  <h2 className="set-section-title">Security</h2>
                </div>
                <span className="set-section-tag">Timeout Policy</span>
              </div>
              <div>
                <label className="set-security-label">Session Timeout</label>
                <div className="set-segmented" role="radiogroup" aria-label="Session timeout duration">
                  {SESSION_TIMEOUT_OPTIONS.map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      role="radio"
                      aria-checked={sessionTimeout === mins}
                      className={`set-segmented-btn ${
                        sessionTimeout === mins ? "set-segmented-btn--active" : ""
                      }`}
                      onClick={() => setSessionTimeout(mins)}
                    >
                      {mins} minutes
                    </button>
                  ))}
                </div>
                <p className="set-security-note">
                  Terminates active session token if no terminal activity is detected.
                </p>
              </div>
            </section>

            {/* 7. Activity Log
            <section className="set-section">
              <div className="set-section-head">
                <div className="set-section-title-group">
                  <span className="set-section-bullet" aria-hidden="true" />
                  <h2 className="set-section-title">Activity Log</h2>
                </div>
                <span className="set-section-tag">Recent Actions</span>
              </div>
              <div className="set-activity-list">
                {ACTIVITY_LOG.map((entry) => (
                  <div className="set-activity-item" key={entry.id}>
                    <span className="set-activity-icon">
                      <History size={15} />
                    </span>
                    <div className="set-activity-body">
                      <p className="set-activity-line">
                        <strong>{entry.actor}</strong> {entry.action}
                      </p>
                      <p className="set-activity-time">{entry.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section> */}

            {/* Save action */}
            <div className="set-save-wrap">
              <button
                type="button"
                className={`set-save-btn ${saveState === "saved" ? "set-save-btn--saved" : ""}`}
                onClick={handleSave}
              >
                <Check size={16} strokeWidth={2.5} />
                <span>{saveState === "saved" ? "Settings Saved" : "Save Settings"}</span>
              </button>
            </div>

            <footer className="set-footnote">
              <div className="set-footnote-row">
                <Check size={14} strokeWidth={2.5} color="var(--set-blue-600)" />
                <span>All changes stored to WorkHouse cache &amp; central server.</span>
              </div>
              <p className="set-footnote-sub">WorkHouse AUDIT ENGINE • v2.4.8-pos</p>
            </footer>
          </main>
        ) : (
          <main className="set-restricted">
            <div className="set-restricted-icon">
              <ShieldAlert size={32} strokeWidth={1.8} />
            </div>
            <h2 className="set-restricted-title">Access Restricted</h2>
            <p className="set-restricted-copy">
              This area is restricted to System Administrators only. You do not have permission to view or
              modify store-wide configuration.
            </p>
            <button type="button" className="set-restricted-btn" onClick={() => setIsAdmin(true)}>
              <ShieldCheck size={14} strokeWidth={2.5} />
              Switch Back to Admin View
            </button>
          </main>
        )}
      </div>
    </div>
  );
}