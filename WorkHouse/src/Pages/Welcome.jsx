import React from "react";
import {
  Users,
  Building2,
  Plus,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  Lock,
} from "lucide-react";
import heroImage from "../assets/img1.png"; // put img1.png in src/assets/
import "../Styles/welcome.css";

function Welcome({ onJoin, onCreate, onContinue }) {
  const handleJoin = () => (onJoin || onContinue)?.();
  const handleCreate = () => (onCreate || onContinue)?.();

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        {/* Header */}
        <span className="welcome-badge">
          <span className="welcome-badge-dot" />
          WORKSPACE HUB
        </span>

        <h1 className="welcome-title">Welcome to WorkHouse</h1>
        <p className="welcome-subtitle">
          Access an existing enterprise workspace or set up a new organisation
          to manage your team.
        </p>

        {/* Hero card */}
        <div className="welcome-hero-card">
          <img
            src={heroImage}
            alt="Team collaborating around a table"
            className="welcome-hero-img"
          />
          <div className="welcome-hero-shade" />
          <div className="welcome-hero-caption">
            <span className="welcome-hero-caption-icon">
              <Users size={16} />
            </span>
            <span>Unified Team Workspaces</span>
          </div>
        </div>

        {/* Action cards */}
        <div className="welcome-actions">
          <button
            type="button"
            className="welcome-action welcome-action--primary"
            onClick={handleJoin}
          >
            <span className="welcome-action-icon welcome-action-icon--primary">
              <Building2 size={26} />
            </span>
            <span className="welcome-action-body">
              <span className="welcome-action-title">Join Organisation</span>
              <span className="welcome-action-text">
                Access an organisation you belong to or join via invite
              </span>
              <span className="welcome-action-meta welcome-action-meta--blue">
                <KeyRound size={14} />
                SSO or Workspace Token
              </span>
            </span>
            <span className="welcome-action-arrow welcome-action-arrow--blue">
              <ArrowRight size={18} />
            </span>
          </button>

          <button type="button" className="welcome-action" onClick={handleCreate}>
            <span className="welcome-action-icon welcome-action-icon--light">
              <Building2 size={24} />
              <Plus size={12} strokeWidth={3} className="welcome-action-plus" />
            </span>
            <span className="welcome-action-body">
              <span className="welcome-action-title">Create Organisation</span>
              <span className="welcome-action-text">
                Establish a new workspace for your company or team
              </span>
              <span className="welcome-action-meta">
                <ShieldCheck size={14} />
                Admin privileges &amp; 30-day trial
              </span>
            </span>
            <span className="welcome-action-arrow">
              <ArrowRight size={18} />
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="welcome-footer">
          <span className="welcome-security-pill">
            <Lock size={13} />
            Enterprise Knox Security • 256-bit TLS Encrypted
          </span>
          <p className="welcome-compliance">
            SOC-2 Type II Certified &amp; GDPR Compliant Cloud Infrastructure
          </p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;