import React, { useState } from 'react';
import '../Styles/permissions.css';

const DEFAULT_PERMISSIONS = {
  'Sales Representative': {
    'Full Payment': true,
    'Advanced Payment': true,
    'Balance Up': true,
    'View Today Sales': true,
    'Search Transactions': false,
    'View Own History': true,
    'Manage Staff': false,
    'Manage Settings': false,
    'Edit Completed Transactions': false,
    'Delete Transactions': false,
  },
  Manager: {
    'Full Payment': true,
    'Advanced Payment': true,
    'Balance Up': true,
    'View Today Sales': true,
    'Search Transactions': true,
    'View Own History': true,
    'Manage Staff': true,
    'Manage Settings': false,
    'Edit Completed Transactions': true,
    'Delete Transactions': false,
  },
  Administrator: {
    'Full Payment': true,
    'Advanced Payment': true,
    'Balance Up': true,
    'View Today Sales': true,
    'Search Transactions': true,
    'View Own History': true,
    'Manage Staff': true,
    'Manage Settings': true,
    'Edit Completed Transactions': true,
    'Delete Transactions': true,
  },
};

const ROLE_META = {
  'Sales Representative': {
    subtitle: 'Floor POS cashiers & counter staff',
    activeCount: '5 Active',
    icon: (
      <svg className="role-icon" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  Manager: {
    subtitle: 'Store supervisors & shift leaders',
    activeCount: '8 Active',
    icon: (
      <svg className="role-icon" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  Administrator: {
    subtitle: 'Executive & full retail system authority',
    activeCount: '10 Active',
    icon: (
      <svg className="role-icon" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

function TogglePill({ on, onToggle, label }) {
  return (
    <button
      type="button"
      className={`toggle-pill ${on ? 'is-on' : 'is-off'}`}
      onClick={onToggle}
      aria-label={`Toggle ${label}`}
      aria-pressed={on}
    >
      <span className="toggle-label">{on ? 'ON' : 'OFF'}</span>
      <span className="toggle-thumb" />
    </button>
  );
}

export default function Permissions({ onBack }) {
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: '' }), 1600);
  };

  const togglePermission = (role, key) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: !prev[role][key],
      },
    }));
    showToast('Changes saved automatically');
  };

  const resetDefaults = () => {
    setPermissions(DEFAULT_PERMISSIONS);
    showToast('Role defaults restored');
  };

  return (
    <div className="permissions-page">
      {/* Optional minimal top bar – remove if you already have one */}
      <header className="permissions-header">
        <button type="button" className="back-btn" onClick={onBack} aria-label="Go back">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="brand">Permissions</span>
      </header>

      <main className="permissions-main">
        {/* Intro card */}
        <section className="intro-card">
          <div className="intro-left">
            <div className="intro-title-row">
              <h1>Permissions</h1>
              <span className="rbac-badge">RBAC</span>
            </div>
            <p className="intro-subtitle">
              Admin controls what each role can access. Changes are automatically saved
            </p>
          </div>
          <button type="button" className="reset-btn" onClick={resetDefaults}>
            Reset Defaults
          </button>
        </section>

        {/* Role cards */}
        {Object.keys(DEFAULT_PERMISSIONS).map((role) => {
          const meta = ROLE_META[role];
          return (
            <section key={role} className="role-card">
              <div className="role-card-header">
                <div className="role-info">
                  <div className="role-icon-wrap">{meta.icon}</div>
                  <div>
                    <h2>{role}</h2>
                    <p>{meta.subtitle}</p>
                  </div>
                </div>
                <span className="active-badge">{meta.activeCount}</span>
              </div>

              <div className="permission-list">
                {Object.keys(permissions[role]).map((key) => (
                  <div key={key} className="permission-row">
                    <span>{key}</span>
                    <TogglePill
                      on={permissions[role][key]}
                      label={key}
                      onToggle={() => togglePermission(role, key)}
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </main>

      <footer className="permissions-footer">
        <div className="footer-status">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>All changes stored to WorkHouse local cache &amp; central server.</span>
        </div>
        <div className="footer-version">v2.4.8-pos</div>
      </footer>

      {/* Toast */}
      <div className={`toast ${toast.visible ? 'toast-visible' : ''}`}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}