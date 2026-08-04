// API Client for DigiKheti Backend
// Replaces Supabase client with REST API calls

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get authentication token from localStorage
 */
const getToken = () => {
    return localStorage.getItem('digikheti_token');
};

/**
 * Save authentication token to localStorage
 */
export const saveToken = (token) => {
    localStorage.setItem('digikheti_token', token);
};

/**
 * Remove authentication token from localStorage
 */
export const removeToken = () => {
    localStorage.removeItem('digikheti_token');
};

/**
 * Main API request handler
 */
const request = async (endpoint, options = {}) => {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Server error: Invalid response format');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

/**
 * API client with method helpers
 */
export const api = {
    // GET request
    get: (endpoint) => {
        return request(endpoint, { method: 'GET' });
    },

    // POST request
    post: (endpoint, data) => {
        return request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // PUT request
    put: (endpoint, data) => {
        return request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // DELETE request
    delete: (endpoint) => {
        return request(endpoint, {
            method: 'DELETE',
        });
    },
};

/**
 * Auth API methods
 */
export const authAPI = {
    register: async (email, password) => {
        const data = await api.post('/auth/register', { email, password });
        if (data.token) {
            saveToken(data.token);
        }
        return data;
    },

    login: async (email, password) => {
        const data = await api.post('/auth/login', { email, password });
        if (data.token) {
            saveToken(data.token);
        }
        return data;
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            removeToken();
        }
    },

    me: async () => {
        return await api.get('/auth/me');
    },

    getUser: async () => {
        const data = await api.get('/auth/me');
        return { user: data.user, profile: data.profile };
    },

    forgotPassword: async (email) => {
        return await api.post('/auth/forgot-password', { email });
    },

    resetPassword: async (token, newPassword) => {
        return await api.post('/auth/reset-password', { token, newPassword });
    },
};

/**
 * Profile API methods
 */
export const profileAPI = {
    get: async () => {
        return await api.get('/profile');
    },

    create: async (profileData) => {
        return await api.post('/profile', profileData);
    },

    update: async (profileData) => {
        return await api.put('/profile', profileData);
    },
};

/**
 * Crops API methods
 */
export const cropsAPI = {
    getAll: async (season = null) => {
        const endpoint = season ? `/crops?season=${season}` : '/crops';
        return await api.get(endpoint);
    },

    getById: async (id) => {
        return await api.get(`/crops/${id}`);
    },

    getSuggestions: async (soilType, location, state, district) => {
        return await api.post('/crops/suggestions', { soilType, location, state, district });
    },
};

/**
 * Journal API methods
 */
export const journalAPI = {
    getAll: async () => {
        return await api.get('/journal');
    },

    create: async (entryData) => {
        return await api.post('/journal', entryData);
    },

    update: async (id, entryData) => {
        return await api.put(`/journal/${id}`, entryData);
    },

    delete: async (id) => {
        return await api.delete(`/journal/${id}`);
    },
};

/**
 * Alerts API methods
 */
export const alertsAPI = {
    getAll: async (isRead = null) => {
        const endpoint = isRead !== null ? `/alerts?isRead=${isRead}` : '/alerts';
        return await api.get(endpoint);
    },

    create: async (alertData) => {
        return await api.post('/alerts', alertData);
    },

    update: async (id, alertData) => {
        return await api.put(`/alerts/${id}`, alertData);
    },
};

/**
 * Advisories API methods
 */
export const advisoriesAPI = {
    getAll: async (advisoryType = null) => {
        const endpoint = advisoryType ? `/advisories?advisoryType=${advisoryType}` : '/advisories';
        return await api.get(endpoint);
    },

    create: async (advisoryData) => {
        return await api.post('/advisories', advisoryData);
    },
};

/**
 * Chat API method
 */
export const chatAPI = {
    send: async (message) => {
        return await api.post('/chat', { message });
    },
};

/**
 * Weather API method
 */
export const weatherAPI = {
    get: async (location, pincode) => {
        return await api.post('/weather', { location, pincode });
    },
};

/**
 * MSP (Minimum Support Price) API methods
 */
export const mspAPI = {
    // Get latest MSP for all crops (widget data)
    getWidget: async () => {
        return await api.get('/msp/widget');
    },

    // Get list of crops for a season
    getCropsBySeason: async (season) => {
        return await api.get(`/msp/crops/${season}`);
    },

    // Get historical price trend for a specific crop
    getCropHistory: async (season, crop) => {
        return await api.get(`/msp/${season}/${crop}`);
    },

    // Trigger data sync from data.gov.in
    sync: async () => {
        return await api.post('/msp/sync');
    },
};

/**
 * Government Schemes Discovery API methods
 */
export const schemesAPI = {
    // List schemes with optional filters
    list: async (state = null, category = null) => {
        let endpoint = '/discover/schemes';
        const params = [];
        if (state) params.push(`state=${encodeURIComponent(state)}`);
        if (category) params.push(`category=${encodeURIComponent(category)}`);
        if (params.length > 0) endpoint += '?' + params.join('&');
        return await api.get(endpoint);
    },

    // Get scheme categories
    getCategories: async () => {
        return await api.get('/discover/categories');
    },

    // Get AI-generated summary for a specific scheme
    getSummary: async (schemeId) => {
        return await api.get(`/schemes/${schemeId}/summary`);
    },

    // Clear summary cache (admin)
    clearCache: async () => {
        return await api.post('/discover/clear-cache');
    },
};

export default api;


