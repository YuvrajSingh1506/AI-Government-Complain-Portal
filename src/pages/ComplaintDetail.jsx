import { useParams, Link, useNavigation, useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, Calendar, Building, User, Trash2 } from "lucide-react"
import { complaints } from "../data/mockData.js"
import StatusBadge from "../components/StatusBadge.jsx"
import { useEffect, useState } from "react";
import { deleteComplaintApi, getComplainDetail } from "../Services/operation/complainAPI.jsx";

export default function ComplaintDetail() {
  const { complainId } = useParams()
  const [complaint, setComplaint] = useState(null);
  const navigate = useNavigate();
  useEffect(()=>{
    const fetchComplaint = async()=>{
        const response = await getComplainDetail(complainId);
        if(response){
          setComplaint(response.data.complain);
        }
    }
    fetchComplaint();
  },[]);
  const handleDelete = async ()=>{
    await deleteComplaintApi(complainId);
    navigate("/dashboard");
  }
  if (!complaint) {
    return (
      <div className="text-center">
        <p className="text-muted">Complaint not found.</p>
        <Link to="/dashboard" className="mt-2 inline-block text-primary hover:underline">
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{complaint.title}</h1>
            <p className="text-sm text-muted">{complaint.id}</p>
          </div>
          <div className="flex items-center justify-center gap-3">
              <StatusBadge status={complaint.status} />
            <div className="mb-4 flex gap-3">
               {complaint.status === "PENDING" && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                    Delete Complaint
                  </button>
                )}
            </div>
          </div>
        </div>

        <img
          src={complaint.imageUrl || "/placeholder.svg"}
          alt={complaint.title}
          className="mb-4 h-64 rounded-md border border-border object-cover"
        />

        <p className="mb-4 text-foreground">{complaint.description}</p>

        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <Info icon={<MapPin size={16} />} label="Address" value={complaint.location.address} />
          <Info icon={<Calendar size={16} />} label="Created" value={complaint.createdAt} />
          <Info icon={<Building size={16} />} label="Department" value={complaint.department || "Not Alloated"} />
          <Info
            icon={<User size={16} />}
            label="Assigned Official"
            value={complaint.assignedOfficial || "Not assigned"}
          />
        </div>

        {/* Resolution section */}
        {(complaint.resolutionNote || complaint.resolutionImages.length > 0) && (
          <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4">
            <h2 className="mb-2 font-semibold text-green-800">Resolution</h2>
            {complaint.resolutionNote && (
              <p className="mb-3 text-sm text-green-900">{complaint.resolutionNote}</p>
            )}
            {complaint.resolutionImages.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {complaint.resolutionImages.map((img, i) => (
                  <img
                    key={i}
                    src={img || "/placeholder.svg"}
                    alt={`Resolution ${i + 1}`}
                    className="h-28 w-40 rounded-md border border-green-200 object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Info({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-border p-3">
      <span className="mt-0.5 text-muted">{icon}</span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
