import tseslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/node_modules/**", "**/*.js", "**/*.mjs"],
  },
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    plugins: {
      boundaries,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.base.json",
        },
      },
      "boundaries/elements": [
        { type: "app", pattern: "apps/*" },
        { type: "package", pattern: "packages/*" },
        { type: "mock", pattern: "mocks" },
        { type: "test", pattern: "tests/*" },
      ],
      "boundaries/ignore": ["**/*.test.*", "**/*.spec.*"],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["package", "mock"] },
            { from: "package", allow: ["package"] },
            { from: "test", allow: ["app", "package", "mock"] },
            { from: "mock", allow: ["package"] },
          ],
        },
      ],
      "boundaries/no-private": ["error"],
    },
  },
);
