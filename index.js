import { EventHandler } from "./core/EventHandler.js";
import { CommandHandler } from "./core/CommandHandler.js";
import { Server } from "./core/Server.js";

const eventHandler = new EventHandler().commandHandler();

const server = new Server(8080, eventHandler).run().listen();

const newUser = (message) => {
  const body = JSON.parse(message.toString("utf8"));

  console.log("NEW_USER", body);
};

new CommandHandler(eventHandler).handler("newUser", newUser);
//or
server.handlerCommands().handler("newTest", () => {
  console.log({ foo: "bar" });
});
