declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT: string;
      CORS_ORIGIN: string;
    }
  }
}

export {};
