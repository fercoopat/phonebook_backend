import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin-js';

export default [
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  {
    ignores: ['**/*.config.js', '**/*.config.mjs', 'dist'],
  },
  { languageOptions: { globals: globals.node } },
  {
    plugins: { stylistic },
    rules: {
      'stylistic/indent': ['error', 2],
      'stylistic/linebreak-style': ['error', 'unix'],
      'stylistic/quotes': ['error', 'single'],
      eqeqeq: 'error',
    },
  },
];
