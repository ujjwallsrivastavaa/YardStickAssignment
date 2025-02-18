"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import { useDebounce } from "use-debounce";
import { Search } from "lucide-react";
import TransactionsTable from "@/components/transactions/TransactionTable";
import { Category, Transaction } from "@/types";
import { Button } from "@/components/ui/button";
import TableSkeleton from "@/components/loading/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import AddTransaction from "@/components/transactions/AddTransaction";
import AddCategory from "@/components/AddCategory";

type TransactionListResponse = {
  transactionList?: Transaction[];
  totalPages?: number;
  currentPage?: number;
  totalRecords?: number;
  msg: string;
};

type CategoryListResponse = {
  categories?: Category[];
  msg: string;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const TransactionsList = () => {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const { data, error, isLoading, mutate } = useSWR<TransactionListResponse>(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/transactions-list?search=${debouncedSearch}&category=${category}&page=${page}&limit=${limit}`,
    fetcher
  );

  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryIsLoading,
    mutate: categoryMutate,
  } = useSWR<CategoryListResponse>(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`,
    fetcher
  );

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center flex-wrap">
        <div>
          <CardTitle className="text-3xl">Transactions</CardTitle>
          <CardDescription className="text-md">
            List of all transactions
          </CardDescription>
        </div>
        <div className="flex gap-2 flex-wrap">
          <AddTransaction mutate={mutate} />
          <AddCategory mutate={categoryMutate} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 mb-4"
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            className={`cursor-pointer ${
              category === "" ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => setCategory("")}
          >
            All
          </Badge>
          {categoryIsLoading ? (
            <p>Loading categories...</p>
          ) : categoryError ? (
            <p className="text-red-500">Failed to load categories</p>
          ) : (
            categoryData?.categories?.map((cat) => (
              <Badge
                key={cat._id}
                className={`cursor-pointer ${
                  category === cat._id ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => setCategory(cat._id)}
              >
                {cat.name}
              </Badge>
            ))
          )}
        </div>

        {isLoading ? (
          <TableSkeleton />
        ) : error ? (
          <p className="text-red-500 text-center py-4">
            Failed to load transactions.
          </p>
        ) : (
          <>
            <TransactionsTable
              transactions={data?.transactionList ?? []}
              mutate={mutate}
              categories={categoryData?.categories ?? []}
            />
            <div className="flex justify-between mt-4">
              <Button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span>
                Page {data?.currentPage} of {data?.totalPages}
              </span>
              <Button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={data?.currentPage === data?.totalPages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
