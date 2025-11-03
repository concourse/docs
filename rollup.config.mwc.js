import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from "@rollup/plugin-typescript";

export default {
    input: 'src/mwc-entry.ts',
    output: {
        // Target the specific overrides asset folder
        file: 'overrides/assets/javascripts/mwc-bundle.min.js',
        format: 'esm', // MWC requires ES Module format
        sourcemap: true,
    },
    plugins: [
        // Resolve imports from node_modules
        nodeResolve(),
        // ⬅️ NEW: Add the TypeScript plugin *before* terser
        typescript({
            // Ensure Rollup uses your tsconfig.json
            tsconfig: './tsconfig.json'
        }),
        // Minify the output
        terser()
    ]
};