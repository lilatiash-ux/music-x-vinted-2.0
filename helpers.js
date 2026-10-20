function isSpecial(value) {
  return /limited|exclusive|special|signed|autograph|pre.?order|vinyl|record|picture.?disc/i.test(String(value || ""));
}
function parsePrice(value) {
  if (typeof value === "number") return value;
  const s = String(value ?? "").replace(/\s/g, "").replace(",", ".").replace(/[^\d.]/g, "");
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}
function formatPrice(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `${n.toFixed(2).replace(".", ",")} zł` : String(value ?? "");
}
module.exports = { isSpecial, parsePrice, formatPrice };
