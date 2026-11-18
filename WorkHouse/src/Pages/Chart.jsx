import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";

import "../Styles/chart.css";

/* ---------------------------------------------------------
   SAMPLE DATA (oldest -> newest, last item = today)
   Replace with your real daily sales, or pass a `data`
   prop: an array of numbers, oldest first.
--------------------------------------------------------- */
const SAMPLE_SALES = [
  355000, 372400, 341800, 398200, 415600, 389300, 362100, 431500, 447800,
  420600, 395400, 438900, 462300, 441700, 408200, 376900, 419500, 453800,
  471200, 436400, 398700, 412300, 445600, 468900, 431200, 405800, 444100,
  459700, 422300, 482500,
];

const RANGES = [
  { id: 7, label: "7 days" },
  { id: 14, label: "14 days" },
  { id: 30, label: "30 days" },
];

const PAD = { top: 54, right: 14, bottom: 28, left: 48 };
const EDGE = 12; // keeps first/last points away from the plot edges

const naira = (v) => "₦" + Math.round(v).toLocaleString("en-NG");

const nairaShort = (v) => {
  if (v >= 1000000) return "₦" + +(v / 1000000).toFixed(1) + "M";
  return "₦" + Math.round(v / 1000) + "k";
};

/* Builds the full list of days once, so every point can
   know what the day before it did (even at the range edge). */
function buildDays(values) {
  const today = new Date();
  return values.map((value, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (values.length - 1 - i));
    const prev = i > 0 ? values[i - 1] : null;
    return {
      value,
      prev,
      change: prev === null ? null : value - prev,
      percent: prev === null ? null : ((value - prev) / prev) * 100,
      weekday: d.toLocaleDateString("en-GB", { weekday: "short" }),
      short: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      long: d.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    };
  });
}

/* Smooth line that never overshoots the data (monotone cubic) */
function smoothPath(pts) {
  const n = pts.length;
  if (n < 2) return "";
  const dx = [];
  const slope = [];
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1].x - pts[i].x);
    slope.push((pts[i + 1].y - pts[i].y) / dx[i]);
  }
  const t = new Array(n);
  t[0] = slope[0];
  t[n - 1] = slope[n - 2];
  for (let i = 1; i < n - 1; i++) {
    t[i] = slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
    } else {
      const a = t[i] / slope[i];
      const b = t[i + 1] / slope[i];
      const s = a * a + b * b;
      if (s > 9) {
        const tau = 3 / Math.sqrt(s);
        t[i] = tau * a * slope[i];
        t[i + 1] = tau * b * slope[i];
      }
    }
  }
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C ${pts[i].x + h} ${pts[i].y + t[i] * h}, ${pts[i + 1].x - h} ${
      pts[i + 1].y - t[i + 1] * h
    }, ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
}

function Chart({ onNavigate, data = SAMPLE_SALES }) {
  const [range, setRange] = useState(7);
  const [activeIndex, setActiveIndex] = useState(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const plotRef = useRef(null);
  const svgRef = useRef(null);

  const allDays = useMemo(() => buildDays(data), [data]);
  const days = useMemo(() => allDays.slice(-range), [allDays, range]);
  const n = days.length;

  const active = activeIndex === null ? n - 1 : Math.min(activeIndex, n - 1);
  const current = days[active];

  /* Measure the plot area so the chart always fills it exactly */
  useEffect(() => {
    const el = plotRef.current;
    if (!el) return undefined;
    const measure = () =>
      setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const changeRange = (id) => {
    setRange(id);
    setActiveIndex(null);
  };

  /* ---- Scales ---- */
  const { w, h } = size;
  const innerW = Math.max(w - PAD.left - PAD.right, 1);
  const innerH = Math.max(h - PAD.top - PAD.bottom, 1);

  const values = days.map((d) => d.value);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const yMin = Math.max(Math.floor((lo * 0.9) / 50000) * 50000, 0);
  const yMax = Math.ceil((hi * 1.05) / 50000) * 50000;

  const xAt = (i) =>
    n === 1
      ? PAD.left + innerW / 2
      : PAD.left + EDGE + (i * (innerW - EDGE * 2)) / (n - 1);
  const yAt = (v) =>
    PAD.top + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH;

  const points = days.map((d, i) => ({ x: xAt(i), y: yAt(d.value) }));
  const linePath = smoothPath(points);
  const baseY = PAD.top + innerH;
  const areaPath = linePath
    ? `${linePath} L ${points[n - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`
    : "";

  const ticks = Array.from({ length: 5 }, (_, i) => yMin + ((yMax - yMin) * i) / 4);

  const labelStep = n <= 7 ? 1 : n <= 14 ? 2 : 5;
  const showArrowsEverywhere = n <= 14;

  /* ---- Interaction ---- */
  const pickIndex = (clientX) => {
    if (!svgRef.current || n < 2) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const step = (innerW - EDGE * 2) / (n - 1);
    const i = Math.round((x - PAD.left - EDGE) / step);
    setActiveIndex(Math.max(0, Math.min(n - 1, i)));
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex(Math.max(0, active - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex(Math.min(n - 1, active + 1));
    }
  };

  /* ---- Summary numbers for the visible range ---- */
  const average = values.reduce((a, b) => a + b, 0) / n;
  const bestDay = days[values.indexOf(hi)];
  const worstDay = days[values.indexOf(lo)];

  const isUp = current.change !== null && current.change >= 0;
  const hasChange = current.change !== null;

  const tooltipLeft = Math.min(Math.max(points[active]?.x ?? 0, 78), Math.max(w - 78, 78));

  return (
    <div className="chart-page">
      <header className="chart-header">
        <div className="chart-header-content">
          <button
            className="chart-back-button"
            type="button"
            onClick={() => onNavigate && onNavigate("home")}
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="chart-header-title">
            <span>Sales Chart</span>
          </div>
        </div>
      </header>

      <main className="chart-main">
        <section className="chart-summary">
          <div className="chart-summary-top">
            <div>
              <span className="chart-summary-label">
                {active === n - 1 ? "Today's sales" : current.long}
              </span>
              <div className="chart-summary-value">{naira(current.value)}</div>
            </div>
            {hasChange && (
              <div className={`chart-pill ${isUp ? "up" : "down"}`}>
                {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>
                  {isUp ? "+" : ""}
                  {current.percent.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          {hasChange && (
            <div className="chart-compare-row">
              <span>vs. day before</span>
              <strong>{naira(current.prev)}</strong>
            </div>
          )}
        </section>

        <div className="chart-ranges" role="group" aria-label="Date range">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`chart-range ${range === r.id ? "active" : ""}`}
              aria-pressed={range === r.id}
              onClick={() => changeRange(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <section className="chart-card">
          <div className="chart-plot" ref={plotRef}>
            {w > 0 && h > 0 && (
              <>
                <svg
                  ref={svgRef}
                  className="chart-svg"
                  width={w}
                  height={h}
                  viewBox={`0 0 ${w} ${h}`}
                  tabIndex={0}
                  role="img"
                  aria-label={`Sales for the last ${range} days. Use left and right arrow keys to move between days.`}
                  onPointerMove={(e) => pickIndex(e.clientX)}
                  onPointerDown={(e) => pickIndex(e.clientX)}
                  onKeyDown={onKeyDown}
                >
                  <defs>
                    <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#2563eb" stopOpacity="0.22" />
                      <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Grid + y labels */}
                  {ticks.map((t) => (
                    <g key={t}>
                      <line
                        className="chart-grid"
                        x1={PAD.left}
                        x2={w - PAD.right}
                        y1={yAt(t)}
                        y2={yAt(t)}
                      />
                      <text
                        className="chart-axis-text"
                        x={PAD.left - 8}
                        y={yAt(t) + 3.5}
                        textAnchor="end"
                      >
                        {nairaShort(t)}
                      </text>
                    </g>
                  ))}

                  {/* X labels */}
                  {days.map((d, i) =>
                    (n - 1 - i) % labelStep === 0 ? (
                      <text
                        key={i}
                        className={`chart-axis-text ${i === active ? "active" : ""}`}
                        x={xAt(i)}
                        y={h - 8}
                        textAnchor="middle"
                      >
                        {i === n - 1 ? "Today" : n <= 7 ? d.weekday : d.short}
                      </text>
                    ) : null
                  )}

                  {/* Area + line */}
                  <path d={areaPath} fill="url(#chartArea)" />
                  <path className="chart-line" d={linePath} />

                  {/* Active guide line */}
                  <line
                    className="chart-guide"
                    x1={points[active].x}
                    x2={points[active].x}
                    y1={PAD.top - 6}
                    y2={baseY}
                  />

                  {/* Dots + up/down arrows */}
                  {days.map((d, i) => {
                    const isActive = i === active;
                    const up = d.change !== null && d.change >= 0;
                    const showArrow =
                      d.change !== null && (showArrowsEverywhere || isActive);
                    const arrowY = up ? points[i].y - 15 : points[i].y + 15;
                    return (
                      <g key={i}>
                        {(showArrowsEverywhere || isActive) && (
                          <circle
                            className={isActive ? "chart-dot active" : "chart-dot"}
                            cx={points[i].x}
                            cy={points[i].y}
                            r={isActive ? 6 : 3.5}
                          />
                        )}
                        {showArrow && (
                          <g
                            className={`chart-arrow ${up ? "up" : "down"} ${
                              isActive ? "active" : ""
                            }`}
                            transform={`translate(${points[i].x} ${arrowY}) ${
                              up ? "" : "rotate(180)"
                            }`}
                          >
                            <path d="M0 5 V-5 M-3.6 -1.6 L0 -5.2 L3.6 -1.6" />
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Floating label for the selected day */}
                <div
                  className="chart-tooltip"
                  style={{ left: tooltipLeft, top: 8 }}
                >
                  <span className="chart-tooltip-date">{current.long}</span>
                  <strong>{naira(current.value)}</strong>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="chart-stats">
          <div className="chart-stat">
            <span>Highest</span>
            <strong>{nairaShort(hi)}</strong>
            <small>{bestDay.short}</small>
          </div>
          <div className="chart-stat">
            <span>Lowest</span>
            <strong>{nairaShort(lo)}</strong>
            <small>{worstDay.short}</small>
          </div>
          <div className="chart-stat">
            <span>Average</span>
            <strong>{nairaShort(average)}</strong>
            <small>per day</small>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Chart;