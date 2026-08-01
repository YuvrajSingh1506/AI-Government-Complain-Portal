import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Upload, X } from "lucide-react"
import { STATUSES } from "../data/mockData.js"
import StatusBadge from "../components/StatusBadge.jsx"
import { getAllOfficialComplain, updateComplainStatus } from "../Services/operation/officialAPI.jsx"

export default function OfficialDashboard() {
  // Show complaints that have been assigned to an official (mock: all assigned ones).
  const [complaints, setComplaints] = useState([]);
  const [modalComplaint, setModalComplaint] = useState(null)
  const [status, setStatus] = useState("")
  const [note, setNote] = useState("")
  const [file, setFile] = useState(null)
  useEffect(()=>{
      const fetchAllComplaints = async()=>{
          const response = await getAllOfficialComplain();
          console.log(response);
          setComplaints(response);
      }
      fetchAllComplaints();
  },[]);
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
