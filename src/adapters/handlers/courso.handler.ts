import { Adhesion } from "src/domain/entities/adhesion.entity";
import { User } from "src/domain/entities/user.entity";
import { IPayloadPurchase } from "src/domain/interfaces/payload.purchase.interface";
import { EventBroker } from "../broker/event.broker";
import { AdhesionRepository } from "../repositories/adhesion.repository";
import { UserRepository } from "../repositories/user.repository";

export class CourseHandler {

    constructor(
        protected userRepository: UserRepository,
        protected adhesionRepository: AdhesionRepository,
        protected eventBroker: EventBroker
      ) { }

    protected async getUser(email: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);
        if (!user)
            return this.userRepository.save(User.of(email, []))
        return user;
    }

    protected async getAdhesion(payload: IPayloadPurchase, user: User): Promise<Adhesion> {
        const adhesion = await this.adhesionRepository.findByProductIdAndUserId(payload.productId, user._id, "ACTIVE");
        if (!adhesion)
            return Adhesion.of(payload, 'ACTIVE', user._id);
        return adhesion;
    }

}