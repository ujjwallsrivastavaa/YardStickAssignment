"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Budget, Category, Transaction } from "@/types";
import BudgetColumnActions from "./BudgetColumnActions";


export const getBudgetColumns = (mutate: () => void , categories : Category[]): ColumnDef<Budget>[] => [
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
    accessorKey: "month",
    header: "Month",
    cell: ({ row }) => <span>{row.getValue("month")}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <BudgetColumnActions data={row.original} mutate={mutate} categories={categories}/>
    ),
  },
];