import { useState } from "react"
import { Link } from "react-router-dom"
import { Upload, X } from "lucide-react"
import { complaints as initialComplaints, STATUSES } from "../data/mockData.js"
import StatusBadge from "../components/StatusBadge.jsx"

export default function OfficialDashboard() {
  // Show complaints that have been assigned to an official (mock: all assigned ones).
  const [complaints, setComplaints] = useState(
    initialComplaints.filter((c) => c.assignedOfficial),
  )
  const [modalComplaint, setModalComplaint] = useState(null)
  const [status, setStatus] = useState("")
  const [note, setNote] = useState("")
  const [fileName, setFileName] = useState("")

  const openModal = (complaint) => {
    setModalComplaint(complaint)
    setStatus(complaint.status)
    setNote(complaint.resolutionNote || "")
    setFileName("")
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === modalComplaint.id ? { ...c, status, resolutionNote: note } : c,
      ),
    )
    setModalComplaint(null)
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-foreground">Assigned Complaints</h1>

      <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-slate-50 text-muted">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Department</th>
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
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openModal(c)}
                    className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
            {complaints.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  No complaints assigned yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {modalComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Update Complaint</h2>
              <button onClick={() => setModalComplaint(null)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <p className="mb-4 text-sm text-muted">
              {modalComplaint.id} — {modalComplaint.title}
            </p>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Resolution Note</label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Describe the resolution"
                  className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Resolution Image</label>
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-3 text-sm text-muted hover:border-primary">
                  <Upload size={18} />
                  <span>{fileName || "Click to upload an image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                  />
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  Save
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
