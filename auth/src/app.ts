import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import compression from "compression";
import session from "express-session";
import { connect, set } from "mongoose";
import cookieParser from "cookie-parser";
import express, { Application } from "express";
import { NODE_ENV, PORT } from "@/config/env.config";
import { passportConfig } from "@/config/passport.config";
import ConnectMongoDBSession from "connect-mongodb-session";
import { errorMiddleware, logger, Routes, stream } from "@dmehra2102-microservices-/bookbazaar-common";

passportConfig(passport);
const MongodbSessionStore = ConnectMongoDBSession(session);

class App {
  public store: ConnectMongoDBSession.MongoDBStore;
  public env: string;
  public app: Application;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 3000;
    this.store = new MongodbSessionStore({ uri: process.env.MONGODB_URI, collection: "userSession" }, function (error) {
      if (error) {
        logger.log(`MongodbSessionStore error while connection with mongodb :`, error);
      }
    });
    this.connectToDatabase();
    this.initializeMiddleware();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  private connectToDatabase() {
    if (this.env !== "production") {
      set("debug", false);
    }

    connect(process.env.MONGODB_URI)
      .then(() => {
        logger.info("DB connection established");
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
    this.app.use(cookieParser());
    this.app.use(
      session({
        name: "user-auth-cookie",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: this.store,
        cookie: {
          domain: process.env.COOKIE_DOMAIN,
          sameSite: "lax",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: false,
          secure: false,
        },
      }),
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 🚀 Knock knock, who's there? It's your http server, listening on port ${this.port}! 🚀 🚀`);
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
