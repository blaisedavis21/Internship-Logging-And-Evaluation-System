import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import { useAuth } from "../../contexts/AuthContext";
import { mockLogs, statusColors } from "../../data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit3,
  Send,
  Lock,
  NotebookPen,
  X,
} from "lucide-react";
import "./weeklylogbook.css";

const WeeklyLogbook = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState(
    mockLogs.filter((l) => l.studentId === user?.id)
  );
  const [editing, setEditing] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    activities: "",
    learningOutcomes: "",
    challenges: "",
    hoursWorked: 0,
  });

  const handleSubmitLog = (logId) => {
    setLogs((prev) =>
      prev.map((l) =>
        l.id === logId
          ? {
              ...l,
              status: "submitted",
              submittedAt: new Date().toISOString().split("T")[0],
            }
          : l
      )
    );
  };

  const handleNewLog = () => {
    const maxWeek = logs.reduce(
      (max, l) => Math.max(max, l.weekNumber),
      0
    );
    const today = new Date();
    const sixDaysLater = new Date(today.getTime() + 6 * 86400000);

    const newLog = {
      id: Date.now(),
      studentId: user?.id || 0,
      studentName: user?.name || "",
      weekNumber: maxWeek + 1,
      startDate: today.toISOString().split("T")[0],
      endDate: sixDaysLater.toISOString().split("T")[0],
      activities: form.activities,
      learningOutcomes: form.learningOutcomes,
      challenges: form.challenges,
      hoursWorked: form.hoursWorked,
      status: "draft",
    };

    setLogs((prev) => [...prev, newLog]);
    setShowNew(false);
    setForm({
      activities: "",
      learningOutcomes: "",
      challenges: "",
      hoursWorked: 0,
    });
  };

  return (
    <AppLayout>
      <div className="logbook-root">
        <div className="logbook-header-row">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="logbook-kicker">
              <NotebookPen className="logbook-kicker-icon" />
              <span>Logbook</span>
            </div>
            <h1 className="logbook-title">Weekly Logbook</h1>
            <p className="logbook-subtitle">
              Document your internship activities each week
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setShowNew(true)}
            className="logbook-new-btn"
          >
            <Plus className="logbook-new-btn-icon" />
            New Entry
          </motion.button>
        </div>

        <AnimatePresence>
          {showNew && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="logbook-new-card"
            >
              <div className="logbook-new-header">
                <h3>New Log Entry</h3>
                <button
                  type="button"
                  onClick={() => setShowNew(false)}
                  className="logbook-new-close"
                >
                  <X className="logbook-new-close-icon" />
                </button>
              </div>
              <div className="logbook-new-body">
                <div>
                  <label>Activities Performed</label>
                  <textarea
                    value={form.activities}
                    onChange={(e) =>
                      setForm({ ...form, activities: e.target.value })
                    }
                    rows={3}
                    className="logbook-input"
                    placeholder="Describe what you did this week..."
                  />
                </div>
                <div>
                  <label>Learning Outcomes</label>
                  <textarea
                    value={form.learningOutcomes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        learningOutcomes: e.target.value,
                      })
                    }
                    rows={2}
                    className="logbook-input"
                    placeholder="What did you learn?"
                  />
                </div>
                <div>
                  <label>Challenges</label>
                  <textarea
                    value={form.challenges}
                    onChange={(e) =>
                      setForm({ ...form, challenges: e.target.value })
                    }
                    rows={2}
                    className="logbook-input"
                    placeholder="Any challenges faced?"
                  />
                </div>
                <div>
                  <label>Hours Worked</label>
                  <input
                    type="number"
                    value={form.hoursWorked}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hoursWorked: Number(e.target.value),
                      })
                    }
                    className="logbook-input logbook-input-hours"
                  />
                </div>
                <div className="logbook-new-actions">
                  <button
                    type="button"
                    onClick={handleNewLog}
                    className="logbook-btn-primary"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNew(false)}
                    className="logbook-btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="logbook-list">
          {logs.map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="logbook-card"
            >
              <div className="logbook-card-header">
                <div className="logbook-card-main">
                  <div className="logbook-week-pill">
                    <span>W{log.weekNumber}</span>
                  </div>
                  <div>
                    <p className="logbook-card-title">
                      Week {log.weekNumber}
                    </p>
                    <p className="logbook-card-dates">
                      {log.startDate} — {log.endDate}
                    </p>
                  </div>
                </div>
                <div className="logbook-card-meta">
                  <span className="logbook-card-hours">
                    {log.hoursWorked}h
                  </span>
                  <span
                    className={`status-badge ${
                      statusColors[log.status]?.bg || ""
                    } ${statusColors[log.status]?.text || ""}`}
                  >
                    {log.status}
                  </span>
                </div>
              </div>

              {editing === log.id ? (
                <div className="logbook-edit-placeholder">
                  Editing mode placeholder...
                </div>
              ) : (
                <div className="logbook-card-body">
                  <div className="logbook-section">
                    <p className="logbook-section-label">Activities</p>
                    <p className="logbook-section-text">
                      {log.activities}
                    </p>
                  </div>
                  <div className="logbook-double-grid">
                    <div className="logbook-section">
                      <p className="logbook-section-label logbook-section-label--green">
                        Learning Outcomes
                      </p>
                      <p className="logbook-section-text">
                        {log.learningOutcomes}
                      </p>
                    </div>
                    <div className="logbook-section">
                      <p className="logbook-section-label logbook-section-label--amber">
                        Challenges
                      </p>
                      <p className="logbook-section-text">
                        {log.challenges}
                      </p>
                    </div>
                  </div>
                  {log.supervisorComment && (
                    <div className="logbook-supervisor">
                      <p className="logbook-supervisor-label">
                        Supervisor Comment
                      </p>
                      <p className="logbook-supervisor-text">
                        {log.supervisorComment}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {(log.status === "draft" || log.status === "reviewed") && (
                <div className="logbook-actions-row">
                  {log.status === "draft" && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setEditing(
                            editing === log.id ? null : log.id
                          )
                        }
                        className="logbook-btn-secondary logbook-btn-small"
                      >
                        <Edit3 className="logbook-btn-small-icon" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubmitLog(log.id)}
                        className="logbook-btn-primary logbook-btn-small"
                      >
                        <Send className="logbook-btn-small-icon" />
                        Submit
                      </button>
                    </>
                  )}
                </div>
              )}

              {log.status === "approved" && (
                <div className="logbook-locked-row">
                  <Lock className="logbook-locked-icon" />
                  <span>Locked — Approved by supervisor</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default WeeklyLogbook;

