import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "glm": path.resolve(__dirname, "src/lib/glm.js"),
            "engine/": path.resolve(__dirname, "src/engine/"),
            "dat": path.resolve(__dirname, "src/lib/dat.js")
        },
    },
});