import { NextFunction, Request, Response } from "express";

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res
    .status(401)
    .json({ message: "User not authenticated", error: true });
}
