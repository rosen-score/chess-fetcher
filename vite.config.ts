/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        globalSetup: 'tests/mock-server/server.ts',
        // teardownTimeout is needed to give the teardown()
        // in the globalSetup more time to finish
        teardownTimeout: 1000 * 5,
    },
})
