import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  Bell,
  Search,
  ShoppingBag,
  CheckCircle,
  ScanLine,
  X,
  CameraOff,
  Minus,
  Plus
} from 'lucide-react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import Logo from "../assets/Logo.png";
import { normalizeCode } from "../Adminfunctions/StoreInventory";
import '../Styles/sales.css';

/* ---------- Instant beeps (Web Audio, no file needed) ---------- */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  return audioCtx;
}

// Call on a user tap so the browser allows sound later with zero delay
function unlockAudio() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

function tone(freq, startOffset, duration, type = 'square', volume = 0.3) {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t = ctx.currentTime + startOffset;

  osc.type = type;
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.005);
  gain.gain.setValueAtTime(volume, t + duration - 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}

// Supermarket-style "item added" beep
function playBeep() {
  tone(1900, 0, 0.14);
}

// Low double buzz: item not found / out of stock / stock limit reached
function playErrorBeep() {
  tone(400, 0, 0.12, 'sawtooth', 0.2);
  tone(300, 0.16, 0.18, 'sawtooth', 0.2);
}

/* ---------- Helpers ---------- */
const formatNaira = (n) => `₦${Number(n).toLocaleString()}`;

function describeResult(result, code) {
  switch (result.status) {
    case 'added':
      return { type: 'success', text: `Added: ${result.name}` };
    case 'outofstock':
      return { type: 'warn', text: `${result.name} is out of stock` };
    case 'maxstock':
      return { type: 'warn', text: `Only ${result.stock} of ${result.name} in stock` };
    default:
      return { type: 'warn', text: code ? `No item found for "${code}"` : 'No item found' };
  }
}

/* ---------- Barcode Scanner Overlay (stays open for continuous scanning) ---------- */
const SCANNER_REGION_ID = 'sales-scanner-region';
const SCAN_COOLDOWN_MS = 1200; // ignore the same code while it stays in view

function BarcodeScanner({ onScan, itemCount, total, onClose }) {
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(true);
  const [lastResult, setLastResult] = useState(null);
  const onScanRef = useRef(onScan);
  const lastScanRef = useRef({ code: '', time: 0 });

  // Always call the latest onScan without restarting the camera
  useEffect(() => {
    onScanRef.current = onScan;
  });

  useEffect(() => {
    const scanner = new Html5Qrcode(SCANNER_REGION_ID, {
      verbose: false,
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
        Html5QrcodeSupportedFormats.QR_CODE
      ],
      experimentalFeatures: { useBarCodeDetectorIfSupported: true }
    });

    const startPromise = scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 160 }, aspectRatio: 1.0 },
        (decodedText) => {
          const now = Date.now();
          const last = lastScanRef.current;

          // Same code still in front of the camera: don't add it again
          if (decodedText === last.code && now - last.time < SCAN_COOLDOWN_MS) {
            lastScanRef.current = { code: decodedText, time: now };
            return;
          }
          lastScanRef.current = { code: decodedText, time: now };

          const result = onScanRef.current(decodedText);

          if (result.status === 'added') {
            playBeep();
          } else {
            playErrorBeep();
          }
          if (navigator.vibrate) navigator.vibrate(80);

          setLastResult({ ...describeResult(result, decodedText), key: now });
        },
        () => {} // ignore "no code found" frames
      )
      .then(() => setStarting(false))
      .catch((err) => {
        const msg = String(err || '');
        if (/NotAllowed|Permission/i.test(msg)) {
          setError('Camera permission was denied. Please allow camera access in your browser settings and try again.');
        } else if (/NotFound|Requested device not found/i.test(msg)) {
          setError('No camera was found on this device.');
        } else {
          setError('Unable to start the camera. Make sure no other app is using it, then try again.');
        }
        setStarting(false);
      });

    return () => {
      startPromise
        .then(() => scanner.stop())
        .then(() => scanner.clear())
        .catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="scanner-overlay" role="dialog" aria-modal="true" aria-label="Scan barcode">
      <div className="scanner-card">
        <div className="scanner-header">
          <div>
            <h3>Scan Items</h3>
            <p>Keep scanning. Each item is added automatically.</p>
          </div>
          <button className="scanner-close-btn" onClick={onClose} type="button" aria-label="Close scanner">
            <X size={20} />
          </button>
        </div>

        <div className="scanner-viewport">
          <div id={SCANNER_REGION_ID} className="scanner-region" />

          {!error && (
            <div className="scanner-frame" aria-hidden="true">
              <span className="corner tl" />
              <span className="corner tr" />
              <span className="corner bl" />
              <span className="corner br" />
              <span className="scan-line" />
            </div>
          )}

          {starting && !error && (
            <div className="scanner-status">
              <span className="scanner-spinner" />
              <p>Starting camera...</p>
            </div>
          )}

          {error && (
            <div className="scanner-status scanner-error">
              <CameraOff size={32} />
              <p>{error}</p>
            </div>
          )}
        </div>

        <div
          key={lastResult ? lastResult.key : 'idle'}
          className={`scanner-last ${lastResult ? (lastResult.type === 'success' ? 'ok' : 'warn') : ''}`}
        >
          {lastResult ? lastResult.text : 'Waiting for a barcode...'}
        </div>

        <div className="scanner-summary">
          <span>Items in sale: <strong>{itemCount}</strong></span>
          <span>Total: <strong>{formatNaira(total)}</strong></span>
        </div>

        <button className="scanner-done-btn" onClick={onClose} type="button">
          Done{itemCount > 0 ? ` (${itemCount} item${itemCount === 1 ? '' : 's'})` : ''}
        </button>
      </div>
    </div>
  );
}

/* ---------- Sales Page ---------- */
export default function Sales({ onNavigate, products = [] }) {
  const [currentSaleMode, setCurrentSaleMode] = useState('full');
  const [activePayment, setActivePayment] = useState('cash');
  const [activeAdvPayment, setActiveAdvPayment] = useState('cash');
  const [customerName, setCustomerName] = useState('Chief Adeleke');
  const [customerPhone, setCustomerPhone] = useState('0803 234 5678');
  const [customerAddress, setCustomerAddress] = useState('');
  const [advanceDeposit, setAdvanceDeposit] = useState(2500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skuQuery, setSkuQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [notice, setNotice] = useState(null); // { type: 'success' | 'warn', text }

  // Cart lines only store { id, qty }. Name, price and stock always come
  // live from the store inventory, so changes there show up here instantly.
  const [cart, setCart] = useState([]);
  const cartRef = useRef([]);
  const productsRef = useRef(products);
  productsRef.current = products;
  const noticeTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(noticeTimerRef.current), []);

  const commitCart = (next) => {
    cartRef.current = next;
    setCart(next);
  };

  const showNotice = (type, text) => {
    setNotice({ type, text });
    clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => setNotice(null), 2500);
  };

  // Exact match on barcode number or SKU
  const findByCode = (raw) => {
    const trimmed = String(raw ?? '').trim();
    if (!trimmed) return null;
    const code = normalizeCode(trimmed);
    return (
      productsRef.current.find(
        (p) =>
          (p.barcode && normalizeCode(p.barcode) === code) ||
          p.id.toLowerCase() === trimmed.toLowerCase()
      ) || null
    );
  };

  // Adds 1 of a product (or +1 if already in the list). Returns what happened.
  const addProductToCart = (product) => {
    if (!product) return { status: 'notfound' };
    if (product.stock <= 0) return { status: 'outofstock', name: product.name };

    const current = cartRef.current;
    const existing = current.find((line) => line.id === product.id);

    if (existing) {
      if (existing.qty >= product.stock) {
        return { status: 'maxstock', name: product.name, stock: product.stock };
      }
      commitCart(
        current.map((line) =>
          line.id === product.id ? { ...line, qty: line.qty + 1 } : line
        )
      );
    } else {
      // newest item goes on top so it is always visible
      commitCart([{ id: product.id, qty: 1 }, ...current]);
    }
    return { status: 'added', name: product.name };
  };

  // Called by the scanner for every barcode it reads
  const handleScan = (code) => addProductToCart(findByCode(code));

  const handleManualAdd = (product) => {
    const result = addProductToCart(product);
    const info = describeResult(result);
    showNotice(info.type, info.text);
    setSkuQuery('');
  };

  const changeQty = (id, delta) => {
    const product = products.find((p) => p.id === id);
    const max = product ? product.stock : Infinity;
    let hitMax = false;

    const next = cartRef.current.map((line) => {
      if (line.id !== id) return line;
      let qty = line.qty + delta;
      if (qty > max) {
        qty = Math.max(1, max);
        hitMax = true;
      }
      if (qty < 1) qty = 1;
      return { ...line, qty };
    });
    commitCart(next);
    if (hitMax && product) {
      showNotice('warn', `Only ${product.stock} of ${product.name} in stock`);
    }
  };

  const removeItem = (id) => commitCart(cartRef.current.filter((line) => line.id !== id));
  const clearCart = () => commitCart([]);

  // Search box: auto-add on an exact barcode / SKU, Enter to add, tap a suggestion
  const handleSkuChange = (e) => {
    const value = e.target.value;
    setSkuQuery(value);
    const trimmed = value.trim();
    if (trimmed.length >= 6) {
      const exact = findByCode(trimmed);
      if (exact) handleManualAdd(exact);
    }
  };

  const suggestions = useMemo(() => {
    const q = skuQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.barcode && p.barcode.toLowerCase().includes(q))
      )
      .slice(0, 5);
  }, [skuQuery, products]);

  const handleSkuKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = skuQuery.trim();
    if (!trimmed) return;

    const product = findByCode(trimmed) || (suggestions.length === 1 ? suggestions[0] : null);
    if (product) {
      handleManualAdd(product);
    } else if (suggestions.length > 1) {
      showNotice('warn', 'Tap an item from the list to add it');
    } else {
      showNotice('warn', `No item found for "${trimmed}"`);
    }
  };

  // Cart lines joined with live inventory data
  const cartItems = useMemo(
    () =>
      cart
        .map((line) => {
          const p = products.find((x) => x.id === line.id);
          return p ? { ...p, qty: line.qty } : null;
        })
        .filter(Boolean),
    [cart, products]
  );

  // Financial Calculations (all items together)
  const totalUnits = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const vat = currentSaleMode === 'advance' ? Math.round(subtotal * 0.075) : 0;
  const grandTotal = subtotal + vat;
  const balance = Math.max(0, grandTotal - advanceDeposit);
  const cartEmpty = cartItems.length === 0;

  // Shared SKU search + scan row (used in both tabs)
  const renderSkuSearch = () => (
    <div className="card form-group">
      <label>Scan or Search SKU</label>
      <div className="search-row">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search item..."
            value={skuQuery}
            onChange={handleSkuChange}
            onKeyDown={handleSkuKeyDown}
          />
        </div>
        <button
          className="scan-btn"
          onClick={() => {
            unlockAudio();
            setIsScannerOpen(true);
          }}
          type="button"
          aria-label="Scan items with camera"
          title="Scan with camera"
        >
          <ScanLine size={22} />
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((p) => (
            <button
              key={p.id}
              className="suggestion-item"
              type="button"
              disabled={p.stock <= 0}
              onClick={() => handleManualAdd(p)}
            >
              <span className="suggestion-text">
                <span className="suggestion-name">{p.name}</span>
                <span className="suggestion-meta">
                  {p.stock <= 0 ? 'Out of stock' : `${p.stock} in stock`}
                  {p.barcode ? ` · ${p.barcode}` : ''}
                </span>
              </span>
              <span className="suggestion-price">{formatNaira(p.price)}</span>
            </button>
          ))}
        </div>
      )}

      {notice && <p className={`search-notice ${notice.type}`}>{notice.text}</p>}
    </div>
  );

  // Shared items list (used in both tabs)
  const renderItemsCard = () => (
    <div className="card cart-card">
      <div className="cart-header">
        <span className="cart-title">
          Items in this sale
          {!cartEmpty && <span className="cart-count">{totalUnits}</span>}
        </span>
        {!cartEmpty && (
          <button className="cart-clear-btn" onClick={clearCart} type="button">
            Clear all
          </button>
        )}
      </div>

      {cartEmpty ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <ShoppingBag size={22} />
          </div>
          <p>No items yet</p>
          <span>Scan or search above to add items</span>
        </div>
      ) : (
        <ul className="cart-list">
          {cartItems.map((item) => (
            <li className="cart-row" key={item.id}>
              <div className="cart-row-top">
                <span className="cart-item-name">{item.name}</span>
                <button
                  className="cart-remove-btn"
                  onClick={() => removeItem(item.id)}
                  type="button"
                  aria-label={`Remove ${item.name}`}
                >
                  <X size={16} />
                </button>
              </div>
              <div className="cart-row-bottom">
                <span className="cart-unit">
                  {formatNaira(item.price)} each
                  {item.stock <= 5 && (
                    <span className="cart-low"> · only {item.stock} left</span>
                  )}
                </span>
                <div className="cart-row-right">
                  <div className="cart-qty">
                    <button
                      onClick={() => changeQty(item.id, -1)}
                      type="button"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button
                      onClick={() => changeQty(item.id, 1)}
                      type="button"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="cart-line-total">{formatNaira(item.price * item.qty)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="item-total-row">
        <span>{currentSaleMode === 'advance' ? 'Subtotal (Excl. VAT):' : 'Total:'}</span>
        <span className="item-grand-total">{formatNaira(subtotal)}</span>
      </div>
    </div>
  );

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
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            <img className="sales-logo" src={Logo} alt="Digisol logo" />
            <div className="sales-title-group">
              <span>Record Sale</span>
            </div>
          </div>
          <button className="sales-notif-btn" type="button" aria-label="Notifications">
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
              {renderSkuSearch()}
              {renderItemsCard()}

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
                disabled={cartEmpty}
                type="button"
              >
                {cartEmpty ? 'Add items to continue' : `Submit Sale (${formatNaira(grandTotal)})`}
              </button>
            </div>
          )}

          {/* ADVANCE PAYMENT SECTION */}
          {currentSaleMode === 'advance' && (
            <div className="sales-section">
              {renderSkuSearch()}
              {renderItemsCard()}

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
                </div>

                <div className="deposit-input-container">
                  <span className="deposit-symbol">₦</span>
                  <input
                    type="number"
                    value={advanceDeposit}
                    onChange={(e) => setAdvanceDeposit(Number(e.target.value))}
                  />
                </div>

                {/* Payment Method */}
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
                    <span>{formatNaira(grandTotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Amount Paid Now:</span>
                    <span className="text-success-val">-{formatNaira(advanceDeposit)}</span>
                  </div>
                  <div className="summary-row outstanding-row">
                    <div>
                      <span className="outstanding-title">Outstanding Balance:</span>
                    </div>
                    <span className="outstanding-amount">{formatNaira(balance)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Advance Sale */}
              <button
                className="submit-action-btn"
                onClick={() => setIsModalOpen(true)}
                disabled={cartEmpty}
                type="button"
              >
                {cartEmpty
                  ? 'Add items to continue'
                  : `Record Advance Sale (${formatNaira(advanceDeposit)} Deposit)`}
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
                    onClick={() => {
                      setIsModalOpen(false);
                      clearCart();
                      setSkuQuery('');
                    }}
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

      {/* Barcode Scanner Overlay */}
      {isScannerOpen && (
        <BarcodeScanner
          onScan={handleScan}
          itemCount={totalUnits}
          total={grandTotal}
          onClose={() => setIsScannerOpen(false)}
        />
      )}
    </div>
  );
}