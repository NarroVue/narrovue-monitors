/**
 * NarroVue · Weekly Brief Proxy
 * ─────────────────────────────
 * Sits between narrovue_weekly_brief.html and api.anthropic.com.
 * Run:  node proxy.js
 * Then open narrovue_weekly_brief.html in your browser.
 */

const http    = require("http");
const https   = require("https");
const fs      = require("fs");
const path    = require("path");

// ── Config ────────────────────────────────────────────────────────────────
const PORT       = 3000;
const API_KEY    = process.env.ANTHROPIC_API_KEY || "";   // set in .env or shell
const API_HOST   = "api.anthropic.com";
const API_PATH   = "/v1/messages";
const STATIC_DIR = __dirname;                              // serves HTML from same folder

// ── Minimal .env loader (no dependencies needed) ──────────────────────────
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach(line => {
      const [k, ...v] = line.split("=");
      if (k && v.length && !process.env[k.trim()]) {
        process.env[k.trim()] = v.join("=").trim().replace(/^['"]|['"]$/g, "");
      }
    });
}

const API_KEY_FINAL = process.env.ANTHROPIC_API_KEY || API_KEY;

// ── Server ────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {

  // CORS — allow the HTML file opened from disk (file://) or localhost
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  // ── POST /generate → proxy to Anthropic ──────────────────────────────
  if (req.method === "POST" && req.url === "/generate") {

    if (!API_KEY_FINAL) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: { message: "ANTHROPIC_API_KEY not set. Add it to .env or export it in your shell." } }));
      return;
    }

    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {

      // Validate JSON from browser
      let payload;
      try { payload = JSON.parse(body); }
      catch(e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: { message: "Invalid JSON from browser." } }));
        return;
      }

      const postData = Buffer.from(JSON.stringify(payload));

      const options = {
        hostname: API_HOST,
        path:     API_PATH,
        method:   "POST",
        headers: {
          "Content-Type":      "application/json",
          "Content-Length":    postData.length,
          "x-api-key":         API_KEY_FINAL,
          "anthropic-version": "2023-06-01",
        },
      };

      const apiReq = https.request(options, apiRes => {
        let data = "";
        apiRes.on("data", chunk => { data += chunk; });
        apiRes.on("end", () => {
          res.writeHead(apiRes.statusCode, { "Content-Type": "application/json" });
          res.end(data);
        });
      });

      apiReq.on("error", err => {
        res.writeHead(502, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: { message: "Proxy → Anthropic error: " + err.message } }));
      });

      apiReq.write(postData);
      apiReq.end();
    });

    return;
  }

  // ── GET / or /narrovue_weekly_brief.html → serve the HTML file ────────
  if (req.method === "GET" && (req.url === "/" || req.url === "/narrovue_weekly_brief.html")) {
    const filePath = path.join(STATIC_DIR, "narrovue_weekly_brief.html");
    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("narrovue_weekly_brief.html not found in " + STATIC_DIR);
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // ── 404 fallback ──────────────────────────────────────────────────────
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("");
  console.log("  NarroVue · Weekly Brief Proxy");
  console.log("  ─────────────────────────────");
  console.log(`  Running at  →  http://localhost:${PORT}`);
  console.log(`  Open        →  http://localhost:${PORT}/narrovue_weekly_brief.html`);
  console.log(`  API key     →  ${API_KEY_FINAL ? "✓ loaded (" + API_KEY_FINAL.slice(0,8) + "…)" : "✗ NOT SET — add to .env"}`);
  console.log("");
  console.log("  Press Ctrl+C to stop.");
  console.log("");
});
