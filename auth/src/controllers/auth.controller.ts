import passport from "passport";
import { User } from "@/models/user.model";
import { NextFunction, Request, Response } from "express";
import { RegisterUserInput, UserDocument } from "@/interfaces/user.interface";
import { NotFoundError, UserRequest, UserRole } from "@dmehra2102-microservices-/bookbazaar-common";

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

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        email,
        password,
        city,
        address,
        age,
        qualification,
        isDeactivated = false,
        notifications = [],
        whishlist = [],
        userRole = UserRole.USER,
      }: RegisterUserInput = req.body;
      const existingUser = await User.exists({ email });
      if (existingUser) {
        return res.status(400).send({ error: true, message: "User already exists with the same email." });
      }

      const newUser = User.build({
        address,
        age,
        city,
        name,
        email,
        password,
        qualification,
        isDeactivated,
        notifications,
        whishlist,
        userRole,
      });
      await newUser.save();

      return res.status(201).send({ data: { name: newUser.name, email: newUser.email } });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      req.logOut(function (err) {
        if (err) {
          return next(err);
        }
        res.status(200).clearCookie("user-auth-cookie", {
          domain: process.env.COOKIE_DOMAIN,
        });

        req.session.destroy(function (err) {
          if (err) return next(err);

          return res.status(200).send({ success: true, message: "Logged out successfully" });
        });
      });
    } catch (error) {
      return next(error);
    }
  };

  public getUserDetail = async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.user;
      const existingUser = await User.findById(id, "name email userRole").lean().exec();

      if (!existingUser) throw new NotFoundError("User not found.").serializeErrors();

      return res.status(200).send({ success: true, data: existingUser });
    } catch (error) {
      return next(error);
    }
  };
}

export { AuthController };
