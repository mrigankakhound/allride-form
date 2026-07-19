import { useState, useCallback } from 'react';
import {
  isRequired,
  validateZip,
  validateLicense,
  validateDuration,
  validateFutureDate,
  validateIdProof,
  validatePhone,
} from '../utils/validators';

// ─── Initial Form State ────────────────────────────────────────────────────────
const INITIAL_STATE = {
  // Personal Info
  firstName: '',
  lastName: '',
  contactNumber: '',
  homeAddress: '',
  localAddress: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',

  // Driver Info
  licenseNumber: '',
  licenseExpiry: '',

  // Rental Info
  rentalPurpose: '',
  vehicleType: '',
  registrationNumber: '',
  vehicleModel: '',
  rentalDuration: '',
  destination: '',

  // Identity Verification
  idProofNumber: '',
  documentType: '',

  // File uploads (File objects — not validated by text validators)
  customerPhoto: null,
  drivingLicensePhoto: null,
  idProofPhoto: null,
};

// ─── Initial Error State ───────────────────────────────────────────────────────
const INITIAL_ERRORS = Object.fromEntries(
  Object.keys(INITIAL_STATE).map((key) => [key, ''])
);

// ─── Field-Level Validator Map ─────────────────────────────────────────────────
const validateField = (name, value) => {
  switch (name) {
    case 'firstName':
      return isRequired(value) ? '' : 'First name is required.';
    case 'lastName':
      return isRequired(value) ? '' : 'Last name is required.';
    case 'contactNumber':
      if (!isRequired(value)) return 'Contact number is required.';
      return validatePhone(value) ? '' : 'Enter a valid phone number (e.g. 9876543210 or +91 9876543210).';
    case 'homeAddress':
      return isRequired(value) ? '' : 'Home address is required.';
    case 'localAddress':
      return isRequired(value) ? '' : 'Local address is required.';
    case 'city':
      return isRequired(value) ? '' : 'City is required.';
    case 'state':
      return isRequired(value) ? '' : 'State is required.';
    case 'zipCode':
      if (!isRequired(value)) return 'ZIP / PIN code is required.';
      return validateZip(value) ? '' : 'Enter a valid ZIP (5 digits) or PIN code (6 digits).';
    case 'country':
      return isRequired(value) ? '' : 'Country is required.';
    case 'licenseNumber':
      if (!isRequired(value)) return "Driver's license number is required.";
      return validateLicense(value) ? '' : 'Enter a valid license number (6–20 alphanumeric characters).';
    case 'licenseExpiry':
      if (!isRequired(value)) return 'License expiry date is required.';
      return validateFutureDate(value) ? '' : 'License must not be expired.';
    case 'rentalPurpose':
      return isRequired(value) ? '' : 'Purpose of rental is required.';
    case 'vehicleType':
      return isRequired(value) ? '' : 'Please select a vehicle type.';
    case 'registrationNumber':
      return isRequired(value) ? '' : 'Vehicle registration number is required.';
    case 'vehicleModel':
      return isRequired(value) ? '' : 'Vehicle model is required.';
    case 'rentalDuration':
      if (!isRequired(value)) return 'Rental duration is required.';
      return validateDuration(value) ? '' : 'Duration must be a whole number greater than zero.';
    case 'destination':
      return isRequired(value) ? '' : 'Destination is required.';
    case 'idProofNumber':
      if (!isRequired(value)) return 'ID proof number is required.';
      return validateIdProof(value) ? '' : 'Enter a valid ID number (6–20 alphanumeric characters).';
    case 'documentType':
      return isRequired(value) ? '' : 'Please select a document type.';
    default:
      return '';
  }
};

// ─── Custom Hook ───────────────────────────────────────────────────────────────
const useFormValidation = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /** Update a single field value and clear its error on change */
  const handleChange = useCallback((e) => {
    const { name, type, value, files } = e.target;
    // Handle file inputs — store the File object
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] || null }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  }, [touched]);

  /** Mark field as touched and validate on blur */
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }, []);

  /** Validate all fields and return whether the form is valid */
  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      newErrors[key] = err;
      if (err) isValid = false;
    });
    setErrors(newErrors);
    setTouched(Object.fromEntries(Object.keys(formData).map((k) => [k, true])));
    return isValid;
  }, [formData]);

  /**
   * Validate all fields for page-1 navigation.
   * Returns true if valid (caller can navigate to page 2).
   * Marks all fields as touched and shows errors without submitting.
   */
  const validateAndProceed = useCallback(() => {
    const valid = validateAll();
    if (!valid) {
      // Scroll to first error field
      setTimeout(() => {
        const firstError = document.querySelector('.is-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    }
    return valid;
  }, [validateAll]);

  /** Handle form submission */
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setSubmitted(true);
      const valid = validateAll();
      if (valid) {
        // ── Ready for backend integration ──────────────────────────────────────
        // Example: await axios.post('/api/rental-agreements', formData);
        console.log('Form submitted successfully:', formData);
        setSubmitSuccess(true);
      } else {
        setSubmitSuccess(false);
        // Scroll to first error
        const firstError = document.querySelector('.is-invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    },
    [formData, validateAll]
  );

  /** Reset form to initial state */
  const handleReset = useCallback(() => {
    setFormData(INITIAL_STATE);
    setErrors(INITIAL_ERRORS);
    setTouched({});
    setSubmitted(false);
    setSubmitSuccess(false);
  }, []);

  return {
    formData,
    errors,
    touched,
    submitted,
    submitSuccess,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    setSubmitSuccess,
    validateAndProceed,
  };
};

export default useFormValidation;
