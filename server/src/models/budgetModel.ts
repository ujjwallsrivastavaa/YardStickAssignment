import mongoose, { Document, Schema } from "mongoose";


export enum Month {
  JANUARY = "January",
  FEBRUARY = "February",
  MARCH = "March",
  APRIL = "April",
  MAY = "May",
  JUNE = "June",
  JULY = "July",
  AUGUST = "August",
  SEPTEMBER = "September",
  OCTOBER = "October",
  NOVEMBER = "November",
  DECEMBER = "December",
}


export interface IBudget extends Document {
  amount: number;
  category: mongoose.Types.ObjectId;
  description: string;
  month: Month;
}

const BudgetSchema = new Schema<IBudget>({
  amount: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TransactionCategory",
    required: true,
  },
  description: { type: String, required: true },
  month: {
    type: String,
    enum: Object.values(Month),
    required: true,
  },
});


export const Budget = mongoose.model<IBudget>("Budget", BudgetSchema);
