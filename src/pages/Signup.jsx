import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Building2 } from "lucide-react"
import { signUp } from "../Services/operation/authAPI.jsx"
import { Eye, EyeOff } from "lucide-react"
export default function Signup() {
  
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Citizen")
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const handleSubmit = async (e) => {
    e.preventDefault()
    await signUp(name, email, password, confirmPassword, role, navigate);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Building2 className="mb-2 text-primary" size={36} />
          <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-sm text-muted">Register to file and track complaints</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Citizen"
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-border px-3 py-2 pr-10 text-sm outline-none focus:border-primary"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>
           <div>
              <label className="mb-1 block text-sm font-medium">
                ConfirmPassword
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-border px-3 py-2 pr-10 text-sm outline-none focus:border-primary"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="Citizen">Citizen</option>
              <option value="Official">Official</option>
            </select>
          </div>
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
