const API_URL = `${import.meta.env.VITE_API_URL}/api`;

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed (${response.status})`
    );
  }

  return data;
}

export async function getBusiness() {
  return apiRequest("/business");
}

export async function saveBusiness(payload) {
  return apiRequest("/business", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}