import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/domain/entities/user.entity";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    public async save(user: User): Promise<User> {
        if(user._id) {
            await this.userModel.updateOne({ _id: user._id }, user);
        } else {
            return this.userModel.create(user);
        }
        return user;
    }

    public async findByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({ email })
        return user
    }
}