// // src/components/AdminTable.jsx
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
//   Box
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

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Filter data based on search term
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
//         borderRadius: '8px',
//         overflow: 'hidden'
//       }}
//     >
//       {/* Search Bar */}
//       <Box sx={{ p: 2, pb: 0 }}>
//         <TextField
//           fullWidth
//           placeholder="Search..."
//           value={searchTerm}
//           onChange={(e) => onSearchChange(e.target.value)}
//           size="small"
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon />
//               </InputAdornment>
//             ),
//           }}
//           sx={{
//             backgroundColor: '#fff',
//             '& .MuiOutlinedInput-root': {
//               borderRadius: '4px',
//               '& fieldset': {
//                 borderColor: '#e0e0e0',
//               },
//             },
//           }}
//         />
//       </Box>

//       {/* Table */}
//       <TableContainer>
//         <Table sx={{ minWidth: 650 }} aria-label="admin table">
//           <TableHead>
//             <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
//               {columns.map((column) => (
//                 <TableCell
//                   key={column.id}
//                   align={column.align || 'left'}
//                   sx={{ 
//                     fontWeight: 600, 
//                     color: '#555', 
//                     textTransform: 'uppercase',
//                     fontSize: '12px',
//                     letterSpacing: '0.5px'
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
//                 <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
//                   No records found
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Pagination */}
//       <TablePagination
//         rowsPerPageOptions={rowsPerPageOptions}
//         component="div"
//         count={filteredData.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         sx={{
//           '& .MuiTablePagination-select': {
//             fontSize: '14px',
//           },
//           '& .MuiTablePagination-displayedRows': {
//             fontSize: '14px',
//           }
//         }}
//       />
//     </Paper>
//   );
// };

// export default AdminTable;



// src/components/AdminTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, // ✅ Import TableRow
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  Box
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const AdminTable = ({
  columns,
  data,
  renderRow, // This should return a TableRow component
  searchTerm,
  onSearchChange,
  rowsPerPageOptions = [5, 10, 25],
  initialRowsPerPage = 10
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(initialRowsPerPage);

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
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      {/* Search Bar */}
      <Box sx={{ p: 2, pb: 0 }}>
        <TextField
          fullWidth
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: '#fff',
            '& .MuiOutlinedInput-root': {
              borderRadius: '4px',
              '& fieldset': {
                borderColor: '#e0e0e0',
              },
            },
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="admin table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{ 
                    fontWeight: 600, 
                    color: '#555', 
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.5px'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map(renderRow) // ✅ renderRow should return <TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '& .MuiTablePagination-select': {
            fontSize: '14px',
          },
          '& .MuiTablePagination-displayedRows': {
            fontSize: '14px',
          }
        }}
      />
    </Paper>
  );
};

export default AdminTable;