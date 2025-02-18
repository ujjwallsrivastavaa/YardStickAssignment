import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than zero"),
  description: z.string().min(1, "Description cannot be empty"),
  category: z.string().min(1, "Category ID cannot be empty"), 
  date: z.date() 
});
