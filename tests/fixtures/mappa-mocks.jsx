import React from "react";
export const state = {
  auth: { user: null, loading: false },
  language: "it",
  premium: true,
  requests: [],
};
export const useAuth = () => state.auth;
export const useLanguage = () => ({
  language: state.language,
  l: (it, pt) => (state.language === "it" ? it : pt),
  changeLanguage: (language) => {
    state.language = language;
  },
  getFormattedDate: () => "venerdì 13 novembre",
});
export const usePremium = () => ({
  can: () => state.premium,
  request: (feature) => state.requests.push(feature),
});
export const Modal = ({ children }) => <div>{children}</div>;
