import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  Bell,
  Search,
  Plus,
  X,
  Check,
  Users,
} from "lucide-react";
import "../Styles/staffaccounts.css";
import { getStaff, saveStaff } from "../utils/staffStore.js";

const ROLE_LABELS = {
  admin: "Administrator",
  manager: "Manager",
  sales: "Sales Representative",
};

const ROLE_BADGE_CLASS = {
  admin: "badge-admin",
  manager: "badge-manager",
  sales: "badge-sales",
};

export default function StaffAccounts({ onBack }) {
  const [staff, setStaff] = useState(() => getStaff());
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    role: "sales",
    manager: "Daniel Carter",
    fullName: "",
    staffId: "",
    email: "",
    pin: "",
  });

  // Persist every change so the Login page always sees the latest directory
  useEffect(() => {
    saveStaff(staff);
  }, [staff]);

  const onlineCount = useMemo(
    () => staff.filter((s) => s.online && s.status === "active").length,
    [staff]
  );

  const filteredStaff = useMemo(() => {
    const q = search.toLowerCase().trim();
    return staff.filter((s) => {
      const matchesRole = activeFilter === "all" || s.role === activeFilter;
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.displayId.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [staff, search, activeFilter]);

  const handleToggleStatus = (id) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === "active" ? "inactive" : "active",
              online: s.status === "active" ? false : s.online,
            }
          : s
      )
    );
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to remove this staff profile? This action will immediately revoke POS access."
      )
    ) {
      setStaff((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const openModal = () => {
    setForm({
      role: "sales",
      manager: "Daniel Carter",
      fullName: "",
      staffId: "",
      email: "",
      pin: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedId = form.staffId.trim();
    const idExists = staff.some(
      (s) =>
        s.displayId.toLowerCase() === normalizedId.toLowerCase() ||
        s.id.toLowerCase() === normalizedId.toLowerCase()
    );
    if (idExists) {
      alert("That Staff ID is already taken. Please choose another.");
      return;
    }

    const newStaff = {
      id: normalizedId.toLowerCase().replace(/\s+/g, ""),
      name: form.fullName,
      displayId: normalizedId,
      role: form.role,
      status: "active",
      online: false,
      lastSeen: "Just now",
      manager: form.role === "sales" ? form.manager : null,
      email: form.email,
      password: form.pin, // staff logs in with this PIN/password
    };
    setStaff((prev) => [newStaff, ...prev]);
    alert(
      `Staff member registered. They can now log in with Staff ID "${newStaff.displayId}" and their PIN.`
    );
    closeModal();
  };

  return (
    <div className="staff-page">
      {/* Top Header */}
      <header className="staff-top-header">
        <div className="staff-header-left">
          <button
            className="staff-icon-btn"
            aria-label="Go Back"
            onClick={onBack ?? (() => window.history.back())}
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="staff-brand">
            <span className="staff-brand-name">WORKHOUSE</span>
            <span className="staff-pos-badge"></span>
          </div>
        </div>
        <button className="staff-icon-btn staff-notification-btn" aria-label="Notifications">
          <Bell size={22} strokeWidth={1.8} />
          <span className="staff-alert-dot" />
        </button>
      </header>

      <main className="staff-main-content">
        <section className="staff-overview-card">
          <div>
            <h1 className="staff-page-title">Staff Directory</h1>
            <p className="staff-page-subtitle">
              Manage store team roles and access permissions.
            </p>
          </div>
          <div className="staff-online-badge">
            <span className="staff-dot" />
            {onlineCount} Online
          </div>
        </section>

        <section className="staff-action-bar">
          <div className="staff-search-wrap">
            <Search size={16} className="staff-search-icon" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="staff-search-input"
            />
          </div>
          <button className="staff-add-btn" onClick={openModal}>
            <Plus size={16} strokeWidth={2.5} />
            Add Staff
          </button>
        </section>

        <section className="staff-filter-row">
          <div className="staff-count-label">
            <span>{filteredStaff.length} Staff</span>
            <span className="staff-sep">•</span>
          </div>
          <div className="staff-filter-chips">
            {[
              { key: "all", label: "All" },
              { key: "sales", label: "Sales Rep" },
              { key: "manager", label: "Manager" },
              { key: "admin", label: "Admin" },
            ].map((f) => (
              <button
                key={f.key}
                className={`staff-filter-pill ${
                  activeFilter === f.key ? "active" : ""
                }`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </section>

        <section className="staff-list">
          {filteredStaff.length === 0 ? (
            <div className="staff-empty-state">
              <Users size={40} strokeWidth={1.5} />
              <p>No staff members found</p>
            </div>
          ) : (
            filteredStaff.map((s) => (
              <article
                key={s.id}
                className={`staff-card ${
                  s.status === "inactive" ? "inactive" : ""
                }`}
              >
                <div className="staff-card-top">
                  <div>
                    <h2 className="staff-name">{s.name}</h2>
                    <p className="staff-id">ID: {s.displayId}</p>
                    {s.manager && (
                      <p className="staff-manager">
                        Manager:{" "}
                        <span className="staff-manager-name">{s.manager}</span>
                      </p>
                    )}
                  </div>
                  <span className={`staff-role-badge ${ROLE_BADGE_CLASS[s.role]}`}>
                    {ROLE_LABELS[s.role]}
                  </span>
                </div>

                <div className="staff-card-bottom">
                  <div className="staff-status-group">
                    <span
                      className={`staff-status-pill ${
                        s.status === "active" ? "active" : "inactive"
                      }`}
                    >
                      {s.status === "active" ? "Active" : "Inactive"}
                    </span>
                    <span className="staff-online-status">
                      <span
                        className={`staff-dot ${s.online ? "online" : "offline"}`}
                      />
                      {s.online
                        ? "Online"
                        : `Offline${s.lastSeen ? ` (${s.lastSeen})` : ""}`}
                    </span>
                  </div>

                  <div className="staff-actions">
                    <button
                      className={`staff-toggle-btn ${
                        s.status === "active" ? "" : "enable"
                      }`}
                      onClick={() => handleToggleStatus(s.id)}
                    >
                      {s.status === "active" ? "Disable" : "Enable"}
                    </button>
                    <button
                      className="staff-delete-btn"
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      <footer className="staff-sync-footer">
        <div className="staff-sync-line">
          <Check size={16} className="staff-check-icon" />
          <span>
            All changes stored to WorkHouse local cache &amp; central server.
          </span>
        </div>
        <p className="staff-version">v2.4.8-pos</p>
      </footer>

      {isModalOpen && (
        <div className="staff-modal-overlay" onClick={closeModal}>
          <div
            className="staff-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="staff-modal-header">
              <div>
                <h3>Add New Staff Member</h3>
                <p>Configure role and login credentials</p>
              </div>
              <button className="staff-icon-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <form className="staff-add-form" onSubmit={handleSubmit}>
              <div className="staff-form-group">
                <label htmlFor="role">Assign System Role</label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleFormChange}
                >
                  <option value="sales">Sales Representative</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {form.role === "sales" && (
                <div className="staff-form-group">
                  <label htmlFor="manager">Assign Supervisor / Manager</label>
                  <select
                    id="manager"
                    name="manager"
                    value={form.manager}
                    onChange={handleFormChange}
                  >
                    <option value="Daniel Carter">Daniel Carter (Manager)</option>
                    <option value="Victor Osei">Victor Osei (Manager)</option>
                  </select>
                </div>
              )}

              <div className="staff-form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={form.fullName}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="staff-form-group">
                <label htmlFor="staffId">Staff ID / Username</label>
                <input
                  id="staffId"
                  name="staffId"
                  type="text"
                  placeholder="e.g. DIGI-007 or alex.pos"
                  value={form.staffId}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="staff-form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. alex@digisol.com"
                  value={form.email}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="staff-form-group">
                <label htmlFor="pin">Initial PIN / Access Code</label>
                <input
                  id="pin"
                  name="pin"
                  type="password"
                  maxLength={8}
                  placeholder="••••"
                  value={form.pin}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="staff-modal-actions">
                <button
                  type="button"
                  className="staff-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="staff-create-btn">
                  Create Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}