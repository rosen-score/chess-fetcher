/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        globalSetup: 'tests/mock-server/server.ts',
        deps: {
            interopDefault: true,
        },
        teardownTimeout: 5000,
        reporters: ['default', 'hanging-process'],
    },
})
