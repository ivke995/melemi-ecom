// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

// ✅ Assign config array to a variable before exporting
const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    plugins: {
      "@next/next": nextPlugin,
    },
  },
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
