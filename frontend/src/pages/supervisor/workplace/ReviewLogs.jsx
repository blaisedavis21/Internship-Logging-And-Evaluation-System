import { useState, useEffect, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import { apiClient } from "@/lib/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck, ChevronDown, CheckCircle2, XCircle,
  Clock, Search, Filter, Eye, FileText, X, AlertCircle,
  User,
} from "lucide-react";

const LOGBOOK_CRITERIA = [
  { criteria: 'quality_of_work', label: 'Quality of Work', max_score: 10 },
  { criteria: 'initiative',      label: 'Initiative & Creativity', max_score: 10 },
  { criteria: 'punctuality',     label: 'Punctuality & Deadlines', max_score: 10 },
];

const statusMeta = {
  submitted: { label: "Submitted", cls: "bg-amber-400/15 text-amber-300 border-amber-500/30" },
  reviewed:  { label: "Reviewed",  cls: "bg-sky-400/15 text-sky-300 border-sky-500/30"       },
  approved:  { label: "Approved",  cls: "bg-emerald-400/15 text-emerald-300 border-emerald-500/30" },
  rejected:  { label: "Rejected",  cls: "bg-red-400/15 text-red-300 border-red-500/30"       },
  draft:     { label: "Draft",     cls: "bg-slate-400/15 text-slate-300 border-slate-500/30" },
};

const StatusBadge = ({ status }) => {
  const m = statusMeta[status] ?? statusMeta.draft;
  return (
    <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-full font-medium border ${m.cls}`}>
      {m.label}
    </span>
  );
};