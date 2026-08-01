const STYLES = {
  PENDING: { style: "bg-amber-100 text-amber-800", label: "Pending" },
  Pending: { style: "bg-amber-100 text-amber-800", label: "Pending" },
  ASSIGNED: { style: "bg-purple-100 text-purple-800", label: "Assigned" },
  Assigned: { style: "bg-purple-100 text-purple-800", label: "Assigned" },
  IN_PROGRESS: { style: "bg-blue-100 text-blue-800", label: "In Progress" },
  "In Progress": { style: "bg-blue-100 text-blue-800", label: "In Progress" },
  RESOLVED: { style: "bg-green-100 text-green-800", label: "Resolved" },
  Resolved: { style: "bg-green-100 text-green-800", label: "Resolved" },
  REJECTED: { style: "bg-red-100 text-red-800", label: "Rejected" },
  Rejected: { style: "bg-red-100 text-red-800", label: "Rejected" },
}

export default function StatusBadge({ status }) {
  const config = STYLES[status] || { style: "bg-slate-100 text-slate-700", label: status || "Unknown" }
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${config.style}`}>
      {config.label}
    </span>
  )
}

