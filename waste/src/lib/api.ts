
const API_URL = "http://localhost:4000/api";

export const api = {
    auth: {
        signup: async (data: any) => {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Signup failed");
            }
            return res.json();
        },
        login: async (data: any) => {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Login failed");
            }
            return res.json();
        }
    },
    history: {
        get: async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/history`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            if (!res.ok) throw new Error("Failed to fetch history");
            return res.json();
        },
        create: async (data: any) => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/history`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create history");
            return res.json();
        }
    },
    admin: {
        getReports: async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/admin/reports`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            if (!res.ok) throw new Error("Failed to fetch admin reports");
            return res.json();
        }
    }
};
