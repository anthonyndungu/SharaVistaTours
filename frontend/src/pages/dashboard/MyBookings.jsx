// // import React, { useEffect, useState } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { fetchUserBookings } from '../../features/bookings/bookingSlice';
// // import { Link } from 'react-router-dom';
// // import {
// //   Box,
// //   Typography,
// //   Button,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   Chip,
// //   CircularProgress,
// //   Alert,
// //   useTheme,
// //   useMediaQuery,
// //   Select,
// //   MenuItem,
// //   FormControl,
// //   InputLabel,
// //   Card,
// //   CardContent,
// //   Divider,
// //   Stack,
// //   Tabs,
// //   Tab
// // } from '@mui/material';
// // import {
// //   ArrowRight as ArrowRightIcon,
// //   CalendarToday as CalendarIcon,
// //   ReceiptLong as ReceiptIcon,
// //   ExpandMore as ExpandMoreIcon,
// //   ConfirmationNumber as TicketIcon
// // } from '@mui/icons-material';

// // const COLORS = {
// //   primary: '#1976d2',
// //   success: '#2e7d32',
// //   warning: '#ed6c02',
// //   error: '#d32f2f',
// //   info: '#0288d1',
// // };

// // const getStatusConfig = (status) => {
// //   switch (status) {
// //     case 'confirmed': return { label: 'Confirmed', bg: '#e8f5e9', text: '#2e7d32' };
// //     case 'completed': return { label: 'Completed', bg: '#e3f2fd', text: '#0277bd' };
// //     case 'cancelled': return { label: 'Cancelled', bg: '#ffebee', text: '#c62828' };
// //     case 'pending': default: return { label: 'Pending', bg: '#fff3e0', text: '#ef6c00' };
// //   }
// // };

// // export default function MyBookings() {
// //   const dispatch = useDispatch();
// //   const theme = useTheme();
// //   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
// //   const { bookings, loading, error } = useSelector((state) => state.bookings);
// //   const [filter, setFilter] = useState('all');

// //   useEffect(() => { dispatch(fetchUserBookings()); }, [dispatch]);

// //   const filteredBookings = filter === 'all' 
// //     ? bookings 
// //     : bookings.filter(b => b.status === filter);

// //   const getCount = (status) => {
// //     if (status === 'all') return bookings?.length || 0;
// //     return bookings?.filter(b => b.status === status).length || 0;
// //   };

// //   // Render Single Booking Card (For Mobile)
// //   const renderBookingCard = (booking) => {
// //     const statusConfig = getStatusConfig(booking.status);
// //     return (
// //       <Card 
// //         key={booking.id} 
// //         sx={{ 
// //           mb: 2, 
// //           borderRadius: '8px', 
// //           boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
// //           border: '1px solid #e0e0e0',
// //           overflow: 'hidden'
// //         }}
// //       >
// //         {/* Card Header */}
// //         <Box sx={{ p: 2, backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //           <Box>
// //             <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.primary }}>
// //               {booking.booking_number}
// //             </Typography>
// //             <Typography variant="caption" color="text.secondary">
// //               {booking.TourPackage?.title || 'N/A'}
// //             </Typography>
// //           </Box>
// //           <Chip 
// //             label={statusConfig.label} 
// //             size="small" 
// //             sx={{ backgroundColor: statusConfig.bg, color: statusConfig.text, fontWeight: 600, height: 20, fontSize: '0.7rem' }} 
// //           />
// //         </Box>

// //         {/* Card Body */}
// //         <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
// //           <Stack spacing={2}>
// //             {/* Dates */}
// //             <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
// //               <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.2 }} />
// //               <Box>
// //                 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Travel Dates</Typography>
// //                 <Typography variant="body2" sx={{ fontWeight: 500 }}>{booking.start_date}</Typography>
// //                 <Typography variant="caption" color="text.secondary">to {booking.end_date}</Typography>
// //               </Box>
// //             </Box>

// //             {/* Amount */}
// //             <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
// //               <TicketIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.2 }} />
// //               <Box>
// //                 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Total Amount</Typography>
// //                 <Typography variant="body1" sx={{ fontWeight: 700, color: '#000' }}>
// //                   KES {parseFloat(booking.total_amount).toLocaleString()}
// //                 </Typography>
// //               </Box>
// //             </Box>
// //           </Stack>

// //           <Divider sx={{ my: 2 }} />

// //           {/* Action Button - Full Width on Mobile */}
// //           <Button
// //             component={Link}
// //             to={`/dashboard/bookings/${booking.id}`}
// //             variant="outlined"
// //             fullWidth
// //             endIcon={<ArrowRightIcon />}
// //             sx={{ 
// //               borderColor: COLORS.primary, 
// //               color: COLORS.primary, 
// //               fontWeight: 600,
// //               textTransform: 'none',
// //               '&:hover': { backgroundColor: '#e3f2fd', borderColor: COLORS.primary }
// //             }}
// //           >
// //             View Details
// //           </Button>
// //         </CardContent>
// //       </Card>
// //     );
// //   };

// //   if (loading && !bookings) {
// //     return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
// //   }

// //   return (
// //     <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
// //       {/* Header */}
// //       <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, gap: 2 }}>
// //         <Box>
// //           <Typography variant="h4" sx={{ fontWeight: 700, color: '#000', mb: 0.5, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>My Bookings</Typography>
// //           <Typography variant="body2" color="text.secondary">Manage and track all your tour reservations</Typography>
// //         </Box>
// //         <Button component={Link} to="/tours" variant="contained" fullWidth={isMobile} sx={{ backgroundColor: COLORS.primary, '&:hover': { backgroundColor: '#1565c0' }, width: { xs: '100%', sm: 'auto' } }}>
// //           Book New Tour
// //         </Button>
// //       </Box>

// //       {error && <Alert severity="error" sx={{ mb: 3, width: '100%' }}>{error}</Alert>}

// //       {/* ✅ RESPONSIVE FILTER: Dropdown on Mobile, Tabs on Desktop */}
// //       <Paper sx={{ mb: 3, p: 2, borderRadius: '8px' }}>
// //         {isMobile ? (
// //           /* Mobile: Dropdown Select */
// //           <FormControl fullWidth size="small">
// //             <InputLabel id="filter-label">Filter Status</InputLabel>
// //             <Select
// //               labelId="filter-label"
// //               value={filter}
// //               label="Filter Status"
// //               onChange={(e) => setFilter(e.target.value)}
// //               IconComponent={ExpandMoreIcon}
// //               sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' } }}
// //             >
// //               <MenuItem value="all">All Bookings ({getCount('all')})</MenuItem>
// //               <MenuItem value="pending">Pending ({getCount('pending')})</MenuItem>
// //               <MenuItem value="confirmed">Confirmed ({getCount('confirmed')})</MenuItem>
// //               <MenuItem value="completed">Completed ({getCount('completed')})</MenuItem>
// //               <MenuItem value="cancelled">Cancelled ({getCount('cancelled')})</MenuItem>
// //             </Select>
// //           </FormControl>
// //         ) : (
// //           /* Desktop: Horizontal Tabs */
// //           <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
// //             <Tabs value={filter} onChange={(e, newVal) => setFilter(newVal)} variant="scrollable" scrollButtons="auto"
// //               sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minWidth: 120 } }}>
// //               <Tab label={`All (${getCount('all')})`} value="all" />
// //               <Tab label={`Pending (${getCount('pending')})`} value="pending" />
// //               <Tab label={`Confirmed (${getCount('confirmed')})`} value="confirmed" />
// //               <Tab label={`Completed (${getCount('completed')})`} value="completed" />
// //               <Tab label={`Cancelled (${getCount('cancelled')})`} value="cancelled" />
// //             </Tabs>
// //           </Box>
// //         )}
// //       </Paper>

// //       {/* Content Area */}
// //       {filteredBookings.length === 0 ? (
// //         <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '12px' }}>
// //           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
// //             <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
// //               <ReceiptIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
// //             </Box>
// //             <Typography variant="h6" sx={{ fontWeight: 600 }}>No bookings found</Typography>
// //             <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
// //               {filter === 'all' ? "You haven't made any bookings yet." : `No ${filter} bookings found.`}
// //             </Typography>
// //             <Button component={Link} to="/tours" variant="contained" fullWidth={isMobile} sx={{ mt: 2, backgroundColor: COLORS.primary, width: { xs: '100%', sm: 'auto' } }}>Browse Tours</Button>
// //           </Box>
// //         </Paper>
// //       ) : (
// //         <>
// //           {/* ✅ MOBILE VIEW: Card List (Visible only on xs/sm) */}
// //           <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
// //             {filteredBookings.map(renderBookingCard)}
// //           </Box>

// //           {/* ✅ DESKTOP VIEW: Standard Table (Visible only on md+) */}
// //           <Paper sx={{ display: { xs: 'none', sm: 'block' }, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
// //             <TableContainer sx={{ overflowX: 'auto' }}>
// //               <Table sx={{ minWidth: 700 }}>
// //                 <TableHead>
// //                   <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
// //                     <TableCell sx={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Booking ID</TableCell>
// //                     <TableCell sx={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Package</TableCell>
// //                     <TableCell sx={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Dates</TableCell>
// //                     <TableCell sx={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', align: 'right' }}>Amount</TableCell>
// //                     <TableCell sx={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Status</TableCell>
// //                     <TableCell sx={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', align: 'right' }}>Actions</TableCell>
// //                   </TableRow>
// //                 </TableHead>
// //                 <TableBody>
// //                   {filteredBookings.map((booking) => {
// //                     const statusConfig = getStatusConfig(booking.status);
// //                     return (
// //                       <TableRow key={booking.id} hover sx={{ '&:last-child td': { border: 0 } }}>
// //                         <TableCell>
// //                           <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.primary }}>{booking.booking_number}</Typography>
// //                         </TableCell>
// //                         <TableCell>
// //                           <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{booking.TourPackage?.title}</Typography>
// //                           <Typography variant="caption" color="text.secondary">{booking.TourPackage?.destination}</Typography>
// //                         </TableCell>
// //                         <TableCell>
// //                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //                             <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
// //                             <Typography variant="body2" color="text.secondary">{booking.start_date} - {booking.end_date}</Typography>
// //                           </Box>
// //                         </TableCell>
// //                         <TableCell align="right">
// //                           <Typography variant="body2" sx={{ fontWeight: 700 }}>KES {parseFloat(booking.total_amount).toLocaleString()}</Typography>
// //                         </TableCell>
// //                         <TableCell>
// //                           <Chip label={statusConfig.label} size="small" sx={{ backgroundColor: statusConfig.bg, color: statusConfig.text, fontWeight: 600, height: 24, fontSize: '0.75rem' }} />
// //                         </TableCell>
// //                         <TableCell align="right">
// //                           <Button component={Link} to={`/dashboard/bookings/${booking.id}`} size="small" endIcon={<ArrowRightIcon />} sx={{ color: COLORS.primary, fontWeight: 600, textTransform: 'none', '&:hover': { backgroundColor: '#e3f2fd' } }}>View Details</Button>
// //                         </TableCell>
// //                       </TableRow>
// //                     );
// //                   })}
// //                 </TableBody>
// //               </Table>
// //             </TableContainer>
// //           </Paper>
// //         </>
// //       )}
// //     </Box>
// //   );
// // }



// // src/pages/MyBookings.jsx
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { fetchUserBookings } from '../../features/bookings/bookingSlice';
// import './MyBookings.css';

// // Icons (Simple SVGs)
// const Icons = {
//   Calendar: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
//   Ticket: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>,
//   ArrowRight: () => <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
//   Receipt: () => <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
//   ChevronDown: () => <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>,
// };

// export default function MyBookings() {
//   const dispatch = useDispatch();
//   const { bookings, loading, error } = useSelector((state) => state.bookings);
//   const [filter, setFilter] = useState('all');
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     dispatch(fetchUserBookings());
    
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [dispatch]);

//   const filteredBookings = filter === 'all' 
//     ? bookings 
//     : bookings.filter(b => b.status === filter);

//   const getCount = (status) => {
//     if (status === 'all') return bookings?.length || 0;
//     return bookings?.filter(b => b.status === status).length || 0;
//   };

//   const getStatusClass = (status) => {
//     return `status-badge status-${status}`;
//   };

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

//         {/* Filter Section */}
//         <div className="filter-section">
//           {isMobile ? (
//             /* Mobile: Dropdown */
//             <div className="mobile-filter">
//               <label htmlFor="status-filter">Filter Status</label>
//               <div className="select-wrapper">
//                 <select 
//                   id="status-filter" 
//                   value={filter} 
//                   onChange={(e) => setFilter(e.target.value)}
//                 >
//                   <option value="all">All Bookings ({getCount('all')})</option>
//                   <option value="pending">Pending ({getCount('pending')})</option>
//                   <option value="confirmed">Confirmed ({getCount('confirmed')})</option>
//                   <option value="completed">Completed ({getCount('completed')})</option>
//                   <option value="cancelled">Cancelled ({getCount('cancelled')})</option>
//                 </select>
//                 <Icons.ChevronDown />
//               </div>
//             </div>
//           ) : (
//             /* Desktop: Tabs */
//             <div className="desktop-tabs">
//               <button 
//                 className={`tab ${filter === 'all' ? 'active' : ''}`} 
//                 onClick={() => setFilter('all')}
//               >
//                 All ({getCount('all')})
//               </button>
//               <button 
//                 className={`tab ${filter === 'pending' ? 'active' : ''}`} 
//                 onClick={() => setFilter('pending')}
//               >
//                 Pending ({getCount('pending')})
//               </button>
//               <button 
//                 className={`tab ${filter === 'confirmed' ? 'active' : ''}`} 
//                 onClick={() => setFilter('confirmed')}
//               >
//                 Confirmed ({getCount('confirmed')})
//               </button>
//               <button 
//                 className={`tab ${filter === 'completed' ? 'active' : ''}`} 
//                 onClick={() => setFilter('completed')}
//               >
//                 Completed ({getCount('completed')})
//               </button>
//               <button 
//                 className={`tab ${filter === 'cancelled' ? 'active' : ''}`} 
//                 onClick={() => setFilter('cancelled')}
//               >
//                 Cancelled ({getCount('cancelled')})
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Content Area */}
//         {filteredBookings.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">
//               <Icons.Receipt />
//             </div>
//             <h3>No bookings found</h3>
//             <p>
//               {filter === 'all' 
//                 ? "You haven't made any bookings yet. Start your next adventure today!" 
//                 : `No ${filter} bookings found.`}
//             </p>
//             <Link to="/tours" className="btn btn-primary">Browse Tours</Link>
//           </div>
//         ) : (
//           <>
//             {/* Mobile View: Card List */}
//             <div className="mobile-card-list">
//               {filteredBookings.map((booking) => (
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

//             {/* Desktop View: Table */}
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
//                   {filteredBookings.map((booking) => (
//                     <tr key={booking.id}>
//                       <td>
//                         <span className="booking-id-link">{booking.booking_number}</span>
//                       </td>
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
//                       <td>
//                         <span className={getStatusClass(booking.status)}>
//                           {booking.status}
//                         </span>
//                       </td>
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
//           </>
//         )}
//       </div>
//     </div>
//   );
// }




// src/pages/MyBookings.jsx
import React, { useEffect, useState, useMemo } from 'react';
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

  useEffect(() => {
    dispatch(fetchUserBookings());
    
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
    if (!bookings) return [];

    return bookings.filter((booking) => {
      // Status Filter
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false;
      }

      // Search Filter (Booking ID, Package Title, Destination)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchId = booking.booking_number?.toLowerCase().includes(searchLower);
        const matchTitle = booking.TourPackage?.title?.toLowerCase().includes(searchLower);
        const matchDest = booking.TourPackage?.destination?.toLowerCase().includes(searchLower);
        
        if (!matchId && !matchTitle && !matchDest) {
          return false;
        }
      }
      return true;
    });
  }, [bookings, searchTerm, statusFilter]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Helper for counts
  const getCount = (status) => {
    if (status === 'all') return bookings?.length || 0;
    return bookings?.filter(b => b.status === status).length || 0;
  };

  const getStatusClass = (status) => `status-badge status-${status}`;

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

        {/* Controls Section: Search + Filter + Rows */}
        <div className="controls-section">
          
          {/* Search Bar */}
          <div className="search-box">
            <Icons.Search />
            <input 
              type="text" 
              placeholder="Search by ID, package, or destination..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Desktop Filters (Tabs + Rows) */}
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

          {/* Mobile Filter (Dropdown) */}
          <div className="mobile-controls">
            <div className="select-wrapper">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
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

        {/* Results Info */}
        <div className="results-info">
          Showing {filteredData.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} bookings
        </div>

        {/* Content Area */}
        {currentData.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Icons.Receipt />
            </div>
            <h3>No bookings found</h3>
            <p>
              {searchTerm || statusFilter !== 'all'
                ? "Try adjusting your search or filters." 
                : "You haven't made any bookings yet."}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} 
                className="btn btn-outline"
              >
                Clear Filters
              </button>
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
                    <span className={getStatusClass(booking.status)}>
                      {booking.status}
                    </span>
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
                    <Link to={`/dashboard/bookings/${booking.id}`} className="btn btn-outline btn-full">
                      View Details <Icons.ArrowRight />
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
                      <td className="text-right">
                        <Link to={`/dashboard/bookings/${booking.id}`} className="btn-link">
                          View Details <Icons.ArrowRight />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
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