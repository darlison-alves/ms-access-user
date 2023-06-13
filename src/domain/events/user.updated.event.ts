import { RoleEnum } from "../enums/role.enum";
import { EventApplication } from "./event.application";

export class UserUpdatedEvent extends EventApplication {

    userId: string;
    email: string;
    roles: RoleEnum[];

    constructor(payload) {
        super(UserUpdatedEvent.name);
        this.email = payload.email;
        this.userId = payload.userId;
        this.roles = payload.roles;
    }
}