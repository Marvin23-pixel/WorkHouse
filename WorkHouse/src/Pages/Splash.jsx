import { useEffect, useRef, useState } from "react";
import logo from "../assets/Logo.png"; // change this path to wherever Logo.png lives
import "../Styles/splash.css";

// The loading bar runs from 4.1s to 6.4s (see .splash__fill in splash.css).
// SHOW_FOR = bar finish (6.4s) + short hold (0.6s) + FADE_OUT (0.5s).
const SHOW_FOR = 7500; // ms, total time before the next page appears
const FADE_OUT = 500; // ms, the fade starts at SHOW_FOR - FADE_OUT
const DOTS = [0, 1, 2, 3, 4];

function Splash({ onFinish }) {
  const [leaving, setLeaving] = useState(false);
  const onFinishRef = useRef(onFinish);

  // Always call the latest onFinish without restarting the timers
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    const startLeaving = setTimeout(() => setLeaving(true), SHOW_FOR - FADE_OUT);
    const done = setTimeout(() => onFinishRef.current?.(), SHOW_FOR);

    return () => {
      clearTimeout(startLeaving);
      clearTimeout(done);
    };
  }, []);

  return (
    <div
      className={`splash ${leaving ? "splash--leaving" : ""}`}
      style={{ "--fade-out": `${FADE_OUT}ms` }}
    >
      <div className="splash__content">
        <div className="splash__lockup">
          <img className="splash__logo" src={logo} alt="Workhouse logo" />
          <span className="splash__wordmark">
            <span className="splash__name">WORKHOUSE</span>
          </span>
        </div>

        <p className="splash__tagline">Enterprise Management Portal</p>

        <div className="splash__loader" role="status" aria-live="polite">
          <div className="splash__track">
            <div className="splash__fill" />
          </div>
          <p className="splash__status">
            Establishing Secure Session
            <span className="splash__dots" aria-hidden="true">
              {DOTS.map((i) => (
                <span key={i} style={{ animationDelay: `${i * 0.12}s` }}>
                  .
                </span>
              ))}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Splash;