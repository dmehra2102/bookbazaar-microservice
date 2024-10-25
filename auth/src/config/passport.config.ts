import { PassportStatic } from "passport";
import { User } from "@/models/user.model";
import { isPasswordMatched } from "@/utils/helper";
import { UserDocument } from "@/interfaces/user.interface";
import { Strategy as LocalStrategy } from "passport-local";

export function passportConfig(passport: PassportStatic) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      const existingUser = await User.findOne({ email }, "isDeactivated password");

      if (!existingUser) {
        return done("Email or Password is inconnect", false);
      }

      if (existingUser && existingUser.isDeactivated) {
        return done("User is deactivated. please try with some other account", false);
      }

      const isCorrectPassword = await isPasswordMatched(password, existingUser.password);
      if (!isCorrectPassword) {
        return done("Email or Password is incorrect", false);
      }

      return done(null, existingUser);
    }),
  );

  passport.serializeUser(function (user: UserDocument, done) {
    return done(null, user.id);
  });

  passport.deserializeUser(async function (id: string, done) {
    try {
      const user = await User.findById(id, "email userRole").lean().exec();
      if (!user) return done("User not found!", false);
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  });
}
