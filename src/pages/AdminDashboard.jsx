import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Check,
  Clock,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";
import "./AdminDashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("Admin login required.");
      }

      const response = await fetch(
        `${API_URL}/api/payment/all`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not load payments."
        );
      }

      setPayments(data.payments || []);
    } catch (err) {
      console.error("LOAD PAYMENTS ERROR:", err);
      setError(
        err.message || "Could not load payment requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const verifyPayment = async (paymentId, approved) => {
    try {
      setProcessingId(paymentId);
      setError("");
      setMessage("");

      if (!token) {
        throw new Error("Admin login required.");
      }

      const response = await fetch(
        `${API_URL}/api/payment/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentId,
            approved,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Payment verification failed."
        );
      }

      setMessage(
        approved
          ? "Payment approved and subscription activated."
          : "Payment rejected successfully."
      );

      await loadPayments();
    } catch (err) {
      console.error("VERIFY PAYMENT ERROR:", err);

      setError(
        err.message || "Could not verify payment."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const pendingPayments = payments.filter(
    (payment) => payment.status === "pending"
  );

  const paidPayments = payments.filter(
    (payment) => payment.status === "paid"
  );

  const rejectedPayments = payments.filter(
    (payment) => payment.status === "rejected"
  );

  return (
    <div className="admin-page">

      <div className="admin-glow admin-glow-one" />
      <div className="admin-glow admin-glow-two" />

      {/* HEADER */}

      <header className="admin-header">

        <div className="admin-brand">

          <div className="admin-logo">
            <Bot size={23} />
          </div>

          <div>
            <strong>
              Neura<span>Bot</span>
            </strong>

            <small>
              Admin Control Center
            </small>
          </div>

        </div>

        <div className="admin-header-right">

          <div className="admin-status">
            <span />
            Admin Online
          </div>

          <button
            className="refresh-btn"
            onClick={loadPayments}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? "spin" : ""}
            />

            Refresh
          </button>

        </div>

      </header>

      {/* MAIN */}

      <main className="admin-main">

        <div className="admin-title">

          <div>
            <span className="admin-eyebrow">
              <ShieldCheck size={15} />
              ADMIN DASHBOARD
            </span>

            <h1>
              Payment Verification
            </h1>

            <p>
              Review customer payments and activate
              subscriptions after verification.
            </p>
          </div>

        </div>

        {/* MESSAGES */}

        {error && (
          <motion.div
            className="admin-message error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {message && (
          <motion.div
            className="admin-message success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Check size={17} />
            {message}
          </motion.div>
        )}

        {/* STATS */}

        <section className="admin-stats">

          <div className="admin-stat">

            <div className="stat-icon pending">
              <Clock size={20} />
            </div>

            <div>
              <span>Pending</span>
              <strong>
                {pendingPayments.length}
              </strong>
            </div>

          </div>

          <div className="admin-stat">

            <div className="stat-icon paid">
              <Check size={20} />
            </div>

            <div>
              <span>Paid</span>
              <strong>
                {paidPayments.length}
              </strong>
            </div>

          </div>

          <div className="admin-stat">

            <div className="stat-icon rejected">
              <X size={20} />
            </div>

            <div>
              <span>Rejected</span>
              <strong>
                {rejectedPayments.length}
              </strong>
            </div>

          </div>

          <div className="admin-stat">

            <div className="stat-icon revenue">
              <CreditCard size={20} />
            </div>

            <div>
              <span>Total Payments</span>
              <strong>
                {payments.length}
              </strong>
            </div>

          </div>

        </section>

        {/* PAYMENT VERIFICATION */}

        <section className="payment-section">

          <div className="payment-section-header">

            <div>

              <span className="section-label">
                PAYMENT REQUESTS
              </span>

              <h2>
                Payment Verification
              </h2>

            </div>

            <div className="pending-count">
              {pendingPayments.length} Pending
            </div>

          </div>

          {loading ? (

            <div className="admin-loading">

              <div className="admin-spinner" />

              <p>
                Loading payment requests...
              </p>

            </div>

          ) : pendingPayments.length === 0 ? (

            <div className="empty-payments">

              <div className="empty-icon">
                <Check size={25} />
              </div>

              <h3>
                No pending payments
              </h3>

              <p>
                New customer payment requests will
                appear here.
              </p>

            </div>

          ) : (

            <div className="payments-list">

              {pendingPayments.map((payment) => (

                <motion.div
                  className="payment-card"
                  key={payment.id}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                >

                  <div className="payment-main">

                    <div className="payment-customer">

                      <div className="customer-avatar">
                        {payment.customer?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "C"}
                      </div>

                      <div>

                        <strong>
                          {payment.customer?.name ||
                            "Unknown Customer"}
                        </strong>

                        <span>
                          {payment.customer?.email ||
                            "No email"}
                        </span>

                      </div>

                    </div>

                    <div className="payment-status pending-status">
                      <Clock size={14} />
                      Pending
                    </div>

                  </div>

                  <div className="payment-details">

                    <div className="payment-detail">

                      <span>Business</span>

                      <strong>
                        {payment.business?.name ||
                          "Unknown Business"}
                      </strong>

                    </div>

                    <div className="payment-detail">

                      <span>Plan</span>

                      <strong>
                        {payment.plan_id ===
                        "monthly"
                          ? "Monthly"
                          : payment.plan_id ===
                            "six-months"
                          ? "6 Months"
                          : payment.plan_id ===
                            "yearly"
                          ? "Yearly"
                          : payment.plan_id}
                      </strong>

                    </div>

                    <div className="payment-detail">

                      <span>Amount</span>

                      <strong>
                        ${payment.amount}
                      </strong>

                    </div>

                    <div className="payment-detail">

                      <span>Transaction ID</span>

                      <strong className="transaction-id">
                        {payment.transaction_id}
                      </strong>

                    </div>

                  </div>

                  <div className="payment-footer">

                    <span className="submitted-time">
                      Submitted{" "}
                      {payment.created_at
                        ? new Date(
                            payment.created_at
                          ).toLocaleString()
                        : "Recently"}
                    </span>

                    <div className="payment-actions">

                      <button
                        className="reject-payment"
                        disabled={
                          processingId === payment.id
                        }
                        onClick={() =>
                          verifyPayment(
                            payment.id,
                            false
                          )
                        }
                      >

                        <X size={16} />

                        {processingId === payment.id
                          ? "Processing..."
                          : "Reject"}

                      </button>

                      <button
                        className="approve-payment"
                        disabled={
                          processingId === payment.id
                        }
                        onClick={() =>
                          verifyPayment(
                            payment.id,
                            true
                          )
                        }
                      >

                        <Check size={16} />

                        {processingId === payment.id
                          ? "Processing..."
                          : "Approve Payment"}

                      </button>

                    </div>

                  </div>

                </motion.div>

              ))}

            </div>

          )}

        </section>

        {/* PAYMENT HISTORY */}

        <section className="history-section">

          <div className="payment-section-header">

            <div>

              <span className="section-label">
                HISTORY
              </span>

              <h2>
                Payment History
              </h2>

            </div>

          </div>

          {payments.length === 0 ? (

            <div className="empty-payments">
              No payment history yet.
            </div>

          ) : (

            <div className="history-list">

              {payments.map((payment) => (

                <div
                  className="history-row"
                  key={payment.id}
                >

                  <div>

                    <strong>
                      {payment.customer?.name ||
                        "Unknown"}
                    </strong>

                    <span>
                      {payment.customer?.email ||
                        ""}
                    </span>

                  </div>

                  <span>
                    {payment.plan_id}
                  </span>

                  <strong>
                    ${payment.amount}
                  </strong>

                  <span
                    className={`history-status ${payment.status}`}
                  >
                    {payment.status}
                  </span>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;