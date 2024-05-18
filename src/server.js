import http from "http";
import { errorHandler } from "./errors/handler.js";
import { routes } from "./routes.js";

const app = http
  .createServer((request, response) => {
    routes(request, response).catch((err) =>
      errorHandler(err, request, response)
    );
  })
  .listen(8080)
  .on("listening", () => console.log("Server running at 8080"));

export { app };
