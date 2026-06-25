import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import CitizenDashboard from "./pages/CitizenDashboard.jsx"
import CreateComplaint from "./pages/CreateComplaint.jsx"
import ComplaintDetail from "./pages/ComplaintDetail.jsx"
import AdminDashboard from "./pages/AdminDashboard.jsx"
import OfficialDashboard from "./pages/OfficialDashboard.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Layout from "./components/Layout.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <CitizenDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <Layout>
              <CreateComplaint />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaints/:complainId"
        element={
          <ProtectedRoute>
            <Layout>
              <ComplaintDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/official"
        element={
          <ProtectedRoute>
            <Layout>
              <OfficialDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
