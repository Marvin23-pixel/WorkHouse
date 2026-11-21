import { useEffect } from "react";
import logo from "../assets/white-logo.png";
import "../Styles/splash2.css";

export default function Splash2({ onFinish, duration = 3000 }) {
  useEffect(() => {
    if (!onFinish) return;
    const timer = setTimeout(onFinish, duration);
    return () => clearTimeout(timer);
  }, [onFinish, duration]);

  return (
    <div className="splash2">
      <div className="splash2-content">
        <div className="splash2-glass">
          <img src={logo} alt="Logo" className="splash2-logo" />
        </div>
      </div>
    </div>
  );
}