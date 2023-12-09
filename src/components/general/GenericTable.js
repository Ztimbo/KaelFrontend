import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';

import { getHeaders } from '../../helpers/getTableHeadersTitle';
import './GenericTable.scss'
import { Link } from 'react-router-dom';
import { TablePagination } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#3FC5F2',
      color: theme.palette.common.white,
      fontSize: 15
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 15
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.common.white,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const GenericTable = ({tableHeaders, tableHeadersAliases, tableData, isOrdersTable}) => {
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('');
    const [orderBy, setOrderBy] = useState('');

    const customHeaders = getHeaders(tableHeaders, tableHeadersAliases);

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const visibleRows = useMemo(
      () =>
        stableSort(tableData, getComparator(order, orderBy))?.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage,
        ),
      [order, orderBy, page, rowsPerPage, tableData],
    );

    function stableSort(array, comparator) {
      if(!array[0]) return;
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
          return order;
        }
        return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
    }

    function getComparator(order, orderBy) {
      return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator(a, b, orderBy) {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    }

    const handleRequestSort = (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };

    const createSortHandler = (property) => (event) => {
      handleRequestSort(event, property);
    };

    return(
      <>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                <TableRow>
                    {customHeaders.length > 0 && customHeaders.map(header => {
                      if(header.name !== '_id') {
                        return(
                          <StyledTableCell align="right" sortDirection={orderBy === header.alias ? order : false} >
                            <TableSortLabel
                              active={orderBy === header.name}
                              direction={orderBy === header.name ? order : 'asc'}
                              onClick={createSortHandler(header.name)}
                            >
                              {header.alias}
                              {orderBy === header.name ? (
                                <Box component="span" sx={visuallyHidden}>
                                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                          </StyledTableCell>
                        )
                      }
                    })}
                    <StyledTableCell align="right" className='add-new-item-cell'>
                      <Link to={'new'} className='add-new-item'>
                        <AddCircleIcon />
                      </Link>
                    </StyledTableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {visibleRows?.length > 0 && visibleRows.map((row) => (
                  <StyledTableRow>
                    {customHeaders.map(entity => {
                      if(entity.name !== '_id') {
                        return(
                          <StyledTableCell align="right">{row[entity.name]}</StyledTableCell>
                        );
                      }
                    })}
                    <StyledTableCell className='actions-table-cell' align="center">
                      <Link className='edit-record-button' to={`update/${row._id}`}>Editar</Link>
                      {
                        isOrdersTable && 
                          <Link className='actions-button'>Test</Link>
                      }
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination 
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tableData.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    );
}

export default GenericTable