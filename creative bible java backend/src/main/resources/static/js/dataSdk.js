const API_BASE_URL = window.API_BASE_URL || '';
console.log('dataSdk.js loaded', { API_BASE_URL, dataSdk: window.dataSdk });

function sdkApiFetch(route, options) {
  const url = API_BASE_URL ? `${API_BASE_URL}${route}` : route;
  return fetch(url, options);
}

function sdkDebugLog(msg, data) {
  if (window.debugLog && typeof window.debugLog === 'function') {
    window.debugLog(msg, data);
  } else {
    console.log(`[CREATIVE BIBLE SDK] ${msg}`, data || '');
  }
}

window.dataSdk = {
  async init(handler) {
    try {
      const response = await sdkApiFetch('/api/records');
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      handler.onDataChanged(data);
      return { isOk: true };
    } catch (error) {
      sdkDebugLog('init - ERROR:', error);
      if (handler && typeof handler.onDataChanged === 'function') {
        handler.onDataChanged([]);
      }
      return { isOk: false };
    }
  },

  async create(payload) {
    try {
      sdkDebugLog('create - Payload:', payload);
      const response = await sdkApiFetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      sdkDebugLog('create - Response status:', response.status);
      const data = await response.json();
      sdkDebugLog('create - Response data:', data);
      return { isOk: response.ok, data };
    } catch (error) {
      sdkDebugLog('create - ERROR:', error);
      return { isOk: false, error };
    }
  },

  async update(payload) {
    sdkDebugLog('update - Payload:', payload);
    return this.create(payload);
  },

  async bulkCreate(payload) {
    try {
      sdkDebugLog('BULK CREATE - Raw payload:', payload);
      const payloadArray = Array.isArray(payload) ? payload : [payload];
      sdkDebugLog('BULK CREATE - Ensured as array:', payloadArray);
      const jsonString = JSON.stringify(payloadArray);
      sdkDebugLog('BULK CREATE - JSON string:', jsonString);
      const response = await sdkApiFetch('/api/records/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonString
      });
      sdkDebugLog('BULK CREATE - Response status:', response.status);
      const data = await response.json();
      sdkDebugLog('BULK CREATE - Response data:', data);
      return { isOk: response.ok, data };
    } catch (error) {
      sdkDebugLog('BULK CREATE - ERROR:', error);
      return { isOk: false, error };
    }
  },

  async delete(payload) {
    try {
      sdkDebugLog('delete - Payload:', payload);
      const response = await sdkApiFetch('/api/records', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      sdkDebugLog('delete - Response status:', response.status);
      const data = await response.json();
      sdkDebugLog('delete - Response data:', data);
      return { isOk: response.ok, data };
    } catch (error) {
      sdkDebugLog('delete - ERROR:', error);
      return { isOk: false, error };
    }
  }
};
