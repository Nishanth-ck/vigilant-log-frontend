import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import "../styles/auth.css";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    deviceName: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        deviceName: formData.deviceName,
      };

      console.log(payload);

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
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p className="muted">Join VigilantLog today</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <label className="field">
            <span className="label">Full Name</span>
            <div className="input-wrap">
              <User className="icon" />
              <input
                name="username"
                placeholder="John Doe"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </label>

          {/* Email */}
          <label className="field">
            <span className="label">Email</span>
            <div className="input-wrap">
              <Mail className="icon" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
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
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPass((s) => !s)}
              >
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>

          {/* Confirm Password */}
          <label className="field">
            <span className="label">Confirm Password</span>
            <div className="input-wrap">
              <Lock className="icon" />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirm((s) => !s)}
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>

          {/* Device Name */}
          <label className="field">
            <span className="label">Device Name</span>
            <div className="input-wrap">
              <input
                name="deviceName"
                placeholder="Exact Windows device name"
                value={formData.deviceName}
                onChange={handleChange}
                required
              />
            </div>
          </label>

          {/* Terms */}
          <label className="terms">
            <input type="checkbox" required />
            <span>
              I agree to the <a href="#">Terms</a> and{" "}
              <a href="#">Privacy Policy</a>
            </span>
          </label>

          <button className="submit-btn" type="submit">
            <span>Create Account</span>
            <ArrowRight className="arrow" />
          </button>
        </form>

        <div className="auth-footer">
          <span>
            Already have an account?{" "}
            <button className="link-btn" onClick={() => navigate("/login")}>
              Sign in
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

