import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Upload } from "lucide-react"
import { createComplainApi } from "../Services/operation/complainAPI"
import toast from "react-hot-toast"
export default function CreateComplaint() {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [fileName, setFileName] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  useEffect(()=>{
    getLocation();
  },[]);
  const getLocation = ()=>{
    if(!navigator.geolocation){
      toast.error("Geolocation is not supported");
        return;
    }
    navigator.geolocation.getCurrentPosition(
      (position)=>{
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
      console.log(error);
      toast.error("Unable to fetch location");
      }
    )
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    // Mock submission only — wire this up to your Express backend later.
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("image", fileName);
    formData.append("latitude",latitude);
    formData.append("longitude",longitude);
    const response = await createComplainApi(formData);
    if(response){
      navigate("/dashboard")
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Create Complaint</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief title of the issue"
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem in detail"
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Location of the issue"
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Image Upload</label>
          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border px-3 py-3 text-sm text-muted hover:border-primary">
            <Upload size={18} />
            <span>{fileName?.name || "Click to upload an image"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e)=>{
                const file = e.target.files[0];
                if(file){
                  setFileName(file);
                  setImagePreview(URL.createObjectURL(file))
                }
              }}
            />
          </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-3 h-64  rounded-md border object-cover"
              />
            )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
