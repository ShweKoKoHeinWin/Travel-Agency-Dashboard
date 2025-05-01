import { reactRouter } from "@react-router/dev/vite";
import { sentryReactRouter, type SentryReactRouterBuildOptions } from "@sentry/react-router";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const sentryConfig: SentryReactRouterBuildOptions = {
    org: "shwe-b0",
    project: "travel-agency",
    // An auth token is required for uploading source maps.
    authToken: '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',
    // ...
};

export default defineConfig((config) => {
    return {
        plugins: [
            reactRouter(),
            sentryReactRouter(sentryConfig, config),
            tailwindcss(),
            tsconfigPaths(),
        ],
        sentryConfig, // Also pass the config here!
        ssr: {
            noExternal: [/@syncfusion/],
        },
    };
});
