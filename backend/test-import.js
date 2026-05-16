// Quick test
try {
  console.log("Testing reportController...");
  const rc = require("./controllers/reportController");
  console.log("Exports:", Object.keys(rc));
  console.log("generatePDFReport:", typeof rc.generatePDFReport);
  console.log("sendReportByEmail:", typeof rc.sendReportByEmail);
} catch (e) {
  console.error("ERROR:", e.message);
  console.error("Stack:", e.stack);
}
