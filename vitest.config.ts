import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', ['REACT_APP_', 'NODE_ENV', 'PUBLIC_URL'])

  return {
    plugins: [react(), tsconfigPaths()],
    define: Object.fromEntries(
      Object.entries(env).map(([key, value]) => [
        `process.env.${key}`,
        JSON.stringify(value),
      ]),
    ),
    test: {
      globals: true,
      environment: 'jsdom',
      css: true
    }
  }
})
