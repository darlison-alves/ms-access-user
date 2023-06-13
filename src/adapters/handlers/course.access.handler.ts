import { Inject, Injectable } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { Adhesion } from 'src/domain/entities/adhesion.entity';
import { User } from 'src/domain/entities/user.entity';
import { RoleEnum } from 'src/domain/enums/role.enum';
import { IPayloadPurchase } from 'src/domain/interfaces/payload.purchase.interface';
import { DAYS_OF_ACCESS } from 'src/domain/utils/values.const';
import { AdhesionRepository } from '../repositories/adhesion.repository';
import { UserRepository } from '../repositories/user.repository';
import { CourseHandler } from './courso.handler';

@Injectable()
export class CourseAccessHandler extends CourseHandler {
  constructor(
    @Inject(UserRepository) userRepository: UserRepository,
    @Inject(AdhesionRepository) adhesionRepository: AdhesionRepository
  ) { super(userRepository, adhesionRepository) }

  @MessagePattern('CoursePurchasedEvent')
  async getHello(@Ctx() context: RmqContext): Promise<void> {
    const { content } = context.getMessage()

    const payload: IPayloadPurchase = JSON.parse(content.toString());

    const user = await this.getUser(payload.email);

    await this.createAdhesion(payload, user);

    return;
  }

  private addRole(user: User, role: RoleEnum) {
    if (!user.roles.includes(role)) {
      user.roles.push(role);
    }
  }

  private async createAdhesion(payload: IPayloadPurchase, user: User) {
    const adhesion = await this.getAdhesion(payload, user)

    this.addRole(user, payload.productRole);
    this.addRole(user, RoleEnum.PREMIUM_USER);

    this.defineExpirationDate(user);
    await this.userRepository.save(user);
    await this.adhesionRepository.save(adhesion);
  }

  private defineExpirationDate(user: User) {
    const now = new Date();
    now.setDate(now.getDate() + DAYS_OF_ACCESS);

    if (user.expiration_date) {
      user.expiration_date.setDate(user.expiration_date.getDate() + DAYS_OF_ACCESS);
    } else {
      user.expiration_date = now;
    }
  }
}
