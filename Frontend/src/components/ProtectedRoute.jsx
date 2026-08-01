import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

export default function ProtectedRoute({ children }) {
  const  user  = localStorage.getItem("user");
  if (!user) return <Navigate to="/login" replace />
  return children
}
