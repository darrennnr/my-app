/** Client-side helper for calling backend APIs */

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string; details?: unknown };

async function request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      credentials: "include",
    });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      return { ok: false, error: json.error || res.statusText, details: json.details };
    }
    return { ok: true, data: json.data };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export const api = {
  login: (email: string, password: string) =>
    request<{ user: { id: string; email: string; name: string; nrp: string | null; roles: string[] } }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    ),

  logout: () => request("/api/auth/logout", { method: "POST" }),

  me: () =>
    request<{ user: { id: string; email: string; name: string; nrp: string | null; roles: string[]; permissions: string[] } }>(
      "/api/auth/me"
    ),

  tasks: {
    list: () => request<unknown[]>("/api/tasks"),
    create: (data: unknown) => request("/api/tasks", { method: "POST", body: JSON.stringify(data) }),
  },

  schedule: {
    list: () => request<unknown[]>("/api/schedule"),
    create: (data: unknown) => request("/api/schedule", { method: "POST", body: JSON.stringify(data) }),
  },

  // extend as more routes are added
};
