import React from "react";
export { useAuth, useLanguage, billing, ENTITLEMENT_ID, isIOSNative, App, state } from "./checkout-mocks.mjs";
export const LanguageProvider = ({ children }) => children;
export const StudyProvider = ({ children }) => children;
export const languages = { it: { label: "Italiano" }, pt: { label: "Português" } };
export const useStudy = () => ({ entries: [], ready: true, storageError: false });
export default function useBible() { return { bible: null, error: null, retry() {} }; }
export const Modal = ({ children, onClose }) => <div data-modal="true">{onClose && <button data-dismiss="true" onClick={onClose}>Close</button>}{children}</div>;
export const Mark = () => <span>Fideora</span>;
export const Header = () => <header />;
export const Row = () => <div />;
export const Empty = () => <div />;
