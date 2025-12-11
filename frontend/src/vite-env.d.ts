/// <reference types="vite/client" />

/**
 * Vite Environment Variables
 * Type definitions for environment variables used throughout the application
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_TOKEN_STORAGE_KEY: string;
  readonly VITE_USER_STORAGE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Asset module declarations
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module '*.gif' {
  const value: string;
  export default value;
}
