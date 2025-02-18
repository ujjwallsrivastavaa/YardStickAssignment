import {Response, Router,Request} from 'express';
import { categoryValidation } from '../middleware/validationMiddleware/categoryValidation';
import { matchedData, validationResult } from 'express-validator';
import { TransactionCategory } from '../models/transactionCategoryModel';

const router = Router();

router.get("/", async(req, res) => {
  try{
    const categories =await TransactionCategory.find();
    res.status(200).json({categories,msg:"Success"});
  }catch(err){
    console.error(err);
    res.status(500).json({msg:"Server Error"});
  }
})

router.post("/",categoryValidation, async (req:Request, res:Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res
    .status(400)
    .send({ msg: "Error during validation", err: result.array() });

    return;
  }
  try{

    const {name} = matchedData(req);

    const category = new TransactionCategory({name: name});
    
    await category.save();
    res.status(201).json({msg:"Category created",data:category})
  }
  catch(err:any){
    
    res.status(500).json({msg:"Internal Server Error"})
  }
})

export default router;


