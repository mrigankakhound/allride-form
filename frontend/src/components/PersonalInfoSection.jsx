import React from 'react';
import FormField from './FormField';

/**
 * Personal Information Section
 * Fields: First Name, Last Name, Home Address, Local Address,
 *         City, State, ZIP Code, Country
 */
const PersonalInfoSection = ({ formData, errors, touched, handleChange, handleBlur }) => {
  const field = (name) => ({
    name,
    value: formData[name],
    onChange: handleChange,
    onBlur: handleBlur,
  });

  return (
    <>
      {/* Row 1: First Name + Last Name */}
      <div className="row g-3">
        <div className="col-md-6">
          <FormField
            id="firstName"
            label="First Name"
            icon="bi-person-fill"
            error={errors.firstName}
            touched={touched.firstName}
            required
          >
            <input
              type="text"
              className="form-control form-control-custom"
              placeholder="e.g. Rahul"
              autoComplete="given-name"
              {...field('firstName')}
            />
          </FormField>
        </div>
        <div className="col-md-6">
          <FormField
            id="lastName"
            label="Last Name"
            icon="bi-person-fill"
            error={errors.lastName}
            touched={touched.lastName}
            required
          >
            <input
              type="text"
              className="form-control form-control-custom"
              placeholder="e.g. Sharma"
              autoComplete="family-name"
              {...field('lastName')}
            />
          </FormField>
        </div>
      </div>

      {/* Row 2: Contact Number */}
      <div className="row g-3">
        <div className="col-md-6">
          <FormField
            id="contactNumber"
            label="Contact Number"
            icon="bi-telephone-fill"
            error={errors.contactNumber}
            touched={touched.contactNumber}
            required
          >
            <input
              type="tel"
              className="form-control form-control-custom"
              placeholder="e.g. 9876543210 or +91 9876543210"
              autoComplete="tel"
              {...field('contactNumber')}
            />
          </FormField>
        </div>
      </div>

      {/* Row 3: Home Address */}
      <FormField
        id="homeAddress"
        label="Home Address (Permanent – as per ID Proof)"
        icon="bi-house-fill"
        error={errors.homeAddress}
        touched={touched.homeAddress}
        required
      >
        <textarea
          className="form-control form-control-custom"
          placeholder="Enter your permanent address as on government ID"
          rows={2}
          autoComplete="street-address"
          {...field('homeAddress')}
        />
      </FormField>

      {/* Row 3: Local Address */}
      <FormField
        id="localAddress"
        label="Local Address (Current Stay)"
        icon="bi-geo-alt-fill"
        error={errors.localAddress}
        touched={touched.localAddress}
        required
      >
        <textarea
          className="form-control form-control-custom"
          placeholder="Enter your current local address"
          rows={2}
          {...field('localAddress')}
        />
      </FormField>

      {/* Row 4: City + State */}
      <div className="row g-3">
        <div className="col-md-6">
          <FormField
            id="city"
            label="City"
            icon="bi-building"
            error={errors.city}
            touched={touched.city}
            required
          >
            <input
              type="text"
              className="form-control form-control-custom"
              placeholder="e.g. Bengaluru"
              autoComplete="address-level2"
              {...field('city')}
            />
          </FormField>
        </div>
        <div className="col-md-6">
          <FormField
            id="state"
            label="State / Province"
            icon="bi-map-fill"
            error={errors.state}
            touched={touched.state}
            required
          >
            <input
              type="text"
              className="form-control form-control-custom"
              placeholder="e.g. Karnataka"
              autoComplete="address-level1"
              {...field('state')}
            />
          </FormField>
        </div>
      </div>

      {/* Row 5: ZIP + Country */}
      <div className="row g-3">
        <div className="col-md-6">
          <FormField
            id="zipCode"
            label="ZIP / PIN Code"
            icon="bi-mailbox-flag"
            error={errors.zipCode}
            touched={touched.zipCode}
            required
          >
            <input
              type="text"
              className="form-control form-control-custom"
              placeholder="e.g. 560001 or 10001"
              autoComplete="postal-code"
              maxLength={10}
              {...field('zipCode')}
            />
          </FormField>
        </div>
        <div className="col-md-6">
          <FormField
            id="country"
            label="Country"
            icon="bi-globe2"
            error={errors.country}
            touched={touched.country}
            required
          >
            <select
              className="form-select form-control-custom"
              autoComplete="country-name"
              {...field('country')}
            >
              <option value="">— Select Country —</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Singapore">Singapore</option>
              <option value="UAE">United Arab Emirates</option>
              <option value="Other">Other</option>
            </select>
          </FormField>
        </div>
      </div>
    </>
  );
};

export default PersonalInfoSection;
