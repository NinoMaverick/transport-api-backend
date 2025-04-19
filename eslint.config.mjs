import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["node_modules", "dist", "coverage"], // Ignore these folders
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      sourceType: "commonjs", 
      globals: globals.node,
    },
  },
]);
