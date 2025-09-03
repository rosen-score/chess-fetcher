/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        coverage: {
            exclude: ['demo.ts', 'tests/mock-server/server.ts', 'vitest.config.ts', 'src/types.ts'],
        },
        deps: {
            interopDefault: true,
        },
        globalSetup: 'tests/mock-server/server.ts',
        reporters: ['default', 'hanging-process'],
        pool: 'forks',
    },
})
