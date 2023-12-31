import { Inject, Injectable } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { User } from 'src/domain/entities/user.entity';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { UserUpdatedEvent } from 'src/domain/events/user.updated.event';
import { IPayloadPurchase } from 'src/domain/interfaces/payload.purchase.interface';
import { DAYS_OF_ACCESS } from 'src/domain/utils/values.const';
import { EventBroker } from '../broker/event.broker';
import { AdhesionRepository } from '../repositories/adhesion.repository';
import { UserRepository } from '../repositories/user.repository';
import { CourseHandler } from './courso.handler';

@Injectable()
export class CourseCancelHandler extends CourseHandler {

  constructor(
    @Inject(UserRepository) userRepository: UserRepository,
    @Inject(AdhesionRepository) adhesionRepository: AdhesionRepository,
    @Inject(EventBroker) eventBroker: EventBroker
  ) { super(userRepository, adhesionRepository, eventBroker) }

  @MessagePattern('CourseCancelledEvent')
  async cancel(@Ctx() context: RmqContext): Promise<void> {
    console.log('[canceled]')

    const { content } = context.getMessage()

    const payload: IPayloadPurchase = JSON.parse(content.toString());

    const user = await this.getUser(payload.email);

    await this.cancelAdhesion(payload, user);

    return;
  }

  private removeRole(user: User, role: RoleEnum) {
    if (user.roles.includes(role)) {
      const index = user.roles.indexOf(role);
      if (role == RoleEnum.PREMIUM_USER) {
        if(user.roles.length == 1) {
          user.roles.splice(index, 1);
        }
      } else {
        user.roles.splice(index, 1);
      }
    }
  }

  private async cancelAdhesion(payload: IPayloadPurchase, user: User) {
    const adhesion = await this.getAdhesion(payload, user)

    if (!adhesion._id) return;

    adhesion.status = 'CANCELLED';

    this.removeRole(user, payload.productRole);
    this.removeRole(user, RoleEnum.PREMIUM_USER);

    this.defineExpirationDate(user);

    await this.userRepository.save(user);

    await this.adhesionRepository.save(adhesion);

    await this.eventBroker.publish(new UserUpdatedEvent({
      email: user.email,
      userId: user._id,
      roles: user.roles
    }));

  }

  private defineExpirationDate(user: User) {
    if (user.expiration_date) {
      user.expiration_date.setDate(user.expiration_date.getDate() - DAYS_OF_ACCESS);
    }
  }
}
