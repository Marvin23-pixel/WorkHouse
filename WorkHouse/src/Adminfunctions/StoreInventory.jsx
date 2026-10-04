import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Search,
  X,
  Plus,
  MoreVertical,
  Minus,
  Trash2,
  CheckCircle2,
  SearchX,
} from "lucide-react";
import "../Styles/storeinventory.css";
import ChatbotWindow from "../Adminfunctions/ChatbotWindow.jsx";

// ---------------------------------------------------------------
// Seed data — swap this for your real inventory source / API call
// Exported so AdminDashboard.jsx can read the same list directly.
// ---------------------------------------------------------------
export const INITIAL_PRODUCTS = [
  {
    id: "SKU-88210",
    name: "Mama Gold Rice 5kg",
    price: 4800,
    stock: 38,
    unitLabel: "units in stock",
    note: "Restocked",
  },
  {
    id: "SKU-10492",
    name: "Golden Penny Bread 800g",
    price: 1200,
    stock: 3,
    unitLabel: "units in stock",
  },
  {
    id: "SKU-33291",
    name: "Coca-Cola PET 50cl",
    price: 500,
    stock: 85,
    unitLabel: "units in stock",
  },
  {
    id: "SKU-44021",
    name: "Peak Evap Milk 160g",
    price: 950,
    stock: 4,
    unitLabel: "units in stock",
  },
  {
    id: "SKU-77290",
    name: "Indomie Super Pack (Carton)",
    price: 13500,
    stock: 18,
    unitLabel: "cartons",
  },
  {
    id: "SKU-20914",
    name: "Nestle Milo Tin 500g",
    price: 2500,
    stock: 0,
    unitLabel: "units remaining",
  },
];

export const LOW_STOCK_THRESHOLD = 5;

export function getStatus(stock) {
  if (stock === 0) return "out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low";
  return "normal";
}

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

export default function StoreInventory({ onBack, products, setProducts }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // all | low | out
  const [activeItemId, setActiveItemId] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [sheetMode, setSheetMode] = useState("single"); // single | bulk
  const [modalName, setModalName] = useState("");
  const [modalStock, setModalStock] = useState(0);
  const [modalPrice, setModalPrice] = useState(0);
  const [bulkText, setBulkText] = useState("");
  const [bulkDefaultStock, setBulkDefaultStock] = useState(10);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const counts = useMemo(() => {
    const low = products.filter((p) => getStatus(p.stock) === "low").length;
    const out = products.filter((p) => getStatus(p.stock) === "out").length;
    return { all: products.length, low, out };
  }, [products]);

  const visibleProducts = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products.filter((p) => {
      const status = getStatus(p.stock);
      const matchesSearch =
        p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      const matchesFilter =
        activeFilter === "all" ? true : status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [products, query, activeFilter]);

  const activeItem = products.find((p) => p.id === activeItemId) || null;
  const sheetOpen = Boolean(activeItem) || isAddMode;

  function showToast(message) {
    setToast({ visible: true, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      2200
    );
  }

  function openActionModal(product) {
    setIsAddMode(false);
    setSheetMode("single");
    setActiveItemId(product.id);
    setModalName(product.name);
    setModalStock(product.stock);
    setModalPrice(product.price);
  }

  function closeActionModal() {
    setActiveItemId(null);
    setIsAddMode(false);
    setSheetMode("single");
    setBulkText("");
  }

  function adjustModalStock(delta) {
    setModalStock((s) => Math.max(0, s + delta));
  }

  function generateSku() {
    return `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  function saveInventoryChanges() {
    const trimmedName = modalName.trim() || "Unnamed Product";
    if (isAddMode) {
      const newProduct = {
        id: generateSku(),
        name: trimmedName,
        price: modalPrice,
        stock: modalStock,
        unitLabel: "units in stock",
      };
      setProducts((prev) => [newProduct, ...prev]);
      closeActionModal();
      showToast(`Added "${trimmedName}"`);
      return;
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id === activeItemId
          ? { ...p, name: trimmedName, stock: modalStock, price: modalPrice }
          : p
      )
    );
    closeActionModal();
    showToast(`Updated "${trimmedName}"`);
  }

  function confirmDeleteItem() {
    setProducts((prev) => prev.filter((p) => p.id !== activeItemId));
    closeActionModal();
    showToast("Product removed from store catalog");
  }

  function openAddModal() {
    setIsAddMode(true);
    setSheetMode("single");
    setActiveItemId(null);
    setModalName("");
    setModalStock(10);
    setModalPrice(0);
    setBulkText("");
  }

  // Parses lines like "Mama Gold Rice 5kg - 4800", "Coca-Cola 50cl 500",
  // "Peak Milk: ₦950" — takes the trailing number on each line as the
  // price and everything before it as the product name.
  function parseBulkLines(text) {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const match = line.match(/([\d][\d,]*(?:\.\d+)?)\s*$/);
        if (!match) return null;
        const price = Number(match[1].replace(/,/g, ""));
        if (Number.isNaN(price)) return null;
        const name = line
          .slice(0, match.index)
          .replace(/[₦N]\s*$/i, "")
          .replace(/[-:–—•]+\s*$/, "")
          .trim();
        if (!name) return null;
        return { name, price };
      })
      .filter(Boolean);
  }

  const bulkPreview = useMemo(() => parseBulkLines(bulkText), [bulkText]);

  function applyBulkAdd() {
    if (bulkPreview.length === 0) {
      showToast("No valid items found — check your list");
      return;
    }
    const newProducts = bulkPreview.map((item) => ({
      id: generateSku(),
      name: item.name,
      price: item.price,
      stock: bulkDefaultStock,
      unitLabel: "units in stock",
    }));
    setProducts((prev) => [...newProducts, ...prev]);
    const count = newProducts.length;
    closeActionModal();
    showToast(`Added ${count} product${count === 1 ? "" : "s"}`);
  }

  function resetSearch() {
    setQuery("");
    setActiveFilter("all");
  }

  function stockStatusLabel(stock) {
    if (stock === 0) return { text: "Out of Stock", className: "si-stock-status si-stock-status--out" };
    if (stock <= LOW_STOCK_THRESHOLD)
      return { text: "Low Stock Alert", className: "si-stock-status si-stock-status--low" };
    return { text: "Optimal Balance", className: "si-stock-status si-stock-status--ok" };
  }

  const modalStatus = stockStatusLabel(modalStock);

  return (
    <div className="si-root">
      {/* Header — back button, title, subtitle, live status, alerts */}
      <header className="si-header">
        <div className="si-header-inner">
          <div className="si-header-left">
            <button
              type="button"
              className="si-icon-btn"
              aria-label="Go back"
              onClick={onBack}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="si-title">Store Inventory</h1>
              <span className="si-subtitle">Real-time shelf balances</span>
            </div>
          </div>
          <div className="si-header-right">
            {/* <span className="si-live-dot" aria-hidden="true" /> */}
            <button
              type="button"
              className="si-chatbot-btn"
              onClick={() => setIsChatbotOpen(true)}
              aria-label="Open Chatbot Assistant"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="siRobotShell" x1="4" y1="4" x2="19" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFFFFF" />
                    <stop offset="0.55" stopColor="#DCE5F2" />
                    <stop offset="1" stopColor="#AAB9CC" />
                  </linearGradient>
                  <linearGradient id="siRobotScreen" x1="8" y1="7" x2="17" y2="17" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#253B63" />
                    <stop offset="0.5" stopColor="#101B35" />
                    <stop offset="1" stopColor="#060B18" />
                  </linearGradient>
                  <radialGradient id="siRobotEye" cx="0" cy="0" r="1" gradientTransform="translate(10 11) rotate(90) scale(2.2)">
                    <stop stopColor="#FFFFFF" />
                    <stop offset="0.65" stopColor="#D7E8FF" />
                    <stop offset="1" stopColor="#70A8FF" />
                  </radialGradient>
                  <filter id="siRobotGlow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="0.35" />
                  </filter>
                </defs>
                <path d="M4.1 10.2a7.9 7.9 0 0 1 15.8 0" stroke="#91A4BE" strokeWidth="1.3" strokeLinecap="round" />
                <rect x="2.7" y="10.2" width="2.2" height="4.8" rx="1.1" fill="#8FA1B9" />
                <rect x="19.1" y="10.2" width="2.2" height="4.8" rx="1.1" fill="#8FA1B9" />
                <rect x="4.8" y="4.8" width="14.4" height="14.4" rx="4.8" fill="url(#siRobotShell)" stroke="#8799B1" strokeWidth="0.7" />
                <path d="M7.4 6.4c2.1-1.1 6.9-1 9.1.3" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="0.8" strokeLinecap="round" />
                <rect x="6.7" y="7.7" width="10.6" height="8.7" rx="3.35" fill="url(#siRobotScreen)" stroke="#34496D" strokeWidth="0.55" />
                <ellipse cx="10" cy="11.2" rx="1.05" ry="1.25" fill="#7EB2FF" opacity="0.55" filter="url(#siRobotGlow)" />
                <ellipse cx="14" cy="11.2" rx="1.05" ry="1.25" fill="#7EB2FF" opacity="0.55" filter="url(#siRobotGlow)" />
                <ellipse cx="10" cy="11.2" rx="0.68" ry="0.85" fill="url(#siRobotEye)" />
                <ellipse cx="14" cy="11.2" rx="0.68" ry="0.85" fill="url(#siRobotEye)" />
                <path d="M9.25 13.65c.72.78 1.55 1.12 2.75 1.12s2.03-.34 2.75-1.12" stroke="#B9D7FF" strokeWidth="0.85" strokeLinecap="round" />
                <path d="M19.7 14.8v2.15c0 1.05-.85 1.9-1.9 1.9h-1.1" stroke="#8296B2" strokeWidth="0.9" strokeLinecap="round" />
                <rect x="15.5" y="18.1" width="2.3" height="1.15" rx="0.57" fill="#7186A3" />
              </svg>
              <span className="si-badge-dot" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="si-main">
        {/* Search */}
        <div className="si-search-wrap">
          <div className="si-search-field">
            <span className="si-search-icon">
              <Search size={20} />
            </span>
            <input
              className="si-search-input"
              placeholder="Search SKU, brand, or product..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query.length > 0 && (
              <button
                type="button"
                className="si-search-clear"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Filter pills */}
        <div className="si-filters">
          <button
            type="button"
            className={`si-pill ${activeFilter === "all" ? "si-pill--active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Products <span className="si-pill-count">({counts.all})</span>
          </button>
          <button
            type="button"
            className={`si-pill ${activeFilter === "low" ? "si-pill--active" : ""}`}
            onClick={() => setActiveFilter("low")}
          >
            <span className="si-dot si-dot--warning" />
            Low Stock <span className="si-pill-count">({counts.low})</span>
          </button>
          <button
            type="button"
            className={`si-pill ${activeFilter === "out" ? "si-pill--active" : ""}`}
            onClick={() => setActiveFilter("out")}
          >
            <span className="si-dot si-dot--error" />
            Out of Stock <span className="si-pill-count">({counts.out})</span>
          </button>
        </div>

        {/* Product list */}
        {visibleProducts.length > 0 ? (
          <div className="si-list">
            {visibleProducts.map((product) => {
              const status = getStatus(product.stock);
              return (
                <button
                  key={product.id}
                  type="button"
                  className={`si-item ${status === "out" ? "si-item--out" : ""}`}
                  onClick={() => openActionModal(product)}
                >
                  <div className="si-item-left">
                    <div className="si-item-info">
                      <span className="si-item-name">{product.name}</span>
                      <div className="si-item-meta">
                        <span className="si-item-sku">{product.id}</span>
                        <span className="si-item-dot-sep" />
                        {status === "low" ? (
                          <span className="si-chip-low">
                            <span className="si-dot si-dot--warning" />
                            {product.stock} left
                          </span>
                        ) : status === "out" ? (
                          <span className="si-item-stock si-item-stock--error">
                            0 {product.unitLabel}
                          </span>
                        ) : (
                          <span className="si-item-stock">
                            {product.stock} {product.unitLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="si-item-right">
                    <div className="si-item-price">
                      <span className={`si-price ${status === "out" ? "si-price--strike" : ""}`}>
                        {formatNaira(product.price)}
                      </span>
                      {status === "low" && (
                        <span className="si-status-label si-status-label--warning">Low Stock</span>
                      )}
                      {status === "out" && (
                        <span className="si-status-label si-status-label--error">Out of Stock</span>
                      )}
                      {status === "normal" && (
                        <span
                          className={`si-status-label ${
                            product.note === "Restocked" ? "si-status-label--success" : "si-status-label--muted"
                          }`}
                        >
                          {product.note ?? "In Stock"}
                        </span>
                      )}
                    </div>
                    <span
                      role="button"
                      tabIndex={0}
                      aria-label="Item Actions"
                      className="si-item-menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openActionModal(product);
                      }}
                    >
                      <MoreVertical size={20} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="si-empty">
            <div className="si-empty-icon">
              <SearchX size={28} />
            </div>
            <p className="si-empty-title">No products found</p>
            <p className="si-empty-copy">
              Try adjusting your search query or clear the active filter.
            </p>
            <button type="button" className="si-empty-clear" onClick={resetSearch}>
              Clear filters
            </button>
          </div>
        )}
      </main>

      {/* Floating Add button */}
      <button type="button" className="si-fab" onClick={openAddModal}>
        <Plus size={20} />
        <span className="si-fab-label">Add Product</span>
      </button>

      {/* Quick actions bottom sheet */}
      <div
        className={`si-scrim ${sheetOpen ? "si-scrim--open" : ""}`}
        onClick={closeActionModal}
        aria-hidden="true"
      />
      <div className={`si-sheet ${sheetOpen ? "si-sheet--open" : ""}`}>
        <div className="si-sheet-handle" />
        <div className="si-sheet-header">
          <div>
            <span className="si-sheet-sku">
              {isAddMode ? "New Product" : activeItem?.id}
            </span>
            <h2 className="si-sheet-name">
              {isAddMode
                ? sheetMode === "bulk"
                  ? "Bulk Add Products"
                  : "Add Product"
                : modalName || activeItem?.name}
            </h2>
          </div>
          <button type="button" className="si-sheet-close" onClick={closeActionModal} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {isAddMode && (
          <div className="si-mode-toggle">
            <button
              type="button"
              className={`si-mode-btn ${sheetMode === "single" ? "si-mode-btn--active" : ""}`}
              onClick={() => setSheetMode("single")}
            >
              Single Item
            </button>
            <button
              type="button"
              className={`si-mode-btn ${sheetMode === "bulk" ? "si-mode-btn--active" : ""}`}
              onClick={() => setSheetMode("bulk")}
            >
              Bulk Add
            </button>
          </div>
        )}

        {sheetMode === "bulk" ? (
          <>
            <div className="si-field">
              <label className="si-field-label" htmlFor="si-bulk-textarea">
                Paste Your Product List
              </label>
              <textarea
                id="si-bulk-textarea"
                className="si-bulk-textarea"
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={"One item per line, name then price, e.g.\nMama Gold Rice 5kg - 4800\nGolden Penny Bread 1200\nCoca-Cola 50cl - 500"}
                rows={6}
              />
              <p className="si-bulk-hint">
                {bulkPreview.length > 0
                  ? `${bulkPreview.length} product${bulkPreview.length === 1 ? "" : "s"} detected`
                  : "Paste a list — one product and price per line"}
              </p>
            </div>

            <div className="si-field">
              <label className="si-field-label" htmlFor="si-bulk-stock">
                Default Stock (applied to all)
              </label>
              <input
                id="si-bulk-stock"
                type="number"
                className="si-name-input"
                value={bulkDefaultStock}
                onChange={(e) => setBulkDefaultStock(Math.max(0, Number(e.target.value)))}
              />
            </div>

            <div className="si-sheet-actions">
              <button type="button" className="si-btn-primary" onClick={applyBulkAdd}>
                Add {bulkPreview.length > 0 ? bulkPreview.length : ""} Products
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="si-field">
              <label className="si-field-label" htmlFor="si-name-input">
                Product Name
              </label>
              <input
                id="si-name-input"
                type="text"
                className="si-name-input"
                value={modalName}
                onChange={(e) => setModalName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="si-stock-card">
              <div className="si-stock-card-top">
                <span className="si-stock-card-label">Shelf Inventory Count</span>
                <span className={modalStatus.className}>{modalStatus.text}</span>
              </div>
              <div className="si-stepper">
                <button
                  type="button"
                  className="si-stepper-btn"
                  onClick={() => adjustModalStock(-1)}
                  aria-label="Decrease stock"
                >
                  <Minus size={20} />
                </button>
                <div className="si-stepper-value">
                  <span className="si-stepper-number">{modalStock}</span>
                  <span className="si-stepper-unit">units</span>
                </div>
                <button
                  type="button"
                  className="si-stepper-btn"
                  onClick={() => adjustModalStock(1)}
                  aria-label="Increase stock"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="si-field">
              <label className="si-field-label" htmlFor="si-price-input">
                Selling Price (NGN)
              </label>
              <div className="si-price-field">
                <span className="si-price-currency">₦</span>
                <input
                  id="si-price-input"
                  type="number"
                  step="50"
                  className="si-price-input"
                  value={modalPrice}
                  onChange={(e) => setModalPrice(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="si-sheet-actions">
              <button type="button" className="si-btn-primary" onClick={saveInventoryChanges}>
                {isAddMode ? "Add Product" : "Apply Updates"}
              </button>
              {!isAddMode && (
                <button type="button" className="si-btn-danger" onClick={confirmDeleteItem}>
                  <Trash2 size={18} />
                  Remove from Inventory
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      <div className={`si-toast ${toast.visible ? "si-toast--visible" : ""}`}>
        <CheckCircle2 size={16} color="var(--color-success)" />
        <span>{toast.message}</span>
      </div>

      <ChatbotWindow
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </div>
  );
}