import { createContext, useContext, useState } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // Mock login: pick a role based on email keyword for easy testing.
  const login = ({ email, role }) => {
    let resolvedRole = role
    if (!resolvedRole) {
      if (email.includes("admin")) resolvedRole = "Admin"
      else if (email.includes("official")) resolvedRole = "Official"
      else resolvedRole = "Citizen"
    }
    const newUser = {
      name: email.split("@")[0] || "User",
      email,
      role: resolvedRole,
    }
    setUser(newUser)
    return newUser
  }

  const signup = ({ name, email, role }) => {
    const newUser = { name, email, role: role || "Citizen" }
    setUser(newUser)
    return newUser
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
