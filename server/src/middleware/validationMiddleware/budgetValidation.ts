import { checkSchema } from "express-validator";
import { Month } from "../../models/budgetModel";

export const bugetValidation = checkSchema({
  amount:{
    in: ['body'],
    notEmpty: {
      errorMessage: "Amount cannot be empty",
    },
    isNumeric: {
      errorMessage: "Amount must be a number!",
    },
  },
  description:{
    in: ['body'],
    notEmpty: {
      errorMessage: "Description cannot be empty",
    },
    isString: {
      errorMessage: "Description must be a string!",
    },
  },
  month: {
    in: ['body'],
    notEmpty: {
      errorMessage: "Month cannot be empty",
    },
    isIn: {
      options: [Object.values(Month)],
      errorMessage: `Month must be one of the following: ${Object.values(Month).join(', ')}`,
    },
  },
  category: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Category ID cannot be empty",
    },
    isMongoId: {
      errorMessage: "Invalid category ID format!",
    },
  },
})