import { useEffect, useState } from "react";
import logo from "../assets/Logo.png"; // change this path to wherever Logo.png lives
import "../Styles/splash.css";

// Total time the splash stays on screen before it hands over to the next page
const SHOW_FOR = 5200; // ms
const FADE_OUT = 500; // ms, must match .splash--leaving in splash.css

function Splash({ onFinish }) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const startLeaving = setTimeout(() => setLeaving(true), SHOW_FOR - FADE_OUT);
    const done = setTimeout(() => {
      if (onFinish) onFinish();
    }, SHOW_FOR);

    return () => {
      clearTimeout(startLeaving);
      clearTimeout(done);
    };
  }, [onFinish]);

  return (
    <div className={`splash ${leaving ? "splash--leaving" : ""}`}>
      <div className="splash__content">
        <div className="splash__lockup">
          <img className="splash__logo" src={logo} alt="Workhouse logo" />
          <span className="splash__wordmark">
            <span className="splash__name">WORKHOUSE</span>
          </span>
        </div>

        <p className="splash__tagline">Enterprise Managemen Portal</p>

        <div className="splash__loader" role="status" aria-live="polite">
          <div className="splash__track">
            <div className="splash__fill" />
          </div>
          <p className="splash__status">
            Establishing Secure Session
            <span className="splash__dots" aria-hidden="true">
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Splash;