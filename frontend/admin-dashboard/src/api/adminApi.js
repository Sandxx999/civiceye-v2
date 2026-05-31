import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 12000,
});

export async function getComplaints(filters = {}) {
  const { data } = await api.get("/admin/complaints", { params: filters });
  return data.data;
}

export async function getStats() {
  const { data } = await api.get("/admin/stats");
  return data.data;
}

export async function updateComplaintStatus(ticketId, status) {
  const { data } = await api.patch(`/admin/complaints/${ticketId}`, { status });
  return data.data;
}

