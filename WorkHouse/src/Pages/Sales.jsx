import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Search,
  ShoppingBag,
  CheckCircle
} from 'lucide-react';
import "../assets/Logo.png";
import '../Styles/sales.css';

export default function Sales({ onNavigate }) {
  const [currentSaleMode, setCurrentSaleMode] = useState('full');
  const [currentQty, setCurrentQty] = useState(4);
  const [unitPrice, setUnitPrice] = useState(1200);
  const [activePayment, setActivePayment] = useState('cash');
  const [activeAdvPayment, setActiveAdvPayment] = useState('cash');
  const [customerName, setCustomerName] = useState('Chief Adeleke');
  const [customerPhone, setCustomerPhone] = useState('0803 234 5678');
  const [customerAddress, setCustomerAddress] = useState('');
  const [advanceDeposit, setAdvanceDeposit] = useState(2500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Financial Calculations
  const subtotal = currentQty * unitPrice;
  const vat = currentSaleMode === 'advance' ? Math.round(subtotal * 0.075) : 0;
  const grandTotal = subtotal + vat;
  const minDeposit = Math.round(grandTotal * 0.2);
  const balance = Math.max(0, grandTotal - advanceDeposit);

  const updateQuantity = (delta) => {
    let newQty = currentQty + delta;
    if (newQty < 1) newQty = 1;
    setCurrentQty(newQty);
  };

  return (
    <div className="sales-container">
      {/* Top Header */}
      <header className="sales-header">
        <div className="sales-header-content">
          <div className="sales-header-left">
            <button
              className="sales-back-btn"
              onClick={() => onNavigate ? onNavigate("home") : window.history.back()}
              type="button"
            >
              <ArrowLeft size={20} />
            </button>
            <img
              alt="Digisol Logo"
              className="sales-logo"
              src="{Logo}"
            />
            <div className="sales-title-group">
              <h1>Record Sale</h1>
            </div>
          </div>
          <button className="sales-notif-btn" type="button">
            <Bell size={20} />
            <span className="sales-notif-dot" />
          </button>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="sales-main">
        <div className="sales-wrapper">
          
          {/* Status Bar */}
          <div className="sales-statusbar card">
            <div className="sales-status-info">
              <div className="sales-status-icon">
                <ShoppingBag size={22} />
              </div>
              <div>
                <h2>Record New Sale</h2>
                <p>Sales Representative</p>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="sales-tabs">
            <button
              className={`sales-tab-btn ${currentSaleMode === 'full' ? 'active' : ''}`}
              onClick={() => setCurrentSaleMode('full')}
              type="button"
            >
              Full Payment
            </button>
            <button
              className={`sales-tab-btn ${currentSaleMode === 'advance' ? 'active' : ''}`}
              onClick={() => setCurrentSaleMode('advance')}
              type="button"
            >
              Advance Payment
            </button>
          </div>

          {/* FULL PAYMENT SECTION */}
          {currentSaleMode === 'full' && (
            <div className="sales-section">
              {/* SKU Search */}
              <div className="card form-group">
                <label>Scan or Search SKU</label>
                <div className="search-input-wrapper">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Search item..."
                  />
                </div>
              </div>

              {/* Line Item Card */}
              <div className="card item-card">
                <div className="item-card-header">
                  <span>Active Line Item</span>
                  <span className="badge-success">In Stock</span>
                </div>
                
                <div className="item-row">
                  <div className="item-icon-box">
                    <ShoppingBag size={20} />
                  </div>
                  <input
                    className="item-name-input"
                    type="text"
                    value="Golden Penny Sugar 500g"
                    readOnly
                  />
                </div>

                <div className="item-controls-grid">
                  <div className="input-field-wrap">
                    <label>Unit Price</label>
                    <div className="price-input-container">
                      <span className="currency-symbol">₦</span>
                      <input
                        type="number"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="input-field-wrap">
                    <label>Quantity</label>
                    <div className="qty-selector">
                      <button onClick={() => updateQuantity(-1)} type="button">-</button>
                      <span>{currentQty}</span>
                      <button onClick={() => updateQuantity(1)} type="button">+</button>
                    </div>
                  </div>
                </div>

                <div className="item-total-row">
                  <span>Total:</span>
                  <span className="item-grand-total">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="card payment-method-card">
                <label>Payment Method</label>
                <div className="payment-options-grid">
                  {['cash', 'card', 'transfer'].map((method) => (
                    <button
                      key={method}
                      className={`payment-option-btn ${activePayment === method ? 'active' : ''}`}
                      onClick={() => setActivePayment(method)}
                      type="button"
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="submit-action-btn"
                onClick={() => setIsModalOpen(true)}
                type="button"
              >
                Submit Sale (₦{grandTotal.toLocaleString()})
              </button>
            </div>
          )}

          {/* ADVANCE PAYMENT SECTION */}
          {currentSaleMode === 'advance' && (
            <div className="sales-section">
              {/* SKU Search */}
              <div className="card form-group">
                <label>Scan or Search SKU</label>
                <div className="search-input-wrapper">
                  <Search className="search-icon" size={18} />
                  <input
                    type="text"
                    placeholder="Search item..."
                  />
                </div>
              </div>

              {/* Active Line Item */}
              <div className="card item-card">
                <div className="item-card-header">
                  <span>Active Line Item</span>
                  <span className="badge-success">In Stock</span>
                </div>
                
                <div className="item-row">
                  <div className="item-icon-box">
                    <ShoppingBag size={20} />
                  </div>
                  <input
                    className="item-name-input"
                    type="text"
                    value="Golden Penny Sugar 500g"
                    readOnly
                  />
                </div>

                <div className="item-controls-grid">
                  <div className="input-field-wrap">
                    <label>Unit Price</label>
                    <div className="price-input-container">
                      <span className="currency-symbol">₦</span>
                      <input
                        type="number"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="input-field-wrap">
                    <label>Quantity</label>
                    <div className="qty-selector">
                      <button onClick={() => updateQuantity(-1)} type="button">-</button>
                      <span>{currentQty}</span>
                      <button onClick={() => updateQuantity(1)} type="button">+</button>
                    </div>
                  </div>
                </div>

                <div className="item-total-row">
                  <span>Subtotal (Excl. VAT):</span>
                  <span className="item-grand-total">₦{subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="card form-group">
                <div className="card-header-between">
                  <label>Customer Information</label>
                  <span className="badge-warning">Required for Ledger</span>
                </div>
                <div className="form-stack">
                  <div>
                    <label className="sub-label">Customer Full Name *</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="sub-label">Phone Number *</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="sub-label">Customer Address / Notes</label>
                    <input
                      type="text"
                      placeholder="Optional address"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Financial Calculation & Deposit Box */}
              <div className="card form-group">
                <div className="card-header-between">
                  <label>Amount Paid Now *</label>
                  {/* <span className="min-deposit-label">Min 20%: ₦{minDeposit.toLocaleString()}</span> */}
                </div>
                
                <div className="deposit-input-container">
                  <span className="deposit-symbol">₦</span>
                  <input
                    type="number"
                    value={advanceDeposit}
                    onChange={(e) => setAdvanceDeposit(Number(e.target.value))}
                  />
                </div>

                {/* Payment Method (replaced Quick Select Preset) */}
                <div className="payment-method-card" style={{ marginTop: '0.75rem' }}>
                  <label>Payment Method</label>
                  <div className="payment-options-grid">
                    {['cash', 'card', 'transfer'].map((method) => (
                      <button
                        key={method}
                        className={`payment-option-btn ${activeAdvPayment === method ? 'active' : ''}`}
                        onClick={() => setActiveAdvPayment(method)}
                        type="button"
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="summary-breakdown-box">
                  <div className="summary-row">
                    <span>Total Order Value (Incl. VAT):</span>
                    <span>₦{grandTotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Amount Paid Now:</span>
                    <span className="text-success-val">-₦{advanceDeposit.toLocaleString()}</span>
                  </div>
                  <div className="summary-row outstanding-row">
                    <div>
                      <span className="outstanding-title">Outstanding Balance:</span>
                      {/* <span className="outstanding-note">Due within 14 days</span> */}
                    </div>
                    <span className="outstanding-amount">₦{balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Submit Advance Sale */}
              <button
                className="submit-action-btn"
                onClick={() => setIsModalOpen(true)}
                type="button"
              >
                Record Advance Sale (₦{advanceDeposit.toLocaleString()} Deposit)
              </button>
            </div>
          )}

          {/* Success Modal */}
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-card">
                <div className="modal-icon-wrap">
                  <CheckCircle size={36} />
                </div>
                <h3>Sale Recorded Successfully!</h3>
                <p>Receipt <strong>#TRX-8822</strong> has been logged to the cloud ledger.</p>
                
                <div className="modal-actions">
                  <button
                    className="modal-btn-secondary"
                    onClick={() => alert('Reprinting receipt...')}
                    type="button"
                  >
                    Reprint Copy
                  </button>
                  <button
                    className="modal-btn-primary"
                    onClick={() => { setIsModalOpen(false); setCurrentQty(1); }}
                    type="button"
                  >
                    New Sale
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}