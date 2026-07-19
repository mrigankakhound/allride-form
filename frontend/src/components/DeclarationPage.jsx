import React, { useRef, useState, useCallback } from 'react';
import SignatureCanvas from 'react-signature-canvas';

// ─── Declaration Content ───────────────────────────────────────────────────────

const DECLARATION_ITEMS = [
  'The individual mentioned above in this Rental Contract hereby agrees to fill the fuel tank at the above indicated level upon returning the rented vehicle.',
  "It is the renter's responsibility for all lost vehicle keys and/or any lockout situation.",
  'Only the person(s) listed on this Rental Agreement and above the age of 18 years may drive the vehicle. The renter must not be under the influence of alcohol or drugs. The renter is responsible for all collision damage to the vehicle regardless of fault or whether the cause is known.',
  'The renter is bound by the terms and conditions of this Rental Agreement. The vehicle must be returned to the same location where it was picked up, on or before the agreed return date and time.',
];

const CONDITIONS = [
  'Security Deposit will be refunded only on the 3rd working day after returning the vehicle.',
  'Vehicle must not be used for learning purposes, sports, racing, rallies, or any competitive event. If violated, the advance amount will be forfeited.',
  'No transport of goods or passengers in violation of local laws or excise/custom regulations.',
  'The vehicle must be driven only by the customer who booked it using their valid driving licence.',
  'The vehicle must be returned in the same condition in which it was delivered.',
  'Fuel level must be maintained. Excess fuel will not be refunded. Any shortage will be charged accordingly.',
  'Toll charges, parking fees, permits, and interstate taxes are non-refundable.',
  'Any damages, repair costs, or missing accessories will be charged to the customer.',
  'Customers must carry their original Driving Licence at all times.',
  'Damage costs up to ₹10,000 shall be borne entirely by the customer.',
  'Depreciation cost for damaged parts will also be charged to the customer.',
  'Maximum customer liability shall be ₹50,000.',
];

const PENALTIES = [
  { offence: 'Smoking inside the vehicle',           charge: '₹750' },
  { offence: 'Consuming alcohol inside the vehicle', charge: '₹1,500' },
  { offence: 'Late return',                          charge: '₹300 per hour' },
  { offence: 'After six hours delay',                charge: '₹650' },
  { offence: 'Carrying pets or animals',             charge: '₹1,000' },
  { offence: 'Speed above 80 km/h',                  charge: '₹1,500' },
  { offence: 'Food waste found inside the vehicle',  charge: '₹400' },
];

// ─── Summary Card ──────────────────────────────────────────────────────────────
const RenterSummary = ({ formData }) => (
  <div className="renter-summary-card mb-4">
    <div className="renter-summary-header">
      <i className="bi bi-person-badge-fill me-2"></i>
      Renter Details Summary
    </div>
    <div className="renter-summary-body">
      <div className="row g-2">
        <div className="col-6 col-md-3">
          <div className="summary-label">Full Name</div>
          <div className="summary-value">{formData.firstName} {formData.lastName}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="summary-label">Vehicle Type</div>
          <div className="summary-value">
            {formData.vehicleType === 'MCWOG' && 'Scooty (MCWOG)'}
            {formData.vehicleType === 'MCWG'  && 'Bike (MCWG)'}
            {formData.vehicleType === 'LMV'   && 'Car (LMV)'}
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="summary-label">Vehicle Model</div>
          <div className="summary-value">{formData.vehicleModel}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="summary-label">Rental Duration</div>
          <div className="summary-value">{formData.rentalDuration} Day{formData.rentalDuration !== '1' ? 's' : ''}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="summary-label">Reg. Number</div>
          <div className="summary-value">{formData.registrationNumber}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="summary-label">License No.</div>
          <div className="summary-value">{formData.licenseNumber}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="summary-label">Purpose</div>
          <div className="summary-value">{formData.rentalPurpose}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="summary-label">ID Proof</div>
          <div className="summary-value">{formData.idProofNumber}</div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Declaration Page Component ─────────────────────────────────────────
const DeclarationPage = ({ formData, onBack, onFinalSubmit }) => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError]       = useState('');
  const [signatureError, setSignatureError] = useState('');
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitDone, setSubmitDone]       = useState(false);

  const sigCanvasRef = useRef(null);

  // ── Clear signature ────────────────────────────────────────────────────────
  const handleClearSignature = useCallback(() => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      setSignatureError('');
    }
  }, []);

  // ── Final submit ───────────────────────────────────────────────────────────
  const handleFinalSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      let hasError = false;

      // Validate checkbox
      if (!agreedToTerms) {
        setTermsError('You must agree to the Terms & Conditions before submitting.');
        hasError = true;
      } else {
        setTermsError('');
      }

      // Validate signature
      if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) {
        setSignatureError('A digital signature is required before submitting.');
        hasError = true;
      } else {
        setSignatureError('');
      }

      if (hasError) return;

      setIsSubmitting(true);

      try {
        // Build multipart/form-data payload
        const payload = new FormData();

        // ── Text fields ──────────────────────────────────────────────────────
        const textFields = [
          'firstName', 'lastName', 'contactNumber', 'homeAddress', 'localAddress',
          'city', 'state', 'zipCode', 'country',
          'licenseNumber', 'licenseExpiry',
          'rentalPurpose', 'vehicleType', 'registrationNumber', 'vehicleModel', 'rentalDuration', 'destination',
          'idProofNumber', 'documentType',
        ];
        textFields.forEach((key) => {
          if (formData[key] !== undefined && formData[key] !== null) {
            payload.append(key, formData[key]);
          }
        });
        payload.append('agreedToTerms', String(agreedToTerms));

        // ── Photo files (optional — user may skip) ───────────────────────────
        if (formData.customerPhoto instanceof File) {
          payload.append('customerPhoto', formData.customerPhoto);
        }
        if (formData.drivingLicensePhoto instanceof File) {
          payload.append('drivingLicensePhoto', formData.drivingLicensePhoto);
        }
        if (formData.idProofPhoto instanceof File) {
          payload.append('idProofPhoto', formData.idProofPhoto);
        }

        // ── Signature — convert canvas PNG to Blob ────────────────────────────
        const signatureDataUrl = sigCanvasRef.current.toDataURL('image/png');
        const blob = await (await fetch(signatureDataUrl)).blob();
        payload.append('signatureImage', blob, 'signature.png');

        // ── POST to backend ───────────────────────────────────────────────────
        const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API}/api/rental-agreements`, {
          method: 'POST',
          body: payload,
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || 'Submission failed. Please try again.');
        }

        setIsSubmitting(false);
        setSubmitDone(true);

        if (typeof onFinalSubmit === 'function') {
          onFinalSubmit({ ...formData, agreedToTerms, signatureDataUrl });
        }
      } catch (err) {
        setIsSubmitting(false);
        setTermsError(`Error: ${err.message}`);
        console.error('❌ Submission error:', err);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [agreedToTerms, formData, onFinalSubmit]
  );

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitDone) {
    return (
      <div className="app-root">
        <div className="declaration-hero">
          <div className="declaration-hero-overlay">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                  <div className="success-full-card text-center">
                    <div className="success-full-icon mb-4">
                      <i className="bi bi-patch-check-fill"></i>
                    </div>
                    <h2 className="success-full-title">Agreement Submitted!</h2>
                    <p className="success-full-subtitle">
                      Your Vehicle Rental Agreement has been received and digitally signed.
                      Our team will contact you shortly with confirmation.
                    </p>
                    <div className="success-full-details mt-4">
                      <div className="success-detail-item">
                        <i className="bi bi-person-fill"></i>
                        <span>{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="success-detail-item">
                        <i className="bi bi-car-front-fill"></i>
                        <span>{formData.vehicleModel} — {formData.registrationNumber}</span>
                      </div>
                      <div className="success-detail-item">
                        <i className="bi bi-calendar-check-fill"></i>
                        <span>{formData.rentalDuration} Day{formData.rentalDuration !== '1' ? 's' : ''} Rental</span>
                      </div>
                    </div>
                    <p className="success-full-note mt-4">
                      <i className="bi bi-envelope-fill me-2"></i>
                      A copy of your agreement will be sent to your registered contact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Declaration Page ──────────────────────────────────────────────────
  return (
    <div className="app-root">
      {/* Declaration Hero */}
      <div
        className="declaration-hero"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/hero-bg.png)` }}
      >
        <div className="declaration-hero-overlay">
          {/* Logo navbar */}
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
          <div className="text-center declaration-hero-content">
            <div className="hero-badge mb-3">
              <i className="bi bi-file-earmark-check-fill me-2"></i>
              ALL RIDE Rentals — Step 2 of 2
            </div>
            <h1 className="hero-title">
              Declaration &amp;
              <span className="hero-title-accent"> Terms &amp; Conditions</span>
            </h1>
            <p className="hero-subtitle">
              Please read the following carefully and sign digitally to complete your rental agreement.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="form-container-outer">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-9">

              {/* Renter Summary */}
              <RenterSummary formData={formData} />

              {/* Declaration + T&C Card */}
              <div className="glass-form-card mb-4">
                {/* Card Header */}
                <div className="form-card-header">
                  <div className="d-flex align-items-center gap-3">
                    <div className="form-header-icon">
                      <i className="bi bi-file-text-fill"></i>
                    </div>
                    <div>
                      <h2 className="form-card-title mb-0">Declaration &amp; Agreement</h2>
                      <p className="form-card-subtitle mb-0">
                        SELF DRIVE VEHICLE RENTAL — ALL RIDE Rentals
                      </p>
                    </div>
                  </div>
                </div>

                <div className="form-body">
                  {/* Scrollable T&C Content */}
                  <div className="tnc-scroll-wrapper" tabIndex={0} aria-label="Terms and conditions content">

                    {/* ── DECLARATION ───────────────────────────────────────── */}
                    <div className="tnc-section">
                      <h3 className="tnc-heading">
                        <i className="bi bi-journal-text me-2"></i>Declaration
                      </h3>
                      <ol className="tnc-ordered-list">
                        {DECLARATION_ITEMS.map((item, i) => (
                          <li key={i} className="tnc-list-item">{item}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="tnc-divider"></div>

                    {/* ── AGREEMENT HEADER ──────────────────────────────────── */}
                    <div className="tnc-section">
                      <h3 className="tnc-heading">
                        <i className="bi bi-file-earmark-ruled me-2"></i>
                        Agreement – Self Drive Rental
                      </h3>
                      <div className="tnc-dear-customer">
                        <p>
                          <strong>Dear Valued Customer,</strong>
                        </p>
                        <p>
                          Thank you for renting a self-drive vehicle. By signing this agreement, you
                          acknowledge that you have read, understood, and accepted the following terms
                          and conditions.
                        </p>
                      </div>
                    </div>

                    <div className="tnc-divider"></div>

                    {/* ── CONDITIONS ────────────────────────────────────────── */}
                    <div className="tnc-section">
                      <h4 className="tnc-subheading">
                        <i className="bi bi-list-check me-2"></i>Conditions
                      </h4>
                      <ul className="tnc-bullet-list">
                        {CONDITIONS.map((cond, i) => (
                          <li key={i} className="tnc-list-item">{cond}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="tnc-divider"></div>

                    {/* ── PENALTIES ─────────────────────────────────────────── */}
                    <div className="tnc-section">
                      <h4 className="tnc-subheading">
                        <i className="bi bi-exclamation-triangle-fill me-2 text-warning"></i>
                        Penalties
                      </h4>
                      <div className="table-responsive">
                        <table className="table tnc-penalty-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Offence</th>
                              <th className="text-end">Charge</th>
                            </tr>
                          </thead>
                          <tbody>
                            {PENALTIES.map((p, i) => (
                              <tr key={i}>
                                <td className="penalty-num">{i + 1}</td>
                                <td>{p.offence}</td>
                                <td className="text-end penalty-charge">{p.charge}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="tnc-divider"></div>

                    {/* ── LEGAL LIABILITY ───────────────────────────────────── */}
                    <div className="tnc-section">
                      <h4 className="tnc-subheading">
                        <i className="bi bi-shield-exclamation me-2 text-danger"></i>
                        Legal Liability
                      </h4>
                      <div className="tnc-legal-notice">
                        <p className="mb-0">
                          The rental company shall not be responsible for any criminal or legal
                          liability arising from negligent driving, driving under the influence of
                          alcohol or drugs, traffic violations, accidents, fines, penalties, or
                          towing charges. All such liabilities shall be the sole responsibility of
                          the renter.
                        </p>
                      </div>
                    </div>
                  </div>{/* /tnc-scroll-wrapper */}
                </div>
              </div>

              {/* Agreement Confirmation + Signature Card */}
              <div className="glass-form-card">
                <div className="form-card-header">
                  <div className="d-flex align-items-center gap-3">
                    <div className="form-header-icon">
                      <i className="bi bi-pen-fill"></i>
                    </div>
                    <div>
                      <h2 className="form-card-title mb-0">Agreement Confirmation</h2>
                      <p className="form-card-subtitle mb-0">
                        Check the box and sign to complete your agreement
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleFinalSubmit} noValidate className="form-body">

                  {/* ── Checkbox ──────────────────────────────────────────── */}
                  <div className="tnc-checkbox-wrapper mb-4">
                    <div
                      className={`tnc-checkbox-card ${agreedToTerms ? 'tnc-checkbox-card--checked' : ''} ${termsError ? 'tnc-checkbox-card--error' : ''}`}
                      onClick={() => {
                        setAgreedToTerms((v) => !v);
                        setTermsError('');
                      }}
                      role="checkbox"
                      aria-checked={agreedToTerms}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          setAgreedToTerms((v) => !v);
                          setTermsError('');
                        }
                      }}
                    >
                      <div className={`tnc-custom-check ${agreedToTerms ? 'tnc-custom-check--active' : ''}`}>
                        <i className={`bi ${agreedToTerms ? 'bi-check-lg' : ''}`}></i>
                      </div>
                      <div className="tnc-checkbox-text">
                        <span className="fw-semibold">I have read and agree to the Terms &amp; Conditions</span>
                        <span className="d-block small text-muted mt-1">
                          By checking this box, you confirm that you have read the full declaration and agree to all terms stated above.
                        </span>
                      </div>
                    </div>

                    {termsError && (
                      <div className="tnc-field-error mt-2">
                        <i className="bi bi-exclamation-circle-fill me-1"></i>
                        {termsError}
                      </div>
                    )}
                  </div>

                  {/* ── Digital Signature ─────────────────────────────────── */}
                  <div className="signature-section mb-4">
                    <div className="section-header d-flex align-items-center gap-3 mb-3" style={{ background: 'none', border: 'none', padding: 0 }}>
                      <div className="step-badge">✍</div>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-vector-pen section-icon"></i>
                        <h5 className="section-title mb-0">Digital Signature</h5>
                      </div>
                    </div>

                    <p className="small text-muted mb-3">
                      <i className="bi bi-info-circle me-1"></i>
                      Please sign inside the box below using your mouse or touch screen. Your signature must match your ID proof.
                    </p>

                    <div className={`signature-pad-wrapper ${signatureError ? 'signature-pad-wrapper--error' : ''}`}>
                      <div className="signature-pad-label">
                        <i className="bi bi-pencil-fill me-1"></i>
                        Sign here
                      </div>

                      <SignatureCanvas
                        ref={sigCanvasRef}
                        penColor="#1e293b"
                        canvasProps={{
                          className: 'signature-canvas',
                          'aria-label': 'Digital signature canvas — sign here',
                        }}
                        onBegin={() => setSignatureError('')}
                      />

                      <div className="signature-pad-baseline"></div>
                    </div>

                    {signatureError && (
                      <div className="tnc-field-error mt-2">
                        <i className="bi bi-exclamation-circle-fill me-1"></i>
                        {signatureError}
                      </div>
                    )}

                    <div className="d-flex justify-content-end mt-2">
                      <button
                        type="button"
                        id="btn-clear-signature"
                        className="btn btn-clear-sig"
                        onClick={handleClearSignature}
                        aria-label="Clear the digital signature"
                      >
                        <i className="bi bi-eraser-fill me-2"></i>
                        Clear Signature
                      </button>
                    </div>
                  </div>

                  {/* ── Action Buttons ─────────────────────────────────────── */}
                  <div className="form-buttons-wrapper d-flex flex-column flex-sm-row gap-3 justify-content-between mt-4">
                    {/* Back Button */}
                    <button
                      type="button"
                      id="btn-back-to-form"
                      className="btn btn-back-custom"
                      onClick={onBack}
                      disabled={isSubmitting}
                      aria-label="Go back to the rental form"
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to Form
                    </button>

                    {/* Final Submit */}
                    <button
                      id="btn-final-submit"
                      type="submit"
                      className={`btn btn-submit-custom flex-sm-grow-1 ${(!agreedToTerms) ? 'btn-submit-inactive' : ''}`}
                      disabled={isSubmitting}
                      aria-label="Submit the final rental agreement"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting Agreement…
                        </>
                      ) : (
                        <>
                          <i className="bi bi-patch-check-fill me-2"></i>
                          Submit Agreement
                        </>
                      )}
                    </button>
                  </div>
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

export default DeclarationPage;
