import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const AdminTable = ({
  columns,
  data,
  renderRow,
  searchTerm,
  onSearchChange,
  rowsPerPageOptions = [5, 10, 25],
  initialRowsPerPage = 10,
  searchInputProps = {}
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(initialRowsPerPage);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = data?.filter(item => {
    return columns.some(column => {
      const value = item[column.id]?.toString() || '';
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }) || [];

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        border: `1px solid #e5e7eb`, 
        borderRadius: 3,
        overflow: 'visible', // Changed to visible so shadows don't get cut off
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}
    >
      {/* Search Bar */}
      <Box sx={{ p: { xs: 2, sm: 2.5 }, pb: { xs: 2, sm: 2.5 }, backgroundColor: '#fff', width: '100%', boxSizing: 'border-box', borderBottom: `1px solid #f3f4f6` }}>
        <TextField
          fullWidth
          size="small"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          {...searchInputProps}
        />
      </Box>

      {/* Table Container */}
      <Box sx={{ width: '100%', overflowX: { xs: 'hidden', md: 'auto' }, boxSizing: 'border-box' }}>
        <Table 
          sx={{ 
            // CRITICAL FIX: Remove fixed width on mobile to allow cards to size naturally
            minWidth: isMobile ? 'auto' : 650, 
            width: isMobile ? 'auto' : '100%', 
            display: { xs: 'block', md: 'table' }, 
            borderCollapse: 'separate',
            borderSpacing: 0
          }} 
          aria-label="admin table"
        >
          <TableHead sx={{ display: { xs: 'none', md: 'table-header-group' } }}>
            <TableRow sx={{ backgroundColor: '#f9fafb' }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{ 
                    fontWeight: 700, 
                    color: '#6b7280', 
                    textTransform: 'uppercase',
                    fontSize: '11px',
                    letterSpacing: '0.5px',
                    py: 2.5,
                    px: 3,
                    borderBottom: `1px solid #e5e7eb`
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* CRITICAL FIX: Flex centering for mobile cards */}
          <TableBody sx={{ 
            display: { xs: 'block', md: 'table-row-group' },
            ...(isMobile ? {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center', // Centers the cards horizontally
              width: '100%'
            } : {})
          }}>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => renderRow(item, isMobile))
            ) : (
              <TableRow sx={{ display: { xs: 'block', md: 'table-row' } }}>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8, px: 2, display: 'block', width: '100%', boxSizing: 'border-box', borderBottom: 'none', color: '#9ca3af' }}>
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Pagination */}
      <Box sx={{ borderTop: `1px solid #e5e7eb`, backgroundColor: '#fff', width: '100%', boxSizing: 'border-box' }}>
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={isMobile ? 'Rows:' : 'Rows per page:'}
          sx={{
            '& .MuiToolbar-root': {
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1.5, sm: 0 },
              py: { xs: 1.5, sm: 0.5 },
              px: { xs: 2, sm: 3 },
              width: '100%',
              boxSizing: 'border-box',
              minHeight: { xs: 'auto', sm: 56 }
            },
            '& .MuiTablePagination-select': { fontSize: { xs: '0.8rem', sm: '0.875rem' } },
            '& .MuiTablePagination-displayedRows': {
              textAlign: { xs: 'center', sm: 'left' },
              width: { xs: '100%', sm: 'auto' },
              mb: { xs: 0.5, sm: 0 },
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              color: '#6b7280'
            },
            '& .MuiTablePagination-actions': {
              marginLeft: { xs: '0', sm: 'auto' },
              justifyContent: { xs: 'center', sm: 'flex-end' },
              width: { xs: '100%', sm: 'auto' }
            }
          }}
        />
      </Box>
    </Paper>
  );
};

export default AdminTable;