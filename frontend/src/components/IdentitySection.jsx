import React from 'react';
import FormField from './FormField';

/**
 * ID Document type options
 */
const DOCUMENT_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card', icon: 'bi-person-vcard' },
  { value: 'passport', label: 'Passport', icon: 'bi-passport' },
  { value: 'pan', label: 'PAN Card', icon: 'bi-credit-card-2-back' },
  { value: 'voter', label: 'Voter ID', icon: 'bi-person-badge' },
  { value: 'driving', label: "Driving License Copy", icon: 'bi-card-text' },
];

/**
 * Identity Verification Section
 * Fields: ID Proof Number, Document Type, Customer Photo,
 *         Driving License Photo, ID Proof Photo
 */
const IdentitySection = ({ formData, errors, touched, handleChange, handleBlur }) => {
  const field = (name) => ({
    name,
    value: formData[name],
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return (
    <>
      {/* Info banner */}
      <div className="alert id-info-alert d-flex align-items-start gap-3 mb-4" role="alert">
        <i className="bi bi-info-circle-fill id-info-icon flex-shrink-0 mt-1"></i>
        <div>
          <strong>Document Submission:</strong> Please carry the original document to the rental location.
          A photocopy will be retained as per verification policy.
        </div>
      </div>

      <div className="row g-3">
        {/* ID Proof Number */}
        <div className="col-md-6">
          <FormField
            id="idProofNumber"
            label="ID Proof Number"
            icon="bi-fingerprint"
            error={errors.idProofNumber}
            touched={touched.idProofNumber}
            required
          >
            <input
              type="text"
              className="form-control form-control-custom"
              placeholder="e.g. 1234 5678 9012"
              autoComplete="off"
              maxLength={20}
              style={{ textTransform: 'uppercase' }}
              {...field('idProofNumber')}
            />
          </FormField>
          <small className="text-muted d-flex align-items-center gap-1 mt-1">
            <i className="bi bi-shield-lock"></i>
            Your data is securely stored and used only for verification.
          </small>
        </div>

        {/* Document Type */}
        <div className="col-md-6">
          <FormField
            id="documentType"
            label="Document Type (to be handed over)"
            icon="bi-file-earmark-text-fill"
            error={errors.documentType}
            touched={touched.documentType}
            required
          >
            <select
              className="form-select form-control-custom"
              {...field('documentType')}
            >
              <option value="">— Select Document Type —</option>
              {DOCUMENT_TYPES.map((doc) => (
                <option key={doc.value} value={doc.value}>
                  {doc.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      {/* ── Photo Uploads ────────────────────────────────────────────────────── */}
      <div className="row g-3 mt-2">
        {/* Customer Photo */}
        <div className="col-md-4">
          <label className="form-label fw-semibold label-custom" htmlFor="customerPhoto">
            <i className="bi bi-person-bounding-box me-2 label-icon"></i>
            Customer Photo
          </label>
          <input
            id="customerPhoto"
            type="file"
            name="customerPhoto"
            className="form-control form-control-custom"
            accept="image/*"
            capture="user"
            onChange={handleChange}
          />
          {formData.customerPhoto && (
            <small className="text-success d-flex align-items-center gap-1 mt-1">
              <i className="bi bi-check-circle-fill"></i>
              {formData.customerPhoto.name}
            </small>
          )}
        </div>

        {/* Driving License Photo */}
        <div className="col-md-4">
          <label className="form-label fw-semibold label-custom" htmlFor="drivingLicensePhoto">
            <i className="bi bi-card-text me-2 label-icon"></i>
            Driving License Photo
          </label>
          <input
            id="drivingLicensePhoto"
            type="file"
            name="drivingLicensePhoto"
            className="form-control form-control-custom"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
          />
          {formData.drivingLicensePhoto && (
            <small className="text-success d-flex align-items-center gap-1 mt-1">
              <i className="bi bi-check-circle-fill"></i>
              {formData.drivingLicensePhoto.name}
            </small>
          )}
        </div>

        {/* ID Proof Photo */}
        <div className="col-md-4">
          <label className="form-label fw-semibold label-custom" htmlFor="idProofPhoto">
            <i className="bi bi-fingerprint me-2 label-icon"></i>
            ID Proof Photo
          </label>
          <input
            id="idProofPhoto"
            type="file"
            name="idProofPhoto"
            className="form-control form-control-custom"
            accept="image/*"
            capture="environment"
            onChange={handleChange}
          />
          {formData.idProofPhoto && (
            <small className="text-success d-flex align-items-center gap-1 mt-1">
              <i className="bi bi-check-circle-fill"></i>
              {formData.idProofPhoto.name}
            </small>
          )}
        </div>
      </div>

      {/* Terms Notice */}
      <div className="terms-notice mt-3 p-3 rounded-3">
        <div className="d-flex align-items-start gap-2">
          <i className="bi bi-shield-check text-success mt-1"></i>
          <p className="mb-0 small">
            By submitting this form, you confirm that all provided information is accurate
            and you agree to abide by our{' '}
            <a href="#terms" className="terms-link">
              rental terms and conditions
            </a>
            . False information may result in legal action.
          </p>
        </div>
      </div>
    </>
  );
};

export default IdentitySection;
