export class CommandHandler {
  command = null;
  callback = (data) => {};
  eventHandler = null;

  constructor(eventHandler) {
    this.eventHandler = eventHandler;
  }

  handler(command, callback) {
    this.eventHandler.addListener(command, (data) => {
      callback(data);
    });
    return this;
  }
}
