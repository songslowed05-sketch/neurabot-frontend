import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock3,
  CreditCard,
  Copy,
  ShieldCheck,
} from "lucide-react";
import "./Payment.css";

const plans = {
  monthly: {
    name: "Monthly",
    price: "$50",
    amount: 50,
    duration: "1 Month",
  },
  "six-months": {
    name: "6 Months",
    price: "$150",
    amount: 150,
    duration: "6 Months",
  },
  yearly: {
    name: "Yearly",
    price: "$300",
    amount: 300,
    duration: "1 Year",
  },
};

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedPlanId = location.state?.planId || "monthly";
  const plan = plans[selectedPlanId] || plans.monthly;

  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState(String(plan.amount));

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const bankName = "ASKRI BANK";
  const accountTitle = "SAEED AHMED";
  const iban = "PK46ASCM0002021000000742";

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(iban);
    } catch (error) {
      console.error("COPY IBAN ERROR:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!transactionId.trim()) {
      setError("Please enter your transaction ID.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Your session has expired. Please login again.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "http://localhost:5000/api/payment/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planId: selectedPlanId,
            transactionId: transactionId.trim(),
            amount: Number(amount),
          }),
        }
      );

      const data = await response.json();

      console.log("PAYMENT SUBMIT RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Could not submit payment."
        );
      }

      setSubmitted(true);
    } catch (error) {
      console.error("PAYMENT SUBMIT ERROR:", error);

      setError(
        error.message || "Could not submit payment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="payment-page">
        <div className="payment-glow payment-glow-one" />
        <div className="payment-glow payment-glow-two" />

        <div className="payment-success-card">
          <div className="success-icon">
            <Clock3 size={35} />
          </div>

          <div className="payment-brand">
            <div className="payment-logo">
              <Bot size={20} />
            </div>

            <strong>
              Neura<span>Bot</span>
            </strong>
          </div>

          <h1>Payment submitted</h1>

          <p>
            Your payment request has been sent successfully.
            Our admin will verify your payment before activating
            your subscription.
          </p>

          <div className="waiting-box">
            <Clock3 size={20} />

            <div>
              <strong>Waiting for approval</strong>
              <span>
                Your AI will activate after payment verification.
              </span>
            </div>
          </div>

          <div className="success-plan">
            <span>Selected plan</span>

            <strong>
              {plan.name} — {plan.price}
            </strong>
          </div>

          <button
            className="payment-primary-btn"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-glow payment-glow-one" />
      <div className="payment-glow payment-glow-two" />

      <header className="payment-header">
        <button
          className="payment-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="payment-brand">
          <div className="payment-logo">
            <Bot size={20} />
          </div>

          <strong>
            Neura<span>Bot</span>
          </strong>
        </div>

        <div className="secure-payment">
          <ShieldCheck size={16} />
          Secure Payment
        </div>
      </header>

      <main className="payment-main">
        <div className="payment-heading">
          <span>
            <CreditCard size={15} />
            SUBSCRIPTION PAYMENT
          </span>

          <h1>Activate your AI assistant.</h1>

          <p>
            Complete your payment and submit the transaction
            details. Your subscription will activate after admin
            verification.
          </p>
        </div>

        <div className="payment-layout">
          <section className="payment-card">
            <div className="payment-card-heading">
              <div>
                <span>STEP 01</span>
                <h2>Selected plan</h2>
              </div>

              <CheckCircle2 size={21} />
            </div>

            <div className="selected-plan">
              <div>
                <span>{plan.duration}</span>
                <strong>{plan.name} Plan</strong>
              </div>

              <div className="selected-price">
                <strong>{plan.price}</strong>
                <span>subscription</span>
              </div>
            </div>

            <div className="payment-divider" />

            <div className="payment-card-heading">
              <div>
                <span>STEP 02</span>
                <h2>Send payment</h2>
              </div>

              <CreditCard size={21} />
            </div>

            <div className="bank-details">
              <div className="bank-detail">
                <span>Bank</span>
                <strong>{bankName}</strong>
              </div>

              <div className="bank-detail">
                <span>Account title</span>
                <strong>{accountTitle}</strong>
              </div>

              <div className="bank-detail iban-detail">
                <span>IBAN</span>

                <div>
                  <strong>{iban}</strong>

                  <button
                    type="button"
                    onClick={copyIban}
                    title="Copy IBAN"
                  >
                    <Copy size={15} />
                  </button>
                </div>
              </div>
            </div>

            <div className="payment-warning">
              <ShieldCheck size={18} />

              <p>
                After sending the exact plan amount, enter the
                transaction ID below. Your payment will remain
                pending until an admin verifies it.
              </p>
            </div>

            <form
              className="payment-form"
              onSubmit={handleSubmit}
            >
              <label>Payment amount</label>

              <div className="payment-input">
                <span>$</span>

                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError("");
                  }}
                />
              </div>

              <label>Transaction ID</label>

              <input
                className="transaction-input"
                type="text"
                value={transactionId}
                onChange={(e) => {
                  setTransactionId(e.target.value);
                  setError("");
                }}
                placeholder="Enter your bank transaction ID"
              />

              <p className="input-help">
                Enter the transaction/reference ID shown after
                your payment.
              </p>

              {error && (
                <div className="payment-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="payment-primary-btn"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting payment..."
                  : "Submit Payment for Verification"}
              </button>
            </form>
          </section>

          <aside className="payment-summary">
            <div className="summary-icon">
              <Bot size={24} />
            </div>

            <span>YOUR SUBSCRIPTION</span>

            <h2>{plan.name}</h2>

            <div className="summary-price">
              {plan.price}
            </div>

            <div className="summary-duration">
              <Clock3 size={16} />
              Active for {plan.duration}
            </div>

            <div className="summary-features">
              <div>
                <CheckCircle2 size={16} />
                AI business assistant
              </div>

              <div>
                <CheckCircle2 size={16} />
                Website chatbot
              </div>

              <div>
                <CheckCircle2 size={16} />
                Business knowledge
              </div>

              <div>
                <CheckCircle2 size={16} />
                Customer support automation
              </div>
            </div>

            <div className="summary-note">
              <ShieldCheck size={17} />

              <p>
                Your subscription starts only after the payment
                has been verified by the admin.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Payment;