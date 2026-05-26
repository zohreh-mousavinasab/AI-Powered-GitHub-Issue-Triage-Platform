const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const port = process.env.PORT ? Number(process.env.PORT) : 5173;
const rootDir = __dirname;

function sendFile(res, filePath, contentType) {
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

const server = http.createServer((req, res) => {
  const urlPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const filePath = path.join(rootDir, urlPath);
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".css") return sendFile(res, filePath, "text/css; charset=utf-8");
  if (ext === ".js") return sendFile(res, filePath, "text/javascript; charset=utf-8");
  if (ext === ".html") return sendFile(res, filePath, "text/html; charset=utf-8");

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.listen(port, "127.0.0.1", () => {
  console.log(`BugMind frontend running at http://localhost:${port}`);
});
