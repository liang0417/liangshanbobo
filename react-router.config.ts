import type { Config } from "@react-router/dev/config";

export default {
  basename: process.env.GITHUB_ACTIONS ? "/personal-ai-portfolio" : "/",
  ssr: true,
} satisfies Config;
