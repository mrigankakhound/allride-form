import React from 'react';

/**
 * Reusable form field wrapper with Bootstrap validation feedback.
 *
 * Props:
 *  - id          : string  — unique field ID
 *  - label       : string  — field label text
 *  - error       : string  — validation error message (empty = valid)
 *  - touched     : bool    — whether the field has been interacted with
 *  - required    : bool    — show asterisk indicator
 *  - icon        : string  — Bootstrap icon class (e.g. "bi-person")
 *  - children    : node    — the actual input/select element
 */
const FormField = ({
  id,
  label,
  error,
  touched,
  required = false,
  icon,
  children,
}) => {
  const hasError = touched && error;
  const isValid  = touched && !error;

  return (
    <div className="mb-3 form-field-wrapper">
      <label htmlFor={id} className="form-label fw-semibold label-custom">
        {icon && <i className={`bi ${icon} me-2 label-icon`}></i>}
        {label}
        {required && <span className="text-danger ms-1" aria-hidden="true">*</span>}
      </label>

      {/* Clone child to inject validation classes & aria attributes */}
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          id,
          className: [
            child.props.className || '',
            hasError ? 'is-invalid' : '',
            isValid  ? 'is-valid'   : '',
          ]
            .filter(Boolean)
            .join(' '),
          'aria-describedby': hasError ? `${id}-feedback` : undefined,
          'aria-invalid': hasError ? 'true' : undefined,
        })
      )}

      {hasError && (
        <div id={`${id}-feedback`} className="invalid-feedback d-flex align-items-center gap-1">
          <i className="bi bi-exclamation-circle-fill"></i>
          {error}
        </div>
      )}
      {isValid && (
        <div className="valid-feedback d-flex align-items-center gap-1">
          <i className="bi bi-check-circle-fill"></i>
          Looks good!
        </div>
      )}
    </div>
  );
};

export default FormField;
