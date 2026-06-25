const STYLES = {
  Pending: "bg-amber-100 text-amber-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
}

export default function StatusBadge({ status }) {
  const style = STYLES[status] || "bg-slate-100 text-slate-700"
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {status}
    </span>
  )
}
