import { NextFunction, Response } from "express";
import { UserRequest } from "@dmehra2102-microservices-/bookbazaar-common";

class BookController {
  public createBook = async (req: UserRequest, res: Response, next: NextFunction) => {};

  public updateBook = async (req: UserRequest, res: Response, next: NextFunction) => {};

  public getBooks = async (req: UserRequest, res: Response, next: NextFunction) => {};

  public getBook = async (req: UserRequest, res: Response, next: NextFunction) => {};

  public deleteBook = async (req: UserRequest, res: Response, next: NextFunction) => {};
}

export { BookController };
