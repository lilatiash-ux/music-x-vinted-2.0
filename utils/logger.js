function log(...args) {
  console.log(new Date().toISOString(), "[INFO]", ...args);
}
function error(...args) {
  console.error(new Date().toISOString(), "[ERROR]", ...args);
}
module.exports = { log, error };
