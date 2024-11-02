import { App } from "./app";
import { BookRoutes } from "@/routes/book.route";

const app = new App([new BookRoutes()]);

app.listen();
