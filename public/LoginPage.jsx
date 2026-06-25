import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call - Replace with actual backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Demo credentials check
      if (email === "demo@example.com" && password === "password123") {
        // Store user data
        localStorage.setItem("user", JSON.stringify({ email, name: "Demo User" }));
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        navigate("/dashboard");
      } else {
        setError("Invalid email or password. Try demo@example.com / password123");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      {/* Animated glows with parallax */}
      <div 
        style={{
          ...styles.glow1,
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      />
      <div 
        style={{
          ...styles.glow2,
          transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
        }}
      />
      <div 
        style={{
          ...styles.glow3,
          transform: `translate(${mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px)`,
        }}
      />

      {/* Floating particles */}
      <div style={styles.particles}>
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.particle,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: `rgba(${99 + Math.random() * 100}, ${102 + Math.random() * 100}, ${241 + Math.random() * 100}, ${0.2 + Math.random() * 0.3})`,
            }}
          />
        ))}
      </div>

      <div style={styles.card}>
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          style={styles.backButton}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
          }}
        >
          ← Back
        </button>

        {/* Logo */}
        <div style={styles.logoContainer}>
          <span style={styles.logoIcon}>📚</span>
          <h2 style={styles.logoText}>Flash AI</h2>
          <span style={styles.logoBadge}>Login</span>
        </div>

        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Sign in to continue learning with AI-powered flashcards</p>

        <form onSubmit={handleLogin} style={styles.form}>
          {/* Email Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>📧</span>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={styles.input}
            />
          </div>

          {/* Password Input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🔒</span>
              Password
            </label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={styles.optionsRow}>
            <label style={styles.rememberMe}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              Remember me
            </label>
            <button type="button" style={styles.forgotPassword}>
              Forgot password?
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={styles.errorMessage}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <><span style={styles.spinner}></span> Signing in...</>
            ) : (
              <><span style={styles.buttonIcon}>🚀</span> Sign In</>
            )}
          </button>

          {/* Demo Credentials */}
          <div style={styles.demoBox}>
            <p style={styles.demoText}>Demo Credentials:</p>
            <div style={styles.demoCredentials}>
              <span>📧 demo@example.com</span>
              <span>🔑 password123</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div style={styles.signupRow}>
            <span>Don't have an account?</span>
            <button 
              type="button"
              onClick={() => navigate("/signup")}
              style={styles.signupLink}
            >
              Sign up now
            </button>
          </div>
        </form>

        <div style={styles.footer}>
          <span>🔒 Secure Login</span>
          <span style={styles.footerDot}>•</span>
          <span>⚡ AI-Powered</span>
          <span style={styles.footerDot}>•</span>
          <span>🌟 Free Forever</span>
        </div>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    fontFamily: "'Inter', -apple-system, sans-serif",
    overflow: "hidden",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(10,15,25,0.75)",
    backdropFilter: "blur(4px)",
  },

  particles: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    overflow: "hidden",
  },

  particle: {
    position: "absolute",
    borderRadius: "50%",
    animation: "float 10s infinite ease-in-out",
    opacity: 0.3,
  },

  glow1: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "radial-gradient(circle, #6366f1, transparent 70%)",
    filter: "blur(150px)",
    top: "5%",
    right: "10%",
    opacity: 0.3,
    transition: "transform 0.1s ease-out",
  },

  glow2: {
    position: "absolute",
    width: "350px",
    height: "350px",
    background: "radial-gradient(circle, #3b82f6, transparent 70%)",
    filter: "blur(150px)",
    bottom: "5%",
    left: "10%",
    opacity: 0.3,
    transition: "transform 0.1s ease-out",
  },

  glow3: {
    position: "absolute",
    width: "250px",
    height: "250px",
    background: "radial-gradient(circle, #8b5cf6, transparent 70%)",
    filter: "blur(120px)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 0.15,
    transition: "transform 0.1s ease-out",
  },

  card: {
    position: "relative",
    zIndex: 2,
    maxWidth: "420px",
    width: "100%",
    padding: "40px 35px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(24px)",
    color: "#fff",
    boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
    animation: "fadeInUp 0.6s ease-out",
  },

  backButton: {
    position: "absolute",
    top: "16px",
    left: "20px",
    padding: "6px 14px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "24px",
  },

  logoIcon: {
    fontSize: "28px",
  },

  logoText: {
    fontSize: "24px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #6366f1, #3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  logoBadge: {
    fontSize: "10px",
    fontWeight: "600",
    padding: "2px 12px",
    borderRadius: "20px",
    background: "rgba(99, 102, 241, 0.3)",
    color: "#a5b4fc",
    marginLeft: "4px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    fontSize: "14px",
    textAlign: "center",
    opacity: 0.7,
    marginBottom: "28px",
    lineHeight: "1.5",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "500",
    opacity: 0.8,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  labelIcon: {
    fontSize: "16px",
  },

  input: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
  },

  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  passwordInput: {
    width: "100%",
    padding: "12px 16px",
    paddingRight: "48px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
  },

  passwordToggle: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    padding: "4px",
    opacity: 0.6,
    transition: "opacity 0.2s",
  },

  optionsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
  },

  rememberMe: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    opacity: 0.8,
  },

  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
    accentColor: "#6366f1",
  },

  forgotPassword: {
    background: "none",
    border: "none",
    color: "#6366f1",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "color 0.2s",
  },

  errorMessage: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "10px",
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "#fca5a5",
    fontSize: "13px",
  },

  button: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    color: "#fff",
    background: "linear-gradient(135deg, #6366f1, #3b82f6)",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginTop: "4px",
  },

  buttonIcon: {
    fontSize: "18px",
  },

  spinner: {
    display: "inline-block",
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  demoBox: {
    padding: "12px",
    borderRadius: "10px",
    background: "rgba(99, 102, 241, 0.08)",
    border: "1px solid rgba(99, 102, 241, 0.15)",
    textAlign: "center",
  },

  demoText: {
    fontSize: "12px",
    opacity: 0.6,
    marginBottom: "4px",
  },

  demoCredentials: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    fontSize: "12px",
    fontWeight: "500",
    color: "#a5b4fc",
  },

  signupRow: {
    textAlign: "center",
    fontSize: "14px",
    opacity: 0.7,
    display: "flex",
    justifyContent: "center",
    gap: "6px",
  },

  signupLink: {
    background: "none",
    border: "none",
    color: "#6366f1",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "color 0.2s",
  },

  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    fontSize: "11px",
    opacity: 0.4,
    color: "rgba(255,255,255,0.6)",
  },

  footerDot: {
    opacity: 0.3,
  },
};

// Add keyframe animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
    25% { transform: translateY(-20px) translateX(10px) scale(1.1); }
    50% { transform: translateY(0px) translateX(-15px) scale(0.9); }
    75% { transform: translateY(20px) translateX(10px) scale(1.05); }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  input:focus {
    border-color: #6366f1 !important;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  button:hover {
    transform: translateY(-2px);
  }

  .forgot-password:hover {
    color: #8b5cf6 !important;
  }

  .signup-link:hover {
    color: #8b5cf6 !important;
  }

  .password-toggle:hover {
    opacity: 1 !important;
  }

  .demo-credentials span {
    padding: 2px 8px;
    border-radius: 4px;
    background: rgba(99, 102, 241, 0.1);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  .back-button:hover {
    background: rgba(99, 102, 241, 0.2) !important;
    border-color: #6366f1 !important;
  }
`;
document.head.appendChild(styleSheet);