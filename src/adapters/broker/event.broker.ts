import { Inject, Injectable } from "@nestjs/common";
import { IAmqpConnectionManager } from "amqp-connection-manager/dist/esm/AmqpConnectionManager";
import { EventApplication } from "src/domain/events/event.application";
import { IEventDispatcher } from "src/ports/outbound/event.dispatcher.interface";


@Injectable()
export class EventBroker implements IEventDispatcher {

    constructor(
        @Inject('conn-amqp') private readonly cli: IAmqpConnectionManager) {}

    async publish(eventApplication: EventApplication): Promise<void> {
        const ch = this.cli.createChannel({ json: true });
        await ch.publish('eduq-cursos', eventApplication.pattern, eventApplication)
        await ch.close();
        return;
    }

}