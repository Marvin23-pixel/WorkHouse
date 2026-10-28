import React, { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Check,
  CheckCircle2,
  Clock3,
  Cloud,
  KeyRound,
  LockKeyhole,
  PackageCheck,
  Settings2,
  ShieldCheck,
  Users,
  UserRound,
  Warehouse,
  X,
} from "lucide-react";
import "../Styles/createorg2.css";

function AppSelect({ id, label, icon: Icon, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedLabel = options.find((option) => option.value === value)?.label;

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!dropdownRef.current?.contains(event.target)) setOpen(false);
    }
    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="setup-field">
      <label id={`${id}-label`}>{label}</label>
      <div className="app-select" ref={dropdownRef}>
        <input type="hidden" name={id} value={value} />
        <button
          className={`app-select-trigger${open ? " is-open" : ""}`}
          type="button"
          role="combobox"
          aria-labelledby={`${id}-label`}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <Icon className="select-leading-icon" size={18} />
          <span>{selectedLabel}</span>
          <ArrowDown className={`select-chevron${open ? " is-open" : ""}`} size={18} />
        </button>
        {open && (
          <div className="app-select-menu" role="listbox" aria-label={label}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={value === option.value}
                className={`app-select-option${value === option.value ? " is-selected" : ""}`}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span>{option.label}</span>
                {value === option.value && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>
      {id === "workspaceSize" && <small>Helps allocate server throughput and license provisioning.</small>}
      {id === "timeZone" && <small>Used for attendance, daily sales sheets, and immutable activity logs.</small>}
    </div>
  );
}

const moduleDefinitions = [
  {
    id: "sales",
    name: "Sales & Transactions",
    detail: "POS & Invoicing",
    description: "Record register sales, receipts, partial payments, and outstanding vendor balances.",
    icon: PackageCheck,
    tone: "blue",
  },
  {
    id: "analytics",
    name: "Reports & Analytics",
    detail: "Real-Time BI",
    description: "Monitor margins, peak revenue hours, staff productivity, and export audit sheets.",
    icon: BarChart3,
    tone: "indigo",
  },
  {
    id: "activity",
    name: "Activity & Notifications",
    detail: "Instant Alerts",
    description: "Push alerts for discrepancy thresholds, unauthorized sign-ins, and daily reconciliations.",
    icon: Activity,
    tone: "slate",
  },
];

export default function CreateOrg2({ onBack, onComplete }) {
  const [workspaceSize, setWorkspaceSize] = useState("11-50");
  const [timeZone, setTimeZone] = useState("WAT");
  const [purpose, setPurpose] = useState("sales");
  const [enabledModules, setEnabledModules] = useState(["sales", "analytics", "activity"]);
  const [showProvisionModal, setShowProvisionModal] = useState(false);

  const selectedCount = 1 + enabledModules.length; // Staff Management is included and locked on.

  function toggleModule(moduleId) {
    setEnabledModules((current) =>
      current.includes(moduleId)
        ? current.filter((id) => id !== moduleId)
        : [...current, moduleId]
    );
  }

  function handleComplete() {
    setShowProvisionModal(true);
  }

  function enterWorkspace() {
    setShowProvisionModal(false);
    onComplete?.({ workspaceSize, timeZone, purpose, modules: ["staff", ...enabledModules] });
  }

  return (
    <div className="create-org2-page">
      <header className="setup-header">
        <div className="setup-header-inner">
          <div className="setup-brand">
            <button
              className="setup-back-button"
              type="button"
              aria-label="Go back"
              onClick={onBack ?? (() => window.history.back())}
            >
              <ArrowLeft size={20} />
            </button>
            <div className="setup-brand-copy">
              <span>WorkHouse</span>
              <h1>Workspace Setup</h1>
            </div>
          </div>
          <div className="setup-user-icon" aria-label="Profile"><UserRound size={18} /></div>
        </div>
      </header>

      <main className="setup-main">
        <div className="setup-container">
          <section className="setup-intro">
            <span className="setup-step-badge"><span />Step 2 of 2 • Workspace Configuration</span>
            <h2>Configure Your Workspace</h2>
            <p>Personalise your workspace so your team has everything it needs to get started.</p>
          </section>

          <section className="setup-progress" aria-label="Setup progress">
            <div className="progress-steps">
              <div className="progress-step">
                <span className="progress-step-icon done"><CheckCircle2 size={16} /></span>
                <span><strong>1. Entity Identity</strong><small>Completed</small></span>
              </div>
              <span className="progress-separator"><ArrowRight size={17} /></span>
              <div className="progress-step current">
                <span className="progress-step-icon active">2</span>
                <span><strong>2. Workspace Setup</strong><small>In Progress</small></span>
              </div>
            </div>
            <div className="progress-bars"><span /><span /></div>
          </section>

          <section className="provisioning-banner">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNpoO3JIROe1d2M_EkA182_PsQbeRDt588sRfyv6XY0bRh-Io8q2rKoaOaNbYGczEdAwtCSoRBvWi-FrK2-w-OxQGeyQeSRoEZxzZCGGYHgilSaKy7dD29gmVHRNEWN3M-b9rLsMn_qTMWIeUECpu76zAWx5hyJtgZNdGzZQqZzMiOxgBQJWMvBW6uPnXdG1JuSw20VdwbEZrap21DlaCc9CeuR7fZWs5W1k_k3w"
              alt="Collaborative team configuring digital workflows"
            />
            <div className="banner-shade" />
            <div className="banner-copy"><span>Fast Provisioning</span><strong>Instant Cloud Sandbox</strong><small>Zero manual deployment required</small></div>
          </section>

          <section className="setup-card preferences-card">
            <div className="card-heading">
              <span className="card-heading-icon"><Settings2 size={18} /></span>
              <div><h3>General Parameters</h3><p>Set operational constraints and defaults</p></div>
            </div>

            <AppSelect
              id="workspaceSize"
              label="Workspace Size"
              icon={Users}
              value={workspaceSize}
              onChange={setWorkspaceSize}
              options={[
                { value: "1-10", label: "1–10 employees (Micro Team)" },
                { value: "11-50", label: "11–50 employees (Growing Operation)" },
                { value: "51-200", label: "51–200 employees (Mid-Market Division)" },
                { value: "200+", label: "200+ employees (Enterprise Organization)" },
              ]}
            />
            <AppSelect
              id="timeZone"
              label="Operational Time Zone"
              icon={Clock3}
              value={timeZone}
              onChange={setTimeZone}
              options={[
                { value: "WAT", label: "UTC+01:00 (West Africa Time / Lagos)" },
                { value: "GMT", label: "UTC+00:00 (Greenwich Mean Time / London)" },
                { value: "EST", label: "UTC−05:00 (Eastern Standard Time / New York)" },
                { value: "GST", label: "UTC+04:00 (Gulf Standard Time / Dubai)" },
                { value: "CAT", label: "UTC+02:00 (Central Africa Time / Johannesburg)" },
              ]}
            />
            <AppSelect
              id="workspacePurpose"
              label="Primary Workspace Purpose"
              icon={Warehouse}
              value={purpose}
              onChange={setPurpose}
              options={[
                { value: "sales", label: "Sales & Operations Focus" },
                { value: "staff", label: "Staff Attendance & Payroll Only" },
                { value: "general", label: "General Corporate Business Management" },
                { value: "logistics", label: "Warehouse & Inventory Distribution" },
              ]}
            />
          </section>

          <section className="setup-card modules-card">
            <div className="modules-heading">
              <div><h3>Choose Modules</h3><p>Select features to boot initially. You can enable others later.</p></div>
              <span className="selected-count">{selectedCount} Selected</span>
            </div>
            <div className="module-list">
              <div className="module-card module-core" aria-label="Staff Management module is included">
                <span className="module-icon primary"><Users size={20} /></span>
                <div className="module-content">
                  <div className="module-title-row"><strong>Staff Management</strong><span className="core-badge">Core • Included</span></div>
                  <p>Manage accounts, multi-branch rosters, biometric clock-in, and tiered roles.</p>
                </div>
                <span className="module-check locked"><Check size={16} /></span>
              </div>

              {moduleDefinitions.map(({ id, name, detail, description, icon: Icon, tone }) => {
                const checked = enabledModules.includes(id);
                return (
                  <label className={`module-card${checked ? " is-checked" : " is-unchecked"}`} key={id}>
                    <span className={`module-icon ${tone}`}><Icon size={20} /></span>
                    <span className="module-content">
                      <span className="module-title-row"><strong>{name}</strong><span className="module-detail">{detail}</span></span>
                      <span className="module-description">{description}</span>
                    </span>
                    <input
                      className="module-checkbox"
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleModule(id)}
                      aria-label={`Enable ${name}`}
                    />
                    <span className="module-check"><Check size={16} /></span>
                  </label>
                );
              })}
            </div>
          </section>

          <aside className="admin-notice">
            <span className="admin-notice-icon"><ShieldCheck size={22} /></span>
            <div><h3>Super Administrator Privileges <BadgeCheck size={16} /></h3><p>You’ll be designated the Super Administrator of this organisation, holding control over staff credentials, billing, security keys, and workspace policies.</p></div>
          </aside>

          <div className="setup-actions">
            <button className="complete-setup-button" type="button" onClick={handleComplete}>Complete Setup &amp; Create Organisation<ArrowRight size={19} /></button>
            <button className="back-details-button" type="button" onClick={onBack ?? (() => window.history.back())}><ArrowLeft size={17} />Back to Organisation Details</button>
            <div className="setup-footer"><p>You can update workspace preferences and toggles at any time in Workspace Settings.</p><span><LockKeyhole size={14} />256-bit TLS Encrypted Session • Enterprise Cloud Provisioning</span></div>
          </div>
        </div>
      </main>

      {showProvisionModal && (
        <div className="provision-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowProvisionModal(false); }}>
          <section className="provision-modal" role="dialog" aria-modal="true" aria-labelledby="provision-title">
            <button className="modal-close" type="button" aria-label="Close" onClick={() => setShowProvisionModal(false)}><X size={18} /></button>
            <div className="modal-orbit"><Cloud size={32} /><span><Check size={14} /></span></div>
            <div className="modal-heading"><h2 id="provision-title">Provisioning Workspace...</h2><p>Preparing your workspace setup and selected modules.</p></div>
            <div className="provision-status-list">
              <div><CheckCircle2 size={16} /><span>Tenant namespace reserved</span></div>
              <div><CheckCircle2 size={16} /><span>Modules initialized ({selectedCount} selected)</span></div>
              <div className="status-pending"><KeyRound size={16} /><span>Generating operational keys...</span></div>
            </div>
            <button className="enter-workspace-button" type="button" onClick={enterWorkspace}>Enter Workspace Dashboard</button>
          </section>
        </div>
      )}
    </div>
  );
}
