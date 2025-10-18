import { serve } from "bun"
import index from "../index.html"
import path from "path"
const __dirname = path.dirname(new URL(import.meta.url).pathname)
const srcDir = path.join(__dirname, "..", "src")

const server = serve({
  port: 2082,
  routes: {
    // Serve index.html for all unmatched routes.
    "/": index,
    "/assets/:path": (req) => {
      const file = Bun.file(`${srcDir}/assets/${req.params.path}`)
      return new Response(file)
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
})

console.log(`🚀 Server running at ${server.url}`)
