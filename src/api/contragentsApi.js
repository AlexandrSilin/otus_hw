const API_URL = '/contragents';

async function request(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getContragents() {
  return request(API_URL);
}

export function createContragent(data) {
  const { id, ...payload } = data;

  return request(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export function updateContragent(data) {
  return request(`${API_URL}/${data.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function deleteContragent(id) {
  return request(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
}
