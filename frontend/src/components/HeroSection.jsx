import React from 'react';

/**
 * Full-width Hero section — ALL RIDE Rentals branded.
 * Yellow/Black/Red theme with logo top-left.
 */
const HeroSection = () => (
  <section
    className="hero-section"
    role="banner"
    style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/hero-bg.png)` }}
  >
    <div className="hero-overlay">

      {/* ── Top Nav Bar with Logo ───────────────────────────────────────── */}
      <div className="hero-navbar">
        <div className="hero-logo-wrap">
          <img
            src={`${process.env.PUBLIC_URL}/OIP-removebg-preview.png`}
            alt="ALL RIDE Rentals Logo"
            className="hero-logo-img"
          />
          <div className="hero-logo-text">
            <span className="hero-logo-name">ALL RIDE</span>
            <span className="hero-logo-sub">Rentals</span>
          </div>
        </div>
        <div className="hero-nav-badge">
          <i className="bi bi-shield-check me-1"></i>
          Verified &amp; Trusted
        </div>
      </div>

      {/* ── Hero Content ────────────────────────────────────────────────── */}
      <div className="hero-content text-center">
        <div className="hero-badge mb-3">
          <i className="bi bi-patch-check-fill me-2"></i>
          ALL RIDE Rentals — Premium Vehicle Experience
        </div>

        <h1 className="hero-title">
          Vehicle Rental
          <span className="hero-title-accent"> Agreement</span>
        </h1>

        <p className="hero-subtitle">
          Complete the information below to proceed with your ALL RIDE Rentals vehicle rental.
        </p>

        {/* Decorative vehicle icons */}
        <div className="hero-icons mt-4">
          <span className="hero-vehicle-icon" title="Scooty">
            <i className="bi bi-scooter"></i>
          </span>
          <span className="hero-vehicle-icon" title="Motorcycle">
            <i className="bi bi-bicycle"></i>
          </span>
          <span className="hero-vehicle-icon" title="Car">
            <i className="bi bi-car-front-fill"></i>
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-indicator mt-4">
          <i className="bi bi-chevron-double-down"></i>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
