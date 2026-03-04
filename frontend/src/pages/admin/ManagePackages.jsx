import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages, deletePackage } from '../../features/packages/packageSlice';
import { Link } from 'react-router-dom';
import AdminTable from '../../components/AdminTable';
import {
  Chip,
  Box,
  Typography,
  TableRow,
  TableCell,
  Tooltip,
  Avatar,
  Button, // Removed IconButton since we are using full buttons now
  InputAdornment,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HotelIcon from '@mui/icons-material/Hotel';
import SearchIcon from '@mui/icons-material/Search';

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
      return field;
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

  const processedPackages = useMemo(() => {
    if (!packages) return [];
    return packages.map(pkg => ({
      ...pkg,
      itinerary: parseJSONField(pkg.itinerary),
      inclusions: parseJSONField(pkg.inclusions),
      exclusions: parseJSONField(pkg.exclusions),
      location: parseJSONField(pkg.location)
    }));
  }, [packages]);

  const columns = [
    { id: 'title', label: 'Package', minWidth: 200 },
    { id: 'category', label: 'Category', minWidth: 120 },
    { id: 'duration', label: 'Duration', minWidth: 130 },
    { id: 'location', label: 'Location', minWidth: 150 },
    { id: 'price_adult', label: 'Price (Adult)', minWidth: 120, align: 'right' },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'actions', label: 'Actions', minWidth: 150, align: 'right' }
  ];

  const renderRow = (pkg, isMobile = false) => {
    const days = pkg.duration_days || 0;
    const nights = pkg.duration_nights !== undefined ? pkg.duration_nights : (days > 0 ? days - 1 : 0);
    const durationText = `${days} Days / ${nights} Nights`;
    const locationAddress = pkg.location?.address || pkg.destination || 'N/A';

    // 📱 MOBILE CARD VIEW (Buttons as Blocks at Bottom)
    if (isMobile) {
      return (
        <TableRow
          key={pkg.id}
          sx={{
            display: 'table-row'
          }}
        >
          <TableCell
            colSpan={columns.length}
            sx={{
              display: 'block',
              mb: 2.5,
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              backgroundColor: '#fff',
              overflow: 'hidden',
              padding: 0,
              borderBottom: 'none',
              '&:last-child': { mb: 0 },
              maxWidth: { xs: 'calc(100vw - 32px)', sm: '600px' },
              width: 'auto',
              mx: 'auto',
              boxSizing: 'border-box'
            }}
          >
            {/* Card Header: Cleaned up (No action icons here anymore) */}
            <Box sx={{
              p: 2.5,
              borderBottom: '1px solid #f3f4f6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              backgroundColor: '#f9fafb',
              width: '100%',
              boxSizing: 'border-box',
              gap: 2
            }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: COLORS.primary, fontSize: '1rem', flexShrink: 0 }}>
                {pkg.title?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {pkg.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                  <CalendarTodayIcon sx={{ fontSize: 14, color: '#6b7280' }} />
                  <Typography variant="caption" color="text.secondary">
                    {durationText}
                  </Typography>
                  {pkg.is_featured && (
                    <Chip
                      icon={<StarIcon />}
                      label="Featured"
                      size="small"
                      sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#fffbeb', color: COLORS.warning, '& .MuiChip-icon': { fontSize: '12px' } }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {/* Right Side: Status Badge ONLY */}
            <Box sx={{ flexShrink: 0 }}>
              <Chip
                label={pkg.status}
                size="small"
                sx={{
                  backgroundColor: pkg.status === 'published' ? '#f0fdf4' : '#fef2f2',
                  color: pkg.status === 'published' ? COLORS.success : COLORS.error,
                  fontWeight: 700,
                  height: 24,
                  fontSize: '11px'
                }}
              />
            </Box>
          </Box>

          {/* Card Body */}
          <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%', boxSizing: 'border-box' }}>

            {/* Category */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ mt: 0.5, color: '#9ca3af', flexShrink: 0 }}><CategoryIcon fontSize="small" /></Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', fontSize: '10px', color: '#6b7280' }}>Category</Typography>
                <Typography variant="body2" sx={{ textTransform: 'capitalize', color: '#374151' }}>{pkg.category}</Typography>
              </Box>
            </Box>

            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ mt: 0.5, color: '#9ca3af', flexShrink: 0 }}><LocationOnIcon fontSize="small" /></Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', fontSize: '10px', color: '#6b7280' }}>Location</Typography>
                <Typography variant="body2" noWrap sx={{ color: '#374151' }}>{locationAddress}</Typography>
              </Box>
            </Box>

            {/* Price */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ mt: 0.5, color: '#9ca3af', flexShrink: 0 }}><AttachMoneyIcon fontSize="small" /></Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', fontSize: '10px', color: '#6b7280' }}>Price (Adult)</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: COLORS.primary, fontSize: '1.1rem' }}>KES {parseFloat(pkg.price_adult).toLocaleString()}</Typography>
              </Box>
            </Box>

            {/* ✅ ACTION BUTTONS (Full Width Blocks at Bottom) */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1, pt: 2, borderTop: '1px dashed #e5e7eb', width: '100%' }}>
              <Button
                component={Link}
                to={`/admin/packages/edit/${pkg.id}`}
                variant="outlined"
                fullWidth
                startIcon={<EditIcon />}
                sx={{
                  borderColor: COLORS.primary,
                  color: COLORS.primary,
                  fontWeight: 600,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#eff6ff', borderColor: COLORS.primary }
                }}
              >
                Edit Package
              </Button>
              <Button
                variant="contained"
                fullWidth
                startIcon={<DeleteIcon />}
                onClick={() => handleDelete(pkg.id)}
                sx={{
                  backgroundColor: COLORS.error,
                  color: 'white',
                  fontWeight: 600,
                  py: 1.2,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)',
                  '&:hover': { backgroundColor: '#b91c1c', boxShadow: '0 4px 6px rgba(220, 38, 38, 0.3)' }
                }}
              >
                Delete Package
              </Button>
            </Box>
          </Box>
          </TableCell>
        </TableRow>
      );
    }

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
            sx={{ textTransform: 'capitalize', backgroundColor: '#f5f5f5' }}
          />
        </TableCell>
        <TableCell>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <HotelIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            {durationText}
          </Typography>
        </TableCell>
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
            <IconButton
              component={Link}
              to={`/admin/packages/edit/${pkg.id}`}
              size="small"
              sx={{ color: COLORS.primary, mr: 1, '&:hover': { bgcolor: COLORS.primaryLight } }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Package">
            <IconButton
              size="small"
              onClick={() => handleDelete(pkg.id)}
              sx={{ color: COLORS.error, '&:hover': { bgcolor: '#fee2e2' } }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{
      p: { xs: 1.5, sm: 2, md: 3 },
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Inner container with max width for better mobile layout */}
      <Box sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '100%', md: '1400px' },
        mx: 'auto'
      }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 4,
        gap: { xs: 2, sm: 0 }
      }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 0.5 }}>
            Manage Packages
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Create, edit, and organize your tour offerings
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/admin/packages/new"
          variant="contained"
          startIcon={<span style={{ fontSize: '1.2rem' }}>+</span>}
          sx={{
            backgroundColor: COLORS.primary,
            '&:hover': { backgroundColor: '#1d4ed8' },
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.2,
            width: 'auto',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
          }}
        >
          Add New Package
        </Button>
      </Box>

      {/* Stats Summary */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
        gap: { xs: 2, sm: 2.5, md: 3 },
        mb: { xs: 3, md: 4 }
      }}>
        <Box sx={{ p: { xs: 2, md: 2.5 }, backgroundColor: '#fff', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Total Packages</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5, color: '#111827', fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
            {processedPackages?.length || 0}
          </Typography>
        </Box>
        <Box sx={{ p: { xs: 2, md: 2.5 }, backgroundColor: '#fff', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Featured</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5, color: COLORS.warning, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
            {processedPackages?.filter(p => p.is_featured).length || 0}
          </Typography>
        </Box>
        <Box sx={{ p: { xs: 2, md: 2.5 }, backgroundColor: '#fff', borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Mapped Locations</Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5, color: COLORS.success, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
            {processedPackages?.filter(p => p.location && p.location.lat && p.location.lng).length || 0}
          </Typography>
        </Box>
      </Box>

      {/* Table Wrapper */}
      <Box sx={{
        width: '100%',
        overflowX: { xs: 'hidden', md: 'auto' },
        borderRadius: 3,
        boxSizing: 'border-box'
      }}>
        <AdminTable
          columns={columns}
          data={processedPackages || []}
          renderRow={renderRow}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          rowsPerPageOptions={[5, 10, 25, 50]}
          initialRowsPerPage={10}
          searchInputProps={{
            placeholder: "Search packages...",
            InputProps: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2,
                backgroundColor: '#fff',
                '& fieldset': { borderColor: '#e5e7eb' },
                '&:hover fieldset': { borderColor: '#9ca3af' },
                '&.Mui-focused fieldset': { borderColor: COLORS.primary, borderWidth: 1 },
              }
            },
            sx: { '& .MuiInputBase-root': { height: '44px', fontSize: '0.9rem' } }
          }}
        />
      </Box>
      </Box>
    </Box>
  );
}