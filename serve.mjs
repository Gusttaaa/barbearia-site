/**
 * serve.mjs — starts the Next.js dev server on port 3000
 * Usage: node serve.mjs
 */
import { spawn } from "child_process";
import { createServer } from "net";

const PORT = 3000;

function checkPort(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

async function main() {
  const free = await checkPort(PORT);
  if (!free) {
    console.log(`✓ Port ${PORT} already in use — server is probably running.`);
    return;
  }

  console.log(`Starting Next.js dev server on http://localhost:${PORT} …`);
  const proc = spawn("npm", ["run", "dev"], {
    stdio: "inherit",
    shell: true,
  });

  proc.on("error", (err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
}

main();
