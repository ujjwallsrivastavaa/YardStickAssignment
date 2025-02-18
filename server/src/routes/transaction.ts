import { Router,Request,Response } from "express";
import { Transaction } from "../models/transactionModel";
import { TransactionCategory } from "../models/transactionCategoryModel";
import { transactionValidation } from "../middleware/validationMiddleware/transactionValidation";
import { matchedData, validationResult } from "express-validator";

const router = Router();


router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id).populate("category", "name");

    if (!transaction) {
      res.status(404).json({ msg: "Transaction not found" });
      return;
    }

    res.status(200).json({transaction,msg:"Success"}); 
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({msg:"Server Error"});
  }
});

router.delete("/:id", async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    
    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      res.status(404).json({ msg: "Transaction not found" });
      return
    }

    res.status(200).json({ msg: "Transaction deleted successfully" });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.put("/:id", transactionValidation, async (req: Request, res: Response) => {
  const result = validationResult(req);
 
  if (!result.isEmpty()) {
    console.log("Validation error: " + result.array());
    res.status(400).json({ msg: "Error during validation", err: result.array() });
    return
  }

  try {
    const { amount, category, description, date } = matchedData(req);

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { amount, category, description, date },
      { new: true }
    ).populate("category", "name");

    if (!updatedTransaction) {
      console.log("Transaction not found")
      res.status(404).json({ msg: "Transaction not found" });
      return
    }

    res.status(200).json({ msg: "Transaction updated successfully", updatedTransaction });
  } catch (err: any) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


router.post("/",transactionValidation, async (req:Request, res:Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res
    .status(400)
    .send({ msg: "Error during validation", err: result.array() });

    return;
  }
  try {
    const { amount, category, description, date } = matchedData(req);


    const newTransaction = new Transaction({
      amount,
      category,
      description,
      date,
    });

    const savedTransaction = await newTransaction.save();
    
   
    const populatedTransaction = await savedTransaction.populate("category", "name");

    res.status(201).json({msg:"Success",populatedTransaction}); 
  } catch (err: any) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default router;