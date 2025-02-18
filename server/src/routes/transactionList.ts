import { Router } from "express";
import { Transaction } from "../models/transactionModel";
import { TransactionCategory } from "../models/transactionCategoryModel";
import mongoose from "mongoose";


const router = Router();
router.get("/", async (req, res) => {
  try {
    const { search, category, page = "1", limit = "10" } = req.query;

    const filter: any = {};

    if (search) {
      filter.description = { $regex: search, $options: "i" }; 
    }

    if (category) {
      filter.category = new mongoose.Types.ObjectId(category as string);
    }

 
    const pageNumber = Math.max(1, parseInt(page as string, 10)); 
    const limitNumber = Math.max(1, parseInt(limit as string, 10)); 

    const transactionList = await Transaction.find(filter)
      .populate("category", "name")
      .sort({ date: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalCount = await Transaction.countDocuments(filter); // Get total records

    res.status(200).json({
      transactionList,  
      totalPages: Math.ceil(totalCount / limitNumber),
      currentPage: pageNumber,
      totalRecords: totalCount,
      msg: "Success"
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});


export default router;