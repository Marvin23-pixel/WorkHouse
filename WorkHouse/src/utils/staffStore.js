import { startTransition } from "react";

// Shared staff directory — used by both StaffAccounts and Login
const STORAGE_KEY = "digisol_staff_directory";

const DEFAULT_STAFF = [
  // {
  //   id: "digi-001",
  //   name: "Nsikak Solomon",
  //   displayId: "DIGI-001",
  //   role: "admin",
  //   status: "active",
  //   online: false,
  //   lastSeen: null,
  //   manager: null,
  //   email: "nsikak@digisol.com",
  //   password: "1234",
  // },
  // {
  //   id: "desmond@digisol",
  //   name: "Desmond Otis",
  //   displayId: "desmond@digisol",
  //   role: "sales",
  //   status: "active",
  //   online: false,
  //   lastSeen: "42m ago",
  //   manager: "Daniel Carter",
  //   email: "desmond@digisol.com",
  //   password: "1234",
  // },
  // {
  //   id: "daniel254",
  //   name: "Daniel Carter",
  //   displayId: "daniel254",
  //   role: "manager",
  //   status: "active",
  //   online: false,
  //   lastSeen: null,
  //   manager: null,
  //   email: "daniel@digisol.com",
  //   password: "1234",
  // },
  // {
  //   id: "victorosei983",
  //   name: "Victor Osei",
  //   displayId: "victorosei983",
  //   role: "manager",
  //   status: "inactive",
  //   online: false,
  //   lastSeen: "2d ago",
  //   manager: null,
  //   email: "victor@digisol.com",
  //   password: "1234",
  // },
  // {
  //   id: "favour2664",
  //   name: "Favour Eze",
  //   displayId: "favour2664",
  //   role: "sales",
  //   status: "active",
  //   online: false,
  //   lastSeen: null,
  //   manager: "Daniel Carter",
  //   email: "favour@digisol.com",
  //   password: "1234",
  // },
  // Seeded so the existing Login demo/preset buttons keep working
  {
    id: "sarah-j",
    name: "Sarah Johnson",
    displayId: "sarah.j@digisol.com",
    role: "manager",
    status: "active",
    online: false,
    lastSeen: "1h ago",
    manager: null,
    email: "sarah.j@digisol.com",
    password: "DigiSol2025!",
  },
];

export function getStaff() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read staff directory", e);
  }
  saveStaff(DEFAULT_STAFF);
  return DEFAULT_STAFF;
}

export function saveStaff(staff) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
    // Notify listeners in the SAME tab (native "storage" events only fire
    // for OTHER tabs, so we dispatch our own for same-tab updates).
    window.dispatchEvent(new Event("staffDirectoryUpdated"));
  } catch (e) {
    console.error("Failed to save staff directory", e);
  }
}

// Matches on Staff ID, display ID, or email (case-insensitive) + exact password
export function findStaffByCredentials(staffIdInput, passwordInput) {
  const staff = getStaff();
  const idLower = staffIdInput.trim().toLowerCase();
  return staff.find(
    (s) =>
      s.status === "active" &&
      s.password === passwordInput &&
      (s.displayId.toLowerCase() === idLower ||
        s.id.toLowerCase() === idLower ||
        (s.email && s.email.toLowerCase() === idLower))
  );
}

// Call this right after a successful login
export function logStaffIn(staffId) {
  const staff = getStaff();
  const updated = staff.map((s) =>
    s.id === staffId ? { ...s, online: true, lastSeen: null } : s
  );
  saveStaff(updated);
  return updated;
}

// Call this from wherever your logout button lives
export function logStaffOut(staffId) {
  const staff = getStaff();
  const updated = staff.map((s) =>
    s.id === staffId ? { ...s, online: false, lastSeen: "Just now" } : s
  );
  saveStaff(updated);
  return updated;
}

 