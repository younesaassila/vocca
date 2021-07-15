module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/recommended", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    ecmaVersion: 11,
    parser: "babel-eslint",
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {
    indent: ["error", 2, { SwitchCase: 1 }],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    quotes: ["error", "double"],
    semi: ["error", "always"],
  },
};
