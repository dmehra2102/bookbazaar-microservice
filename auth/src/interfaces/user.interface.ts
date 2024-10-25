import mongoose from "mongoose";
import { UserRole } from "@dmehra2102-microservices-/bookbazaar-common";

export interface UserAttrs {
  name: string;
  age: string;
  qualification: string;
  address: string;
  city: string;
  userRole: UserRole;
  email: string;
  password: string;
  notifications: string[];
  whishlist: string[];
  isDeactivated: boolean;
}

export interface UserDocument extends mongoose.Document, UserAttrs {}

export interface UserModelInterface extends mongoose.Model<UserAttrs> {
  build(attrs: UserAttrs): UserDocument;
}
