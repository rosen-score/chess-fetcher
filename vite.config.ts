/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        coverage: {
            exclude: ['demo.ts', 'tests/mock-server/server.ts'],
        },
        deps: {
            interopDefault: true,
        },
        globalSetup: 'tests/mock-server/server.ts',
        reporters: ['default', 'hanging-process'],
        pool: 'forks',
    },
})
