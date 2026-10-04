import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  IdCard,
  LockKeyhole,
  Package,
  Settings2,
  ShieldCheck,
} from 'lucide-react';
import '../Styles/admindashboard.css';
import ChatbotWindow from '../Adminfunctions/ChatbotWindow.jsx';
import { getStatus } from './StoreInventory.jsx';
import { getStaff } from '../utils/staffStore.js';

function StatusPill({ tone, pulse, children }) {
  return (
    <div className={`status-pill status-pill-${tone}`}>
      <span className={`status-dot ${pulse ? 'status-dot-pulse' : ''}`} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

export default function AdminDashboard({ onBack, onNavigate, products = [] }) {
  const revealRefs = useRef([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Reads fresh from the staff store each time this component mounts,
  // so it reflects whatever was last saved in StaffAccounts.
  const [staff] = useState(() => getStaff());

  // Live inventory counts, computed from the same products array
  // App.jsx passes down to StoreInventory, so this card always
  // reflects real, current data — including anything just added.
  const inventoryCounts = useMemo(() => {
    const skuCount = products.length;
    const restockAlerts = products.filter((p) => {
      const status = getStatus(p.stock);
      return status === 'low' || status === 'out';
    }).length;
    return { skuCount, restockAlerts };
  }, [products]);

  // Live staff counts, computed from the shared staff directory.
  const staffCounts = useMemo(() => {
    const listed = staff.length;
    const onlineNow = staff.filter((s) => s.online && s.status === 'active').length;
    return { listed, onlineNow };
  }, [staff]);

  const modules = [
    {
      id: 'inventory',
      eyebrow: 'Stock & Asset Logistics',
      title: 'Store Inventory',
      description:
        'Monitor stock balances, warehouse transfers, reorder triggers, and low-inventory alerts across registers.',
      icon: Package,
      statusTone: 'warning',
      status: (
        <>
          <strong>{inventoryCounts.skuCount.toLocaleString('en-NG')} Active SKUs</strong>
          <span className="status-separator">•</span>
          <strong className="status-danger">
            {inventoryCounts.restockAlerts} Restock Alert{inventoryCounts.restockAlerts === 1 ? '' : 's'}
          </strong>
        </>
      ),
      ariaLabel: 'Manage Store Inventory',
    },
    {
      id: 'permissions',
      eyebrow: 'Security & Access Control',
      title: 'Permissions',
      description:
        'Configure role-based access levels, staff workstation authorization, POS terminal unlocks, and manager clearance.',
      icon: ShieldCheck,
      statusTone: 'success',
      status: (
        <>
          <strong>4 Roles Configured</strong>
          <span className="status-separator">•</span>
          <strong className="status-success-text">Audit Guard Active</strong>
        </>
      ),
      ariaLabel: 'Manage Access Permissions',
    },
    {
      id: 'staff',
      eyebrow: 'Human Resources & Directory',
      title: 'Manage Staffs',
      description:
        'Oversee employee profiles, workstation assignments, cashier shift schedules, active on-duty tracking, and staff credentials.',
      icon: IdCard,
      statusTone: 'primary',
      pulse: true,
      status: (
        <>
          <strong>{staffCounts.listed} Personnel Listed</strong>
          <span className="status-separator">•</span>
          <strong className="status-primary-text">{staffCounts.onlineNow} Online Now</strong>
        </>
      ),
      ariaLabel: 'Manage Staff Directory',
    },
    {
      id: 'notifications',
      eyebrow: 'System Alerts & Audit',
      title: 'Notifications',
      description:
        'Broadcast enterprise notices, review real-time register alerts, cash discrepancy warnings, and daily closeout memos.',
      icon: Bell,
      iconAlert: true,
      statusTone: 'danger',
      status: <strong>2 Unread Priority Alerts</strong>,
      ariaLabel: 'View System Notifications',
    },
    {
      id: 'settings',
      eyebrow: 'System Configuration',
      title: 'Settings',
      description:
        'Fine-tune global tax rates, receipt printer templates, payment gateway connectors, hardware peripherals, and audit logging.',
      icon: Settings2,
      statusTone: 'neutral',
      status: <strong>Auto-Backup Enabled</strong>,
      ariaLabel: 'Open Enterprise Settings',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    revealRefs.current.filter(Boolean).forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const handleModuleKeyDown = (event, moduleId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNavigate?.(moduleId);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div className="admin-header-left">
            <button
              className="icon-button"
              type="button"
              aria-label="Go back"
              onClick={onBack ?? (() => window.history.back())}
            >
              <ArrowLeft size={20} strokeWidth={2.2} />
            </button>
            <span className="brand-name"></span>
            {/* <span className="header-divider" aria-hidden="true" /> */}
            <span className="page-title">Admin Dashboard</span>
          </div>

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
                <linearGradient id="adminRobotShell" x1="4" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF" />
                  <stop offset="0.55" stopColor="#DCE5F2" />
                  <stop offset="1" stopColor="#AAB9CC" />
                </linearGradient>
                <linearGradient id="adminRobotScreen" x1="8" y1="7" x2="17" y2="17" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#253B63" />
                  <stop offset="0.5" stopColor="#101B35" />
                  <stop offset="1" stopColor="#060B18" />
                </linearGradient>
                <radialGradient id="adminRobotEye" cx="0" cy="0" r="1" gradientTransform="translate(10 11) rotate(90) scale(2.2)">
                  <stop stopColor="#FFFFFF" />
                  <stop offset="0.65" stopColor="#D7E8FF" />
                  <stop offset="1" stopColor="#70A8FF" />
                </radialGradient>
                <filter id="adminRobotGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="0.35" />
                </filter>
              </defs>
              <path d="M4.1 10.2a7.9 7.9 0 0 1 15.8 0" stroke="#91A4BE" strokeWidth="1.3" strokeLinecap="round" />
              <rect x="2.7" y="10.2" width="2.2" height="4.8" rx="1.1" fill="#8FA1B9" />
              <rect x="19.1" y="10.2" width="2.2" height="4.8" rx="1.1" fill="#8FA1B9" />
              <rect x="4.8" y="4.8" width="14.4" height="14.4" rx="4.8" fill="url(#adminRobotShell)" stroke="#8799B1" strokeWidth="0.7" />
              <path d="M7.4 6.4c2.1-1.1 6.9-1 9.1.3" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="0.8" strokeLinecap="round" />
              <rect x="6.7" y="7.7" width="10.6" height="8.7" rx="3.35" fill="url(#adminRobotScreen)" stroke="#34496D" strokeWidth="0.55" />
              <ellipse cx="10" cy="11.2" rx="1.05" ry="1.25" fill="#7EB2FF" opacity="0.55" filter="url(#adminRobotGlow)" />
              <ellipse cx="14" cy="11.2" rx="1.05" ry="1.25" fill="#7EB2FF" opacity="0.55" filter="url(#adminRobotGlow)" />
              <ellipse cx="10" cy="11.2" rx="0.68" ry="0.85" fill="url(#adminRobotEye)" />
              <ellipse cx="14" cy="11.2" rx="0.68" ry="0.85" fill="url(#adminRobotEye)" />
              <path d="M9.25 13.65c.72.78 1.55 1.12 2.75 1.12s2.03-.34 2.75-1.12" stroke="#B9D7FF" strokeWidth="0.85" strokeLinecap="round" />
              <path d="M19.7 14.8v2.15c0 1.05-.85 1.9-1.9 1.9h-1.1" stroke="#8296B2" strokeWidth="0.9" strokeLinecap="round" />
              <rect x="15.5" y="18.1" width="2.3" height="1.15" rx="0.57" fill="#7186A3" />
            </svg>
            <span className="notification-dot" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-content">
          <section className="dashboard-intro" aria-labelledby="dashboard-heading">
            <div>
              {/* <p className="eyebrow">Enterprise control center</p> */}
              {/* <h1 id="dashboard-heading">Admin Dashboard</h1> */}
              {/* <p className="intro-copy">Manage your connected retail operations from one secure workspace.</p> */}
            </div>
          </section>

          <div className="section-heading">
            <span>Management Modules</span>
            <span className="module-count">5 Integrated Systems</span>
          </div>

          <section className="module-list" aria-label="Management modules">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <article
                  className="module-card reveal-item"
                  key={module.id}
                  ref={(element) => {
                    revealRefs.current[index] = element;
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={module.ariaLabel}
                  onClick={() => onNavigate?.(module.id)}
                  onKeyDown={(event) => handleModuleKeyDown(event, module.id)}
                >
                  <div className="module-card-main">
                    <div className={`module-icon ${module.iconAlert ? 'has-alert' : ''}`}>
                      <Icon size={26} strokeWidth={1.9} />
                      {module.iconAlert && <span className="module-alert-dot" aria-hidden="true" />}
                    </div>

                    <div className="module-copy">
                      <div className="module-eyebrow-row">
                        <span className="module-eyebrow">{module.eyebrow}</span>
                        {module.badge && <span className="new-badge">{module.badge}</span>}
                      </div>
                      <h2>{module.title}</h2>
                      <p>{module.description}</p>
                    </div>

                    <span className="module-arrow" aria-hidden="true">
                      <ChevronRight size={18} strokeWidth={2.2} />
                    </span>
                  </div>

                  <div className="module-card-footer">
                    <StatusPill tone={module.statusTone} pulse={module.pulse}>
                      {module.status}
                    </StatusPill>
                  </div>
                </article>
              );
            })}
          </section>

          <footer className="security-footnote">
            <div className="security-label">
              <LockKeyhole size={15} strokeWidth={2} />
              <span>Restricted Administrative Access</span>
            </div>
            <p>WorkHouse System • High Integrity AES-256 GCM</p>
          </footer>
        </div>
      </main>

      <ChatbotWindow
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  );
}