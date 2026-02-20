import React, { useState, useEffect } from 'react';
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
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const COLORS = {
  primary: '#1976d2',
  success: '#2e7d32',
  error: '#c62828',
  warning: '#e65100'
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

  const columns = [
    { id: 'title', label: 'Package', minWidth: 200 },
    { id: 'category', label: 'Category', minWidth: 120 },
    { id: 'price_adult', label: 'Price (Adult)', minWidth: 120, align: 'right' },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'actions', label: 'Actions', minWidth: 150, align: 'right' }
  ];

  const renderRow = (pkg) => (
    <TableRow 
      key={pkg.id} 
      hover 
      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
      <TableCell>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {pkg.title}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {pkg.duration} days
        </Typography>
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
      <TableCell align="right">
        KES {parseFloat(pkg.price_adult).toLocaleString()}
      </TableCell>
      <TableCell>
        <Chip 
          label={pkg.status}
          size="small"
          sx={{
            backgroundColor: pkg.status === 'active' ? '#e8f5e9' : '#ffebee',
            color: pkg.status === 'active' ? COLORS.success : COLORS.error
          }}
        />
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Edit Package">
          <Button
            component={Link}
            to={`/admin/packages/edit/${pkg.id}`}
            size="small"
            startIcon={<EditIcon />}
            sx={{ 
              mr: 1,
              backgroundColor: COLORS.primary,
              color: 'white',
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            Edit
          </Button>
        </Tooltip>
        <Tooltip title="Delete Package">
          <Button
            size="small"
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

  return (
    <Box sx={{ p: 0 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#000' }}>
          Manage Packages
        </Typography>
        <Button
          component={Link}
          to="/admin/packages/new"
          variant="contained"
          sx={{ 
            backgroundColor: COLORS.primary,
            '&:hover': { backgroundColor: '#1565c0' }
          }}
        >
          Add New Package
        </Button>
      </Box>

      {/* Stats Summary */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
        gap: 2, 
        mb: 3 
      }}>
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="body2" color="textSecondary">Total Packages</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {packages?.length || 0}
          </Typography>
        </Box>
        <Box sx={{ 
          p: 2, 
          backgroundColor: '#fff', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="body2" color="textSecondary">Featured</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {packages?.filter(p => p.is_featured).length || 0}
          </Typography>
        </Box>
      </Box>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={packages || []}
        renderRow={renderRow}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        rowsPerPageOptions={[5, 10, 25, 50]}
        initialRowsPerPage={10}
      />
    </Box>
  );
}