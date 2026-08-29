import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  XCircle,
  Code2,
} from "lucide-react";

import "./Subscription.css";

const API_URL = import.meta.env.VITE_API_URL;

function Subscription() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [payments, setPayments] = useState([]);
  const [subscription, setSubscription] = useState(null);

  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem("token");

  const loadSubscription = async (showRefresh = false) => {
    if (!token) {
      setError("Your session has expired. Please login again.");
      setLoading(false);
      return;
    }

    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `${API_URL}/api/payment/my-status`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("SUBSCRIPTION STATUS:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Could not load subscription."
        );
      }

      setPayments(data.payments || []);

      /*
       * If backend already returns subscription,
       * use it directly.
       */
      if (data.subscription) {
        setSubscription(data.subscription);
      } else {
        /*
         * Fallback:
         * Find the latest paid payment.
         */
        const paidPayment = (data.payments || []).find(
          (payment) => payment.status === "paid"
        );

        if (paidPayment) {
          setSubscription({
            id: paidPayment.id,
            plan_id: paidPayment.plan_id,
            plan_name:
              paidPayment.plans?.name || "Active Plan",
            status: "active",
            started_at:
              paidPayment.paid_at ||
              paidPayment.verified_at ||
              paidPayment.created_at,
            expires_at: null,
            business_id: paidPayment.business_id,
          });
        } else {
          setSubscription(null);
        }
      }
    } catch (err) {
      console.error(
        "LOAD SUBSCRIPTION ERROR:",
        err
      );

      setError(
        err?.message ||
          "Could not load subscription status."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  /*
   * Latest payment
   */
  const latestPayment =
    payments.length > 0
      ? payments[0]
      : null;

  /*
   * Payment status
   */
  const paymentStatus =
    latestPayment?.status || null;

  /*
   * Active subscription
   */
  const isActive =
    subscription?.status === "active" ||
    paymentStatus === "paid";

  const isPending =
    paymentStatus === "pending";

  const isRejected =
    paymentStatus === "rejected";

  /*
   * Business ID
   */
  const businessId =
    subscription?.business_id ||
    latestPayment?.business_id ||
    "";

  /*
   * Chatbot installation code
   *
   * This is the code the client will eventually
   * paste into their website.
   */
  const widgetCode = businessId
    ? `<script
  src="${API_URL}/widget.js"
  data-business-id="${businessId}"
  defer
></script>`
    : `<script
  src="${API_URL}/widget.js"
  data-business-id="YOUR_BUSINESS_ID"
  defer
></script>`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(
        widgetCode
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(
        "COPY CODE ERROR:",
        err
      );
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );
    } catch {
      return "Not available";
    }
  };

  const planName =
    subscription?.plan_name ||
    latestPayment?.plans?.name ||
    "No active plan";

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="subscription-page">
        <div className="subscription-loading">
          <div className="loading-spinner" />
          <p>
            Loading your subscription...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-page">
      <div className="subscription-glow subscription-glow-one" />
      <div className="subscription-glow subscription-glow-two" />

      {/* HEADER */}

      <header className="subscription-header">
        <button
          className="subscription-back"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="subscription-brand">
          <div className="subscription-logo">
            <Bot size={21} />
          </div>

          <strong>
            Neura<span>Bot</span>
          </strong>
        </div>

        <button
          className="subscription-refresh"
          onClick={() =>
            loadSubscription(true)
          }
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={
              refreshing
                ? "refresh-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh Status"}
        </button>
      </header>

      <main className="subscription-main">
        {/* TITLE */}

        <section className="subscription-heading">
          <span>
            <CreditCard size={15} />
            SUBSCRIPTION
          </span>

          <h1>
            Your AI assistant
            <strong> status.</strong>
          </h1>

          <p>
            Track your payment verification,
            subscription activation and
            chatbot installation code here.
          </p>
        </section>

        {/* ERROR */}

        {error && (
          <div className="subscription-error">
            {error}
          </div>
        )}

        {/* STATUS CARD */}

        <section className="subscription-status-card">
          <div
            className={`subscription-status-icon ${
              isActive
                ? "active"
                : isPending
                ? "pending"
                : isRejected
                ? "rejected"
                : "waiting"
            }`}
          >
            {isActive ? (
              <CheckCircle2 size={30} />
            ) : isPending ? (
              <Clock3 size={30} />
            ) : isRejected ? (
              <XCircle size={30} />
            ) : (
              <CreditCard size={30} />
            )}
          </div>

          <div className="subscription-status-content">
            <span>PAYMENT STATUS</span>

            <h2>
              {isActive
                ? "Payment Approved"
                : isPending
                ? "Payment Pending"
                : isRejected
                ? "Payment Rejected"
                : "No Payment Submitted"}
            </h2>

            <p>
              {isActive
                ? "Your payment has been verified and your AI subscription is active."
                : isPending
                ? "Your payment has been submitted and is waiting for admin verification."
                : isRejected
                ? "Your payment was rejected. Please submit a new payment with the correct transaction details."
                : "Choose a plan and submit your payment to activate NeuraBot."}
            </p>
          </div>

          <div
            className={`status-badge ${
              isActive
                ? "active"
                : isPending
                ? "pending"
                : isRejected
                ? "rejected"
                : "waiting"
            }`}
          >
            {isActive
              ? "ACTIVE"
              : isPending
              ? "PENDING"
              : isRejected
              ? "REJECTED"
              : "NOT ACTIVE"}
          </div>
        </section>

        {/* PLAN */}

        <section className="subscription-grid">
          <div className="subscription-card">
            <div className="subscription-card-top">
              <div className="subscription-card-icon">
                <Bot size={21} />
              </div>

              <span>
                CURRENT PLAN
              </span>
            </div>

            <h2>{planName}</h2>

            {latestPayment?.amount && (
              <div className="subscription-price">
                ${latestPayment.amount}
              </div>
            )}

            <div className="subscription-details">
              <div>
                <span>Payment ID</span>
                <strong>
                  {latestPayment?.id
                    ? latestPayment.id.substring(
                        0,
                        12
                      ) + "..."
                    : "—"}
                </strong>
              </div>

              <div>
                <span>Transaction ID</span>
                <strong>
                  {latestPayment
                    ?.transaction_id ||
                    "—"}
                </strong>
              </div>

              <div>
                <span>Started</span>
                <strong>
                  {formatDate(
                    subscription?.started_at
                  )}
                </strong>
              </div>

              <div>
                <span>Expires</span>
                <strong>
                  {formatDate(
                    subscription?.expires_at
                  )}
                </strong>
              </div>
            </div>
          </div>

          {/* BENEFITS */}

          <div className="subscription-card">
            <div className="subscription-card-top">
              <div className="subscription-card-icon">
                <ShieldCheck size={21} />
              </div>

              <span>
                INCLUDED
              </span>
            </div>

            <h2>
              AI Business Tools
            </h2>

            <div className="subscription-features">
              <div>
                <CheckCircle2 size={17} />
                AI business assistant
              </div>

              <div>
                <CheckCircle2 size={17} />
                Website chatbot
              </div>

              <div>
                <CheckCircle2 size={17} />
                Business knowledge
              </div>

              <div>
                <CheckCircle2 size={17} />
                Customer support automation
              </div>

              <div>
                <CheckCircle2 size={17} />
                Custom business information
              </div>
            </div>
          </div>
        </section>

        {/* PENDING */}

        {isPending && (
          <section className="subscription-notice pending-notice">
            <Clock3 size={22} />

            <div>
              <strong>
                Waiting for admin approval
              </strong>

              <p>
                Your payment has been received.
                You don't need to submit it
                again. Once the admin approves
                your payment, this page will
                show your active subscription.
              </p>
            </div>
          </section>
        )}

        {/* REJECTED */}

        {isRejected && (
          <section className="subscription-notice rejected-notice">
            <XCircle size={22} />

            <div>
              <strong>
                Payment rejected
              </strong>

              <p>
                Your latest payment was not
                approved. You can return to
                the dashboard and submit a
                new payment.
              </p>

              <button
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Choose Another Plan
              </button>
            </div>
          </section>
        )}

        {/* CHATBOT CODE */}

        {isActive && (
          <section className="widget-code-card">
            <div className="widget-code-heading">
              <div className="widget-code-title">
                <div className="widget-code-icon">
                  <Code2 size={21} />
                </div>

                <div>
                  <span>
                    STEP 03
                  </span>

                  <h2>
                    Install your AI chatbot
                  </h2>
                </div>
              </div>

              <div className="widget-active-badge">
                <CheckCircle2 size={15} />
                Subscription Active
              </div>
            </div>

            <p className="widget-code-description">
              Copy this small code and paste
              it before the closing
              <code>&lt;/body&gt;</code> tag
              of your website. The NeuraBot
              chatbot will then appear on
              your website.
            </p>

            <div className="widget-code-box">
              <pre>
                <code>
                  {widgetCode}
                </code>
              </pre>

              <button
                type="button"
                onClick={copyCode}
                className="copy-code-button"
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Code
                  </>
                )}
              </button>
            </div>

            <div className="widget-code-note">
              <Bot size={17} />

              <p>
                This code is unique to your
                business. Do not share your
                business ID with other
                customers.
              </p>
            </div>
          </section>
        )}

        {/* NO PAYMENT */}

        {!latestPayment && (
          <section className="subscription-empty">
            <div>
              <CreditCard size={30} />
            </div>

            <h2>
              No payment found
            </h2>

            <p>
              Choose a subscription plan
              from your dashboard to start
              using NeuraBot.
            </p>

            <button
              onClick={() =>
                navigate("/dashboard#plans")
              }
            >
              Choose a Plan
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default Subscription;