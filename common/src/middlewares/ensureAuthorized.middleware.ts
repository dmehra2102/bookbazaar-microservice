import { UserRole } from "../enums/userRole.enum";
import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";

const authorizedRoles = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

export function ensureAuthorized(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user && authorizedRoles.includes(req.user.userRole)) {
    return next();
  }

  throw new NotAuthorizedError();
}
