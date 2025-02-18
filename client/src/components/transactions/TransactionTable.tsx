"use client";

import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { getTransactionColumns } from "./TransactionColumns"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Category, Transaction } from "@/types";
import { useMemo } from "react";

interface TransactionsTableProps {
  transactions: Transaction[];
  mutate: () => void;  
  categories: Category[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, mutate, categories }) => {
  // Removed unused variables and fixed the dependency array
  const columns = useMemo(
    () => getTransactionColumns(mutate, categories),
    [mutate, categories] // Adding `categories` to dependencies
  );

  const table = useReactTable({
    data: transactions,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border rounded-lg shadow-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No transactions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable;
