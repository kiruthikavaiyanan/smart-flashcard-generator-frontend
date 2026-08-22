import React, { useState, useEffect, useRef } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

function Dashboard() {
  // State Management
  const [notes, setNotes] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [darkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "info" });
  const [expandedCard, setExpandedCard] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const textareaRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [notes]);

  // API Functions
  const loadHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/flashcards`);
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      setHistory([]);
    }
  };

  const generateFlashcards = async () => {
    if (!notes.trim()) {
      showNotification("Please enter some notes first!", "warning");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/generate-flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: notes }),
      });

      if (!res.ok) throw new Error("Failed to generate flashcards");

      const data = await res.json();
      setFlashcards(data.flashcards || []);
      await loadHistory();
      setShowNewChat(false);
      showNotification(`✨ Generated ${data.flashcards?.length || 0} flashcards!`, "success");
    } catch (err) {
      setError(err.message);
      showNotification("❌ Failed to generate flashcards. Check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openHistoryItem = (item) => {
    setSelectedId(item?._id);
    setNotes(item?.input_text || "");
    setFlashcards(item?.flashcards || []);
    setShowNewChat(false);
    showNotification("📂 Loaded from history", "info");
  };

  const deleteHistoryItem = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this item?")) return;

    try {
      await fetch(`${API_BASE_URL}/flashcards/${id}`, {
        method: "DELETE",
      });
      await loadHistory();
      if (selectedId === id) {
        setSelectedId(null);
        setNotes("");
        setFlashcards([]);
      }
      showNotification("🗑️ Item deleted", "info");
    } catch (err) {
      showNotification("❌ Failed to delete item", "error");
    }
  };

  const clearHistory = async () => {
    if (!window.confirm("Are you sure you want to delete all history?")) return;

    try {
      await fetch(`${API_BASE_URL}/delete-all-flashcards`, {
        method: "DELETE",
      });
      setHistory([]);
      setFlashcards([]);
      setNotes("");
      setSelectedId(null);
      setShowNewChat(true);
      showNotification("🧹 History cleared successfully", "success");
    } catch (err) {
      showNotification("❌ Failed to clear history", "error");
    }
  };

  const startNewChat = () => {
    setNotes("");
    setFlashcards([]);
    setSelectedId(null);
    setShowNewChat(true);
    showNotification("✨ New chat started!", "info");
  };

  // Utility Functions
  const showNotification = (message, type = "info") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "info" }), 3000);
  };

  const exportFlashcards = () => {
    if (flashcards.length === 0) {
      showNotification("📭 No flashcards to export", "warning");
      return;
    }

    const dataStr = JSON.stringify(flashcards, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flashcards_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification("📥 Flashcards exported successfully!", "success");
  };

  const copyFlashcards = () => {
    if (flashcards.length === 0) {
      showNotification("📭 No flashcards to copy", "warning");
      return;
    }

    const text = flashcards.map((c, i) => 
      `Q${i + 1}: ${c.question}\nA: ${c.answer}`
    ).join("\n\n");

    navigator.clipboard.writeText(text).then(() => {
      showNotification("📋 Flashcards copied to clipboard!", "success");
    }).catch(() => {
      showNotification("❌ Failed to copy flashcards", "error");
    });
  };

  const loadExampleNotes = (example) => {
    setNotes(example);
    setShowNewChat(false);
    showNotification("📝 Example notes loaded!", "info");
  };

  // Filtered history
  const filteredHistory = (history || []).filter((item) => {
    const text = (item?.input_text || "").toLowerCase();
    const q = (search || "").toLowerCase();
    return text.includes(q);
  });

  // Theme Configuration
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

  return (
    <div style={{ ...styles.wrapper, background: theme.bg, color: theme.text }}>
      {/* Notification */}
      {notification.show && (
        <div style={{ 
          ...styles.notification, 
          background: theme.card, 
          borderColor: theme.border,
          borderLeft: `4px solid ${
            notification.type === "success" ? "#22c55e" :
            notification.type === "error" ? "#ef4444" :
            notification.type === "warning" ? "#f59e0b" : "#6366f1"
          }`
        }}>
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification({ show: false, message: "", type: "info" })} 
            style={styles.notifClose}
          >
            ✕
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div style={{ 
        ...styles.sidebar, 
        background: theme.card, 
        borderColor: theme.border,
        width: sidebarCollapsed ? "70px" : "310px",
      }}>
        <div style={styles.logoContainer}>
          {!sidebarCollapsed ? (
            <>
              <span style={styles.logoIcon}>📚</span>
              <h2 style={styles.logoText}>Flash AI</h2>
              <span style={styles.logoBadge}>Pro</span>
            </>
          ) : (
            <span style={{ fontSize: "28px" }}>📚</span>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
            style={styles.sidebarToggle}
          >
            <i className={`fas fa-${sidebarCollapsed ? "chevron-right" : "chevron-left"}`}></i>
          </button>
        </div>

        {!sidebarCollapsed && (
          <>
            {/* Stats Cards */}
            <div style={styles.statsContainer}>
              <div style={{ ...styles.statCard, background: theme.bg }}>
                <span style={styles.statIcon}>📝</span>
                <div>
                  <span style={styles.statValue}>{history.length}</span>
                  <span style={styles.statLabel}>Total Notes</span>
                </div>
              </div>
              <div style={{ ...styles.statCard, background: theme.bg }}>
                <span style={styles.statIcon}>🃏</span>
                <div>
                  <span style={styles.statValue}>{flashcards.length}</span>
                  <span style={styles.statLabel}>Flashcards</span>
                </div>
              </div>
            </div>

            {/* New Chat Button */}
            <button onClick={startNewChat} style={styles.newChatBtn}>
              <i className="fas fa-plus-circle" style={{ marginRight: "8px" }}></i>
              ✨ New Chat
            </button>

            <div style={styles.searchWrapper}>
              <i className="fas fa-search" style={styles.searchIcon}></i>
              <input
                placeholder="🔍 Search history..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ ...styles.search, background: theme.bg, color: theme.text, borderColor: theme.border }}
              />
            </div>

            <button onClick={clearHistory} style={styles.clearBtn}>
              <i className="fas fa-trash-alt" style={{ marginRight: "8px" }}></i>
              🗑️ Clear All
            </button>

            <div style={styles.historyHeader}>
              <span style={styles.historyTitle}>📜 History</span>
              <span style={styles.historyCount}>{filteredHistory.length}</span>
            </div>
          </>
        )}

        <div style={styles.historyBox}>
          {!sidebarCollapsed && filteredHistory.length === 0 && (
            <div style={{ ...styles.emptyState, color: theme.subtle }}>
              <i className="fas fa-comment-plus" style={{ fontSize: "32px", marginBottom: "8px" }}></i>
              <p>No chats yet</p>
              <span style={styles.emptySubtext}>Start a new chat to begin</span>
            </div>
          )}
          {filteredHistory.map((item) => (
            <div
              key={item?._id}
              onClick={() => openHistoryItem(item)}
              style={{
                ...styles.historyItem,
                background: selectedId === item?._id ? theme.accentGrad : theme.cardHover,
                color: selectedId === item?._id ? "#fff" : theme.text,
                borderColor: selectedId === item?._id ? "transparent" : theme.border,
                boxShadow: selectedId === item?._id ? "0 4px 12px rgba(99, 102, 241, 0.3)" : "none",
                padding: sidebarCollapsed ? "10px" : "12px 14px",
                justifyContent: sidebarCollapsed ? "center" : "space-between",
              }}
              title={sidebarCollapsed ? item?.input_text : ""}
            >
              {!sidebarCollapsed ? (
                <>
                  <div style={styles.historyItemContent}>
                    <i className="fas fa-file-alt" style={{ opacity: 0.6, marginRight: "10px" }}></i>
                    <span>{(item?.input_text || "No Data").slice(0, 45)}...</span>
                  </div>
                  <button 
                    onClick={(e) => deleteHistoryItem(item?._id, e)}
                    style={styles.deleteItemBtn}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </>
              ) : (
                <i className="fas fa-file-alt" style={{ fontSize: "18px" }}></i>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.headerSection}>
          <div>
            <h1 style={styles.title}>
              <span style={{ 
                background: "linear-gradient(135deg, #6366f1, #3b82f6, #8b5cf6)", 
                WebkitBackgroundClip: "text", 
                WebkitTextFillColor: "transparent" 
              }}>
                Smart Flashcard Generator
              </span>
            </h1>
            <p style={{ ...styles.subtitle, color: theme.subtle }}>
              <i className="fas fa-robot" style={{ marginRight: "8px" }}></i>
              AI-powered flashcards from your notes
            </p>
          </div>
          <div style={styles.headerStats}>
            {flashcards.length > 0 && (
              <>
                <button onClick={exportFlashcards} style={styles.actionBtnWithLabel}>
                  <i className="fas fa-download"></i>
                  <span style={styles.btnLabel}>Export</span>
                </button>
                <button onClick={copyFlashcards} style={styles.actionBtnWithLabel}>
                  <i className="fas fa-copy"></i>
                  <span style={styles.btnLabel}>Copy</span>
                </button>
              </>
            )}
            <span style={styles.statBadge}>
              <i className="fas fa-layer-group"></i> {flashcards.length}
            </span>
          </div>
        </div>

        {/* New Chat Welcome State */}
        {showNewChat && flashcards.length === 0 && !notes && (
          <div style={{ ...styles.welcomeCard, background: theme.card, borderColor: theme.border }}>
            <div style={styles.welcomeContent}>
              <span style={styles.welcomeIcon}>💬</span>
              <h2 style={styles.welcomeTitle}>New Chat Started!</h2>
              <p style={{ ...styles.welcomeSubtext, color: theme.subtle }}>
                Paste your study notes below and generate AI-powered flashcards.
              </p>
              <div style={styles.welcomeTips}>
                <div style={styles.welcomeTip}>
                  <span>📝</span>
                  <span>Paste your notes</span>
                </div>
                <div style={styles.welcomeTip}>
                  <span>⚡</span>
                  <span>Generate flashcards</span>
                </div>
                <div style={styles.welcomeTip}>
                  <span>📚</span>
                  <span>Study & revise</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Card */}
        <div style={{ ...styles.inputCard, background: theme.card, borderColor: theme.border }}>
          <div style={styles.inputHeader}>
            <span style={styles.inputLabel}>
              <i className="fas fa-pencil-alt" style={{ marginRight: "6px" }}></i>
              Your Notes
            </span>
            <span style={{ ...styles.charCount, color: theme.subtle }}>
              {notes.length} chars
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your study notes here..."
            style={{ ...styles.textarea, background: theme.bg, color: theme.text, borderColor: theme.border }}
          />
          <div style={styles.buttonRow}>
            <button 
              onClick={generateFlashcards} 
              style={styles.generateBtn}
              disabled={loading}
            >
              {loading ? (
                <><i className="fas fa-spinner fa-spin" style={{ marginRight: "8px" }}></i> Generating...</>
              ) : (
                <><i className="fas fa-bolt" style={{ marginRight: "8px" }}></i> Generate Flashcards</>
              )}
            </button>
            {error && <span style={styles.errorText}>{error}</span>}
          </div>
        </div>

        {/* Example Tags */}
        <div style={styles.exampleContainer}>
          <span style={styles.exampleLabel}>Quick examples:</span>
          <button 
            onClick={() => loadExampleNotes("Photosynthesis is the process by which plants convert light energy into chemical energy. It occurs in chloroplasts and involves chlorophyll.")}
            style={styles.exampleTag}
          >
            🌱 Biology
          </button>
          <button 
            onClick={() => loadExampleNotes("The French Revolution began in 1789 and led to the end of the monarchy. Key figures include Robespierre and Napoleon.")}
            style={styles.exampleTag}
          >
            📖 History
          </button>
          <button 
            onClick={() => loadExampleNotes("React is a JavaScript library for building user interfaces. It uses components, props, and state to manage data and render UI.")}
            style={styles.exampleTag}
          >
            ⚛️ React
          </button>
        </div>

        {/* Flashcards Grid */}
        {flashcards.length > 0 && (
          <div style={styles.gridSection}>
            <div style={styles.gridHeader}>
              <h3 style={styles.gridTitle}>
                <i className="fas fa-cards" style={{ marginRight: "8px" }}></i>
                Generated Flashcards
              </h3>
              <span style={{ ...styles.gridCount, color: theme.subtle }}>
                {flashcards.length} cards
              </span>
            </div>
            <div style={styles.grid}>
              {flashcards.map((card, index) => (
                <div 
                  key={index} 
                  className="flashcard"
                  style={{ 
                    ...styles.card, 
                    background: theme.card, 
                    borderColor: theme.border,
                    boxShadow: theme.shadow,
                  }}
                  onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                >
                  <div style={styles.cardHeader}>
                    <span style={styles.cardNumber}>#{index + 1}</span>
                    <span style={styles.cardExpandIcon}>
                      <i className={`fas fa-chevron-${expandedCard === index ? "up" : "down"}`}></i>
                    </span>
                  </div>
                  <h3 style={styles.cardQuestion}>
                    <i className="fas fa-question-circle" style={{ color: "#6366f1", marginRight: "8px" }}></i>
                    {card?.question}
                  </h3>
                  <div style={styles.cardDivider}></div>
                  <p style={{ 
                    ...styles.cardAnswer, 
                    maxHeight: expandedCard === index ? "500px" : "60px",
                    overflow: "hidden",
                    transition: "max-height 0.3s ease",
                  }}>
                    <i className="fas fa-lightbulb" style={{ color: "#f59e0b", marginRight: "8px", flexShrink: 0 }}></i>
                    {card?.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State (No flashcards and not new chat) */}
        {flashcards.length === 0 && !showNewChat && (
          <div style={{ ...styles.emptyFlashcards, background: theme.card, borderColor: theme.border }}>
            <i className="fas fa-lightbulb" style={{ fontSize: "48px", color: "#6366f1", opacity: 0.3 }}></i>
            <p style={{ color: theme.subtle, textAlign: "center", maxWidth: "400px" }}>
              No flashcards generated yet.<br />
              Paste your notes above and click generate!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Inter', -apple-system, sans-serif",
    transition: "background 0.3s, color 0.3s",
    overflow: "hidden",
  },

  notification: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "16px 24px",
    borderRadius: "12px",
    border: "1px solid",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    gap: "16px",
    animation: "slideIn 0.3s ease",
    backdropFilter: "blur(10px)",
  },

  notifClose: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    opacity: 0.5,
    padding: "0 4px",
    color: "inherit",
  },

  sidebar: {
    padding: "20px 16px",
    borderRight: "1px solid",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.3s ease",
    flexShrink: 0,
    overflow: "hidden",
    position: "relative",
  },

  sidebarToggle: {
    position: "absolute",
    right: "-12px",
    top: "24px",
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    border: "none",
    background: "#6366f1",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    zIndex: 10,
    transition: "transform 0.2s",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid",
    borderColor: "inherit",
    position: "relative",
  },

  logoIcon: {
    fontSize: "28px",
  },

  logoText: {
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    background: "linear-gradient(135deg, #6366f1, #3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  logoBadge: {
    fontSize: "10px",
    fontWeight: "600",
    padding: "2px 10px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    marginLeft: "auto",
  },

  statsContainer: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
  },

  statCard: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid",
    borderColor: "inherit",
  },

  statIcon: {
    fontSize: "20px",
  },

  statValue: {
    fontSize: "16px",
    fontWeight: "700",
    display: "block",
  },

  statLabel: {
    fontSize: "10px",
    opacity: 0.6,
    display: "block",
  },

  newChatBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
    marginBottom: "12px",
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  toggleBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  searchWrapper: {
    position: "relative",
    marginBottom: "12px",
  },

  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    opacity: 0.5,
  },

  search: {
    width: "100%",
    padding: "10px 10px 10px 38px",
    borderRadius: "10px",
    border: "1px solid",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },

  clearBtn: {
    width: "100%",
    padding: "10px",
    marginBottom: "16px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "14px",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    padding: "0 4px",
  },

  historyTitle: {
    fontWeight: "600",
    fontSize: "14px",
    letterSpacing: "0.3px",
  },

  historyCount: {
    fontSize: "12px",
    padding: "2px 10px",
    borderRadius: "20px",
    background: "rgba(99, 102, 241, 0.15)",
    color: "#6366f1",
    fontWeight: "600",
  },

  historyBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    paddingRight: "4px",
  },

  historyItem: {
    padding: "12px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    border: "1px solid",
    transition: "all 0.2s",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
    lineHeight: "1.4",
  },

  historyItemContent: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    overflow: "hidden",
  },

  deleteItemBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    opacity: 0.4,
    padding: "4px 8px",
    borderRadius: "6px",
    transition: "all 0.2s",
    color: "inherit",
  },

  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 0",
    opacity: 0.5,
  },

  emptySubtext: {
    fontSize: "12px",
    opacity: 0.6,
    marginTop: "4px",
  },

  main: {
    flex: 1,
    padding: "30px 35px",
    overflowY: "auto",
    transition: "background 0.3s",
  },

  headerSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "12px",
  },

  title: {
    fontSize: "30px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
    marginBottom: "6px",
  },

  subtitle: {
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
  },

  headerStats: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  actionBtnWithLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
    padding: "6px 12px",
    borderRadius: "10px",
    border: "1px solid",
    background: "transparent",
    cursor: "pointer",
    transition: "all 0.2s",
    color: "inherit",
    fontSize: "12px",
    minWidth: "50px",
  },

  btnLabel: {
    fontSize: "9px",
    opacity: 0.6,
    fontWeight: "500",
  },

  statBadge: {
    padding: "6px 16px",
    borderRadius: "20px",
    background: "rgba(99, 102, 241, 0.12)",
    color: "#6366f1",
    fontSize: "13px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  welcomeCard: {
    padding: "40px",
    borderRadius: "16px",
    border: "1px solid",
    marginBottom: "20px",
    textAlign: "center",
  },

  welcomeContent: {
    maxWidth: "500px",
    margin: "0 auto",
  },

  welcomeIcon: {
    fontSize: "56px",
    display: "block",
    marginBottom: "12px",
  },

  welcomeTitle: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  welcomeSubtext: {
    fontSize: "15px",
    marginBottom: "20px",
  },

  welcomeTips: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  welcomeTip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "20px",
    background: "rgba(99, 102, 241, 0.08)",
    fontSize: "13px",
  },

  inputCard: {
    padding: "24px",
    borderRadius: "16px",
    border: "1px solid",
    marginBottom: "16px",
    transition: "background 0.3s, border-color 0.3s",
  },

  inputHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },

  inputLabel: {
    fontWeight: "600",
    fontSize: "14px",
  },

  charCount: {
    fontSize: "12px",
    opacity: 0.6,
  },

  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid",
    fontSize: "14px",
    lineHeight: "1.6",
    outline: "none",
    resize: "none",
    transition: "background 0.3s, border-color 0.3s",
    fontFamily: "inherit",
  },

  buttonRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginTop: "12px",
  },

  generateBtn: {
    padding: "14px 32px",
    background: "linear-gradient(135deg, #6366f1, #3b82f6)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.2s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },

  errorText: {
    color: "#ef4444",
    fontSize: "13px",
  },

  exampleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "24px",
    flexWrap: "wrap",
    padding: "4px 0",
  },

  exampleLabel: {
    fontSize: "13px",
    opacity: 0.6,
    fontWeight: "500",
  },

  exampleTag: {
    padding: "6px 16px",
    borderRadius: "20px",
    background: "rgba(99, 102, 241, 0.1)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
    cursor: "pointer",
    fontSize: "13px",
    transition: "all 0.2s",
    color: "#6366f1",
    fontFamily: "inherit",
  },

  gridSection: {
    marginTop: "8px",
  },

  gridHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  gridTitle: {
    fontSize: "18px",
    fontWeight: "600",
  },

  gridCount: {
    fontSize: "13px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "18px",
  },

  card: {
    padding: "20px",
    borderRadius: "14px",
    border: "1px solid",
    transition: "all 0.3s ease",
    cursor: "pointer",
    position: "relative",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  cardNumber: {
    fontSize: "11px",
    fontWeight: "600",
    opacity: 0.3,
  },

  cardExpandIcon: {
    fontSize: "12px",
    opacity: 0.4,
  },

  cardQuestion: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "10px",
    display: "flex",
    alignItems: "flex-start",
    lineHeight: "1.4",
  },

  cardDivider: {
    height: "1px",
    background: "linear-gradient(to right, transparent, #6366f1, transparent)",
    opacity: 0.2,
    margin: "10px 0",
  },

  cardAnswer: {
    fontSize: "14px",
    lineHeight: "1.6",
    opacity: 0.9,
    display: "flex",
    alignItems: "flex-start",
  },

  emptyFlashcards: {
    padding: "60px 20px",
    borderRadius: "16px",
    border: "2px dashed",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    opacity: 0.6,
    transition: "background 0.3s, border-color 0.3s",
    marginTop: "24px",
  },
};

// Add global styles
const globalStyles = document.createElement("style");
globalStyles.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
  }

  button:active {
    transform: translateY(0);
  }

  .flashcard:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15) !important;
  }

  .example-tag:hover {
    background: rgba(99, 102, 241, 0.2);
    transform: scale(1.05);
  }

  .action-btn-with-label:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: #6366f1;
  }

  .clear-btn:hover {
    background: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
  }

  .new-chat-btn:hover {
    background: linear-gradient(135deg, #16a34a, #15803d) !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
  }

  .generate-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .sidebar-toggle:hover {
    transform: scale(1.1);
  }

  textarea:focus {
    border-color: #6366f1 !important;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: #4b5563;
    border-radius: 12px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #6366f1;
  }
`;
document.head.appendChild(globalStyles);

export default Dashboard;