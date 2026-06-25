import { Link } from "react-router-dom"
import { MapPin, Calendar } from "lucide-react"
import StatusBadge from "./StatusBadge.jsx"

export default function ComplaintCard({ complaint }) {
  return (
    <Link
      to={`/complaints/${complaint._id}`}
      className="block rounded-lg border border-border bg-card p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground">{complaint.title}</h3>
        <StatusBadge status={complaint.status} />
      </div>
      <p className="mb-3 line-clamp-2 text-sm text-muted">{complaint.description}</p>
      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {complaint.address}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={14} /> {complaint.createdAt}
        </span>
      </div>
      <div className="mt-3 text-xs font-medium text-primary">{complaint.id}</div>
    </Link>
  )
}
