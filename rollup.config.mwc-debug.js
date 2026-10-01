import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
    input: "src/mwc-entry.ts",
    output: {
        file: "overrides/assets/javascripts/mwc-bundle.min.js",
        format: "esm",
        sourcemap: true,
    },
    plugins: [
        nodeResolve(),
        commonjs(), // must come after nodeResolve, before typescript
        typescript({
            tsconfig: "./tsconfig.json",
        }),
        terser(),
    ],
};