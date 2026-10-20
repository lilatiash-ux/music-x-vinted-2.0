const fs = require("fs");
const path = require("path");
function loadJSON(filePath, fallback = {}) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    console.error("[storage] Nie można odczytać", filePath, e.message);
    return fallback;
  }
}
function saveJSON(filePath, data) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (e) {
    console.error("[storage] Nie można zapisać", filePath, e.message);
    return false;
  }
}
module.exports = { loadJSON, saveJSON };
