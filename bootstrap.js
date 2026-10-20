// Pobiera niezmienioną bazę MusicDrop z publicznego repozytorium i uruchamia ją lokalnie.
// Wymaga internetu podczas pierwszego startu. Vinted i MusicDrop są uruchamiane w jednym procesie.
const fs = require("fs");
const https = require("https");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = __dirname;
const TARGET = path.join(ROOT, "index.js");
const SOURCE = "https://raw.githubusercontent.com/lilatiash-ux/musicdrop-ostatni-dzialajacy-/main/index.js";

function download(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error("Za dużo przekierowań"));
    https.get(url, { headers: { "User-Agent": "music-x-vinted-2.0" } }, res => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume();
        return resolve(download(new URL(res.headers.location, url).toString(), redirects + 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`Pobieranie kodu nie powiodło się: HTTP ${res.statusCode}`));
      }
      let body = "";
      res.setEncoding("utf8");
      res.on("data", chunk => body += chunk);
      res.on("end", () => resolve(body));
    }).on("error", reject);
  });
}

(async () => {
  try {
    let source = fs.existsSync(TARGET) ? fs.readFileSync(TARGET, "utf8") : "";
    if (!source || source.length < 20000 || source.includes("BOOTSTRAP_PLACEHOLDER")) {
      console.log("[BOOTSTRAP] Pobieram oryginalny kod MusicDrop...");
      source = await download(SOURCE);
      if (source.length < 20000) throw new Error("Pobrany plik jest niekompletny.");
      // Token może być ustawiony w panelu hostingu jako zmienna środowiskowa.
      source = source.replace(
        'const { DISCORD_TOKEN } = require("./config.json");',
        'const DISCORD_TOKEN = process.env.DISCORD_TOKEN || require("./config.json").DISCORD_TOKEN;'
      );
      source = source.replace('console.error("❌ Brak DISCORD_TOKEN w config.json");',
        'console.error("❌ Ustaw DISCORD_TOKEN w zmiennych środowiskowych hostingu lub config.json");');
      fs.writeFileSync(TARGET, source, "utf8");
      console.log("[BOOTSTRAP] Kod bazowy zapisany.");
    }
    const child = spawn(process.execPath, [TARGET], {
      cwd: ROOT,
      stdio: "inherit",
      env: process.env
    });
    child.on("exit", code => process.exitCode = code ?? 1);
  } catch (err) {
    console.error("[BOOTSTRAP] Błąd startu:", err.message);
    console.error("Sprawdź połączenie z internetem i spróbuj ponownie.");
    process.exitCode = 1;
  }
})();
