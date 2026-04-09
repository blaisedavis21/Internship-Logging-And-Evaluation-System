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
