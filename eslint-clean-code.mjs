// Clean-code limits (dev-playbook CLEAN-CODE.md §3). Add to eslint.config.mjs:
//   import cleanCode from "./eslint-clean-code.mjs";
//   export default [...coreWebVitals, cleanCode];
// eslint-config-next already enables @typescript-eslint/no-explicit-any as a warning;
// raise it to "error" in the TS block of your config.
export default {
  files: ["**/*.{js,mjs,cjs,ts,tsx,jsx}"],
  ignores: ["**/*.test.*", "**/*.spec.*", "tests/**", "e2e/**", "scripts/**"],
  rules: {
    // Files ≤500 lines, hard limit. Target ≤300 (checked by scripts/clean-code-audit).
    "max-lines": ["error", { max: 500, skipBlankLines: true, skipComments: true }],
    // Article: 4–20 lines. Components with JSX get 40; split hooks/subcomponents past that.
    "max-lines-per-function": ["warn", { max: 40, skipBlankLines: true, skipComments: true, IIFEs: true }],
    // Article: max 2 levels of indentation. eslint counts nested blocks; 3 ≈ two levels inside a function body.
    "max-depth": ["error", 3],
    complexity: ["warn", 10],
    "max-params": ["warn", 4],
    // "warn" until the 3 existing nested ternaries are flattened (classes/[id]/content.tsx, components/tabs/index.tsx); then "error".
    "no-nested-ternary": "warn",
  },
};
