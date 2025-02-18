"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category } from "@/types";
import { Input } from "../ui/input";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { transactionSchema } from "./transactionFormSchema";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface AddTransactionProps {
  mutate?: () => void;
}
type CategoryListResponse = {
  categories?: Category[];
  msg: string;
};
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const AddTransaction: React.FC<AddTransactionProps> = ({ mutate }) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      description: "",
      category: "",
      date: new Date(),
    },
  });
  const onSubmit = async (values: z.infer<typeof transactionSchema>) => {
    setIsSaving(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/transaction`, {
        ...values,
      });
      mutate?.();
      setAddDialogOpen(false);
      form.reset();
    } catch (err) {
      console.error("Error deleting transaction:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const {
    data: categoryData,

  } = useSWR<CategoryListResponse>(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/category`,
    fetcher
  );

  return (
    <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          Add Transaction <Plus className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Enter details for the new transaction
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Amount Field */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter amount"
                      {...field}
                      value={field.value === 0 ? "" : field.value} // Show empty field when amount is 0
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : parseFloat(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      {categoryData?.categories &&
                      categoryData.categories.length > 0 ? (
                        <SelectContent>
                          {categoryData.categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No categories available
                        </p>
                      )}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="pl-3 text-left font-normal"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Buttons */}
            <DialogFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransaction;
