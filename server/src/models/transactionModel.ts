import mongoose, { Document, Schema } from "mongoose";


export interface ITransaction extends Document {
  
  amount: number;
  category: mongoose.Types.ObjectId;
  description: string;
  date: Date;
}


const TransactionSchema = new Schema<ITransaction>({
 
  amount: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransactionCategory',
    required: true,
},
  description: { type: String, required: true },
  date: { type: Date, required: true }
});

export const Transaction = mongoose.model<ITransaction>("Transaction", TransactionSchema);