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
  initialRowsPerPage = 10
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(initialRowsPerPage);
  
  const theme = useTheme();
  // Switch to card view below 'md' (900px). Adjust to 'sm' if you prefer cards only on very small phones.
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = data?.filter(item => {
    return columns.some(column => {
      if (column.renderSearchValue) {
        return column.renderSearchValue(item).toLowerCase().includes(searchTerm.toLowerCase());
      }
      return item[column.id]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  }) || [];

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        border: '1px solid #e0e0e0', 
        borderRadius: { xs: '4px', sm: '8px' },
        overflow: 'visible', 
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Search Bar */}
      <Box sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        pb: { xs: 1.5, sm: 0 }, 
        backgroundColor: '#fff', 
        width: '100%', 
        boxSizing: 'border-box' 
      }}>
        <TextField
          fullWidth
          placeholder={isMobile ? "Search..." : "Search records..."}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: '#f9fafb',
            '& .MuiOutlinedInput-root': {
              borderRadius: '6px',
              '& fieldset': { borderColor: '#e0e0e0' },
            },
          }}
        />
      </Box>

      {/* Table Container */}
      <Box sx={{ 
        width: '100%', 
        // Disable horizontal scroll on mobile since we use cards; enable on desktop for safety
        overflowX: { xs: 'hidden', md: 'auto' }, 
        boxSizing: 'border-box'
      }}>
        <Table 
          sx={{ 
            // Critical: Remove fixed minWidth on mobile to prevent forcing overflow
            minWidth: isMobile ? 'auto' : 650, 
            width: '100%',
            // Ensure table behaves as block on mobile to respect card layout
            display: { xs: 'block', md: 'table' }, 
            borderCollapse: 'separate',
            borderSpacing: 0
          }} 
          aria-label="admin table"
        >
          {/* Hide Header on Mobile */}
          <TableHead sx={{ display: { xs: 'none', md: 'table-header-group' } }}>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{ 
                    fontWeight: 700, 
                    color: '#555', 
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    py: 2,
                    px: 2
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody sx={{ display: { xs: 'block', md: 'table-row-group' } }}>
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => 
                // Pass isMobile flag to the row renderer
                renderRow(item, isMobile) 
              )
            ) : (
              <TableRow sx={{ display: { xs: 'block', md: 'table-row' } }}>
                <TableCell 
                  colSpan={columns.length} 
                  align="center" 
                  sx={{ 
                    py: 6, 
                    px: 2, 
                    display: 'block', 
                    width: '100%', 
                    boxSizing: 'border-box',
                    borderBottom: 'none'
                  }}
                >
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* Pagination */}
      <Box sx={{ 
        borderTop: '1px solid #e0e0e0', 
        backgroundColor: '#fff', 
        width: '100%', 
        boxSizing: 'border-box' 
      }}>
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
              gap: { xs: 1, sm: 0 },
              py: { xs: 0.5, sm: 0 },
              px: { xs: 1, sm: 2 },
              width: '100%',
              boxSizing: 'border-box',
              minHeight: { xs: 'auto', sm: 56 }
            },
            '& .MuiTablePagination-select': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            },
            '& .MuiTablePagination-displayedRows': {
              textAlign: { xs: 'center', sm: 'left' },
              width: { xs: '100%', sm: 'auto' },
              mb: { xs: 1, sm: 0 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            },
            '& .MuiTablePagination-actions': {
              marginLeft: { xs: '0', sm: 'auto' },
              justifyContent: { xs: 'center', sm: 'flex-end' },
              width: { xs: '100%', sm: 'auto' },
            }
          }}
        />
      </Box>
    </Paper>
  );
};

export default AdminTable;