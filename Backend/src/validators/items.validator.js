import { body, validationResult } from "express-validator";

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export const createItemValidator = [
  body("url").isURL().withMessage("Please enter a valid URL"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("tags")
    .isArray()
    .isLength({ max: 15 })
    .withMessage("Tags must be an array")
    .toLowerCase(),
  validate,
];
