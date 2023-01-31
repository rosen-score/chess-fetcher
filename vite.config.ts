/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        coverage: {
            provider: 'istanbul',
        },
        deps: {
            interopDefault: true,
        },
        globalSetup: 'tests/mock-server/server.ts',
        reporters: ['default', 'hanging-process'],
    },
})
