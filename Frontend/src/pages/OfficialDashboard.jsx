import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Upload, X, Palmtree, CheckCircle2, Power } from "lucide-react"
import { STATUSES } from "../data/mockData.js"
import StatusBadge from "../components/StatusBadge.jsx"
import { getAllOfficialComplain, updateComplainStatus, updateLeaveStatusApi, getOfficialProfileApi } from "../Services/operation/officialAPI.jsx"

export default function OfficialDashboard() {
  // Show complaints that have been assigned to an official (mock: all assigned ones).
  const [complaints, setComplaints] = useState([]);
  const [modalComplaint, setModalComplaint] = useState(null)
  const [status, setStatus] = useState("")
  const [note, setNote] = useState("")
  const [file, setFile] = useState(null)
  const [officialProfile, setOfficialProfile] = useState(null)
  const [leaveStatus, setLeaveStatus] = useState("AVAILABLE")
  const [loadingLeave, setLoadingLeave] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllOfficialComplain();
      if (response) setComplaints(response);

      const profile = await getOfficialProfileApi();
      if (profile) {
        setOfficialProfile(profile);
        setLeaveStatus(profile.leaveStatus || "AVAILABLE");
      }
    }
    fetchData();
  }, []);

  const handleLeaveToggle = async () => {
    setLoadingLeave(true);
    const result = await updateLeaveStatusApi();
    if (result && result.leaveStatus) {
      setLeaveStatus(result.leaveStatus);
    }
    setLoadingLeave(false);
  }

  const openModal = (complaint) => {
    setModalComplaint(complaint)
    setStatus(complaint.status)
    setNote(complaint.resolutionNote || "")
    setFile("");
  }

  const handleUpdate = async (e) => {
      e.preventDefault();

      const formData = new FormData();

      formData.append("complainId", modalComplaint._id);
      formData.append("currentStatus", status);
      formData.append("resolutionNote", note);

      if (file) {
        formData.append("resolutionImage", file);
      }

      // Call your API
      await updateComplainStatus(formData);


        // Refresh complaints
        const updated = await getAllOfficialComplain();
        setComplaints(updated);

        setModalComplaint(null);
        setFile(null);
        setNote("");
        setStatus("");
  
    };

  return (
    <div>
      {/* Header & Leave Status Toggle */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assigned Complaints</h1>
          <p className="text-sm text-muted">
            {officialProfile ? `${officialProfile.name} (${officialProfile.department?.name || 'Official'})` : 'Official Portal'}
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-lg border border-border/80 bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">Duty Status:</span>
            {leaveStatus === "ON_LEAVE" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 border border-amber-300">
                <Palmtree size={14} /> On Leave
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 border border-emerald-300">
                <CheckCircle2 size={14} /> Available
              </span>
            )}
          </div>

          <button
            onClick={handleLeaveToggle}
            disabled={loadingLeave}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors shadow-xs ${
              leaveStatus === "ON_LEAVE"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-amber-600 hover:bg-amber-700 text-white"
            } ${loadingLeave ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Power size={14} />
            {leaveStatus === "ON_LEAVE" ? "Mark Available" : "Mark On Leave"}
          </button>
        </div>
      </div>

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
            {complaints.length > 0 && complaints.map((c) => (
              <tr key={c._id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link to={`/complaints/${c._id}`} className="font-medium text-primary hover:underline">
                    {c._id}
                  </Link>
                </td>
                <td className="px-4 py-3">{c.title}</td>
                <td className="px-4 py-3">{c?.department?.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3">
                  {
                    c.status !== "RESOLVED"?(
                      <button
                    onClick={() => openModal(c)}
                    className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
                  >
                    Update Status
                  </button>
                    ):(
                      <button
                       className="rounded-md  bg-primary px-3 py-1 text-xs font-medium text-primary-foreground ">
                        Completed
                      </button>
                    )
                  }
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
              {modalComplaint._id} — {modalComplaint.title}
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
                  <span>{file?.name || "Click to upload an image"}</span>
                  <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        if (selectedFile) {
                          setFile(selectedFile);
                        }
                      }}
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
