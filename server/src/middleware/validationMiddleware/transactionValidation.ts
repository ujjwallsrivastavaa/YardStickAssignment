import { checkSchema } from 'express-validator';






export const transactionValidation = checkSchema({
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
  date: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Date cannot be empty",
    },
    isISO8601: { 
      errorMessage: "Date must be a valid ISO date!",
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