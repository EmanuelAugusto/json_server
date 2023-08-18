import http from "node:http";
import { CommandHandler } from "./CommandHandler.js";

export class Server {
  port = 8080;
  server = null;
  eventHandler = null;

  constructor(port = 8080, eventHandler) {
    this.port = port;

    if (!eventHandler) {
      throw new Error("event_handler_not_attached");
    }
    this.eventHandler = eventHandler;
  }

  validateIncomingHeadersRequest(req) {
    let statusCode = 200;
    let bodyResponse = { status: "ok" };

    if (req.method !== "POST") {
      statusCode = 405;
      bodyResponse.status = "method_not_allowed";
    }

    if (!req.headers["command"]) {
      statusCode = 400;
      bodyResponse.status = "command_not_informed";
    }

    return {
      statusCode,
      bodyResponse,
    };
  }

  validateIncomingBodyRequest(body) {
    let isValidPayload = true;

    try {
      JSON.parse(body.toString("utf8"));
    } catch (error) {
      console.log(error);
      isValidPayload = false;
    }

    return isValidPayload;
  }

  response(bodyResponse, statusCode, res) {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.write(JSON.stringify(bodyResponse));
    res.end();
  }

  handler(req, res) {
    let { bodyResponse, statusCode } = this.validateIncomingHeadersRequest(req);

    if (req.headers["command"]) {
      req.on("data", (data) => {
        const isValid = this.validateIncomingBodyRequest(data);

        if (isValid) {
          this.eventHandler.emit(req.headers["command"], data);
        }

        if (!isValid) {
          bodyResponse.status = "payload_not_valid";
          statusCode = 400;
        }
      });

      req.on("close", () => {
        console.log("closing_connection");
      });
    }

    this.response(bodyResponse, statusCode, res);
  }

  run() {
    this.server = http.createServer((req, res) => {
      this.handler(req, res);
    });

    return this;
  }

  handlerCommands() {
    return new CommandHandler(this.eventHandler);
  }

  listen() {
    this.server.listen(this.port);
    return this;
  }
}
