"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Category, Transaction } from "@/types";
import TransactionColumnAction from "./TransactionColumnAction";

export const getTransactionColumns = (mutate: () => void , categories : Category[]): ColumnDef<Transaction>[] => [
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => <span>₹ {row.getValue("amount")}</span>
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => <span>{row.original.category.name}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <span>{row.getValue("description")}</span>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span>{new Date(row.getValue("date")).toLocaleDateString()}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <TransactionColumnAction data={row.original} mutate={mutate} categories={categories}/>
    ),
  },
];