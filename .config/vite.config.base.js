import fs from 'fs'
import path from 'path'

import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

const PWD = process.env.PWD
const pkg = require(path.join(PWD, 'package.json'))

const tsEntry = path.resolve(PWD, 'src/index.ts')
const entry = fs.existsSync(tsEntry) ? tsEntry : tsEntry.replace('.ts', '.tsx')

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({
      exclude: ['**/*.spec.ts', '**/*.test.ts', '**/tests/**'],
      afterBuild: () => {
        const types = fs.readdirSync(path.join(PWD, 'dist/src'))
        types.forEach((file) => {
          fs.renameSync(path.join(PWD, 'dist/src', file), path.join(PWD, 'dist', file))
        })
        fs.rmdirSync(path.join(PWD, 'dist/src'))
      }
    })
  ],
  build: {
    sourcemap: true,
    lib: {
      entry,
      name: pkg.name,
      fileName: 'index',
      formats: ['cjs', 'es']
    }
  }
})
