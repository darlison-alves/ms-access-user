import { Schema as SchemaMongo } from "mongoose"
import { Prop, Schema } from "@nestjs/mongoose";
import { RoleEnum } from "../enums/role.enum";
import { DAYS_OF_ACCESS } from "../utils/values.const";

@Schema()
export class User {

    @Prop({ _id: true, auto: true })
    _id: SchemaMongo.Types.ObjectId;

    @Prop({ unique: true })
    email: string;

    @Prop()
    roles: RoleEnum[];

    @Prop({ type: SchemaMongo.Types.Date })
    expiration_date: Date;

    static of(email: string, roles: RoleEnum[]): User {
        const user = new User;
        user.email = email;
        user.roles = roles
        return user;
    }

}