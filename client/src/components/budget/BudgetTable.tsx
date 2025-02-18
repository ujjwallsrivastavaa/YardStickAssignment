"use client";

import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { getBudgetColumns } from "./BudgetColumns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Budget, Category, Transaction } from "@/types";
import { useMemo } from "react";
interface TransactionsTableProps {
  budget: Budget[];
 mutate: () => void;  
 categories : Category[];
}

const BudgetTable: React.FC<TransactionsTableProps> = ({ budget,mutate,categories }) => {
  const columns = useMemo(
    () => getBudgetColumns(mutate,categories),
    [mutate] 
  );

  const table = useReactTable({
    data: budget,
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

export default BudgetTable;
