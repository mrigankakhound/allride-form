import React from 'react';
import FormField from './FormField';

/**
 * Driver Information Section
 * Fields: Driver's License Number, License Expiry Date
 */
const DriverInfoSection = ({ formData, errors, touched, handleChange, handleBlur }) => {
  const field = (name) => ({
    name,
    value: formData[name],
    onChange: handleChange,
    onBlur: handleBlur,
  });

  // Today's date in yyyy-mm-dd for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="row g-3">
      {/* License Number */}
      <div className="col-md-6">
        <FormField
          id="licenseNumber"
          label="Driver's License Number"
          icon="bi-card-text"
          error={errors.licenseNumber}
          touched={touched.licenseNumber}
          required
        >
          <input
            type="text"
            className="form-control form-control-custom"
            placeholder="e.g. KA01-20231234567"
            autoComplete="off"
            maxLength={20}
            style={{ textTransform: 'uppercase' }}
            {...field('licenseNumber')}
          />
        </FormField>
        <small className="text-muted d-flex align-items-center gap-1 mt-1">
          <i className="bi bi-info-circle"></i>
          Alphanumeric, 6–20 characters (hyphens/spaces allowed)
        </small>
      </div>

      {/* License Expiry Date */}
      <div className="col-md-6">
        <FormField
          id="licenseExpiry"
          label="License Expiration Date"
          icon="bi-calendar-event-fill"
          error={errors.licenseExpiry}
          touched={touched.licenseExpiry}
          required
        >
          <input
            type="date"
            className="form-control form-control-custom"
            min={today}
            {...field('licenseExpiry')}
          />
        </FormField>
        <small className="text-muted d-flex align-items-center gap-1 mt-1">
          <i className="bi bi-info-circle"></i>
          Must be a future date (license must not be expired)
        </small>
      </div>
    </div>
  );
};

export default DriverInfoSection;
