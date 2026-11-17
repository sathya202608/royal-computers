import React, { useState } from 'react';
import './CreateAccount.css';
import logoImg from './assets/image.png';
import { useShop } from './lib/ShopContext';

const CreateAccount = ({ onSwitchToLogin }) => {
  const { registerOwner } = useShop();
  const [formData, setFormData] = useState({
    fullName: '',
    ownerId: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match!');
      return;
    }
    if (formData.password.length < 4) {
      setErrorMsg('Password must be at least 4 characters');
      return;
    }
    const res = await registerOwner(formData);
    if (!res.success && res.message) {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="account-card">
      {/* Left Branding Panel */}
      <div className="left-section">
        <div className="brand-header">
          <div className="logo-container">
            <img src={logoImg} alt="Royal Computers Logo" className="brand-logo" />
          </div>
          <span className="subtitle">ROYAL COMPUTERS</span>
          <h1 className="title">Xerox Shop</h1>
          <p className="tagline">Complete Shop Management System</p>
          <p className="features-sub">Billing · Stock · Employees · Reports</p>
        </div>

        <div className="services-list">
          <div className="service-item">
            <span className="icon">🖨️</span>
            <span>Digital Printing & Photocopy</span>
          </div>
          <div className="service-item">
            <span className="icon">📑</span>
            <span>Binding & Lamination</span>
          </div>
          <div className="service-item">
            <span className="icon">🎴</span>
            <span>ID Cards & Scanning</span>
          </div>
          <div className="service-item">
            <span className="icon">🖥️</span>
            <span>DTP & Design Services</span>
          </div>
        </div>

        <div className="contact-info">
          <p>📞 75981 88737</p>
          <p>✉️ royalcomputers@gmail.com</p>
        </div>
      </div>

      {/* Right Register Form Panel */}
      <div className="right-section">
        <div className="form-container">
          <button className="back-link" onClick={onSwitchToLogin}>
            ← Back to Login
          </button>

          <h2>Create Account</h2>
          <p className="form-subtitle">Sign up and create your account password</p>

          {errorMsg && (
            <div style={{ color: "#EF4444", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "8px", marginBottom: "15px", fontSize: "14px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="e.g. Ramesh Kumar"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>User ID / Username</label>
              <input
                type="text"
                name="ownerId"
                placeholder="Choose a unique ID (e.g. ramesh123)"
                value={formData.ownerId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-submit">
              Create Account
            </button>
          </form>

          <div className="form-footer">
            <p className="login-prompt">
              Already have an account?{' '}
              <span className="link-text" onClick={onSwitchToLogin}>
                Sign In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;