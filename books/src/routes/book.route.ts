import { Router } from "express";
import { BookController } from "@/controllers/book.controller";
import { ensureAuthenticated, Routes } from "@dmehra2102-microservices-/bookbazaar-common";

class BookRoutes implements Routes {
  public path = "/book";
  public router: Router = Router();
  public bookController = new BookController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get("/all", ensureAuthenticated, this.bookController.getBooks);
    this.router.get("/:bookId", ensureAuthenticated, this.bookController.getBook);
    this.router.post("/create", ensureAuthenticated, this.bookController.createBook);
    this.router.patch("/update/:bookId", ensureAuthenticated, this.bookController.updateBook);
    this.router.delete("/delete/:bookId", ensureAuthenticated, this.bookController.deleteBook);
  }
}

export { BookRoutes };
