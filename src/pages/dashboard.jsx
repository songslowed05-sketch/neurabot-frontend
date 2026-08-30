import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Building2,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  Menu,
  Plus,
  Save,
  Sparkles,
  Trash2,
  UserRound,
  X,
  Zap,
} from "lucide-react";

import { getBusiness, saveBusiness } from "../services/api";
import "./Dashboard.css";

const categories = [
  "Restaurant",
  "Salon / Beauty",
  "Gym / Fitness",
  "Clinic / Healthcare",
  "Hotel",
  "Real Estate",
  "E-commerce",
  "Education",
  "Agency",
  "Other",
];

const plans = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$50",
    period: "/ month",
    description:
      "Perfect for businesses that want flexible monthly access.",
    popular: false,
  },
  {
    id: "six-months",
    name: "6 Months",
    price: "$150",
    period: "/ 6 months",
    description:
      "Save more with six months of continuous AI support.",
    popular: true,
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "$300",
    period: "/ year",
    description:
      "Best value for businesses using AI throughout the year.",
    popular: false,
  },
];

function Dashboard() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const navigate = useNavigate();
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingBusiness, setLoadingBusiness] = useState(true);
  const [savingBusiness, setSavingBusiness] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [business, setBusiness] = useState({
    category: "",
    name: "",
    location: "",
    phone: "",
    email: "",
    website: "",
    openingTime: "",
    closingTime: "",
    services: "",
    mainInfo: "",
    customInfo: "",
  });

  const [items, setItems] = useState([
    {
      id: `new-${Date.now()}`,
      name: "",
      price: "",
      description: "",
    },
  ]);

  const [selectedPlan, setSelectedPlan] = useState(null);

  const [userName, setUserName] = useState("Business Owner");

  /* =========================
     AI TEST STATES
  ========================= */

  const [aiTestMessage, setAiTestMessage] = useState("");
  const [aiTestAnswer, setAiTestAnswer] = useState("");
  const [aiTesting, setAiTesting] = useState(false);
  const [aiTestError, setAiTestError] = useState("");

  /* =========================
     LOAD USER
  ========================= */

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user?.name) {
          setUserName(user.name);
        }
      }
    } catch (error) {
      console.error("USER LOAD ERROR:", error);
    }
  }, []);

  /* =========================
     LOAD BUSINESS
  ========================= */

  useEffect(() => {
    const loadBusiness = async () => {
      try {
        setLoadingBusiness(true);
        setErrorMessage("");

        const data = await getBusiness();

        console.log("BUSINESS DATA:", data);

        if (!data || !data.business) {
          setLoadingBusiness(false);
          return;
        }

        const b = data.business;

        setBusiness({
          category: b.category || "",
          name: b.name || "",
          location: b.location || "",
          phone: b.phone || "",
          email: b.email || "",
          website: b.website || "",
          openingTime:
            b.opening_time ||
            b.openingTime ||
            "",
          closingTime:
            b.closing_time ||
            b.closingTime ||
            "",
          services: b.services || "",
          mainInfo:
            b.main_info ||
            b.mainInfo ||
            "",
          customInfo:
            b.custom_info ||
            b.customInfo ||
            "",
        });

        /* Existing products/services */

        if (
          Array.isArray(data.items) &&
          data.items.length > 0
        ) {
          setItems(
            data.items.map((item) => ({
              id: item.id,
              name: item.name || "",
              price: item.price || "",
              description:
                item.description || "",
            }))
          );
        }

        /* Existing plan */

        /* =========================
   LOAD ACTIVE SUBSCRIPTION
========================= */

const token = localStorage.getItem("token");

if (token) {
  try {
    const subscriptionResponse = await fetch(
  `${import.meta.env.VITE_API_URL}/api/payment/my-status`,
  {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const subscriptionData =
      await subscriptionResponse.json();

    console.log(
      "DASHBOARD SUBSCRIPTION:",
      subscriptionData
    );

    if (subscriptionResponse.ok) {
      /* =========================
         FIRST: ACTIVE SUBSCRIPTION
      ========================= */

      const activeSubscription =
        subscriptionData.subscription;

      if (
        activeSubscription &&
        activeSubscription.status === "active"
      ) {
        const matchedPlan = plans.find(
          (plan) =>
            plan.id === activeSubscription.plan_id ||
            plan.name.toLowerCase() ===
              String(
                activeSubscription.plan_name || ""
              ).toLowerCase()
        );

        if (matchedPlan) {
          console.log(
            "ACTIVE PLAN FROM SUBSCRIPTION:",
            matchedPlan
          );

          setSelectedPlan(matchedPlan.id);
        }
      } else {
        /* =========================
           FALLBACK: PAID PAYMENT
        ========================= */

        const payments =
          Array.isArray(subscriptionData.payments)
            ? subscriptionData.payments
            : [];

        const paidPayment = payments.find(
          (payment) =>
            payment.status === "paid" ||
            payment.status === "approved"
        );

        if (paidPayment) {
          console.log(
            "ACTIVE PLAN FROM PAID PAYMENT:",
            paidPayment
          );

          const paymentPlanId =
            paidPayment.plan_id;

          const paymentPlanName =
            paidPayment.plans?.name;

          const matchedPlan = plans.find(
            (plan) =>
              plan.id === paymentPlanId ||
              plan.name.toLowerCase() ===
                String(
                  paymentPlanName || ""
                ).toLowerCase()
          );

          if (matchedPlan) {
            console.log(
              "MATCHED PAID PLAN:",
              matchedPlan
            );

            setSelectedPlan(matchedPlan.id);
          }
        }
      }
    }
  } catch (subscriptionError) {
    console.error(
      "DASHBOARD SUBSCRIPTION ERROR:",
      subscriptionError
    );
  }
}
      } catch (error) {
        console.error(
          "LOAD BUSINESS ERROR:",
          error
        );

        setErrorMessage(
          error?.message ||
            "Could not load your business information."
        );
      } finally {
        setLoadingBusiness(false);
      }
    };

    loadBusiness();
  }, []);

  /* =========================
     UPDATE BUSINESS
  ========================= */

  const updateBusiness = (field, value) => {
    setBusiness((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSaveMessage("");
    setErrorMessage("");
  };

  /* =========================
     ADD ITEM
  ========================= */

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}-${Math.random()}`,
        name: "",
        price: "",
        description: "",
      },
    ]);

    setSaveMessage("");
    setErrorMessage("");
  };

  /* =========================
     UPDATE ITEM
  ========================= */

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );

    setSaveMessage("");
    setErrorMessage("");
  };

  /* =========================
     REMOVE ITEM
  ========================= */

  const removeItem = (id) => {
    setItems((prev) =>
      prev.filter((item) => item.id !== id)
    );

    setSaveMessage("");
    setErrorMessage("");
  };

  /* =========================
     SAVE BUSINESS
  ========================= */

  const handleSave = async (e) => {
    e.preventDefault();

    if (savingBusiness) return;

    setSavingBusiness(true);
    setSaveMessage("");
    setErrorMessage("");

    try {
      const cleanItems = items
        .filter(
          (item) =>
            item.name?.trim() ||
            item.price?.trim() ||
            item.description?.trim()
        )
        .map((item) => ({
          id: item.id,
          name: item.name?.trim() || "",
          price: item.price?.trim() || "",
          description:
            item.description?.trim() || "",
        }));

      const payload = {
        business: {
          category: business.category,
          name: business.name,
          location: business.location,
          phone: business.phone,
          email: business.email,
          website: business.website,
          openingTime: business.openingTime,
          closingTime: business.closingTime,
          services: business.services,
          mainInfo: business.mainInfo,
          customInfo: business.customInfo,
          plan: selectedPlan,
        },

        items: cleanItems,
      };

      console.log(
        "SAVING BUSINESS:",
        payload
      );

      await saveBusiness(payload);

      setSaveMessage(
        "Business information saved successfully."
      );

      setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "SAVE BUSINESS ERROR:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Could not save business information."
      );
    } finally {
      setSavingBusiness(false);
    }
  };

  /* =========================
     AI TEST
  ========================= */

  const handleAITest = async () => {
    if (!aiTestMessage.trim()) {
      setAiTestError(
        "Please enter a message."
      );
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      setAiTestError(
        "You are not logged in."
      );
      return;
    }

    try {
      setAiTesting(true);
      setAiTestAnswer("");
      setAiTestError("");

     const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/ai/chat`,
  {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message:
              aiTestMessage.trim(),
          }),
        }
      );

      const data = await response.json();

      console.log(
        "AI TEST RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "AI request failed"
        );
      }

      setAiTestAnswer(
        data.answer ||
          "AI returned an empty response."
      );
    } catch (error) {
      console.error(
        "AI TEST ERROR:",
        error
      );

      setAiTestError(
        error?.message ||
          "Could not connect to AI."
      );
    } finally {
      setAiTesting(false);
    }
  };

  /* =========================
     CURRENT PLAN
  ========================= */

  const currentPlanName = selectedPlan
    ? plans.find(
        (plan) =>
          plan.id === selectedPlan
      )?.name
    : null;

  return (
    <div className="dashboard-page">
    <button
  type="button"
  className="dashboard-mobile-menu"
  onClick={() => setMobileMenuOpen((prev) => !prev)}
  aria-label="Toggle dashboard menu"
>
  {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
</button>

<aside
  className={`dashboard-sidebar ${
    mobileMenuOpen ? "mobile-sidebar-open" : ""
  }`}
></aside>
      <div className="dashboard-glow dashboard-glow-one" />
      <div className="dashboard-glow dashboard-glow-two" />

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="dashboard-logo-icon">
            <Bot size={22} />
          </div>

          <div>
            <strong>
              Neura<span>Bot</span>
            </strong>

            <small>
              AI Business Platform
            </small>
          </div>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            <UserRound size={19} />
          </div>

          <div>
            <strong>{userName}</strong>
            <span>Business Owner</span>
          </div>
        </div>

        <nav className="dashboard-nav">

  <a href="#overview">
    <Building2 size={18} />
    Business Setup
  </a>

  <a href="#plans">
    <CreditCard size={18} />
    Plans
  </a>

  <a href="#ai-test">
    <Bot size={18} />
    AI Test
  </a>

  <a href="#chatbot">
    <Bot size={18} />
    AI Chatbot
  </a>

  <button
    type="button"
    onClick={() => navigate("/subscription")}
    style={{
      width: "100%",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      font: "inherit",
      textAlign: "left",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    }}
  >
    <CreditCard size={18} />
    Subscription
  </button>
<button
  type="button"
  onClick={() => navigate("/install-neurabot")}
  style={{
    width: "100%",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    font: "inherit",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
  <Bot size={18} />
  Install NeuraBot
</button>
</nav>

        <div className="sidebar-bottom">
          <div className="sidebar-ai">
            <div className="sidebar-ai-icon">
              <Sparkles size={17} />
            </div>

            <div>
              <strong>
                AI Assistant
              </strong>

              <span>
                {loadingBusiness
                  ? "Loading..."
                  : business.name
                  ? "Business connected"
                  : "Ready to setup"}
              </span>
            </div>
          </div>

          <button
            className="sidebar-logout"
            onClick={() => {
              localStorage.removeItem(
                "token"
              );
              localStorage.removeItem(
                "user"
              );

              window.location.href =
                "/login";
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <main className="dashboard-main">
        {/* HEADER */}

        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">
              <Sparkles size={14} />
              Business Dashboard
            </span>

            <h1>
              Build your{" "}
              <span>
                AI assistant.
              </span>
            </h1>

            <p>
              Add your business information
              and let NeuraBot handle
              customer questions
              automatically.
            </p>
          </div>

          <div className="header-status">
            <span className="status-dot" />

            {loadingBusiness
              ? "Loading business"
              : business.name
              ? "Business connected"
              : "Setup in progress"}
          </div>
        </header>

        {/* OVERVIEW */}

        <section
          className="dashboard-overview"
          id="overview"
        >
          <motion.div
            className="overview-card"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div className="overview-icon">
              <Building2 size={21} />
            </div>

            <div>
              <span>Business</span>

              <strong>
                {loadingBusiness
                  ? "Loading..."
                  : business.name ||
                    "Not added yet"}
              </strong>
            </div>
          </motion.div>

          <motion.div
            className="overview-card"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.08,
            }}
          >
            <div className="overview-icon">
              <Bot size={21} />
            </div>

            <div>
              <span>AI Status</span>

              <strong>
                {business.name
                  ? "Ready for testing"
                  : "Waiting for business"}
              </strong>
            </div>
          </motion.div>

          <motion.div
            className="overview-card"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.16,
            }}
          >
            <div className="overview-icon">
              <CreditCard size={21} />
            </div>

            <div>
              <span>
                Current Plan
              </span>

              <strong>
                {currentPlanName ||
                  "No plan selected"}
              </strong>
            </div>
          </motion.div>
        </section>

        {/* GLOBAL ERROR */}

        {errorMessage && (
          <motion.div
            className="dashboard-error"
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            {errorMessage}
          </motion.div>
        )}

        {/* BUSINESS SETUP */}

        <motion.section
          className="dashboard-card business-card"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
        >
          <div className="card-heading">
            <div className="card-heading-icon">
              <Building2 size={20} />
            </div>

            <div>
              <span className="card-label">
                STEP 01
              </span>

              <h2>
                Setup your business
              </h2>

              <p>
                Tell NeuraBot about your
                business so your AI can
                answer customers accurately.
              </p>
            </div>
          </div>

          {loadingBusiness ? (
            <div className="dashboard-loading">
              <div className="loading-spinner" />

              <p>
                Loading your business
                information...
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSave}
            >
              {/* BASIC INFORMATION */}

              <div className="form-section">
                <div className="form-section-title">
                  <Sparkles size={16} />
                  Basic information
                </div>

                <div className="form-grid">
                  {/* CATEGORY */}

                  <div className="form-group">
                    <label>
                      Business category
                    </label>

                    <div className="custom-select">
                      <button
                        type="button"
                        className="select-button"
                        onClick={() =>
                          setCategoryOpen(
                            !categoryOpen
                          )
                        }
                      >
                        <span>
                          {business.category ||
                            "Select your category"}
                        </span>

                        <ChevronDown
                          size={18}
                          className={
                            categoryOpen
                              ? "chevron-up"
                              : ""
                          }
                        />
                      </button>

                      {categoryOpen && (
                        <div className="select-menu">
                          {categories.map(
                            (category) => (
                              <button
                                type="button"
                                key={category}
                                onClick={() => {
                                  updateBusiness(
                                    "category",
                                    category
                                  );

                                  setCategoryOpen(
                                    false
                                  );
                                }}
                              >
                                {category}

                                {business.category ===
                                  category && (
                                  <Check
                                    size={15}
                                  />
                                )}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* NAME */}

                  <div className="form-group">
                    <label>
                      Business name
                    </label>

                    <div className="input-with-icon">
                      <Building2
                        size={17}
                      />

                      <input
                        type="text"
                        placeholder="e.g. Bella Bistro"
                        value={
                          business.name
                        }
                        onChange={(e) =>
                          updateBusiness(
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* LOCATION */}

                  <div className="form-group">
                    <label>
                      Business location
                    </label>

                    <div className="input-with-icon">
                      <MapPin
                        size={17}
                      />

                      <input
                        type="text"
                        placeholder="City / Area / Location"
                        value={
                          business.location
                        }
                        onChange={(e) =>
                          updateBusiness(
                            "location",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* PHONE */}

                  <div className="form-group">
                    <label>
                      Contact number
                    </label>

                    <div className="input-with-icon">
                      <Phone
                        size={17}
                      />

                      <input
                        type="tel"
                        placeholder="+92 300 1234567"
                        value={
                          business.phone
                        }
                        onChange={(e) =>
                          updateBusiness(
                            "phone",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* EMAIL */}

                  <div className="form-group">
                    <label>
                      Business email
                    </label>

                    <div className="input-with-icon">
                      <Mail size={17} />

                      <input
                        type="email"
                        placeholder="business@example.com"
                        value={
                          business.email
                        }
                        onChange={(e) =>
                          updateBusiness(
                            "email",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* WEBSITE */}

                  <div className="form-group">
                    <label>
                      Website{" "}
                      <small>
                        (optional)
                      </small>
                    </label>

                    <div className="input-with-icon">
                      <Globe
                        size={17}
                      />

                      <input
                        type="url"
                        placeholder="https://yourwebsite.com"
                        value={
                          business.website
                        }
                        onChange={(e) =>
                          updateBusiness(
                            "website",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* HOURS */}

              <div className="form-section">
                <div className="form-section-title">
                  <Clock3 size={16} />
                  Business hours
                </div>

                <div className="form-grid hours-grid">
                  <div className="form-group">
                    <label>
                      Opening time
                    </label>

                    <div className="input-with-icon">
                      <Clock3
                        size={17}
                      />

                      <input
                        type="time"
                        value={
                          business.openingTime
                        }
                        onChange={(e) =>
                          updateBusiness(
                            "openingTime",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>
                      Closing time
                    </label>

                    <div className="input-with-icon">
                      <Clock3
                        size={17}
                      />

                      <input
                        type="time"
                        value={
                          business.closingTime
                        }
                        onChange={(e) =>
                          updateBusiness(
                            "closingTime",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* PRODUCTS / SERVICES */}

              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-title">
                    <Zap size={16} />
                    Products & Services
                  </div>

                  <button
                    type="button"
                    className="add-item-btn"
                    onClick={addItem}
                  >
                    <Plus size={16} />
                    Add item
                  </button>
                </div>

                <p className="section-help">
                  Add the products or services
                  your business provides.
                  Prices are optional.
                </p>

                <div className="items-list">
                  {items.map(
                    (item, index) => (
                      <div
                        className="business-item"
                        key={item.id}
                      >
                        <div className="item-number">
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </div>

                        <div className="item-fields">
                          <input
                            type="text"
                            placeholder="Product / Service name"
                            value={
                              item.name
                            }
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "name",
                                e.target.value
                              )
                            }
                          />

                          <input
                            type="text"
                            placeholder="Price (optional)"
                            value={
                              item.price
                            }
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "price",
                                e.target.value
                              )
                            }
                          />

                          <input
                            type="text"
                            placeholder="Short description"
                            value={
                              item.description
                            }
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        {items.length >
                          1 && (
                          <button
                            type="button"
                            className="remove-item-btn"
                            onClick={() =>
                              removeItem(
                                item.id
                              )
                            }
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* ADDITIONAL INFORMATION */}

              <div className="form-section">
                <div className="form-section-title">
                  <Sparkles size={16} />
                  Additional business
                  information
                </div>

                <div className="textareas-grid">
                  <div className="form-group">
                    <label>
                      Main business
                      information
                    </label>

                    <textarea
                      rows="6"
                      placeholder="Tell the AI anything important about your business..."
                      value={
                        business.mainInfo
                      }
                      onChange={(e) =>
                        updateBusiness(
                          "mainInfo",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Custom information{" "}
                      <small>
                        (optional)
                      </small>
                    </label>

                    <textarea
                      rows="6"
                      placeholder="Add any other information you want your AI assistant to know..."
                      value={
                        business.customInfo
                      }
                      onChange={(e) =>
                        updateBusiness(
                          "customInfo",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* SAVE */}

              <div className="save-row">
                <div className="save-message">
                  {saveMessage && (
                    <>
                      <Check size={17} />
                      {saveMessage}
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  className="save-business-btn"
                  disabled={
                    savingBusiness
                  }
                >
                  {savingBusiness ? (
                    <>
                      <span className="button-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Business
                      Information
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.section>

        {/* AI TEST */}

        <motion.section
          className="dashboard-card"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          id="ai-test"
        >
          <div className="card-heading">
            <div className="card-heading-icon">
              <Bot size={20} />
            </div>

            <div>
              <span className="card-label">
                AI TEST
              </span>

              <h2>
                Test Your AI Assistant
              </h2>

              <p>
                Ask a question and check
                whether the AI is correctly
                using your saved business
                information.
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: "25px",
            }}
          >
            <textarea
              rows="4"
              placeholder="Example: What is my business name?"
              value={aiTestMessage}
              onChange={(e) => {
                setAiTestMessage(
                  e.target.value
                );
                setAiTestError("");
              }}
              style={{
                width: "100%",
                resize: "vertical",
                padding: "15px",
                borderRadius: "12px",
                border:
                  "1px solid rgba(255,255,255,0.12)",
                background:
                  "rgba(255,255,255,0.04)",
                color: "inherit",
                fontSize: "15px",
                outline: "none",
              }}
            />

            <button
              type="button"
              className="save-business-btn"
              onClick={handleAITest}
              disabled={aiTesting}
              style={{
                marginTop: "15px",
              }}
            >
              {aiTesting ? (
                <>
                  <span className="button-spinner" />
                  Testing AI...
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  Test AI
                </>
              )}
            </button>

            {aiTestError && (
              <div
                className="dashboard-error"
                style={{
                  marginTop: "20px",
                }}
              >
                {aiTestError}
              </div>
            )}

            {aiTestAnswer && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  borderRadius: "14px",
                  background:
                    "rgba(255,255,255,0.04)",
                  border:
                    "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  AI Response
                </strong>

                <p
                  style={{
                    margin: 0,
                    lineHeight: 1.7,
                  }}
                >
                  {aiTestAnswer}
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* PLANS */}

        <section
          className="plans-section"
          id="plans"
        >
          <div className="section-top">
            <div>
              <span className="card-label">
                STEP 02
              </span>

              <h2>
                Choose your plan
              </h2>

              <p>
                Select a plan to activate
                your AI chatbot for your
                business.
              </p>
            </div>

            <div className="plans-badge">
              <Zap size={15} />
              Simple pricing
            </div>
          </div>

          <div className="plans-grid">
            {plans.map(
              (plan, index) => (
                <motion.div
                  key={plan.id}
                  className={`plan-card ${
                    selectedPlan ===
                    plan.id
                      ? "selected"
                      : ""
                  } ${
                    plan.popular
                      ? "popular"
                      : ""
                  }`}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.1,
                  }}
                  whileHover={{
                    y: -6,
                  }}
                >
                  {plan.popular && (
                    <div className="popular-badge">
                      Most Popular
                    </div>
                  )}

                  <div className="plan-icon">
                    <Zap size={19} />
                  </div>

                  <h3>
                    {plan.name}
                  </h3>

                  <div className="plan-price">
                    {plan.price}
                    <span>
                      {plan.period}
                    </span>
                  </div>

                  <p>
                    {plan.description}
                  </p>

                  <div className="plan-features">
                    <span>
                      <Check size={15} />
                      AI business
                      assistant
                    </span>

                    <span>
                      <Check size={15} />
                      Website chatbot
                    </span>

                    <span>
                      <Check size={15} />
                      Business knowledge
                    </span>

                    <span>
                      <Check size={15} />
                      Customer support
                      automation
                    </span>
                  </div>

                  <button
                    type="button"
                    className="select-plan-btn"
                    onClick={() => {
  setSelectedPlan(plan.id);

  navigate("/payment", {
    state: {
      planId: plan.id,
      planName: plan.name,
      price: plan.price,
      period: plan.period,
    },
  });
}}
                  >
                    {selectedPlan ===
                    plan.id ? (
                      <>
                        <Check
                          size={17}
                        />
                        Plan Selected
                      </>
                    ) : (
                      <>
                        Select Plan
                        <ArrowRight
                          size={17}
                        />
                      </>
                    )}
                  </button>
                </motion.div>
              )
            )}
          </div>
        </section>

        {/* CHATBOT ACTIVATION */}

        <motion.section
          className="activation-card"
          id="chatbot"
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <div className="activation-icon">
            <Bot size={27} />
          </div>

          <div className="activation-content">
            <span>
              STEP 03
            </span>

            <h2>
              Your AI chatbot will
              appear here
            </h2>

            <p>
              Once your business
              information is saved and
              your plan is activated,
              you'll receive a small code
              snippet. Add that code to
              your website and only the
              NeuraBot chatbot will appear
              there.
            </p>
          </div>

          <div className="activation-status">
            <span />

            {selectedPlan
              ? "Plan selected — awaiting activation"
              : "Waiting for plan"}
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default Dashboard;