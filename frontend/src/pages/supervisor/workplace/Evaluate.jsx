import { useState, useEffect, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck, User, CheckCircle2, AlertCircle, X,
  Award, Lock, ChevronDown,
} from "lucide-react";

const GRADE_MAP = [
  { min: 90, grade: "A+", label: "Outstanding",  color: "text-emerald-400" },
  { min: 80, grade: "A",  label: "Excellent",    color: "text-emerald-400" },
  { min: 70, grade: "B",  label: "Very Good",    color: "text-sky-400"     },
  { min: 60, grade: "C",  label: "Satisfactory", color: "text-amber-400"   },
  { min: 50, grade: "D",  label: "Pass",         color: "text-orange-400"  },
  { min: 0,  grade: "F",  label: "Fail",         color: "text-red-400"     },
];

const getGrade = (score) => GRADE_MAP.find((g) => score >= g.min) || GRADE_MAP[GRADE_MAP.length - 1];

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 40, scale: 0.95 }}
    className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium ${
      type === "success" ? "bg-emerald-950 border-emerald-700 text-emerald-200" : "bg-red-950 border-red-700 text-red-200"
    }`}
  >
    {type === "success"
      ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      : <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
    {message}
    <button onClick={onClose} className="ml-2 text-white/40 hover:text-white transition">
      <X className="w-3.5 h-3.5" />
    </button>
  </motion.div>
);

const ScoreRing = ({ score }) => {
  const pct  = score / 100;
  const r    = 42;
  const circ = 2 * Math.PI * r;
  const grade = getGrade(score);

  return (
    <div className="relative inline-flex items-center justify-center w-[100px] h-[100px]">
      <svg width="100" height="100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} stroke="#1a3050" strokeWidth="7" fill="none" />
        <circle cx="50" cy="50" r={r}
          stroke={score >= 70 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171"}
          strokeWidth="7" fill="none"
          strokeDasharray={circ}
          strokeDashoffset={circ - pct * circ}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white leading-none">{score}</span>
        <span className="text-[10px] text-slate-500 mt-0.5">/ 100</span>
      </div>
    </div>
  );
};

const WorkplaceEvaluate = () => {
  const { user } = useAuth();
  const [placements, setPlacements] = useState([]);
  const [existingEvals, setExistingEvals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [score, setScore] = useState("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [placementsData, evalsData] = await Promise.all([
          apiClient.get('/placements/'),
          apiClient.get('/evaluations/'),
        ]);
        setPlacements(Array.isArray(placementsData) ? placementsData : []);
        setExistingEvals(Array.isArray(evalsData) ? evalsData : []);
        if (placementsData.length > 0) {
          setSelectedStudentId(String(placementsData[0].student));
        }
      } catch (err) {
        showToast(err.message || 'Failed to load data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const selectedPlacement = placements.find((p) => String(p.student) === String(selectedStudentId));
  const scoreNum = Number(score) || 0;
  const gradeInfo = getGrade(scoreNum);

  const alreadyEvaluated = existingEvals.some(
    (e) => String(e.student) === String(selectedStudentId) && e.evaluation_type === 'workplace'
  );

  const handleSubmit = async () => {
    if (!selectedStudentId) { showToast("Please select a student.", "error"); return; }
    if (!score || scoreNum < 0 || scoreNum > 100) { showToast("Please enter a valid score between 0 and 100.", "error"); return; }
    if (alreadyEvaluated) { showToast("You have already submitted an evaluation for this student.", "error"); return; }

    setSubmitting(true);
    try {
      await apiClient.post('/evaluations/', {
        student: Number(selectedStudentId),
        score: scoreNum,
        comments: comments,
        evaluation_type: 'workplace',
      });
      setSubmitted(true);
      setExistingEvals((prev) => [...prev, { student: Number(selectedStudentId), evaluation_type: 'workplace' }]);
      showToast(`Evaluation for ${selectedPlacement?.student_name} submitted successfully.`);
    } catch (err) {
      showToast(err.message || 'Failed to submit evaluation.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#07101f] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl overflow-hidden border border-[#1a3050] bg-[#0d1926]">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-7 py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20">
                  <ClipboardCheck className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest text-sky-400 uppercase mb-1">Workplace Assessment</p>
                  <h1 className="text-2xl font-bold text-white">Evaluate Student</h1>
                  <p className="text-sm text-slate-400 mt-0.5">Submit a workplace evaluation score for your assigned students.</p>
                </div>
              </div>
              {submitted && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                  <Lock className="w-4 h-4" /> Submitted
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_260px] gap-6 items-start">

            {/* Left: Form */}
            <div className="space-y-5">

              {/* Student selector */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                  Student Being Evaluated
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select value={selectedStudentId}
                    onChange={(e) => { setSelectedStudentId(e.target.value); setSubmitted(false); setScore(""); setComments(""); }}
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white appearance-none focus:outline-none focus:border-sky-500/50 transition disabled:opacity-50">
                    <option value="">Select a student…</option>
                    {placements.map((p) => (
                      <option key={p.id} value={String(p.student)}>
                        {p.student_name} — {p.company}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>

                {selectedPlacement && (
                  <div className="mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sky-500/5 border border-sky-500/15">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-xs font-bold text-sky-300 flex-shrink-0">
                      {(selectedPlacement.student_name ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{selectedPlacement.student_name}</p>
                      <p className="text-xs text-slate-500">{selectedPlacement.company}</p>
                    </div>
                    {alreadyEvaluated && (
                      <span className="ml-auto text-xs px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        Already evaluated
                      </span>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Score input */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5 space-y-4">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Score (out of 100)
                </label>
                <div className="flex items-center gap-4">
                  <input type="number" min={0} max={100}
                    value={score} onChange={(e) => setScore(e.target.value)}
                    disabled={alreadyEvaluated}
                    placeholder="0 – 100"
                    className="w-32 px-3 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-white text-center text-lg font-bold focus:outline-none focus:border-sky-500/50 transition disabled:opacity-50" />
                  <div className="flex-1 h-2 rounded-full bg-[#1a3050] overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${scoreNum >= 70 ? "bg-emerald-500" : scoreNum >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                      animate={{ width: `${scoreNum}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <span className={`text-sm font-bold w-8 text-right ${gradeInfo.color}`}>{gradeInfo.grade}</span>
                </div>
              </motion.div>

              {/* Comments */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5">
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                  Comments
                </label>
                <textarea rows={4}
                  placeholder="Summarise the student's overall performance, strengths, and areas for improvement…"
                  value={comments} onChange={(e) => setComments(e.target.value)}
                  disabled={alreadyEvaluated}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1523] border border-[#1e3a5f] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/40 transition resize-none disabled:opacity-50" />
              </motion.div>

              {/* Submit button */}
              {!alreadyEvaluated && (
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  onClick={handleSubmit} disabled={submitting || !selectedStudentId || !score}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition disabled:opacity-50 disabled:cursor-not-allowed">
                  <CheckCircle2 className="w-4 h-4" />
                  {submitting ? "Submitting..." : "Submit Evaluation"}
                </motion.button>
              )}

              {alreadyEvaluated && (
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-emerald-500/8 border border-emerald-500/25 text-emerald-300 text-sm font-medium">
                  <Lock className="w-4 h-4 flex-shrink-0" />
                  Evaluation already submitted for this student.
                </div>
              )}
            </div>

            {/* Right: Score Panel */}
            <div className="space-y-4 lg:sticky lg:top-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5 text-center space-y-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Live Score</p>
                <div className="flex justify-center">
                  <ScoreRing score={scoreNum} />
                </div>
                <div>
                  <p className={`text-3xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{gradeInfo.label}</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="rounded-2xl bg-[#0d1926] border border-[#1a3050] p-5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Grade Reference</p>
                <div className="space-y-1.5">
                  {GRADE_MAP.map((g) => (
                    <div key={g.grade}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${gradeInfo.grade === g.grade ? "bg-white/5" : ""}`}>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold w-6 ${g.color}`}>{g.grade}</span>
                        <span className="text-xs text-slate-500">{g.label}</span>
                      </div>
                      <span className="text-xs text-slate-600">{g.min}%+</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </AppLayout>
  );
};

export default WorkplaceEvaluate;