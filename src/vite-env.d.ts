
/// <reference types="vite/client" />
/// <reference types="chrome" />

// Extend the global object to include chrome for development
declare global {
  interface Window {
    chrome?: typeof chrome;
  }
}
