import * as express from "express";
import { UserRole } from "../enums/userRole.enum";

declare global {
  namespace Express {
    interface Request {
      isAuthenticated(): boolean;
    }
  }
}
