const mongoose = require('mongoose');

const rentalAgreementSchema = new mongoose.Schema(
  {
    // ── Personal Information ────────────────────────────────────────────────────
    firstName:     { type: String, required: true, trim: true },
    lastName:      { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    homeAddress:   { type: String, required: true, trim: true },
    localAddress:  { type: String, required: true, trim: true },
    city:          { type: String, required: true, trim: true },
    state:         { type: String, required: true, trim: true },
    zipCode:       { type: String, required: true, trim: true },
    country:       { type: String, required: true, trim: true },

    // ── Driver Information ──────────────────────────────────────────────────────
    licenseNumber: { type: String, required: true, trim: true, uppercase: true },
    licenseExpiry: { type: String, required: true },

    // ── Rental Information ──────────────────────────────────────────────────────
    rentalPurpose:      { type: String, required: true, trim: true },
    vehicleType:        { type: String, required: true, enum: ['MCWOG', 'MCWG', 'LMV'] },
    registrationNumber: { type: String, required: true, trim: true, uppercase: true },
    vehicleModel:       { type: String, required: true, trim: true },
    rentalDuration:     { type: Number, required: true, min: 1, max: 365 },
    destination:        { type: String, required: true, trim: true },

    // ── Identity Verification ───────────────────────────────────────────────────
    idProofNumber: { type: String, required: true, trim: true, uppercase: true },
    documentType:  { type: String, required: true, trim: true },

    // ── Agreement ──────────────────────────────────────────────────────────────
    agreedToTerms: { type: Boolean, required: true, default: false },

    // ── Cloudinary File URLs ────────────────────────────────────────────────────
    customerPhotoUrl:      { type: String, default: '' },
    drivingLicensePhotoUrl:{ type: String, default: '' },
    idProofPhotoUrl:       { type: String, default: '' },
    signatureUrl:          { type: String, default: '' },

    // ── Submission Timestamp ────────────────────────────────────────────────────
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RentalAgreement', rentalAgreementSchema);
