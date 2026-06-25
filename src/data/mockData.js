// Mock/dummy data for the Government Complaint Management System.
// Replace these with real API calls to your Express.js backend later.

export const STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"]

export const DEPARTMENTS = [
  "Public Works",
  "Sanitation",
  "Water Supply",
  "Electricity",
  "Roads & Transport",
]

export const OFFICIALS = [
  { id: "off-1", name: "Rajesh Kumar", department: "Public Works" },
  { id: "off-2", name: "Anita Sharma", department: "Sanitation" },
  { id: "off-3", name: "David Mendez", department: "Water Supply" },
  { id: "off-4", name: "Priya Nair", department: "Electricity" },
]

export const complaints = [
  {
    id: "CMP-1001",
    title: "Large pothole on Main Street",
    description:
      "There is a deep pothole near the Main Street junction causing traffic and accidents during rain.",
    address: "Main Street, Sector 12, Springfield",
    status: "In Progress",
    department: "Roads & Transport",
    assignedOfficial: "Rajesh Kumar",
    citizen: "John Citizen",
    createdAt: "2026-06-10",
    image: "/placeholder.svg?height=320&width=480",
    resolutionNote: "",
    resolutionImages: [],
  },
  {
    id: "CMP-1002",
    title: "Overflowing garbage bins",
    description:
      "Garbage bins in the market area have not been cleared for over a week and are overflowing.",
    address: "Market Road, Sector 4, Springfield",
    status: "Pending",
    department: "Sanitation",
    assignedOfficial: "",
    citizen: "John Citizen",
    createdAt: "2026-06-14",
    image: "/placeholder.svg?height=320&width=480",
    resolutionNote: "",
    resolutionImages: [],
  },
  {
    id: "CMP-1003",
    title: "Street light not working",
    description:
      "The street light near the park entrance has been off for two weeks, making the area unsafe at night.",
    address: "Park Avenue, Sector 8, Springfield",
    status: "Resolved",
    department: "Electricity",
    assignedOfficial: "Priya Nair",
    citizen: "John Citizen",
    createdAt: "2026-05-28",
    image: "/placeholder.svg?height=320&width=480",
    resolutionNote: "Replaced the faulty light fixture and tested the circuit. Working normally now.",
    resolutionImages: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
  },
  {
    id: "CMP-1004",
    title: "Low water pressure in residential area",
    description:
      "Households in Sector 15 are receiving very low water pressure during morning hours.",
    address: "Green Colony, Sector 15, Springfield",
    status: "Pending",
    department: "Water Supply",
    assignedOfficial: "",
    citizen: "John Citizen",
    createdAt: "2026-06-16",
    image: "/placeholder.svg?height=320&width=480",
    resolutionNote: "",
    resolutionImages: [],
  },
]
