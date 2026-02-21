// // import React from 'react';
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow, // ✅ Import TableRow
// //   Paper,
// //   TablePagination,
// //   TextField,
// //   InputAdornment,
// //   Box
// // } from '@mui/material';
// // import { Search as SearchIcon } from '@mui/icons-material';

// // const AdminTable = ({
// //   columns,
// //   data,
// //   renderRow, // This should return a TableRow component
// //   searchTerm,
// //   onSearchChange,
// //   rowsPerPageOptions = [5, 10, 25],
// //   initialRowsPerPage = 10
// // }) => {
// //   const [page, setPage] = React.useState(0);
// //   const [rowsPerPage, setRowsPerPage] = React.useState(initialRowsPerPage);

// //   const handleChangePage = (event, newPage) => {
// //     setPage(newPage);
// //   };

// //   const handleChangeRowsPerPage = (event) => {
// //     setRowsPerPage(parseInt(event.target.value, 10));
// //     setPage(0);
// //   };

// //   const filteredData = data?.filter(item => {
// //     return columns.some(column => {
// //       if (column.renderSearchValue) {
// //         return column.renderSearchValue(item).toLowerCase().includes(searchTerm.toLowerCase());
// //       }
// //       return item[column.id]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
// //     });
// //   }) || [];

// //   const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

// //   return (
// //     <Paper 
// //       elevation={0} 
// //       sx={{ 
// //         border: '1px solid #e0e0e0', 
// //         borderRadius: '8px',
// //         overflow: 'hidden'
// //       }}
// //     >
// //       {/* Search Bar */}
// //       <Box sx={{ p: 2, pb: 0 }}>
// //         <TextField
// //           fullWidth
// //           placeholder="Search..."
// //           value={searchTerm}
// //           onChange={(e) => onSearchChange(e.target.value)}
// //           size="small"
// //           InputProps={{
// //             startAdornment: (
// //               <InputAdornment position="start">
// //                 <SearchIcon />
// //               </InputAdornment>
// //             ),
// //           }}
// //           sx={{
// //             backgroundColor: '#fff',
// //             '& .MuiOutlinedInput-root': {
// //               borderRadius: '4px',
// //               '& fieldset': {
// //                 borderColor: '#e0e0e0',
// //               },
// //             },
// //           }}
// //         />
// //       </Box>

// //       {/* Table */}
// //       <TableContainer>
// //         <Table sx={{ minWidth: 650 }} aria-label="admin table">
// //           <TableHead>
// //             <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
// //               {columns.map((column) => (
// //                 <TableCell
// //                   key={column.id}
// //                   align={column.align || 'left'}
// //                   sx={{ 
// //                     fontWeight: 600, 
// //                     color: '#555', 
// //                     textTransform: 'uppercase',
// //                     fontSize: '12px',
// //                     letterSpacing: '0.5px'
// //                   }}
// //                 >
// //                   {column.label}
// //                 </TableCell>
// //               ))}
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {paginatedData.length > 0 ? (
// //               paginatedData.map(renderRow) // ✅ renderRow should return <TableRow>
// //             ) : (
// //               <TableRow>
// //                 <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
// //                   No records found
// //                 </TableCell>
// //               </TableRow>
// //             )}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>

// //       {/* Pagination */}
// //       <TablePagination
// //         rowsPerPageOptions={rowsPerPageOptions}
// //         component="div"
// //         count={filteredData.length}
// //         rowsPerPage={rowsPerPage}
// //         page={page}
// //         onPageChange={handleChangePage}
// //         onRowsPerPageChange={handleChangeRowsPerPage}
// //         sx={{
// //           '& .MuiTablePagination-select': {
// //             fontSize: '14px',
// //           },
// //           '& .MuiTablePagination-displayedRows': {
// //             fontSize: '14px',
// //           }
// //         }}
// //       />
// //     </Paper>
// //   );
// // };

// // export default AdminTable;



// import React from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TablePagination,
//   TextField,
//   InputAdornment,
//   Box,
//   useTheme,
//   useMediaQuery
// } from '@mui/material';
// import { Search as SearchIcon } from '@mui/icons-material';

// const AdminTable = ({
//   columns,
//   data,
//   renderRow,
//   searchTerm,
//   onSearchChange,
//   rowsPerPageOptions = [5, 10, 25],
//   initialRowsPerPage = 10
// }) => {
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(initialRowsPerPage);
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const filteredData = data?.filter(item => {
//     return columns.some(column => {
//       if (column.renderSearchValue) {
//         return column.renderSearchValue(item).toLowerCase().includes(searchTerm.toLowerCase());
//       }
//       return item[column.id]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
//     });
//   }) || [];

//   const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <Paper 
//       elevation={0} 
//       sx={{ 
//         border: '1px solid #e0e0e0', 
//         borderRadius: { xs: '4px', sm: '8px' },
//         overflow: 'hidden',
//         display: 'flex',
//         flexDirection: 'column'
//       }}
//     >
//       {/* Search Bar */}
//       <Box sx={{ 
//         p: { xs: 1.5, sm: 2 }, 
//         pb: { xs: 1.5, sm: 0 },
//         backgroundColor: '#fff'
//       }}>
//         <TextField
//           fullWidth
//           placeholder={isMobile ? "Search..." : "Search records..."}
//           value={searchTerm}
//           onChange={(e) => onSearchChange(e.target.value)}
//           size="small"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
//               </InputAdornment>
//             ),
//             sx: {
//               fontSize: { xs: '0.875rem', sm: '0.95rem' }
//             }
//           }}
//           sx={{
//             backgroundColor: '#f9fafb',
//             '& .MuiOutlinedInput-root': {
//               borderRadius: '6px',
//               '& fieldset': {
//                 borderColor: '#e0e0e0',
//               },
//               '&:hover fieldset': {
//                 borderColor: '#bdbdbd',
//               },
//               '&.Mui-focused fieldset': {
//                 borderColor: '#1976d2',
//               },
//             },
//           }}
//         />
//       </Box>

//       {/* Table Container with Horizontal Scroll */}
//       <Box sx={{ 
//         width: '100%', 
//         overflowX: 'auto', 
//         flexGrow: 1,
//         // Smooth scrolling for better UX
//         scrollBehavior: 'smooth',
//         '&::-webkit-scrollbar': {
//           height: '6px',
//         },
//         '&::-webkit-scrollbar-track': {
//           background: '#f1f1f1',
//         },
//         '&::-webkit-scrollbar-thumb': {
//           background: '#bdbdbd',
//           borderRadius: '3px',
//         },
//         '&::-webkit-scrollbar-thumb:hover': {
//           background: '#9e9e9e',
//         }
//       }}>
//         <Table sx={{ minWidth: 650 }} aria-label="admin table">
//           <TableHead>
//             <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
//               {columns.map((column) => (
//                 <TableCell
//                   key={column.id}
//                   align={column.align || 'left'}
//                   sx={{ 
//                     fontWeight: 700, 
//                     color: '#555', 
//                     textTransform: 'uppercase',
//                     fontSize: { xs: '10px', sm: '11px', md: '12px' },
//                     letterSpacing: '0.5px',
//                     py: { xs: 1.5, sm: 2 },
//                     px: { xs: 1, sm: 2 },
//                     whiteSpace: 'nowrap'
//                   }}
//                 >
//                   {column.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedData.length > 0 ? (
//               paginatedData.map(renderRow)
//             ) : (
//               <TableRow>
//                 <TableCell 
//                   colSpan={columns.length} 
//                   align="center" 
//                   sx={{ 
//                     py: { xs: 4, sm: 6 },
//                     px: 2,
//                     color: 'text.secondary',
//                     fontSize: { xs: '0.875rem', sm: '1rem' }
//                   }}
//                 >
//                   No records found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </Box>

//       {/* Pagination - Responsive Layout */}
//       <Box sx={{ 
//         borderTop: '1px solid #e0e0e0', 
//         backgroundColor: '#fff',
//         overflow: 'auto'
//       }}>
//         <TablePagination
//           rowsPerPageOptions={rowsPerPageOptions}
//           component="div"
//           count={filteredData.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           labelRowsPerPage={isMobile ? 'Rows:' : 'Rows per page:'}
//           sx={{
//             minHeight: { xs: 56, sm: 64 },
//             flexWrap: { xs: 'wrap', sm: 'nowrap' },
//             '& .MuiTablePagination-select': {
//               fontSize: { xs: '0.75rem', sm: '0.875rem' },
//               minWidth: { xs: 50, sm: 60 },
//             },
//             '& .MuiTablePagination-displayedRows': {
//               fontSize: { xs: '0.75rem', sm: '0.875rem' },
//               margin: { xs: '0', sm: 'initial' },
//               textAlign: { xs: 'center', sm: 'left' },
//               width: { xs: '100%', sm: 'auto' },
//               mb: { xs: 1, sm: 0 }
//             },
//             '& .MuiTablePagination-actions': {
//               marginLeft: { xs: '0', sm: 'auto' },
//               justifyContent: { xs: 'center', sm: 'flex-end' },
//               width: { xs: '100%', sm: 'auto' },
//             },
//             '& .MuiToolbar-root': {
//               minHeight: { xs: 56, sm: 64 },
//               flexDirection: { xs: 'column', sm: 'row' },
//               gap: { xs: 1, sm: 0 },
//               py: { xs: 0.5, sm: 0 }
//             }
//           }}
//         />
//       </Box>
//     </Paper>
//   );
// };

// export default AdminTable;



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