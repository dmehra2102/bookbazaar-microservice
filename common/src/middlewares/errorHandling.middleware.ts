import { logger } from "../utils/logger";
import { CustomError } from "../errors/custom-error";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (error instanceof CustomError) {
      res.status(error.statusCode).send({ errors: error.serializeErrors() });
    }

    logger.error(`[${req.method}] ${req.path} >> Message : ${error}`);
    return res.status(400).send({
      errors: [{ message: "Something went wrong" }],
    });
  } catch (error) {
    return res.status(500).send({
      errors: [
        {
          message: " Internal Server Error",
        },
      ],
    });
  }
};
