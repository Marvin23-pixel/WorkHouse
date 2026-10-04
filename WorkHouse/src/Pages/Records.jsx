import React, { useState } from "react";
import {
  Search,
  X,
  CheckCircle,
  House,
  Receipt,
  ScanBarcode,
  LayoutDashboard,
  History,
  UserRound,
  ArrowLeft,
  Printer,
  Share2,
  User,
  Store,
} from "lucide-react";
import "../Styles/records.css";
import Logo from "../assets/Logo.png";
import ChatbotWindow from "../Adminfunctions/ChatbotWindow.jsx";

const SAMPLE_TRANSACTIONS = [
  {
    id: "TRX-8822",
    time: "12:45 PM",
    method: "Cash",
    methodType: "cash",
    customer: "Chief Adeleke",
    items: [{ name: "Golden Penny Sugar 500g", qty: 4, unit: 1290, total: 5160 }],
    subtotal: 4800,
    vat: 360,
    total: 5160,
    cashier: "Amaka Eze (POS-02)",
    paymentType: "Full Payment",
    search: "TRX-8822 Golden Penny Sugar 500g Chief Adeleke",
  },
  {
    id: "TRX-8821",
    time: "12:42 PM",
    method: "Cash",
    methodType: "cash",
    customer: "Walk-in Customer",
    items: [{ name: "Golden Penny Pure Soya Oil 2L", qty: 3, unit: 4500, total: 13500 }],
    subtotal: 12558,
    vat: 942,
    total: 13500,
    cashier: "Amaka Eze (POS-02)",
    paymentType: "Full Payment",
    search: "TRX-8821 Golden Penny Pure Soya Oil 2L",
  },
  {
    id: "TRX-8820",
    time: "12:35 PM",
    method: "POS Card",
    methodType: "pos",
    customer: "Walk-in Customer",
    items: [
      { name: "Nestle Milo 800g", qty: 1, unit: 4800, total: 4800 },
      { name: "Peak Milk 400g", qty: 2, unit: 1700, total: 3400 },
    ],
    subtotal: 7628,
    vat: 572,
    total: 8200,
    cashier: "Amaka Eze (POS-02)",
    paymentType: "Advance Payment",
    search: "TRX-8820 Nestle Milo 800g Peak Milk 400g Walk-in Customer",
  },
  {
    id: "TRX-8819",
    time: "12:18 PM",
    method: "Bank Transfer",
    methodType: "transfer",
    customer: "Madam Beatrice O.",
    items: [{ name: "Dano Full Cream Milk Powder 900g", qty: 5, unit: 4800, total: 24000 }],
    subtotal: 22325,
    vat: 1675,
    total: 24000,
    cashier: "Amaka Eze (POS-02)",
    paymentType: "Full Payment",
    search: "TRX-8819 Dano Full Cream Milk Powder 900g Madam Beatrice O.",
  },
];

export default function Records({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [toast, setToast] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const filteredTransactions = SAMPLE_TRANSACTIONS.filter((tx) => {
    const matchesSearch =
      !searchQuery ||
      tx.search.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPayment =
      paymentFilter === "all" || tx.methodType === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  const openReceipt = (tx) => setSelectedReceipt(tx);
  const closeReceipt = () => setSelectedReceipt(null);

  return (
    <div className="records-page">
      {/* ================= HEADER ================= */}
      <header className="records-header">
        <div className="records-header-content">
          <div className="records-header-left">
            <img className="records-brand-logo" src={Logo} alt="Digisol logo" />
            <div className="records-title-group">
              <h1>Transaction Records</h1>
            </div>
          </div>

          <button
            className="notification-button chatbot-circle-button"
            type="button"
            onClick={() => setIsChatbotOpen(true)}
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
            aria-label="Open Chatbot Assistant"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="recordsRobotShell" x1="4" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF" />
                  <stop offset="0.55" stopColor="#DCE5F2" />
                  <stop offset="1" stopColor="#AAB9CC" />
                </linearGradient>
                <linearGradient id="recordsRobotScreen" x1="8" y1="7" x2="17" y2="17" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#253B63" />
                  <stop offset="0.5" stopColor="#101B35" />
                  <stop offset="1" stopColor="#060B18" />
                </linearGradient>
                <radialGradient id="recordsRobotEye" cx="0" cy="0" r="1" gradientTransform="translate(10 11) rotate(90) scale(2.2)">
                  <stop stopColor="#FFFFFF" />
                  <stop offset="0.65" stopColor="#D7E8FF" />
                  <stop offset="1" stopColor="#70A8FF" />
                </radialGradient>
                <filter id="recordsRobotGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="0.35" />
                </filter>
              </defs>
              <path d="M4.1 10.2a7.9 7.9 0 0 1 15.8 0" stroke="#91A4BE" strokeWidth="1.3" strokeLinecap="round" />
              <rect x="2.7" y="10.2" width="2.2" height="4.8" rx="1.1" fill="#8FA1B9" />
              <rect x="19.1" y="10.2" width="2.2" height="4.8" rx="1.1" fill="#8FA1B9" />
              <rect x="4.8" y="4.8" width="14.4" height="14.4" rx="4.8" fill="url(#recordsRobotShell)" stroke="#8799B1" strokeWidth="0.7" />
              <path d="M7.4 6.4c2.1-1.1 6.9-1 9.1.3" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="0.8" strokeLinecap="round" />
              <rect x="6.7" y="7.7" width="10.6" height="8.7" rx="3.35" fill="url(#recordsRobotScreen)" stroke="#34496D" strokeWidth="0.55" />
              <ellipse cx="10" cy="11.2" rx="1.05" ry="1.25" fill="#7EB2FF" opacity="0.55" filter="url(#recordsRobotGlow)" />
              <ellipse cx="14" cy="11.2" rx="1.05" ry="1.25" fill="#7EB2FF" opacity="0.55" filter="url(#recordsRobotGlow)" />
              <ellipse cx="10" cy="11.2" rx="0.68" ry="0.85" fill="url(#recordsRobotEye)" />
              <ellipse cx="14" cy="11.2" rx="0.68" ry="0.85" fill="url(#recordsRobotEye)" />
              <path d="M9.25 13.65c.72.78 1.55 1.12 2.75 1.12s2.03-.34 2.75-1.12" stroke="#B9D7FF" strokeWidth="0.85" strokeLinecap="round" />
              <path d="M19.7 14.8v2.15c0 1.05-.85 1.9-1.9 1.9h-1.1" stroke="#8296B2" strokeWidth="0.9" strokeLinecap="round" />
              <rect x="15.5" y="18.1" width="2.3" height="1.15" rx="0.57" fill="#7186A3" />
            </svg>
            <span className="notification-dot" />
          </button>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="records-main">
        <div className="records-content">

          {/* Overview Banner */}
          <div className="records-overview-card">
            <div className="records-overview-left">
              <div className="records-live-badge">
                <span>Live Register</span>
                <span className="live-dot" />
              </div>
              <h2>Sales History</h2>
              <p className="records-overview-meta">
                {/* <span className="online-dot" /> */}
                <span>42 completed sales</span>
              </p>
            </div>
            <div className="records-volume-box">
              <span className="volume-label">Shift Volume</span>
              <span className="volume-value">₦189,450</span>
            </div>
          </div>

          {/* Search */}
          <div className="records-search-wrap">
            <Search size={18} className="records-search-icon" />
            <input
              type="text"
              placeholder="Search receipt number, item or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="records-clear-search"
                onClick={() => setSearchQuery("")}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Date Chips */}
          <div className="records-date-chips">
            {[
              { id: "today", label: "Today (42)" },
              { id: "yesterday", label: "Yesterday" },
              { id: "week", label: "This Week" },
              { id: "month", label: "This Month" },
            ].map((chip) => (
              <button
                key={chip.id}
                className={`date-chip ${dateFilter === chip.id ? "active" : ""}`}
                onClick={() => {
                  setDateFilter(chip.id);
                  showToast(`Loaded records for: ${chip.label}`);
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Payment Filters */}
          <div className="records-payment-filters">
            {[
              { id: "all", label: "All" },
              { id: "cash", label: "Cash" },
              { id: "pos", label: "POS" },
              { id: "transfer", label: "Transfer" },
            ].map((f) => (
              <button
                key={f.id}
                className={`payment-filter-btn ${
                  paymentFilter === f.id ? "active" : ""
                }`}
                onClick={() => setPaymentFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Section Header */}
          <div className="records-section-header">
            <span>Recent Transactions</span>
            <span className="sync-badge">
              <CheckCircle size={13} />
              Auto-synced
            </span>
          </div>

          {/* Transaction List */}
          <div className="records-table-wrap" style={{ overflowX: "auto", overflowY: "hidden", WebkitOverflowScrolling: "touch" }}>
            <table className="records-table" style={{ minWidth: "640px" }}>
              <thead>
                <tr>
                  <th>Trx / Time</th>
                  <th>Item & Customer</th>
                  <th>Method</th>
                  <th className="text-right">Amount</th>
                  <th>Payment Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="records-row"
                    onClick={() => openReceipt(tx)}
                  >
                    <td>
                      <div className="trx-id">{tx.id}</div>
                      <div className="trx-time">{tx.time}</div>
                    </td>
                    <td>
                      <div className="item-name">
                        {tx.items.length > 1
                          ? `${tx.items[0].name} + more`
                          : `${tx.items[0].name} (x${tx.items[0].qty})`}
                      </div>
                      <div className="customer-row">
                        {tx.customer === "Walk-in Customer" ? (
                          <Store size={12} />
                        ) : (
                          <User size={12} />
                        )}
                        <span>{tx.customer}</span>
                      </div>
                    </td>
                    <td>
                      <span className="method-text">{tx.method}</span>
                    </td>
                    <td className="text-right">
                      <span className="amount">
                        ₦{tx.total.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`payment-type-badge ${
                          tx.paymentType === "Advance Payment"
                            ? "advance"
                            : "full"
                        }`}
                      >
                        <CheckCircle size={12} />
                        {tx.paymentType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* End of list */}
          <div className="records-end">
            <div className="records-end-icon">
              <CheckCircle size={18} />
            </div>
            <span>All shift records synced to cloud</span>
            <small>Bonny Central • Station 01</small>
          </div>
        </div>
      </main>

      {/* ================= RECEIPT DRAWER ================= */}
      {selectedReceipt && (
        <div className="receipt-overlay" onClick={closeReceipt}>
          <div
            className="receipt-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="receipt-drawer-header">
              <div className="drawer-handle" />
              <div className="drawer-title">
                <Receipt size={15} />
                <span>Digital Cash Receipt</span>
              </div>
              <button className="drawer-close" onClick={closeReceipt}>
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Receipt */}
            <div className="receipt-body">
              <div className="receipt-paper">
                {/* Store Header */}
                <div className="receipt-store-header">
                  <div className="receipt-logo">D</div>
                  <h2>DIGISOL SUPERMARKET</h2>
                  <p>Store #04 · Admiralty Way, Lekki Phase 1, Lagos</p>
                  <p>Tel: +234 1 800 3444 · VAT Reg: 10488219-001</p>
                </div>

                {/* Meta */}
                <div className="receipt-meta-grid">
                  <div>
                    <span className="meta-label">Receipt No:</span>
                    <span className="meta-value">{selectedReceipt.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="meta-label">Timestamp:</span>
                    <span className="meta-value">
                      Today, {selectedReceipt.time}
                    </span>
                  </div>
                  <div>
                    <span className="meta-label">Cashier:</span>
                    <span className="meta-value">{selectedReceipt.cashier}</span>
                  </div>
                  <div className="text-right">
                    <span className="meta-label">Customer:</span>
                    <span className="meta-value">{selectedReceipt.customer}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="receipt-items">
                  <div className="items-header">
                    <span>Item & Qty</span>
                    <span>Amount (NGN)</span>
                  </div>
                  {selectedReceipt.items.map((item, i) => (
                    <div key={i} className="receipt-item-row">
                      <div>
                        <p className="item-title">{item.name}</p>
                        <p className="item-qty">
                          {item.qty} × ₦{item.unit.toLocaleString()}
                        </p>
                      </div>
                      <span className="item-total">
                        ₦{item.total.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="receipt-totals">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>₦{selectedReceipt.subtotal.toLocaleString()}.00</span>
                  </div>
                  <div className="total-row">
                    <span>VAT (7.5%)</span>
                    <span>₦{selectedReceipt.vat.toLocaleString()}.00</span>
                  </div>
                  <div className="total-row grand">
                    <span>Total Paid</span>
                    <span>₦{selectedReceipt.total.toLocaleString()}.00</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="receipt-payment-bar">
                  <div className="payment-left">
                    <CheckCircle size={18} className="success-icon" />
                    <span>Payment Method</span>
                  </div>
                  <span
                    className={`method-badge ${selectedReceipt.methodType}`}
                  >
                    {selectedReceipt.method}
                  </span>
                </div>

                {/* Barcode area */}
                <div className="receipt-barcode">
                  <div className="barcode-bars" />
                  <span>
                    {selectedReceipt.id}-STORE04-LAGOS
                  </span>
                </div>

                <p className="receipt-thanks">
                  Thank you for shopping with Digisol Retail!
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="receipt-actions">
              <button
                className="btn-reprint"
                onClick={() =>
                  showToast("Sent to Bluetooth Thermal Printer (POS-02)...")
                }
              >
                <Printer size={18} />
                Reprint Thermal Receipt
              </button>
              <button
                className="btn-share"
                onClick={() =>
                  showToast("Opening WhatsApp with digital receipt link...")
                }
              >
                <Share2 size={18} />
                Share Receipt via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="records-toast">
          <CheckCircle size={16} />
          <span>{toast}</span>
        </div>
      )}

      <ChatbotWindow
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />

      {/* ================= BOTTOM NAV ================= */}
      <nav className="bottom-navigation">
        <div className="bottom-nav-inner">
          <button
            className="nav-item"
            onClick={() => onNavigate && onNavigate("home")}
          >
            <House size={22} />
            <span>Home</span>
          </button>

          <button
            className="nav-item"
            onClick={() => onNavigate && onNavigate("sales")}
          >
            <Receipt size={22} />
            <span>Sales</span>
          </button>

          <div className="transaction-nav">
            <button className="transaction-button" onClick={() => onNavigate && onNavigate("admin")} aria-label="Open Admin Dashboard">
              <LayoutDashboard size={26} />
            </button>
            <span>Admin Dashboard</span>
          </div>

          <button className="nav-item active">
            <History size={22} />
            <span>Records</span>
          </button>

          <button
            className="nav-item"
            onClick={() => onNavigate && onNavigate("profile")}
            aria-label="Profile"
          >
            <UserRound size={22} />
            <span>Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
