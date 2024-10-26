import { Request } from "express";
import { UserRole } from "../enums/userRole.enum";

interface UserPayload {
  id: string;
  email: string;
  userRole: UserRole;
}

export interface UserRequest extends Request {
  user?: Partial<UserPayload>;
}
