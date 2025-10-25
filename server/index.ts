import { serve } from "bun"
import index from "../index.html"
import path from "path"
const __dirname = path.dirname(new URL(import.meta.url).pathname)
const assetDir = path.join(__dirname, "..", "src", "game", "assets")

const server = serve({
  port: 2082,
  routes: {
    // Serve index.html for all unmatched routes.
    "/": index,
    "/assets/*": (req) => {
      const url = new URL(req.url)
      const pathname = url.pathname
      const relative = pathname.startsWith("/assets/")
        ? pathname.slice("/assets/".length)
        : pathname
      const assetPath = path.join(assetDir, relative)
      const file = Bun.file(assetPath)
      console.log(`Serving asset: ${assetPath}`)
      console.log(file.type)
      return new Response(file, {
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
      })
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
