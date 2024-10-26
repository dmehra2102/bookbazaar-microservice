import passport from "passport";
import { User } from "@/models/user.model";
import { NextFunction, Request, Response } from "express";
import { UserDocument } from "@/interfaces/user.interface";
import { UserRequest } from "@dmehra2102-microservices-/bookbazaar-common";

class AuthController {
  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      passport.authenticate("local", function (err: Error, user: UserDocument) {
        if (err || !user) {
          return res.status(400).send({ error: true, message: err || "Fields missing!" });
        }

        req.logIn(user, function (err) {
          if (err) next(err);

          return res.status(200).json({
            message: "Login successfull",
            success: true,
          });
        });
      })(req, res, next);
    } catch (error) {
      return next(error);
    }
  };

  public register = async () => {};

  public logout = async () => {};

  public getUserDetail = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      const existingUser = await User.findById(id, "user email userRole").lean().exec();

      if (!existingUser) return res.status(404).send({ error: true, message: "User not found" });

      return res.status(200).send({ success: true, data: existingUser });
    } catch (error) {
      return next(error);
    }
  };
}

export { AuthController };
