import { Link } from "react-router-dom"
import { Plus } from "lucide-react"

import { useAuth } from "../context/AuthContext.jsx"
import ComplaintCard from "../components/ComplaintCard.jsx"
import { useEffect, useState } from "react"
import { getUserComplain } from "../Services/operation/complainAPI.jsx"

export default function CitizenDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [complaints, setComplaints] = useState([]);
  useEffect(() => {
    const fetchComplaints = async () => {
      const response = await getUserComplain();

      if (response) {
        setComplaints(response.data.allComplain);
      }
    };

    fetchComplaints();
  }, []); 
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Complaints</h1>
          <p className="text-sm text-muted">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus size={18} /> Create Complaint
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {complaints.map((c) => (
          <ComplaintCard key={c.id} complaint={c} />
        ))}
      </div>
    </div>
  )
}
