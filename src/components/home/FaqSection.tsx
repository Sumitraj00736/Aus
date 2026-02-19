import { useState, useEffect, useRef, type RefObject } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What types of spaces do you clean?",
    answer:
      "We offer cleaning for homes, offices, retail spaces, and even post-renovation sites. Custom packages available based on your needs.",
  },
  {
    question: "Are your cleaning products eco-friendly?",
    answer:
      "Yes. We use eco-conscious, non-toxic products that are effective and safe for families, pets, and workplaces.",
  },
  {
    question: "How do I book a cleaning session?",
    answer:
      "You can call us, submit a form through the website, or request a quote directly from any page.",
  },
  {
    question: "Do I need to be home during the service?",
    answer:
      "Not necessarily. Many clients provide secure access instructions and we update them after completion.",
  },
  {
    question: "What if I am not satisfied with the service?",
    answer:
      "We provide a satisfaction guarantee and a quick re-clean policy when needed.",
  },
];

const useInView = (threshold = 0.15): [RefObject<HTMLElement | null>, boolean] => {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

export default function FaqSection() {
  const [active, setActive] = useState(0);
  const [sectionRef, sectionInView] = useInView();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Inter:wght@400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .faq-section {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 80px 0;
        }

        .faq-bg-img {
          position: absolute;
          inset: 0;
          background-image: url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1800&q=80');
          background-size: cover;
          background-position: center;
          z-index: 0;
        }

        .faq-bg-overlay {
          position: absolute;
          inset: 0;
          background: rgba(232,234,238,0.93);
          z-index: 1;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.3;
          z-index: 2;
          pointer-events: none;
          animation: blobFloat 9s ease-in-out infinite alternate;
        }
        .blob-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #00A859, transparent 70%);
          top: -140px; right: 80px;
          animation-delay: 0s;
        }
        .blob-2 {
          width: 320px; height: 320px;
          background: radial-gradient(circle, #006e38, transparent 70%);
          bottom: -100px; left: 40px;
          animation-delay: 4s;
        }
        @keyframes blobFloat {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(30px,25px) scale(1.1); }
        }

        .feather-wrap {
          position: absolute;
          top: -20px; right: -20px;
          z-index: 2;
          opacity: 0.15;
          pointer-events: none;
        }

        .faq-inner {
          position: relative;
          z-index: 3;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 48px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          width: 100%;
        }

        /* ── LEFT ── */
        .left-side { display: flex; flex-direction: column; }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .badge.vis { opacity: 1; transform: translateY(0); }

        .badge-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #00A859;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); opacity:1; }
          50% { transform: scale(1.6); opacity:0.5; }
        }

        .badge-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #555;
        }

        .heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px, 3.8vw, 58px);
          font-weight: 900;
          line-height: 1.08;
          color: #1a2535;
          margin-bottom: 36px;
          opacity: 0;
          transform: translateY(26px);
          transition: opacity 0.7s ease 0.12s, transform 0.7s ease 0.12s;
        }
        .heading.vis { opacity: 1; transform: translateY(0); }
        .green { color: #00A859; }

        /* FAQ list */
        .faq-list { display: flex; flex-direction: column; gap: 12px; }

        .faq-card {
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(14px);
          border-radius: 20px;
          border: 1.5px solid rgba(255,255,255,0.9);
          overflow: hidden;
          box-shadow: 0 2px 14px rgba(0,0,0,0.05);
          transition: box-shadow 0.35s ease, border-color 0.35s ease, transform 0.35s ease;
          opacity: 0;
          transform: translateX(-28px);
        }
        .faq-card.vis { opacity: 1; transform: translateX(0); }
        .faq-card.open {
          border-color: #00A859;
          box-shadow: 0 8px 40px rgba(0,168,89,0.14), 0 2px 12px rgba(0,0,0,0.06);
        }
        .faq-card:not(.open):hover {
          box-shadow: 0 6px 28px rgba(0,0,0,0.10);
          transform: translateX(5px);
        }

        .faq-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          padding: 20px 24px;
          background: none;
          border: none;
          cursor: pointer;
          gap: 16px;
        }

        .faq-q {
          font-family: 'Syne', sans-serif;
          font-size: clamp(15px, 1.35vw, 19px);
          font-weight: 800;
          color: #1a2535;
          line-height: 1.3;
          transition: color 0.3s;
        }
        .faq-card.open .faq-q { color: #00A859; }

        .icon-ring {
          flex-shrink: 0;
          width: 34px; height: 34px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: #f0f2f5;
          transition: background 0.3s, transform 0.4s ease;
        }
        .faq-card.open .icon-ring {
          background: #00A859;
          transform: rotate(180deg);
        }
        .faq-card.open .icon-ring svg { color: #fff !important; }

        .answer-wrap {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .answer-wrap.open { max-height: 300px; }

        .answer-inner {
          margin: 0 24px 20px;
          padding-top: 14px;
          border-top: 1px solid rgba(0,168,89,0.15);
          font-size: 15px;
          color: #667;
          line-height: 1.75;
          animation: fadeUp 0.4s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── RIGHT ── */
        .img-wrap {
          position: relative;
          opacity: 0;
          transform: translateX(40px) scale(0.96);
          transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
        }
        .img-wrap.vis { opacity: 1; transform: translateX(0) scale(1); }

        .accent-bar {
          position: absolute;
          top: 36px; right: -14px;
          width: 5px; height: 90px;
          background: linear-gradient(to bottom, #00A859, transparent);
          border-radius: 4px;
          z-index: 1;
        }

        .img-frame {
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 28px 80px rgba(0,0,0,0.18);
          position: relative;
        }
        .img-frame img {
          width: 100%;
          height: 580px;
          object-fit: cover;
          object-position: center top;
          display: block;
          transition: transform 8s ease;
        }
        .img-frame:hover img { transform: scale(1.04); }

        .float-badge {
          position: absolute;
          bottom: 28px; left: 28px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 14px 20px;
          display: flex; align-items: center; gap: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          animation: badgePop 0.6s ease 1s both;
        }
        @keyframes badgePop {
          from { opacity:0; transform:translateY(20px) scale(0.9); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }

        .badge-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #00A859, #007a40);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
        }
        .badge-copy strong {
          display: block;
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800; color: #1a2535;
        }
        .badge-copy span { font-size: 12px; color: #888; }
      `}</style>

      <section className="faq-section" ref={sectionRef}>
        <div className="faq-bg-img" />
        <div className="faq-bg-overlay" />
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        {/* Feather watermark */}
        <div className="feather-wrap">
          <svg width="460" height="560" viewBox="0 0 400 500" fill="none">
            <g stroke="#333" strokeWidth="0.8">
              {Array.from({ length: 35 }).map((_, i) => (
                <path key={i}
                  d={`M200,10 Q${200+(i-17)*9},${70+i*13} ${200+(i-17)*22},${85+i*13}`}
                  strokeOpacity={Math.max(0, 0.5 - i * 0.012)}
                />
              ))}
              {Array.from({ length: 35 }).map((_, i) => (
                <path key={`r${i}`}
                  d={`M200,10 Q${200-(i-17)*9},${70+i*13} ${200-(i-17)*22},${85+i*13}`}
                  strokeOpacity={Math.max(0, 0.5 - i * 0.012)}
                />
              ))}
            </g>
          </svg>
        </div>

        <div className="faq-inner">
          {/* LEFT */}
          <div className="left-side">
            <div className={`badge ${sectionInView ? "vis" : ""}`}>
              <div className="badge-dot" />
              <span className="badge-label">Frequently Asked Question</span>
            </div>

            <h2 className={`heading ${sectionInView ? "vis" : ""}`}>
              You Have <span className="green">Questions,</span>
              <br />
              <span className="green">We Have</span> Answers
            </h2>

            <div className="faq-list">
              {faqs.map((faq, idx) => {
                const open = idx === active;
                return (
                  <div
                    key={idx}
                    className={`faq-card ${open ? "open" : ""} ${sectionInView ? "vis" : ""}`}
                    style={{ transitionDelay: sectionInView ? `${0.3 + idx * 0.08}s` : "0s" }}
                  >
                    <button
                      className="faq-btn"
                      onClick={() => setActive(open ? -1 : idx)}
                      aria-expanded={open}
                    >
                      <span className="faq-q">{faq.question}</span>
                      <span className="icon-ring">
                        {open
                          ? <Minus size={17} color="#1a2535" />
                          : <Plus  size={17} color="#1a2535" />
                        }
                      </span>
                    </button>
                    <div className={`answer-wrap ${open ? "open" : ""}`}>
                      <p className="answer-inner">{faq.answer}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className={`img-wrap ${sectionInView ? "vis" : ""}`}>
            <div className="accent-bar" />
            <div className="img-frame">
              <img
                src="https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1200&q=80"
                alt="Cleaning professional with supplies"
              />
              <div className="float-badge">
                <div className="badge-icon">🧹</div>
                <div className="badge-copy">
                  <strong>5★ Rated Service</strong>
                  <span>Trusted by 10,000+ clients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
