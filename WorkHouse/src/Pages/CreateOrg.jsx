import React, { useState } from "react";
import {
  ArrowBackIosNew,
  ArrowDown,
  ArrowRight,
  Building2,
  CheckCircle2,
  CloudUpload,
  FolderOpen,
  ImagePlus,
  LockKeyhole,
  UserRound,
  Verified,
} from "lucide-react";
import "./createorg.css";

export default function CreateOrg({ onBack, onSubmit }) {
  const [logo, setLogo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  function handleLogoChange(event) {
    const file = event.target.files?.[0];
    if (file) setLogo({ name: file.name, url: URL.createObjectURL(file) });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const formData = new FormData(event.currentTarget);
    if (onSubmit) {
      Promise.resolve(onSubmit(formData))
        .then(() => setCreated(true))
        .finally(() => setSubmitting(false));
    } else {
      setSubmitting(false);
    }
  }

  return (
    <div className="create-org-page">
      <header className="create-org-header">
        <div className="create-org-header-inner">
          <div className="create-org-brand">
            <button className="back-button" type="button" aria-label="Go back" onClick={onBack ?? (() => window.history.back())}>
              <ArrowBackIosNew size={18} />
            </button>
            <div className="brand-heading">
              <span className="brand-name">WorkHouse</span>
              <h1>Sign In</h1>
            </div>
          </div>
          <div className="user-avatar" aria-label="User"><UserRound size={18} /></div>
        </div>
      </header>

      <main className="create-org-main">
        <div className="create-org-container">
          <section className="create-org-intro">
            <div className="step-badge"><span className="step-dot" />Step 1 of 2 • Workspace Setup</div>
            <h2>Create Your Organisation</h2>
            <p>Set up your organisation and start managing your team, sales, and operations in WorkHouse.</p>
          </section>

          <div className="progress-card">
            <div className="progress-left">
              <span className="progress-number">1</span>
              <span className="progress-copy"><strong>Entity Identity</strong><small>General metadata &amp; branding</small></span>
            </div>
            <span className="progress-status">In Progress</span>
          </div>

          <form className="org-form" id="orgForm" onSubmit={handleSubmit}>
            <div className="form-field">
              <div className="field-label-row"><label htmlFor="orgName">Organisation Name <span className="required">*</span></label><span className="field-hint">Required</span></div>
              <div className="input-wrap"><Building2 className="field-icon" size={20} /><input id="orgName" name="organisation_name" placeholder="e.g. Acme Retail Solutions" required /></div>
            </div>

            <div className="form-field">
              <label htmlFor="logoFileInput">Organisation Logo</label>
              <div className="upload-card">
                <div className="upload-details">
                  <div className="logo-preview">
                    {logo ? <img src={logo.url} alt="Organisation logo preview" /> : <ImagePlus size={28} />}
                  </div>
                  <div className="upload-copy"><strong>High-Resolution Insignia</strong><p>PNG, JPG, or SVG up to 5MB (400×400px recommended)</p></div>
                </div>
                <div className="upload-controls">
                  <span className="upload-status"><CloudUpload size={16} />{logo?.name ?? "No file chosen"}</span>
                  <label className="browse-button" htmlFor="logoFileInput"><FolderOpen size={18} />Browse Files</label>
                  <input className="visually-hidden" id="logoFileInput" name="logo" type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleLogoChange} />
                </div>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="industrySelect">Industry / Category</label>
              <div className="input-wrap select-wrap"><Building2 className="field-icon" size={20} /><select id="industrySelect" name="industry" defaultValue="" required>
                <option value="" disabled>Select operating sector...</option>
                <option value="retail">Retail &amp; Supermarket</option>
                <option value="wholesale">Wholesale &amp; Distribution</option>
                <option value="logistics">Logistics &amp; Supply Chain</option>
                <option value="hospitality">Hospitality &amp; Food Services</option>
              </select><ArrowDown className="select-chevron" size={18} /></div>
            </div>

            <div className="form-field">
              <div className="field-label-row"><label htmlFor="orgDescription">Description (Optional)</label><span className="field-hint">Max 300 chars</span></div>
              <textarea id="orgDescription" name="description" maxLength={300} rows={3} placeholder="Brief overview of your company, stores, or industry sector..." />
            </div>

            <aside className="authority-note">
              <span className="authority-icon"><Verified size={20} /></span>
              <div><h3>Admin Rights &amp; Authority</h3><p>The person who creates this organisation automatically becomes its Super Administrator and can configure roles, permissions, and staff settings.</p></div>
            </aside>

            <div className="form-actions">
              <button className="submit-button" id="btnSubmit" type="submit" disabled={submitting || created}>
                {created ? <><CheckCircle2 size={20} />Workspace Created!</> : submitting ? <><span className="loading-spinner" />Provisioning Tenant...</> : <>Create Organisation<ArrowRight size={20} /></>}
              </button>
              <button className="cancel-button" type="button" onClick={onBack ?? (() => window.history.back())}>Cancel and return to Welcome</button>
            </div>

            <div className="session-security"><LockKeyhole size={16} /><span>256-bit TLS Encrypted Session • Enterprise Cloud Provisioning</span></div>
          </form>
        </div>
      </main>
    </div>
  );
}
