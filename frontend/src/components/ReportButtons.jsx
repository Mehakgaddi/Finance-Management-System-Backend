// Report Buttons Component
// File: frontend/src/components/ReportButtons.jsx
// Buttons to download PDF or send report by email

import React, { useState } from "react";
import {
  downloadTransactionReport,
  sendTransactionReportByEmail,
} from "../services/reportApi";
import "./ReportButtons.css";

function ReportButtons() {
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle download PDF
  const handleDownloadPDF = async () => {
    try {
      setDownloadLoading(true);
      setError("");
      setMessage("");

      console.log("📥 Downloading PDF report...");
      await downloadTransactionReport();

      setMessage("✅ Report downloaded successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("❌ Download failed:", err);
      setError(err.message || "Failed to download report");
    } finally {
      setDownloadLoading(false);
    }
  };

  // Handle send by email
  const handleSendByEmail = async () => {
    try {
      setEmailLoading(true);
      setError("");
      setMessage("");

      console.log("📧 Sending report by email...");
      const response = await sendTransactionReportByEmail();

      setMessage(`✅ ${response.message}`);
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      console.error("❌ Email send failed:", err);
      setError(err.message || "Failed to send report");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="report-buttons-container">
      {/* Success message */}
      {message && (
        <div
          className="success-message"
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div
          className="error-message"
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
            textAlign: "center",
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={downloadLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: downloadLoading ? "not-allowed" : "pointer",
            opacity: downloadLoading ? 0.6 : 1,
          }}
        >
          {downloadLoading ? "📥 Downloading..." : "📥 Download PDF"}
        </button>

        {/* Send Email Button */}
        <button
          onClick={handleSendByEmail}
          disabled={emailLoading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: emailLoading ? "not-allowed" : "pointer",
            opacity: emailLoading ? 0.6 : 1,
          }}
        >
          {emailLoading ? "📧 Sending..." : "📧 Send to Email"}
        </button>
      </div>

      <p
        style={{
          fontSize: "12px",
          color: "#666",
          marginTop: "10px",
          fontStyle: "italic",
        }}
      >
        💡 Download PDF to view offline or Send to Email for keeping records
      </p>
    </div>
  );
}

export default ReportButtons;
