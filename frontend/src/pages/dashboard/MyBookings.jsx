// import React, { useEffect, useState, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { fetchUserBookings } from '../../features/bookings/bookingSlice';
// import './MyBookings.css';

// // Icons
// const Icons = {
//   Search: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
//   Calendar: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
//   Ticket: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
//   ArrowRight: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
//   ChevronLeft: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>,
//   ChevronRight: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
//   Receipt: () => <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
//   ChevronDown: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>,
// };

// export default function MyBookings() {
//   const dispatch = useDispatch();
//   const { bookings, loading, error } = useSelector((state) => state.bookings);
  
//   // State
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     dispatch(fetchUserBookings());
    
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [dispatch]);

//   // Reset page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, statusFilter, rowsPerPage]);

//   // 1. Filter Data
//   const filteredData = useMemo(() => {
//     if (!bookings) return [];

//     return bookings.filter((booking) => {
//       // Status Filter
//       if (statusFilter !== 'all' && booking.status !== statusFilter) {
//         return false;
//       }

//       // Search Filter (Booking ID, Package Title, Destination)
//       if (searchTerm) {
//         const searchLower = searchTerm.toLowerCase();
//         const matchId = booking.booking_number?.toLowerCase().includes(searchLower);
//         const matchTitle = booking.TourPackage?.title?.toLowerCase().includes(searchLower);
//         const matchDest = booking.TourPackage?.destination?.toLowerCase().includes(searchLower);
        
//         if (!matchId && !matchTitle && !matchDest) {
//           return false;
//         }
//       }
//       return true;
//     });
//   }, [bookings, searchTerm, statusFilter]);

//   // 2. Pagination Logic
//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);
//   const startIndex = (currentPage - 1) * rowsPerPage;
//   const endIndex = startIndex + rowsPerPage;
//   const currentData = filteredData.slice(startIndex, endIndex);

//   // Helper for counts
//   const getCount = (status) => {
//     if (status === 'all') return bookings?.length || 0;
//     return bookings?.filter(b => b.status === status).length || 0;
//   };

//   const getStatusClass = (status) => `status-badge status-${status}`;

//   if (loading && !bookings) {
//     return (
//       <div className="loading-container">
//         <div className="spinner"></div>
//         <p>Loading your bookings...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="my-bookings-page">
//       <div className="container">
        
//         {/* Header */}
//         <header className="page-header">
//           <div className="header-content">
//             <h1>My Bookings</h1>
//             <p>Manage and track all your tour reservations</p>
//           </div>
//           <Link to="/tours" className="btn btn-primary">
//             Book New Tour
//           </Link>
//         </header>

//         {error && (
//           <div className="alert alert-error">
//             <span>⚠️</span> {error}
//           </div>
//         )}

//         {/* Controls Section: Search + Filter + Rows */}
//         <div className="controls-section">
          
//           {/* Search Bar */}
//           <div className="search-box">
//             <Icons.Search />
//             <input 
//               type="text" 
//               placeholder="Search by ID, package, or destination..." 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           {/* Desktop Filters (Tabs + Rows) */}
//           <div className="desktop-controls">
//             <div className="desktop-tabs">
//               {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
//                 <button 
//                   key={status}
//                   className={`tab ${statusFilter === status ? 'active' : ''}`} 
//                   onClick={() => setStatusFilter(status)}
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)} ({getCount(status)})
//                 </button>
//               ))}
//             </div>
            
//             <div className="rows-per-page">
//               <label>Show:</label>
//               <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={20}>20</option>
//                 <option value={50}>50</option>
//               </select>
//             </div>
//           </div>

//           {/* Mobile Filter (Dropdown) */}
//           <div className="mobile-controls">
//             <div className="select-wrapper">
//               <select 
//                 value={statusFilter} 
//                 onChange={(e) => setStatusFilter(e.target.value)}
//               >
//                 <option value="all">All Statuses</option>
//                 <option value="pending">Pending</option>
//                 <option value="confirmed">Confirmed</option>
//                 <option value="completed">Completed</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//               <Icons.ChevronDown />
//             </div>
//             <div className="select-wrapper small">
//               <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
//                 <option value={5}>5 / page</option>
//                 <option value={10}>10 / page</option>
//                 <option value={20}>20 / page</option>
//               </select>
//               <Icons.ChevronDown />
//             </div>
//           </div>
//         </div>

//         {/* Results Info */}
//         <div className="results-info">
//           Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} bookings
//         </div>

//         {/* Content Area */}
//         {currentData.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">
//               <Icons.Receipt />
//             </div>
//             <h3>No bookings found</h3>
//             <p>
//               {searchTerm || statusFilter !== 'all'
//                 ? "Try adjusting your search or filters." 
//                 : "You haven't made any bookings yet."}
//             </p>
//             {(searchTerm || statusFilter !== 'all') && (
//               <button 
//                 onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} 
//                 className="btn btn-outline"
//               >
//                 Clear Filters
//               </button>
//             )}
//             {!searchTerm && statusFilter === 'all' && (
//               <Link to="/tours" className="btn btn-primary">Browse Tours</Link>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* Mobile Card List */}
//             <div className="mobile-card-list">
//               {currentData.map((booking) => (
//                 <div key={booking.id} className="booking-card">
//                   <div className="card-header">
//                     <div>
//                       <div className="booking-id">{booking.booking_number}</div>
//                       <div className="package-name">{booking.TourPackage?.title || 'N/A'}</div>
//                     </div>
//                     <span className={getStatusClass(booking.status)}>
//                       {booking.status}
//                     </span>
//                   </div>
//                   <div className="card-body">
//                     <div className="info-row">
//                       <Icons.Calendar />
//                       <div>
//                         <span className="label">Travel Dates</span>
//                         <span className="value">{booking.start_date} to {booking.end_date}</span>
//                       </div>
//                     </div>
//                     <div className="info-row">
//                       <Icons.Ticket />
//                       <div>
//                         <span className="label">Total Amount</span>
//                         <span className="value amount">KES {parseFloat(booking.total_amount).toLocaleString()}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="card-footer">
//                     <Link to={`/dashboard/bookings/${booking.id}`} className="btn btn-outline btn-full">
//                       View Details <Icons.ArrowRight />
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Desktop Table */}
//             <div className="desktop-table-container">
//               <table className="bookings-table">
//                 <thead>
//                   <tr>
//                     <th>Booking ID</th>
//                     <th>Package</th>
//                     <th>Dates</th>
//                     <th className="text-right">Amount</th>
//                     <th>Status</th>
//                     <th className="text-right">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentData.map((booking) => (
//                     <tr key={booking.id}>
//                       <td><span className="booking-id-link">{booking.booking_number}</span></td>
//                       <td>
//                         <div className="package-cell">
//                           <div className="package-title">{booking.TourPackage?.title}</div>
//                           <div className="package-dest">{booking.TourPackage?.destination}</div>
//                         </div>
//                       </td>
//                       <td>
//                         <div className="dates-cell">
//                           <Icons.Calendar />
//                           <span>{booking.start_date} - {booking.end_date}</span>
//                         </div>
//                       </td>
//                       <td className="text-right amount-cell">
//                         KES {parseFloat(booking.total_amount).toLocaleString()}
//                       </td>
//                       <td><span className={getStatusClass(booking.status)}>{booking.status}</span></td>
//                       <td className="text-right">
//                         <Link to={`/dashboard/bookings/${booking.id}`} className="btn-link">
//                           View Details <Icons.ArrowRight />
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination Controls */}
//             {totalPages > 1 && (
//               <div className="pagination-container">
//                 <button 
//                   className="btn-pagination" 
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                 >
//                   <Icons.ChevronLeft /> Previous
//                 </button>
                
//                 <div className="pagination-numbers">
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                     <button
//                       key={page}
//                       className={`page-number ${currentPage === page ? 'active' : ''}`}
//                       onClick={() => setCurrentPage(page)}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                 </div>

//                 <button 
//                   className="btn-pagination" 
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                 >
//                   Next <Icons.ChevronRight />
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserBookings } from '../../features/bookings/bookingSlice';
import './MyBookings.css';

// Icons
const Icons = {
  Search: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Calendar: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Ticket: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
  ArrowRight: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
  ChevronLeft: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>,
  Receipt: () => <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  ChevronDown: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>,
  // ✅ New Three Dots Icon
  MoreVert: () => <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>,
  Download: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Eye: () => <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
};

export default function MyBookings() {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // ✅ Dropdown State: Stores the ID of the booking whose menu is open
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    dispatch(fetchUserBookings());
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, rowsPerPage]);

  // 1. Filter Data
  const filteredData = useMemo(() => {
    if (!bookings) return [];

    return bookings.filter((booking) => {
      if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchId = booking.booking_number?.toLowerCase().includes(searchLower);
        const matchTitle = booking.TourPackage?.title?.toLowerCase().includes(searchLower);
        const matchDest = booking.TourPackage?.destination?.toLowerCase().includes(searchLower);
        if (!matchId && !matchTitle && !matchDest) return false;
      }
      return true;
    });
  }, [bookings, searchTerm, statusFilter]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getCount = (status) => {
    if (status === 'all') return bookings?.length || 0;
    return bookings?.filter(b => b.status === status).length || 0;
  };

  const getStatusClass = (status) => `status-badge status-${status}`;

  // ✅ Toggle Menu
  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  if (loading && !bookings) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="container">
        
        {/* Header */}
        <header className="page-header">
          <div className="header-content">
            <h1>My Bookings</h1>
            <p>Manage and track all your tour reservations</p>
          </div>
          <Link to="/tours" className="btn btn-primary">
            Book New Tour
          </Link>
        </header>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Controls Section */}
        <div className="controls-section">
          <div className="search-box">
            <Icons.Search />
            <input 
              type="text" 
              placeholder="Search by ID, package, or destination..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="desktop-controls">
            <div className="desktop-tabs">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button 
                  key={status}
                  className={`tab ${statusFilter === status ? 'active' : ''}`} 
                  onClick={() => setStatusFilter(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)} ({getCount(status)})
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
                <option value={20}>20 / page</option>
              </select>
              <Icons.ChevronDown />
            </div>
          </div>
        </div>

        <div className="results-info">
          Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} bookings
        </div>

        {currentData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icons.Receipt /></div>
            <h3>No bookings found</h3>
            <p>{searchTerm || statusFilter !== 'all' ? "Try adjusting your search or filters." : "You haven't made any bookings yet."}</p>
            {(searchTerm || statusFilter !== 'all') && (
              <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="btn btn-outline">Clear Filters</button>
            )}
            {!searchTerm && statusFilter === 'all' && (
              <Link to="/tours" className="btn btn-primary">Browse Tours</Link>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Card List */}
            <div className="mobile-card-list">
              {currentData.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="card-header">
                    <div>
                      <div className="booking-id">{booking.booking_number}</div>
                      <div className="package-name">{booking.TourPackage?.title || 'N/A'}</div>
                    </div>
                    <span className={getStatusClass(booking.status)}>{booking.status}</span>
                  </div>
                  <div className="card-body">
                    <div className="info-row">
                      <Icons.Calendar />
                      <div>
                        <span className="label">Travel Dates</span>
                        <span className="value">{booking.start_date} to {booking.end_date}</span>
                      </div>
                    </div>
                    <div className="info-row">
                      <Icons.Ticket />
                      <div>
                        <span className="label">Total Amount</span>
                        <span className="value amount">KES {parseFloat(booking.total_amount).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                      <Link to={`/dashboard/bookings/${booking.id}`} className="btn btn-outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        <Icons.Eye /> View
                      </Link>
                      {/* Show Receipt Button only if completed/paid */}
                      {(booking.status === 'completed' || booking.payment_status === 'paid') && (
                        <Link to={`/dashboard/bookings/${booking.id}/receipt`} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                          <Icons.Download /> Receipt
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="desktop-table-container">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Package</th>
                    <th>Dates</th>
                    <th className="text-right">Amount</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((booking) => (
                    <tr key={booking.id}>
                      <td><span className="booking-id-link">{booking.booking_number}</span></td>
                      <td>
                        <div className="package-cell">
                          <div className="package-title">{booking.TourPackage?.title}</div>
                          <div className="package-dest">{booking.TourPackage?.destination}</div>
                        </div>
                      </td>
                      <td>
                        <div className="dates-cell">
                          <Icons.Calendar />
                          <span>{booking.start_date} - {booking.end_date}</span>
                        </div>
                      </td>
                      <td className="text-right amount-cell">
                        KES {parseFloat(booking.total_amount).toLocaleString()}
                      </td>
                      <td><span className={getStatusClass(booking.status)}>{booking.status}</span></td>
                      <td className="text-right" style={{ position: 'relative' }}>
                        
                        {/* ✅ Three Dots Button */}
                        <button 
                          onClick={(e) => toggleMenu(e, booking.id)}
                          className="btn-icon"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '4px', color: '#666' }}
                          aria-label="Actions"
                        >
                          <Icons.MoreVert />
                        </button>

                        {/* ✅ Dropdown Menu */}
                        {openMenuId === booking.id && (
                          <div 
                            ref={menuRef}
                            className="actions-dropdown"
                            style={{
                              position: 'absolute',
                              right: 0,
                              top: '100%',
                              backgroundColor: '#fff',
                              border: '1px solid #ddd',
                              borderRadius: '6px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                              zIndex: 1000,
                              minWidth: '160px',
                              marginTop: '5px',
                              overflow: 'hidden'
                            }}
                          >
                            <Link 
                              to={`/dashboard/bookings/${booking.id}`}
                              onClick={() => setOpenMenuId(null)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 15px',
                                textDecoration: 'none',
                                color: '#333',
                                fontSize: '14px',
                                borderBottom: '1px solid #f0f0f0'
                              }}
                            >
                              <Icons.Eye /> View Details
                            </Link>
                            
                            {(booking.status === 'completed' || booking.payment_status === 'paid') && (
                              <Link 
                                to={`/dashboard/bookings/${booking.id}/receipt`}
                                onClick={() => setOpenMenuId(null)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '10px 15px',
                                  textDecoration: 'none',
                                  color: '#1976d2',
                                  fontSize: '14px',
                                  backgroundColor: '#f5faff'
                                }}
                              >
                                <Icons.Download /> Download Receipt
                              </Link>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button className="btn-pagination" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                  <Icons.ChevronLeft /> Previous
                </button>
                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} className={`page-number ${currentPage === page ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
                  ))}
                </div>
                <button className="btn-pagination" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
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