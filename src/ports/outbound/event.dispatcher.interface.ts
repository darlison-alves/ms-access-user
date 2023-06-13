import { EventApplication } from "src/domain/events/event.application";

export interface IEventDispatcher {
    publish(eventApplication: EventApplication): Promise<void>;
}