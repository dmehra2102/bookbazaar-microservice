import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { AuthValidator } from "@/input-validator/authValidator";
import { ensureAuthenticated, Routes, validateRequestMiddleware } from "@dmehra2102-microservices-/bookbazaar-common";

class AuthRoute implements Routes {
  public path: string = "/auth";
  public router: Router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, AuthValidator.login(), validateRequestMiddleware, this.authController.login);
    this.router.post(`${this.path}/register`, AuthValidator.register(), validateRequestMiddleware, this.authController.register);
    this.router.post(`${this.path}/logout`, ensureAuthenticated, this.authController.logout);
    this.router.get(`${this.path}/user-detail`, ensureAuthenticated, this.authController.getUserDetail);
  }
}

export { AuthRoute };
