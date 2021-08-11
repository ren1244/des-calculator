import { terser } from "rollup-plugin-terser";
export default {
    input: 'main.js',
    output: {
        file: 'main.bundle.min.js',
        format: 'iife'
    },
    plugins: [
        terser()
    ]
};
