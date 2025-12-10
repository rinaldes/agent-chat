// @ts-check
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import pluginVue from 'eslint-plugin-vue';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt([
  {
    ignores: [
      '.nuxt/',
      'node_modules/',
      '.output/',
      '.env*',
      '*.min.js',
      '*.log',
      'src/app/pages/dashboard/',
      'src/feature/Harvest/',
      'src/feature/Pic/',
      'src/feature/Reject/',
    ],
  },
  ...pluginVue.configs['flat/recommended'],
  prettierPlugin,
  {
    rules: {
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/html-self-closing': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
]);
