import {environment} from '../../environments/environment';

export const API_URLS = {
  // ============== SHORT LINK ==============
  SHORT_LINK: {
    CREATE: `${environment.apiUrl}/short-link/create`,
    MY_LINKS: `${environment.apiUrl}/short-link/my-links`,
    REDIRECT: (code: string) => `${environment.apiUrl}/short-link/${code}`,
  },

  // ============== AUTH ==============
  AUTH: {
    LOGIN: `${environment.apiUrl}/auth/login`,
    REGISTER: `${environment.apiUrl}/auth/register`,
    LOGOUT: `${environment.apiUrl}/auth/logout`,
    REFRESH_TOKEN: `${environment.apiUrl}/auth/refresh`,
  },

  // ============== USER ==============
  USER: {
  },

  // ============== ADMIN ==============
  ADMIN: {
    DASHBOARD: `${environment.apiUrl}/admin/dashboard`,
  }
} as const;
