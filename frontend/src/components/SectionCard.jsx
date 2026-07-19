import React from 'react';

/**
 * Section card wrapper — renders a titled, animated card section.
 *
 * Props:
 *  - title      : string  — section heading
 *  - icon       : string  — Bootstrap Icon class
 *  - children   : node
 *  - stepNumber : number  — displayed badge number
 */
const SectionCard = ({ title, icon, children, stepNumber }) => (
  <div className="section-card mb-4 animate-section">
    <div className="section-header d-flex align-items-center gap-3">
      <div className="step-badge">{stepNumber}</div>
      <div className="d-flex align-items-center gap-2">
        <i className={`bi ${icon} section-icon`}></i>
        <h5 className="section-title mb-0">{title}</h5>
      </div>
    </div>
    <div className="section-body">
      {children}
    </div>
  </div>
);

export default SectionCard;
