import { EventHandler } from "./EventHandler.js";
import { CommandHandler } from "./CommandHandler.js";
import { Server } from "./Server.js";

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
