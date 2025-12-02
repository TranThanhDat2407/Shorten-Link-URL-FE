import {environment} from '../../environments/environment';

const API_VERSION = '/api/v1';

export const API_URLS = {
  // ============== SHORT LINK ==============
  SHORT_LINK: {
    CREATE_PUBLIC: `${environment.apiUrl}${API_VERSION}/short-link/create/public`,
    CREATE: `${environment.apiUrl}${API_VERSION}/short-link/create`,
    MY_LINKS: `${environment.apiUrl}${API_VERSION}/short-link/my-links`,
    REDIRECT: (code: string) => `${environment.apiUrl}${API_VERSION}/short-link/${code}`,
    DELETE: (linkId: number) => `${environment.apiUrl}${API_VERSION}/short-link/${linkId}`,
    UPDATE: (linkId: number) => `${environment.apiUrl}${API_VERSION}/short-link/${linkId}`,
    DETAILS: (linkId: number) => `${environment.apiUrl}${API_VERSION}/short-link/details/${linkId}`,
    LOGS: (linkId: number) => `${environment.apiUrl}${API_VERSION}/short-link/${linkId}/logs`,
  },

  // ============== AUTH ==============
  AUTH: {
    LOGIN: `${environment.apiUrl}${API_VERSION}/auth/login`,
    REGISTER: `${environment.apiUrl}${API_VERSION}/auth/register`,
    LOGOUT: `${environment.apiUrl}${API_VERSION}/auth/logout`,
    REFRESH_TOKEN: `${environment.apiUrl}${API_VERSION}/auth/refresh`,
    GOOGLE_LOGIN: `${environment.apiUrl}/oauth2/authorization/google`,
  },

  // ============== USER ==============
  USER: {
  },

  // ============== ADMIN ==============
  ADMIN: {
    DASHBOARD: `${environment.apiUrl}${API_VERSION}/admin/dashboard`,
  }
} as const;
