const API_BASE = '/api';

async function request(path, options = {}) {
    const url = `${API_BASE}${path}`;
    const config = {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    };
    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
        config.body = JSON.stringify(config.body);
    }

    let res;
    try {
        res = await fetch(url, config);
    } catch (err) {
        throw new Error('Network error: Unable to connect to the server.');
    }

    const contentType = res.headers.get('content-type') || '';
    const contentLength = res.headers.get('content-length');
    const isEmpty = res.status === 204 || contentLength === '0' || (contentType && !contentType.includes('application/json'));

    if (isEmpty) {
        if (!res.ok) {
            const err = new Error(`Request failed with status ${res.status}`);
            err.status = res.status;
            throw err;
        }
        return null;
    }

    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error('Invalid response from server.');
    }

    if (!res.ok) {
        const err = new Error(data?.error || `Request failed with status ${res.status}`);
        err.status = res.status;
        throw err;
    }

    if (!data) {
        throw new Error('Empty response from server.');
    }

    return data;
}

export const api = {
    getTests: () => request('/tests'),
    getTest: (id) => request(`/tests/${id}`),
    getCases: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return request(`/cases${qs ? `?${qs}` : ''}`);
    },
    getCase: (id) => request(`/cases/${id}`),
    createCase: (body) => request('/cases', { method: 'POST', body }),
    updateCaseStatus: (id, status) => request(`/cases/${id}/status`, { method: 'PATCH', body: { status } }),
    getClusters: () => request('/clusters'),
    getRiskPreview: (body) => request('/risk-score/preview', { method: 'POST', body }),
    getConfig: () => request('/config'),
    updateConfig: (body) => request('/config', { method: 'POST', body }),
    resetDemo: () => request('/reset-demo', { method: 'POST' }),
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            const err = new Error(data?.error || `Upload failed with status ${res.status}`);
            err.status = res.status;
            throw err;
        }
        if (!data || !data.success) {
            throw new Error(data?.error || 'Upload failed.');
        }
        return data;
    },
};
