import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { UserRequest } from "../interfaces/userRequest.interface";

export function ensureAuthenticated(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }

  throw new NotAuthorizedError("User not authorized.");
}
