import hpp from "hpp";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import compression from "compression";
import session from "express-session";
import { connect, set } from "mongoose";
import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import ConnectMongoDBSession from "connect-mongodb-session";
import { COOKIE_DOMAIN, MONGODB_URI, NODE_ENV, PORT, SESSION_SECRET } from "@/config/env.config";
import { errorMiddleware, Routes } from "@dmehra2102-microservices-/bookbazaar-common";

const MongodbSessionStore = ConnectMongoDBSession(session);

class App {
  private store: any;
  private env: string;
  public app: Application;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 3000;
    this.store = new MongodbSessionStore({ uri: process.env.MONGODB_URI, collection: "userSession" }, function (error) {
      if (error) {
        console.log(`MongodbSessionStore error while connection with mongodb :`, error);
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
        console.info("DB connection established");
      })
      .catch(error => {
        console.error(error);
        process.exit(1);
      });
  }

  private initializeMiddleware() {
    this.app.use(morgan("combined"));
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
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: this.store,
        cookie: {
          domain: COOKIE_DOMAIN,
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
      console.info(`=================================`);
      console.info(`======= ENV: ${this.env} =======`);
      console.info(`🚀 🚀 Knock knock, who's there? It's your http server, listening on port ${this.port}! 🚀 🚀`);
      console.info(`=================================`);
    });
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use("/", route.router);
    });
  }

  private initializeErrorHandling() {
    // this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    //   errorMiddleware(err, req, res, next);
    // });
    this.app.use(errorMiddleware);
  }
}

export { App };
