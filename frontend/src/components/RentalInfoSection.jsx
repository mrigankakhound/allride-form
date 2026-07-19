import React from 'react';
import FormField from './FormField';

/**
 * Vehicle Type Radio Option Card
 * Renders a styled radio button as a selectable card.
 */
const VehicleTypeCard = ({ id, name, value, label, subtitle, icon, checked, onChange, onBlur }) => (
  <div className="col-12 col-md-4">
    <div
      className={`vehicle-type-card ${checked ? 'vehicle-type-card--selected' : ''}`}
      onClick={() => onChange({ target: { name, value } })}
    >
      <input
        type="radio"
        className="form-check-input visually-hidden"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}
      />
      <label htmlFor={id} className="vehicle-type-label" style={{ cursor: 'pointer', width: '100%' }}>
        <div className="vehicle-type-icon-wrapper mb-2">
          <i className={`bi ${icon} vehicle-type-icon`}></i>
        </div>
        <div className="vehicle-type-name fw-bold">{label}</div>
        <div className="vehicle-type-sub text-muted small">{subtitle}</div>
        <div className="vehicle-type-check mt-2">
          <i className={`bi ${checked ? 'bi-check-circle-fill text-success' : 'bi-circle text-secondary'}`}></i>
        </div>
      </label>
    </div>
  </div>
);

// ─── Vehicle Types Config ──────────────────────────────────────────────────────
const VEHICLE_TYPES = [
  {
    id: 'vehicleType-mcwog',
    value: 'MCWOG',
    label: 'Scooty without Gear',
    subtitle: 'MCWOG — Moped / Scooter',
    icon: 'bi-scooter',
  },
  {
    id: 'vehicleType-mcwg',
    value: 'MCWG',
    label: 'Bike',
    subtitle: 'MCWG — Motorcycle with Gear',
    icon: 'bi-bicycle',
  },
  {
    id: 'vehicleType-lmv',
    value: 'LMV',
    label: 'Car',
    subtitle: 'LMV — Light Motor Vehicle',
    icon: 'bi-car-front-fill',
  },
];

/**
 * Rental Information Section
 * Fields: Purpose, Vehicle Type (Radio Cards), Reg Number,
 *         Vehicle Model, Rental Duration
 */
const RentalInfoSection = ({ formData, errors, touched, handleChange, handleBlur }) => {
  const field = (name) => ({
    name,
    value: formData[name],
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return (
    <>
      {/* Purpose */}
      <FormField
        id="rentalPurpose"
        label="Purpose of Vehicle Renting"
        icon="bi-chat-text-fill"
        error={errors.rentalPurpose}
        touched={touched.rentalPurpose}
        required
      >
        <select
          className="form-select form-control-custom"
          {...field('rentalPurpose')}
        >
          <option value="">— Select Purpose —</option>
          <option value="Personal Travel">Personal Travel</option>
          <option value="Business Trip">Business Trip</option>
          <option value="Tourism / Sightseeing">Tourism / Sightseeing</option>
          <option value="Daily Commute">Daily Commute</option>
          <option value="Airport Transfer">Airport Transfer</option>
          <option value="Wedding / Event">Wedding / Event</option>
          <option value="Other">Other</option>
        </select>
      </FormField>

      {/* Vehicle Type — Radio Cards */}
      <div className="mb-3">
        <label className="form-label fw-semibold label-custom">
          <i className="bi bi-grid-3x2-gap-fill me-2 label-icon"></i>
          Rental Vehicle Type
          <span className="text-danger ms-1" aria-hidden="true">*</span>
        </label>

        <div className="row g-3 vehicle-type-row">
          {VEHICLE_TYPES.map((vt) => (
            <VehicleTypeCard
              key={vt.id}
              id={vt.id}
              name="vehicleType"
              value={vt.value}
              label={vt.label}
              subtitle={vt.subtitle}
              icon={vt.icon}
              checked={formData.vehicleType === vt.value}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          ))}
        </div>

        {touched.vehicleType && errors.vehicleType && (
          <div className="invalid-feedback d-flex align-items-center gap-1 mt-1" style={{ display: 'block !important' }}>
            <i className="bi bi-exclamation-circle-fill"></i>
            {errors.vehicleType}
          </div>
        )}
        {touched.vehicleType && errors.vehicleType && (
          <div className="text-danger small mt-1 d-flex align-items-center gap-1">
            <i className="bi bi-exclamation-circle-fill"></i>
            {errors.vehicleType}
          </div>
        )}
      </div>

      {/* Rented Vehicle Registration Number + Model */}
      <div className="row g-3">
        <div className="col-md-6">
          <FormField
            id="registrationNumber"
            label="Rented Vehicle Registration No."
            icon="bi-tag-fill"
            error={errors.registrationNumber}
            touched={touched.registrationNumber}
            required
          >
            <input
              type="text"
              className="form-control form-control-custom"
              placeholder="e.g. KA 01 AB 1234"
              autoComplete="off"
              style={{ textTransform: 'uppercase' }}
              {...field('registrationNumber')}
            />
          </FormField>
        </div>
        <div className="col-md-6">
          <FormField
            id="vehicleModel"
            label="Vehicle Model"
            icon="bi-truck-front-fill"
            error={errors.vehicleModel}
            touched={touched.vehicleModel}
            required
          >
            <input
              type="text"
              className="form-control form-control-custom"
              placeholder="e.g. Honda Activa 6G"
              autoComplete="off"
              {...field('vehicleModel')}
            />
          </FormField>
        </div>
      </div>

      {/* Rental Duration + Destination */}
      <div className="row g-3">
        <div className="col-md-4">
          <FormField
            id="rentalDuration"
            label="Rental Duration (Days)"
            icon="bi-calendar-range-fill"
            error={errors.rentalDuration}
            touched={touched.rentalDuration}
            required
          >
            <input
              type="number"
              className="form-control form-control-custom"
              placeholder="e.g. 3"
              min={1}
              max={365}
              step={1}
              name="rentalDuration"
              value={formData.rentalDuration}
              onChange={(e) => {
                // Use the raw string value so the user can clear the field
                // and type freely — do NOT read valueAsNumber (it returns NaN
                // when empty and causes controlled-input flicker).
                // We pass a synthetic event to the shared handleChange so all
                // touched/error logic stays intact.
                handleChange({
                  target: {
                    name: 'rentalDuration',
                    type: 'number',
                    value: e.target.value,           // raw string, e.g. "7"
                  },
                });
              }}
              onBlur={handleBlur}
            />
          </FormField>
          <small className="text-muted d-flex align-items-center gap-1 mt-1">
            <i className="bi bi-info-circle"></i>
            Must be at least 1 day (max 365)
          </small>
        </div>
        <div className="col-md-4">
          <FormField
            id="destination"
            label="Destination"
            icon="bi-geo-fill"
            error={errors.destination}
            touched={touched.destination}
            required
          >
            <input
              type="text"
              className="form-control form-control-custom"
              placeholder="e.g. Mysuru, Coorg"
              autoComplete="off"
              {...field('destination')}
            />
          </FormField>
        </div>
      </div>
    </>
  );
};

export default RentalInfoSection;
