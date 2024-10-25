import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { ensureAuthenticated, Routes } from "@dmehra2102-microservices-/bookbazaar-common";

class AuthRoute implements Routes {
  public path = "/auth";
  public router: Router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.authController.login);
    this.router.post(`${this.path}/register`, this.authController.register);
    this.router.post(`${this.path}/logout`, ensureAuthenticated, this.authController.logout);
    this.router.get(`${this.path}/user-detail`, ensureAuthenticated, this.authController.getUserDetail);
  }
}

export { AuthRoute };
