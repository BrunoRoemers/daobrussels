declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string;
      DATABASE_URI: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
