// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserBookings } from '../../features/bookings/bookingSlice';
// import { Link } from 'react-router-dom';
// import {
//   Box,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   Tabs,
//   Tab,
//   CircularProgress,
//   Alert,
//   useTheme,
//   useMediaQuery
// } from '@mui/material';
// import {
//   ArrowRight as ArrowRightIcon,
//   CalendarToday as CalendarIcon,
//   ReceiptLong as ReceiptIcon
// } from '@mui/icons-material';

// const COLORS = {
//   primary: '#1976d2',
//   success: '#2e7d32',
//   warning: '#ed6c02',
//   error: '#d32f2f',
//   info: '#0288d1',
//   background: '#f5f7fa'
// };

// // Helper to get status color and label
// const getStatusConfig = (status) => {
//   switch (status) {
//     case 'confirmed':
//       return { color: 'success', label: 'Confirmed', bg: '#e8f5e9', text: '#2e7d32' };
//     case 'completed':
//       return { color: 'info', label: 'Completed', bg: '#e3f2fd', text: '#0277bd' };
//     case 'cancelled':
//       return { color: 'error', label: 'Cancelled', bg: '#ffebee', text: '#c62828' };
//     case 'pending':
//     default:
//       return { color: 'warning', label: 'Pending', bg: '#fff3e0', text: '#ef6c00' };
//   }
// };

// export default function MyBookings() {
//   const dispatch = useDispatch();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isExtraSmall = useMediaQuery(theme.breakpoints.down('xs'));
  
//   const { bookings, loading, error } = useSelector((state) => state.bookings);
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     dispatch(fetchUserBookings());
//   }, [dispatch]);

//   const filteredBookings = filter === 'all'
//     ? bookings
//     : bookings.filter(booking => booking.status === filter);

//   // Calculate counts for tabs
//   const getCount = (status) => {
//     if (status === 'all') return bookings?.length || 0;
//     return bookings?.filter(b => b.status === status).length || 0;
//   };

//   const handleTabChange = (event, newValue) => {
//     setFilter(newValue);
//   };

//   if (loading && !bookings) {
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
      
//       {/* Header Section */}
//       <Box sx={{ 
//         display: 'flex', 
//         flexDirection: { xs: 'column', sm: 'row' },
//         justifyContent: 'space-between', 
//         alignItems: { xs: 'flex-start', sm: 'center' }, 
//         mb: 3,
//         gap: 2
//       }}>
//         <Box>
//           <Typography variant="h4" sx={{ 
//             fontWeight: 700, 
//             color: '#000', 
//             mb: 0.5,
//             fontSize: { xs: '1.5rem', sm: '2.125rem' } 
//           }}>
//             My Bookings
//           </Typography>
//           <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
//             Manage and track all your tour reservations
//           </Typography>
//         </Box>
//         <Button
//           component={Link}
//           to="/tours"
//           variant="contained"
//           size={isMobile ? "medium" : "large"}
//           endIcon={!isMobile && <ArrowRightIcon />}
//           fullWidth={isMobile}
//           sx={{ 
//             backgroundColor: COLORS.primary, 
//             px: { xs: 2, sm: 3 },
//             '&:hover': { backgroundColor: '#1565c0' },
//             width: { xs: '100%', sm: 'auto' },
//             fontSize: { xs: '0.875rem', sm: '1rem' }
//           }}
//         >
//           {isMobile ? 'Book New Tour' : 'Book New Tour'}
//         </Button>
//       </Box>

//       {/* Error Alert */}
//       {error && (
//         <Alert severity="error" sx={{ mb: 3, width: '100%' }} variant="filled">
//           {error}
//         </Alert>
//       )}

//       {/* Filter Tabs - Scrollable on Mobile */}
//       <Paper sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden' }}>
//         <Tabs
//           value={filter}
//           onChange={handleTabChange}
//           variant="scrollable"
//           scrollButtons="auto"
//           allowScrollButtonsMobile
//           sx={{
//             borderBottom: 1,
//             borderColor: 'divider',
//             backgroundColor: '#fafafa',
//             '& .MuiTab-root': {
//               textTransform: 'none',
//               fontWeight: 600,
//               fontSize: { xs: '0.75rem', sm: '0.875rem' },
//               minHeight: { xs: 48, sm: 56 },
//               minWidth: { xs: 'auto', sm: 160 },
//               padding: { xs: '6px 12px', sm: '6px 16px' },
//               flexDirection: 'row',
//               gap: 1
//             },
//             '& .MuiChip-root': {
//               height: 18,
//               fontSize: '0.65rem',
//               marginLeft: '4px'
//             }
//           }}
//         >
//           <Tab label="All" value="all" icon={<Chip label={getCount('all')} size="small" />} iconPosition="end" />
//           <Tab label="Pending" value="pending" icon={<Chip label={getCount('pending')} size="small" />} iconPosition="end" />
//           <Tab label="Confirmed" value="confirmed" icon={<Chip label={getCount('confirmed')} size="small" />} iconPosition="end" />
//           <Tab label="Completed" value="completed" icon={<Chip label={getCount('completed')} size="small" />} iconPosition="end" />
//           <Tab label="Cancelled" value="cancelled" icon={<Chip label={getCount('cancelled')} size="small" />} iconPosition="end" />
//         </Tabs>
//       </Paper>

//       {/* Content Area */}
//       {filteredBookings.length === 0 ? (
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
//               No bookings found
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
//               {filter === 'all'
//                 ? "You haven't made any bookings yet. Start exploring our amazing tours!"
//                 : `You don't have any ${filter} bookings at the moment.`}
//             </Typography>
//             <Button
//               component={Link}
//               to="/tours"
//               variant="contained"
//               size={isMobile ? "medium" : "large"}
//               fullWidth={isMobile}
//               sx={{ mt: 2, backgroundColor: COLORS.primary, px: 4, width: { xs: '100%', sm: 'auto' } }}
//             >
//               Browse Tours
//             </Button>
//           </Box>
//         </Paper>
//       ) : (
//         /* Data Table - Responsive Container */
//         <Paper sx={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
//           <TableContainer sx={{ 
//             overflowX: 'auto', 
//             '&::-webkit-scrollbar': { height: '6px' },
//             '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
//             '&::-webkit-scrollbar-thumb': { background: '#bdbdbd', borderRadius: '3px' },
//             '&::-webkit-scrollbar-thumb:hover': { background: '#9e9e9e' }
//           }}>
//             <Table sx={{ minWidth: isMobile ? 650 : 800 }}>
//               <TableHead>
//                 <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
//                   <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap' }}>Booking ID</TableCell>
//                   <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap' }}>Tour Package</TableCell>
//                   <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap' }}>Dates</TableCell>
//                   <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap', align: 'right' }}>Amount</TableCell>
//                   <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap' }}>Status</TableCell>
//                   <TableCell sx={{ fontWeight: 700, color: '#555', textTransform: 'uppercase', fontSize: { xs: '10px', sm: '12px' }, whiteSpace: 'nowrap', align: 'right' }}>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredBookings.map((booking) => {
//                   const statusConfig = getStatusConfig(booking.status);
//                   return (
//                     <TableRow 
//                       key={booking.id} 
//                       hover
//                       sx={{ 
//                         '&:last-child td, &:last-child th': { border: 0 },
//                         '&:hover': { backgroundColor: '#f9fafb' }
//                       }}
//                     >
//                       <TableCell>
//                         <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLORS.primary, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
//                           {booking.booking_number}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#000', fontSize: { xs: '0.8rem', sm: '0.875rem' }, maxWidth: { xs: 120, sm: 'none' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                           {booking.TourPackage?.title || 'N/A'}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' }, display: 'block' }}>
//                           {booking.TourPackage?.destination || ''}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <CalendarIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary', flexShrink: 0 }} />
//                           <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
//                             {booking.start_date}
//                           </Typography>
//                         </Box>
//                         {isMobile && (
//                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', ml: 4 }}>
//                              to {booking.end_date}
//                            </Typography>
//                         )}
//                         {!isMobile && (
//                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
//                              - {booking.end_date}
//                            </Typography>
//                         )}
//                       </TableCell>
//                       <TableCell align="right">
//                         <Typography variant="body2" sx={{ fontWeight: 700, color: '#000', fontSize: { xs: '0.8rem', sm: '0.875rem' }, whiteSpace: 'nowrap' }}>
//                           KES {parseFloat(booking.total_amount).toLocaleString()}
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
//                       <TableCell align="right">
//                         <Button
//                           component={Link}
//                           to={`/dashboard/bookings/${booking.id}`}
//                           size="small"
//                           endIcon={<ArrowRightIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />}
//                           sx={{ 
//                             color: COLORS.primary, 
//                             fontWeight: 600,
//                             textTransform: 'none',
//                             fontSize: { xs: '0.75rem', sm: '0.875rem' },
//                             minWidth: { xs: 'auto', sm: 100 },
//                             padding: { xs: '4px 8px', sm: '6px 16px' },
//                             '&:hover': { backgroundColor: '#e3f2fd' }
//                           }}
//                         >
//                           {isMobile ? 'View' : 'View Details'}
//                         </Button>
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

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings } from '../../features/bookings/bookingSlice';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Divider,
  Stack,
  Tabs,
  Tab
} from '@mui/material';
import {
  ArrowRight as ArrowRightIcon,
  CalendarToday as CalendarIcon,
  ReceiptLong as ReceiptIcon,
  ExpandMore as ExpandMoreIcon,
  ConfirmationNumber as TicketIcon
} from '@mui/icons-material';

const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  warning: '#ed6c02',
  error: '#d32f2f',
  info: '#0288d1',
};

const getStatusConfig = (status) => {
  switch (status) {
    case 'confirmed': return { label: 'Confirmed', bg: '#e8f5e9', text: '#2e7d32' };
    case 'completed': return { label: 'Completed', bg: '#e3f2fd', text: '#0277bd' };
    case 'cancelled': return { label: 'Cancelled', bg: '#ffebee', text: '#c62828' };
    case 'pending': default: return { label: 'Pending', bg: '#fff3e0', text: '#ef6c00' };
  }
};

export default function MyBookings() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { bookings, loading, error } = useSelector((state) => state.bookings);
  const [filter, setFilter] = useState('all');

  useEffect(() => { dispatch(fetchUserBookings()); }, [dispatch]);

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const getCount = (status) => {
    if (status === 'all') return bookings?.length || 0;
    return bookings?.filter(b => b.status === status).length || 0;
  };

  // Render Single Booking Card (For Mobile)
  const renderBookingCard = (booking) => {
    const statusConfig = getStatusConfig(booking.status);
    return (
      <Card 
        key={booking.id} 
        sx={{ 
          mb: 2, 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          border: '1px solid #e0e0e0',
          overflow: 'hidden'
        }}
      >
        {/* Card Header */}
        <Box sx={{ p: 2, backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.primary }}>
              {booking.booking_number}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {booking.TourPackage?.title || 'N/A'}
            </Typography>
          </Box>
          <Chip 
            label={statusConfig.label} 
            size="small" 
            sx={{ backgroundColor: statusConfig.bg, color: statusConfig.text, fontWeight: 600, height: 20, fontSize: '0.7rem' }} 
          />
        </Box>

        {/* Card Body */}
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Stack spacing={2}>
            {/* Dates */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.2 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Travel Dates</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{booking.start_date}</Typography>
                <Typography variant="caption" color="text.secondary">to {booking.end_date}</Typography>
              </Box>
            </Box>

            {/* Amount */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <TicketIcon sx={{ fontSize: 18, color: 'text.secondary', mt: 0.2 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Total Amount</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#000' }}>
                  KES {parseFloat(booking.total_amount).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Action Button - Full Width on Mobile */}
          <Button
            component={Link}
            to={`/dashboard/bookings/${booking.id}`}
            variant="outlined"
            fullWidth
            endIcon={<ArrowRightIcon />}
            sx={{ 
              borderColor: COLORS.primary, 
              color: COLORS.primary, 
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': { backgroundColor: '#e3f2fd', borderColor: COLORS.primary }
            }}
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    );
  };

  if (loading && !bookings) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#000', mb: 0.5, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>My Bookings</Typography>
          <Typography variant="body2" color="text.secondary">Manage and track all your tour reservations</Typography>
        </Box>
        <Button component={Link} to="/tours" variant="contained" fullWidth={isMobile} sx={{ backgroundColor: COLORS.primary, '&:hover': { backgroundColor: '#1565c0' }, width: { xs: '100%', sm: 'auto' } }}>
          Book New Tour
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, width: '100%' }}>{error}</Alert>}

      {/* ✅ RESPONSIVE FILTER: Dropdown on Mobile, Tabs on Desktop */}
      <Paper sx={{ mb: 3, p: 2, borderRadius: '8px' }}>
        {isMobile ? (
          /* Mobile: Dropdown Select */
          <FormControl fullWidth size="small">
            <InputLabel id="filter-label">Filter Status</InputLabel>
            <Select
              labelId="filter-label"
              value={filter}
              label="Filter Status"
              onChange={(e) => setFilter(e.target.value)}
              IconComponent={ExpandMoreIcon}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' } }}
            >
              <MenuItem value="all">All Bookings ({getCount('all')})</MenuItem>
              <MenuItem value="pending">Pending ({getCount('pending')})</MenuItem>
              <MenuItem value="confirmed">Confirmed ({getCount('confirmed')})</MenuItem>
              <MenuItem value="completed">Completed ({getCount('completed')})</MenuItem>
              <MenuItem value="cancelled">Cancelled ({getCount('cancelled')})</MenuItem>
            </Select>
          </FormControl>
        ) : (
          /* Desktop: Horizontal Tabs */
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={filter} onChange={(e, newVal) => setFilter(newVal)} variant="scrollable" scrollButtons="auto"
              sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minWidth: 120 } }}>
              <Tab label={`All (${getCount('all')})`} value="all" />
              <Tab label={`Pending (${getCount('pending')})`} value="pending" />
              <Tab label={`Confirmed (${getCount('confirmed')})`} value="confirmed" />
              <Tab label={`Completed (${getCount('completed')})`} value="completed" />
              <Tab label={`Cancelled (${getCount('cancelled')})`} value="cancelled" />
            </Tabs>
          </Box>
        )}
      </Paper>

      {/* Content Area */}
      {filteredBookings.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: '12px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ReceiptIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>No bookings found</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
              {filter === 'all' ? "You haven't made any bookings yet." : `No ${filter} bookings found.`}
            </Typography>
            <Button component={Link} to="/tours" variant="contained" fullWidth={isMobile} sx={{ mt: 2, backgroundColor: COLORS.primary, width: { xs: '100%', sm: 'auto' } }}>Browse Tours</Button>
          </Box>
        </Paper>
      ) : (
        <>
          {/* ✅ MOBILE VIEW: Card List (Visible only on xs/sm) */}
          <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
            {filteredBookings.map(renderBookingCard)}
          </Box>

          {/* ✅ DESKTOP VIEW: Standard Table (Visible only on md+) */}
          <Paper sx={{ display: { xs: 'none', sm: 'block' }, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Booking ID</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Package</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Dates</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', align: 'right' }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', align: 'right' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredBookings.map((booking) => {
                    const statusConfig = getStatusConfig(booking.status);
                    return (
                      <TableRow key={booking.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: COLORS.primary }}>{booking.booking_number}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{booking.TourPackage?.title}</Typography>
                          <Typography variant="caption" color="text.secondary">{booking.TourPackage?.destination}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">{booking.start_date} - {booking.end_date}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>KES {parseFloat(booking.total_amount).toLocaleString()}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={statusConfig.label} size="small" sx={{ backgroundColor: statusConfig.bg, color: statusConfig.text, fontWeight: 600, height: 24, fontSize: '0.75rem' }} />
                        </TableCell>
                        <TableCell align="right">
                          <Button component={Link} to={`/dashboard/bookings/${booking.id}`} size="small" endIcon={<ArrowRightIcon />} sx={{ color: COLORS.primary, fontWeight: 600, textTransform: 'none', '&:hover': { backgroundColor: '#e3f2fd' } }}>View Details</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}
    </Box>
  );
}