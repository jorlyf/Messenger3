export default class Events {
  private static publishEvent(eventType: EventTypes, data?: any) {
    const event = new CustomEvent(eventType, { detail: data });
    document.dispatchEvent(event);
  }
}

export enum EventTypes {
  OnSendMessage = "OnSendMessage"
}