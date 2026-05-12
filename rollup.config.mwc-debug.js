import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/mwc-entry.ts",
  output: {
    // Target the specific overrides asset folder
    file: "overrides/assets/javascripts/mwc-bundle.min.js",
    format: "esm", // MWC requires ES Module format
  },
  plugins: [
    // Resolve imports from node_modules
    nodeResolve(),
    commonjs(),  // ⬅️ NEW: Needed to allow list.js to be treated as CommonJS so Typescript can handle the default import
    typescript({  
      // Ensure Rollup uses your tsconfig.json
      tsconfig: "./tsconfig.json",
    }),
  ],
};
