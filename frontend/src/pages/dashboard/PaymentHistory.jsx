import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPaymentHistory } from '../../features/payments/paymentSlice';
import './PaymentHistory.css';

// Icons
const Icons = {
  Search: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Receipt: () => <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Card: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  Mobile: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Calendar: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  ChevronLeft: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  ChevronDown: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>,
};

export default function PaymentHistory() {
  const dispatch = useDispatch();
  const { payments, loading, error } = useSelector((state) => state.payments);
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    dispatch(fetchPaymentHistory());
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, rowsPerPage]);

  // 1. Filter Data
  const filteredData = useMemo(() => {
    if (!payments) return [];

    return payments.filter((payment) => {
      // Status Filter
      if (statusFilter !== 'all' && payment.status !== statusFilter) {
        return false;
      }

      // Search Filter (Transaction ID, Booking Ref, Method)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchId = payment.transaction_id?.toLowerCase().includes(searchLower);
        const matchBooking = payment.Booking?.booking_number?.toLowerCase().includes(searchLower);
        const matchMethod = payment.payment_method?.toLowerCase().includes(searchLower);
        
        if (!matchId && !matchBooking && !matchMethod) {
          return false;
        }
      }
      return true;
    });
  }, [payments, searchTerm, statusFilter]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getStatusClass = (status) => `status-badge status-${status}`;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && !payments) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading payment history...</p>
      </div>
    );
  }

  return (
    <div className="payment-history-page">
      <div className="container">
        
        {/* Header */}
        <header className="page-header">
          <div className="header-content">
            <h1>Payment History</h1>
            <p>View all your transaction records and receipts</p>
          </div>
        </header>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Controls Section */}
        <div className="controls-section">
          
          {/* Search Bar */}
          <div className="search-box">
            <Icons.Search />
            <input 
              type="text" 
              placeholder="Search by ID, booking ref, or method..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Desktop Filters */}
          <div className="desktop-controls">
            <div className="desktop-tabs">
              {['all', 'completed', 'pending', 'failed', 'refunded'].map((status) => (
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
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="mobile-controls">
            <div className="select-wrapper">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <Icons.ChevronDown />
            </div>
            <div className="select-wrapper small">
              <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                <option value={5}>5 / page</option>
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
              </select>
              <Icons.ChevronDown />
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} transactions
        </div>

        {/* Content Area */}
        {currentData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icons.Receipt />
            </div>
            <h3>No payments found</h3>
            <p>
              {searchTerm || statusFilter !== 'all'
                ? "Try adjusting your search or filters." 
                : "You haven't made any payments yet."}
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
            <div className="mobile-card-list">
              {currentData.map((payment) => (
                <div key={payment.id} className="payment-card">
                  <div className="card-header">
                    <div className="tx-id">{payment.transaction_id || `#${payment.id}`}</div>
                    <span className={getStatusClass(payment.status)}>
                      {payment.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="info-row">
                      <span className="label">Booking Reference</span>
                      <span className="value">{payment.Booking?.booking_number || 'N/A'}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Method</span>
                      <span className="value text-capitalize">{payment.payment_method}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Date</span>
                      <span className="value">{formatDate(payment.created_at)}</span>
                    </div>
                    <div className="info-row amount-row">
                      <span className="label">Amount</span>
                      <span className="value amount">{formatCurrency(payment.amount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="desktop-table-container">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Booking Ref</th>
                    <th>Method</th>
                    <th className="text-right">Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((payment) => (
                    <tr key={payment.id}>
                      <td>
                        <span className="tx-id-link">{payment.transaction_id || `#${payment.id}`}</span>
                      </td>
                      <td>
                        <span className="booking-ref">{payment.Booking?.booking_number || 'N/A'}</span>
                      </td>
                      <td>
                        <div className="method-cell">
                          {payment.payment_method === 'card' ? <Icons.Card /> : <Icons.Mobile />}
                          <span className="text-capitalize">{payment.payment_method}</span>
                        </div>
                      </td>
                      <td className="text-right amount-cell">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td>
                        <span className={getStatusClass(payment.status)}>
                          {payment.status}
                        </span>
                      </td>
                      <td>
                        <div className="date-cell">
                          <Icons.Calendar />
                          <span>{formatDate(payment.created_at)}</span>
                        </div>
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
                  <Icons.ChevronLeft /> Previous
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
                  Next <Icons.ChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}