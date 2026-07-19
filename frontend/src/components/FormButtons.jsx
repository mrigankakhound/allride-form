import React from 'react';

/**
 * Form action buttons: Primary action (submit/next) and Reset.
 *
 * Props:
 *  - onPrimaryAction : function — triggered by the primary button click
 *  - onReset         : function — form reset handler
 *  - primaryLabel    : string   — label for the primary button (default: 'Submit Agreement')
 *  - primaryIcon     : string   — Bootstrap Icon class for primary button
 *  - isLoading       : bool     — disables buttons while submitting
 *  - showReset       : bool     — whether to show the reset button (default: true)
 */
const FormButtons = ({
  onPrimaryAction,
  onReset,
  primaryLabel = 'Submit Agreement',
  primaryIcon = 'bi-send-fill',
  isLoading = false,
  showReset = true,
}) => (
  <div className="form-buttons-wrapper d-flex flex-column flex-sm-row gap-3 justify-content-center mt-5">
    {/* Primary Action Button */}
    <button
      id="btn-primary-action"
      type="submit"
      className="btn btn-submit-custom flex-sm-grow-1"
      disabled={isLoading}
      onClick={onPrimaryAction}
      aria-label={primaryLabel}
    >
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Processing…
        </>
      ) : (
        <>
          <i className={`bi ${primaryIcon} me-2`}></i>
          {primaryLabel}
        </>
      )}
    </button>

    {/* Reset Button */}
    {showReset && (
      <button
        id="btn-reset"
        type="button"
        className="btn btn-reset-custom flex-sm-grow-0"
        disabled={isLoading}
        onClick={onReset}
        aria-label="Reset the form to its initial state"
      >
        <i className="bi bi-arrow-counterclockwise me-2"></i>
        Reset Form
      </button>
    )}
  </div>
);

export default FormButtons;
