import { AlertTriangle, AlertCircle, ArrowUp, ArrowDown, Info } from "lucide-react"

const PRIORITY_STYLES = {
  CRITICAL: {
    bg: "bg-red-100 text-red-800 border-red-200",
    icon: AlertTriangle,
    label: "Critical",
  },
  HIGH: {
    bg: "bg-orange-100 text-orange-800 border-orange-200",
    icon: AlertCircle,
    label: "High",
  },
  MEDIUM: {
    bg: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: ArrowUp,
    label: "Medium",
  },
  LOW: {
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    icon: ArrowDown,
    label: "Low",
  },
}

export default function PriorityBadge({ priority }) {
  if (!priority) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-500">
        <Info size={12} /> Normal
      </span>
    )
  }

  const key = String(priority).toUpperCase()
  const config = PRIORITY_STYLES[key] || {
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Info,
    label: priority,
  }

  const IconComponent = config.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.bg}`}
    >
      <IconComponent size={13} className="shrink-0" />
      {config.label}
    </span>
  )
}
