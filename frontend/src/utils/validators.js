// ─── Pure Validation Functions ────────────────────────────────────────────────

/**
 * Validates a US-style ZIP code (5 digits or ZIP+4 format).
 * Also accepts Indian PIN codes (6 digits).
 */
export const validateZip = (zip) => {
  const trimmed = zip.trim();
  // US ZIP: 5 digits or 5+4
  const usZip = /^\d{5}(-\d{4})?$/;
  // Indian PIN: 6 digits
  const inPin = /^\d{6}$/;
  return usZip.test(trimmed) || inPin.test(trimmed);
};

/**
 * Validates a Driver's License Number.
 * Accepts alphanumeric strings between 6–20 characters (basic format).
 * Format: letters, numbers, optional hyphens/spaces.
 */
export const validateLicense = (license) => {
  const trimmed = license.trim();
  return /^[A-Za-z0-9 -]{6,20}$/.test(trimmed);
};

/**
 * Validates that a string is not empty or whitespace-only.
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim().length > 0;
};

/**
 * Validates that rental duration is a positive integer greater than 0.
 */
export const validateDuration = (days) => {
  const n = Number(days);
  return Number.isInteger(n) && n > 0;
};

/**
 * Validates that a date is in the future (for license expiry).
 */
export const validateFutureDate = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Validates an ID Proof number (alphanumeric, 6-20 chars).
 */
export const validateIdProof = (id) => {
  return /^[A-Za-z0-9 -]{6,20}$/.test(id.trim());
};

/**
 * Validates a contact/phone number.
 * Accepts Indian 10-digit numbers and international formats with optional +country code.
 * Examples: 9876543210, +91 9876543210, +1-800-555-0199
 */
export const validatePhone = (phone) => {
  const trimmed = phone.trim();
  // Indian 10-digit (optionally starting with +91)
  const indian = /^(\+91[-\s]?)?[6-9]\d{9}$/;
  // Generic international: +countrycode followed by 6-15 digits/spaces/hyphens
  const intl = /^\+?[1-9]\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
  return indian.test(trimmed) || intl.test(trimmed);
};
