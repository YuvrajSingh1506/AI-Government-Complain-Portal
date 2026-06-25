import { useState } from "react"
import { Link } from "react-router-dom"
import { FileText, Clock, CheckCircle, Loader, X } from "lucide-react"
import { complaints as initialComplaints, OFFICIALS, DEPARTMENTS } from "../data/mockData.js"
import StatusBadge from "../components/StatusBadge.jsx"

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState(initialComplaints)
  const [modalComplaint, setModalComplaint] = useState(null)
  const [official, setOfficial] = useState("")
  const [department, setDepartment] = useState("")

  const stats = [
    { label: "Total", value: complaints.length, icon: <FileText size={20} />, color: "text-primary" },
    {
      label: "Pending",
      value: complaints.filter((c) => c.status === "Pending").length,
      icon: <Clock size={20} />,
      color: "text-amber-600",
    },
    {
      label: "In Progress",
      value: complaints.filter((c) => c.status === "In Progress").length,
      icon: <Loader size={20} />,
      color: "text-blue-600",
    },
    {
      label: "Resolved",
      value: complaints.filter((c) => c.status === "Resolved").length,
      icon: <CheckCircle size={20} />,
      color: "text-green-600",
    },
  ]

  const openModal = (complaint) => {
    setModalComplaint(complaint)
    setOfficial(complaint.assignedOfficial || "")
    setDepartment(complaint.department || "")
  }

  const handleAssign = (e) => {
    e.preventDefault()
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === modalComplaint.id
          ? { ...c, assignedOfficial: official, department, status: c.status === "Pending" ? "In Progress" : c.status }
          : c,
      ),
    )
    setModalComplaint(null)
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Admin Dashboard</h1>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className={`mb-2 ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-slate-50 text-muted">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Official</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link to={`/complaints/${c.id}`} className="font-medium text-primary hover:underline">
                    {c.id}
                  </Link>
                </td>
                <td className="px-4 py-3">{c.title}</td>
                <td className="px-4 py-3">{c.department}</td>
                <td className="px-4 py-3">{c.assignedOfficial || "—"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openModal(c)}
                    className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Modal */}
      {modalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Assign Complaint</h2>
              <button onClick={() => setModalComplaint(null)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <p className="mb-4 text-sm text-muted">
              {modalComplaint.id} — {modalComplaint.title}
            </p>
            <form onSubmit={handleAssign} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Official</label>
                <select
                  value={official}
                  onChange={(e) => setOfficial(e.target.value)}
                  className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value="">Select official</option>
                  {OFFICIALS.map((o) => (
                    <option key={o.id} value={o.name}>
                      {o.name} ({o.department})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Assign
                </button>
                <button
                  type="button"
                  onClick={() => setModalComplaint(null)}
                  className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
