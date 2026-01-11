// API Configuration
// Change this to match your backend API URL

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
    auth: {
        register: `${API_BASE_URL}/auth/register`,
        login: `${API_BASE_URL}/auth/login`,
    },
    apiKeys: {
        list: `${API_BASE_URL}/api-keys`,
        create: `${API_BASE_URL}/api-keys`,
        revoke: (id: number) => `${API_BASE_URL}/api-keys/${id}`,
    },
    // Public endpoints (NO API KEY REQUIRED)
    public: {
        mountains: {
            list: (params?: string) => `${API_BASE_URL}/public/mountains${params ? `?${params}` : ''}`,
            detail: (slug: string) => `${API_BASE_URL}/public/mountains/${slug}`,
        },
    },
    // Protected v1 API endpoints (REQUIRES API KEY)
    v1: {
        mountains: {
            list: (params?: string) => `${API_BASE_URL}/v1/mountains${params ? `?${params}` : ''}`,
            detail: (slug: string) => `${API_BASE_URL}/v1/mountains/${slug}`,
            trails: (slug: string) => `${API_BASE_URL}/v1/mountains/${slug}/trails`,
            weatherRisk: (slug: string) => `${API_BASE_URL}/v1/mountains/${slug}/weather-risk`,
        },
    },
};
