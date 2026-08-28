import { useEffect, useState } from "react";
import axios from "axios";

export default function InstallNeuraBot() {
  const [installationCode, setInstallationCode] = useState("");
  const [business, setBusiness] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInstallationCode();
  }, []);

  async function loadInstallationCode() {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken");

      const response = await axios.get(
        "http://localhost:5000/api/widget-install/code",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setInstallationCode(
          response.data.installationCode
        );

        setBusiness(
          response.data.business
        );

        setSubscription(
          response.data.subscription
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Installation code load nahi ho saka."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    if (!installationCode) return;

    try {
      await navigator.clipboard.writeText(
        installationCode
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (error) {
      console.error(
        "COPY ERROR:",
        error
      );
    }
  }

  return (
    <div className="install-page">

      {/* HEADER */}

      <div className="install-header">
        <div>
          <div className="install-badge">
            🚀 NEURABOT INSTALLATION
          </div>

          <h1>
           Install NeuraBot on Your Website
          </h1>

          <p>
            Copy a small piece of code and paste it into your website. NeuraBot will go live on your website.
          </p>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="install-error">
          <strong>⚠️ Attention</strong>
          <span>{error}</span>
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="install-loading">
          <div className="install-spinner"></div>

          <h3>
            Aapka installation code tayyar ho raha hai...
          </h3>

          <p>
            Please wait a second
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* BUSINESS / PLAN */}

          <div className="install-info-grid">

            <div className="install-info-card">
              <span>🏢</span>
              <div>
                <small>Business</small>
                <strong>
                  {business?.name || "Your Business"}
                </strong>
              </div>
            </div>

            <div className="install-info-card">
              <span>⭐</span>
              <div>
                <small>Current Plan</small>
                <strong>
                  {subscription?.plan || "Active"}
                </strong>
              </div>
            </div>

            <div className="install-info-card">
              <span>📅</span>
              <div>
                <small>Expires</small>
                <strong>
                  {subscription?.expiresAt
                    ? new Date(
                        subscription.expiresAt
                      ).toLocaleDateString()
                    : "Active"}
                </strong>
              </div>
            </div>

          </div>

          {/* STEP 1 */}

          <div className="install-step">
            <div className="step-number">
              1
            </div>

            <div className="step-content">
              <h2>
                copy the code
              </h2>

              <p>
                This is your <strong>NeuraBot Installation Code</strong>.
                Do not modify this code.
              </p>

              <div className="code-box">

                <div className="code-top">
                  <span>
                    NeuraBot Installation Code
                  </span>

                  <button
                    onClick={copyCode}
                    className="copy-button"
                  >
                    {copied
                      ? "✓ Copied!"
                      : "📋 Copy Code"}
                  </button>
                </div>

                <pre>
                  <code>
                    {installationCode}
                  </code>
                </pre>

              </div>

              {copied && (
                <div className="copy-success">
                  ✓ Code copy ho gaya!
                </div>
              )}
            </div>
          </div>

          {/* STEP 2 */}

          <div className="install-step">
            <div className="step-number">
              2
            </div>

            <div className="step-content">
              <h2>
                open your website editor
              </h2>

              <p>
                Open your website's code/editor. If you are using WordPress, Shopify, or another website builder, open its code or custom HTML section.
              </p>

              <div className="tip-box">
                💡 <strong>Easy Tip:</strong>
                If you don't understand website code, simply send the copied code to your website developer.
              </div>
            </div>
          </div>

          {/* STEP 3 */}

          <div className="install-step">
            <div className="step-number">
              3
            </div>

            <div className="step-content">
              <h2>
                Code website mein Paste karein
              </h2>

              <p>
               Paste the copied code just before your website's <strong>closing body tag.</strong>
              </p>

              <div className="visual-code">
                <div>
                  Your Website Code
                </div>

                <div className="normal-code">
                  &lt;div&gt;
                  <br />
                  &nbsp;&nbsp;Your Website
                  <br />
                  &lt;/div&gt;
                </div>

                <div className="highlight-code">
                  ⭐ PASTE YOUR NEURABOT CODE HERE  ⭐
                </div>

                <div className="normal-code">
                  &lt;/body&gt;
                  <br />
                  &lt;/html&gt;
                </div>
              </div>
            </div>
          </div>

          {/* FINAL */}

          <div className="install-success-card">

            <div className="success-icon">
              ✓
            </div>

            <div>
              <h2>
                That's It! NeuraBot Is Now Live 🎉
              </h2>

              <p>
                After saving/publishing your website, open your website. You will see the NeuraBot chat button in the corner of your screen.
              </p>
            </div>

          </div>

          {/* IMPORTANT */}

          <div className="install-help">

            <div className="help-icon">
              💬
            </div>

            <div>
              <h3>
                Don't Understand the Code?
              </h3>

              <p>
                No problem. Simply click the
                <strong> Copy Code </strong>
                button and send the code to your website developer. Your developer can install it on your website.
              </p>
            </div>

          </div>
        </>
      )}

      <style>{`
        .install-page {
          min-height: 100vh;
          padding: 35px;
          background: #f6f7fb;
          color: #171a2b;
          font-family: Inter, Arial, sans-serif;
        }

        .install-header {
          max-width: 1050px;
          margin: 0 auto 28px;
        }

        .install-badge {
          display: inline-block;
          padding: 7px 12px;
          border-radius: 30px;
          background: #eeeaff;
          color: #7055e8;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .7px;
          margin-bottom: 12px;
        }

        .install-header h1 {
          margin: 0;
          font-size: 34px;
          font-weight: 800;
        }

        .install-header p {
          max-width: 700px;
          margin-top: 10px;
          color: #6b7080;
          line-height: 1.7;
        }

        .install-info-grid {
          max-width: 1050px;
          margin: 0 auto 25px;
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 15px;
        }

        .install-info-card {
          background: white;
          border: 1px solid #e8e9ef;
          border-radius: 15px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 13px;
          box-shadow: 0 5px 20px rgba(0,0,0,.04);
        }

        .install-info-card > span {
          font-size: 25px;
        }

        .install-info-card small {
          display: block;
          color: #8a8e9c;
          margin-bottom: 4px;
        }

        .install-info-card strong {
          display: block;
          font-size: 15px;
        }

        .install-step {
          max-width: 1050px;
          margin: 20px auto;
          padding: 27px;
          background: white;
          border: 1px solid #e8e9ef;
          border-radius: 18px;
          display: flex;
          gap: 20px;
          box-shadow: 0 7px 25px rgba(0,0,0,.04);
        }

        .step-number {
          min-width: 43px;
          height: 43px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            #7c5cff,
            #5c8cff
          );
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 18px;
        }

        .step-content {
          flex: 1;
        }

        .step-content h2 {
          margin: 4px 0 7px;
          font-size: 21px;
        }

        .step-content p {
          color: #6d7180;
          line-height: 1.7;
        }

        .code-box {
          margin-top: 18px;
          border-radius: 14px;
          overflow: hidden;
          background: #101426;
        }

        .code-top {
          padding: 12px 15px;
          background: #171d32;
          color: #dfe4ff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          font-weight: 700;
        }

        .copy-button {
          border: none;
          background: #7c5cff;
          color: white;
          padding: 9px 14px;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 700;
        }

        .copy-button:hover {
          opacity: .9;
        }

        .code-box pre {
          margin: 0;
          padding: 20px;
          overflow-x: auto;
          color: #d9e0ff;
          font-size: 12px;
          line-height: 1.7;
        }

        .copy-success {
          margin-top: 12px;
          color: #16834b;
          font-weight: 700;
        }

        .tip-box {
          margin-top: 18px;
          padding: 16px;
          border-radius: 12px;
          background: #f2efff;
          color: #5745a7;
          line-height: 1.6;
        }

        .visual-code {
          margin-top: 18px;
          padding: 20px;
          border-radius: 13px;
          background: #101426;
          color: #aeb8dc;
          font-family: monospace;
          line-height: 1.8;
        }

        .normal-code {
          color: #9da7c8;
        }

        .highlight-code {
          margin: 10px 0;
          padding: 12px;
          border-radius: 8px;
          background: #292047;
          color: #bcaeff;
          text-align: center;
          font-weight: 700;
        }

        .install-success-card {
          max-width: 1050px;
          margin: 25px auto;
          padding: 25px;
          border-radius: 18px;
          background: #ecfff5;
          border: 1px solid #c8f1dc;
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .success-icon {
          min-width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #1ca467;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 800;
        }

        .install-success-card h2 {
          margin: 0 0 6px;
          color: #146b47;
        }

        .install-success-card p {
          margin: 0;
          color: #4e735f;
          line-height: 1.6;
        }

        .install-help {
          max-width: 1050px;
          margin: 20px auto;
          padding: 22px;
          border-radius: 17px;
          background: #fff8e8;
          border: 1px solid #f4dfac;
          display: flex;
          gap: 15px;
        }

        .help-icon {
          font-size: 28px;
        }

        .install-help h3 {
          margin: 0 0 6px;
        }

        .install-help p {
          margin: 0;
          color: #756744;
          line-height: 1.7;
        }

        .install-error {
          max-width: 1050px;
          margin: 0 auto 20px;
          padding: 16px;
          border-radius: 12px;
          background: #fff0f0;
          color: #a52d2d;
          display: flex;
          gap: 10px;
          flex-direction: column;
        }

        .install-loading {
          max-width: 1050px;
          margin: 40px auto;
          padding: 50px;
          background: white;
          border-radius: 18px;
          text-align: center;
        }

        .install-spinner {
          width: 35px;
          height: 35px;
          margin: 0 auto 15px;
          border: 4px solid #e5e1ff;
          border-top-color: #7c5cff;
          border-radius: 50%;
          animation: spin .8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 700px) {
          .install-page {
            padding: 20px 12px;
          }

          .install-header h1 {
            font-size: 27px;
          }

          .install-info-grid {
            grid-template-columns: 1fr;
          }

          .install-step {
            padding: 20px;
          }

          .code-top {
            align-items: flex-start;
            gap: 10px;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}