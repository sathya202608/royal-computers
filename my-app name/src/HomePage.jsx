import React, { useState, useEffect } from "react";
import "./HomePage.css";
import logoImg from "./assets/image.png";
import { useShop } from "./lib/ShopContext";
import {
  Sparkles,
  Share2,
  Scan,
  Circle,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Send,
  RotateCw,
  ShieldCheck,
  Phone,
} from "lucide-react";

export default function HomePage({ onLoginSuccess }) {
  const { authData, login, sendPhoneOtp, verifyPhoneOtp, resetPassword, registerOwner, shopSettings } = useShop();

  // Mode: "login" | "forgot" | "register"
  const [mode, setMode] = useState("login");

  // Show/Hide password toggle states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Login form state
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  // Forgot password form state with SMS Phone OTP (3-step flow)
  const [forgotStep, setForgotStep] = useState(1); // 1 = Mobile, 2 = Enter OTP, 3 = New Password
  const [forgotPhone, setForgotPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResettingPwd, setIsResettingPwd] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Register / Sign up form state
  const [regName, setRegName] = useState("");
  const [regUserId, setRegUserId] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  // Feedback notifications
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Sync default phone from authData when available
  useEffect(() => {
    if (authData?.phone) {
      setForgotPhone(authData.phone.replace(/\D/g, "").slice(-10));
    }
  }, [authData?.phone]);

  // Resend OTP countdown timer (30 seconds)
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Auto-dismiss feedback alert messages after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handle Login - only authenticates with created credentials
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!loginId.trim()) {
      setErrorMessage("Please enter your User ID or Username.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    const res = await login(loginId.trim(), password);
    if (res.success) {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } else {
      setErrorMessage(res.message || "Invalid credentials.");
    }
  };

  // Open Forgot Password screen cleanly
  const handleOpenForgot = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setMode("forgot");
    setForgotStep(1);
    setOtpCode("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    if (authData?.phone) {
      setForgotPhone(authData.phone.replace(/\D/g, "").slice(-10));
    }
  };

  // Step 1: Send OTP to registered mobile number via SMS
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanDigits = (forgotPhone || "").replace(/\D/g, "").slice(-10);
    if (cleanDigits.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit registered mobile number.");
      return;
    }

    setIsSendingOtp(true);
    const res = await sendPhoneOtp(cleanDigits);
    setIsSendingOtp(false);

    if (res && res.success) {
      setForgotStep(2);
      setResendCooldown(30);
      setSuccessMessage(res.message || "OTP sent to your registered mobile number.");
    } else {
      setErrorMessage(res?.message || "Failed to send SMS OTP. Please check your mobile number.");
    }
  };

  // Resend OTP handler with 30-second countdown
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isSendingOtp) return;
    setErrorMessage("");
    setSuccessMessage("");

    const cleanDigits = (forgotPhone || "").replace(/\D/g, "").slice(-10);
    if (cleanDigits.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit registered mobile number.");
      return;
    }

    setIsSendingOtp(true);
    const res = await sendPhoneOtp(cleanDigits);
    setIsSendingOtp(false);

    if (res && res.success) {
      setResendCooldown(30);
      setSuccessMessage(res.message || "A new 6-digit OTP has been sent to your registered mobile number.");
    } else {
      setErrorMessage(res?.message || "Failed to resend OTP code.");
    }
  };

  // Step 2: Verify 6-digit OTP received via SMS
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const cleanOtp = (otpCode || "").trim();
    if (!cleanOtp) {
      setErrorMessage("Please enter the 6-digit OTP received on your mobile.");
      return;
    }

    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      setErrorMessage("OTP must be exactly 6 digits.");
      return;
    }

    setIsVerifyingOtp(true);
    const res = await verifyPhoneOtp(forgotPhone, cleanOtp);
    setIsVerifyingOtp(false);

    if (res && res.success) {
      setResetToken(res.resetToken || "");
      setForgotStep(3);
      setSuccessMessage(res.message || "OTP verified successfully! Now create your new password.");
    } else {
      setErrorMessage(res?.message || "Invalid OTP! Please check the code received on your phone.");
    }
  };

  // Step 3: Set New Password & Confirm New Password
  const handleResetPasswordSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword.length < 4) {
      setErrorMessage("New password must be at least 4 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match!");
      return;
    }

    setIsResettingPwd(true);
    const res = await resetPassword({
      phone: forgotPhone,
      newPassword,
      resetToken,
    });
    setIsResettingPwd(false);

    if (res && res.success) {
      setSuccessMessage("Password Changed Successfully!");
      setPassword(newPassword);
      setTimeout(() => {
        setMode("login");
        setForgotStep(1);
        setOtpCode("");
        setResetToken("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1500);
    } else {
      setErrorMessage(res?.message || "Failed to reset password. Please try again.");
    }
  };

  // Handle Register - signs up with the created password
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!regUserId.trim()) {
      setErrorMessage("Please enter a User ID / Username.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    if (regPassword.length < 4) {
      setErrorMessage("Password must be at least 4 characters long.");
      return;
    }

    const res = await registerOwner({
      fullName: regName.trim(),
      ownerId: regUserId.trim(),
      phone: regPhone.trim(),
      password: regPassword,
    });

    if (res.success) {
      setSuccessMessage("Account created successfully with your password!");
      setLoginId(regUserId.trim());
      setPassword(regPassword);
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }, 800);
    } else {
      setErrorMessage(res.message || "Registration failed.");
    }
  };

  return (
    <div className="login-page-wrapper">
      {/* Top Application Header Bar matching User Screenshot */}
      <header className="top-system-bar">
        <div className="top-bar-left">
          <div className="top-bar-brand-badge" title="Royal Computers Xerox Shop">
            <img src={logoImg} alt="Royal Computers" className="top-bar-brand-img" />
            <span className="top-bar-brand-title">ROYAL COMPUTERS</span>
          </div>
          <button className="ai-pill-btn" title="Royal Computers AI Assistant">
            <Sparkles className="w-3.5 h-3.5 text-[#cca248]" />
            <span>AI</span>
          </button>
        </div>

        <div className="top-bar-center">
          <div className="system-dropdown-title">
            <span>Xerox Shop Management System</span>
            <span className="dropdown-arrow">▼</span>
          </div>
        </div>

        <div className="top-bar-right">
          <button className="top-icon-btn" title="System Status">
            <Circle className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          </button>
          <button className="top-icon-btn" title="Scan Terminal Mode">
            <Scan className="w-4 h-4" />
          </button>
          <button
            className="share-action-btn"
            onClick={() => alert("Royal Computers Shop Management Terminal: Online & Secure")}
            title="Share Terminal Link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* Main Split Section: Left Royal Branding, Right Auth & Recovery Form */}
      <main className="login-main-container">
        {/* Left Branding Side */}
        <section className="login-branding-panel">
          <div className="brand-wrapper">
            <div className="lion-logo-container">
              <img
                src={logoImg}
                alt="Royal Computers Crest"
                className="royal-lion-img"
              />
            </div>

            <span className="brand-royal-sub">ROYAL COMPUTERS</span>
            <h1 className="brand-xerox-title">Xerox Shop</h1>
            <p className="brand-tagline-text">{shopSettings.tagline}</p>
            <p className="brand-features-chips">{shopSettings.subTagline}</p>

            <div className="shop-services-bullets">
              {shopSettings.services.map((srv) => (
                <div key={srv.id} className="service-bullet-item">
                  <span className="service-icon-glyph">{srv.icon}</span>
                  <span>{srv.name}</span>
                </div>
              ))}
            </div>

            <div className="brand-contact-footer">
              <div className="contact-row">
                <span>📞</span>
                <span className="font-semibold text-[#c4c8db]">{shopSettings.phone}</span>
              </div>
              <div className="contact-row">
                <span>✉️</span>
                <span>{shopSettings.email}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Section: Interactive Forms */}
        <section className="login-interactive-panel">
          <div className="auth-card-inner">
            {/* Feedback Alerts */}
            {errorMessage && (
              <div className="auth-alert-box auth-alert-error">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="auth-alert-box auth-alert-success">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* MODE 1: NORMAL SIGN IN / LOGIN */}
            {mode === "login" && (
              <div>
                <h2 className="auth-header-title">Sign In</h2>
                <p className="auth-header-sub">Enter your credentials to access shop management</p>

                <form onSubmit={handleLoginSubmit}>
                  <div className="auth-field-group">
                    <label className="auth-field-label">User ID / Username</label>
                    <input
                      type="text"
                      className="auth-text-input"
                      placeholder="Enter your User ID or Username"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-field-group">
                    <label className="auth-field-label">Password</label>
                    <div className="password-input-wrapper">
                      <Lock className="password-field-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        className="auth-text-input auth-password-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Hide password" : "Show password"}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="auth-primary-btn">
                    Sign In
                  </button>
                </form>

                <div className="auth-footer-links">
                  <button
                    type="button"
                    className="forgot-pwd-trigger"
                    onClick={handleOpenForgot}
                  >
                    Forgot Password?
                  </button>

                  <div className="register-prompt-line">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="register-highlight-link"
                      onClick={() => {
                        setErrorMessage("");
                        setSuccessMessage("");
                        setMode("register");
                      }}
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MODE 2: FORGOT PASSWORD WITH PHONE SMS OTP */}
            {mode === "forgot" && (
              <div>
                <button
                  type="button"
                  className="back-to-login-btn"
                  onClick={() => {
                    setErrorMessage("");
                    setSuccessMessage("");
                    setMode("login");
                    setForgotStep(1);
                  }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>

                <div className="mb-4">
                  <h2 className="auth-header-title flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#cca248]" />
                    <span>Forgot Password</span>
                  </h2>
                  <p className="auth-header-sub">
                    {forgotStep === 1 && "Enter your registered mobile number to receive a 6-digit SMS OTP"}
                    {forgotStep === 2 && "Enter the 6-digit OTP sent to your registered mobile number"}
                    {forgotStep === 3 && "Create and confirm your new password"}
                  </p>
                </div>

                {/* 3-Step OTP Indicator */}
                <div className="otp-step-indicator">
                  <div className={`otp-step-pill ${forgotStep === 1 ? "active" : "completed"}`}>
                    <span className="step-num">1</span>
                    <span>Mobile</span>
                  </div>
                  <div className="otp-step-divider"></div>
                  <div className={`otp-step-pill ${forgotStep === 2 ? "active" : forgotStep > 2 ? "completed" : ""}`}>
                    <span className="step-num">2</span>
                    <span>Verify OTP</span>
                  </div>
                  <div className="otp-step-divider"></div>
                  <div className={`otp-step-pill ${forgotStep === 3 ? "active" : ""}`}>
                    <span className="step-num">3</span>
                    <span>New Password</span>
                  </div>
                </div>

                {/* STEP 1: Enter Registered Mobile Number & Send OTP */}
                {forgotStep === 1 && (
                  <form onSubmit={handleSendOtp}>
                    <div className="auth-field-group">
                      <label className="auth-field-label">Registered Mobile Number</label>
                      <div className="password-input-wrapper">
                        <Phone className="password-field-icon text-[#cca248]" />
                        <input
                          type="tel"
                          maxLength={10}
                          className="auth-text-input auth-password-input"
                          placeholder="10-digit registered mobile number"
                          value={forgotPhone}
                          onChange={(e) => setForgotPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          required
                          autoFocus
                        />
                      </div>
                      <span className="auth-field-helper">
                        A secure 6-digit OTP will be sent to your mobile phone via SMS.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="auth-primary-btn flex items-center justify-center gap-2"
                      disabled={isSendingOtp}
                    >
                      {isSendingOtp ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send OTP</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* STEP 2: Verify 6-Digit OTP */}
                {forgotStep === 2 && (
                  <form onSubmit={handleVerifyOtp}>
                    <div className="otp-target-email-badge">
                      <div className="email-badge-info">
                        <Phone className="w-4 h-4 text-[#cca248]" />
                        <div>
                          <div style={{ fontSize: "11px", color: "#9ca3af" }}>OTP sent via SMS to:</div>
                          <strong style={{ fontSize: "13px", color: "#f3f4f6" }}>
                            {forgotPhone.length === 10 ? `+91 ${forgotPhone}` : forgotPhone}
                          </strong>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="email-change-btn"
                        onClick={() => {
                          setErrorMessage("");
                          setSuccessMessage("");
                          setForgotStep(1);
                        }}
                      >
                        Change
                      </button>
                    </div>

                    <div className="auth-field-group">
                      <div className="flex items-center justify-between mb-1">
                        <label className="auth-field-label">Enter 6-Digit OTP</label>
                        <button
                          type="button"
                          className="resend-otp-btn"
                          disabled={resendCooldown > 0 || isSendingOtp}
                          onClick={handleResendOtp}
                        >
                          {isSendingOtp ? (
                            "Sending..."
                          ) : resendCooldown > 0 ? (
                            `Resend in ${resendCooldown}s`
                          ) : (
                            "Resend OTP"
                          )}
                        </button>
                      </div>

                      <div className="password-input-wrapper">
                        <ShieldCheck className="password-field-icon text-[#cca248]" />
                        <input
                          type="text"
                          maxLength={6}
                          className="auth-text-input auth-password-input otp-code-input"
                          placeholder="• • • • • •"
                          value={otpCode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                            setOtpCode(val);
                          }}
                          required
                          autoFocus
                        />
                      </div>
                      <span className="auth-field-helper">
                        OTP expires in 5 minutes.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="auth-primary-btn flex items-center justify-center gap-2"
                      disabled={isVerifyingOtp}
                    >
                      {isVerifyingOtp ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          <span>Verifying OTP...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify OTP</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* STEP 3: Set New Password & Confirm New Password */}
                {forgotStep === 3 && (
                  <form onSubmit={handleResetPasswordSubmit}>
                    <div className="auth-field-group">
                      <label className="auth-field-label">New Password</label>
                      <div className="password-input-wrapper">
                        <Lock className="password-field-icon" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          className="auth-text-input auth-password-input"
                          placeholder="Min. 4 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          autoFocus
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          title={showNewPassword ? "Hide password" : "Show password"}
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="auth-field-group">
                      <label className="auth-field-label">Confirm New Password</label>
                      <div className="password-input-wrapper">
                        <Lock className="password-field-icon" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="auth-text-input auth-password-input"
                          placeholder="Re-enter new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          title={showConfirmPassword ? "Hide password" : "Show password"}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="auth-primary-btn flex items-center justify-center gap-2"
                      disabled={isResettingPwd}
                    >
                      {isResettingPwd ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          <span>Resetting Password...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Reset Password</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* MODE 3: CREATE ACCOUNT (WITH USER CREATED PASSWORD) */}
            {mode === "register" && (
              <div>
                <button
                  type="button"
                  className="back-to-login-btn"
                  onClick={() => {
                    setErrorMessage("");
                    setSuccessMessage("");
                    setMode("login");
                  }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </button>

                <h2 className="auth-header-title">Create Account</h2>
                <p className="auth-header-sub">Sign up and set your password to access the system</p>

                <form onSubmit={handleRegisterSubmit}>
                  <div className="auth-field-group">
                    <label className="auth-field-label">Full Name</label>
                    <input
                      type="text"
                      className="auth-text-input"
                      placeholder="e.g. Ramesh Kumar"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-field-group">
                    <label className="auth-field-label">User ID / Username</label>
                    <input
                      type="text"
                      className="auth-text-input"
                      placeholder="Choose User ID (e.g. ramesh123)"
                      value={regUserId}
                      onChange={(e) => setRegUserId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-field-group">
                    <label className="auth-field-label">Phone Number</label>
                    <input
                      type="tel"
                      className="auth-text-input"
                      placeholder="10-digit mobile number"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="auth-field-group">
                    <label className="auth-field-label">Password</label>
                    <div className="password-input-wrapper">
                      <Lock className="password-field-icon" />
                      <input
                        type={showRegPassword ? "text" : "password"}
                        className="auth-text-input auth-password-input"
                        placeholder="Create your password (min. 4 characters)"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        title={showRegPassword ? "Hide password" : "Show password"}
                        aria-label={showRegPassword ? "Hide password" : "Show password"}
                      >
                        {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="auth-field-group">
                    <label className="auth-field-label">Confirm Password</label>
                    <div className="password-input-wrapper">
                      <Lock className="password-field-icon" />
                      <input
                        type={showRegConfirmPassword ? "text" : "password"}
                        className="auth-text-input auth-password-input"
                        placeholder="Confirm your password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        title={showRegConfirmPassword ? "Hide password" : "Show password"}
                        aria-label={showRegConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="auth-primary-btn">
                    Create Account & Sign In
                  </button>
                </form>

                <div className="auth-footer-links">
                  <div className="register-prompt-line">
                    Already registered?{" "}
                    <button
                      type="button"
                      className="register-highlight-link"
                      onClick={() => {
                        setErrorMessage("");
                        setSuccessMessage("");
                        setMode("login");
                      }}
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}