import { logger } from "../utils/logger";
import { CustomError } from "../errors/custom-error";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  logger.error(`[${req.method}] ${req.path} >> Message : ${err}`);
  return res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
