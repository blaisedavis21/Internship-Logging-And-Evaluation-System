import AppLayout from "../../components/AppLayout";
import { useAuth } from "../../contexts/AuthContext";
import { mockPlacements, statusColors } from "../../data/mockData";
import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  Calendar,
  UserCheck,
  Globe,
  Briefcase,
} from "lucide-react";
import "./studentPlacement.css";

const StudentPlacement = () => {
  const { user } = useAuth();
  const placement = mockPlacements.find((p) => p.studentId === user?.id);

  if (!placement) {
    return (
      <AppLayout>
        <div className="placement-empty">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="placement-empty-icon">
              <Building2 className="placement-empty-icon-svg" />
            </div>
            <h2 className="placement-empty-title">No Active Placement</h2>
            <p className="placement-empty-text">
              Contact your administrator to get assigned.
            </p>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  const details = [
    {
      icon: Building2,
      label: "Company",
      value: placement.company,
    },
    {
      icon: MapPin,
      label: "Department",
      value: placement.department,
    },
    {
      icon: Calendar,
      label: "Start Date",
      value: placement.startDate,
    },
    {
      icon: Calendar,
      label: "End Date",
      value: placement.endDate,
    },
    {
      icon: UserCheck,
      label: "Workplace Supervisor",
      value: placement.workplaceSupervisor,
    },
    {
      icon: UserCheck,
      label: "Academic Supervisor",
      value: placement.academicSupervisor,
    },
  ];

  const timeline = [
    { label: "Placement Assigned", date: placement.startDate, done: true },
    { label: "Internship Started", date: placement.startDate, done: true },
    { label: "Midterm Review", date: "In Progress", done: false },
    { label: "Final Evaluation", date: placement.endDate, done: false },
  ];

  return (
    <AppLayout>
      <div className="placement-root">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="placement-header"
        >
          <div className="placement-kicker">
            <Briefcase className="placement-kicker-icon" />
            <span>Placement</span>
          </div>
          <h1 className="placement-title">My Placement</h1>
          <p className="placement-subtitle">
            Your current internship assignment details
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="placement-hero"
        >
          <div className="placement-hero-top">
            <div className="placement-hero-main">
              <div className="placement-hero-icon">
                <Globe className="placement-hero-icon-svg" />
              </div>
              <div>
                <h2 className="placement-hero-title">{placement.company}</h2>
                <p className="placement-hero-dept">
                  {placement.department} Department
                </p>
              </div>
            </div>
            <span
              className={`status-badge ${statusColors[placement.status]?.bg} ${statusColors[placement.status]?.text}`}
            >
              {placement.status}
            </span>
          </div>

          <div className="placement-details-grid">
            {details.map((d, index) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="placement-detail-card"
              >
                <div className="placement-detail-icon">
                  <d.icon className="placement-detail-icon-svg" />
                </div>
                <div>
                  <p className="placement-detail-label">{d.label}</p>
                  <p className="placement-detail-value">{d.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="placement-timeline-card"
        >
          <h3 className="placement-timeline-title">Placement Timeline</h3>
          <div className="placement-timeline">
            <div className="placement-timeline-line" />
            {timeline.map((step, index) => (
              <div key={index} className="placement-timeline-row">
                <div
                  className={
                    step.done
                      ? "placement-timeline-dot placement-timeline-dot--done"
                      : "placement-timeline-dot"
                  }
                >
                  {step.done && (
                    <span className="placement-timeline-dot-check">✓</span>
                  )}
                </div>
                <div>
                  <p
                    className={
                      step.done
                        ? "placement-timeline-label placement-timeline-label--done"
                        : "placement-timeline-label"
                    }
                  >
                    {step.label}
                  </p>
                  <p className="placement-timeline-date">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default StudentPlacement;

