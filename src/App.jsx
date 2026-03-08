import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Sparkles,
  Heart,
  Users,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";

const EVENT = {
  celebrant: "Oenone Anavie A. Abuyen",
  title: "18th Debut Celebration",
  date: "April 08, 2026",
  time: "6:00 PM",
  venue: "Grand Ballroom, Imus, Cavite",
  dressCode: "Formal / Blush Pink & Gold",
  tagline: "An evening of elegance, memories, and celebration.",
};

const STORAGE_KEY = "debut-rsvp-responses";
const ADMIN_PIN = "1800";

function loadResponses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveResponses(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getCountdown() {
  const target = new Date(`${EVENT.date} ${EVENT.time}`).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function FloatingOrb({ className, delay = 0, duration = 10 }) {
  return (
    <motion.div
      className={className}
      initial={{ y: 0, x: 0, opacity: 0.4 }}
      animate={{
        y: [0, -25, 20, 0],
        x: [0, 20, -15, 0],
        scale: [1, 1.08, 0.96, 1],
        opacity: [0.3, 0.55, 0.35, 0.3],
      }}
      transition={{
        repeat: Infinity,
        duration,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

function CountdownBox({ label, value }) {
  return (
    <div className="countdown-box">
      <div className="countdown-value">{value}</div>
      <div className="countdown-label">{label}</div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="icon-wrap">{icon}</div>
        <span>{title}</span>
      </div>
      <h3>{value}</h3>
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="info-card">
      <div className="info-title">
        {icon}
        <span>{title}</span>
      </div>
      <div className="info-value">{value}</div>
    </div>
  );
}

function ResponseTable({ items, type }) {
  if (!items.length) {
    return <div className="empty-box">No {type} responses yet.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Guests</th>
            <th>Message</th>
            <th>Submitted</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.guests}</td>
              <td>{item.message || "—"}</td>
              <td>{item.submittedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [responses, setResponses] = useState([]);
  const [timeLeft, setTimeLeft] = useState(getCountdown());
  const [done, setDone] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("accepted");

  const [form, setForm] = useState({
    name: "",
    email: "",
    guests: "1",
    status: "accepted",
    message: "",
  });

  useEffect(() => {
    setResponses(loadResponses());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const accepted = useMemo(
    () => responses.filter((item) => item.status === "accepted"),
    [responses]
  );

  const declined = useMemo(
    () => responses.filter((item) => item.status === "declined"),
    [responses]
  );

  const totalGuestsComing = useMemo(() => {
    return accepted.reduce((sum, item) => sum + Number(item.guests || 1), 0);
  }, [accepted]);

  function handleSubmit(e) {
    e.preventDefault();
    setDone(false);

    const payload = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      guests: Number(form.guests) || 1,
      status: form.status,
      message: form.message.trim(),
      submittedAt: new Date().toLocaleString(),
    };

    if (!payload.name || !payload.email) return;

    const updated = [payload, ...responses];
    setResponses(updated);
    saveResponses(updated);

    setForm({
      name: "",
      email: "",
      guests: "1",
      status: "accepted",
      message: "",
    });
    setDone(true);
  }

  function handleAdminOpen() {
    if (adminPin === ADMIN_PIN) {
      setIsAdminOpen(true);
    }
  }

  return (
    <div className="page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        html, body, #root {
          margin: 0;
          padding: 0;
          min-height: 100%;
          font-family: Inter, Arial, sans-serif;
        }

        body {
          background: #0f172a;
        }

        .page {
          min-height: 100vh;
          color: white;
          background:
            radial-gradient(circle at top, rgba(244,114,182,0.18), transparent 25%),
            radial-gradient(circle at bottom right, rgba(250,204,21,0.12), transparent 30%),
            linear-gradient(135deg, #1e1b4b 0%, #312e81 35%, #111827 100%);
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: 28px 20px 70px;
        }

        .background-grid {
          position: absolute;
          inset: 0;
          opacity: 0.16;
          background-image:
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(60px);
        }

        .orb1 {
          width: 220px;
          height: 220px;
          top: 8%;
          left: 6%;
          background: rgba(244,114,182,0.25);
        }

        .orb2 {
          width: 260px;
          height: 260px;
          top: 12%;
          right: 8%;
          background: rgba(216,180,254,0.22);
        }

        .orb3 {
          width: 300px;
          height: 300px;
          bottom: 10%;
          left: 20%;
          background: rgba(250,204,21,0.16);
        }

        .orb4 {
          width: 220px;
          height: 220px;
          bottom: 8%;
          right: 16%;
          background: rgba(251,113,133,0.18);
        }

        .container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-grid {
          display: grid;
          gap: 28px;
          align-items: center;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.18);
          color: white;
          padding: 10px 16px;
          border-radius: 999px;
          backdrop-filter: blur(10px);
          font-size: 14px;
          font-weight: 600;
        }

        .eyebrow {
          margin-top: 18px;
          font-size: 12px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(251,207,232,0.95);
        }

        .hero h1 {
          margin: 14px 0 0;
          font-size: 48px;
          line-height: 1.05;
          font-weight: 900;
        }

        .hero-title-gradient {
          display: block;
          background: linear-gradient(90deg, #fbcfe8, #fecdd3, #fde68a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero p.desc {
          margin-top: 18px;
          max-width: 720px;
          color: #dbe4f0;
          line-height: 1.8;
          font-size: 16px;
        }

        .info-grid {
          display: grid;
          gap: 14px;
          margin-top: 30px;
        }

        .info-card {
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 22px;
          padding: 18px;
          backdrop-filter: blur(10px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .info-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fbcfe8;
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .info-value {
          font-size: 15px;
          font-weight: 700;
          color: white;
        }

        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 28px;
        }

        .countdown-box {
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 22px;
          padding: 18px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .countdown-value {
          font-size: 34px;
          font-weight: 900;
        }

        .countdown-label {
          margin-top: 6px;
          color: rgba(255,255,255,0.72);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.25em;
        }

        .hero-panel {
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 34px;
          overflow: hidden;
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }

        .hero-panel-inner {
          min-height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 30px;
          background:
            radial-gradient(circle at top, rgba(255,255,255,0.18), transparent 36%),
            linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
        }

        .hero-heart {
          width: 84px;
          height: 84px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.18);
        }

        .hero-panel h2 {
          margin: 0;
          font-size: 42px;
          font-weight: 900;
        }

        .hero-panel p {
          color: #dbe4f0;
          line-height: 1.8;
          max-width: 420px;
          margin: 14px auto 0;
        }

        .feature-list {
          margin-top: 26px;
          display: grid;
          gap: 12px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 18px;
          padding: 14px 16px;
          text-align: left;
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.10);
          flex-shrink: 0;
        }

        .section {
          padding: 0 20px 70px;
        }

        .section-grid {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          gap: 24px;
        }

        .card-dark,
        .card-light {
          border-radius: 34px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.18);
        }

        .card-dark {
          background: #020617;
          color: white;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .card-light {
          background: white;
          color: #0f172a;
          border: 1px solid rgba(226,232,240,0.7);
        }

        .card-content {
          padding: 30px;
        }

        .section-tag {
          color: #f9a8d4;
          text-transform: uppercase;
          letter-spacing: 0.35em;
          font-size: 12px;
          font-weight: 700;
        }

        .section-title {
          margin: 14px 0 0;
          font-size: 38px;
          font-weight: 900;
          line-height: 1.1;
        }

        .section-text {
          margin-top: 16px;
          color: #cbd5e1;
          line-height: 1.8;
        }

        .stats-grid {
          margin-top: 24px;
          display: grid;
          gap: 14px;
        }

        .stat-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px;
          padding: 18px;
        }

        .stat-top {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #cbd5e1;
          font-size: 14px;
        }

        .icon-wrap {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: rgba(255,255,255,0.08);
          color: #fbcfe8;
        }

        .stat-card h3 {
          margin: 16px 0 0;
          font-size: 36px;
          font-weight: 900;
          color: white;
        }

        form {
          display: grid;
          gap: 18px;
        }

        .two-col {
          display: grid;
          gap: 16px;
        }

        label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 8px;
        }

        input,
        textarea {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 16px;
          padding: 14px 16px;
          font-size: 15px;
          outline: none;
          transition: 0.2s ease;
        }

        input:focus,
        textarea:focus {
          border-color: #ec4899;
          box-shadow: 0 0 0 4px rgba(236,72,153,0.12);
        }

        textarea {
          resize: vertical;
          min-height: 120px;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .status-btn {
          border: 1px solid #cbd5e1;
          background: white;
          color: #334155;
          border-radius: 16px;
          height: 50px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .status-btn.active-accept {
          background: #ecfdf5;
          border-color: #10b981;
          color: #047857;
        }

        .status-btn.active-decline {
          background: #fff1f2;
          border-color: #f43f5e;
          color: #be123c;
        }

        .submit-btn,
        .admin-btn,
        .tab-btn {
          border: none;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(90deg, #ec4899, #db2777);
          color: white;
          border-radius: 16px;
          padding: 15px 18px;
          font-size: 16px;
          font-weight: 800;
        }

        .submit-btn:hover,
        .admin-btn:hover,
        .tab-btn:hover {
          transform: translateY(-1px);
        }

        .success-box {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
          border-radius: 16px;
          padding: 14px 16px;
          font-size: 14px;
          font-weight: 600;
        }

        .admin-section {
          background: #020617;
          padding: 70px 20px;
        }

        .admin-header p {
          color: #cbd5e1;
          line-height: 1.8;
          max-width: 720px;
        }

        .admin-login {
          max-width: 520px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 28px;
          padding: 26px;
          margin-top: 24px;
        }

        .admin-login label {
          color: white;
        }

        .admin-login input {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          color: white;
        }

        .admin-login input::placeholder {
          color: #94a3b8;
        }

        .admin-login-row {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }

        .admin-btn {
          background: linear-gradient(90deg, #ec4899, #db2777);
          color: white;
          border-radius: 16px;
          padding: 0 22px;
          font-weight: 800;
          min-width: 110px;
        }

        .admin-stats {
          display: grid;
          gap: 14px;
          margin-top: 28px;
        }

        .tabs {
          margin-top: 28px;
        }

        .tab-head {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 12px 18px;
          border-radius: 14px;
          font-weight: 700;
          background: rgba(255,255,255,0.08);
          color: white;
        }

        .tab-btn.active {
          background: white;
          color: #0f172a;
        }

        .table-wrap {
          margin-top: 18px;
          overflow-x: auto;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.04);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 760px;
        }

        thead {
          background: rgba(255,255,255,0.08);
        }

        th, td {
          padding: 16px 18px;
          text-align: left;
          font-size: 14px;
        }

        th {
          color: #cbd5e1;
        }

        td {
          color: white;
          border-top: 1px solid rgba(255,255,255,0.08);
          vertical-align: top;
        }

        .empty-box {
          margin-top: 18px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 24px;
          color: #cbd5e1;
        }

        .footer {
          padding: 24px 20px 40px;
          background: white;
          color: #475569;
          border-top: 1px solid #e2e8f0;
        }

        .footer-inner {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 12px;
          flex-direction: column;
          justify-content: space-between;
        }

        @media (min-width: 768px) {
          .hero h1 {
            font-size: 72px;
          }

          .countdown-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .info-grid,
          .stats-grid,
          .admin-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .two-col {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1.2fr 0.8fr;
          }

          .section-grid {
            grid-template-columns: 0.95fr 1.05fr;
          }

          .info-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .stats-grid,
          .admin-stats {
            grid-template-columns: repeat(4, 1fr);
          }

          .footer-inner {
            flex-direction: row;
            align-items: center;
          }
        }
      `}</style>

      <section className="hero">
        <div className="background-grid" />

        <FloatingOrb className="orb orb1" delay={0.2} duration={11} />
        <FloatingOrb className="orb orb2" delay={0.6} duration={14} />
        <FloatingOrb className="orb orb3" delay={0.4} duration={16} />
        <FloatingOrb className="orb orb4" delay={0.8} duration={12} />

        <div className="container hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="badge">
              <Sparkles size={16} />
              Professional Debut Invitation Website
            </div>

            <div className="eyebrow">You are invited to celebrate</div>

            <h1>
              {EVENT.celebrant}'s
              <span className="hero-title-gradient">{EVENT.title}</span>
            </h1>

            <p className="desc">
              {EVENT.tagline} Join us for a magical night filled with beauty,
              love, gratitude, and unforgettable memories.
            </p>

            <div className="info-grid">
              <InfoCard
                icon={<CalendarDays size={16} />}
                title="Date"
                value={EVENT.date}
              />
              <InfoCard
                icon={<Clock3 size={16} />}
                title="Time"
                value={EVENT.time}
              />
              <InfoCard
                icon={<MapPin size={16} />}
                title="Venue"
                value={EVENT.venue}
              />
              <InfoCard
                icon={<Sparkles size={16} />}
                title="Dress Code"
                value={EVENT.dressCode}
              />
            </div>

            <div className="countdown-grid">
              <CountdownBox label="Days" value={timeLeft.days} />
              <CountdownBox label="Hours" value={timeLeft.hours} />
              <CountdownBox label="Minutes" value={timeLeft.minutes} />
              <CountdownBox label="Seconds" value={timeLeft.seconds} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="hero-panel"
          >
            <div className="hero-panel-inner">
              <div>
                <div className="hero-heart">
                  <Heart size={38} color="#fce7f3" />
                </div>
                <div className="eyebrow" style={{ marginTop: 0 }}>
                  Save the Date
                </div>
                <h2>Debut Night</h2>
                <p>
                  A luxury-inspired invitation page with RSVP form, animated
                  background, and guest dashboard.
                </p>

                <div className="feature-list">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <Users size={18} />
                    </div>
                    <span>Track all guests in one dashboard</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <CheckCircle2 size={18} />
                    </div>
                    <span>Accept or decline RSVP response</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <ShieldCheck size={18} />
                    </div>
                    <span>Private organizer admin access</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="section-grid">
          <div className="card-dark">
            <div className="card-content">
              <div className="section-tag">RSVP Now</div>
              <h2 className="section-title">Confirm your attendance</h2>
              <p className="section-text">
                Please let us know if you will be attending the celebration.
                Your response helps us prepare seating, food, and the guest
                experience.
              </p>

              <div className="stats-grid">
                <StatCard
                  title="Total Responses"
                  value={responses.length}
                  icon={<Users size={18} />}
                />
                <StatCard
                  title="Accepted"
                  value={accepted.length}
                  icon={<CheckCircle2 size={18} />}
                />
                <StatCard
                  title="Declined"
                  value={declined.length}
                  icon={<XCircle size={18} />}
                />
                <StatCard
                  title="Guests Coming"
                  value={totalGuestsComing}
                  icon={<Sparkles size={18} />}
                />
              </div>
            </div>
          </div>

          <div className="card-light">
            <div className="card-content">
              <form onSubmit={handleSubmit}>
                <div className="two-col">
                  <div>
                    <label>Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="two-col">
                  <div>
                    <label>Number of Guests</label>
                    <input
                      type="number"
                      min="1"
                      value={form.guests}
                      onChange={(e) =>
                        setForm({ ...form, guests: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label>Response</label>
                    <div className="status-grid">
                      <button
                        type="button"
                        className={`status-btn ${
                          form.status === "accepted" ? "active-accept" : ""
                        }`}
                        onClick={() =>
                          setForm({ ...form, status: "accepted" })
                        }
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className={`status-btn ${
                          form.status === "declined" ? "active-decline" : ""
                        }`}
                        onClick={() =>
                          setForm({ ...form, status: "declined" })
                        }
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label>Message</label>
                  <textarea
                    placeholder="Write a message for the celebrant..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>

                <button className="submit-btn" type="submit">
                  Submit RSVP
                </button>

                {done && (
                  <div className="success-box">
                    Your RSVP has been saved successfully.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <div className="container">
          <div className="admin-header">
            <div className="section-tag">Organizer Dashboard</div>
            <h2 className="section-title">View guest responses</h2>
            <p>
              This demo has a private admin section so you can see who accepted
              or declined. The demo admin PIN is <strong>1800</strong>.
            </p>
          </div>

          {!isAdminOpen ? (
            <div className="admin-login">
              <label>Enter Admin PIN</label>
              <div className="admin-login-row">
                <input
                  type="password"
                  placeholder="Enter PIN"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                />
                <button className="admin-btn" onClick={handleAdminOpen}>
                  Open
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="admin-stats">
                <StatCard
                  title="Total Responses"
                  value={responses.length}
                  icon={<Users size={18} />}
                />
                <StatCard
                  title="Accepted"
                  value={accepted.length}
                  icon={<CheckCircle2 size={18} />}
                />
                <StatCard
                  title="Declined"
                  value={declined.length}
                  icon={<XCircle size={18} />}
                />
                <StatCard
                  title="Guests Coming"
                  value={totalGuestsComing}
                  icon={<Sparkles size={18} />}
                />
              </div>

              <div className="tabs">
                <div className="tab-head">
                  <button
                    className={`tab-btn ${
                      activeTab === "accepted" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("accepted")}
                  >
                    Accepted
                  </button>
                  <button
                    className={`tab-btn ${
                      activeTab === "declined" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("declined")}
                  >
                    Declined
                  </button>
                </div>

                {activeTab === "accepted" ? (
                  <ResponseTable items={accepted} type="accepted" />
                ) : (
                  <ResponseTable items={declined} type="declined" />
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div>© 2026 {EVENT.celebrant}'s Debut RSVP Website</div>
          <div>Built with React, Framer Motion, and Lucide Icons</div>
        </div>
      </footer>
    </div>
  );
}