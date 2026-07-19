import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ── Vehicle label helper ──────────────────────────────────────────────────────
const vehicleLabel = (type) => {
  const map = { MCWOG: 'Scooty (MCWOG)', MCWG: 'Bike (MCWG)', LMV: 'Car (LMV)' };
  return map[type] || type;
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

// ── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = ({ onLogout }) => (
  <aside className="sidebar">
    <div className="sidebar-logo d-flex align-items-center gap-2">
      <div className="sidebar-logo-icon"><i className="bi bi-shield-lock-fill" /></div>
      <div>
        <div className="sidebar-brand">ALL RIDE</div>
        <div className="sidebar-brand-sub">Admin Panel</div>
      </div>
    </div>

    <nav className="sidebar-nav">
      <div className="sidebar-nav-item active">
        <i className="bi bi-grid-fill" />
        Dashboard
      </div>
      <div className="sidebar-nav-item">
        <i className="bi bi-file-earmark-text" />
        All Agreements
      </div>
    </nav>

    <div className="sidebar-footer">
      <button className="sidebar-logout-btn" onClick={onLogout}>
        <i className="bi bi-box-arrow-left" />
        Log Out
      </button>
    </div>
  </aside>
);

// ── Dashboard Page ────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [agreements, setAgreements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  // ── Fetch all agreements ──────────────────────────────────────────────────
  const fetchAgreements = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/rental-agreements`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to load');
      setAgreements(json.data);
      setFiltered(json.data);
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAgreements(); }, [fetchAgreements]);

  // ── Client-side search ────────────────────────────────────────────────────
  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      setFiltered(agreements);
      return;
    }
    setFiltered(
      agreements.filter(
        (a) =>
          `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
          (a.registrationNumber || '').toLowerCase().includes(q) ||
          vehicleLabel(a.vehicleType).toLowerCase().includes(q) ||
          (a.vehicleType || '').toLowerCase().includes(q)
      )
    );
  }, [searchQuery, agreements]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalCount = agreements.length;
  const scooty = agreements.filter((a) => a.vehicleType === 'MCWOG').length;
  const bikes = agreements.filter((a) => a.vehicleType === 'MCWG').length;
  const cars = agreements.filter((a) => a.vehicleType === 'LMV').length;

  return (
    <div className="admin-layout">
      <Sidebar onLogout={handleLogout} />

      <div className="admin-content">
        {/* Top Bar */}
        <div className="admin-topbar">
          <div>
            <div className="admin-topbar-title">
              <i className="bi bi-grid-fill me-2" style={{ color: 'var(--accent)' }} />
              <span className='topbar-title-text'>Dashboard</span>
            </div>
            <div className="admin-topbar-sub">ALL RIDE Rentals — Rental Agreement Records</div>
          </div>
          <span className="admin-badge">
            <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem', color: '#10b981' }} />
            Admin
          </span>
        </div>

        <main className="admin-main">
          {/* Stats */}
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon-wrap blue"><i className="bi bi-file-earmark-text-fill" /></div>
              <div>
                <div className="stat-value" style={{ color: 'white' }}>{totalCount}</div>
                <div className="stat-label">Total Agreements</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap yellow"><i className="bi bi-scooter" /></div>
              <div>
                <div className="stat-value" style={{ color: 'white' }}>{scooty}</div>
                <div className="stat-label">Scooties</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap purple"><i className="bi bi-bicycle" /></div>
              <div>
                <div className="stat-value" style={{ color: 'white' }}>{bikes}</div>
                <div className="stat-label">Bikes</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrap green"><i className="bi bi-car-front-fill" /></div>
              <div>
                <div className="stat-value" style={{ color: 'white' }}>{cars}</div>
                <div className="stat-label">Cars</div>
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-title">
                <i className="bi bi-table" style={{ color: 'var(--accent)' }} />
                <span style={{ color: 'white' }}>Rental Agreements</span>
                <span style={{
                  background: 'var(--accent-light)', color: '#60a5fa',
                  padding: '0.15rem 0.55rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700
                }}>{filtered.length}</span>
              </div>

              {/* Search */}
              <div className="search-wrap">
                <i className="bi bi-search search-icon" />
                <input
                  id="admin-search"
                  type="text"
                  className="search-input"
                  placeholder="Search name, reg. no, type…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="admin-error mx-3 mt-3">
                <i className="bi bi-exclamation-triangle-fill" />
                {error}
                <button
                  onClick={fetchAgreements}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="admin-spinner-wrap">
                <div className="admin-spinner" />
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Customer Name</th>
                      <th>Vehicle Type</th>
                      <th>Reg. Number</th>
                      <th>Duration</th>
                      <th>Submitted</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={7}>
                          <div className="empty-state">
                            <i className="bi bi-inbox" />
                            {searchQuery ? 'No records match your search.' : 'No rental agreements submitted yet.'}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((a, idx) => (
                        <tr
                          key={a._id}
                          onClick={() => navigate(`/records/${a._id}`)}
                        >
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{idx + 1}</td>
                          <td className="customer-name-cell">{a.firstName} {a.lastName}</td>
                          <td>
                            <span className={`vehicle-badge ${a.vehicleType}`}>
                              {a.vehicleType === 'MCWOG' && <i className="bi bi-scooter" />}
                              {a.vehicleType === 'MCWG' && <i className="bi bi-bicycle" />}
                              {a.vehicleType === 'LMV' && <i className="bi bi-car-front-fill" />}
                              {vehicleLabel(a.vehicleType)}
                            </span>
                          </td>
                          <td><span className="reg-number">{a.registrationNumber}</span></td>
                          <td>
                            <span className="duration-badge">
                              <i className="bi bi-calendar3" />
                              {a.rentalDuration} day{a.rentalDuration !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="date-cell">{formatDate(a.submittedAt)}</td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <button
                              className="action-btn"
                              onClick={() => navigate(`/records/${a._id}`)}
                              aria-label={`View record for ${a.firstName} ${a.lastName}`}
                            >
                              <i className="bi bi-eye" /> View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
