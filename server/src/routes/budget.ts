import { Router, Request, Response } from "express";
import { Budget, Month } from "../models/budgetModel";
import { bugetValidation } from "../middleware/validationMiddleware/budgetValidation";
import { matchedData, validationResult } from "express-validator";
import { Transaction } from "../models/transactionModel";

const router = Router();

export const getLastSixMonthsData = async (req: Request, res: Response) => {
  try {
    // Get current date and date 6 months ago
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
    const currentMonthIndex = currentDate.getMonth();
    const getMonthName = (date: Date): Month => {
      const monthName = date.toLocaleString("default", { month: "long" });
      return Month[monthName.toUpperCase() as keyof typeof Month];
    };

    const monthValues = Object.values(Month); // Get all enum values as an array
    const currentMonthName = monthValues[currentMonthIndex];
    // Get budgets for last 6 months
    const budgets = await Budget.aggregate([
      {
        $match: {
          month: {
            $in: Array.from({ length: 6 }, (_, i) => {
              const date = new Date();
              date.setMonth(currentDate.getMonth() - i);
              return getMonthName(date);
            }),
          },
        },
      },
      {
        $lookup: {
          from: "transactioncategories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: {
            month: "$month",
            category: "$category.name",
          },
          budgetAmount: { $sum: "$amount" },
        },
      },
    ]);

    // Get transactions for last 6 months
    const transactions = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: sixMonthsAgo,
            $lte: currentDate,
          },
        },
      },
      {
        $lookup: {
          from: "transactioncategories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          amount: 1,
          category: "$category.name",
          month: {
            $let: {
              vars: {
                monthNames: Object.values(Month),
              },
              in: {
                $arrayElemAt: [
                  "$$monthNames",
                  { $subtract: [{ $month: "$date" }, 1] },
                ],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            month: "$month",
            category: "$category",
          },
          transactionAmount: { $sum: "$amount" },
        },
      },
    ]);

    const budgetData = await Budget.find({ month: currentMonthName }).populate(
      "category",
      "name"
    );

    // Combine and format the results
    const monthsData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      return getMonthName(date);
    }).map((month) => {
      const monthBudgets = budgets.filter((b) => b._id.month === month);
      const monthTransactions = transactions.filter(
        (t) => t._id.month === month
      );

      const categories = [
        ...new Set([
          ...monthBudgets.map((b) => b._id.category),
          ...monthTransactions.map((t) => t._id.category),
        ]),
      ];

      return {
        month,
        categories: categories.map((category) => ({
          name: category,
          budgetAmount:
            monthBudgets.find((b) => b._id.category === category)
              ?.budgetAmount || 0,
          transactionAmount:
            monthTransactions.find((t) => t._id.category === category)
              ?.transactionAmount || 0,
        })),
      };
    });

    return res.status(200).json({
      success: true,
      data: { monthsData, budgetData },
    });
  } catch (error) {
    console.error("Error fetching budget and transaction data:", error);
    return res.status(500).json({
      success: false,
      error: "Error fetching budget and transaction data",
    });
  }
};

router.get("/", async (req: Request, res: Response) => {
  await getLastSixMonthsData(req, res);
});

router.post("/", bugetValidation, async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    console.log("Validation error: " + result.array());
    res
      .status(400)
      .json({ msg: "Error during validation", err: result.array() });
    return;
  }

  try {
    const { amount, category, description, month } = matchedData(req);

    // Check if a budget already exists for the same month and category
    const existingBudget = await Budget.findOne({ month, category });

    if (existingBudget) {
      console.log("Budget already exists for this month and category");
      res
        .status(400)
        .json({ msg: "Budget already exists for this month and category" });
      return;
    }

    // Create a new budget entry
    const newBudget = new Budget({
      amount,
      category,
      description,
      month,
    });

    const savedBudget = await newBudget.save();
    const populatedBudget = await savedBudget.populate("category", "name");

    res.status(201).json({ msg: "Success", populatedBudget });
  } catch (err: any) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.put("/:id", bugetValidation, async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    console.log("Validation error: " + result.array());
    res
      .status(400)
      .json({ msg: "Error during validation", err: result.array() });
    return;
  }
  try {
    const { amount, category, description, month } = matchedData(req);

    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      { amount, category, description, month },
      { new: true }
    ).populate("category", "name");

    if (!updatedBudget) {
      console.log("Budget not found");
      res.status(404).json({ msg: "Budget not found" });
      return;
    }

    res.status(201).json({ msg: "Success", updatedBudget });
  } catch (err: any) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedBudget = await Budget.findByIdAndDelete(req.params.id);

    if (!deletedBudget) {
      console.log("Budget not found");
      res.status(404).json({ msg: "Budget not found" });
      return;
    }

    res.status(200).json({ msg: "Budget deleted successfully", deletedBudget });
  } catch (err: any) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default router;
