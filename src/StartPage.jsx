import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentSubject, setCurrentSubject] = useState(0);
  const [currentGrade, setCurrentGrade] = useState("All Grades");
  const [hoveredSubject, setHoveredSubject] = useState(null);
  const [darkMode] = useState(true);
  
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Subjects data with images/emojis as icons
  const subjects = [
    {
      name: "Mathematics",
      icon: "📐",
      emoji: "📊",
      description: "Algebra, Calculus, Geometry & Statistics",
      color: "#8b5cf6",
      bgGradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
      grades: "All Grades",
    },
    {
      name: "Science",
      icon: "🔬",
      emoji: "🧪",
      description: "Physics, Chemistry, Biology & Environmental Science",
      color: "#22c55e",
      bgGradient: "linear-gradient(135deg, #22c55e, #16a34a)",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
      grades: "All Grades",
    },
    {
      name: "Languages",
      icon: "📖",
      emoji: "🌍",
      description: "English, Literature, Grammar & Composition",
      color: "#3b82f6",
      bgGradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop",
      grades: "All Grades",
    },
    {
      name: "History",
      icon: "🏛️",
      emoji: "📜",
      description: "World History, Civilizations & Modern Events",
      color: "#f59e0b",
      bgGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=300&fit=crop",
      grades: "All Grades",
    },
    {
      name: "Computer Science",
      icon: "💻",
      emoji: "🖥️",
      description: "Programming, Algorithms & Web Development",
      color: "#06b6d4",
      bgGradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
      grades: "All Grades",
    },
    {
      name: "Economics",
      icon: "📊",
      emoji: "💰",
      description: "Microeconomics, Macroeconomics & Finance",
      color: "#ec4899",
      bgGradient: "linear-gradient(135deg, #ec4899, #db2777)",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
      grades: "All Grades",
    },
    {
      name: "Art & Design",
      icon: "🎨",
      emoji: "🖌️",
      description: "Drawing, Painting, Design & Creativity",
      color: "#f472b6",
      bgGradient: "linear-gradient(135deg, #f472b6, #ec4899)",
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop",
      grades: "All Grades",
    },
    {
      name: "Music",
      icon: "🎵",
      emoji: "🎶",
      description: "Theory, Practice, Composition & Performance",
      color: "#f59e0b",
      bgGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop",
      grades: "All Grades",
    },
  ];

  // Grade levels with emojis
  const grades = [
    { label: "All Grades", emoji: "🌟" },
    { label: "6th Grade", emoji: "📚" },
    { label: "7th Grade", emoji: "📚" },
    { label: "8th Grade", emoji: "📚" },
    { label: "9th Grade", emoji: "📚" },
    { label: "10th Grade", emoji: "📚" },
    { label: "11th Grade", emoji: "📚" },
    { label: "12th Grade", emoji: "🎓" },
    { label: "College", emoji: "🏛️" },
    { label: "University", emoji: "🎓" },
    { label: "Professional", emoji: "💼" },
  ];

  // Rotate subjects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubject((prev) => (prev + 1) % subjects.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [subjects.length]);

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

  // Handle Login
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (email === "demo@example.com" && password === "password123") {
        localStorage.setItem("user", JSON.stringify({ email, name: "Demo User" }));
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

  // Theme Configuration (matching Dashboard theme)
  const theme = {
    bg: darkMode ? "#0a0f1e" : "#f0f4ff",
    card: darkMode ? "#141d2b" : "#ffffff",
    cardHover: darkMode ? "#1e2a3a" : "#f8fafc",
    text: darkMode ? "#e8edf5" : "#0f172a",
    border: darkMode ? "#253141" : "#e2e8f0",
    subtle: darkMode ? "#8899b4" : "#64748b",
    accent: "#6366f1",
    accentGrad: "linear-gradient(135deg, #6366f1, #3b82f6, #8b5cf6)",
    shadow: darkMode ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.08)",
  };

  const currentSubjectData = subjects[currentSubject];

  return (
    <div style={{ 
      ...styles.container, 
      background: theme.bg,
      backgroundImage: darkMode ? 'none' : `url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80')`,
    }}>
      <div style={{ 
        ...styles.overlay, 
        background: darkMode ? "rgba(10,15,25,0.85)" : "rgba(240,244,255,0.7)",
        backdropFilter: darkMode ? "blur(4px)" : "blur(4px)",
      }} />

      {/* Glow effects */}
      <div 
        style={{
          ...styles.glow1,
          background: darkMode ? "radial-gradient(circle, #6366f1, transparent 70%)" : "radial-gradient(circle, #6366f1, transparent 70%)",
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          opacity: darkMode ? 0.25 : 0.15,
        }}
      />
      <div 
        style={{
          ...styles.glow2,
          background: darkMode ? "radial-gradient(circle, #3b82f6, transparent 70%)" : "radial-gradient(circle, #3b82f6, transparent 70%)",
          transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
          opacity: darkMode ? 0.25 : 0.15,
        }}
      />
      <div 
        style={{
          ...styles.glow3,
          background: darkMode ? "radial-gradient(circle, #8b5cf6, transparent 70%)" : "radial-gradient(circle, #8b5cf6, transparent 70%)",
          transform: `translate(${mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px)`,
          opacity: darkMode ? 0.12 : 0.08,
        }}
      />

      {/* Floating particles */}
      <div style={styles.particles}>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.particle,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              background: darkMode 
                ? `rgba(${99 + Math.random() * 100}, ${102 + Math.random() * 100}, ${241 + Math.random() * 100}, ${0.2 + Math.random() * 0.3})`
                : `rgba(${99 + Math.random() * 100}, ${102 + Math.random() * 100}, ${241 + Math.random() * 100}, ${0.1 + Math.random() * 0.2})`,
            }}
          />
        ))}
      </div>

      <div style={styles.mainContainer}>
        {/* Left Side - Content */}
        <div style={{ 
          ...styles.leftContent, 
          background: theme.card,
          borderColor: theme.border,
          color: theme.text,
        }}>
          {/* Header */}
          <div style={styles.headerSection}>
            <div style={styles.logoContainer}>
              <span style={styles.logoIcon}>📚</span>
              <h1 style={{ 
                ...styles.logoText,
                background: "linear-gradient(135deg, #6366f1, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Flash AI</h1>
              <span style={styles.logoBadge}>Pro</span>
            </div>
          </div>

          {/* Featured Subject Card */}
          <div style={styles.featuredCard}>
            <div style={styles.featuredImageContainer}>
              <img 
                src={currentSubjectData?.image} 
                alt={currentSubjectData?.name}
                style={styles.featuredImage}
              />
              <div style={{ 
                ...styles.featuredOverlay,
                background: `linear-gradient(135deg, ${currentSubjectData?.color}dd, ${currentSubjectData?.color}88)`,
              }}>
                <span style={styles.featuredIcon}>{currentSubjectData?.icon}</span>
                <h2 style={styles.featuredTitle}>{currentSubjectData?.name}</h2>
                <p style={styles.featuredDesc}>{currentSubjectData?.description}</p>
              </div>
            </div>
          </div>

          {/* Subject Grid - Image Cards */}
          <div style={styles.subjectGrid}>
            {subjects.map((sub, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.subjectCard,
                  background: hoveredSubject === idx ? sub.bgGradient : theme.cardHover,
                  transform: hoveredSubject === idx ? "translateY(-8px) scale(1.05)" : "scale(1)",
                  borderColor: hoveredSubject === idx ? sub.color : theme.border,
                  boxShadow: hoveredSubject === idx ? `0 8px 25px ${sub.color}33` : "none",
                }}
                onMouseEnter={() => setHoveredSubject(idx)}
                onMouseLeave={() => setHoveredSubject(null)}
                onClick={() => setCurrentSubject(idx)}
              >
                <div style={styles.subjectCardImage}>
                  <img 
                    src={sub.image} 
                    alt={sub.name}
                    style={styles.subjectCardImg}
                  />
                  <div style={styles.subjectCardOverlay}>
                    <span style={styles.subjectCardIcon}>{sub.icon}</span>
                  </div>
                </div>
                <div style={{ 
                  ...styles.subjectCardContent,
                  background: hoveredSubject === idx ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                }}>
                  <span style={{ 
                    ...styles.subjectCardName,
                    color: hoveredSubject === idx ? "#fff" : theme.text,
                  }}>{sub.name}</span>
                  <span style={styles.subjectCardEmoji}>{sub.emoji}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Grade Selector */}
          <div style={{ 
            ...styles.gradeContainer,
            background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
            borderColor: theme.border,
          }}>
            <div style={styles.gradeHeader}>
              <span style={{ 
                ...styles.gradeLabel,
                color: theme.subtle,
              }}>🎓 Select Your Level</span>
            </div>
            <div style={styles.gradeTags}>
              {grades.map((grade) => (
                <span
                  key={grade.label}
                  style={{
                    ...styles.gradeTag,
                    background: currentGrade === grade.label ? "rgba(99, 102, 241, 0.2)" : "rgba(255,255,255,0.05)",
                    borderColor: currentGrade === grade.label ? "#6366f1" : theme.border,
                    color: currentGrade === grade.label ? "#fff" : theme.subtle,
                    transform: currentGrade === grade.label ? "scale(1.05)" : "scale(1)",
                  }}
                  onClick={() => setCurrentGrade(grade.label)}
                >
                  <span style={styles.gradeEmoji}>{grade.emoji}</span>
                  {grade.label}
                </span>
              ))}
            </div>
          </div>

          {/* Start Learning Button */}
          <button
            onClick={() => navigate("/dashboard")}
            style={styles.startLearningBtn}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px) scale(1.02)";
              e.target.style.boxShadow = "0 18px 40px rgba(99,102,241,0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.boxShadow = "0 10px 25px rgba(99,102,241,0.4)";
            }}
          >
            <span style={styles.startBtnIcon}>🚀</span>
            Start Learning Now
            <span style={styles.startBtnArrow}>→</span>
          </button>

          {/* Features */}
          <div style={styles.features}>
            <div style={{ 
              ...styles.feature,
              background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
              color: theme.subtle,
            }}>
              <span style={styles.featureIcon}>🧠</span>
              <span>AI-Powered</span>
            </div>
            <div style={{ 
              ...styles.feature,
              background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
              color: theme.subtle,
            }}>
              <span style={styles.featureIcon}>⚡</span>
              <span>Smart Flashcards</span>
            </div>
            <div style={{ 
              ...styles.feature,
              background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
              color: theme.subtle,
            }}>
              <span style={styles.featureIcon}>📊</span>
              <span>Track Progress</span>
            </div>
            <div style={{ 
              ...styles.feature,
              background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
              color: theme.subtle,
            }}>
              <span style={styles.featureIcon}>🎯</span>
              <span>All Subjects</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div style={styles.rightContent}>
          <div style={{ 
            ...styles.loginCard,
            background: theme.card,
            borderColor: theme.border,
            color: theme.text,
            boxShadow: theme.shadow,
          }}>
            <div style={styles.loginHeader}>
              <span style={styles.loginIcon}>🔐</span>
              <h2 style={{ 
                ...styles.loginTitle,
                color: theme.text,
              }}>Welcome Back!</h2>
              <p style={{ 
                ...styles.loginSubtitle,
                color: theme.subtle,
              }}>Sign in to continue learning</p>
            </div>

            <form onSubmit={handleLogin} style={styles.loginForm}>
              <div style={styles.inputGroup}>
                <label style={{ 
                  ...styles.label,
                  color: theme.subtle,
                }}>
                  <span style={styles.labelIcon}>📧</span>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{ 
                    ...styles.input,
                    background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                    borderColor: theme.border,
                    color: theme.text,
                  }}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={{ 
                  ...styles.label,
                  color: theme.subtle,
                }}>
                  <span style={styles.labelIcon}>🔒</span>
                  Password
                </label>
                <div style={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{ 
                      ...styles.passwordInput,
                      background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                      borderColor: theme.border,
                      color: theme.text,
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      ...styles.passwordToggle,
                      color: theme.subtle,
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {error && (
                <div style={styles.errorMessage}>
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                style={styles.loginButton}
                disabled={loading}
              >
                {loading ? (
                  <><span style={styles.spinner}></span> Signing in...</>
                ) : (
                  <><span style={styles.buttonIcon}>🚀</span> Sign In</>
                )}
              </button>

              <div style={{ 
                ...styles.demoBox,
                background: darkMode ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)",
                borderColor: darkMode ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
              }}>
                <p style={{ 
                  ...styles.demoText,
                  color: theme.subtle,
                }}>📝 Demo Credentials:</p>
                <div style={styles.demoCredentials}>
                  <span style={{ color: theme.accent }}>demo@example.com</span>
                  <span style={{ 
                    ...styles.demoPass,
                    background: darkMode ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.05)",
                    color: theme.accent,
                  }}>password123</span>
                </div>
              </div>

              <div style={{ 
                ...styles.signupRow,
                color: theme.subtle,
              }}>
                <span>New user?</span>
                <button 
                  type="button"
                  style={styles.signupLink}
                >
                  Create account
                </button>
              </div>
            </form>

            <div style={{ 
              ...styles.loginFooter,
              borderTopColor: theme.border,
              color: theme.subtle,
            }}>
              <span>🔒 Secure Login</span>
              <span>•</span>
              <span>⚡ Free Forever</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        ...styles.footer,
        background: darkMode ? "rgba(10,15,25,0.8)" : "rgba(255,255,255,0.8)",
        borderTopColor: theme.border,
        color: theme.subtle,
      }}>
        <span>📚 All Grades • All Subjects</span>
        <span style={styles.footerDot}>•</span>
        <span>⚡ Powered by AI</span>
        <span style={styles.footerDot}>•</span>
        <span>🌟 Free Forever</span>
        <span style={styles.footerDot}>•</span>
        <span>🎯 1000+ Students</span>
      </div>
    </div>
  );
}

/* 🎨 STYLES - Updated with Start Learning button */
const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    fontFamily: "'Inter', -apple-system, sans-serif",
    overflow: "hidden",
    transition: "background 0.3s ease",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    transition: "background 0.3s ease",
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
    width: "500px",
    height: "500px",
    filter: "blur(150px)",
    top: "5%",
    left: "5%",
    transition: "transform 0.1s ease-out, opacity 0.3s ease",
  },

  glow2: {
    position: "absolute",
    width: "450px",
    height: "450px",
    filter: "blur(150px)",
    bottom: "5%",
    right: "5%",
    transition: "transform 0.1s ease-out, opacity 0.3s ease",
  },

  glow3: {
    position: "absolute",
    width: "350px",
    height: "350px",
    filter: "blur(120px)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    transition: "transform 0.1s ease-out, opacity 0.3s ease",
  },

  mainContainer: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    gap: "30px",
    maxWidth: "1500px",
    width: "95%",
    margin: "20px auto",
    padding: "25px",
    flex: 1,
  },

  leftContent: {
    flex: 1.6,
    padding: "20px",
    borderRadius: "28px",
    border: "1px solid",
    backdropFilter: "blur(10px)",
    maxHeight: "88vh",
    overflowY: "auto",
    overflowX: "hidden",
    transition: "background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
  },

  rightContent: {
    flex: 0.9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logoIcon: {
    fontSize: "28px",
  },

  logoText: {
    fontSize: "24px",
    fontWeight: "700",
  },

  logoBadge: {
    fontSize: "10px",
    fontWeight: "600",
    padding: "2px 12px",
    borderRadius: "20px",
    background: "rgba(99, 102, 241, 0.3)",
    color: "#a5b4fc",
  },

  themeToggle: {
    padding: "8px 16px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  featuredCard: {
    marginBottom: "20px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease",
  },

  featuredImageContainer: {
    position: "relative",
    width: "100%",
    height: "200px",
    overflow: "hidden",
  },

  featuredImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  },

  featuredOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    padding: "20px",
    textAlign: "center",
  },

  featuredIcon: {
    fontSize: "48px",
    marginBottom: "8px",
  },

  featuredTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "4px",
  },

  featuredDesc: {
    fontSize: "14px",
    opacity: 0.9,
  },

  subjectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "12px",
    marginBottom: "20px",
  },

  subjectCard: {
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid",
  },

  subjectCardImage: {
    position: "relative",
    width: "100%",
    height: "80px",
    overflow: "hidden",
  },

  subjectCardImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  subjectCardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  subjectCardIcon: {
    fontSize: "28px",
  },

  subjectCardContent: {
    padding: "8px 10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "background 0.3s ease",
  },

  subjectCardName: {
    fontSize: "11px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transition: "color 0.3s ease",
  },

  subjectCardEmoji: {
    fontSize: "14px",
  },

  gradeContainer: {
    marginBottom: "16px",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid",
    transition: "background 0.3s ease, border-color 0.3s ease",
  },

  gradeHeader: {
    marginBottom: "10px",
  },

  gradeLabel: {
    fontSize: "13px",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },

  gradeTags: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },

  gradeTag: {
    padding: "4px 12px",
    borderRadius: "16px",
    fontSize: "11px",
    fontWeight: "500",
    border: "1px solid",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  gradeEmoji: {
    fontSize: "12px",
  },

  startLearningBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    color: "#fff",
    background: "linear-gradient(135deg, #6366f1, #3b82f6)",
    fontSize: "18px",
    fontWeight: "700",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "16px",
    boxShadow: "0 10px 25px rgba(99,102,241,0.4)",
    position: "relative",
    overflow: "hidden",
  },

  startBtnIcon: {
    fontSize: "22px",
  },

  startBtnArrow: {
    fontSize: "20px",
    transition: "transform 0.3s ease",
  },

  features: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    padding: "4px 12px",
    borderRadius: "20px",
    transition: "all 0.3s ease",
  },

  featureIcon: {
    fontSize: "14px",
  },

  // Login Styles
  loginCard: {
    width: "100%",
    maxWidth: "380px",
    padding: "30px 25px",
    borderRadius: "24px",
    border: "1px solid",
    backdropFilter: "blur(20px)",
    transition: "background 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease",
  },

  loginHeader: {
    textAlign: "center",
    marginBottom: "24px",
  },

  loginIcon: {
    fontSize: "40px",
    display: "block",
    marginBottom: "8px",
  },

  loginTitle: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "4px",
    transition: "color 0.3s ease",
  },

  loginSubtitle: {
    fontSize: "14px",
    transition: "color 0.3s ease",
  },

  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "color 0.3s ease",
  },

  labelIcon: {
    fontSize: "16px",
  },

  input: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid",
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
    border: "1px solid",
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
    fontSize: "20px",
    padding: "4px",
    opacity: 0.6,
    transition: "opacity 0.2s",
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

  loginButton: {
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
    border: "1px solid",
    textAlign: "center",
    transition: "all 0.3s ease",
  },

  demoText: {
    fontSize: "12px",
    marginBottom: "4px",
    transition: "color 0.3s ease",
  },

  demoCredentials: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    fontSize: "12px",
    fontWeight: "500",
    flexWrap: "wrap",
  },

  demoPass: {
    padding: "2px 8px",
    borderRadius: "4px",
  },

  signupRow: {
    textAlign: "center",
    fontSize: "14px",
    display: "flex",
    justifyContent: "center",
    gap: "6px",
    transition: "color 0.3s ease",
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

  loginFooter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "18px",
    paddingTop: "14px",
    borderTop: "1px solid",
    fontSize: "11px",
    transition: "all 0.3s ease",
  },

  footer: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    padding: "14px",
    borderTop: "1px solid",
    fontSize: "11px",
    flexWrap: "wrap",
    transition: "all 0.3s ease",
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

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  input:focus {
    border-color: #6366f1 !important;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  button:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  .signup-link:hover {
    color: #8b5cf6 !important;
  }

  .password-toggle:hover {
    opacity: 1 !important;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  .theme-toggle:hover {
    transform: scale(1.05) !important;
  }

  .subject-card:hover {
    transform: translateY(-4px) !important;
  }

  .grade-tag:hover {
    transform: scale(1.05) !important;
    border-color: #6366f1 !important;
  }

  .feature:hover {
    transform: translateY(-2px);
    opacity: 1 !important;
  }

  .featured-image:hover {
    transform: scale(1.05);
  }

  .start-learning-btn:hover .start-btn-arrow {
    transform: translateX(5px);
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 4px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.4);
    border-radius: 10px;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .main-container {
      flex-direction: column !important;
      padding: 15px !important;
    }
    .left-content {
      max-height: none !important;
    }
    .right-content {
      width: 100% !important;
    }
    .login-card {
      max-width: 100% !important;
    }
    .subject-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important;
    }
    .featured-image-container {
      height: 150px !important;
    }
  }

  @media (max-width: 600px) {
    .subject-grid {
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)) !important;
    }
    .subject-card-image {
      height: 60px !important;
    }
    .subject-card-name {
      font-size: 9px !important;
    }
    .featured-title {
      font-size: 20px !important;
    }
    .start-learning-btn {
      font-size: 15px !important;
      padding: 14px !important;
    }
  }
`;
document.head.appendChild(styleSheet);