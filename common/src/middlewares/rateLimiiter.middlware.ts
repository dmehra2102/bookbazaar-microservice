import { createClient } from "redis";
import { logger } from "../utils/logger";
import { RedisStore } from "rate-limit-redis";
import { rateLimit } from "express-rate-limit";
import { NextFunction, Request, Response } from "express";

export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const client = await createClient()
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      store: new RedisStore({
        sendCommand: (...args: string[]) => client.sendCommand(args),
      }),
    });

    return limiter;
  } catch (error) {
    logger.error(`RateLimiterMiddleware Error: ${error}`);
  }
};
