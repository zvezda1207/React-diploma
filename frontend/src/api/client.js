const API_BASE_URL = 'http://localhost:7070';

async function request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Server error');
    }

    // Проверяем, есть ли контент в ответе
    const contentType = response.headers.get('content-type');
    const text = await response.text();

    // Если ответ пустой, возвращаем пустой объект
    if (!text.trim()) {
        return {};
    }

    // Если не JSON, возвращаем пустой объект
    if (!contentType?.includes('application/json')) {
        return {};
    }

    // Пытаемся распарсить JSON
    try {
        return JSON.parse(text);
    } catch (e) {
        // Если не удалось распарсить, возвращаем пустой объект
        return {};
    }
}

export function getTopSales() {
    return request('/api/top-sales');
}

export function getCategories() {
    return request('/api/categories');
}

export function getItems(params = {}) {
    const query = new URLSearchParams(params);
    return request(`/api/items?${query.toString()}`);
}

export function getItem(id) {
    return request(`/api/items/${id}`);
}

export function postOrder(body) {
    return request('/api/order', {
        method: 'POST',
        body: JSON.stringify(body),
    });
}