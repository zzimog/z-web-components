import { defineConfig } from 'vite';
import babel from '@rolldown/plugin-babel';
import eslint from 'vite-plugin-eslint2';

const decoratorsPreset = {
  preset: () => ({
    plugins: [['@babel/plugin-proposal-decorators', { version: '2023-11' }]],
  }),
  rolldown: {
    filter: { code: '@' },
  },
};

export default defineConfig({
  base: './',
  plugins: [
    eslint(),
    babel({
      presets: [decoratorsPreset],
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    open: true,
  },
});
