import { Skeleton, TableCell, TableRow } from "@mui/material";
import React from "react";

const TableSkeleton = ({
  row = 3,
  column = 4,
}: {
  row?: number;
  column?: number;
}) => {
  return (
    <>
      {Array.from({ length: row }).map((a, i) => (
        <TableRow key={i}>
          {Array.from({ length: column }).map((b, j) => (
            <TableCell key={j} align="center">
              <Skeleton animation="wave" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
