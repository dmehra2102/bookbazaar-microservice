import { UserRole } from "../enums/userRole.enum";
import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors/not-authorized-error";
import { UserRequest } from "../interfaces/userRequest.interface";

const authorizedRoles = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

export function ensureAuthorized(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  if (
    req.user &&
    req.user?.userRole &&
    authorizedRoles.includes(req.user.userRole)
  ) {
    return next();
  }

  throw new NotAuthorizedError();
}
