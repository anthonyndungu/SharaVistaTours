// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchPackages, deletePackage } from '../../features/packages/packageSlice';
// import { Link } from 'react-router-dom';
// import AdminTable from '../../components/AdminTable';
// import {
//   Button,
//   Chip,
//   Box,
//   Typography,
//   TableRow,
//   TableCell,
//   Tooltip,
//   Avatar,
//   IconButton
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import CategoryIcon from '@mui/icons-material/Category';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import StarIcon from '@mui/icons-material/Star';

// const COLORS = {
//   primary: '#1976d2',
//   success: '#2e7d32',
//   error: '#c62828',
//   warning: '#e65100'
// };

// export default function ManagePackages() {
//   const dispatch = useDispatch();
//   const { packages, loading } = useSelector((state) => state.packages);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     dispatch(fetchPackages());
//   }, [dispatch]);

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this package?')) {
//       dispatch(deletePackage(id));
//     }
//   };

//   const columns = [
//     { id: 'title', label: 'Package', minWidth: 200 },
//     { id: 'category', label: 'Category', minWidth: 120 },
//     { id: 'price_adult', label: 'Price (Adult)', minWidth: 120, align: 'right' },
//     { id: 'status', label: 'Status', minWidth: 100 },
//     { id: 'actions', label: 'Actions', minWidth: 150, align: 'right' }
//   ];

//   // ✅ Updated renderRow to handle Mobile Card View
//   const renderRow = (pkg, isMobile = false) => {
    
//     // 📱 MOBILE CARD VIEW
//     if (isMobile) {
//       return (
//         <TableRow 
//           key={pkg.id} 
//           sx={{ 
//             display: 'block', 
//             mb: 2, 
//             borderRadius: '8px', 
//             border: '1px solid #e0e0e0', 
//             boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
//             backgroundColor: '#fff',
//             overflow: 'hidden',
//             '&:last-child': { mb: 0 },
//             width: '100%', 
//             boxSizing: 'border-box' 
//           }}
//         >
//           {/* Card Header: Title, Status & Featured Indicator */}
//           <Box sx={{ 
//             p: 2, 
//             borderBottom: '1px solid #f0f0f0', 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'flex-start',
//             backgroundColor: '#fafafa',
//             width: '100%',
//             boxSizing: 'border-box'
//           }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
//               <Avatar sx={{ width: 40, height: 40, bgcolor: COLORS.primary, fontSize: '1rem', flexShrink: 0 }}>
//                 {pkg.title.charAt(0).toUpperCase()}
//               </Avatar>
//               <Box sx={{ minWidth: 0, flex: 1 }}>
//                 <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//                   {pkg.title}
//                 </Typography>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
//                   <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
//                   <Typography variant="caption" color="text.secondary">
//                     {pkg.duration} days
//                   </Typography>
//                   {pkg.is_featured && (
//                     <Chip 
//                       icon={<StarIcon />} 
//                       label="Featured" 
//                       size="small" 
//                       sx={{ height: 16, fontSize: '0.65rem', bgcolor: '#fff3e0', color: COLORS.warning }} 
//                     />
//                   )}
//                 </Box>
//               </Box>
//             </Box>
//             <Box sx={{ ml: 1, flexShrink: 0 }}>
//               <Chip 
//                 label={pkg.status}
//                 size="small"
//                 sx={{
//                   backgroundColor: pkg.status === 'active' ? '#e8f5e9' : '#ffebee',
//                   color: pkg.status === 'active' ? COLORS.success : COLORS.error,
//                   fontWeight: 600,
//                   height: 24
//                 }}
//               />
//             </Box>
//           </Box>

//           {/* Card Body: Details */}
//           <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, width: '100%', boxSizing: 'border-box' }}>
            
//             {/* Category Row */}
//             <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
//               <CategoryIcon sx={{ color: 'text.secondary', mt: 0.5, fontSize: 20, flexShrink: 0 }} />
//               <Box sx={{ minWidth: 0, flex: 1 }}>
//                 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
//                   Category
//                 </Typography>
//                 <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
//                   {pkg.category}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Price Row */}
//             <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
//               <AttachMoneyIcon sx={{ color: 'text.secondary', mt: 0.5, fontSize: 20, flexShrink: 0 }} />
//               <Box sx={{ minWidth: 0, flex: 1 }}>
//                 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
//                   Price (Adult)
//                 </Typography>
//                 <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.primary }}>
//                   KES {parseFloat(pkg.price_adult).toLocaleString()}
//                 </Typography>
//               </Box>
//             </Box>

//             {/* Actions Row (Stacked Buttons) */}
//             <Box sx={{ display: 'flex', gap: 1, mt: 1, width: '100%' }}>
//               <Button
//                 component={Link}
//                 to={`/admin/packages/edit/${pkg.id}`}
//                 variant="outlined"
//                 size="small"
//                 startIcon={<EditIcon />}
//                 fullWidth
//                 sx={{ 
//                   borderColor: COLORS.primary,
//                   color: COLORS.primary,
//                   '&:hover': { backgroundColor: '#e3f2fd', borderColor: COLORS.primary }
//                 }}
//               >
//                 Edit
//               </Button>
//               <Button
//                 variant="contained"
//                 size="small"
//                 startIcon={<DeleteIcon />}
//                 onClick={() => handleDelete(pkg.id)}
//                 fullWidth
//                 sx={{ 
//                   backgroundColor: COLORS.error,
//                   color: 'white',
//                   '&:hover': { backgroundColor: '#b71c1c' }
//                 }}
//               >
//                 Delete
//               </Button>
//             </Box>

//           </Box>
//         </TableRow>
//       );
//     }

//     // 💻 DESKTOP TABLE VIEW
//     return (
//       <TableRow 
//         key={pkg.id} 
//         hover 
//         sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//       >
//         <TableCell>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//              <Avatar sx={{ width: 32, height: 32, bgcolor: COLORS.primary, fontSize: '0.875rem', mr: 1 }}>
//                 {pkg.title.charAt(0).toUpperCase()}
//               </Avatar>
//             <Box>
//               <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                 {pkg.title}
//               </Typography>
//               <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                 <CalendarTodayIcon sx={{ fontSize: 12 }} /> {pkg.duration} days
//                 {pkg.is_featured && <StarIcon sx={{ fontSize: 12, color: COLORS.warning, ml: 0.5 }} />}
//               </Typography>
//             </Box>
//           </Box>
//         </TableCell>
//         <TableCell>
//           <Chip 
//             label={pkg.category} 
//             size="small" 
//             sx={{ 
//               textTransform: 'capitalize',
//               backgroundColor: '#f5f5f5'
//             }} 
//           />
//         </TableCell>
//         <TableCell align="right">
//           <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.primary }}>
//             KES {parseFloat(pkg.price_adult).toLocaleString()}
//           </Typography>
//         </TableCell>
//         <TableCell>
//           <Chip 
//             label={pkg.status}
//             size="small"
//             sx={{
//               backgroundColor: pkg.status === 'active' ? '#e8f5e9' : '#ffebee',
//               color: pkg.status === 'active' ? COLORS.success : COLORS.error
//             }}
//           />
//         </TableCell>
//         <TableCell align="right">
//           <Tooltip title="Edit Package">
//             <Button
//               component={Link}
//               to={`/admin/packages/edit/${pkg.id}`}
//               size="small"
//               variant="outlined"
//               startIcon={<EditIcon />}
//               sx={{ 
//                 mr: 1,
//                 borderColor: COLORS.primary,
//                 color: COLORS.primary,
//                 '&:hover': { backgroundColor: '#e3f2fd', borderColor: COLORS.primary }
//               }}
//             >
//               Edit
//             </Button>
//           </Tooltip>
//           <Tooltip title="Delete Package">
//             <Button
//               size="small"
//               variant="contained"
//               startIcon={<DeleteIcon />}
//               onClick={() => handleDelete(pkg.id)}
//               sx={{ 
//                 backgroundColor: COLORS.error,
//                 color: 'white',
//                 '&:hover': { backgroundColor: '#b71c1c' }
//               }}
//             >
//               Delete
//             </Button>
//           </Tooltip>
//         </TableCell>
//       </TableRow>
//     );
//   };

//   return (
//     <Box sx={{ 
//       p: { xs: 1, sm: 2, md: 3 }, 
//       width: '100%', 
//       maxWidth: '100%', 
//       overflowX: 'hidden', 
//       boxSizing: 'border-box' 
//     }}>
//       {/* Header: Title & Add Button */}
//       <Box sx={{ 
//         display: 'flex', 
//         flexDirection: { xs: 'column', sm: 'row' },
//         justifyContent: 'space-between', 
//         alignItems: { xs: 'flex-start', sm: 'center' }, 
//         mb: 3,
//         gap: { xs: 2, sm: 0 }
//       }}>
//         <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
//           Manage Packages
//         </Typography>
//         <Button
//           component={Link}
//           to="/admin/packages/new"
//           variant="contained"
//           fullWidth={false}
//           sx={{ 
//             backgroundColor: COLORS.primary,
//             '&:hover': { backgroundColor: '#1565c0' },
//             width: { xs: '100%', sm: 'auto' }
//           }}
//         >
//           Add New Package
//         </Button>
//       </Box>

//       {/* Stats Summary */}
//       <Box sx={{ 
//         display: 'grid', 
//         gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
//         gap: { xs: 2, sm: 3 }, 
//         mb: 4 
//       }}>
//         <Box sx={{ 
//           p: 2, 
//           backgroundColor: '#fff', 
//           borderRadius: '8px', 
//           boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//           border: '1px solid #e0e0e0'
//         }}>
//           <Typography variant="caption" color="textSecondary">Total Packages</Typography>
//           <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
//             {packages?.length || 0}
//           </Typography>
//         </Box>
//         <Box sx={{ 
//           p: 2, 
//           backgroundColor: '#fff', 
//           borderRadius: '8px', 
//           boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//           border: '1px solid #e0e0e0'
//         }}>
//           <Typography variant="caption" color="textSecondary">Featured</Typography>
//           <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.warning, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
//             {packages?.filter(p => p.is_featured).length || 0}
//           </Typography>
//         </Box>
//       </Box>

//       {/* Table Wrapper */}
//       <Box sx={{ 
//         width: '100%', 
//         overflowX: { xs: 'hidden', md: 'auto' }, 
//         borderRadius: '8px',
//         boxSizing: 'border-box'
//       }}>
//         <AdminTable
//           columns={columns}
//           data={packages || []}
//           renderRow={renderRow}
//           searchTerm={searchTerm}
//           onSearchChange={setSearchTerm}
//           rowsPerPageOptions={[5, 10, 25, 50]}
//           initialRowsPerPage={10}
//         />
//       </Box>
//     </Box>
//   );
// }



import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages, deletePackage } from '../../features/packages/packageSlice';
import { Link } from 'react-router-dom';
import AdminTable from '../../components/AdminTable';
import {
  Button,
  Chip,
  Box,
  Typography,
  TableRow,
  TableCell,
  Tooltip,
  Avatar,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // ✅ New Icon
import HotelIcon from '@mui/icons-material/Hotel'; // ✅ New Icon for Nights

const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  error: '#c62828',
  warning: '#e65100'
};

// ✅ Helper to safely parse JSON fields from DB
const parseJSONField = (field) => {
  if (!field) return null;
  if (typeof field === 'object') return field;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      return field; // Return string if not valid JSON
    }
  }
  return field;
};

export default function ManagePackages() {
  const dispatch = useDispatch();
  const { packages, loading } = useSelector((state) => state.packages);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      dispatch(deletePackage(id));
    }
  };

  // ✅ Pre-process packages to ensure JSON fields are parsed
  const processedPackages = useMemo(() => {
    if (!packages) return [];
    return packages.map(pkg => ({
      ...pkg,
      itinerary: parseJSONField(pkg.itinerary),
      inclusions: parseJSONField(pkg.inclusions),
      exclusions: parseJSONField(pkg.exclusions),
      // Ensure location is an object { lat, lng, address }
      location: parseJSONField(pkg.location) 
    }));
  }, [packages]);

  const columns = [
    { id: 'title', label: 'Package', minWidth: 200 },
    { id: 'category', label: 'Category', minWidth: 120 },
    { id: 'duration', label: 'Duration', minWidth: 130 }, // ✅ Updated Label
    { id: 'location', label: 'Location', minWidth: 150 }, // ✅ New Column
    { id: 'price_adult', label: 'Price (Adult)', minWidth: 120, align: 'right' },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'actions', label: 'Actions', minWidth: 150, align: 'right' }
  ];

  const renderRow = (pkg, isMobile = false) => {
    // Format Duration: "5 Days / 4 Nights"
    const days = pkg.duration_days || 0;
    const nights = pkg.duration_nights !== undefined ? pkg.duration_nights : (days > 0 ? days - 1 : 0);
    const durationText = `${days} Days / ${nights} Nights`;

    // Format Location: Extract address from JSON or fallback to destination
    const locationAddress = pkg.location?.address || pkg.destination || 'N/A';

    // 📱 MOBILE CARD VIEW
    if (isMobile) {
      return (
        <TableRow 
          key={pkg.id} 
          sx={{ 
            display: 'block', 
            mb: 2, 
            borderRadius: '8px', 
            border: '1px solid #e0e0e0', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            backgroundColor: '#fff',
            overflow: 'hidden',
            '&:last-child': { mb: 0 },
            width: '100%', 
            boxSizing: 'border-box' 
          }}
        >
          {/* Card Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: '1px solid #f0f0f0', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            backgroundColor: '#fafafa',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: COLORS.primary, fontSize: '1rem', flexShrink: 0 }}>
                {pkg.title?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {pkg.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  <CalendarTodayIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {durationText}
                  </Typography>
                  {pkg.is_featured && (
                    <Chip 
                      icon={<StarIcon />} 
                      label="Featured" 
                      size="small" 
                      sx={{ height: 16, fontSize: '0.65rem', bgcolor: '#fff3e0', color: COLORS.warning }} 
                    />
                  )}
                </Box>
              </Box>
            </Box>
            <Box sx={{ ml: 1, flexShrink: 0 }}>
              <Chip 
                label={pkg.status}
                size="small"
                sx={{
                  backgroundColor: pkg.status === 'published' ? '#e8f5e9' : '#ffebee', // ✅ Fixed status check
                  color: pkg.status === 'published' ? COLORS.success : COLORS.error,
                  fontWeight: 600,
                  height: 24
                }}
              />
            </Box>
          </Box>

          {/* Card Body */}
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, width: '100%', boxSizing: 'border-box' }}>
            
            {/* Category Row */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
              <CategoryIcon sx={{ color: 'text.secondary', mt: 0.5, fontSize: 20, flexShrink: 0 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Category
                </Typography>
                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                  {pkg.category}
                </Typography>
              </Box>
            </Box>

            {/* ✅ NEW: Location Row */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
              <LocationOnIcon sx={{ color: 'text.secondary', mt: 0.5, fontSize: 20, flexShrink: 0 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Location
                </Typography>
                <Typography variant="body2" noWrap>
                  {locationAddress}
                </Typography>
              </Box>
            </Box>

            {/* Price Row */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
              <AttachMoneyIcon sx={{ color: 'text.secondary', mt: 0.5, fontSize: 20, flexShrink: 0 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  Price (Adult)
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.primary }}>
                  KES {parseFloat(pkg.price_adult).toLocaleString()}
                </Typography>
              </Box>
            </Box>

            {/* Actions Row */}
            <Box sx={{ display: 'flex', gap: 1, mt: 1, width: '100%' }}>
              <Button
                component={Link}
                to={`/admin/packages/edit/${pkg.id}`}
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                fullWidth
                sx={{ 
                  borderColor: COLORS.primary,
                  color: COLORS.primary,
                  '&:hover': { backgroundColor: '#e3f2fd', borderColor: COLORS.primary }
                }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(pkg.id)}
                fullWidth
                sx={{ 
                  backgroundColor: COLORS.error,
                  color: 'white',
                  '&:hover': { backgroundColor: '#b71c1c' }
                }}
              >
                Delete
              </Button>
            </Box>

          </Box>
        </TableRow>
      );
    }

    // 💻 DESKTOP TABLE VIEW
    return (
      <TableRow 
        key={pkg.id} 
        hover 
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <Avatar sx={{ width: 32, height: 32, bgcolor: COLORS.primary, fontSize: '0.875rem', mr: 1 }}>
                {pkg.title?.charAt(0).toUpperCase()}
              </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {pkg.title}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 12 }} /> {durationText}
                {pkg.is_featured && <StarIcon sx={{ fontSize: 12, color: COLORS.warning, ml: 0.5 }} />}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Chip 
            label={pkg.category} 
            size="small" 
            sx={{ 
              textTransform: 'capitalize',
              backgroundColor: '#f5f5f5'
            }} 
          />
        </TableCell>
        
        {/* ✅ NEW: Duration Column */}
        <TableCell>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <HotelIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            {durationText}
          </Typography>
        </TableCell>

        {/* ✅ NEW: Location Column */}
        <TableCell>
          <Tooltip title={locationAddress}>
            <Typography variant="body2" noWrap sx={{ maxWidth: 150, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              {locationAddress}
            </Typography>
          </Tooltip>
        </TableCell>

        <TableCell align="right">
          <Typography variant="body2" sx={{ fontWeight: 600, color: COLORS.primary }}>
            KES {parseFloat(pkg.price_adult).toLocaleString()}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip 
            label={pkg.status}
            size="small"
            sx={{
              backgroundColor: pkg.status === 'published' ? '#e8f5e9' : '#ffebee',
              color: pkg.status === 'published' ? COLORS.success : COLORS.error
            }}
          />
        </TableCell>
        <TableCell align="right">
          <Tooltip title="Edit Package">
            <Button
              component={Link}
              to={`/admin/packages/edit/${pkg.id}`}
              size="small"
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{ 
                mr: 1,
                borderColor: COLORS.primary,
                color: COLORS.primary,
                '&:hover': { backgroundColor: '#e3f2fd', borderColor: COLORS.primary }
              }}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Delete Package">
            <Button
              size="small"
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(pkg.id)}
              sx={{ 
                backgroundColor: COLORS.error,
                color: 'white',
                '&:hover': { backgroundColor: '#b71c1c' }
              }}
            >
              Delete
            </Button>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3 }, 
      width: '100%', 
      maxWidth: '100%', 
      overflowX: 'hidden', 
      boxSizing: 'border-box' 
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        mb: 3,
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#000', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
          Manage Packages
        </Typography>
        <Button
          component={Link}
          to="/admin/packages/new"
          variant="contained"
          fullWidth={false}
          sx={{ 
            backgroundColor: COLORS.primary,
            '&:hover': { backgroundColor: '#1565c0' },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Add New Package
        </Button>
      </Box>

      {/* Stats Summary */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, // ✅ Added 3rd column
        gap: { xs: 2, sm: 3 }, 
        mb: 4 
      }}>
        <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0' }}>
          <Typography variant="caption" color="textSecondary">Total Packages</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            {processedPackages?.length || 0}
          </Typography>
        </Box>
        <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0' }}>
          <Typography variant="caption" color="textSecondary">Featured</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.warning, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            {processedPackages?.filter(p => p.is_featured).length || 0}
          </Typography>
        </Box>
        {/* ✅ New Stat: With Coordinates */}
        <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e0e0e0' }}>
          <Typography variant="caption" color="textSecondary">Mapped Locations</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.success, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            {processedPackages?.filter(p => p.location && p.location.lat && p.location.lng).length || 0}
          </Typography>
        </Box>
      </Box>

      {/* Table Wrapper */}
      <Box sx={{ 
        width: '100%', 
        overflowX: { xs: 'hidden', md: 'auto' }, 
        borderRadius: '8px',
        boxSizing: 'border-box'
      }}>
        <AdminTable
          columns={columns}
          data={processedPackages || []} // ✅ Use processed data
          renderRow={renderRow}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          rowsPerPageOptions={[5, 10, 25, 50]}
          initialRowsPerPage={10}
        />
      </Box>
    </Box>
  );
}