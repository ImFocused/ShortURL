import { useState } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const shortenUrl = async () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Please enter a URL first.");
      return;
    }

    try {
      const parsedUrl = new URL(trimmedUrl);

      if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
      ) {
        setError("Please enter a valid HTTP or HTTPS URL.");
        return;
      }
    } catch {
      setError("Please enter a valid URL, like https://example.com");
      return;
    }

    setError("");
    setShortUrl("");
    setCopied(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: trimmedUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setShortUrl(data.shortUrl);
    } catch (error) {
      setError("Couldn't shorten that URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <main className="app">
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <nav className="navbar">
        <div className="brand">
  <div className="brand-icon">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.5 13.5L13.5 10.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8.25 16.25L6.75 17.75C5.09 19.41 2.41 19.41 0.75 17.75C-0.91 16.09 -0.91 13.41 0.75 11.75L4.25 8.25C5.91 6.59 8.59 6.59 10.25 8.25"
        transform="translate(2 0)"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 7.75L17.25 6.25C18.91 4.59 21.59 4.59 23.25 6.25C24.91 7.91 24.91 10.59 23.25 12.25L19.75 15.75C18.09 17.41 15.41 17.41 13.75 15.75"
        transform="translate(-2 0)"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>

  <span>ShortURL</span>
</div>  

        <div className="nav-badge">
          <span className="status-dot"></span>
          Fast & simple
        </div>
      </nav>

      <section className="hero">
        <div className="hero-badge">
          <span>✦</span>
          Make every link count
        </div>

        <h1>
          Your links.
          <br />
          <span>Shorter.</span>
        </h1>

        <p className="subtitle">
          Turn long, messy URLs into clean links that are
          <br className="desktop-break" />
          easy to share anywhere.
        </p>

        <div className="shortener-card">
          <div className="input-wrapper">
            <span className="link-icon">↗</span>

            <input
              type="url"
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                setError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  shortenUrl();
                }
              }}
            />

            {url && (
              <button
                className="clear-button"
                onClick={() => {
                  setUrl("");
                  setShortUrl("");
                  setError("");
                }}
              >
                ×
              </button>
            )}
          </div>

          <button
            className="shorten-button"
            onClick={shortenUrl}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Shortening...
              </>
            ) : (
              <>
                Shorten URL
                <span>→</span>
              </>
            )}
          </button>
        </div>

        {error && <div className="error-message">⚠ {error}</div>}

        {shortUrl && (
          <div className="result-card">
            <div className="result-top">
              <div>
                <p className="result-label">YOUR SHORT LINK</p>

                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="short-link"
                >
                  {shortUrl}
                </a>
              </div>

              <div className="success-icon">✓</div>
            </div>

            <div className="result-actions">
              <button onClick={copyUrl} className="copy-button">
                {copied ? "✓ Copied!" : "Copy link"}
              </button>

              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="open-button"
              >
                Open link ↗
              </a>
            </div>
          </div>
        )}

        <div className="features">
          <div className="feature">
            <span>⚡</span>
            <div>
              <strong>Instant</strong>
              <p>Create links in seconds</p>
            </div>
          </div>

          <div className="feature">
            <span>🔗</span>
            <div>
              <strong>Clean links</strong>
              <p>Easy to share anywhere</p>
            </div>
          </div>

          <div className="feature">
            <span>🛡</span>
            <div>
              <strong>Reliable</strong>
              <p>Your links stay available</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <span>ShortURL</span>
        <span>Built with React · Node · PostgreSQL</span>
      </footer>
    </main>
  );
}

export default App;