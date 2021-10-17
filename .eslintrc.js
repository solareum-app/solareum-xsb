module.exports = {
  env: {
    browser: true,
    commonjs: true,
    jest: true,
    es6: true,
  },
  ecmaFeatures: {
    modules: true,
    spread: true,
    restParams: true,
  },
  extends: ["eslint:recommended"],
  globals: {
    process: "readonly",
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018,
  },
  rules: {},
};
