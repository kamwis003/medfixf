export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  UPDATE_PASSWORD: '/update-password',

  // Dashboard routes
  DASHBOARD: '/',

  // Account routes
  ACCOUNT: '/account',
  BILLING: '/billing',

  // Payment routes
  PAYMENT: {
    SUCCESS: '/payment-success',
    CANCELLED: '/payment-cancelled',
  },

  // Legal routes
  TERMS_OF_SERVICE: '/terms-of-service',
  PRIVACY_POLICY: '/privacy-policy',

  ENDOMETRIOSIS: {
    INFO: '/modules/endometriosis/endometriosis-info',
    DIARY: '/modules/endometriosis/endometriosis-diary',
    VISUALIZATION: '/modules/endometriosis/endometriosis-visualization',
    ADVICE: '/modules/endometriosis/endometriosis-advice',
    INFOEDITOR: '/modules/endometriosis/endometriosis-info/new',
  },

  FERTILITY: {
    CALENDAR: '/modules/fertility/cycle-calendar',
    TRACKING: '/modules/fertility/cycle-tracking',
    EDUCATION: '/modules/fertility/education',
    CONSULTATION: '/modules/consultation-request',
  },
  PATIENTS: {
    ROOT: '/modules/patients',
    DETAIL: (id: string) => `/modules/patients/${id}`,
  },
  REQUESTS: {
    MY: '/modules/my-requests',
    CLINIC: '/modules/clinic-requests',
  },
  // Products routes
  PRODUCTS: {
    ROOT: '/products',
    CATALOG: '/products/catalog',
    MY: '/products/my',
    DETAILS: (slug: string) => `/products/catalog/${slug}`,
    MY_DETAILS: (slug: string) => `/products/my/${slug}`,
  },

  // Home route
  HOME: '/',
} as const
