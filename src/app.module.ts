import { Module } from '@nestjs/common';
import { MongooseModule, SchemaFactory } from '@nestjs/mongoose';
import { EventBroker } from './adapters/broker/event.broker';
import { ConfigModule } from './adapters/config/config.module';
import { CourseAccessHandler } from './adapters/handlers/course.access.handler';
import { CourseCancelHandler } from './adapters/handlers/course.cancel.handler';
import { AdhesionRepository } from './adapters/repositories/adhesion.repository';
import { UserRepository } from './adapters/repositories/user.repository';
import { Adhesion } from './domain/entities/adhesion.entity';
import { User } from './domain/entities/user.entity';

@Module({
  imports: [ConfigModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: SchemaFactory.createForClass(User)
      },
      {
        name: Adhesion.name,
        schema: SchemaFactory.createForClass(Adhesion)
      },
    ])],
  controllers: [CourseAccessHandler, CourseCancelHandler],
  providers: [EventBroker, UserRepository, AdhesionRepository],
})
export class AppModule { }
