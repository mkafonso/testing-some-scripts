import { checkMetatagsHandler } from "./check-metatags/handler.js";

export async function routes(request, response) {
  if (request.method === "POST" && request.url === "/check-metatags") {
    return checkMetatagsHandler(request, response);
  }

  response.writeHead(404);
  response.send("Endpoint not found");
}
