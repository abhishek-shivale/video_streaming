
/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  // extends: [config, "plugin:turbo/recommended"],
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
};
