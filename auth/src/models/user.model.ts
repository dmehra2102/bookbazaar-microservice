import { model, Schema } from "mongoose";
import { UserRole } from "@dmehra2102-microservices-/bookbazaar-common";
import { UserAttrs, UserDocument, UserModelInterface } from "@/interfaces/user.interface";

const userSchema = new Schema<UserDocument, UserModelInterface>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    qualification: { type: String, required: true },
    userRole: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
    notifications: { type: [{ type: String }], default: [] },
    whishlist: { type: [{ type: String }], default: [] },
    isDeactivated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = model<UserDocument, UserModelInterface>("User", userSchema);
export { User };
