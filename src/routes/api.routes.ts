// src/routes/api.routes.ts

export const API_ROUTES = {
  AUTH: {
    BASE: 'auth',
    LOGIN: 'login',
    SIGNUP: 'signup',
    ME: 'me',
  },

  USERS: {
    BASE: 'users',
    CREATE: 'create',
    LIST: '',
  },

  DEPARTMENTS: {
    BASE: 'departments',
    CREATE: '',
    LIST: '',
  },

  TEAMS: {
    BASE: 'teams',
    CREATE: '',
    ADD_MEMBERS: ':teamId/members',
  },

  ORGANIZATIONS: {
    BASE: 'organizations',
    ACTIVATE: ':id/activate',
    DEACTIVATE: ':id/deactivate',
  },
} as const;
