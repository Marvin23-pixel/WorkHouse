import React, { useState } from "react";
import Login from "./Pages/Login";
import InputEmail from "./PasswordReset/InputEmail";
import OtpCode from "./PasswordReset/OtpCode";
import Reset from "./PasswordReset/Reset";
import Home from "./Pages/Home";
import Sales from "./Pages/Sales";
import Records from "./Pages/Records";
import Profile from "./Pages/Profile";
import AdminDashboard from "./Adminfunctions/AdminDashboard";
import StoreInventory, { INITIAL_PRODUCTS } from "./Adminfunctions/StoreInventory";
import Permissions from "./Adminfunctions/Permissions";
import StaffAccounts from "./Adminfunctions/StaffAccounts";
import Notifications from "./Adminfunctions/Notifications";
import Settings from "./Adminfunctions/Settings";
import { logStaffOut } from "./utils/staffStore.js";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Which screen to show before the user is signed in:
  // "login" | "forgot" (enter email) | "verify" (enter 4-digit code) | "reset" (new password)
  const [authScreen, setAuthScreen] = useState("login");

  // Email entered on the forgot-password screen, reused by the code screen
  const [recoveryEmail, setRecoveryEmail] = useState("");

  // Lives here (not inside StoreInventory) so it survives navigating
  // away to other cards — it only resets on an actual page refresh.
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Login passes { staff, rememberTerminal, isSupervisor } to onLogin
  const handleLogin = (loginData) => {
    setCurrentStaff(loginData.staff);
    setIsAuthenticated(true);
    setCurrentPage("home");
    setAuthScreen("login");
  };

  // The "Logging out..." state is now shown inside the Profile popup,
  // so by the time this runs we can go straight back to Login.
  const handleLogout = () => {
    // Mark the staff member offline in the shared directory
    if (currentStaff?.id) {
      logStaffOut(currentStaff.id);
    }

    setIsAuthenticated(false);
    setCurrentStaff(null);
    setCurrentPage("home");
    setAuthScreen("login");
  };

  // Before sign-in: Login, or the Forgot Password email screen.
  if (!isAuthenticated) {
    if (authScreen === "forgot") {
      return (
        <InputEmail
          initialEmail={recoveryEmail}
          onBack={() => setAuthScreen("login")}
          onSubmit={async (email) => {
            // TODO: call your API to send the 4-digit code to `email`.
            // Throwing an error here shows it under the email field.
            setRecoveryEmail(email);
            setAuthScreen("verify");
          }}
        />
      );
    }

    if (authScreen === "verify") {
      return (
        <OtpCode
          email={recoveryEmail}
          onBack={() => setAuthScreen("forgot")}
          onEditEmail={() => setAuthScreen("forgot")}
          onVerify={async (code) => {
            // TODO: check `code` with your API. Throwing an error here shows
            // it on the code screen; otherwise we continue to step 3.
            console.log("Verify code:", code, "for", recoveryEmail);
            setAuthScreen("reset");
          }}
          onResend={async () => {
            // TODO: request a new code for `recoveryEmail`.
          }}
          onSendSms={async () => {
            // TODO: send the code by SMS instead.
          }}
        />
      );
    }

    if (authScreen === "reset") {
      return (
        <Reset
          onBack={() => setAuthScreen("verify")}
          onCancel={() => {
            setRecoveryEmail("");
            setAuthScreen("login");
          }}
          onSubmit={async (newPassword) => {
            // TODO: save `newPassword` for `recoveryEmail` with your API / staffStore.
            // Throwing an error here shows it on the reset screen.
            console.log("Set new password for:", recoveryEmail);
          }}
          onDone={() => {
            // Password saved: return to Login so the user can sign in.
            setRecoveryEmail("");
            setAuthScreen("login");
          }}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onForgotPassword={() => setAuthScreen("forgot")}
      />
    );
  }

  if (currentPage === "sales") {
    return <Sales onNavigate={setCurrentPage} />;
  }

  if (currentPage === "records") {
    return <Records onNavigate={setCurrentPage} />;
  }

  if (currentPage === "profile") {
    return (
      <Profile
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        currentStaff={currentStaff}
      />
    );
  }

  if (currentPage === "admin") {
    return (
      <AdminDashboard
        onNavigate={setCurrentPage}
        onBack={() => setCurrentPage("home")}
        products={products}
      />
    );
  }

  if (currentPage === "inventory") {
    return (
      <StoreInventory
        onBack={() => setCurrentPage("admin")}
        products={products}
        setProducts={setProducts}
      />
    );
  }

  if (currentPage === "permissions") {
    return <Permissions onBack={() => setCurrentPage("admin")} />;
  }

  if (currentPage === "staff") {
    return <StaffAccounts onBack={() => setCurrentPage("admin")} />;
  }

  if (currentPage === "notifications") {
    return <Notifications onBack={() => setCurrentPage("admin")} />;
  }

  if (currentPage === "settings") {
    return <Settings onBack={() => setCurrentPage("admin")} />;
  }

  return (
    <Home
      onNavigate={setCurrentPage}
      isChatbotOpen={isChatbotOpen}
      onOpenChatbot={() => setIsChatbotOpen(true)}
      onCloseChatbot={() => setIsChatbotOpen(false)}
    />
  );
}

export default App;