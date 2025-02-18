import mongoose, { Document, Schema } from "mongoose";


export interface ITransactionCategory extends Document {
  name: string;
  
}


const TransactionCategorySchema = new Schema<ITransactionCategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
}
 
})

export const TransactionCategory = mongoose.model<ITransactionCategory>("TransactionCategory", TransactionCategorySchema);