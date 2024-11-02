import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "dotenv";
import compression from "compression";
import { connect, set } from "mongoose";
import express, { Application } from "express";
import { errorMiddleware, logger, Routes, stream } from "@dmehra2102-microservices-/bookbazaar-common";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

class App {
  public env: string;
  public app: Application;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = process.env.NODE_ENV || "development";
    this.port = process.env.PORT || 3000;
    this.connectToDatabase();
    this.initializeMiddleware();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  private connectToDatabase() {
    if (this.env !== "production") {
      set("debug", false);
    }

    connect(process.env.MONGODB_URI!)
      .then(() => {
        logger.info("DB connection established for Order Service");
      })
      .catch(error => {
        console.error(error);
        process.exit(1);
      });
  }

  private initializeMiddleware() {
    this.app.use(morgan("combined", { stream }));
    this.app.use(
      cors({
        origin: [/localhost:/, /book-bazaar:/],
        credentials: true,
      }),
    );
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 🚀 Knock knock, who's there? It's your order service http server, listening on port ${this.port}! 🚀 🚀`);
      logger.info(`=================================`);
    });
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use("/", route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export { App };
