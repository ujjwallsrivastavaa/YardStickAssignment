import { Router, Request, Response } from "express";
import { Budget, Month } from "../models/budgetModel";
import { Transaction } from "../models/transactionModel";

const router = Router();

export const getLastSixMonthsData = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
    const currentMonthIndex = currentDate.getMonth();
    const getMonthName = (date: Date): Month => {
      const monthName = date.toLocaleString("default", { month: "long" });
      return Month[monthName.toUpperCase() as keyof typeof Month];
    };

    const monthValues = Object.values(Month);
    const currentMonthName = monthValues[currentMonthIndex];

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

    const transactionData = await Transaction.find()
      .sort({ date: -1 }) // Sort by date in descending order (latest first)
      .limit(5) // Get the latest 5 transactions
      .populate("category", "name"); // Populate category name

    const monthsData = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      return getMonthName(date);
    }).map((month) => {
      const monthTransactions = transactions.filter(
        (t) => t._id.month === month
      );

      const categories = [
        ...new Set([...monthTransactions.map((t) => t._id.category)]),
      ];

      return {
        month,
        categories: categories.map((category) => ({
          name: category,

          transactionAmount:
            monthTransactions.find((t) => t._id.category === category)
              ?.transactionAmount || 0,
        })),
      };
    });

    return res.status(200).json({
      success: true,
      data: { monthsData, budgetData, transactionData },
    });
  } catch (error) {
    console.error("Error fetching budget and transaction data:", error);
    return res.status(500).json({
      success: false,
      error: "Error fetching budget and transaction data",
    });
  }
};

router.get("/", async (req, res) => {
  await getLastSixMonthsData(req, res);
});

export default router;
