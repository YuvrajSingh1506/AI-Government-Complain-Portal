import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Menu, X, Building2, LogOut } from "lucide-react"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return null

  const dashboardPath =
    user.role === "Admin"
      ? "/admin"
      : user.role === "Official"
        ? "/official"
        : "/dashboard"

  const links = [{ to: dashboardPath, label: "Dashboard" }]
  if (user.role === "Citizen") {
    links.push({ to: "/dashboard", label: "Complaints" })
    links.push({ to: "/create", label: "Create Complaint" })
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
     setOpen(false);
    navigate("/login")
  }

  const isActive = (to) => location.pathname === to

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to={dashboardPath} className="flex items-center gap-2 font-bold text-primary">
          <Building2 size={22} />
          <span>GovComplaints</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-2 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                isActive(l.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-slate-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="flex flex-col gap-1 border-t border-border px-4 py-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                isActive(l.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-slate-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  )
}
