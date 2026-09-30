const API_URL = 'https://ieee-backend.com'.replace(/\/$/, '');
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || API_URL).replace(/\/$/, '');

export const buildApiUrl = (endpoint: string) => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return `${API_BASE_URL}${normalizedEndpoint}`;
};

export const adminApi = {
  getDashboardOverview: async () => {
    throw new Error('TODO: Add the dashboard overview endpoint from the API documentation and wire it to this helper.');
  },
  getCertificateRequests: async () => {
    throw new Error('TODO: Add the certificate requests endpoint from the API documentation and wire it to this helper.');
  },
  getIssuedCertificates: async () => {
    throw new Error('TODO: Add the issued certificates endpoint from the API documentation and wire it to this helper.');
  },
  getSupportTickets: async () => {
    throw new Error('TODO: Add the support tickets endpoint from the API documentation and wire it to this helper.');
  },
  submitCertificateRequest: async () => {
    throw new Error('TODO: Add the certificate request submission endpoint from the API documentation and wire it to this helper.');
  },
  updateTicketStatus: async () => {
    throw new Error('TODO: Add the ticket status update endpoint from the API documentation and wire it to this helper.');
  },
};
