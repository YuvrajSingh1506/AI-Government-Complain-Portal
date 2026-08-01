import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { getAllDepartment } from "../Services/operation/departmentAPI";
import { signUp } from "../Services/operation/authAPI";

export default function CreateOfficial() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [allDepartment, setAllDepartment] = useState([]);
  useEffect(()=>{
    const fetchDepartment = async()=>{
        const response = await getAllDepartment();
        // console.log(response);
        setAllDepartment(response.data.departments);
    }
    fetchDepartment();
  },[]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({
      name,
      email,
      password,
      confirmPassword,
      department,
    });

    const response = await signUp(name,email,password,confirmPassword,"Official",department, navigate);

    navigate("/admin");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-bold text-foreground">
        Create Official
      </h1>

      <p className="mb-6 text-muted">
        Add a new government official to the system.
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm"
      >
        {/* Name */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Name
          </label>

          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Official Name"
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="official@example.com"
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Password */}
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
              placeholder="********"
              className="w-full rounded-md border border-border px-3 py-2 pr-10 text-sm outline-none focus:border-primary"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Confirm Password
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="********"
              className="w-full rounded-md border border-border px-3 py-2 pr-10 text-sm outline-none focus:border-primary"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Department
          </label>

          <select
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="">Select Department</option>

              {
                allDepartment.map((dept)=>(
                    <option value={dept._id} key={dept._id}>{dept.name}</option>
                ))
              }
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Create Official
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}