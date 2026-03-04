import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBookings, updateBookingStatus } from '../../features/bookings/bookingSlice';
import { Link } from 'react-router-dom';
// import './ManageBookings.css';

// Icons
const Icons = {
  Search: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Calendar: () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  User: () => <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  ChevronDown: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>,
  Eye: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
};

export default function ManageBookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    dispatch(getAllBookings());

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, rowsPerPage]);

  const handleStatusChange = (bookingId, newStatus) => {
    dispatch(updateBookingStatus({ id: bookingId, status: newStatus }));
  };

  // Filter Data
  const filteredData = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter(booking => {
      const matchesSearch =
        booking.booking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.TourPackage?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.User?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Stats
  const totalRevenue = (bookings || []).reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);

  const getStatusClass = (status) => `status-badge status-${status}`;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="manage-bookings-page">
      <div className="container">

        {/* Header */}
        <header className="page-header">
          <div className="header-content">
            <h1>Manage Bookings</h1>
            <p>View and update all customer reservations</p>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-title">Total Bookings</span>
              <span className="stat-value">{bookings?.length || 0}</span>
            </div>
            <div className="stat-icon-bg stat-icon-blue">📅</div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <span className="stat-title">Total Revenue</span>
              <span className="stat-value text-green">KES {totalRevenue.toLocaleString()}</span>
            </div>
            <div className="stat-icon-bg stat-icon-green">💰</div>
          </div>
        </section>

        {/* Controls Section */}
        <div className="controls-section">

          {/* Search Bar */}
          <div className="search-box">
            <Icons.Search />
            <input
              type="text"
              placeholder="Search by booking #, package, or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Desktop Filters */}
          <div className="desktop-controls">
            <div className="desktop-tabs">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  className={`tab ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <div className="rows-per-page">
              <label>Show:</label>
              <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="mobile-controls">
            <div className="select-wrapper">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Icons.ChevronDown />
            </div>
            <div className="select-wrapper small">
              <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
              </select>
              <Icons.ChevronDown />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} bookings
        </div>

        {/* Content Area */}
        {currentData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No bookings found</h3>
            <p>
              {searchTerm || statusFilter !== 'all'
                ? "Try adjusting your search or filters."
                : "No bookings available yet."}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                className="btn btn-outline"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Card List */}
            {/* Mobile Card List - REDESIGNED */}
            <div className="mobile-card-list">
              {currentData.map((booking) => (
                <div key={booking.id} className="booking-card">

                  {/* Card Header: ID, Package & Status */}
                  <div className="card-header">
                    <div className="header-top">
                      <span className="booking-id">{booking.booking_number}</span>
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        className={`status-select-mobile status-${booking.status}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <h3 className="package-title-mobile">{booking.TourPackage?.title || 'N/A'}</h3>
                  </div>

                  {/* Card Body: Details Grid */}
                  <div className="card-body-grid">
                    <div className="detail-item">
                      <div className="detail-label">
                        <Icons.User /> Client
                      </div>
                      <div className="detail-value">{booking.User?.name || 'Guest'}</div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-label">
                        <Icons.Calendar /> Travel Date
                      </div>
                      <div className="detail-value">{new Date(booking.start_date).toLocaleDateString()}</div>
                    </div>

                    <div className="detail-item amount-item">
                      <div className="detail-label">Total Amount</div>
                      <div className="detail-value amount-text">KES {parseFloat(booking.total_amount).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Card Footer: Action Button */}
                  <div className="card-footer">
                    <Link to={`/admin/bookings/${booking.id}`} className="btn-view-details">
                      <Icons.Eye /> View Full Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="desktop-table-container">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Booking #</th>
                    <th>Package</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th className="text-right">Amount</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((booking) => (
                    <tr key={booking.id}>
                      <td>
                        <span className="mono-text">{booking.booking_number}</span>
                      </td>
                      <td>
                        <span className="font-bold">{booking.TourPackage?.title || 'N/A'}</span>
                      </td>
                      <td>{booking.User?.name || 'Guest'}</td>
                      <td>
                        <div className="date-cell">
                          <Icons.Calendar />
                          <span>{new Date(booking.start_date).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="text-right amount-cell">
                        KES {parseFloat(booking.total_amount).toLocaleString()}
                      </td>
                      <td>
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className={`status-select-desktop status-${booking.status}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="text-right">
                        <Link to={`/admin/bookings/${booking.id}`} className="btn btn-primary btn-sm">
                          <Icons.Eye /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  className="btn-pagination"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`page-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  className="btn-pagination"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}