import { config as baseConfig } from "./packages/eslint-config/base.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.turbo/**"],
  },
  ...baseConfig,
];
