import React from "react";
import {
  CalendarDays,
  ShoppingCart,
  ArrowRight,
  TrendingUp,
  Receipt,
  BarChart3,
  ScanBarcode,
  LayoutDashboard,
  Search,
  FileText,
  History,
  CreditCard,
  Building2,
  Package,
  House,
  UserRound,
} from "lucide-react";

import "../Styles/home.css";
import Logo from "../assets/Logo.png";
import ChatbotWindow from "../Adminfunctions/ChatbotWindow.jsx";

function Home({ onNavigate, isChatbotOpen, onOpenChatbot, onCloseChatbot }) {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <div className="header-left">
            <img className="brand-logo" src={Logo} alt="Digisol logo" />
            <div className="header-title"><span>Dashboard</span></div>
          </div>
          <div className="header-actions">
            <button
              className="notification-button chatbot-circle-button"
              type="button"
              onClick={onOpenChatbot}
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
                  <linearGradient id="robotShell" x1="4" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFFFFF" />
                    <stop offset="0.55" stopColor="#DCE5F2" />
                    <stop offset="1" stopColor="#AAB9CC" />
                  </linearGradient>
                  <linearGradient id="robotScreen" x1="8" y1="7" x2="17" y2="17" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#253B63" />
                    <stop offset="0.5" stopColor="#101B35" />
                    <stop offset="1" stopColor="#060B18" />
                  </linearGradient>
                  <radialGradient id="robotEye" cx="0" cy="0" r="1" gradientTransform="translate(10 11) rotate(90) scale(2.2)">
                    <stop stopColor="#FFFFFF" />
                    <stop offset="0.65" stopColor="#D7E8FF" />
                    <stop offset="1" stopColor="#70A8FF" />
                  </radialGradient>
                  <filter id="robotGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="0.35" />
                  </filter>
                </defs>
                <path d="M4.1 10.2a7.9 7.9 0 0 1 15.8 0" stroke="#91A4BE" strokeWidth="1.3" strokeLinecap="round" />
                <rect x="2.7" y="10.2" width="2.2" height="4.8" rx="1.1" fill="#8FA1B9" />
                <rect x="19.1" y="10.2" width="2.2" height="4.8" rx="1.1" fill="#8FA1B9" />
                <rect x="4.8" y="4.8" width="14.4" height="14.4" rx="4.8" fill="url(#robotShell)" stroke="#8799B1" strokeWidth="0.7" />
                <path d="M7.4 6.4c2.1-1.1 6.9-1 9.1.3" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="0.8" strokeLinecap="round" />
                <rect x="6.7" y="7.7" width="10.6" height="8.7" rx="3.35" fill="url(#robotScreen)" stroke="#34496D" strokeWidth="0.55" />
                <ellipse cx="10" cy="11.2" rx="1.05" ry="1.25" fill="#7EB2FF" opacity="0.55" filter="url(#robotGlow)" />
                <ellipse cx="14" cy="11.2" rx="1.05" ry="1.25" fill="#7EB2FF" opacity="0.55" filter="url(#robotGlow)" />
                <ellipse cx="10" cy="11.2" rx="0.68" ry="0.85" fill="url(#robotEye)" />
                <ellipse cx="14" cy="11.2" rx="0.68" ry="0.85" fill="url(#robotEye)" />
                <path d="M9.25 13.65c.72.78 1.55 1.12 2.75 1.12s2.03-.34 2.75-1.12" stroke="#B9D7FF" strokeWidth="0.85" strokeLinecap="round" />
                <path d="M19.7 14.8v2.15c0 1.05-.85 1.9-1.9 1.9h-1.1" stroke="#8296B2" strokeWidth="0.9" strokeLinecap="round" />
                <rect x="15.5" y="18.1" width="2.3" height="1.15" rx="0.57" fill="#7186A3" />
              </svg>
              <span className="notification-dot" />
            </button>
            <div className="online-indicator" />
          </div>  
        </div>
      </header>

      <main className="home-main">
        <div className="home-content">
          <section className="greeting-card">
            <div className="greeting-top">
              <div className="date-pill"><CalendarDays size={14} /><span>Friday, 11 Sept 2026</span></div>
              <div className="online-pill"><span className="online-pulse" /><span>Online</span></div>
            </div>
            <div className="greeting-text">
              <h1>Good evening, Precious👋</h1>
              <p className="greeting-description">Sales Representative</p>
            </div>
          </section>

          <button className="record-sale-button" onClick={() => onNavigate("sales")}>
            <div className="record-sale-left"><div className="record-sale-icon"><ShoppingCart size={27} /></div><div className="record-sale-text"><span>Record New Sale</span><small>Open checkout scanner or select manual SKU</small></div></div>
            <div className="record-sale-arrow"><ArrowRight size={20} /></div>
          </button>

          <section className="metrics-grid">
            <div className="metric-card total-sales-card"><div className="metric-top"><div><span className="metric-label">Today's Total Sales</span><div className="total-sales-value">₦482,500</div></div><div className="growth-pill"><TrendingUp size={14} /><span>+14.2%</span></div></div><div className="yesterday-row"><span>vs. Yesterday shift</span><strong>₦422,300</strong></div></div>
            <div className="metric-card"><div className="metric-card-header"><span>Transactions</span><div className="metric-icon blue"><Receipt size={18} /></div></div><div className="metric-number">38</div><span className="metric-description">Orders completed</span></div>
            <div className="metric-card"><div className="metric-card-header"><span>Avg Ticket</span><div className="metric-icon purple"><BarChart3 size={18} /></div></div><div className="metric-number">₦12,700</div><span className="metric-description">Per receipt value</span></div>
          </section>

          <div className="quick-actions">
            <button className="quick-action"><ScanBarcode size={18} /><span>Remaining Advanced</span></button>
            <button className="quick-action"><Search size={18} /><span>Quick Price Check</span></button>
            <button className="quick-action"><FileText size={18} /><span>Stock Inventory</span></button>
          </div>

          <section className="transactions-section">
            <div className="section-header"><div className="section-title"><History size={18} /><h2>Recent Shift Transactions</h2></div><button className="view-all-button" onClick={() => onNavigate("records")}><span>View all</span><ArrowRight size={14} /></button></div>
            <div className="transaction-list">
              <TransactionCard iconClass="blue" icon={<CreditCard size={20} />} title="Golden Penny Pure Soya Oil 2L" qty="3" method="Cash" time="12:42 PM" amount="₦13,500" />
              <TransactionCard iconClass="purple" icon={<CreditCard size={20} />} title="Nestle Milo Refill 800g + Milk" qty="2" method="POS Card" time="12:35 PM" amount="₦8,200" />
              <TransactionCard iconClass="light-blue" icon={<Building2 size={20} />} title="Dano Full Cream Milk 900g" qty="5" method="Transfer" time="12:18 PM" amount="₦24,000" />
            </div>
          </section>

          <section className="stock-alert"><div className="stock-alert-icon"><Package size={20} /></div><div className="stock-alert-content"><strong>Stock Reorder Alert</strong><p>Golden Penny Pure Soya Oil 2L is below 12 units. Warehouse restock requested.</p></div></section>
        </div>
      </main>

      <nav className="bottom-navigation"><div className="bottom-nav-inner">
        <button className="nav-item active" onClick={() => onNavigate("home")} aria-label="Home"><House size={22} /><span>Home</span></button>
        <button className="nav-item" onClick={() => onNavigate("sales")}><Receipt size={22} /><span>Sales</span></button>
        <div className="transaction-nav"><button className="transaction-button" onClick={() => onNavigate("admin")} aria-label="Open Admin Dashboard"><LayoutDashboard size={26} /></button><span>Admin Dashboard</span></div>
        <button className="nav-item" onClick={() => onNavigate("records")}><History size={22} /><span>Records</span></button>
        <button className="nav-item" onClick={() => onNavigate("profile")} aria-label="Profile"><UserRound size={22} /><span>Profile</span></button>
      </div></nav>

      <ChatbotWindow isOpen={isChatbotOpen} onClose={onCloseChatbot} />
    </div>
  );
}

function TransactionCard({ iconClass, icon, title, qty, method, time, amount }) {
  return <div className="transaction-card"><div className="transaction-left"><div className={`transaction-icon ${iconClass}`}>{icon}</div><div className="transaction-info"><h3>{title}</h3><div className="transaction-meta"><span>Qty: {qty}</span><b>•</b><span className="payment-badge">{method}</span><b>•</b><span>{time}</span></div></div></div><div className="transaction-right"><strong>{amount}</strong><span className="completed"><span />Completed</span></div></div>;
}

export default Home;
