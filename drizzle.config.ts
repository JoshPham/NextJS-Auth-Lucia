import config from "@/lib/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/schema/*",
  out: "./drizzle",
  dbCredentials: {
    url: config.POSTGRES_URL,
  },
  verbose: true,
  strict: true,
});