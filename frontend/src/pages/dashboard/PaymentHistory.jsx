// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchPaymentHistory } from '../../features/payments/paymentSlice';
// import { format } from 'date-fns';
// import {
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   CircularProgress,
//   Alert,
//   useTheme,
//   useMediaQuery
// } from '@mui/material';
// import {
//   ReceiptLong as ReceiptIcon,
//   CalendarToday as CalendarIcon,
//   Payment as PaymentIcon
// } from '@mui/icons-material';

// const COLORS = {
//   primary: '#1976d2',
//   success: '#2e7d32',
//   error: '#c62828',
//   warning: '#ed6c02',
//   info: '#0288d1',
//   background: '#f5f7fa'
// };

// // Helper to get status color config
// const getStatusConfig = (status) => {
//   switch (status) {
//     case 'completed':
//       return { label: 'Completed', bg: '#e8f5e9', text: '#2e7d32' };
//     case 'failed':
//       return { label: 'Failed', bg: '#ffebee', text: '#c62828' };
//     case 'refunded':
//       return { label: 'Refunded', bg: '#f3e5f5', text: '#7b1fa2' };
//     case 'pending':
//     default:
//       return { label: 'Pending', bg: '#fff3e0', text: '#ef6c00' };
//   }
// };

// export default function PaymentHistory() {
//   const dispatch = useDispatch();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
//   const { payments, loading, error } = useSelector((state) => state.payments);

//   useEffect(() => {
//     dispatch(fetchPaymentHistory());
//   }, [dispatch]);

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ 
//       p: { xs: 1.5, sm: 2, md: 3 }, 
//       maxWidth: '1200px', 
//       margin: '0 auto', 
//       width: '100%',
//       boxSizing: 'border-box'
//     }}>
//       {/* Header */}
//       <Box sx={{ mb: 4 }}>
//         <Typography variant="h4" sx={{ fontWeight: 700, color: '#000', mb: 0.5, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
//           Payment History
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           View all your transaction records and receipts
//         </Typography>
//       </Box>

//       {/* Error Alert */}
//       {error && (
//         <Alert severity="error" sx={{ mb: 3, width: '100%' }} variant="filled">
//           {error}
//         </Alert>
//       )}

//       {/* Content Area */}
//       {payments.length === 0 ? (
//         /* Empty State */
//         <Paper sx={{ p: { xs: 4, sm: 6, md: 8 }, textAlign: 'center', borderRadius: '12px' }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
//             <Box sx={{ 
//               width: { xs: 60, sm: 80 }, 
//               height: { xs: 60, sm: 80 }, 
//               borderRadius: '50%', 
//               backgroundColor: '#f5f5f5', 
//               display: 'flex', 
//               alignItems: 'center', 
//               justifyContent: 'center' 
//             }}>
//               <ReceiptIcon sx={{ fontSize: { xs: 30, sm: 40 }, color: 'text.secondary' }} />
//             </Box>
//             <Typography variant="h6" sx={{ fontWeight: 600, mt: 2, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
//               No payments found
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
//               You haven't made any payments yet. Once you book a tour and pay, your transaction history will appear here.
//             </Typography>
//           </Box>
//         </Paper>
//       ) : (
//         /* Data Table */
//         <Paper sx={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
//           <TableContainer sx={{ 
//             overflowX: 'auto', 
//             '&::-webkit-scrollbar': { height: '6px' },
//             '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
//             '&::-webkit-scrollbar-thumb': { background: '#bdbdbd', borderRadius: '3px' }
//           }}>
//             <Table sx={{ minWidth: isMobile ? 650 : 800 }}>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
//                   <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap' }}>Transaction ID</TableCell>
//                   <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap' }}>Booking Ref</TableCell>
//                   <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap' }}>Method</TableCell>
//                   <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap', align: 'right' }}>Amount</TableCell>
//                   <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap' }}>Status</TableCell>
//                   <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap' }}>Date</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {payments.map((payment) => {
//                   const statusConfig = getStatusConfig(payment.status);
//                   return (
//                     <TableRow 
//                       key={payment.id} 
//                       hover
//                       sx={{ 
//                         '&:last-child td, &:last-child th': { border: 0 },
//                         '&:hover': { backgroundColor: '#f9fafb' }
//                       }}
//                     >
//                       <TableCell>
//                         <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLORS.primary, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
//                           {payment.transaction_id || `#${payment.id}`}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: '#000' }}>
//                           {payment.Booking?.booking_number || 'N/A'}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <PaymentIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
//                           <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, textTransform: 'capitalize' }}>
//                             {payment.payment_method}
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell align="right">
//                         <Typography variant="body2" sx={{ fontWeight: 700, color: '#000', fontSize: { xs: '0.8rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
//                           KES {parseFloat(payment.amount).toLocaleString()}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Chip
//                           label={statusConfig.label}
//                           size="small"
//                           sx={{
//                             backgroundColor: statusConfig.bg,
//                             color: statusConfig.text,
//                             fontWeight: 600,
//                             fontSize: { xs: '0.65rem', sm: '0.75rem' },
//                             height: { xs: 22, sm: 24 }
//                           }}
//                         />
//                       </TableCell>
//                       <TableCell>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <CalendarIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
//                           <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, color: 'text.secondary', whiteSpace: 'nowrap' }}>
//                             {format(new Date(payment.created_at), 'MMM dd, yyyy')}
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Paper>
//       )}
//     </Box>
//   );
// }



// src/pages/PaymentHistory.jsx
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