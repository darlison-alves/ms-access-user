import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Schema } from "mongoose";
import { Adhesion } from "src/domain/entities/adhesion.entity";

@Injectable()
export class AdhesionRepository {
    constructor(@InjectModel(Adhesion.name) private adhesionModel: Model<Adhesion>) { }

    public async save(adhesion: Adhesion): Promise<Adhesion> {
        return this.adhesionModel.create(adhesion);
    }

    public async findByProductIdAndUserId(productId: string, userId: Schema.Types.ObjectId, status: string): Promise<Adhesion> {
        return this.adhesionModel.findOne({ productId, userId, status })
    }
}