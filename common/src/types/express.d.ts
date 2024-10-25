import * as express from "express";
import { UserRole } from "../enums/userRole.enum";

interface UserPayload {
  id: string;
  email: string;
  userRole: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      isAuthenticated(): boolean;
    }
  }
}
