import { Module, Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ChannelWrapper, connect } from "amqp-connection-manager";
import { UserUpdatedEvent } from "src/domain/events/user.updated.event";

const connAmqpProvider: Provider = {
    provide: 'conn-amqp',
    async useFactory() {
        try {
            const conn = await connect(['amqp://rabbitmq:rabbitmq@localhost:5672'], { connectionOptions: { rejectUnauthorized: true } });
            await conn.createChannel({
                json: true,
                async setup(channel: ChannelWrapper) {
                    await channel.assertExchange('eduq-cursos', 'direct');
                    await channel.assertQueue('ms-course');

                    await channel.bindQueue('ms-course', 'eduq-cursos', UserUpdatedEvent.name);
                },
            });
            return conn
        } catch (error) {
            console.log('err amqp', error)
        }
    }
}

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost/test', {})
    ],
    providers: [
        connAmqpProvider
    ],
    exports: [
        connAmqpProvider
    ]
})
export class ConfigModule { }