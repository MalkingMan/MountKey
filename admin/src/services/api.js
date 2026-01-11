/**
 * MountKey Admin - API Service
 * Centralized API calls for admin panel
 */

const API_BASE = '/api';

// Get auth token from localStorage
function getToken() {
    return localStorage.getItem('adminToken');
}

// Base fetch with auth
async function fetchWithAuth(url, options = {}) {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }

    return data;
}

// ============================================================
// ADMIN AUTH (SEPARATE FROM USER AUTH!)
// ============================================================

export async function login(email, password) {
    const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    // Handle non-JSON response (e.g., server crash or empty body)
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server Error (${response.status}): ${text || 'Empty response'}`);
    }

    try {
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    } catch (err) {
        throw new Error(`Failed to parse response: ${err.message}`);
    }
}

export async function register(name, email, password) {
    const response = await fetch(`${API_BASE}/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
    }

    return data;
}

// ============================================================
// MOUNTAINS
// ============================================================

export async function getMountains(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/admin/mountains${query ? `?${query}` : ''}`);
}

export async function getMountain(id) {
    return fetchWithAuth(`/admin/mountains/${id}`);
}

export async function createMountain(data) {
    return fetchWithAuth('/admin/mountains', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateMountain(id, data) {
    return fetchWithAuth(`/admin/mountains/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteMountain(id) {
    return fetchWithAuth(`/admin/mountains/${id}`, {
        method: 'DELETE',
    });
}

// ============================================================
// TRAILS
// ============================================================

export async function getTrails(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/admin/trails${query ? `?${query}` : ''}`);
}

export async function getTrail(id) {
    return fetchWithAuth(`/admin/trails/${id}`);
}

export async function createTrail(data) {
    return fetchWithAuth('/admin/trails', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

export async function updateTrail(id, data) {
    return fetchWithAuth(`/admin/trails/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

export async function deleteTrail(id) {
    return fetchWithAuth(`/admin/trails/${id}`, {
        method: 'DELETE',
    });
}

// ============================================================
// WEATHER META
// ============================================================

export const getWeatherMeta = (mountainId) => fetchWithAuth(`/admin/weather-meta/${mountainId}`);
export const updateWeatherMeta = (mountainId, data) => fetchWithAuth(`/admin/weather-meta/${mountainId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
});

// ============================================================
// DASHBOARD STATS
// ============================================================

export async function getDashboardStats() {
    return fetchWithAuth('/admin/stats');
}

// ============================================================
// USERS & API KEYS
// ============================================================

export async function getUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return fetchWithAuth(`/admin/users${query ? `?${query}` : ''}`);
}

export async function getUser(id) {
    return fetchWithAuth(`/admin/users/${id}`);
}

export async function updateUserStatus(userId, status) {
    return fetchWithAuth(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

export async function revokeApiKey(userId, keyId) {
    return fetchWithAuth(`/admin/users/${userId}/api-keys/${keyId}/revoke`, {
        method: 'PUT',
    });
}

export async function extendApiKey(userId, keyId, days) {
    return fetchWithAuth(`/admin/users/${userId}/api-keys/${keyId}/extend`, {
        method: 'PUT',
        body: JSON.stringify({ days }),
    });
}
