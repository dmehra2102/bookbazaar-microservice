import { body, ValidationChain } from "express-validator";

export class AuthValidator {
  static login(): ValidationChain[] {
    return [
      body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Must be a valid email").normalizeEmail(),
      body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    ];
  }

  static register(): ValidationChain[] {
    return [
      ...this.login(),
      body("name")
        .trim()
        .notEmpty()
        .withMessage("name is required")
        .isLength({ min: 3 })
        .withMessage("name must be at least 3 characters long")
        .matches(/^[a-zA-Z][a-zA-Z\s'-]{0,48}[a-zA-Z]$/)
        .withMessage("name can only contain letters, numbers and underscore"),
    ];
  }
}
