import { Router } from "express"; 
import dashboardRoute from "./dashboard"
import transactionRoute from "./transaction"
import transactionListRoute from "./transactionList"
import budgetRoute from "./budget"
import categoryRoute from "./category"
const router = Router();


router.use("/",dashboardRoute);
router.use("/category",categoryRoute)
router.use("/transaction",transactionRoute);
router.use("/transactions-list",transactionListRoute); 
router.use("/budget",budgetRoute);


export default router