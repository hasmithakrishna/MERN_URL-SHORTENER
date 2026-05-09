import { useState } from "react";
import axios from "axios";
import { QRCode } from "react-qr-code";
import QRCodeGenerator from "qrcode";
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");

  const handleShorten = async () => {
    if (!url) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });

      const newShortUrl = res.data.shortUrl;
      setShortUrl(newShortUrl);
      setCopied(false);

      const qr = await QRCodeGenerator.toDataURL(newShortUrl);
      setQrImage(qr);
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      gap: "1.5rem",
      color: "#fff",
      fontFamily: "sans-serif"
    }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "800", letterSpacing: "0.05em" }}>
        URL SHORTENER
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%", maxWidth: "600px" }}>
        <input
          type="text"
          placeholder="Enter long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            padding: "0.85rem 1rem",
            borderRadius: "10px",
            border: "2px solid #7c3aed",
            background: "rgba(255,255,255,0.07)",
            color: "#fff",
            fontSize: "1rem",
            outline: "none"
          }}
        />
        <button
          onClick={handleShorten}
          style={{
            padding: "0.85rem",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #7c3aed, #2563eb)",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          Shorten
        </button>
      </div>

      {shortUrl && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "600px", gap: "0.75rem" }}>
          <p style={{ fontWeight: "600" }}>Your short link:</p>
          <a
            href={shortUrl}
            target="_blank"
            style={{ color: "#06b6d4", wordBreak: "break-all", textAlign: "center" }}
          >
            {shortUrl}
          </a>
          <button
            onClick={handleCopy}
            style={{
              padding: "0.75rem",
              width: "100%",
              borderRadius: "10px",
              border: "none",
              background: copied ? "#10b981" : "#6d28d9",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>

          <div style={{ background: "#fff", padding: "1rem", borderRadius: "12px", marginTop: "1rem" }}>
            <p style={{ textAlign: "center", color: "#111", fontWeight: "600", marginBottom: "0.5rem" }}>Scan QR Code:</p>
            <QRCode value={shortUrl} size={180} />
          </div>

          {qrImage && (
            <a
              download="qr-code.png"
              href={qrImage}
              style={{
                display: "block",
                textAlign: "center",
                padding: "0.75rem",
                width: "100%",
                borderRadius: "10px",
                background: "#f59e0b",
                color: "#000",
                fontWeight: "700",
                textDecoration: "none"
              }}
            >
              Download QR Code
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default App;