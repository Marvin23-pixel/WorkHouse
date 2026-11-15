import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Bell,
  Search,
  X,
  Clock,
  Check,
  FileText,
} from "lucide-react";
import "../Styles/notifications.css"; 

const INITIAL_ACTIVITIES = [
  {
    id: "ACT-8842",
    category: "sales",
    actor: "Nsikak Solomon",
    initials: "NS",
    initialsTone: "blue",
    action: "Recorded new sale",
    actionTone: "blue",
    detail: (
      <>
        Monitor for <span className="notif-bold">₦850</span>{" "}
        <span className="notif-amber">(Advanced Payment)</span>
      </>
    ),
    time: "Aug 9, 2026 • 02:15 PM",
    badge: "Sales",
    badgeTone: "blue",
  },
  {
    id: "ACT-8849",
    category: "sales",
    actor: "Nsikak Solomon",
    initials: "NS",
    initialsTone: "blue",
    action: "Recorded balance payment",
    actionTone: "blue",
    detail: (
      <>
        <span className="notif-emerald">₦350</span> for Monitor{" "}
        <span className="notif-mono">(ID: ADV-20260809-0046)</span>
      </>
    ),
    time: "Aug 9, 2026 • 04:20 PM",
    badge: "Sales",
    badgeTone: "blue",
  },
  {
    id: "ACT-9102",
    category: "staff",
    actor: "Administrator",
    initials: "AD",
    initialsTone: "purple",
    action: "Added staff account",
    actionTone: "purple",
    detail: (
      <>
        <span className="notif-bold">Favour Eze</span>{" "}
        <span className="notif-blue">(Sales Representative)</span>
      </>
    ),
    time: "Aug 25, 2026 • 10:12 AM",
    badge: "Staff",
    badgeTone: "purple",
  },
  {
    id: "ACT-9120",
    category: "system",
    actor: "Administrator",
    initials: "AD",
    initialsTone: "amber",
    action: "Changed permission",
    actionTone: "amber",
    detail: (
      <>
        Manager: <span className="notif-emerald">manageStaff enabled</span>
      </>
    ),
    time: "Aug 25, 2026 • 11:05 AM",
    badge: "System",
    badgeTone: "amber",
  },
  {
    id: "ACT-9088",
    category: "staff",
    actor: "Desmond Otis",
    initials: "DO",
    initialsTone: "emerald",
    action: "Staff logged in",
    actionTone: "emerald",
    detail: (
      <>
        ID: <span className="notif-bold">desmond@digisol</span>
      </>
    ),
    time: "Aug 25, 2026 • 09:01 AM",
    badge: "Staff",
    badgeTone: "slate",
  },
  {
    id: "ACT-9155",
    category: "staff",
    actor: "Administrator",
    initials: "AD",
    initialsTone: "rose",
    action: "Deactivated staff account",
    actionTone: "rose",
    detail: (
      <>
        Target: <span className="notif-bold">Victor Osei</span>{" "}
        <span className="notif-muted">(Manager)</span>
      </>
    ),
    time: "Aug 25, 2026 • 03:40 PM",
    badge: "Staff",
    badgeTone: "rose",
  },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "sales", label: "Sales" },
  { key: "staff", label: "Staff" },
  { key: "system", label: "System" },
];

export default function Notifications({ onBack }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const counts = useMemo(() => {
    const c = { all: INITIAL_ACTIVITIES.length, sales: 0, staff: 0, system: 0 };
    INITIAL_ACTIVITIES.forEach((a) => {
      c[a.category] = (c[a.category] || 0) + 1;
    });
    return c;
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return INITIAL_ACTIVITIES.filter((item) => {
      const matchesCategory =
        activeFilter === "all" || item.category === activeFilter;
      const matchesQuery =
        !q ||
        item.actor.toLowerCase().includes(q) ||
        item.action.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        (typeof item.detail === "string" &&
          item.detail.toLowerCase().includes(q));
      return matchesCategory && matchesQuery;
    });
  }, [search, activeFilter]);

  const resetFilters = () => {
    setSearch("");
    setActiveFilter("all");
  };

  return (
    <div className="notifications-page">
      {/* Top sticky bar */}
      <div className="notif-topbar">
        <button
          className="notif-icon-btn"
          type="button"
          aria-label="Go back"
          onClick={onBack ?? (() => window.history.back())}
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>

        <div className="notif-brand">
          <span className="notif-brand-name">Notifications</span>
        </div>

        <div className="notif-bell-wrap">
          <button className="notif-icon-btn" type="button" aria-label="Notifications">
            <Bell size={16} strokeWidth={2} />
          </button>
          <span className="notif-alert-dot" />
        </div>
      </div>

      {/* Header */}
      <header className="notif-header">
        <div className="notif-header-row">
          <div>
            {/* <h1 className="notif-title">Notifications</h1> */}
          </div>
        </div>
        <p className="notif-subtitle">
          Review system alerts, staff activity, and audit events. Changes appear
          in real time.
        </p>
      </header>

      {/* Search + Filters */}
      <section className="notif-controls">
        <div className="notif-search-wrap">
          <Search size={16} className="notif-search-icon" />
          <input
            type="text"
            className="notif-search-input"
            placeholder="Search activity…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="notif-clear-btn"
              type="button"
              onClick={() => setSearch("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="notif-filter-row">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`notif-filter-chip ${
                activeFilter === f.key ? "active" : ""
              }`}
              onClick={() => setActiveFilter(f.key)}
            >
              <span>{f.label}</span>
              <span className="notif-chip-count">{counts[f.key]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Activity count */}
      <div className="notif-count-row">
        <span className="notif-count-label">Activity Feed</span>
        <span className="notif-count-value">
          Showing {filtered.length} event{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Activity List */}
      {filtered.length === 0 ? (
        <div className="notif-empty">
          <div className="notif-empty-icon">
            <FileText size={24} strokeWidth={1.8} />
          </div>
          <h4>No activity found</h4>
          <p>No administrative activity recorded yet.</p>
          <button
            type="button"
            className="notif-reset-btn"
            onClick={resetFilters}
          >
            Clear search &amp; filters
          </button>
        </div>
      ) : (
        <section className="notif-list">
          {filtered.map((item) => (
            <article key={item.id} className="notif-card">
              <div className="notif-card-inner">
                <div className="notif-card-left">
                  <span
                    className={`notif-avatar notif-avatar-${item.initialsTone}`}
                  >
                    {item.initials}
                  </span>
                  <div className="notif-card-body">
                    <div className="notif-card-top">
                      <h3 className="notif-actor">{item.actor}</h3>
                      <span className="notif-dot-sep">•</span>
                      <p
                        className={`notif-action notif-action-${item.actionTone}`}
                      >
                        {item.action}
                      </p>
                    </div>
                    <p className="notif-detail">{item.detail}</p>
                    <div className="notif-meta">
                      <span className="notif-time">
                        <Clock size={14} className="notif-clock" />
                        {item.time}
                      </span>
                      <span className="notif-sep">•</span>
                      <span className="notif-id">#{item.id}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`notif-badge notif-badge-${item.badgeTone}`}
                >
                  {item.badge}
                </span>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Footer */}
      <footer className="notif-footer">
        <div className="notif-footer-line">
          <Check size={14} className="notif-check" />
          <span>
            All changes stored to DIGISOL local cache &amp; central server.
          </span>
        </div>
        <p className="notif-version">
          DIGISOL POS AUDIT ENGINE • v2.4.8-pos
        </p>
      </footer>
    </div>
  );
}