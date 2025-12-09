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
    FORGOT_PASSWORD: `${environment.apiUrl}${API_VERSION}/auth/forgot-password`,
    VERIFY_OTP: `${environment.apiUrl}${API_VERSION}/auth/verify-otp`,
    RESET_PASSWORD: `${environment.apiUrl}${API_VERSION}/auth/reset-password`,
  },

  // ============== USER ==============
  USER: {
  },

  // ============== ADMIN ==============
  ADMIN: {
    DASHBOARD: `${environment.apiUrl}${API_VERSION}/admin/analytics/dashboard`,
    LINKS: `${environment.apiUrl}${API_VERSION}/short-link`,
    CHART7DAYSCLICK: `${environment.apiUrl}${API_VERSION}/admin/analytics/chart/7days`,
    CHART7DAYSLINK: `${environment.apiUrl}${API_VERSION}/admin/analytics/chart/7days/link-created`,
    TOPLINKS: `${environment.apiUrl}${API_VERSION}/admin/analytics/top-links`,
    LINKDETAILS: (shortCode: String) =>
      `${environment.apiUrl}${API_VERSION}/admin/analytics/link/${shortCode}`,
    GET_USERS: `${environment.apiUrl}${API_VERSION}/users`,
  },

  HEALTH: {
    CHECK: `${environment.apiUrl}/actuator/health`,
  }
} as const;
