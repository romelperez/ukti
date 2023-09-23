import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts']
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['umd'],
      name: 'yrel',
      fileName: 'yrel',
    },
    rollupOptions: {
      external: [],
      output: {
        dir: path.resolve(__dirname, 'build/umd')
      }
    }
  }
})
