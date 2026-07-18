import React, { useEffect, useRef, useCallback } from 'react';
import shawarma from "../assets/shawarma.png";

/* ─────────────────────────────────────────────
   ICON COMPONENTS
───────────────────────────────────────────── */
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
    style={{ color: '#ffd700', display: 'inline-block', verticalAlign: 'middle' }}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const DeliveryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ color: '#ff7a1a', display: 'inline-block', verticalAlign: 'middle' }}>
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

/* ─────────────────────────────────────────────
   EMBER PARTICLES
───────────────────────────────────────────── */
const EMBER_COUNT = 18;
const seed = (i, salt) => {
  const x = Math.sin(i * 9301 + salt * 49297 + 233) * 10000;
  return x - Math.floor(x);
};

const EmberField = () => {
  const embers = Array.from({ length: EMBER_COUNT }, (_, i) => ({
    size:    1 + seed(i, 1) * 3,
    left:    20 + seed(i, 2) * 70,
    delay:   seed(i, 3) * 8,
    dur:     5 + seed(i, 4) * 6,
    opacity: 0.4 + seed(i, 5) * 0.6,
    drift:   (seed(i, 6) - 0.5) * 60,
    i,
  }));

  return (
    <div className="ember-field" aria-hidden="true">
      {embers.map(({ size, left, delay, dur, opacity, drift, i }) => (
        <span
          key={i}
          className="ember"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            bottom: '-5%',
            opacity,
            animationDuration: `${dur}s`,
            animationDelay: `${delay}s`,
            '--drift': `${drift}px`,
            '--size': `${size}px`,
          }}
        />
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   SMOKE WISPS (behind "Still Smoking.")
───────────────────────────────────────────── */
const SmokeWisps = () => (
  <div className="smoke-wisps" aria-hidden="true">
    <svg viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg"
      className="smoke-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="smoke-blur">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <path className="wisp wisp-1"
        d="M60 100 C80 80 60 60 90 45 C115 32 100 15 130 10"
        fill="none" stroke="rgba(200,200,200,0.12)" strokeWidth="16"
        strokeLinecap="round" filter="url(#smoke-blur)" />
      <path className="wisp wisp-2"
        d="M180 110 C195 88 175 70 200 55 C220 42 210 22 235 12"
        fill="none" stroke="rgba(220,220,220,0.08)" strokeWidth="12"
        strokeLinecap="round" filter="url(#smoke-blur)" />
      <path className="wisp wisp-3"
        d="M300 115 C310 92 295 78 315 62 C330 48 320 30 340 18"
        fill="none" stroke="rgba(250,250,250,0.06)" strokeWidth="10"
        strokeLinecap="round" filter="url(#smoke-blur)" />
    </svg>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN HERO COMPONENT
───────────────────────────────────────────── */
const Hero = ({ openCart, heroReady }) => {
  const containerRef = useRef(null);
  const rafRef       = useRef(null);
  const tilt         = useRef({ x: 0, y: 0 });
  const target       = useRef({ x: 0, y: 0 });

  const lerp = (a, b, t) => a + (b - a) * t;

  const tick = useCallback(() => {
    tilt.current.x = lerp(tilt.current.x, target.current.x, 0.05);
    tilt.current.y = lerp(tilt.current.y, target.current.y, 0.05);
    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${tilt.current.x}px, ${tilt.current.y}px)`;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.closest('#hero')?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    target.current.x =  ((e.clientX - cx) / (rect.width  / 2)) * 12;
    target.current.y =  ((e.clientY - cy) / (rect.height / 2)) * 12;
  }, []);

  const handleMouseLeave = useCallback(() => {
    target.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    hero.addEventListener('mousemove', handleMouseMove, { passive: true });
    hero.addEventListener('mouseleave', handleMouseLeave);
    rafRef.current = requestAnimationFrame(tick);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      cancelAnimationFrame(rafRef.current);
      if (containerRef.current) containerRef.current.style.transform = '';
    }
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseLeave, tick]);

  // Gate: all stamp animations are bound to the 'hero-ready' class on #hero
  // heroReady is set by App.jsx ~60ms after the loader fully unmounts.
  const readyClass = heroReady ? 'hero-ready' : '';

  return (
    <section id="hero" className={readyClass}>
      {/* Watermark — always visible, very faint */}
      <div className="hero-bg-text-angaar">ANGAAR</div>
      <div className="atmo-vignette" aria-hidden="true" />
      <EmberField />

      {/* ── Left content ── */}
      <div className="hero-left">

        {/* Eyebrow stamp — appears after headline at 1.3s */}
        <span className="hero-eyebrow stamp-eyebrow">Vasai–Virar's Own</span>

        <h1 className="hero-headline">
          {/* Each line is invisible by default; .hero-ready triggers keyframes */}
          <div className="stamp-line stamp-line-1">Carved.</div>
          <div className="stamp-line stamp-line-2 line-ember">Wrapped.</div>
          <div className="stamp-line stamp-line-3 headline-smoking-wrap">
            <SmokeWisps />
            Still Smoking.
          </div>
        </h1>

        <p className="hero-sub stamp-btns">
          The shawarma Vasai keeps coming back for. Flame-kissed,
          freshly wrapped, every single time.
        </p>

        <div className="hero-btns stamp-btns">
          <button
            className="btn-primary"
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Menu
          </button>
          <button className="btn-ghost" onClick={openCart}>Order Now</button>
        </div>

        <div className="hero-stats stamp-btns">
          <span><span style={{ marginRight: '4px' }}><StarIcon /></span><b>4.8</b> rating</span>
          <span className="dot">·</span>
          <span><b>500+</b> orders served</span>
          <span className="dot">·</span>
          <span>Open <b>5 PM – 11 PM</b></span>
        </div>
      </div>

      {/* ── Shawarma image ── */}
      <div className="hero-center">
        <div className="shawarma-container stamp-shawarma" ref={containerRef}>
          <div className="shawarma-placeholder">
            <img src={shawarma} alt="Angaar Shawarma Roll" />
          </div>

          <div className="badge badge-1 stamp-badge stamp-badge-1">
            <span className="badge-icon"><StarIcon /></span>
            <div>
              <span className="badge-val">4.8 Rating</span>
              <span className="badge-label">500+ Reviews</span>
            </div>
          </div>
          <div className="badge badge-2 stamp-badge stamp-badge-2">
            <span className="badge-icon"><DeliveryIcon /></span>
            <div>
              <span className="badge-val">Free Delivery</span>
              <span className="badge-label">Above ₹500</span>
            </div>
          </div>
          <div className="badge badge-3 stamp-badge stamp-badge-3">
            <span className="badge-icon">🔥</span>
            <div>
              <span className="badge-val">Flame Grilled</span>
              <span className="badge-label">Always fresh</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;