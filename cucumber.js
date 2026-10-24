export default {
  paths: ["features/**/*.feature"],

  import: [
    "tsx/esm",
    "support/**/*.ts",
    "steps/**/*.ts",
  ],

  format: [
    "progress",
    "html:cucumber-report.html",
  ],
};