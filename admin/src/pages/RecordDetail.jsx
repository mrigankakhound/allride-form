import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const vehicleLabel = (type) => {
  const map = { MCWOG: 'Scooty (MCWOG)', MCWG: 'Bike (MCWG)', LMV: 'Car (LMV)' };
  return map[type] || type;
};

const docLabel = (type) => {
  const map = {
    aadhaar: 'Aadhaar Card',
    passport: 'Passport',
    pan: 'PAN Card',
    voter: 'Voter ID',
    driving: 'Driving License Copy',
  };
  return map[type] || type;
};

// ── Photo Card Component ───────────────────────────────────────────────────────
const PhotoCard = ({ label, icon, url }) => (
  <div className="photo-card">
    <div className="photo-label"><i className={`bi ${icon}`} />{label}</div>
    {url ? (
      <>
        <img src={url} alt={label} className="photo-img" />
        <a href={url} target="_blank" rel="noreferrer" className="photo-open-link">
          <i className="bi bi-box-arrow-up-right me-1" />Open full size
        </a>
      </>
    ) : (
      <div className="photo-no-img">
        <i className="bi bi-image-alt" />
        <span>Not uploaded</span>
      </div>
    )}
  </div>
);

// ── Detail Item Component ──────────────────────────────────────────────────────
const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <div className="detail-key">{label}</div>
    <div className="detail-val">{value || '—'}</div>
  </div>
);

// ── PDF Generation ────────────────────────────────────────────────────────────
const generatePDF = async (data) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // ── Logo / Header ────────────────────────────────────────────────────────────
  // Try to load the logo from the admin public folder
  let logoLoaded = false;
  try {
    const logoUrl = `${window.location.origin}/OIP-removebg-preview.png`;
    const logoData = await fetchImageAsDataUrl(logoUrl);
    if (logoData) {
      // Draw logo centred at top (max width 50mm, max height 20mm — preserve ratio)
      const maxW = 50, maxH = 20;
      // jsPDF addImage will scale to fit; use a fixed height and let width auto
      doc.addImage(logoData, 'PNG', (pageW - maxW) / 2, 6, maxW, maxH);
      logoLoaded = true;
    }
  } catch (_) {
    logoLoaded = false;
  }

  if (!logoLoaded) {
    // Fallback: text header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('ALL RIDE Rentals Self Drive Vehicle Rental', pageW / 2, 14, { align: 'center' });
  }

  // Thin separator line below header area
  const headerBottom = 28;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(margin, headerBottom, pageW - margin, headerBottom);

  // Document title + date (right-aligned)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('VEHICLE RENTAL AGREEMENT', margin, headerBottom + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(
    `Submitted: ${new Date(data.submittedAt).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
    })}`,
    pageW - margin, headerBottom + 7, { align: 'right' }
  );

  let y = headerBottom + 14;

  // ── Section helper ─────────────────────────────────────────────────────────
  const sectionTitle = (title) => {
    // Light grey background strip for section heading
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y - 4, pageW - margin * 2, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(title, margin + 2, y + 1);
    y += 7;
  };

  // Common table styles (B&W)
  const bwTableStyles = {
    fillColor: [255, 255, 255],
    textColor: [0, 0, 0],
    lineColor: [180, 180, 180],
    lineWidth: 0.2,
    cellPadding: 3,
  };
  const bwKeyStyle = { cellWidth: 40, fontStyle: 'bold', textColor: [40, 40, 40], fontSize: 8, fillColor: [245, 245, 245] };
  const bwValStyle = { cellWidth: 50, textColor: [0, 0, 0], fontSize: 8, fillColor: [255, 255, 255] };

  // ── 1. Personal Information ────────────────────────────────────────────────
  sectionTitle('1. PERSONAL INFORMATION');

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [],
    body: [
      ['Full Name', `${data.firstName} ${data.lastName}`, 'Contact Number', data.contactNumber || '—'],
      ['Home Address', data.homeAddress, 'Local Address', data.localAddress],
      ['City', data.city, 'State', data.state],
      ['ZIP / PIN', data.zipCode, 'Country', data.country],
      ['ID Proof No.', data.idProofNumber, 'Document Type', docLabel(data.documentType)],
    ],
    columnStyles: {
      0: { ...bwKeyStyle },
      1: { ...bwValStyle },
      2: { ...bwKeyStyle },
      3: { ...bwValStyle },
    },
    styles: { ...bwTableStyles },
    theme: 'grid',
  });
  y = doc.lastAutoTable.finalY + 8;

  // ── 2. Driver Information ──────────────────────────────────────────────────
  sectionTitle('2. DRIVER INFORMATION');

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [],
    body: [
      ["Driver's License No.", data.licenseNumber, 'License Expiry', data.licenseExpiry],
    ],
    columnStyles: {
      0: { cellWidth: 45, fontStyle: 'bold', textColor: [40, 40, 40], fontSize: 8, fillColor: [245, 245, 245] },
      1: { cellWidth: 45, textColor: [0, 0, 0], fontSize: 8, fillColor: [255, 255, 255] },
      2: { cellWidth: 45, fontStyle: 'bold', textColor: [40, 40, 40], fontSize: 8, fillColor: [245, 245, 245] },
      3: { cellWidth: 45, textColor: [0, 0, 0], fontSize: 8, fillColor: [255, 255, 255] },
    },
    styles: { ...bwTableStyles },
    theme: 'grid',
  });
  y = doc.lastAutoTable.finalY + 8;

  // ── 3. Vehicle & Rental Information ───────────────────────────────────────
  sectionTitle('3. VEHICLE & RENTAL INFORMATION');

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [],
    body: [
      ['Vehicle Type', vehicleLabel(data.vehicleType), 'Reg. Number', data.registrationNumber],
      ['Vehicle Model', data.vehicleModel, 'Rental Duration', `${data.rentalDuration} day${data.rentalDuration !== 1 ? 's' : ''}`],
      ['Purpose', data.rentalPurpose, 'Destination', data.destination || '—'],
      ['Agreed to Terms', data.agreedToTerms ? 'Yes' : 'No', '', ''],
    ],
    columnStyles: {
      0: { ...bwKeyStyle },
      1: { ...bwValStyle },
      2: { ...bwKeyStyle },
      3: { ...bwValStyle },
    },
    styles: { ...bwTableStyles },
    theme: 'grid',
  });
  y = doc.lastAutoTable.finalY + 8;

  // ── 4. Documents & Signature (images in original colour) ──────────────────
  const imageFields = [
    { label: 'Customer Photo', url: data.customerPhotoUrl },
    { label: 'Driving License Photo', url: data.drivingLicensePhotoUrl },
    { label: 'ID Proof Photo', url: data.idProofPhotoUrl },
    { label: 'Digital Signature', url: data.signatureUrl },
  ];

  const validImages = imageFields.filter((f) => f.url);
  if (validImages.length > 0) {
    if (y + 70 > 270) { doc.addPage(); y = 20; }
    sectionTitle('4. DOCUMENTS & SIGNATURE');

    const imgW = 43, imgH = 36;
    const spacing = 2;
    let imgX = margin;

    for (const field of validImages) {
      if (imgX + imgW > pageW - margin) {
        imgX = margin;
        y += imgH + spacing + 14;
      }
      if (y + imgH + 15 > 275) { doc.addPage(); y = 20; imgX = margin; }

      try {
        const imgData = await fetchImageAsDataUrl(field.url);
        if (imgData) {
          // Label
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.setTextColor(40, 40, 40);
          doc.text(field.label.toUpperCase(), imgX, y);

          // Border — thin black
          doc.setDrawColor(0, 0, 0);
          doc.setLineWidth(0.3);
          doc.rect(imgX, y + 2, imgW, imgH);

          // Image in original colour (no grayscale)
          const ext = field.url.split('.').pop().split('?')[0].toUpperCase();
          const fmt = ['JPG', 'JPEG'].includes(ext) ? 'JPEG' : 'PNG';
          doc.addImage(imgData, fmt, imgX, y + 2, imgW, imgH);
        }
      } catch (_) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(80, 80, 80);
        doc.text(field.label.toUpperCase(), imgX, y);
        doc.setDrawColor(0, 0, 0);
        doc.rect(imgX, y + 2, imgW, imgH);
        doc.text('See online', imgX + imgW / 2, y + imgH / 2 + 2, { align: 'center' });
      }

      imgX += imgW + spacing;
    }
    y += imgH + spacing + 15;
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.4);
    doc.line(margin, 284, pageW - margin, 284);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(60, 60, 60);
    doc.text('© ALL RIDE Rentals — Vehicle Rental Agreement', margin, 290);
    doc.text(`Page ${i} of ${totalPages}`, pageW - margin, 290, { align: 'right' });
  }

  doc.save(`rental-agreement-${data.firstName}-${data.lastName}-${data._id.slice(-6)}.pdf`);
};


// ── Cross-origin image loader via canvas ─────────────────────────────────────
const fetchImageAsDataUrl = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = reject;
    img.src = url;
  });

// ── Record Detail Page ────────────────────────────────────────────────────────
const RecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);

  const fetchRecord = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/rental-agreements/${id}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Not found');
      setData(json.data);
    } catch (err) {
      setError(err.message || 'Unable to load record.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchRecord(); }, [fetchRecord]);

  const handleDownloadPDF = async () => {
    if (!data) return;
    setPdfLoading(true);
    try {
      await generatePDF(data);
    } catch (e) {
      console.error('PDF error:', e);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <SidebarMini onLogout={handleLogout} />
        <div className="admin-content">
          <div className="admin-spinner-wrap"><div className="admin-spinner" /></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-layout">
        <SidebarMini onLogout={handleLogout} />
        <div className="admin-content">
          <div className="admin-main">
            <div className="admin-error">
              <i className="bi bi-exclamation-triangle-fill" />
              {error}
            </div>
            <button className="detail-back-btn" onClick={() => navigate('/dashboard')}>
              <i className="bi bi-arrow-left" />Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <SidebarMini onLogout={handleLogout} />

      <div className="admin-content">
        {/* Topbar */}
        <div className="admin-topbar">
          <div>
            <div className="admin-topbar-title">
              <i className="bi bi-file-earmark-person-fill me-2" style={{ color: 'var(--accent)' }} />
              <span style={{ color: 'white' }}>Agreement Details</span>
            </div>
            <div className="admin-topbar-sub">Record ID: {data?._id}</div>
          </div>
          <span className="admin-badge">
            <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem', color: '#10b981' }} />
            Admin
          </span>
        </div>

        <main className="admin-main">
          {/* Back + Header */}
          <button className="detail-back-btn" onClick={() => navigate('/dashboard')}>
            <i className="bi bi-arrow-left" />Back to Dashboard
          </button>

          <div className="detail-header">
            <div>
              <div className="detail-title">{data.firstName} {data.lastName}</div>
              <div className="detail-subtitle">
                <i className="bi bi-calendar-check me-1" />
                Submitted: {formatDate(data.submittedAt)}
              </div>
            </div>

            <button
              id="btn-download-pdf"
              className="download-pdf-btn"
              onClick={handleDownloadPDF}
              disabled={pdfLoading}
            >
              {pdfLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  Generating…
                </>
              ) : (
                <>
                  <i className="bi bi-file-earmark-pdf-fill" />
                  Download PDF
                </>
              )}
            </button>
          </div>

          {/* ── Personal Information ─────────────────────────────────────────── */}
          <div className="admin-card mb-3">
            <div className="detail-section-title">
              <i className="bi bi-person-lines-fill" />Personal Information
            </div>
            <div className="detail-grid">
              <DetailItem label="First Name" value={data.firstName} />
              <DetailItem label="Last Name" value={data.lastName} />
              <DetailItem label="Contact Number" value={data.contactNumber} />
              <DetailItem label="Home Address" value={data.homeAddress} />
              <DetailItem label="Local Address" value={data.localAddress} />
              <DetailItem label="City" value={data.city} />
              <DetailItem label="State" value={data.state} />
              <DetailItem label="ZIP / PIN" value={data.zipCode} />
              <DetailItem label="Country" value={data.country} />
            </div>
          </div>

          {/* ── Driver Information ───────────────────────────────────────────── */}
          <div className="admin-card mb-3">
            <div className="detail-section-title">
              <i className="bi bi-card-checklist" />Driver Information
            </div>
            <div className="detail-grid">
              <DetailItem label="Driver's License No." value={data.licenseNumber} />
              <DetailItem label="License Expiration" value={data.licenseExpiry} />
            </div>
          </div>

          {/* ── Rental Information ───────────────────────────────────────────── */}
          <div className="admin-card mb-3">
            <div className="detail-section-title">
              <i className="bi bi-key-fill" />Rental Information
            </div>
            <div className="detail-grid">
              <DetailItem label="Purpose" value={data.rentalPurpose} />
              <DetailItem label="Rental Vehicle" value={vehicleLabel(data.vehicleType)} />
              <DetailItem label="Reg. Number" value={data.registrationNumber} />
              <DetailItem label="Vehicle Model" value={data.vehicleModel} />
              <DetailItem label="Rental Duration" value={`${data.rentalDuration} day${data.rentalDuration !== 1 ? 's' : ''}`} />
              <DetailItem label="Destination" value={data.destination} />
            </div>
          </div>

          {/* ── Identity Verification ────────────────────────────────────────── */}
          <div className="admin-card mb-3">
            <div className="detail-section-title">
              <i className="bi bi-shield-lock-fill" />Identity Verification
            </div>
            <div className="detail-grid">
              <DetailItem label="ID Proof Number" value={data.idProofNumber} />
              <DetailItem label="Document Type" value={docLabel(data.documentType)} />
            </div>
          </div>

          {/* ── Documents & Photos ───────────────────────────────────────────── */}
          <div className="admin-card mb-3">
            <div className="detail-section-title">
              <i className="bi bi-images" />Documents & Signature
            </div>
            <div className="photos-grid">
              <PhotoCard
                label="Customer Photo"
                icon="bi-person-bounding-box"
                url={data.customerPhotoUrl}
              />
              <PhotoCard
                label="Driving License"
                icon="bi-card-text"
                url={data.drivingLicensePhotoUrl}
              />
              <PhotoCard
                label="ID Proof"
                icon="bi-fingerprint"
                url={data.idProofPhotoUrl}
              />
              <PhotoCard
                label="Digital Signature"
                icon="bi-vector-pen"
                url={data.signatureUrl}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// ── Sidebar (compact version for detail page) ─────────────────────────────────
const SidebarMini = ({ onLogout }) => (
  <aside className="sidebar">
    <div className="sidebar-logo d-flex align-items-center gap-2">
      <div className="sidebar-logo-icon"><i className="bi bi-shield-lock-fill" /></div>
      <div>
        <div className="sidebar-brand">ALL RIDE</div>
        <div className="sidebar-brand-sub">Admin Panel</div>
      </div>
    </div>
    <nav className="sidebar-nav">
      <a href="/dashboard" className="sidebar-nav-item" style={{ textDecoration: 'none' }}>
        <i className="bi bi-grid-fill" />Dashboard
      </a>
    </nav>
    <div className="sidebar-footer">
      <button className="sidebar-logout-btn" onClick={onLogout}>
        <i className="bi bi-box-arrow-left" />Log Out
      </button>
    </div>
  </aside>
);

export default RecordDetail;
