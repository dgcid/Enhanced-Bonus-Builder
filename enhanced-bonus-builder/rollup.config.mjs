import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'scripts/hooks.mjs',
  output: {
    file: 'dist/enhanced-bonus-builder.js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    nodeResolve()
  ]
};