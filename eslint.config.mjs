// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// ✅ Assign config array to a variable before exporting
const eslintConfig = [
  ...compat.extends("next/core-web-vitals").map((config) => ({
    ...config,
    files: ["**/*.{js,jsx,ts,tsx}"],
  })),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-undef": "error",
      "no-unused-vars": "error",
      "react/no-unescaped-entities": "warn",
      "no-console": "warn",
    },
  },
];

export default eslintConfig;
