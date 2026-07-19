import React, { useState, useCallback } from 'react';
import HeroSection from './components/HeroSection';
import SectionCard from './components/SectionCard';
import PersonalInfoSection from './components/PersonalInfoSection';
import DriverInfoSection from './components/DriverInfoSection';
import RentalInfoSection from './components/RentalInfoSection';
import IdentitySection from './components/IdentitySection';
import FormButtons from './components/FormButtons';
import DeclarationPage from './components/DeclarationPage';
import useFormValidation from './hooks/useFormValidation';

// Bootstrap CSS + Icons
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

/**
 * Progress indicator — shows which step is active.
 * stepActive: 1 = filling form, 2 = declaration
 */
const ProgressSteps = ({ stepActive = 1 }) => {
  const steps = ['Personal Info', 'Driver Info', 'Rental Info', 'Identity'];
  return (
    <div className="progress-steps d-flex justify-content-center gap-2 mb-4">
      {steps.map((step, i) => (
        <div key={step} className="progress-step-item text-center">
          <div className={`progress-step-dot ${stepActive === 2 ? 'progress-step-dot--done' : ''}`}>
            {stepActive === 2 ? <i className="bi bi-check-lg" style={{ fontSize: '0.8rem' }}></i> : i + 1}
          </div>
          <div className="progress-step-label d-none d-md-block">{step}</div>
        </div>
      ))}
      <div className="progress-step-line"></div>
    </div>
  );
};

/**
 * Root Application Component — manages two-page navigation.
 *
 * Page 1 (currentPage === 1): Rental Agreement Form (data entry)
 * Page 2 (currentPage === 2): Declaration & Terms + Signature
 */
const App = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleReset,
    validateAndProceed,
  } = useFormValidation();

  const sharedProps = { formData, errors, touched, handleChange, handleBlur };

  /** Navigate from page 1 → page 2 after validation */
  const handleNavigateToDeclaration = useCallback(
    (e) => {
      // Prevent default form submission
      if (e && e.preventDefault) e.preventDefault();
      const isValid = validateAndProceed();
      if (isValid) {
        setCurrentPage(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [validateAndProceed]
  );

  /** Navigate from page 2 → page 1 (back button) */
  const handleBackToForm = useCallback(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /** Final form submission handler (called from DeclarationPage) */
  const handleFinalSubmit = useCallback((fullPayload) => {
    // ── Backend integration point ────────────────────────────────────────────
    // Example: await axios.post('/api/rental-agreements', fullPayload);
    console.log('✅ Final Agreement Submitted:', fullPayload);
  }, []);

  /** Reset entire app to initial state */
  const handleFullReset = useCallback(() => {
    handleReset();
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [handleReset]);

  // ── Page 2: Declaration ──────────────────────────────────────────────────
  if (currentPage === 2) {
    return (
      <DeclarationPage
        formData={formData}
        onBack={handleBackToForm}
        onFinalSubmit={handleFinalSubmit}
      />
    );
  }

  // ── Page 1: Rental Agreement Form ────────────────────────────────────────
  return (
    <div className="app-root">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Form Container */}
      <main className="form-container-outer">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-9">

              {/* Glassmorphism Form Card */}
              <div className="glass-form-card">
                {/* Card Header */}
                <div className="form-card-header">
                  <div className="d-flex align-items-center gap-3">
                    <div className="form-header-icon">
                      <i className="bi bi-file-earmark-text-fill"></i>
                    </div>
                    <div>
                      <h2 className="form-card-title mb-0">ALL RIDE Rentals — Agreement Form</h2>
                      <p className="form-card-subtitle mb-0">
                        Step 1 of 2 — Fields marked with <span className="text-danger">*</span> are required
                      </p>
                    </div>
                  </div>
                  <ProgressSteps stepActive={1} />
                </div>

                {/* Form Body */}
                <form
                  onSubmit={handleNavigateToDeclaration}
                  noValidate
                  className="form-body"
                  aria-label="ALL RIDE Rentals — Vehicle Rental Agreement Form Step 1"
                >
                  {/* Section 1 — Personal Information */}
                  <SectionCard
                    title="Personal Information"
                    icon="bi-person-lines-fill"
                    stepNumber={1}
                  >
                    <PersonalInfoSection {...sharedProps} />
                  </SectionCard>

                  {/* Section 2 — Driver Information */}
                  <SectionCard
                    title="Driver Information"
                    icon="bi-card-checklist"
                    stepNumber={2}
                  >
                    <DriverInfoSection {...sharedProps} />
                  </SectionCard>

                  {/* Section 3 — Rental Information */}
                  <SectionCard
                    title="Rental Information"
                    icon="bi-key-fill"
                    stepNumber={3}
                  >
                    <RentalInfoSection {...sharedProps} />
                  </SectionCard>

                  {/* Section 4 — Identity Verification */}
                  <SectionCard
                    title="Identity Verification"
                    icon="bi-shield-lock-fill"
                    stepNumber={4}
                  >
                    <IdentitySection {...sharedProps} />
                  </SectionCard>

                  {/* Action Buttons — "Next" navigates to page 2 */}
                  <FormButtons
                    primaryLabel="Next: Review & Sign"
                    primaryIcon="bi-arrow-right-circle-fill"
                    onReset={handleFullReset}
                  />
                </form>
              </div>

              {/* Footer */}
              <footer className="form-footer text-center py-4">
                <p className="mb-1 opacity-75 small">
                  <i className="bi bi-shield-check me-1"></i>
                  Your information is encrypted and protected under our Privacy Policy.
                </p>
                <p className="mb-0 opacity-50 small">
                  © {new Date().getFullYear()} ALL RIDE Rentals. All rights reserved.
                </p>
              </footer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
