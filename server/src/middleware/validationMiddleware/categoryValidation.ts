import { checkSchema } from "express-validator";

export const categoryValidation = checkSchema({
  name: {
    in: ['body'],
    notEmpty: {
      errorMessage: "Name cannot be empty",
    },
    isString: {
      errorMessage: "Name must be a string!",
    },
  }
})