import React from "react";
export const state = {
  environment: { allowed: false, channel: "unavailable" },
  calls: [],
};
export const useAuth = () => ({ user: { id: "qa-user" } });
export const useLanguage = () => ({
  language: "it",
  l: (it) => it,
  changeLanguage() {},
});
export const getDevelopmentEnvironment = async () => state.environment;
export const ENTITLEMENT_ID = "premium";
export const billing = {
  previewPaywall: async (...args) => {
    state.calls.push(args);
    return { available: true, result: "CANCELLED" };
  },
};
export const Row = ({ title, onClick }) => (
  <button onClick={onClick}>{title}</button>
);
export const Modal = ({ children, onClose }) => (
  <div>
    {onClose && <button onClick={onClose}>Close</button>}
    {children}
  </div>
);
