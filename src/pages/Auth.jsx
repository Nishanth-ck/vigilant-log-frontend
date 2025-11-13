import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Cpu, ArrowRight } from "lucide-react";
import "../styles/auth.css";
import axios from "axios";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    deviceName: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        deviceName: formData.deviceName,
      };

      const response = await axios.post(
        "https://vigilant-log-cyberx.onrender.com/api/auth/register",
        payload
      );

      console.log(response);
      sessionStorage.setItem(
        "deviceName",
        response?.data?.data?.user?.deviceName
      );
      sessionStorage.setItem("token", response?.data?.data?.token);
      sessionStorage.setItem("username", response?.data?.data?.user?.username);
      sessionStorage.setItem("id", response?.data?.data?.user?.id);
      sessionStorage.setItem("email", response?.data?.data?.user?.email);
      navigate("/landing");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        {/* Toggle between Login/Register */}
        <div className="auth-toggle">
          <button
            className={"toggle-btn " + (isLogin ? "active" : "")}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={
              "toggle-btn hide-on-mobile " + (!isLogin ? "active" : "")
            }
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <div className="auth-header">
          <h2>{isLogin ? "Welcome Back" : "Join VigilantLog"}</h2>
          <p className="muted">
            {isLogin
              ? "Sign in to monitor & secure your system"
              : "Create your VigilantLog account"}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Full Name (Register only) */}
          {!isLogin && (
            <label className="field">
              <span className="label">Full Name</span>
              <div className="input-wrap">
                <User className="icon" />
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  required
                />
              </div>
            </label>
          )}

          {/* Email */}
          <label className="field">
            <span className="label">Email</span>
            <div className="input-wrap">
              <Mail className="icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@company.com"
                required
              />
            </div>
          </label>

          {/* Password */}
          <label className="field">
            <span className="label">Password</span>
            <div className="input-wrap">
              <Lock className="icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>

          {/* Confirm Password (Register only) */}
          {!isLogin && (
            <label className="field">
              <span className="label">Confirm Password</span>
              <div className="input-wrap">
                <Lock className="icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </label>
          )}

          {/* Device Name (Shown for both Login & Register) */}
          <label className="field">
            <span className="label">Device Name</span>
            <div className="input-wrap">
              <Cpu className="icon" />
              <input
                name="deviceName"
                value={formData.deviceName}
                onChange={handleInputChange}
                placeholder="Enter your exact device name"
                required
              />
            </div>
          </label>

          <p className="device-tip">
            💡 To find your Device Name: Go to <b>Settings → System → About</b>{" "}
            → see your <b>Device Name</b>. It’s case-sensitive.
          </p>

          {/* Terms of Service (Register only) */}
          {!isLogin ? (
            <label className="terms">
              <input type="checkbox" required />
              <span>
                I agree to the <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
              </span>
            </label>
          ) : null}

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            <span>{isLogin ? "Sign In" : "Create Account"}</span>
            <ArrowRight className="arrow" />
          </button>
        </form>

        {/* Footer links */}
        <div className="auth-footer">
          {isLogin ? (
            <span>
              Don’t have an account?{" "}
              <button
                className="link-btn hide-on-mobile"
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button className="link-btn" onClick={() => setIsLogin(true)}>
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
