// ext: ["@repo/eslint-config/library.js"],
/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "turbo/no-undeclared-env-vars": [
      "error",
      {
        allowList: ["NODE_ENV"],
      },
    ],
  },
  plugins: ["turbo"],
  ignorePatterns: ['**/.eslintrc.cjs']
};