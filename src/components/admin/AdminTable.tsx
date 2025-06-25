import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface Column<T extends { id: string | number }> {
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  cellClassName?: string;
  headerClassName?: string;
}

interface AdminTableProps<T extends { id: string | number }> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: React.ReactNode;
  containerClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
}

function AdminTable<T extends { id: string | number }>(
  props: AdminTableProps<T>
) {
  const {
    columns,
    data,
    emptyMessage = "No data found.",
    containerClassName = "border-2 border-purple-200 rounded-2xl shadow-lg overflow-hidden bg-white/95 mb-6",
    headerClassName = "bg-gradient-to-r from-purple-100/80 to-blue-100/60",
    rowClassName = "hover:bg-gradient-to-r hover:from-purple-50/60 hover:to-blue-50/40 transition-colors group",
  } = props;

  return (
    <div className={containerClassName}>
      <Table>
        <TableHeader className={headerClassName}>
          <TableRow>
            {columns.map((col, i) => (
              <TableHead
                key={i}
                className={
                  "py-4 px-6 text-base font-bold text-foreground tracking-wide " +
                  (col.headerClassName || "")
                }
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-8 text-social-muted"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id} className={rowClassName}>
                {columns.map((col, i) => (
                  <TableCell
                    key={i}
                    className={col.cellClassName || "py-4 px-6 align-top"}
                  >
                    {typeof col.accessor === "function"
                      ? col.accessor(row)
                      : String(row[col.accessor as keyof T])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminTable;
