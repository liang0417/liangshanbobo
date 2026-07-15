import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { localConfigPlugin } from "./scripts/local-config-plugin";

export default defineConfig({
  base: "/",
  plugins: [tailwindcss(), reactRouter(), localConfigPlugin()],
  resolve: {
    tsconfigPaths: true,
  },
});
