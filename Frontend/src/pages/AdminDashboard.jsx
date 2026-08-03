  import { useEffect, useState, useMemo } from "react"
  import { Link } from "react-router-dom"
  import { FileText, Clock, CheckCircle, Loader, X, AlertTriangle, Building, Filter, Bot, Sparkles } from "lucide-react"
  import StatusBadge from "../components/StatusBadge.jsx"
  import PriorityBadge from "../components/PriorityBadge.jsx"
  import { assignComplainAPI, getAllComplainsAPI, getDashboardDataAPI, rejectComplainAPI } from "../Services/operation/complainAdminAPI.jsx"

  const PRIORITY_ORDER = {
    CRITICAL: 1,
    HIGH: 2,
    MEDIUM: 3,
    LOW: 4,
  }

  const getPriorityWeight = (priority) => {
    if (!priority) return 5
    return PRIORITY_ORDER[String(priority).toUpperCase()] || 5
  }

  export default function AdminDashboard() {
    const [complaints, setComplaints] = useState([])
    const [modalComplaint, setModalComplaint] = useState(null)
    const [rejectModalComplaint, setRejectModalComplaint] = useState(null)
    const [rejectionReason, setRejectionReason] = useState("")
    const [official, setOfficial] = useState("")
    const [department, setDepartment] = useState("")
    const [officials, setOfficials] = useState([])
    const [departments, setDepartments] = useState([])
    const [complain, setComplain] = useState("")
    const [selectedPriority, setSelectedPriority] = useState("ALL")

    const fetchAllComplaints = async () => {
      const response = await getAllComplainsAPI()
      if (response?.data?.complains) {
        setComplaints(response.data.complains)
      }
    }

    useEffect(() => {
      const fetchAllData = async () => {
        const response = await getDashboardDataAPI()
        if (response?.data?.dashboard) {
          setOfficials(response.data.dashboard.totalOfficial || [])
          setDepartments(response.data.dashboard.totalDepartment || [])
        }
      }
      fetchAllComplaints()
      fetchAllData()
    }, [])

    const filteredComplaints = useMemo(() => {
      let list = [...complaints]

      // Sort by Priority urgency first (CRITICAL > HIGH > MEDIUM > LOW)
      list.sort((a, b) => getPriorityWeight(a.priority) - getPriorityWeight(b.priority))

      if (selectedPriority !== "ALL") {
        list = list.filter((c) => String(c.priority).toUpperCase() === selectedPriority)
      }

      return list
    }, [complaints, selectedPriority])

    const priorityCounts = useMemo(() => {
      return {
        ALL: complaints.length,
        CRITICAL: complaints.filter((c) => String(c.priority).toUpperCase() === "CRITICAL").length,
        HIGH: complaints.filter((c) => String(c.priority).toUpperCase() === "HIGH").length,
        MEDIUM: complaints.filter((c) => String(c.priority).toUpperCase() === "MEDIUM").length,
        LOW: complaints.filter((c) => String(c.priority).toUpperCase() === "LOW").length,
      }
    }, [complaints])

    const stats = [
      { label: "Total Complaints", value: complaints.length, icon: <FileText size={20} />, color: "text-blue-600" },
      {
        label: "Critical Priority",
        value: priorityCounts.CRITICAL,
        icon: <AlertTriangle size={20} />,
        color: "text-red-600",
      },
      {
        label: "Pending Action",
        value: complaints.filter((c) => c.status === "PENDING").length,
        icon: <Clock size={20} />,
        color: "text-amber-600",
      },
      {
        label: "Resolved",
        value: complaints.filter((c) => c.status === "RESOLVED").length,
        icon: <CheckCircle size={20} />,
        color: "text-green-600",
      },
    ]

    const openModal = (complaint) => {
      setModalComplaint(complaint)
      setComplain(complaint._id)
      setOfficial(complaint.assignedOfficial?._id || complaint.assignedOfficial || "")
      setDepartment(complaint.department?._id || complaint.department || "")
    }

    const openRejectModal = (complaint) => {
      setRejectModalComplaint(complaint)
      setRejectionReason("")
    }

    const handleAssign = async (e) => {
      e.preventDefault()
      await assignComplainAPI(complain, department)
      setModalComplaint(null)
      fetchAllComplaints()
    }

    const handleReject = async (e) => {
      e.preventDefault()
      if (!rejectionReason.trim()) return
      await rejectComplainAPI(rejectModalComplaint._id, rejectionReason)
      setRejectModalComplaint(null)
      fetchAllComplaints()
    }

    const filteredOfficials = useMemo(() => {
      if (!department) return officials
      return officials.filter((o) => {
        const officialDeptId = o?.department?._id || o?.department
        return String(officialDeptId) === String(department)
      })
    }, [officials, department])

    return (
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted">Manage complaints by priority & AI-assigned departments</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className={`mb-2 ${s.color}`}>{s.icon}</div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Priority Filter Bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Filter size={16} className="text-primary" /> Filter by Priority:
          </div>
          <div className="flex flex-wrap gap-2">
            {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((p) => {
              const isActive = selectedPriority === p
              let activeColor = "bg-primary text-primary-foreground"
              if (p === "CRITICAL" && isActive) activeColor = "bg-red-600 text-white"
              if (p === "HIGH" && isActive) activeColor = "bg-orange-600 text-white"
              if (p === "MEDIUM" && isActive) activeColor = "bg-yellow-600 text-white"
              if (p === "LOW" && isActive) activeColor = "bg-slate-700 text-white"

              return (
                <button
                  key={p}
                  onClick={() => setSelectedPriority(p)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? `${activeColor} shadow-sm`
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{p === "ALL" ? "All Priorities" : p}</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-800"}`}>
                    {priorityCounts[p] || 0}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-slate-50 text-muted">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Priority (AI)</th>
                <th className="px-4 py-3">Department (AI)</th>
                <th className="px-4 py-3">Official</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((c) => (
                  <tr key={c._id} className="border-b border-border last:border-0 hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <Link to={`/complaints/${c._id}`} className="font-mono text-xs font-medium text-primary hover:underline">
                        {c._id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{c.title}</td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="px-4 py-3">
                      {c?.department?.name ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800">
                          <Building size={13} className="text-slate-400" />
                          {c.department.name}
                        </span>
                      ) : (
                        <span className="text-xs text-muted italic">Unassigned</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">{c?.assignedOfficial?.name || "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      {c.status === "REJECTED" ? (
                        <span className="text-xs font-medium text-red-600 italic">Rejected</span>
                      ) : (
                        <>
                          <button
                            onClick={() => openModal(c)}
                            className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
                          >
                            {c.status === "PENDING" ? "Assign" : "Reassign"}
                          </button>
                          {c.status === "PENDING" && (
                            <button
                              onClick={() => openRejectModal(c)}
                              className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted">
                    No complaints found for the selected priority filter.
                  </td>
                </tr>
              )}
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
              
              <div className="mb-4 rounded-md border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-mono text-muted mb-1">{modalComplaint._id}</p>
                <p className="font-semibold text-sm text-foreground mb-2">{modalComplaint.title}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted">Priority:</span>
                  <PriorityBadge priority={modalComplaint.priority} />
                </div>
                {modalComplaint?.department?.name && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-1">
                    <Sparkles size={13} className="text-blue-500 shrink-0" />
                    <span>AI Selected Dept: <strong>{modalComplaint.department.name}</strong></span>
                  </div>
                )}
              </div>

              <form onSubmit={handleAssign} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Department</label>
                  <select
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value)
                      setOfficial("")
                    }}
                    className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Select department</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name} {modalComplaint?.department?._id === d._id ? "(AI Choice)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Official ({department ? "Filtered by Department" : "All Departments"})</label>
                  <select
                    value={official}
                    onChange={(e) => setOfficial(e.target.value)}
                    className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Select Official</option>
                    {filteredOfficials.map((o) => (
                      <option key={o._id} value={o._id}>
                        {o.name} ({o?.department?.name || "Official"})
                      </option>
                    ))}
                  </select>
                  {department && filteredOfficials.length === 0 && (
                    <p className="mt-1 text-xs text-amber-600">
                      No officials registered for this department yet.
                    </p>
                  )}
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    Confirm Assignment
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

        {/* Reject Modal */}
        {rejectModalComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                  <AlertTriangle size={18} /> Reject Complaint
                </h2>
                <button onClick={() => setRejectModalComplaint(null)} aria-label="Close">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-900">
                <p className="font-mono text-slate-500 mb-1">{rejectModalComplaint._id}</p>
                <p className="font-semibold text-sm text-foreground">{rejectModalComplaint.title}</p>
              </div>

              <form onSubmit={handleReject} className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Rejection Reason</label>
                  <textarea
                    required
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Specify why this complaint is being rejected..."
                    className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-red-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectModalComplaint(null)}
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
