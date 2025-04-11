/** @type {import("eslint").Linter.Config} */
module.exports = {
  plugins: ["turbo"], // Add this line
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // project: ['./tsconfig.json'],
  },
  rules: {
    "turbo/no-undeclared-env-vars": [
      "error",
      {
        allowList: ["NODE_ENV"],
      },
    ],
  },
};
