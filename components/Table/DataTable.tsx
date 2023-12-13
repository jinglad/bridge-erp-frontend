import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import TableSkeleton from "./TableSkeleton";
import { IColumn, IPaginationOptions } from "../../interfaces/common";

interface ITable {
  isLoading: boolean;
  rows: any[];
  columns: IColumn[];
  total?: number;
  pagination: boolean;
  paginationOptions?: IPaginationOptions;
}

const DataTable = ({
  isLoading,
  rows,
  columns,
  total,
  pagination,
  paginationOptions,
}: ITable) => {
  const { page, limit, handleChangePage, handleChangePageSize } =
    paginationOptions || {};
  return (
    <>
      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              {columns.map((column: IColumn) => (
                <TableCell
                  key={column.field}
                  sx={{ fontWeight: 600 }}
                  align={`${column?.align || "center"}`}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableSkeleton row={5} column={columns.length || 3} />
            ) : (
              <>
                {Number(total) <= 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      align="center"
                      sx={{ py: 20, fontSize: 20 }}
                    >
                      No Data Found
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {rows?.map((row: any) => {
                      return (
                        <TableRow
                          key={row._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          {columns.map((column: IColumn) => (
                            <TableCell
                              key={column.field}
                              align={`${column?.align || "center"}`}
                            >
                              {column.render
                                ? column.render(row)
                                : row[column.field]}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePagination
          component="div"
          count={total || 0}
          page={page || 0}
          onPageChange={handleChangePage || (() => {})}
          rowsPerPage={limit || 10}
          onRowsPerPageChange={handleChangePageSize}
          rowsPerPageOptions={[limit!, 10, 30, 50]}
          labelRowsPerPage="Data per page:"
          sx={{
            display: Number(total) > limit! ? "block" : "none",
          }}
        />
      )}
    </>
  );
};

export default DataTable;
