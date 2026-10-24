export const state = {
  auth: { user: null, loading: false },
  language: 'it',
  calls: [],
  info: { entitlements: { active: {} } },
  present: async () => ({ available: true, customerInfo: state.info, result: 'CANCELLED' }),
};
export const useAuth = () => state.auth;
export const useLanguage = () => ({ language: state.language, l: (it, pt) => state.language === 'pt' ? pt : it });
export const ENTITLEMENT_ID = 'premium';
export const billing = {
  refresh: async () => ({ available: true, customerInfo: state.info }),
  subscribe: async () => () => {},
  present: async (...args) => { state.calls.push(args); return state.present(...args); },
  restore: async () => ({ available: true, customerInfo: state.info }),
  manage: async () => ({ available: true, customerInfo: state.info }),
};
export const App = { addListener: async () => ({ remove() {} }) };
