import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Clock3,
  Menu,
  MessageCircle,
  Send,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Payment from "./pages/Payment";
import Subscription from "./pages/Subscription";
import InstallNeuraBot from "./pages/InstallNeuraBot";

import "./App.css";

/* =========================================
   DEMO AI REPLIES
========================================= */

const demoReplies = {
  hours:
    "We're open Monday–Sunday from 11:00 AM to 11:00 PM. Our AI can also answer questions about today's availability.",

  menu:
    "Our demo restaurant serves burgers, pizzas, pasta, salads and desserts. You can ask me about any item or its price.",

  booking:
    "Absolutely! I can help with reservations. Tell me your preferred date, time and number of guests.",

  services:
    "We offer dine-in, takeaway and table reservations. Our AI assistant can guide customers through all three.",
};

/* =========================================
   LANDING PAGE
========================================= */

function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text: "Hi! 👋 I'm the AI assistant for Bella Bistro. Ask me about our menu, opening hours, or reservations.",
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  /* =========================================
     SEND DEMO MESSAGE
  ========================================= */

  const sendMessage = (text = input) => {
    const value = text.trim();

    if (!value || typing) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "user",
        text: value,
      },
    ]);

    setInput("");
    setTyping(true);

    setTimeout(() => {
      const lower = value.toLowerCase();

      let reply =
        "I can help with Bella Bistro's menu, opening hours, services and table reservations. What would you like to know?";

      if (
        lower.includes("hour") ||
        lower.includes("open") ||
        lower.includes("close") ||
        lower.includes("time")
      ) {
        reply = demoReplies.hours;
      } else if (
        lower.includes("menu") ||
        lower.includes("food") ||
        lower.includes("price")
      ) {
        reply = demoReplies.menu;
      } else if (
        lower.includes("book") ||
        lower.includes("reservation") ||
        lower.includes("table")
      ) {
        reply = demoReplies.booking;
      } else if (
        lower.includes("service") ||
        lower.includes("offer") ||
        lower.includes("takeaway")
      ) {
        reply = demoReplies.services;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "ai",
          text: reply,
        },
      ]);

      setTyping(false);
    }, 900);
  };

  /* =========================================
     FAQ DATA
  ========================================= */

  const faqs = [
    {
      q: "Can the AI learn my business information?",
      a: "Yes. You provide your business information, services, products, hours, FAQs and other details. The AI uses that knowledge to answer your customers.",
    },

    {
      q: "Can it work on my existing website?",
      a: "Yes. After your plan is activated, you receive a lightweight chatbot widget code that can be added to your existing website.",
    },

    {
      q: "Can customers make bookings?",
      a: "Yes. Booking support can be configured for each individual business.",
    },

    {
      q: "Will different businesses share the same data?",
      a: "No. Every business has its own account and isolated business information. One business's information is never used as another business's knowledge.",
    },
  ];

  return (
    <div className="app">

      {/* BACKGROUND */}
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      {/* =========================================
          NAVBAR
      ========================================= */}

      <nav className="navbar">

        <div className="logo">

          <div className="logo-icon">
            <Bot size={21} />
          </div>

          <span>
            Neura<span>Bot</span>
          </span>

        </div>

        <div className="nav-links">

          <a href="#features">
            Features
          </a>

          <a href="#how">
            How it works
          </a>

          <a href="#pricing">
            Pricing
          </a>

          <a href="#faq">
            FAQ
          </a>

        </div>

        <div className="nav-actions">

          <Link
            to="/login"
            className="login-btn"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="nav-cta"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>

        </div>

        <button
          type="button"
          className="mobile-menu"
        >
          <Menu size={23} />
        </button>

      </nav>

      {/* =========================================
          HERO
      ========================================= */}

      <main>

        <section className="hero">

          <div className="hero-content">

            <motion.div
              className="badge"
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <Sparkles size={15} />

              AI customer support, reimagined
            </motion.div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
            >
              Your business.
              <br />

              <span>
                Your AI assistant.
              </span>

            </motion.h1>

            <motion.p
              className="hero-text"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
            >
              Give your customers instant answers,
              support and booking assistance with an
              AI chatbot trained on your business.
            </motion.p>

            <motion.div
              className="hero-buttons"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.3,
              }}
            >

              <button
                type="button"
                className="primary-btn"
                onClick={() => setDemoOpen(true)}
              >
                Try Live Demo

                <ArrowRight size={18} />
              </button>

              <a
                className="secondary-btn"
                href="#how"
              >
                See how it works
              </a>

            </motion.div>

            <div className="trust-row">

              <div className="avatars">
                <span>R</span>
                <span>S</span>
                <span>A</span>
                <span>+</span>
              </div>

              <p>
                Built for modern businesses
              </p>

            </div>

          </div>

          {/* =========================================
              HERO CHAT
          ========================================= */}

          <motion.div
            className="hero-chat"
            initial={{
              opacity: 0,
              scale: 0.92,
              x: 35,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >

            <div className="chat-window">

              <div className="chat-header">

                <div className="business-avatar">
                  <Bot size={22} />
                </div>

                <div>

                  <strong>
                    Bella Bistro AI
                  </strong>

                  <small>
                    <i />
                    Online now
                  </small>

                </div>

                <div className="header-spark">
                  <Sparkles size={18} />
                </div>

              </div>

              <div className="chat-body">

                <div className="date-label">
                  TODAY
                </div>

                <div className="message ai-message">
                  Hi! 👋 Welcome to Bella Bistro.
                  <br />
                  How can I help you today?
                </div>

                <div className="message user-message">
                  What time do you close?
                </div>

                <div className="message ai-message">
                  We're open until{" "}
                  <b>11:00 PM</b> every day.
                  <br />
                  Would you like to make a reservation?
                </div>

                <div className="suggestions">

                  <button
                    type="button"
                    onClick={() => setDemoOpen(true)}
                  >
                    🍽️ View menu
                  </button>

                  <button
                    type="button"
                    onClick={() => setDemoOpen(true)}
                  >
                    📅 Book a table
                  </button>

                </div>

              </div>

              <div className="chat-input-preview">

                Ask anything...

                <div>
                  <Send size={16} />
                </div>

              </div>

            </div>

          </motion.div>

        </section>

        {/* =========================================
            FEATURES
        ========================================= */}

        <section
          className="section"
          id="features"
        >

          <div className="section-heading">

            <div className="mini-badge">

              <Zap size={14} />

              Powerful by design

            </div>

            <h2>
              Everything your customers need.
            </h2>

            <p>
              One intelligent assistant that understands
              your business and helps your customers
              around the clock.
            </p>

          </div>

          <div className="feature-grid">

            <Feature
              icon={<MessageCircle />}
              title="Instant Answers"
              text="Answer common customer questions instantly, 24/7."
            />

            <Feature
              icon={<Clock3 />}
              title="Always Available"
              text="Keep helping customers even when your team is offline."
            />

            <Feature
              icon={<Sparkles />}
              title="Business Knowledge"
              text="Train the assistant with your own business information."
            />

            <Feature
              icon={<Check />}
              title="Booking Support"
              text="Guide customers through reservations and requests."
            />

          </div>

        </section>

        {/* =========================================
            HOW IT WORKS
        ========================================= */}

        <section
          className="section how-section"
          id="how"
        >

          <div className="section-heading">

            <div className="mini-badge">

              <Sparkles size={14} />

              Simple setup

            </div>

            <h2>
              From your business to AI in minutes.
            </h2>

            <p>
              No complicated AI setup. Just provide
              your business knowledge.
            </p>

          </div>

          <div className="steps">

            <Step
              number="01"
              title="Tell us about your business"
              text="Add your business name, services, hours, menu, FAQs and other information."
            />

            <Step
              number="02"
              title="Your AI learns"
              text="Your information becomes the knowledge behind your dedicated AI assistant."
            />

            <Step
              number="03"
              title="Activate your plan"
              text="Select a plan, submit your payment and wait for admin verification."
            />

            <Step
              number="04"
              title="Add the chatbot"
              text="After payment approval, receive a small widget code and add only the chatbot to your website."
            />

          </div>

        </section>

        {/* =========================================
            PRICING
        ========================================= */}

        <section
          className="section pricing-section"
          id="pricing"
        >

          <div className="section-heading">

            <div className="mini-badge">

              <Zap size={14} />

              Simple pricing

            </div>

            <h2>
              Choose your AI plan.
            </h2>

            <p>
              Select a plan and continue to secure
              payment verification.
            </p>

          </div>

         <div className="pricing-grid">

  <PricingCard
    title="Monthly"
    price="$29"
    duration="per month"
    planId="monthly"
    description="Perfect for getting started."
  />

  <PricingCard
    title="6 Months"
    price="$150"
    duration="six moths"
    planId="six-months"
    description="For businesses that want longer coverage."
    
  />

  <PricingCard
    title="Yearly"
    price="$249"
    duration="per year"
    planId="yearly"
    description="Best for long-term business use."
  />

</div>
        </section>

        {/* =========================================
            FAQ
        ========================================= */}

        <section
          className="section faq-section"
          id="faq"
        >

          <div className="section-heading">

            <div className="mini-badge">

              <MessageCircle size={14} />

              FAQ

            </div>

            <h2>
              Questions, answered.
            </h2>

          </div>

          <div className="faq-list">

            {faqs.map((faq, index) => (

              <div
                className="faq-item"
                key={faq.q}
              >

                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(
                      openFaq === index
                        ? null
                        : index
                    )
                  }
                >

                  {faq.q}

                  <ChevronDown
                    size={19}
                    className={
                      openFaq === index
                        ? "rotate"
                        : ""
                    }
                  />

                </button>

                <AnimatePresence>

                  {openFaq === index && (

                    <motion.div
                      className="faq-answer"
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                    >
                      {faq.a}
                    </motion.div>

                  )}

                </AnimatePresence>

              </div>

            ))}

          </div>

        </section>

      </main>

      {/* =========================================
          FOOTER
      ========================================= */}

      <footer>

        <div className="logo">

          <div className="logo-icon">
            <Bot size={19} />
          </div>

          <span>
            Neura<span>Bot</span>
          </span>

        </div>

        <p>
          AI-powered customer support for modern businesses.
        </p>

        <span className="copyright">
          © 2026 NeuraBot
        </span>

      </footer>

      {/* =========================================
          DEMO MODAL
      ========================================= */}

      <AnimatePresence>

        {demoOpen && (

          <motion.div
            className="demo-overlay"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => setDemoOpen(false)}
          >

            <motion.div
              className="demo-modal"
              initial={{
                opacity: 0,
                y: 35,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 35,
                scale: 0.96,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="demo-top">

                <div className="demo-business">

                  <div className="business-avatar">
                    <Bot size={22} />
                  </div>

                  <div>

                    <strong>
                      Bella Bistro AI
                    </strong>

                    <small>
                      <i />
                      AI Assistant
                    </small>

                  </div>

                </div>

                <button
                  type="button"
                  className="close-demo"
                  onClick={() =>
                    setDemoOpen(false)
                  }
                >
                  <X size={20} />
                </button>

              </div>

              <div className="demo-messages">

                {messages.map((message) => (

                  <motion.div
                    key={message.id}
                    className={`demo-message ${
                      message.type === "user"
                        ? "demo-user"
                        : "demo-ai"
                    }`}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                  >
                    {message.text}
                  </motion.div>

                ))}

                {typing && (

                  <div className="typing">
                    <span />
                    <span />
                    <span />
                  </div>

                )}

              </div>

              <div className="quick-actions">

                <button
                  type="button"
                  onClick={() =>
                    sendMessage(
                      "What are your opening hours?"
                    )
                  }
                >
                  Opening hours
                </button>

                <button
                  type="button"
                  onClick={() =>
                    sendMessage(
                      "Can I see the menu?"
                    )
                  }
                >
                  View menu
                </button>

                <button
                  type="button"
                  onClick={() =>
                    sendMessage(
                      "Can I book a table?"
                    )
                  }
                >
                  Book a table
                </button>

              </div>

              <form
                className="demo-input"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >

                <input
                  value={input}
                  onChange={(e) =>
                    setInput(e.target.value)
                  }
                  placeholder="Ask Bella Bistro AI..."
                />

                <button type="submit">
                  <Send size={18} />
                </button>

              </form>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}

/* =========================================
   FEATURE
========================================= */

function Feature({
  icon,
  title,
  text,
}) {
  return (
    <motion.div
      className="feature-card"
      whileHover={{
        y: -7,
      }}
      transition={{
        duration: 0.2,
      }}
    >

      <div className="feature-icon">
        {icon}
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </motion.div>
  );
}

/* =========================================
   STEP
========================================= */

function Step({
  number,
  title,
  text,
}) {
  return (
    <div className="step">

      <span>
        {number}
      </span>

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {text}
        </p>

      </div>

    </div>
  );
}

/* =========================================
   PRICING CARD
========================================= */

/* =========================================
   PRICING CARD
========================================= */

function PricingCard({
  title,
  price,
  duration,
  description,
  featured = false,
}) {
  return (
    <motion.div
      className={`pricing-card ${
        featured ? "pricing-featured" : ""
      }`}
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.25,
      }}
    >

      {featured && (
        <div className="pricing-popular">
          Most Popular
        </div>
      )}

      <h3>
        {title}
      </h3>

      <div className="pricing-price">

        <strong>
          {price}
        </strong>

        <span>
          {duration}
        </span>

      </div>

      <p>
        {description}
      </p>

      <ul>

        <li>
          <Check size={16} />
          <span>Dedicated AI assistant</span>
        </li>

        <li>
          <Check size={16} />
          <span>Business knowledge</span>
        </li>

        <li>
          <Check size={16} />
          <span>Website chatbot widget</span>
        </li>

        <li>
          <Check size={16} />
          <span>Subscription management</span>
        </li>

      </ul>

    </motion.div>
  );
}
/* =========================================
   APP ROUTES
========================================= */

function App() {
  return (
    <Routes>

      {/* LANDING */}
      <Route
        path="/"
        element={<LandingPage />}
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* SIGNUP */}
      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* USER DASHBOARD */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      {/* PAYMENT PAGE */}
      <Route
        path="/payment"
        element={<Payment />}
        
      />
{/* SUBSCRIPTION PAGE */}
<Route
  path="/subscription"
  element={<Subscription />}
/>
<Route
  path="/install-neurabot"
  element={<InstallNeuraBot />}
/>

      {/* 404 */}
      <Route
        path="*"
        element={
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "15px",
              background: "#070b14",
              color: "#ffffff",
            }}
          >

            <h1>
              404
            </h1>

            <p>
              Page not found.
            </p>

            <Link
              to="/"
              style={{
                color: "#7c5cff",
                textDecoration: "none",
              }}
            >
              Back to Home
            </Link>

          </div>
        }
      />

    </Routes>
  );
}

export default App;